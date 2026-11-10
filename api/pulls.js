/* global process */
// Shared PX-01 pull counter (Vercel function). GET → { pulls }, POST → +1, at most once per IP every 4 s.
// Storage: Upstash Redis over REST. Vercel → Storage → Upstash adds KV_REST_API_URL / KV_REST_API_TOKEN.
// Without them it answers 501 and the page quietly keeps its local number.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "px01:pulls";

const redis = async (cmd) => {
    const r = await fetch(URL_, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(cmd) });
    if (!r.ok) throw new Error(`redis ${r.status}`);
    return (await r.json()).result;
};

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (!URL_ || !TOKEN) return res.status(501).json({ error: "counter not configured" });
    try {
        if (req.method === "POST") {
            const ip = String(req.headers["x-forwarded-for"] || "anon").split(",")[0].trim();
            const fresh = await redis(["SET", `px01:ip:${ip}`, "1", "EX", "4", "NX"]);   // crude rate limit
            const pulls = fresh === "OK" ? await redis(["INCR", KEY]) : await redis(["GET", KEY]);
            return res.status(200).json({ pulls: Number(pulls) || 0 });
        }
        if (req.method !== "GET") return res.status(405).end();
        return res.status(200).json({ pulls: Number(await redis(["GET", KEY])) || 0 });
    } catch {
        return res.status(502).json({ error: "counter unavailable" });
    }
}
