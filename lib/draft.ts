import { ROSTER_SIZE, type AppData, type DraftState } from "./types";

export function totalPicks(teamCount: number): number {
  return teamCount * ROSTER_SIZE;
}

/** Active team ids for the current draft, in pick order (1..teamCount). */
export function activeTeamIds(teamCount: number): number[] {
  return Array.from({ length: teamCount }, (_, i) => i + 1);
}

/** Team on the clock for a given (0-based) pick index. Same-direction rotation each round. */
export function teamForPickIndex(pickIndex: number, teamCount: number): number {
  return (pickIndex % teamCount) + 1;
}

export function currentTeamId(draft: DraftState): number | null {
  if (draft.status !== "drafting") return null;
  if (draft.currentPickIndex >= totalPicks(draft.teamCount)) return null;
  return teamForPickIndex(draft.currentPickIndex, draft.teamCount);
}

export function draftIsComplete(draft: DraftState): boolean {
  return draft.currentPickIndex >= totalPicks(draft.teamCount);
}

export class DraftError extends Error {}

export function startDraft(data: AppData, teamCount: number): AppData {
  if (teamCount < 2 || teamCount > 4) {
    throw new DraftError("Team count must be between 2 and 4.");
  }
  if (data.draft.status === "drafting") {
    throw new DraftError("A draft is already in progress.");
  }

  return {
    ...data,
    players: data.players.map((p) => ({ ...p, teamId: null, pickNumber: null })),
    draft: {
      status: "drafting",
      teamCount,
      currentPickIndex: 0,
      picks: [],
      startedAt: Date.now(),
    },
  };
}

export function makePick(data: AppData, playerId: string): AppData {
  const { draft } = data;
  if (draft.status !== "drafting") {
    throw new DraftError("Draft is not currently in progress.");
  }
  if (draftIsComplete(draft)) {
    throw new DraftError("Draft is already complete.");
  }

  const player = data.players.find((p) => p.id === playerId);
  if (!player) throw new DraftError("Player not found.");
  if (player.teamId !== null) throw new DraftError("Player has already been drafted.");

  const teamId = teamForPickIndex(draft.currentPickIndex, draft.teamCount);
  const pickNumber = draft.currentPickIndex + 1;

  const players = data.players.map((p) =>
    p.id === playerId ? { ...p, teamId, pickNumber } : p
  );

  const nextIndex = draft.currentPickIndex + 1;
  const complete = nextIndex >= totalPicks(draft.teamCount);

  return {
    ...data,
    players,
    draft: {
      ...draft,
      currentPickIndex: nextIndex,
      picks: [...draft.picks, { pickNumber, teamId, playerId }],
      status: complete ? "complete" : "drafting",
    },
  };
}

export function resetDraft(data: AppData): AppData {
  return {
    ...data,
    players: data.players.map((p) => ({ ...p, teamId: null, pickNumber: null })),
    draft: {
      status: "idle",
      teamCount: data.draft.teamCount,
      currentPickIndex: 0,
      picks: [],
      startedAt: null,
    },
  };
}
