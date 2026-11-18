import { work, inProduction } from "#content/work.js";

// One live-status check shared by home + worlds: /api/status (server-side, cached 5 min), or — when that's
// unavailable (local dev) — the visitor's browser pings each production site (no-cors, 5 s timeout, one retry).
// Resolves { sites: { [slug]: { ok, ms } }, checkedAt, from }. Cached 60 s so moving home → world doesn't re-probe.
const ping = async (url) => {
    for (let i = 0; i < 2; i++) {
        const t = performance.now();
        try {
            await fetch(url, { mode: "no-cors", cache: "no-store", signal: AbortSignal.timeout(5000) });
            return { ok: true, ms: Math.max(18, Math.round(performance.now() - t)) };
        } catch { /* one retry */ }
    }
    return { ok: false, ms: 0 };
};

const probe = async () => {
    const list = work.filter((w) => inProduction(w) && w.url);
    const sites = Object.fromEntries(await Promise.all(list.map(async (w) => [w.slug, await ping(w.url)])));
    return { sites, checkedAt: new Date().toISOString(), from: "browser" };
};

let cached = null, at = 0;
export const liveStatus = (fresh = false) => {
    if (fresh || !cached || Date.now() - at > 60000) {
        at = Date.now();
        cached = fetch("/api/status")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => (d?.sites && Object.keys(d.sites).length ? d : probe()))
            .catch(probe);
    }
    return cached;
};
