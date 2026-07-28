"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Login failed.");
      }
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="clip-corner w-full max-w-sm border border-cs-border bg-cs-panel px-6 py-8 shadow-cs-card"
      >
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-cs-orange text-center mb-1">
          Admin Access
        </h1>
        <p className="text-center text-xs text-cs-muted mb-6">Enter the admin password to manage players</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-cs-bg border border-cs-border px-3 py-2.5 text-sm text-cs-text focus:border-cs-orange outline-none clip-corner-sm mb-3"
        />

        {error && <p className="text-sm text-cs-red mb-3">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="w-full clip-corner-sm bg-cs-orange text-cs-bg font-display font-bold uppercase tracking-wider py-2.5 hover:bg-cs-orange2 transition-colors disabled:opacity-50"
        >
          {busy ? "Checking…" : "Log In"}
        </button>

        <a
          href="/"
          className="block text-center mt-4 text-xs text-cs-muted hover:text-cs-orange transition-colors"
        >
          ← Back to draft board
        </a>
      </form>
    </div>
  );
}
