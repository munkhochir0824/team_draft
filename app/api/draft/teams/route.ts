import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { getData, setData } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const teams = body?.teams;
    if (!Array.isArray(teams)) return jsonError("teams array is required.", 400);

    const data = await getData();
    for (const t of teams) {
      const id = Number(t?.id);
      const name = String(t?.name ?? "").trim();
      const team = data.teams.find((team) => team.id === id);
      if (team && name) team.name = name;
    }
    await setData(data);

    return NextResponse.json({ teams: data.teams });
  } catch {
    return jsonError("Failed to update teams.", 500);
  }
}
