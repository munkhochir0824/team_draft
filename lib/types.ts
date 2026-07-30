export type Role =
  | "IGL"
  | "Entry Fragger"
  | "AWPer"
  | "Support"
  | "Lurker"
  | "Rifler";

export interface Abilities {
  aim: number; // 1-5, in 0.5 increments
  gameSense: number; // 1-5, in 0.5 increments
  positioning: number; // 1-5, in 0.5 increments
  utility: number; // 1-5, in 0.5 increments
  clutch: number; // 1-5, in 0.5 increments
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  role: Role;
  avatarUrl?: string;
  abilities: Abilities;
  teamId: number | null;
  pickNumber: number | null;
  createdAt: number;
}

export interface Team {
  id: number;
  name: string;
}

export type DraftStatus = "idle" | "drafting" | "complete";

export interface DraftPick {
  pickNumber: number;
  teamId: number;
  playerId: string;
}

export const ROSTER_SIZE = 5;

export interface DraftState {
  status: DraftStatus;
  teamCount: number; // 2-4
  currentPickIndex: number; // 0-based, next pick to be made
  picks: DraftPick[];
  startedAt: number | null;
}

export interface AppData {
  players: Player[];
  teams: Team[];
  draft: DraftState;
}
