"use client";

import { useState } from "react";
import type { DraftState, Team } from "@/lib/types";

interface SettingsModalProps {
  teams: Team[];
  draft: DraftState;
  onClose: () => void;
  onChanged: () => void;
}

export default function SettingsModal({ teams, draft, onClose, onChanged }: SettingsModalProps) {
  const [teamCount, setTeamCount] = useState(draft.teamCount);
  const [names, setNames] = useState<Record<number, string>>(
    Object.fromEntries(teams.map((t) => [t.id, t.name]))
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeIds = Array.from({ length: teamCount }, (_, i) => i + 1);

  async function saveNames() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/draft/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teams: activeIds.map((id) => ({ id, name: names[id] })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save.");
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function startDraft() {
    setBusy(true);
    setError(null);
    try {
      await saveNames();
      const res = await fetch("/api/draft/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamCount }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to start draft.");
      onChanged();
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function resetDraft() {
    if (!confirm("Reset the draft? All picks will be cleared and every player returned to the pool.")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/draft/reset", { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to reset draft.");
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const isDrafting = draft.status === "drafting";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="clip-corner w-full max-w-lg border border-cs-border bg-cs-panel shadow-cs-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-cs-border px-5 py-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-cs-orange">
            Draft Settings
          </h2>
          <button onClick={onClose} className="text-cs-muted hover:text-cs-text text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-cs-muted font-semibold mb-2">
              Number of teams
            </p>
            <div className="flex gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  disabled={isDrafting}
                  onClick={() => setTeamCount(n)}
                  className={`clip-corner-sm flex-1 border py-2 font-display font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    teamCount === n
                      ? "border-cs-orange bg-cs-orange/15 text-cs-orange"
                      : "border-cs-border text-cs-muted hover:border-cs-orange/50"
                  }`}
                >
                  {n} Teams
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-cs-muted font-semibold mb-2">
              Team names
            </p>
            <div className="flex flex-col gap-2">
              {activeIds.map((id) => (
                <input
                  key={id}
                  value={names[id] ?? `Team ${id}`}
                  onChange={(e) => setNames((prev) => ({ ...prev, [id]: e.target.value }))}
                  className="bg-cs-bg border border-cs-border px-3 py-2 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm"
                  placeholder={`Team ${id}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-cs-red">{error}</p>}

          <div className="flex flex-col gap-2 border-t border-cs-border pt-4">
            {isDrafting ? (
              <p className="text-xs text-cs-muted">
                A draft is currently in progress. Reset it to change team settings or start a new draft.
              </p>
            ) : (
              <button
                disabled={busy}
                onClick={startDraft}
                className="clip-corner-sm bg-cs-orange text-cs-bg font-display font-bold uppercase tracking-wider py-2.5 hover:bg-cs-orange2 transition-colors disabled:opacity-50"
              >
                {draft.status === "complete" ? "Start New Draft" : "Start Draft"}
              </button>
            )}
            <div className="flex gap-2">
              <button
                disabled={busy}
                onClick={saveNames}
                className="flex-1 clip-corner-sm border border-cs-border py-2 text-sm font-semibold text-cs-text hover:border-cs-orange/50 disabled:opacity-50"
              >
                Save Names
              </button>
              <button
                disabled={busy}
                onClick={resetDraft}
                className="flex-1 clip-corner-sm border border-cs-red/50 py-2 text-sm font-semibold text-cs-red hover:bg-cs-red/10 disabled:opacity-50"
              >
                Reset Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
