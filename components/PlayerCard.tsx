import type { Player } from "@/lib/types";
import StarRating from "./StarRating";

const ROLE_STYLES: Record<string, string> = {
  IGL: "text-cs-gold border-cs-gold/40 bg-cs-gold/10",
  "Entry Fragger": "text-cs-red border-cs-red/40 bg-cs-red/10",
  AWPer: "text-cs-blue border-cs-blue/40 bg-cs-blue/10",
  Support: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  Lurker: "text-violet-400 border-violet-400/40 bg-violet-400/10",
  Rifler: "text-cs-orange border-cs-orange/40 bg-cs-orange/10",
};

const ABILITY_LABELS: { key: keyof Player["abilities"]; label: string }[] = [
  { key: "aim", label: "Aim" },
  { key: "gameSense", label: "Game Sense" },
  { key: "positioning", label: "Positioning" },
  { key: "utility", label: "Utility" },
  { key: "clutch", label: "Clutch" },
];

export function overallRating(player: Player): number {
  const { aim, gameSense, positioning, utility, clutch } = player.abilities;
  return Math.round(((aim + gameSense + positioning + utility + clutch) / 5) * 10) / 10;
}

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export default function PlayerCard({ player, compact = false, footer, className = "" }: PlayerCardProps) {
  const roleStyle = ROLE_STYLES[player.role] ?? ROLE_STYLES.Rifler;
  const overall = overallRating(player);

  return (
    <div
      className={`relative clip-corner border border-cs-border bg-gradient-to-b from-cs-panel2 to-cs-panel shadow-cs-card overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cs-orange/70 to-transparent" />

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="relative h-14 w-14 shrink-0 clip-corner-sm border border-cs-border bg-cs-bg flex items-center justify-center overflow-hidden">
            {player.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.avatarUrl} alt={player.nickname} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-xl font-bold text-cs-muted">
                {player.nickname.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold tracking-wide text-cs-text truncate">
                {player.nickname}
              </h3>
              <span className="shrink-0 font-display text-sm font-bold text-cs-orange">
                {overall.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-cs-muted truncate">{player.name}</p>
            <span
              className={`mt-1 inline-block rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${roleStyle}`}
            >
              {player.role}
            </span>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-col gap-1.5 border-t border-cs-border pt-3">
            {ABILITY_LABELS.map(({ key, label }) => (
              <StarRating key={key} value={player.abilities[key]} label={label} />
            ))}
          </div>
        )}
      </div>

      {footer}
    </div>
  );
}
