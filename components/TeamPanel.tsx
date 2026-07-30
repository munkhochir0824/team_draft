import { ROSTER_SIZE, type Player, type Team } from "@/lib/types";
import { teamColor } from "@/lib/team-colors";
import { overallRating } from "./PlayerCard";

interface TeamPanelProps {
  team: Team;
  players: Player[];
  onTheClock: boolean;
  showAverage?: boolean;
}

export default function TeamPanel({ team, players, onTheClock, showAverage = false }: TeamPanelProps) {
  const color = teamColor(team.id);
  const roster = [...players].sort((a, b) => (a.pickNumber ?? 0) - (b.pickNumber ?? 0));
  const emptySlots = Math.max(0, ROSTER_SIZE - roster.length);
  const avgRating =
    roster.length > 0 ? roster.reduce((sum, p) => sum + overallRating(p), 0) / roster.length : 0;

  return (
    <div
      className={`clip-corner border bg-cs-panel flex flex-col transition-shadow ${
        onTheClock ? `${color.border} ${color.glow}` : "border-cs-border"
      }`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b border-cs-border ${color.bg}`}>
        <h2 className={`font-display text-lg font-bold uppercase tracking-wider ${color.text}`}>
          {team.name}
        </h2>
        {onTheClock && (
          <span className={`text-[10px] font-bold uppercase tracking-widest ${color.text} animate-pulse`}>
            On the clock
          </span>
        )}
        {showAverage && (
          <span className="font-display text-xs font-bold text-cs-orange shrink-0">
            {avgRating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex flex-col divide-y divide-cs-border">
        {roster.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className={`font-display text-xs font-bold ${color.text} w-5 shrink-0`}>
              #{p.pickNumber}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-cs-text truncate">{p.nickname}</p>
              <p className="text-[11px] text-cs-muted truncate">{p.role}</p>
            </div>
            <span className="font-display text-xs font-bold text-cs-orange shrink-0">
              {overallRating(p).toFixed(1)}
            </span>
          </div>
        ))}

        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="flex items-center gap-3 px-4 py-2.5 opacity-40">
            <span className="font-display text-xs font-bold text-cs-muted w-5 shrink-0">
              #{roster.length + i + 1}
            </span>
            <p className="text-sm text-cs-muted italic">Empty slot</p>
          </div>
        ))}
      </div>
    </div>
  );
}
