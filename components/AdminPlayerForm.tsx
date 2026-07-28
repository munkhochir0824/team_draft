"use client";

import { useState } from "react";
import type { Abilities, Player, Role } from "@/lib/types";
import { ROLES } from "@/lib/validate";
import StarRating from "./StarRating";

export interface PlayerFormValues {
  name: string;
  nickname: string;
  role: Role;
  avatarUrl: string;
  abilities: Abilities;
}

const DEFAULT_ABILITIES: Abilities = {
  aim: 3,
  gameSense: 3,
  positioning: 3,
  utility: 3,
  clutch: 3,
};

const ABILITY_FIELDS: { key: keyof Abilities; label: string }[] = [
  { key: "aim", label: "Aim" },
  { key: "gameSense", label: "Game Sense" },
  { key: "positioning", label: "Positioning" },
  { key: "utility", label: "Utility" },
  { key: "clutch", label: "Clutch" },
];

interface AdminPlayerFormProps {
  initial?: Player;
  onCancel: () => void;
  onSubmit: (values: PlayerFormValues) => Promise<void>;
}

export default function AdminPlayerForm({ initial, onCancel, onSubmit }: AdminPlayerFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [nickname, setNickname] = useState(initial?.nickname ?? "");
  const [role, setRole] = useState<Role>(initial?.role ?? "Rifler");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [abilities, setAbilities] = useState<Abilities>(initial?.abilities ?? DEFAULT_ABILITIES);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ name, nickname, role, avatarUrl, abilities });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="clip-corner w-full max-w-md border border-cs-border bg-cs-panel shadow-cs-card max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-cs-border px-5 py-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-cs-orange">
            {initial ? "Edit Player" : "Add Player"}
          </h2>
          <button type="button" onClick={onCancel} className="text-cs-muted hover:text-cs-text text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-cs-muted font-semibold">
              Real name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-cs-bg border border-cs-border px-3 py-2 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm normal-case font-normal tracking-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-cs-muted font-semibold">
              Nickname
              <input
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-cs-bg border border-cs-border px-3 py-2 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm normal-case font-normal tracking-normal"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-cs-muted font-semibold">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-cs-bg border border-cs-border px-3 py-2 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm normal-case font-normal tracking-normal"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-cs-muted font-semibold">
            Avatar URL (optional)
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className="bg-cs-bg border border-cs-border px-3 py-2 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm normal-case font-normal tracking-normal"
            />
          </label>

          <div className="flex flex-col gap-2 border-t border-cs-border pt-4">
            <p className="text-xs uppercase tracking-wider text-cs-muted font-semibold">Abilities</p>
            {ABILITY_FIELDS.map(({ key, label }) => (
              <StarRating
                key={key}
                label={label}
                value={abilities[key]}
                editable
                size="lg"
                onChange={(v) => setAbilities((prev) => ({ ...prev, [key]: v }))}
              />
            ))}
          </div>

          {error && <p className="text-sm text-cs-red">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 clip-corner-sm border border-cs-border py-2.5 text-sm font-semibold text-cs-text hover:border-cs-orange/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 clip-corner-sm bg-cs-orange text-cs-bg font-display font-bold uppercase tracking-wider py-2.5 hover:bg-cs-orange2 transition-colors disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save Player"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
