// SHIP·BREAKER high scores. GET → top 10. POST { initials, score, unlocked } → saved if plausible.
// Plausibility: 3 letters/digits, score within what one game can earn, unlocked ≤ projects, one entry per IP per 30s.
import { sql, ipOf } from "./_db.js";
import { work } from "../content/work.js";

const MAX = work.length * 100 + 60 * 50;            // every brick + a generous number of skill capsules
const BLOCK = new Set(["ASS", "FUK", "FUC", "SEX", "KKK", "NIG", "CUM", "DIK", "TIT", "FAG"]);
let ready = null;
const ensure = () => (ready ??= sql`create table if not exists px01_scores (id bigserial primary key, initials text not null, score int not null,
    unlocked int not null, ip text, created_at timestamptz not null default now())`.catch((e) => { ready = null; throw e; }));
const top = () => sql`select initials, score, unlocked from px01_scores order by score desc, created_at asc limit 10`;

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (!sql) return res.status(200).json({ scores: [], configured: false });
    try {
        await ensure();
        if (req.method === "GET") return res.status(200).json({ scores: await top() });
        if (req.method !== "POST") return res.status(405).end();
        const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
        const initials = String(b.initials || "").toUpperCase();
        const score = Math.floor(Number(b.score)), unlocked = Math.floor(Number(b.unlocked));
        if (!/^[A-Z0-9]{3}$/.test(initials) || BLOCK.has(initials)) return res.status(400).json({ error: "Three letters or digits." });
        if (!(score > 0 && score <= MAX) || !(unlocked >= 0 && unlocked <= work.length)) return res.status(400).json({ error: "That score doesn't add up." });
        const ip = ipOf(req);
        const [{ n }] = await sql`select count(*)::int as n from px01_scores where ip = ${ip} and created_at > now() - interval '30 seconds'`;
        if (n) return res.status(429).json({ error: "One score at a time." });
        await sql`insert into px01_scores (initials, score, unlocked, ip) values (${initials}, ${score}, ${unlocked}, ${ip})`;
        return res.status(200).json({ ok: true, scores: await top() });
    } catch {
        return res.status(200).json({ scores: [], error: "Scores are offline." });
    }
}
