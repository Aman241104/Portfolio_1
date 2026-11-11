/* global process */
// "Ask Aman": POST { q } or { jd } → grounded answer with numbered sources.
// A model answers ONLY from the retrieved chunks and cites them, through a fallback chain: Groq → NVIDIA NIM →
// Gemini (GROQ_API_KEY, NVIDIA_API_KEY, LLM_API_KEY). If none answers in time it falls back to retrieval mode:
// the best-matching facts themselves. Questions are logged to Neon (text only).
import { retrieve, chunks, SKILLS, PROFILE } from "./_kb.js";
import { sql, ipOf } from "./_db.js";

const hits = new Map();                                   // ponytail: per-instance rate limit; Neon/Upstash if abused
const limited = (ip) => { const now = Date.now(), h = (hits.get(ip) || []).filter((t) => now - t < 60000); h.push(now); hits.set(ip, h); return h.length > 12; };

const SYSTEM = `You are the assistant on ${PROFILE.name}'s portfolio site, answering recruiters and visitors.
Rules: answer ONLY from the numbered sources given. Cite sources inline like [1] or [2][4]. If the sources don't
contain the answer, say you don't know and suggest emailing ${PROFILE.email}. Never invent employers, dates, metrics,
salaries or skills. Refer to him as Aman, in the third person. Be concise: 2–5 sentences, or a short list.`;

// Providers, fastest first. Each is any OpenAI-compatible endpoint; a provider is skipped when its key isn't set.
// On a timeout, 429 or 5xx the next one takes over; the whole chain has a hard budget so a visitor never waits long.
const PROVIDERS = [                                     // models re-checked 2026-11-11 (older Llama ids were retired)
    { id: "groq", key: "GROQ_API_KEY", base: "https://api.groq.com/openai/v1", model: process.env.GROQ_MODEL || "openai/gpt-oss-120b", ms: 8000 },
    { id: "groq-qwen", key: "GROQ_API_KEY", base: "https://api.groq.com/openai/v1", model: "qwen/qwen3.8-27b", ms: 6000 },
    { id: "nvidia", key: "NVIDIA_API_KEY", base: "https://integrate.api.nvidia.com/v1", model: process.env.NVIDIA_MODEL || "nvidia/nemotron-3.5-lightning-30b-a3b", ms: 7000 },
    { id: "gemini", key: "LLM_API_KEY", base: process.env.LLM_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai", model: process.env.LLM_MODEL && !/2\.0/.test(process.env.LLM_MODEL) ? process.env.LLM_MODEL : "gemini-3.5-flash-lite", ms: 12000 },   // lite: ~1.4s; the full flash models "think" for 30s+
];
const BUDGET = 32000;

const llm = async (messages) => {
    const t0 = Date.now();
    for (const p of PROVIDERS) {
        const key = process.env[p.key];
        if (!key || /YOUR_|PASTE/.test(key)) continue;                     // unset, or a placeholder left in by mistake
        const left = BUDGET - (Date.now() - t0);
        if (left < 2500) break;
        try {
            const r = await fetch(`${p.base.replace(/\/$/, "")}/chat/completions`, {
                method: "POST", signal: AbortSignal.timeout(Math.min(p.ms, left)),
                headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: p.model, temperature: 0.2, max_tokens: 700, messages }),
            });
            if (!r.ok) continue;                                            // 401/429/5xx → next provider
            const j = await r.json();
            const text = j.choices?.[0]?.message?.content?.replace(/[\u2010\u2011]/g, "-").replace(/[\u202f\u00a0]/g, " ").trim();   // typewriter-safe
            if (text) return { text, via: p.id, ms: Date.now() - t0 };
        } catch { /* timeout or network → next provider */ }
    }
    return null;
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
        out = { mode: answer ? "ai" : "retrieval", answer: answer?.text || null, via: answer?.via, matched, sources: cite(srcs) };
    } else {
        const srcs = retrieve(q, 6);
        const answer = srcs.length ? await llm([{ role: "system", content: SYSTEM }, { role: "user", content: `Question: ${q}\n\nSources:\n${ctx(srcs)}` }]).catch(() => null) : null;
        out = { mode: answer ? "ai" : "retrieval", answer: answer?.text || null, via: answer?.via, sources: cite(srcs), facts: answer ? undefined : srcs.slice(0, 4).map((c) => c.text) };
    }
    if (sql) sql`create table if not exists px01_asks (id bigserial primary key, q text, kind text, mode text, created_at timestamptz default now())`
        .then(() => sql`insert into px01_asks (q, kind, mode) values (${(q || jd).slice(0, 500)}, ${jd ? "jd" : "q"}, ${out.via || out.mode})`).catch(() => {});
    return res.status(200).json({ ...out, total: chunks.length });
}
