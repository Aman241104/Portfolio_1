/* global process */
// "Ask Aman": POST { q } or { jd } → grounded answer with numbered sources.
// With LLM_BASE_URL + LLM_API_KEY (+ LLM_MODEL) set (any OpenAI-compatible endpoint: Gemini, Groq, a hosted
// freellmapi…), a model answers ONLY from the retrieved chunks and cites them. Without a key, or if the model
// fails, it answers in retrieval mode: the best-matching facts themselves. Questions are logged to Neon (text only).
import { retrieve, chunks, SKILLS, PROFILE } from "./_kb.js";
import { sql, ipOf } from "./_db.js";

const hits = new Map();                                   // ponytail: per-instance rate limit; Neon/Upstash if abused
const limited = (ip) => { const now = Date.now(), h = (hits.get(ip) || []).filter((t) => now - t < 60000); h.push(now); hits.set(ip, h); return h.length > 12; };

const SYSTEM = `You are the assistant on ${PROFILE.name}'s portfolio site, answering recruiters and visitors.
Rules: answer ONLY from the numbered sources given. Cite sources inline like [1] or [2][4]. If the sources don't
contain the answer, say you don't know and suggest emailing ${PROFILE.email}. Never invent employers, dates, metrics,
salaries or skills. Refer to him as Aman, in the third person. Be concise: 2–5 sentences, or a short list.`;

const llm = async (messages) => {
    const base = process.env.LLM_BASE_URL, key = process.env.LLM_API_KEY;
    if (!base || !key) return null;
    const r = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
        method: "POST", signal: AbortSignal.timeout(25000),
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: process.env.LLM_MODEL || "gemini-2.0-flash", temperature: 0.2, max_tokens: 500, messages }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim() || null;
};

const ctx = (srcs) => srcs.map((c, i) => `[${i + 1}] ${c.title}: ${c.text}`).join("\n");
const cite = (srcs) => srcs.map((c, i) => ({ n: i + 1, title: c.title, url: c.url }));

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).end();
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const q = String(body.q || "").trim().slice(0, 500), jd = String(body.jd || "").trim().slice(0, 6000);
    if (!q && jd.length < 40) return res.status(400).json({ error: jd ? "Paste a bit more of the job description." : "Ask a question." });
    if (limited(ipOf(req))) return res.status(429).json({ error: "That's a lot of questions in a minute. Try again shortly." });

    let out;
    if (jd) {
        const low = jd.toLowerCase();
        const matched = SKILLS.filter((s) => low.includes(s.toLowerCase().replace(/\s*\(.*\)/, "")));
        const srcs = retrieve(jd, 8);
        const answer = await llm([{ role: "system", content: SYSTEM }, { role: "user", content:
            `Job description:\n${jd}\n\nSources:\n${ctx(srcs)}\n\nGive: (1) a one-line fit summary, (2) the strongest matching experience/projects with citations, (3) honest gaps (requirements the sources don't show). Under 170 words.` }]).catch(() => null);
        out = { mode: answer ? "ai" : "retrieval", answer, matched, sources: cite(srcs) };
    } else {
        const srcs = retrieve(q, 6);
        const answer = srcs.length ? await llm([{ role: "system", content: SYSTEM }, { role: "user", content: `Question: ${q}\n\nSources:\n${ctx(srcs)}` }]).catch(() => null) : null;
        out = { mode: answer ? "ai" : "retrieval", answer, sources: cite(srcs), facts: answer ? undefined : srcs.slice(0, 4).map((c) => c.text) };
    }
    if (sql) sql`create table if not exists px01_asks (id bigserial primary key, q text, kind text, mode text, created_at timestamptz default now())`
        .then(() => sql`insert into px01_asks (q, kind, mode) values (${(q || jd).slice(0, 500)}, ${jd ? "jd" : "q"}, ${out.mode})`).catch(() => {});
    return res.status(200).json({ ...out, total: chunks.length });
}
