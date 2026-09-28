import { Response } from "express";
import { logger } from "../../utils/logger";

class SSENotificationManager {
  private clients: Map<string, Set<Response>> = new Map();

  /**
   * Register an SSE client connection for an authenticated user
   */
  addClient(userId: string, res: Response) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(res);

    logger.debug(
      `[SSE] Client connected for user ${userId}. Total active connections for user: ${this.clients.get(userId)!.size}`,
    );
  }

  /**
   * Remove an SSE client connection on disconnect
   */
  removeClient(userId: string, res: Response) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(res);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
    logger.debug(`[SSE] Client disconnected for user ${userId}`);
  }

  /**
   * Send a real-time notification object to all active connections of a user
   */
  sendNotificationToUser(userId: string, data: any) {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) return;

    const payload = `data: ${JSON.stringify(data)}\n\n`;

    for (const res of userClients) {
      try {
        res.write(payload);
      } catch (err) {
        logger.error(`[SSE] Error writing to stream for user ${userId}:`, {
          error: String(err),
        });
        this.removeClient(userId, res);
      }
    }
  }

  /**
   * Periodic keep-alive ping interval (every 25s) to keep connections alive through proxies
   */
  initPingInterval() {
    const timer = setInterval(() => {
      const pingPayload = `: ping\n\n`;
      for (const [userId, userClients] of this.clients.entries()) {
        for (const res of userClients) {
          try {
            res.write(pingPayload);
          } catch {
            this.removeClient(userId, res);
          }
        }
      }
    }, 25000);
    if (timer.unref) {
      timer.unref();
    }
  }
}

export const sseNotificationManager = new SSENotificationManager();
sseNotificationManager.initPingInterval();
