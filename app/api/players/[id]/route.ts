import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { getData, setData } from "@/lib/store";
import { ValidationError, parsePlayerInput } from "@/lib/validate";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = await req.json();
    const input = parsePlayerInput(body);

    const data = await getData();
    const idx = data.players.findIndex((p) => p.id === id);
    if (idx === -1) return jsonError("Player not found.", 404);

    data.players[idx] = { ...data.players[idx], ...input };
    await setData(data);

    return NextResponse.json({ player: data.players[idx] });
  } catch (err) {
    if (err instanceof ValidationError) return jsonError(err.message, 422);
    return jsonError("Failed to update player.", 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const data = await getData();
  const idx = data.players.findIndex((p) => p.id === id);
  if (idx === -1) return jsonError("Player not found.", 404);

  data.players.splice(idx, 1);
  await setData(data);

  return NextResponse.json({ ok: true });
}
