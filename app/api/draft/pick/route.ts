import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { DraftError, makePick } from "@/lib/draft";
import { getData, setData } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerId = String(body?.playerId ?? "");
    if (!playerId) return jsonError("playerId is required.", 400);

    const data = await getData();
    const updated = makePick(data, playerId);
    await setData(updated);

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof DraftError) return jsonError(err.message, 409);
    return jsonError("Failed to record pick.", 500);
  }
}
