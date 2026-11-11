import { Fragment, useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work } from "../../../content/work.js";
import { useFonts } from "../fonts.js";
import "./ask.css";

// World 6: THE REFERENCE DESK. Ask about Aman and the answer comes back typed on an index card, footnoted to the
// real portfolio content it came from (/api/ask retrieves from content/, an LLM writes only from those sources).
// Questions are handwritten in the same red ink as the signature on the home page. Paste a job description and the
// result card gets a rubber stamp with the skills that match.
const FONTS = ["Hanken+Grotesk:wght@400;500;600;700", "Courier+Prime:ital,wght@0,400;0,700;1,400"];
const DRAWER = [
    ["AI", "What has he built with AI?"], ["Live", "Which live sites does he maintain?"], ["Backend", "What's his backend experience?"],
    ["Work", "Where does he work now?"], ["School", "Where did he study?"], ["Hire", "Is he open to on-site or hybrid work?"],
];
const tilt = (i) => [-1.2, 0.8, -0.4, 1.3, -0.9, 0.5][i % 6];

// **bold**, "- " list lines, [n] → footnote superscripts
const Typed = ({ text, sources }) => text.replace(/\s+(\[\d+\])/g, "$1").split(/\n+/).map((line, li) => {   // footnotes hug their word
    const list = /^\s*[-*•]\s+/.test(line), body = line.replace(/^\s*[-*•]\s+/, "");
    const parts = body.split(/(\*\*[^*]+\*\*|\[\d+\])/g).map((p, i, arr) => {
        const c = p.match(/^\[(\d+)\]$/);
        if (c) {
            const s = sources[+c[1] - 1];
            const after = /^\[\d+\]$/.test(arr[i - 2] || "") && arr[i - 1] === "";   // a run like [2][4] reads ²˒⁴, never ²⁴
            return s ? <sup key={i}>{after && "˒"}<a href={s.url} target="_blank" rel="noreferrer" title={s.title}>{c[1]}</a></sup> : null;
        }
        if (/^\*\*/.test(p)) return <b key={i}>{p.slice(2, -2)}</b>;
        return <Fragment key={i}>{p}</Fragment>;
    });
    return list ? <p key={li} className="rd-li">— {parts}</p> : <p key={li}>{parts}</p>;
});

const Card = ({ turn, i }) => {
    const a = turn.a;
    const full = a?.answer || (a?.facts?.length ? a.facts.map((f, k) => `- ${f} [${k + 1}]`).join("\n") : "");
    const [n, setN] = useState(() => (matchMedia("(prefers-reduced-motion: reduce)").matches ? 1e9 : 0));
    useEffect(() => {
        if (!full || n >= full.length) return;
        // the typewriter has a rhythm: a few characters a tick, a beat at commas, a longer one at full stops and line ends
        const ch = full[n - 1] || "";
        const wait = ch === "\n" ? 120 : /[.!?]/.test(ch) ? 90 : /[,;:]/.test(ch) ? 45 : 12 + Math.random() * 10;
        const t = setTimeout(() => setN((x) => x + (wait > 30 ? 1 : 3)), wait);
        return () => clearTimeout(t);
    }, [n, full]);
    return (
        <article className="rd-turn" style={{ "--t": `${tilt(i)}deg` }}>
            <p className="rd-q">{turn.q}</p>
            <div className="rd-card" data-busy={!a || undefined}>
                <header className="rd-card-head"><span>No. {String(i + 1).padStart(3, "0")}</span><span>{turn.kind === "jd" ? "Fit check" : "Reference"}</span></header>
                {!a && <p className="rd-typing">Pulling the file<span>.</span><span>.</span><span>.</span></p>}
                {a?.matched && (
                    <div className="rd-stamp" aria-label={`${a.matched.length} matching skills`}>
                        <b>FIT</b><span>{a.matched.length} skills matched</span>
                    </div>
                )}
                {a?.matched?.length > 0 && <p className="rd-matched">{a.matched.join(" · ")}</p>}
                {a?.error && <p className="rd-err">{a.error} <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
                {full && <div className="rd-body" aria-hidden={n < full.length || undefined}><Typed text={full.slice(0, n)} sources={a.sources} />{n < full.length && <i className="rd-caret" />}</div>}
                {a && !full && !a.error && !a.matched && <p className="rd-body">Nothing in the file answers that. Ask Aman directly: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
                {a?.sources?.length > 0 && n >= full.length && (
                    <ol className="rd-notes">
                        {a.sources.slice(0, 6).map((s) => <li key={s.n}><sup>{s.n}</sup> <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}
                    </ol>
                )}
                {a?.mode === "retrieval" && !a.error && n >= full.length && <p className="rd-mode">Typed straight from the file. The written summary is offline right now.</p>}
            </div>
        </article>
    );
};

export default function ReferenceDesk() {
    useFonts(FONTS);
    const [tab, setTab] = useState("ask");
    const [q, setQ] = useState("");
    const [jd, setJd] = useState("");
    const [thread, setThread] = useState([]);
    const [busy, setBusy] = useState(false);
    const end = useRef(null);
    useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [thread]);

    const send = async (payload, label, kind) => {
        if (busy) return;
        setBusy(true);
        setThread((t) => [...t, { q: label, kind, a: null }]);
        let a;
        try {
            // never leave someone watching "pulling the file…" for half a minute: give up after 15 s
            const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
            a = await r.json();
            if (!r.ok) a = { error: a.error || "The desk is busy. Email works too." };
        } catch { a = { error: "Can't reach the desk right now. Ask again in a moment, or write to him:" }; }
        setThread((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, a } : x)));
        setBusy(false);
    };
    const ask = (text) => { const v = (text ?? q).trim(); if (!v) return; setQ(""); send({ q: v }, v, "q"); };
    const match = () => { const v = jd.trim(); if (v.length < 40) return; send({ jd: v }, `Does he fit this role? “${v.split(/\s+/).slice(0, 8).join(" ")}…”`, "jd"); };

    return (
        <div className="rd">
            <header className="rd-top">
                <p className="rd-mark">The Reference Desk <span>· on Aman Patel</span></p>
                <nav className="rd-tabs" role="tablist" aria-label="Mode">
                    <button type="button" role="tab" aria-selected={tab === "ask"} onClick={() => setTab("ask")}>Ask a question</button>
                    <button type="button" role="tab" aria-selected={tab === "match"} onClick={() => setTab("match")}>Check a job</button>
                </nav>
                <a className="rd-tag" href={profile.resume} target="_blank" rel="noreferrer">Résumé, PDF</a>
            </header>

            <div className="rd-desk">
                <aside className="rd-drawer" aria-label="Suggested questions">
                    <p className="rd-drawer-label">Card catalogue</p>
                    {DRAWER.map(([tag, text], i) => (
                        <button key={tag} type="button" className="rd-file" style={{ "--d": `${380 + i * 70}ms`, "--r": `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }} onClick={() => { setTab("ask"); ask(text); }} disabled={busy}>
                            <span className="rd-file-tab">{tag}</span><span className="rd-file-q">{text}</span>
                        </button>
                    ))}
                </aside>

                <main className="rd-main">
                    {!thread.length && (
                        <section className="rd-intro">
                            <p className="rd-who">Aman Patel · Full-stack engineer · Ahmedabad · open to on-site or hybrid roles</p>
                            <h1>{tab === "ask" ? "Ask about Aman. The answer comes with its references." : "Paste a job. See what fits."}</h1>
                            <p>{tab === "ask"
                                ? `Every answer is typed from his own file: ${work.length} projects, his experience, skills and case studies, footnoted so you can check it.`
                                : "Matching skills get stamped, the closest projects and experience are footnoted, and gaps are named honestly when the summary is on."}</p>
                            {tab === "ask" && <button type="button" className="rd-switch" onClick={() => setTab("match")}>Hiring? Paste your job description and see the fit →</button>}
                        </section>
                    )}
                    <div className="rd-thread" aria-live="polite" aria-busy={busy || undefined}>
                        {thread.map((t, i) => <Card key={i} turn={t} i={i} />)}
                        <div ref={end} />
                    </div>

                    {tab === "ask" ? (
                        <form className="rd-write" onSubmit={(e) => { e.preventDefault(); ask(); }}>
                            <label htmlFor="rd-q" className="rd-write-label">Your question</label>
                            <input id="rd-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="write it here…" maxLength={500} autoComplete="off" />
                            <button type="submit" disabled={busy || !q.trim()}>Ask</button>
                        </form>
                    ) : (
                        <form className="rd-write rd-folder" onSubmit={(e) => { e.preventDefault(); match(); }}>
                            <label htmlFor="rd-jd" className="rd-write-label">Job description</label>
                            <textarea id="rd-jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={6} maxLength={6000} placeholder="Paste the role here…" />
                            <button type="submit" disabled={busy || jd.trim().length < 40}>Check the fit</button>
                        </form>
                    )}
                    <p className="rd-fine">Questions are kept, without names, so Aman can see what people ask. Rather talk to him? <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
                </main>
            </div>
        </div>
    );
}
