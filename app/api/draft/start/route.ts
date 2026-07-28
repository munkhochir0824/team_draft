import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { DraftError, startDraft } from "@/lib/draft";
import { getData, setData } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const teamCount = Number(body?.teamCount);

    const data = await getData();
    const updated = startDraft(data, teamCount);
    await setData(updated);

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof DraftError) return jsonError(err.message, 409);
    return jsonError("Failed to start draft.", 500);
  }
}
