"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/lib/types";
import PlayerCard from "./PlayerCard";
import AdminPlayerForm, { type PlayerFormValues } from "./AdminPlayerForm";

export default function AdminPanel() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/players", { cache: "no-store" });
    if (res.ok) setPlayers((await res.json()).players);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(values: PlayerFormValues) {
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "Failed to create player.");
    await refresh();
    setFormOpen(false);
  }

  async function handleUpdate(values: PlayerFormValues) {
    if (!editing) return;
    const res = await fetch(`/api/players/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "Failed to update player.");
    await refresh();
    setEditing(null);
  }

  async function handleDelete(player: Player) {
    if (!confirm(`Delete ${player.nickname}? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/players/${player.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to delete player.");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-cs-border bg-cs-panel/60 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-cs-text">
              PLAYER <span className="text-cs-orange text-shadow-glow">ROSTER</span>
            </h1>
            <p className="text-xs text-cs-muted tracking-wide">Manage player profiles &amp; ratings</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs font-semibold uppercase tracking-wider text-cs-muted hover:text-cs-orange transition-colors"
            >
              ← Draft Board
            </a>
            <button
              onClick={handleLogout}
              className="clip-corner-sm border border-cs-border px-3 py-2 text-sm font-semibold text-cs-text hover:border-cs-red/60 hover:text-cs-red transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="my-5 flex items-center justify-between gap-3">
          <p className="text-sm text-cs-muted">
            {players ? `${players.length} player${players.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="clip-corner-sm bg-cs-orange text-cs-bg font-display font-bold uppercase tracking-wider px-4 py-2.5 hover:bg-cs-orange2 transition-colors"
          >
            + Add Player
          </button>
        </div>

        {error && (
          <div className="mb-4 border border-cs-red/50 bg-cs-red/10 px-4 py-2 text-sm text-cs-red clip-corner-sm">
            {error}
          </div>
        )}

        {players && players.length === 0 && (
          <p className="text-cs-muted text-sm">No players yet. Add your first one above.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players?.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              footer={
                <div className="flex border-t border-cs-border">
                  <button
                    onClick={() => setEditing(player)}
                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-cs-muted hover:text-cs-orange transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(player)}
                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-cs-muted hover:text-cs-red transition-colors border-l border-cs-border"
                  >
                    Delete
                  </button>
                </div>
              }
            />
          ))}
        </div>
      </div>

      {formOpen && (
        <AdminPlayerForm onCancel={() => setFormOpen(false)} onSubmit={handleCreate} />
      )}
      {editing && (
        <AdminPlayerForm initial={editing} onCancel={() => setEditing(null)} onSubmit={handleUpdate} />
      )}
    </div>
  );
}
