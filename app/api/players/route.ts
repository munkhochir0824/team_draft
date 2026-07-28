import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { newId } from "@/lib/id";
import { getData, setData } from "@/lib/store";
import type { Player } from "@/lib/types";
import { ValidationError, parsePlayerInput } from "@/lib/validate";

export async function GET() {
  const data = await getData();
  return NextResponse.json({ players: data.players });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const input = parsePlayerInput(body);

    const data = await getData();
    const player: Player = {
      id: newId(),
      ...input,
      teamId: null,
      pickNumber: null,
      createdAt: Date.now(),
    };
    data.players.push(player);
    await setData(data);

    return NextResponse.json({ player }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) return jsonError(err.message, 422);
    return jsonError("Failed to create player.", 500);
  }
}
