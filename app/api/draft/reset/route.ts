import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { resetDraft } from "@/lib/draft";
import { getData, setData } from "@/lib/store";

export async function POST() {
  try {
    const data = await getData();
    const updated = resetDraft(data);
    await setData(updated);
    return NextResponse.json(updated);
  } catch {
    return jsonError("Failed to reset draft.", 500);
  }
}
