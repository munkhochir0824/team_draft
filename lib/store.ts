import type { AppData } from "./types";

const DATA_KEY = "cs2-draft:data";

function defaultData(): AppData {
  return {
    players: [],
    teams: [1, 2, 3, 4].map((id) => ({ id, name: `Team ${id}` })),
    draft: {
      status: "idle",
      teamCount: 4,
      currentPickIndex: 0,
      picks: [],
      startedAt: null,
    },
  };
}

const hasKv = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

// Local, in-memory fallback so `next dev` works without a linked Vercel KV
// store. Data does not persist across server restarts in this mode.
const memoryStore: { data: AppData | null } = (globalThis as any)
  .__cs2DraftMemoryStore ?? { data: null };
(globalThis as any).__cs2DraftMemoryStore = memoryStore;

async function getKv() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getData(): Promise<AppData> {
  if (hasKv) {
    const kv = await getKv();
    const data = await kv.get<AppData>(DATA_KEY);
    if (data) return data;
    const fresh = defaultData();
    await kv.set(DATA_KEY, fresh);
    return fresh;
  }

  if (!memoryStore.data) {
    memoryStore.data = defaultData();
  }
  return memoryStore.data;
}

export async function setData(data: AppData): Promise<void> {
  if (hasKv) {
    const kv = await getKv();
    await kv.set(DATA_KEY, data);
    return;
  }
  memoryStore.data = data;
}

export const usingFallbackStore = !hasKv;
