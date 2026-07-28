import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "cs2_admin_session";

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. Add it in your Vercel project settings or .env.local."
    );
  }
  return pw;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(candidate: string): boolean {
  return safeEqual(candidate, adminPassword());
}

/** Deterministic session token derived from the admin password, so no separate secret/storage is needed. */
export function sessionToken(): string {
  return createHmac("sha256", adminPassword()).update("cs2-admin-session").digest("hex");
}

export function isValidSession(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    return safeEqual(token, sessionToken());
  } catch {
    return false;
  }
}
