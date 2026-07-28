import type { Abilities, Player, Role } from "./types";

export const ROLES: Role[] = [
  "IGL",
  "Entry Fragger",
  "AWPer",
  "Support",
  "Lurker",
  "Rifler",
];

export class ValidationError extends Error {}

function num(v: unknown, field: string): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    throw new ValidationError(`${field} must be a whole number between 1 and 5.`);
  }
  return n;
}

export function parsePlayerInput(
  body: any
): Pick<Player, "name" | "nickname" | "role" | "avatarUrl" | "abilities"> {
  const name = String(body?.name ?? "").trim();
  const nickname = String(body?.nickname ?? "").trim();
  const role = String(body?.role ?? "") as Role;

  if (!name) throw new ValidationError("Player name is required.");
  if (!nickname) throw new ValidationError("Player nickname is required.");
  if (!ROLES.includes(role)) throw new ValidationError("Invalid role.");

  const abilitiesInput = body?.abilities ?? {};
  const abilities: Abilities = {
    aim: num(abilitiesInput.aim, "Aim"),
    gameSense: num(abilitiesInput.gameSense, "Game Sense"),
    positioning: num(abilitiesInput.positioning, "Positioning"),
    utility: num(abilitiesInput.utility, "Utility"),
    clutch: num(abilitiesInput.clutch, "Clutch"),
  };

  const avatarUrlRaw = body?.avatarUrl ? String(body.avatarUrl).trim() : "";
  const avatarUrl = avatarUrlRaw || undefined;

  return { name, nickname, role, avatarUrl, abilities };
}
