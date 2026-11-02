import type { ContactInput } from "@/lib/contact-schema";
import { API_BASE_URL, apiRequest } from "./client";

export type InquiryResult = {
  mode: "live" | "mock";
  referenceId?: string;
  message?: string;
};

/** True when API base URL is not configured */
export const isMockMode = !API_BASE_URL;

/**
 * Submit a contact inquiry.
 * Connects to Induplix Node.js backend POST /api/v1/public/contact
 * when VITE_API_BASE_URL is set, otherwise falls back gracefully to preview mode.
 */
export async function submitInquiry(data: ContactInput): Promise<InquiryResult> {
  if (isMockMode) {
    await new Promise((r) => setTimeout(r, 1100));
    return { mode: "mock" };
  }

  const res = await apiRequest<{
    success: boolean;
    message: string;
    receipt?: { referenceId: string; receivedAt: string };
  }>("/api/v1/public/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return {
    mode: "live",
    referenceId: res.receipt?.referenceId,
    message: res.message,
  };
}
