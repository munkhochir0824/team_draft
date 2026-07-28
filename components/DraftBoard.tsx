"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppData } from "@/lib/types";
import { currentTeamId, totalPicks } from "@/lib/draft";
import { teamColor } from "@/lib/team-colors";
import PlayerCard from "./PlayerCard";
import TeamPanel from "./TeamPanel";
import SettingsModal from "./SettingsModal";

export default function DraftBoard() {
  const [data, setData] = useState<AppData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/draft", { cache: "no-store" });
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [refresh]);

  const onClockTeamId = useMemo(() => (data ? currentTeamId(data.draft) : null), [data]);

  const availablePlayers = useMemo(() => {
    if (!data) return [];
    return data.players
      .filter((p) => p.teamId === null)
      .filter((p) =>
        search.trim()
          ? `${p.name} ${p.nickname}`.toLowerCase().includes(search.trim().toLowerCase())
          : true
      )
      .sort((a, b) => a.nickname.localeCompare(b.nickname));
  }, [data, search]);

  useEffect(() => {
    if (selectedId && data && !data.players.some((p) => p.id === selectedId && p.teamId === null)) {
      setSelectedId(null);
    }
  }, [data, selectedId]);

  async function confirmPick() {
    if (!selectedId) return;
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch("/api/draft/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: selectedId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to draft player.");
      setData(body);
      setSelectedId(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConfirming(false);
    }
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-display text-cs-muted animate-pulse">Loading draft board…</p>
      </div>
    );
  }

  const { draft } = data;
  const activeTeams = data.teams.filter((t) => t.id <= draft.teamCount);
  const total = totalPicks(draft.teamCount);
  const clockColor = onClockTeamId ? teamColor(onClockTeamId) : null;

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-cs-border bg-cs-panel/60 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-cs-text">
              CS<span className="text-cs-orange text-shadow-glow">2</span> TEAM DRAFT
            </h1>
            <p className="text-xs text-cs-muted tracking-wide">Build your rosters, pick by pick</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-cs-muted hover:text-cs-orange transition-colors"
            >
              Admin
            </a>
            <button
              onClick={() => setSettingsOpen(true)}
              className="clip-corner-sm border border-cs-border px-3 py-2 text-sm font-semibold text-cs-text hover:border-cs-orange/60 hover:text-cs-orange transition-colors"
            >
              ⚙ Settings
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="my-5 clip-corner border border-cs-border bg-cs-panel px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          {draft.status === "idle" && (
            <p className="font-display font-semibold text-cs-muted uppercase tracking-wider">
              Draft not started — open Settings to configure teams and start.
            </p>
          )}
          {draft.status === "drafting" && clockColor && onClockTeamId && (
            <p className="font-display text-lg font-bold uppercase tracking-wider">
              Pick {draft.currentPickIndex + 1} of {total} —{" "}
              <span className={clockColor.text}>
                {data.teams.find((t) => t.id === onClockTeamId)?.name}
              </span>{" "}
              is on the clock
            </p>
          )}
          {draft.status === "complete" && (
            <p className="font-display text-lg font-bold uppercase tracking-wider text-cs-orange">
              Draft complete — good luck out there.
            </p>
          )}
          <div className="w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players…"
              className="w-full bg-cs-bg border border-cs-border px-3 py-2 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 border border-cs-red/50 bg-cs-red/10 px-4 py-2 text-sm text-cs-red clip-corner-sm">
            {error}
          </div>
        )}

        <div
          className="grid gap-4 mb-8"
          style={{ gridTemplateColumns: `repeat(${Math.min(activeTeams.length, 4)}, minmax(0, 1fr))` }}
        >
          {activeTeams.map((team) => (
            <TeamPanel
              key={team.id}
              team={team}
              players={data.players.filter((p) => p.teamId === team.id)}
              onTheClock={onClockTeamId === team.id}
            />
          ))}
        </div>

        <h2 className="font-display text-xl font-bold uppercase tracking-wider text-cs-text mb-4">
          Available Players{" "}
          <span className="text-cs-muted text-sm font-normal">({availablePlayers.length})</span>
        </h2>

        {availablePlayers.length === 0 && (
          <p className="text-cs-muted text-sm">
            No players available. Add some from the{" "}
            <a href="/admin" className="text-cs-orange hover:underline">
              admin page
            </a>
            .
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availablePlayers.map((player) => {
            const selected = selectedId === player.id;
            const canPick = draft.status === "drafting";
            return (
              <div
                key={player.id}
                role="button"
                tabIndex={canPick ? 0 : -1}
                aria-disabled={!canPick}
                aria-pressed={selected}
                onClick={() => canPick && setSelectedId(selected ? null : player.id)}
                onKeyDown={(e) => {
                  if (canPick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setSelectedId(selected ? null : player.id);
                  }
                }}
                className={`text-left transition-transform ${
                  canPick ? "cursor-pointer" : "cursor-not-allowed"
                } ${selected ? "scale-[1.02]" : "hover:scale-[1.015]"}`}
              >
                <PlayerCard
                  player={player}
                  className={selected ? "border-cs-orange animate-pulse-glow" : ""}
                  footer={
                    selected ? (
                      <div
                        className="flex border-t border-cs-orange/40 animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          disabled={confirming}
                          onClick={() => setSelectedId(null)}
                          className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-cs-muted hover:text-cs-text transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={confirming}
                          onClick={confirmPick}
                          className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider bg-cs-orange text-cs-bg hover:bg-cs-orange2 transition-colors disabled:opacity-50"
                        >
                          {confirming ? "Confirming…" : "Confirm Pick"}
                        </button>
                      </div>
                    ) : (
                      <div className="border-t border-cs-border px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-cs-muted">
                        {canPick ? "Click to choose" : "Draft not active"}
                      </div>
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {settingsOpen && (
        <SettingsModal
          teams={data.teams}
          draft={draft}
          onClose={() => setSettingsOpen(false)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
