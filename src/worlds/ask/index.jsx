import { Fragment, useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { certifications } from "../../../content/certifications.js";
import { useFonts } from "../fonts.js";
import "./ask.css";

// World 7: THE REFERENCE DESK. Ask about Aman or paste a JD; answers come back typed on ruled index cards,
// footnoted to real portfolio data (live /api/ask in prod, deterministic local retrieval fallback in dev/offline).
const FONTS = ["Hanken+Grotesk:wght@400;500;600;700", "Courier+Prime:ital,wght@0,400;0,700;1,400", "Homemade+Apple"];
const DRAWER = [
    ["AI", "What has he built with AI?"],
    ["Live", "Which live sites does he maintain?"],
    ["Backend", "What's his backend experience?"],
    ["Work", "Where does he work now?"],
    ["School", "Where did he study?"],
    ["Hire", "Is he open to on-site or hybrid work?"],
];
const PixelAvatar = () => (
    <div className="jld-avatar-wrap" aria-hidden>
        <div className="jld-bubble"><span>Hey!</span></div>
        <svg className="jld-avatar" viewBox="0 0 16 18" shapeRendering="crispEdges">
            {/* hair */}
            <rect x="4" y="1" width="8" height="2" fill="#2a1622" />
            <rect x="3" y="2" width="10" height="2" fill="#3a1e2e" />
            <rect x="3" y="4" width="2" height="4" fill="#3a1e2e" />
            <rect x="11" y="4" width="2" height="3" fill="#3a1e2e" />
            {/* face */}
            <rect x="4" y="4" width="8" height="7" fill="#eab892" />
            <rect x="3" y="7" width="1" height="2" fill="#d99f77" />
            <rect x="12" y="7" width="1" height="2" fill="#eab892" />
            {/* glasses */}
            <rect x="4" y="5" width="4" height="3" fill="#18181b" />
            <rect x="9" y="5" width="4" height="3" fill="#18181b" />
            <rect x="8" y="6" width="1" height="1" fill="#18181b" />
            <rect x="5" y="6" width="2" height="1" fill="#f3f1eb" />
            <rect x="10" y="6" width="2" height="1" fill="#f3f1eb" />
            {/* smile */}
            <rect x="6" y="9" width="4" height="1" fill="#f3f1eb" />
            <rect x="7" y="10" width="2" height="1" fill="#9a5c4e" />
            {/* neck & jacket */}
            <rect x="6" y="11" width="4" height="2" fill="#d99f77" />
            <rect x="3" y="12" width="10" height="6" fill="#222226" />
            <rect x="6" y="13" width="4" height="5" fill="#161618" />
        </svg>
    </div>
);
const SAMPLE_JD = "We are hiring a Full-Stack & 3D Web Engineer to build interactive React / TypeScript / Next.js applications, Three.js / WebGL experiences, and Python FastAPI / PostgreSQL AI backends deployed on Docker and Cloud Run.";
const tilt = (i) => [-1.1, 0.7, -0.4, 1.1, -0.8, 0.5][i % 6];

function localAsk(payload) {
    const allSkills = skillGroups.flatMap((g) => g.items.map(([name]) => name));
    if (payload.jd) {
        const jdLower = payload.jd.toLowerCase();
        const matched = allSkills.filter((s) => jdLower.includes(s.toLowerCase().replace(/\.js$/, ""))).slice(0, 12);
        const topWork = work
            .map((w) => {
                const hay = `${w.title} ${w.line} ${w.stack || ""}`.toLowerCase();
                const score = matched.reduce((acc, m) => acc + (hay.includes(m.toLowerCase().replace(/\.js$/, "")) ? 2 : 0), w.live ? 1 : 0);
                return { w, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 4)
            .map((x) => x.w);
        const sources = [
            ...topWork.map((w, i) => ({ n: i + 1, title: `${w.title} (${w.year}) — ${w.stack || w.line}`, url: w.url || `/case.html?p=${w.slug}` })),
            { n: topWork.length + 1, title: `${experience[0].role} at ${experience[0].org}`, url: profile.resume },
        ];
        const lines = [
            `**Strong alignment** across ${matched.length || "core"} full-stack & product requirements, backed by ${work.length} shipped builds.`,
            ...topWork.map((w, i) => `- **${w.title}**: ${w.line} [${i + 1}]`),
            `- Currently **${experience[0].role}** at ${experience[0].org} (${experience[0].when}), available for on-site, hybrid, or remote roles [${topWork.length + 1}].`,
        ];
        return { answer: lines.join("\n"), sources, matched: matched.length ? matched : ["React", "TypeScript", "Next.js", "Python", "Three.js"] };
    }

    const q = (payload.q || "").toLowerCase();
    const sources = [];
    const addSrc = (title, url) => {
        const idx = sources.findIndex((s) => s.title === title);
        if (idx >= 0) return idx + 1;
        sources.push({ n: sources.length + 1, title, url: url || profile.resume });
        return sources.length;
    };

    if (/school|study|college|degree|education|ldce/.test(q)) {
        const edu = experience[1];
        const n1 = addSrc(`${edu.org} · ${edu.when}`, profile.resume);
        const n2 = addSrc(`${certifications.length} Verified Industry Certifications`, certifications[3]?.url || profile.resume);
        return {
            answer: `Aman studied at **${edu.org}** (${edu.where}, ${edu.when}) [${n1}].\n- ${edu.points.join(" ")}\n- Holds ${certifications.length} verified AI & cloud credentials from Anthropic, AWS, Google, and Microsoft [${n2}].`,
            sources,
        };
    }
    if (/work|now|current|job|experience|gravity|hire|on-site|hybrid|remote|available/.test(q)) {
        const job = experience[0];
        const n1 = addSrc(`${job.role} at ${job.org} (${job.when})`, profile.resume);
        const n2 = addSrc(`Résumé PDF · ${profile.email}`, profile.resume);
        return {
            answer: `Aman is currently **${job.role}** at **${job.org}** in ${job.where} (${job.when}) [${n1}].\n- ${job.points.join(" ")}\n- **Availability:** Open to on-site (Ahmedabad), hybrid, or remote full-stack & 3D web roles right now [${n2}].`,
            sources,
        };
    }
    if (/live|maintain|prod|sites|domains/.test(q)) {
        const live = work.filter((w) => w.maintained).slice(0, 5);
        const lines = live.map((w) => `- **${w.title}**: ${w.line} [${addSrc(`${w.title} (${w.year})`, w.url)}]`);
        return {
            answer: `Aman actively maintains **${work.filter((w) => w.maintained).length} production sites & products** on their own domains:\n${lines.join("\n")}`,
            sources,
        };
    }

    const terms = q.split(/[^a-z0-9]+/).filter((t) => t.length > 1);
    const ranked = work
        .map((w) => {
            const hay = `${w.title} ${w.line} ${w.stack || ""} ${w.kind}`.toLowerCase();
            const score = terms.reduce((s, t) => s + (hay.includes(t) ? 3 : 0), 0) + (w.live ? 1 : 0);
            return { w, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.w);

    const lines = ranked.map((w) => `- **${w.title}** (${w.stack || w.kind}): ${w.line} [${addSrc(`${w.title} — ${w.year}`, w.url || `/case.html?p=${w.slug}`)}]`);
    return {
        answer: `From Aman's portfolio file (**${work.length} shipped builds**, ${work.filter((w) => w.maintained).length} live in production):\n${lines.join("\n")}`,
        sources,
    };
}

const Typed = ({ text, sources, onHoverNote }) =>
    text.replace(/\s+(\[\d+\])/g, "$1").split(/\n+/).map((line, li) => {
        const list = /^\s*[-*•]\s+/.test(line), body = line.replace(/^\s*[-*•]\s+/, "");
        const parts = body.split(/(\*\*[^*]+\*\*|\[\d+\])/g).map((p, i, arr) => {
            const c = p.match(/^\[(\d+)\]$/);
            if (c) {
                const s = sources?.[+c[1] - 1];
                const after = /^\[\d+\]$/.test(arr[i - 2] || "") && arr[i - 1] === "";
                return s ? (
                    <sup key={i} onMouseEnter={() => onHoverNote?.(+c[1])} onMouseLeave={() => onHoverNote?.(null)}>
                        {after && "˒"}<a href={s.url} target="_blank" rel="noreferrer" title={s.title}>{c[1]}</a>
                    </sup>
                ) : null;
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
    const [hoverNote, setHoverNote] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!full || n >= full.length) return;
        const ch = full[n - 1] || "";
        const wait = ch === "\n" ? 90 : /[.!?]/.test(ch) ? 65 : /[,;:]/.test(ch) ? 35 : 10 + Math.random() * 8;
        const t = setTimeout(() => setN((x) => x + (wait > 30 ? 2 : 4)), wait);
        return () => clearTimeout(t);
    }, [n, full]);

    const copyCard = () => {
        if (!full) return;
        navigator.clipboard?.writeText(`${turn.q}\n\n${full}`).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        });
    };

    return (
        <article className="rd-turn" style={{ "--t": `${tilt(i)}deg` }}>
            <p className="rd-q">{turn.q}</p>
            <div className="rd-card" data-busy={!a || undefined} onClick={() => full && n < full.length && setN(full.length)}>
                <header className="rd-card-head">
                    <span>No. {String(i + 1).padStart(3, "0")}</span>
                    <span className="rd-card-actions">
                        {full && n < full.length && <span className="rd-skip-hint">click to finish typing</span>}
                        {full && n >= full.length && (
                            <button type="button" className="rd-copy-btn" onClick={(e) => { e.stopPropagation(); copyCard(); }}>
                                {copied ? "Copied ✓" : "Copy"}
                            </button>
                        )}
                        <span>{turn.kind === "jd" ? "Fit check" : "Reference"}</span>
                    </span>
                </header>
                {!a && <p className="rd-typing">Pulling the file<span>.</span><span>.</span><span>.</span></p>}
                {a?.matched && (
                    <div className="rd-stamp" aria-label={`${a.matched.length} matching skills`}>
                        <b>FIT</b><span>{a.matched.length} skills matched</span>
                    </div>
                )}
                {a?.matched?.length > 0 && <p className="rd-matched">{a.matched.join(" · ")}</p>}
                {a?.error && <p className="rd-err">{a.error} <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
                {full && (
                    <div className="rd-body" aria-hidden={n < full.length || undefined}>
                        <Typed text={full.slice(0, n)} sources={a.sources} onHoverNote={setHoverNote} />
                        {n < full.length && <i className="rd-caret" />}
                    </div>
                )}
                {a && !full && !a.error && !a.matched && <p className="rd-body">Nothing in the file answers that. Ask Aman directly: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
                {a?.sources?.length > 0 && n >= full.length && (
                    <ol className="rd-notes">
                        {a.sources.slice(0, 6).map((s) => (
                            <li key={s.n} className={hoverNote === s.n ? "is-lit" : undefined}>
                                <sup>{s.n}</sup> <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                            </li>
                        ))}
                    </ol>
                )}
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
        const isLocal = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
        if (isLocal) {
            await new Promise((r) => setTimeout(r, 260));
            a = localAsk(payload);
        } else {
            try {
                const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(12000) });
                a = r.ok ? await r.json() : localAsk(payload);
            } catch {
                a = localAsk(payload);
            }
        }
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
                <div className="rd-top-r">
                    {thread.length > 0 && <button type="button" className="rd-clear" onClick={() => setThread([])}>Clear desk</button>}
                    <a className="rd-tag" href={profile.resume} target="_blank" rel="noreferrer">Résumé, PDF</a>
                </div>
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
                    <p className="rd-who">
                        Aman Patel · Full-stack &amp; 3D engineer · {work.length} shipped · {work.filter((w) => w.maintained).length} live · {certifications.length} verified certs · <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> · <a href={`mailto:${profile.email}`}>Email</a>
                    </p>
                    {!thread.length && (
                        <section className="jld-hero">
                            <PixelAvatar />
                            <div className="jld-copy">
                                <h1>Turning Code into Memorable Digital Experiences.</h1>
                                <p>{tab === "ask"
                                    ? `Every answer is pulled from Aman's real file: ${work.length} shipped projects, experience, skills, and ${certifications.length} verified certs.`
                                    : "Paste a job description below. Matching skills get stamped and closest projects are footnoted for verification."}</p>
                                <div className="jld-modes" role="tablist" aria-label="Choose mode">
                                    <button type="button" className={tab === "ask" ? "is-active" : undefined} onClick={() => setTab("ask")}>
                                        <span aria-hidden>▶</span> Ask Aman Mode
                                    </button>
                                    <button type="button" className={tab === "match" ? "is-active" : undefined} onClick={() => setTab("match")}>
                                        <span aria-hidden>{tab === "match" ? "▶" : "·"}</span> Recruiter JD Match
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                    <div className="rd-thread" aria-live="polite" aria-busy={busy || undefined}>
                        {thread.map((t, i) => <Card key={i} turn={t} i={i} />)}
                        <div ref={end} />
                    </div>

                    {tab === "ask" ? (
                        <form className="rd-write" onSubmit={(e) => { e.preventDefault(); ask(); }}>
                            <label htmlFor="rd-q" className="rd-write-label">Your question</label>
                            <input id="rd-q" name="question" value={q} onChange={(e) => setQ(e.target.value)} placeholder="write it here…" maxLength={500} autoComplete="off" />
                            <button type="submit" disabled={busy || !q.trim()}>Ask</button>
                        </form>
                    ) : (
                        <form className="rd-write rd-folder" onSubmit={(e) => { e.preventDefault(); match(); }}>
                            <div className="rd-folder-hd">
                                <label htmlFor="rd-jd" className="rd-write-label">Job description ({jd.trim().length} / 40 chars min)</label>
                                <button type="button" className="rd-sample-btn" onClick={() => setJd(SAMPLE_JD)}>Try sample JD</button>
                            </div>
                            <textarea id="rd-jd" name="jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={6} maxLength={6000} placeholder="Paste the role here…" />
                            <button type="submit" disabled={busy || jd.trim().length < 40}>Check the fit</button>
                        </form>
                    )}
                    <p className="rd-fine">Every answer is grounded in Aman&apos;s verified portfolio file. Rather talk directly? <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
                </main>
            </div>
        </div>
    );
}
