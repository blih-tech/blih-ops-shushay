import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import prisma from "../../config/prisma";

export interface InitializeChapaPayload {
  amount: number;
  currency: string;
  email: string;
  firstName?: string;
  lastName?: string;
  txRef: string;
  callbackUrl?: string;
  returnUrl?: string;
  title?: string;
  description?: string;
}

export interface ChapaInitResponse {
  checkoutUrl: string;
}

export interface ChapaVerifyResponse {
  txRef: string;
  amount: number;
  currency: string;
  status: string; // 'success', 'failed', etc.
  chapaRef?: string;
  rawResponse?: any;
}

export class ChapaService {
  private get baseUrl(): string {
    return env.chapa.apiUrl || "https://api.chapa.co/v1";
  }

  private get secretKey(): string {
    return env.chapa.secretKey;
  }

  /**
   * Initializes a payment checkout session with Chapa.
   */
  async initializePayment(payload: InitializeChapaPayload): Promise<ChapaInitResponse> {
    if (!this.secretKey || this.secretKey === "mock-secret-key") {
      // Mock mode for local test environment without real key
      const redirectUrl = payload.returnUrl || `${env.skillsWebUrl}/checkout/return?tx_ref=${payload.txRef}`;
      const finalUrl = redirectUrl.includes("tx_ref=")
        ? redirectUrl
        : `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}tx_ref=${payload.txRef}`;
      return {
        checkoutUrl: finalUrl,
      };
    }


    const isLocalhostCallback =
      payload.callbackUrl?.includes("localhost") ||
      payload.callbackUrl?.includes("127.0.0.1");

    const bodyData: Record<string, any> = {
      amount: payload.amount.toString(),
      currency: payload.currency,
      email: payload.email,
      first_name: payload.firstName || "Learner",
      last_name: payload.lastName || "User",
      tx_ref: payload.txRef,
      return_url: payload.returnUrl,
      "customization[title]": payload.title || "Blih Skills Access",
      "customization[description]":
        payload.description || "Permanent access to all Blih Skills courses",
    };

    if (payload.callbackUrl && !isLocalhostCallback) {
      bodyData.callback_url = payload.callbackUrl;
    }

    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });


      const data = (await response.json()) as any;

      if (!response.ok || data.status !== "success" || !data.data?.checkout_url) {
        throw new AppError(
          502,
          `Chapa initialization failed: ${data.message || response.statusText}`,
        );
      }

      return {
        checkoutUrl: data.data.checkout_url,
      };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(502, `Failed to connect to payment gateway: ${err.message}`);
    }
  }

  /**
   * Verifies transaction status directly with Chapa API server-side.
   */
  async verifyPayment(txRef: string): Promise<ChapaVerifyResponse> {
    if (!this.secretKey || this.secretKey === "mock-secret-key") {
      // Mock verification mode for test environment
      const tx = await prisma.paymentTransaction.findUnique({
        where: { txRef },
        select: { amount: true, currency: true },
      });
      return {
        txRef,
        amount: tx?.amount ?? 1000,
        currency: tx?.currency ?? "ETB",
        status: "success",
        chapaRef: `CHAPA-${txRef}`,
        rawResponse: { mock: true },
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${txRef}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        return {
          txRef,
          amount: 0,
          currency: "",
          status: "failed",
          rawResponse: data,
        };
      }

      const verifyData = data.data || {};
      const isTestMode =
        verifyData.mode === "test" || this.secretKey.startsWith("CHASECK_TEST-");

      const finalStatus =
        isTestMode && data.status === "success"
          ? "success"
          : (verifyData.status || data.status || "").toLowerCase();

      return {
        txRef: verifyData.tx_ref || txRef,
        amount: parseFloat(verifyData.amount ?? (isTestMode ? 1000 : 0)),
        currency: verifyData.currency || "ETB",
        status: finalStatus,
        chapaRef: verifyData.reference || verifyData.trans_id || `CHAPA-${txRef}`,
        rawResponse: data,
      };

    } catch (err: any) {
      throw new AppError(502, `Failed to verify payment with gateway: ${err.message}`);
    }
  }

  /**
   * Verifies Chapa HMAC SHA-256 webhook signature header.
   */
  verifyWebhookSignature(rawBody: string | object, signature: string | undefined): boolean {
    if (!signature || !this.secretKey) return false;
    try {
      const payloadString = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
      const expectedSignature = require("crypto")
        .createHmac("sha256", this.secretKey)
        .update(payloadString)
        .digest("hex");
      return require("crypto").timingSafeEqual(
        Buffer.from(signature.trim()),
        Buffer.from(expectedSignature.trim()),
      );
    } catch {
      return false;
    }
  }
}

export const chapaService = new ChapaService();

