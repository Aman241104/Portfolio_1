import { Fragment, useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work } from "../../../content/work.js";
import "./ask.css";

// World 6: ASK AMAN. A conversation instead of a page. Answers come only from the portfolio's own content
// (server-side retrieval in /api/ask), with numbered sources you can open. Recruiters can also paste a job
// description and see which skills and projects match. Without an LLM key it still works, showing the facts.
const SUGGEST = ["What has he built with AI?", "Which live sites does he maintain?", "Is he open to remote or hybrid work?", "What's his backend experience?", "Where did he study?", "Tell me about Job Search OS"];

// tiny renderer: **bold**, "- " lists, [n] citations → links to the source
const Rich = ({ text, sources }) => text.split(/\n+/).map((line, li) => {
    const list = /^\s*[-*•]\s+/.test(line), body = line.replace(/^\s*[-*•]\s+/, "").replace(/^\s*\d+[.)]\s+/, (m) => m);
    const parts = body.split(/(\*\*[^*]+\*\*|\[\d+\])/g).map((p, i) => {
        const c = p.match(/^\[(\d+)\]$/);
        if (c) { const s = sources[+c[1] - 1]; return s ? <a key={i} className="ask-cite" href={s.url} target="_blank" rel="noreferrer" title={s.title}>{c[1]}</a> : null; }
        if (/^\*\*/.test(p)) return <b key={i}>{p.slice(2, -2)}</b>;
        return <Fragment key={i}>{p}</Fragment>;
    });
    return list ? <li key={li}>{parts}</li> : <p key={li}>{parts}</p>;
});

const Answer = ({ a }) => {
    // reveal: words fade in quickly, like a reply being written (instant under reduced motion)
    const [n, setN] = useState(() => (matchMedia("(prefers-reduced-motion: reduce)").matches ? 1e9 : 0));
    const text = a.answer || "";
    useEffect(() => {
        if (!text || n >= text.length) return;
        const t = setTimeout(() => setN((x) => x + 6), 12);
        return () => clearTimeout(t);
    }, [n, text]);
    return (
        <article className="ask-a">
            {a.error && <p className="ask-err">{a.error}</p>}
            {a.matched && (
                <div className="ask-match">
                    <p className="ask-k">Skills in the job description that Aman has · {a.matched.length}</p>
                    <p className="ask-chips">{a.matched.length ? a.matched.map((m) => <span key={m}>{m}</span>) : <em>None matched by name. The sources below may still be relevant.</em>}</p>
                </div>
            )}
            {text && <div className="ask-text"><Rich text={text.slice(0, n)} sources={a.sources} />{n < text.length && <i className="ask-caret" />}</div>}
            {!text && a.facts?.length > 0 && (
                <div className="ask-text">
                    <p className="ask-k">From his portfolio</p>
                    <ul>{a.facts.map((f, i) => <li key={i}>{f} <a className="ask-cite" href={a.sources[i]?.url} target="_blank" rel="noreferrer">{i + 1}</a></li>)}</ul>
                </div>
            )}
            {!text && !a.facts?.length && !a.matched && !a.error && <p className="ask-text">Nothing in the portfolio answers that. Ask Aman directly: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
            {a.sources?.length > 0 && (
                <ol className="ask-src">
                    {a.sources.slice(0, 6).map((s) => <li key={s.n}><a href={s.url} target="_blank" rel="noreferrer"><b>{s.n}</b>{s.title}</a></li>)}
                </ol>
            )}
            {a.mode === "retrieval" && !a.error && <p className="ask-mode">Showing matching facts directly. The AI summary is off right now.</p>}
        </article>
    );
};

export default function AskWorld() {
    const [tab, setTab] = useState("ask");
    const [q, setQ] = useState("");
    const [jd, setJd] = useState("");
    const [thread, setThread] = useState([]);       // [{ q, a }]
    const [busy, setBusy] = useState(false);
    const end = useRef(null), input = useRef(null);
    useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [thread]);

    const send = async (payload, label) => {
        if (busy) return;
        setBusy(true);
        setThread((t) => [...t, { q: label, a: null }]);
        let a;
        try {
            const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            a = await r.json();
            if (!r.ok) a = { error: a.error || "Something went wrong. Email works too." };
        } catch { a = { error: "Can't reach the server. Email works too." }; }
        setThread((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, a } : x)));
        setBusy(false);
    };
    const ask = (text) => { const v = (text ?? q).trim(); if (!v) return; setQ(""); send({ q: v }, v); };
    const match = () => { const v = jd.trim(); if (v.length < 40) return; send({ jd: v }, `Job description · ${v.split(/\s+/).slice(0, 9).join(" ")}…`); };

    return (
        <div className="ask">
            <div className="ask-aura" aria-hidden><i /><i /><i /></div>
            <header className="ask-top">
                <p className="ask-mark">Ask <b>Aman</b></p>
                <nav className="ask-tabs" role="tablist" aria-label="Mode">
                    <button type="button" role="tab" aria-selected={tab === "ask"} onClick={() => setTab("ask")}>Ask</button>
                    <button type="button" role="tab" aria-selected={tab === "match"} onClick={() => setTab("match")}>Match a job</button>
                </nav>
                <a className="ask-cv" href={profile.resume} target="_blank" rel="noreferrer">Résumé ↓</a>
            </header>

            <main className="ask-main">
                {!thread.length && (
                    <section className="ask-intro">
                        <h1>{tab === "ask" ? <>Ask anything about<br />Aman's work.</> : <>Does Aman fit<br />your role?</>}</h1>
                        <p>{tab === "ask"
                            ? `Answers come only from his real portfolio: ${work.length} projects, his experience, skills and case studies. Every answer shows its sources.`
                            : "Paste a job description. You'll see the matching skills, his most relevant projects and experience, and honest gaps."}</p>
                    </section>
                )}

                <div className="ask-thread" aria-live="polite">
                    {thread.map((t, i) => (
                        <div key={i} className="ask-turn">
                            <p className="ask-q">{t.q}</p>
                            {t.a ? <Answer a={t.a} /> : <p className="ask-wait"><i /><i /><i /> <span>Reading his portfolio…</span></p>}
                        </div>
                    ))}
                    <div ref={end} />
                </div>

                {tab === "ask" ? (
                    <div className="ask-dock">
                        {!thread.length && <div className="ask-sugg">{SUGGEST.map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}</div>}
                        <form className="ask-box" onSubmit={(e) => { e.preventDefault(); ask(); }}>
                            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about projects, skills, experience…" maxLength={500} aria-label="Your question" autoComplete="off" />
                            <button type="submit" disabled={busy || !q.trim()} aria-label="Ask">↑</button>
                        </form>
                    </div>
                ) : (
                    <div className="ask-dock">
                        <form className="ask-box ask-jd" onSubmit={(e) => { e.preventDefault(); match(); }}>
                            <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={5} maxLength={6000} placeholder="Paste the job description here…" aria-label="Job description" />
                            <button type="submit" disabled={busy || jd.trim().length < 40}>Check the fit</button>
                        </form>
                    </div>
                )}
                <p className="ask-fine">Questions are logged anonymously so Aman can see what people ask. Prefer a human? <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
            </main>
        </div>
    );
}
