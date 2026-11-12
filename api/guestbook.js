// The 2001 world's real hit counter and guestbook (Neon).
// GET → { hits, entries } (approved entries only, newest first).
// POST { hit: true } → counts a visit (the client sends it once per browser per day) → { hits }.
// POST { name, message, homepage? } → saved as NOT approved; it appears once Aman approves it in Neon:
//   update px01_guestbook set approved = true where id = …;
import { sql, ipOf } from "./_db.js";

const HITS_ID = 2001;   // its own row in the shared px01_counter table
let ready = null;
const ensure = () => (ready ??= Promise.all([
    sql`create table if not exists px01_counter (id int primary key, pulls bigint not null default 0)`,
    sql`create table if not exists px01_guestbook (id bigserial primary key, name text not null, message text not null,
        homepage text, ip text, approved boolean not null default false, created_at timestamptz not null default now())`,
]).catch((e) => { ready = null; throw e; }));

const clean = (s, n) => String(s || "").replace(/[<>]/g, " ").replace(/\p{Cc}/gu, " ").replace(/\s+/g, " ").trim().slice(0, n);

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (!sql) return res.status(503).json({ error: "The guestbook is offline." });
    try {
        await ensure();
        if (req.method === "GET") {
            const [[c], entries] = await Promise.all([
                sql`select pulls from px01_counter where id = ${HITS_ID}`,
                sql`select name, message, homepage, created_at from px01_guestbook where approved order by created_at desc limit 40`,
            ]);
            return res.status(200).json({ hits: Number(c?.pulls || 0), entries });
        }
        if (req.method !== "POST") return res.status(405).end();
        let b;
        try { b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}; } catch { return res.status(400).json({ error: "Bad request." }); }
        if (b.hit) {
            const [r] = await sql`insert into px01_counter (id, pulls) values (${HITS_ID}, 1)
                on conflict (id) do update set pulls = px01_counter.pulls + 1 returning pulls`;
            return res.status(200).json({ hits: Number(r.pulls) });
        }
        const name = clean(b.name, 40), message = clean(b.message, 400);
        const homepage = /^https?:\/\/[^\s]{3,120}$/.test(String(b.homepage || "")) ? String(b.homepage) : null;
        if (name.length < 1 || message.length < 2) return res.status(400).json({ error: "Please write your name and a message." });
        const ip = ipOf(req);
        const [{ n }] = await sql`select count(*)::int as n from px01_guestbook where ip = ${ip} and created_at > now() - interval '60 seconds'`;
        if (n) return res.status(429).json({ error: "One entry a minute, please!" });
        await sql`insert into px01_guestbook (name, message, homepage, ip) values (${name}, ${message}, ${homepage}, ${ip})`;
        return res.status(200).json({ ok: true, pending: true });
    } catch {
        return res.status(503).json({ error: "The guestbook is offline." });
    }
}
