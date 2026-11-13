import { Fragment, useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work, KINDS, shot, status } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { worlds } from "#worlds/registry.js";
import { useFonts } from "../fonts.js";
import { track } from "../../analytics.js";
import "./y2001.css";

// World 9: 2001, "Under construction, forever". A sincere 1999–2001 personal homepage: starfield tiles, marquees,
// blinking NEW!, 88x31 buttons, a real hit counter and a real (moderated) guestbook. All art is drawn here in CSS/SVG.
// The joke: it is semantic, keyboard friendly and fast underneath. Arrival "downloads over 56k": sections paint in
// top to bottom while the status bar fills, pictures resolve from chunky pixels, the odometer rolls to the real count.
const FONTS = ["Comic+Neue:wght@400;700"];
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const SECTIONS = 9;
const GB_KEY = "px01-y2001-guestbook-v1";
const SEED_BOOK = {
    hits: 1428,
    entries: [
        { name: "xX_CyberSurfer_Xx", homepage: "", created_at: "2001-08-14T10:00:00Z", message: "cool starfield!! signed ur guestbook, check out my angelfire page!!" },
        { name: "Recruiter_2026", homepage: "", created_at: "2026-10-19T14:30:00Z", message: "Came for the 2001 nostalgia, stayed for the 26 shipped projects." },
    ],
};
const isLocalDev = () => typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
function readLocalBook() {
    try {
        const raw = localStorage.getItem(GB_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* private mode */ }
    return { ...SEED_BOOK, entries: [...SEED_BOOK.entries] };
}
function writeLocalBook(data) {
    try { localStorage.setItem(GB_KEY, JSON.stringify(data)); } catch { /* private mode */ }
}

// A picture that loads like it's 2001: a 16 px copy blown up with hard pixels first, then the real one.
function Pic({ w, width, alt = "" }) {
    const [ok, setOk] = useState(reduced);
    return (
        <span className="y-pic" data-ok={ok || undefined} style={{ "--w": `${width}px` }}>
            {!reduced && <img className="y-pic-lo" src={shot(w, 16)} alt="" aria-hidden />}
            <img className="y-pic-hi" src={shot(w, width * 2)} alt={alt} onLoad={() => setTimeout(() => setOk(true), 180 + Math.random() * 320)} onError={() => setOk(true)} />
        </span>
    );
}

// The odometer: one strip of 0–9 per digit, rolled to the real count.
const Odo = ({ n }) => {
    const val = n ?? 0;
    return (
        <span className="y-odo" role="img" aria-label={`${val} visitors`}>
            {String(val).padStart(6, "0").split("").map((d, i) => (
                <span key={i} className="y-odo-d" aria-hidden><span style={{ "--d": +d, "--k": i }}>{"0123456789".split("").map((x) => <i key={x}>{x}</i>)}</span></span>
            ))}
        </span>
    );
};

// Cursor sparkles, the most 2001 thing there is (mouse only, never with reduced motion).
function useSparkles(root) {
    useEffect(() => {
        const el = root.current;
        if (reduced || !el || !matchMedia("(pointer: fine)").matches) return;
        let last = 0;
        const move = (e) => {
            const t = performance.now();
            if (t - last < 45) return;
            last = t;
            const s = document.createElement("i");
            s.className = "y-spark";
            s.textContent = "✦";
            s.style.left = `${e.clientX}px`; s.style.top = `${e.clientY}px`;
            s.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
            s.style.color = ["#ffff00", "#00ffff", "#ff66ff", "#00ff00"][Math.floor(Math.random() * 4)];
            el.appendChild(s);
            s.addEventListener("animationend", () => s.remove());
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
    }, [root]);
}

export default function Y2001({ shell }) {
    useFonts(FONTS);
    const root = useRef(null);
    useSparkles(root);
    const [loaded, setLoaded] = useState(reduced ? SECTIONS : 0);   // how many sections have "downloaded"
    const [hits, setHits] = useState(() => readLocalBook().hits);
    const [book, setBook] = useState(() => ({ entries: readLocalBook().entries, state: "ok" }));
    const [form, setForm] = useState({ name: "", message: "", homepage: "" });
    const [sent, setSent] = useState(null);
    const [filter, setFilter] = useState("all");

    // the 56k download: one section every ~260 ms; any click or key finishes it ("Stop" also works)
    useEffect(() => {
        if (loaded >= SECTIONS) return;
        const t = setTimeout(() => setLoaded((n) => n + 1), loaded === 0 ? 350 : 260);
        return () => clearTimeout(t);
    }, [loaded]);
    useEffect(() => {
        const done = () => setLoaded(SECTIONS);
        addEventListener("keydown", done, { once: true });
        return () => removeEventListener("keydown", done);
    }, []);

    useEffect(() => {
        let day = "";
        try { day = localStorage.getItem("px01-y2001-hit") || ""; } catch { /* private mode */ }
        const today = new Date().toISOString().slice(0, 10);
        if (isLocalDev()) {
            const lb = readLocalBook();
            if (day !== today) {
                lb.hits = (lb.hits || SEED_BOOK.hits) + 1;
                writeLocalBook(lb);
                try { localStorage.setItem("px01-y2001-hit", today); } catch { /* ignore */ }
            }
            setHits(lb.hits);
            setBook({ entries: lb.entries || [], state: "ok" });
            return;
        }
        const count = day !== today
            ? fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hit: true }) })
                .then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => { try { localStorage.setItem("px01-y2001-hit", today); } catch { /* ignore */ } return d; })
            : Promise.resolve(null);
        count.catch(() => null).then(() => fetch("/api/guestbook")).then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => { setHits(d.hits); setBook({ entries: d.entries || [], state: "ok" }); })
            .catch(() => {
                const lb = readLocalBook();
                setHits(lb.hits);
                setBook({ entries: lb.entries || [], state: "ok" });
            });
    }, []);

    const sign = async (e) => {
        e.preventDefault();
        setSent({ state: "sending" });
        const saveLocal = () => {
            const lb = readLocalBook();
            const entry = { name: form.name.trim(), message: form.message.trim(), homepage: form.homepage.trim(), created_at: new Date().toISOString() };
            lb.entries = [entry, ...(lb.entries || [])].slice(0, 20);
            writeLocalBook(lb);
            setBook({ entries: lb.entries, state: "ok" });
            setSent({ state: "ok" });
            setForm({ name: "", message: "", homepage: "" });
            track("guestbook_signed");
        };
        if (isLocalDev()) { saveLocal(); return; }
        try {
            const r = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(d.error || "Local save");
            setSent({ state: "ok" }); setForm({ name: "", message: "", homepage: "" });
            track("guestbook_signed");
        } catch { saveLocal(); }
    };

    const ring = worlds.filter((w) => !w.beta || w.id === "y2001");
    const me = ring.findIndex((w) => w.id === "y2001");
    const hop = (d) => shell?.go(ring[(me + d + ring.length) % ring.length].id);
    const shown = (i) => (i < loaded ? "" : undefined);
    const live = work.filter((w) => w.live);
    const filteredWork = filter === "all" ? work : filter === "live" ? live : work.filter((w) => w.kind === filter);
    const job = experience[0], edu = experience[1];

    return (
        <div ref={root} className="y2k" onPointerDown={() => loaded < SECTIONS && setLoaded(SECTIONS)}>
            <p className="y-fast">
                <a href="?style=editorial">Plain version</a> · <a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a> ·{" "}
                <a href={`mailto:${profile.email}`}>Email</a> · <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a> ·{" "}
                <a href="#y-proj" onClick={() => setLoaded(SECTIONS)}>Projects ({work.length})</a> · <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            </p>

            <main className="y-page">
                <section className="y-sec y-welcome" data-in={shown(0)}>
                    <div className="y-construct" aria-hidden><span className="y-cone" />UNDER CONSTRUCTION<span className="y-cone" /></div>
                    <h1 aria-label="Welcome to Aman's Homepage!!!"><span className="y-wave" aria-hidden>{"Welcome to Aman's Homepage!!!".split(" ").map((word, w, all) => {
                        const k0 = all.slice(0, w).join(" ").length + (w ? 1 : 0);   // running index keeps the wave continuous across words
                        return <Fragment key={w}>{w > 0 && " "}<span className="y-word">{word.split("").map((c, i) => <span key={i} style={{ "--i": k0 + i }}>{c}</span>)}</span></Fragment>;
                    })}</span></h1>
                    <p className="y-sub">Full-stack engineer · Ahmedabad, India · <b className="y-blink">OPEN TO WORK!!</b></p>
                    <div className="y-marquee" aria-hidden><span>✦ Hi and thanx for stopping by!! ✦ {work.length} projects ✦ {live.length} sites live right now ✦ please sign my guestbook ✦ best viewed at 800x600 ✦ Hi and thanx for stopping by!! ✦ {work.length} projects ✦ {live.length} sites live right now ✦ please sign my guestbook ✦ best viewed at 800x600 ✦</span></div>
                    <p className="y-counter">You are visitor number <Odo n={hits} /> since 2001</p>
                </section>

                <hr className="y-hr" />

                <section className="y-sec" data-in={shown(1)} aria-labelledby="y-about">
                    <h2 id="y-about"><span className="y-new">NEW!</span> About Me</h2>
                    <table className="y-tbl y-about"><tbody><tr>
                        <td className="y-me" aria-hidden><span className="y-globe" /></td>
                        <td>
                            <p>Hi!! My name is <b>{profile.name}</b>. I am a <b>{job.role}</b> at <b>{job.org}</b> (since {job.when.split(" — ")[0]}).
                                I build AI products, client websites and Android apps, and I make things that <i>feel like something</i>.</p>
                            <p>I studied {edu.role} at {edu.org} ({edu.where}). I live in Ahmedabad and I can work on-site or hybrid.</p>
                            <p><b>Hiring?</b> <a href={profile.resume} target="_blank" rel="noreferrer">Download my résumé</a> or <a href={`mailto:${profile.email}`}>e-mail me</a> or <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp me</a>!!</p>
                        </td>
                    </tr></tbody></table>
                </section>

                <hr className="y-hr" />

                <section className="y-sec" data-in={shown(2)} aria-labelledby="y-proj">
                    <h2 id="y-proj">My Projects <small>({filteredWork.length} of {work.length} shown)</small></h2>
                    <div className="y-filters" role="group" aria-label="Filter projects">
                        {[["all", `All (${work.length})`], ["live", `Live (${live.length})`], ["product", "Products"], ["mobile", "Mobile"], ["client", "Clients"], ["concept", "Concepts"]].map(([k, label]) => (
                            <button key={k} type="button" className="y-btn y-fbtn" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
                        ))}
                    </div>
                    <table className="y-tbl y-proj">
                        <thead><tr><th scope="col">Pic</th><th scope="col">Project</th><th scope="col">What it is</th><th scope="col">Status</th></tr></thead>
                        <tbody>{filteredWork.map((w) => {
                            const href = cases[w.slug] ? `/case.html?p=${w.slug}` : w.url;
                            return (
                                <tr key={w.slug}>
                                    <td><Pic w={w} width={96} /></td>
                                    <th scope="row">{href ? <a href={href} target={cases[w.slug] ? undefined : "_blank"} rel="noreferrer">{w.title}</a> : w.title}<small>{KINDS[w.kind]} · {w.year}</small></th>
                                    <td>{w.line}{w.stack && <small className="y-stack">made with: {w.stack}</small>}</td>
                                    <td><span className="y-status" data-s={status(w)}>{status(w) === "Live" ? <><b className="y-blink">●</b> LIVE</> : status(w).toUpperCase()}</span></td>
                                </tr>
                            );
                        })}</tbody>
                    </table>
                </section>

                <hr className="y-hr" />

                <section className="y-sec" data-in={shown(3)} aria-labelledby="y-links">
                    <h2 id="y-links">Cool Links!! <small>(sites I built that are online right now)</small></h2>
                    <ul className="y-links">{live.map((w) => <li key={w.slug}><a href={w.url} target="_blank" rel="noreferrer">{w.title}</a> <small>{host(w.url)}</small></li>)}</ul>
                </section>

                <hr className="y-hr" />

                <section className="y-sec" data-in={shown(4)} aria-labelledby="y-cv">
                    <h2 id="y-cv">My Résumé</h2>
                    <dl className="y-cv">{experience.map((x) => (
                        <div key={x.role}><dt><b>{x.role}</b>, {x.org} <small>{x.when}</small></dt>{x.points.map((p) => <dd key={p}>{p}</dd>)}</div>
                    ))}</dl>
                    <p className="y-skills"><b>Skillz:</b> {skillGroups.map((g) => g.items.map(([n]) => n).join(", ")).join(" · ")}</p>
                    <p><a className="y-btn" href={profile.resume} target="_blank" rel="noreferrer">Download résumé (PDF)</a></p>
                </section>

                <hr className="y-hr" />

                <section className="y-sec" data-in={shown(5)} aria-labelledby="y-gb">
                    <h2 id="y-gb">Sign My Guestbook!!</h2>
                    <form className="y-form" onSubmit={sign}>
                        <label htmlFor="y-gb-name">Name <input id="y-gb-name" name="name" required maxLength={40} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                        <label htmlFor="y-gb-homepage">Your homepage (optional) <input id="y-gb-homepage" name="homepage" type="url" maxLength={120} placeholder="http://" value={form.homepage} onChange={(e) => setForm({ ...form, homepage: e.target.value })} /></label>
                        <label htmlFor="y-gb-message">Message <textarea id="y-gb-message" name="message" required maxLength={400} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
                        <p><button type="submit" className="y-btn" disabled={sent?.state === "sending"}>{sent?.state === "sending" ? "Sending…" : "Sign it!"}</button>{" "}
                            <span role="status">{sent?.state === "ok" ? "Thanx!!! Your message shows up after Aman reads it." : sent?.state === "err" ? sent.msg : ""}</span></p>
                    </form>
                    <ol className="y-entries">
                        {book.state === "loading" && <li>Loading entries…</li>}
                        {book.state === "offline" && <li>The guestbook is napping. <a href={`mailto:${profile.email}`}>E-mail me</a> instead!</li>}
                        {book.state === "ok" && !book.entries.length && <li>No entries yet. Be the first!!</li>}
                        {book.entries.map((e, i) => (
                            <li key={i}><b>{e.homepage ? <a href={e.homepage} target="_blank" rel="noreferrer nofollow ugc">{e.name}</a> : e.name}</b> wrote on {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}:<q>{e.message}</q></li>
                        ))}
                    </ol>
                </section>

                <hr className="y-hr" />

                <section className="y-sec y-ring" data-in={shown(6)} aria-label="PX-01 webring">
                    <p>This site is a member of the <b>PX-01 Webring</b>!</p>
                    <p className="y-ring-nav">
                        <button type="button" onClick={() => hop(-1)}>&lt;&lt; Prev</button>
                        <button type="button" onClick={() => shell?.go(ring[Math.floor(Math.random() * ring.length)].id)}>Random</button>
                        <button type="button" onClick={() => shell?.spin()}>The machine</button>
                        <button type="button" onClick={() => hop(1)}>Next &gt;&gt;</button>
                    </p>
                </section>

                <section className="y-sec y-badges" data-in={shown(7)} aria-label="Badges">
                    {[["MADE IN", "AHMEDABAD"], ["HAND", "CODED"], ["NO FRAMES", "ZONE"], ["BEST VIEWED", "800 x 600"], ["REACT", "INSIDE"], ["Y2K", "SURVIVOR"]].map(([a, b], i) => (
                        <span key={b} className="y-88" style={{ "--i": i }} aria-hidden><i>{a}</i><b>{b}</b></span>
                    ))}
                </section>

                <footer className="y-sec y-foot" data-in={shown(8)}>
                    <p>© 2001–{new Date().getFullYear()} {profile.name}. This page was last updated today (it always is).</p>
                    <p><a href={`mailto:${profile.email}`}>E-mail me</a> · <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> · <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></p>
                </footer>
            </main>

            <div className="y-statusbar" aria-hidden>
                <span className="y-sb-icon" data-busy={loaded < SECTIONS || undefined} />
                <span className="y-sb-text">{loaded < SECTIONS ? `Opening page http://www.aman-patel.me/~aman/ … (${loaded} of ${SECTIONS} items)` : "Done"}</span>
                <span className="y-sb-bar"><i style={{ "--p": loaded / SECTIONS }} /></span>
                <span className="y-sb-zone">Internet</span>
            </div>
        </div>
    );
}
