import { Response } from "express";
import Redis from "ioredis";
import { logger } from "../../utils/logger";
import { env } from "../../config/env";
import { redisClient } from "../../config/redis";

const SSE_REDIS_CHANNEL = "sse:notifications";

class SSENotificationManager {
  private clients: Map<string, Set<Response>> = new Map();
  private subscriber: Redis | null = null;

  constructor() {
    this.initRedisSubscriber();
  }

  private initRedisSubscriber() {
    if (!env.redisUrl) return;

    try {
      this.subscriber = new Redis(env.redisUrl, {
        enableOfflineQueue: false,
        lazyConnect: false,
        retryStrategy: (times) => Math.min(1000 * 2 ** times, 30_000),
      });

      this.subscriber.on("connect", () => {
        logger.info("[SSE] Redis subscriber connected");
        this.subscriber?.subscribe(SSE_REDIS_CHANNEL, (err) => {
          if (err) {
            logger.error("[SSE] Failed to subscribe to channel", {
              error: err.message,
            });
          } else {
            logger.info(`[SSE] Subscribed to ${SSE_REDIS_CHANNEL}`);
          }
        });
      });

      this.subscriber.on("message", (channel, message) => {
        if (channel === SSE_REDIS_CHANNEL) {
          try {
            const { userId, data } = JSON.parse(message);
            if (userId && data) {
              this.deliverLocally(userId, data);
            }
          } catch (err) {
            logger.error("[SSE] Failed to parse message from Redis", { err });
          }
        }
      });

      this.subscriber.on("error", (err) => {
        logger.error("[SSE] Redis subscriber error", { message: err.message });
      });
    } catch (err: any) {
      logger.error("[SSE] Error initializing Redis subscriber", {
        message: err?.message,
      });
    }
  }

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
   * Send a real-time notification object to all active connections of a user.
   * If Redis is active, broadcasts over Redis pub/sub so that all API cluster replicas deliver it.
   * Otherwise gracefully falls back to local delivery.
   */
  async sendNotificationToUser(userId: string, data: any) {
    if (redisClient && redisClient.status === "ready") {
      try {
        await redisClient.publish(
          SSE_REDIS_CHANNEL,
          JSON.stringify({ userId, data }),
        );
        return;
      } catch (err) {
        logger.warn("[SSE] Redis publish failed — delivering locally", { err });
      }
    }

    // Direct local delivery fallback (e.g. Redis disabled/unreachable)
    this.deliverLocally(userId, data);
  }

  /**
   * Write SSE payload to all local response sockets connected to this user
   */
  private deliverLocally(userId: string, data: any) {
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

  async close() {
    if (this.subscriber) {
      try {
        await this.subscriber.quit();
      } catch {}
    }
  }
}

export const sseNotificationManager = new SSENotificationManager();
sseNotificationManager.initPingInterval();
