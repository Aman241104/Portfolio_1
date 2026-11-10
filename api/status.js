// Uptime for the "Live & maintained" list, checked server-side (Vercel, Singapore) so visitors' ad-blockers,
// privacy extensions or a site's cold start can't show false "down" dots. Cached 5 min at the edge.
import { work } from "../content/work.js";

const check = async (url) => {
    for (let attempt = 0; attempt < 2; attempt++) {                // one retry: cold starts are common on free tiers
        const t = Date.now();
        try {
            const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(12000), headers: { "User-Agent": "aman-patel.me status check" } });
            if (r.status < 500) return { ok: true, ms: Date.now() - t, code: r.status };
        } catch { /* retry */ }
    }
    return { ok: false };
};

export default async function handler(req, res) {
    const sites = work.filter((w) => w.maintained);
    const results = await Promise.all(sites.map(async (w) => [w.slug, await check(w.url)]));
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=900");
    res.status(200).json({ checkedAt: new Date().toISOString(), from: process.env.VERCEL_REGION || "local", sites: Object.fromEntries(results) });
}
