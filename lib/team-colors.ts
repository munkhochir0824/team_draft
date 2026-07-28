export interface TeamColor {
  text: string;
  border: string;
  bg: string;
  glow: string;
  ring: string;
}

export const TEAM_COLORS: Record<number, TeamColor> = {
  1: {
    text: "text-cs-orange",
    border: "border-cs-orange/50",
    bg: "bg-cs-orange/10",
    glow: "shadow-[0_0_20px_rgba(240,168,60,0.35)]",
    ring: "ring-cs-orange",
  },
  2: {
    text: "text-cs-blue",
    border: "border-cs-blue/50",
    bg: "bg-cs-blue/10",
    glow: "shadow-[0_0_20px_rgba(79,157,222,0.35)]",
    ring: "ring-cs-blue",
  },
  3: {
    text: "text-cs-red",
    border: "border-cs-red/50",
    bg: "bg-cs-red/10",
    glow: "shadow-[0_0_20px_rgba(225,75,75,0.35)]",
    ring: "ring-cs-red",
  },
  4: {
    text: "text-violet-400",
    border: "border-violet-400/50",
    bg: "bg-violet-400/10",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.35)]",
    ring: "ring-violet-400",
  },
};

export function teamColor(id: number): TeamColor {
  return TEAM_COLORS[id] ?? TEAM_COLORS[1];
}
