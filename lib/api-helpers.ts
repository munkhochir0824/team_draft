import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "./auth";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(token)) {
    return jsonError("Admin authentication required.", 401);
  }
  return null;
}
