// Shared PX-01 pull counter. GET → { pulls }, POST → +1 (at most once per IP every 4 s). Neon via ./_db.js.
// Not connected yet → { pulls: null } and the page quietly keeps its own number.
import { sql, ensure, ipOf } from "./_db.js";

const read = async () => (await sql`select pulls from px01_counter where id = 1`)[0]?.pulls ?? 0;

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (!sql) return res.status(200).json({ pulls: null, configured: false });
    try {
        await ensure();
        if (req.method === "POST") {
            const fresh = await sql`insert into px01_hits (ip, at) values (${ipOf(req)}, now())
                on conflict (ip) do update set at = now() where px01_hits.at < now() - interval '4 seconds' returning 1`;
            if (!fresh.length) return res.status(200).json({ pulls: Number(await read()) });
            const [row] = await sql`insert into px01_counter (id, pulls) values (1, 1)
                on conflict (id) do update set pulls = px01_counter.pulls + 1 returning pulls`;
            return res.status(200).json({ pulls: Number(row.pulls) });
        }
        if (req.method !== "GET") return res.status(405).end();
        return res.status(200).json({ pulls: Number(await read()) });
    } catch {
        return res.status(200).json({ pulls: null, error: "counter unavailable" });
    }
}
