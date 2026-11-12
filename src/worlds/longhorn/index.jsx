import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { work, KINDS, shot, status } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import { liquid } from "../../liquid.js";
import { track } from "../../analytics.js";
import "./longhorn.css";

// World 10: LONGHORN, "Aero aquarium". The glossy mid-2000s desktop, all original: a drifting aurora wallpaper, liquid
// glass window frames (src/liquid.js, a real lens, not frost) around opaque client areas, a Start orb, sidebar gadgets
// (a live site-status gadget, an Ahmedabad clock), and the signature: a 3D flip stack of project windows.
const FONTS = ["Mulish:wght@400;600;700;800"];
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const LENS = { edge: 16, amount: 26, fringe: 0.18, extra: "saturate(1.6) brightness(1.08)" };
const linkedin = socials.find((s) => /linkedin/i.test(s.text || s.id));

// ---- original icons (glossy, drawn here) ----
const Icon = ({ kind }) => {
    const g = `lh-g-${kind}`;
    const shapes = {
        folder: <><path d="M4 14h16l4 5h20a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill={`url(#${g})`} /><path d="M4 22h43v4H4z" fill="#fff" opacity=".35" /></>,
        doc: <><path d="M12 5h20l10 10v31a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="#fbfdff" stroke="#9fb8d8" /><path d="M32 5v10h10" fill="#dbe8f7" stroke="#9fb8d8" />{[20, 25, 30, 35, 40].map((y) => <path key={y} d={`M16 ${y}h${y === 40 ? 12 : 20}`} stroke={`url(#${g})`} strokeWidth="2.5" strokeLinecap="round" />)}</>,
        card: <><rect x="5" y="12" width="40" height="28" rx="4" fill={`url(#${g})`} /><circle cx="17" cy="24" r="5" fill="#fff" opacity=".9" /><path d="M10 35c2-5 12-5 14 0" fill="#fff" opacity=".9" /><path d="M28 21h12M28 27h9M28 33h11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".85" /></>,
        stack: <>{[0, 1, 2].map((i) => <rect key={i} x={8 + i * 5} y={8 + i * 6} width="28" height="22" rx="3" fill={`url(#${g})`} stroke="#fff" strokeOpacity=".7" transform={`skewY(-8) translate(0 ${6 + i * 2})`} />)}</>,
    };
    const stops = { folder: ["#ffe08a", "#f0a531"], doc: ["#5aa9ff", "#1d63c9"], card: ["#40d9b8", "#0d8f86"], stack: ["#9fe3ff", "#2f8fd6"] }[kind];
    return (
        <svg viewBox="0 0 50 50" className="lh-icon" aria-hidden>
            <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={stops[0]} /><stop offset="1" stopColor={stops[1]} /></linearGradient></defs>
            {shapes[kind]}
        </svg>
    );
};

// ---- a window: liquid-glass frame, opaque client area, draggable by the title bar on desktop ----
function Win({ w, top, onFocus, onClose, onMin, title, children, wide }) {
    const ref = useRef(null), drag = useRef(null);
    const [pos, setPos] = useState(w.pos);
    useEffect(() => liquid(ref.current, LENS), []);
    useEffect(() => { if (top) ref.current?.querySelector(".lh-x")?.focus({ preventScroll: true }); }, [top]);
    const down = (e) => {
        if (e.button !== 0 || e.target.closest("button") || matchMedia("(max-width: 760px)").matches) return;
        drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        e.currentTarget.setPointerCapture(e.pointerId);
        onFocus();
    };
    const move = (e) => { if (drag.current) setPos({ x: Math.max(-200, e.clientX - drag.current.x), y: Math.max(0, e.clientY - drag.current.y) }); };
    return (
        <section ref={ref} className="lh-win" data-top={top || undefined} data-closing={w.closing || undefined} data-min={w.min || undefined} data-wide={wide || undefined}
            style={{ "--x": `${pos.x}px`, "--y": `${pos.y}px`, zIndex: w.z }} role="dialog" aria-label={title} onPointerDown={onFocus}
            onKeyDown={(e) => e.key === "Escape" && onClose()}>
            <header className="lh-title" onPointerDown={down} onPointerMove={move} onPointerUp={() => { drag.current = null; }}>
                <span className="lh-title-text">{title}</span>
                <span className="lh-caps">
                    <button type="button" className="lh-cap" aria-label={`Minimise ${title}`} onClick={onMin}><i className="lh-cap-min" /></button>
                    <button type="button" className="lh-cap lh-x" aria-label={`Close ${title}`} onClick={onClose}><i className="lh-cap-x" /></button>
                </span>
            </header>
            <div className="lh-client">{children}</div>
        </section>
    );
}

// ---- gadgets ----
function ClockGadget() {
    const [t, setT] = useState(() => new Date());
    useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
    const ist = new Date(t.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const h = ist.getHours() % 12, m = ist.getMinutes(), s = ist.getSeconds();
    const hand = (deg, len, wdt, c) => <line x1="50" y1="50" x2={50 + len * Math.sin(deg * Math.PI / 180)} y2={50 - len * Math.cos(deg * Math.PI / 180)} stroke={c} strokeWidth={wdt} strokeLinecap="round" />;
    return (
        <div className="lh-gadget lh-clock" role="img" aria-label={`Ahmedabad time ${ist.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}>
            <svg viewBox="0 0 100 100" aria-hidden>
                <defs><radialGradient id="lh-face" cx=".35" cy=".3"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#cfe4f6" /></radialGradient></defs>
                <circle cx="50" cy="50" r="46" fill="url(#lh-face)" stroke="#7fb3dd" strokeWidth="3" />
                {Array.from({ length: 12 }, (_, i) => <line key={i} x1="50" y1="9" x2="50" y2={i % 3 ? 13 : 16} stroke="#36597a" strokeWidth={i % 3 ? 1.5 : 3} transform={`rotate(${i * 30} 50 50)`} />)}
                {hand(h * 30 + m / 2, 24, 4.5, "#1f3550")}{hand(m * 6, 34, 3, "#1f3550")}{hand(s * 6, 38, 1.4, "#e2462f")}
                <circle cx="50" cy="50" r="3" fill="#e2462f" />
                <path d="M14 40a37 37 0 0 1 72 0 46 30 0 0 0-72 0z" fill="#fff" opacity=".55" />
            </svg>
            <p>Ahmedabad</p>
        </div>
    );
}

function StatusGadget({ sites }) {
    const list = work.filter((w) => w.maintained);
    const up = list.filter((w) => sites?.[w.slug]?.ok).length;
    return (
        <div className="lh-gadget lh-status">
            <p className="lh-gadget-h">Live sites <b>{sites ? `${up}/${list.length} up` : sites === null ? "offline" : "checking…"}</b></p>
            <ul>{list.slice(0, 7).map((w) => {
                const s = sites?.[w.slug];
                return <li key={w.slug}><i data-s={s ? (s.ok ? "up" : "down") : "wait"} /><a href={w.url} target="_blank" rel="noreferrer">{w.title}</a>{s?.ok && <small>{s.ms} ms</small>}</li>;
            })}</ul>
        </div>
    );
}

// ---- window contents ----
function Explorer({ open }) {
    const [kind, setKind] = useState("all");
    const list = work.filter((w) => kind === "all" || w.kind === kind);
    return (
        <div className="lh-explorer">
            <nav className="lh-side" aria-label="Folders">
                {[["all", "All projects"], ...Object.entries(KINDS)].map(([k, l]) => (
                    <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}><Icon kind="folder" />{l}<small>{k === "all" ? work.length : work.filter((w) => w.kind === k).length}</small></button>
                ))}
            </nav>
            <div className="lh-files">
                <ul className="lh-grid">{list.map((w, i) => (
                    <li key={w.slug} style={{ "--i": Math.min(i, 12) }}>
                        <button type="button" onClick={() => open("project", w)} aria-label={`${w.title}, ${status(w)}`}>
                            <span className="lh-thumb"><img src={shot(w, 360)} alt="" loading="lazy" /></span>
                            <b>{w.title}</b><small>{KINDS[w.kind]} · {status(w)}</small>
                        </button>
                    </li>
                ))}</ul>
                <p className="lh-statusbar">{list.length} items · double-click is optional, this isn&apos;t 2006</p>
            </div>
        </div>
    );
}

function Project({ w }) {
    const href = cases[w.slug] ? `/case.html?p=${w.slug}` : null;
    return (
        <div className="lh-project">
            <figure><img src={shot(w, 1100)} alt={`${w.title} screenshot`} /></figure>
            <div>
                <p className="lh-kicker">{KINDS[w.kind]} · {w.year} · {status(w)}</p>
                <h2>{w.title}</h2>
                <p>{w.line}</p>
                {w.stack && <p className="lh-stack">{w.stack}</p>}
                <p className="lh-actions">
                    {w.url && <a className="lh-btn lh-btn-go" href={w.url} target="_blank" rel="noreferrer">{w.url.includes("github.com") ? "View code" : `Open ${host(w.url)}`}</a>}
                    {href && <a className="lh-btn" href={href}>Read the case study</a>}
                </p>
            </div>
        </div>
    );
}

function Resume() {
    return (
        <div className="lh-doc">
            <div className="lh-doc-bar"><a className="lh-btn lh-btn-go" href={profile.resume} target="_blank" rel="noreferrer" onClick={() => track("resume_opened", { from: "world" })}>Download PDF</a>
                {["fullstack", "frontend", "ai"].map((k) => <a key={k} className="lh-btn" href={`/resume.html?for=${k}`}>{k === "ai" ? "AI products" : k === "fullstack" ? "Full-stack" : "Frontend"} version</a>)}</div>
            <article className="lh-paper">
                <h2>{profile.name}</h2>
                <p className="lh-kicker">Full-stack engineer · Ahmedabad · {profile.email}</p>
                {experience.map((x) => (
                    <section key={x.role}><h3>{x.role} <span>· {x.org}</span></h3><p className="lh-kicker">{x.when} · {x.where}</p><ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul></section>
                ))}
                <section><h3>Skills</h3>{skillGroups.map((g) => <p key={g.group}><b>{g.group}:</b> {g.items.map(([n]) => n).join(", ")}</p>)}</section>
            </article>
        </div>
    );
}

function Contact() {
    const [copied, setCopied] = useState(false);
    return (
        <div className="lh-contact">
            <div className="lh-card">
                <span className="lh-avatar" aria-hidden>AP</span>
                <div><h2>{profile.name}</h2><p>Full-stack engineer · open to on-site or hybrid roles in Ahmedabad</p></div>
            </div>
            <p className="lh-actions">
                <a className="lh-btn lh-btn-go" href={`mailto:${profile.email}`}>{profile.email}</a>
                <button type="button" className="lh-btn" onClick={() => navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); })}>{copied ? "Copied" : "Copy email"}</button>
                <a className="lh-btn" href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp {profile.phone}</a>
                {linkedin && <a className="lh-btn" href={linkedin.link} target="_blank" rel="noreferrer">LinkedIn</a>}
                <a className="lh-btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            </p>
        </div>
    );
}

function Welcome({ open, flip }) {
    return (
        <div className="lh-welcome">
            <h2>Welcome. I&apos;m Aman Patel.</h2>
            <p>Full-stack engineer at {experience[0].org}, based in Ahmedabad. {work.length} projects live on this desktop: products, Android apps and client sites, most of them running right now.</p>
            <div className="lh-tiles">
                <button type="button" onClick={() => open("explorer")}><Icon kind="folder" /><b>Browse projects</b><small>All {work.length}, by kind</small></button>
                <button type="button" onClick={flip}><Icon kind="stack" /><b>Flip through them</b><small>The 3D stack · or press F</small></button>
                <button type="button" onClick={() => open("resume")}><Icon kind="doc" /><b>Résumé</b><small>Read or download</small></button>
                <button type="button" onClick={() => open("contact")}><Icon kind="card" /><b>Contact</b><small>Email, WhatsApp, LinkedIn</small></button>
            </div>
        </div>
    );
}

// ---- the signature: Flip 3D ----
function Flip({ onPick, onClose }) {
    const [cur, setCur] = useState(0);
    const N = work.length;
    const step = useCallback((d) => setCur((c) => (c + d + N) % N), [N]);
    useEffect(() => {
        const key = (e) => {
            if (e.key === "Escape") onClose();
            else if (["ArrowDown", "ArrowRight", "Tab"].includes(e.key)) { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
            else if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); step(-1); }
            else if (e.key === "Enter") onPick(work[cur]);
        };
        let acc = 0;
        const wheel = (e) => { e.preventDefault(); acc += e.deltaY; if (Math.abs(acc) > 60) { step(Math.sign(acc)); acc = 0; } };
        addEventListener("keydown", key); addEventListener("wheel", wheel, { passive: false });
        return () => { removeEventListener("keydown", key); removeEventListener("wheel", wheel); };
    }, [cur, step, onPick, onClose]);
    const touch = useRef(null);
    return (
        <div className="lh-flip" role="dialog" aria-label="Flip through projects" onClick={(e) => e.target === e.currentTarget && onClose()}
            onTouchStart={(e) => { touch.current = e.touches[0].clientY; }} onTouchEnd={(e) => { const d = touch.current - e.changedTouches[0].clientY; if (Math.abs(d) > 30) step(d > 0 ? 1 : -1); }}>
            <p className="lh-flip-hint">Scroll, swipe or use the arrow keys · Enter opens · Esc closes</p>
            <div className="lh-flip-stage">
                {work.map((w, i) => {
                    let d = (i - cur + N) % N;
                    if (d > N / 2) d -= N;
                    if (d < -1 || d > 7) return null;
                    return (
                        <button key={w.slug} type="button" className="lh-flip-card" style={{ "--d": d }} data-front={d === 0 || undefined} data-gone={d < 0 || undefined} tabIndex={d === 0 ? 0 : -1}
                            aria-hidden={d !== 0} onClick={() => (d === 0 ? onPick(w) : setCur(i))}>
                            <span className="lh-flip-bar">{w.title}<i /></span>
                            <img src={shot(w, 720)} alt="" />
                        </button>
                    );
                })}
            </div>
            <p className="lh-flip-now" aria-live="polite"><b>{work[cur].title}</b> · {KINDS[work[cur].kind]} · {cur + 1} of {N}</p>
        </div>
    );
}

let zTop = 10;
export default function LonghornWorld({ shell }) {
    useFonts(FONTS);
    const [wins, setWins] = useState([]);
    const [start, setStart] = useState(false);
    const [flip, setFlip] = useState(false);
    const [sites, setSites] = useState(undefined);
    const [q, setQ] = useState("");
    const [clock, setClock] = useState(() => new Date());

    useEffect(() => { const i = setInterval(() => setClock(new Date()), 15000); return () => clearInterval(i); }, []);
    useEffect(() => { fetch("/api/status").then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => setSites(d.sites || {})).catch(() => setSites(null)); }, []);

    const open = useCallback((kind, payload) => {
        setStart(false);
        const id = kind === "project" ? `p-${payload.slug}` : kind;
        setWins((ws) => {
            const have = ws.find((x) => x.id === id);
            if (have) return ws.map((x) => (x.id === id ? { ...x, z: ++zTop, min: false } : x));
            const n = ws.length, small = typeof window !== "undefined" && innerWidth < 760;
            return [...ws, { id, kind, payload, z: ++zTop, pos: small ? { x: 0, y: 0 } : { x: 160 + n * 34, y: 40 + n * 28 } }];
        });
    }, []);
    const close = (id) => {
        if (reduced) return setWins((ws) => ws.filter((x) => x.id !== id));
        setWins((ws) => ws.map((x) => (x.id === id ? { ...x, closing: true } : x)));
        setTimeout(() => setWins((ws) => ws.filter((x) => x.id !== id)), 200);
    };
    const focus = (id) => setWins((ws) => ws.map((x) => (x.id === id && x.z !== zTop ? { ...x, z: ++zTop } : x)));
    const toggleMin = (id) => setWins((ws) => ws.map((x) => (x.id === id ? { ...x, min: !x.min, z: x.min ? ++zTop : x.z } : x)));

    // first visit: the Welcome Center opens itself once the desktop has settled
    useEffect(() => { const t = setTimeout(() => open("welcome"), reduced ? 0 : 1500); return () => clearTimeout(t); }, [open]);
    useEffect(() => {
        const key = (e) => { if ((e.key === "f" || e.key === "F") && !e.target.closest?.("input, textarea") && !flip) setFlip(true); };
        addEventListener("keydown", key);
        return () => removeEventListener("keydown", key);
    }, [flip]);

    const topId = useMemo(() => wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.id, [wins]);
    const found = q.trim() ? work.filter((w) => `${w.title} ${w.line} ${w.stack || ""}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
    const titleOf = (w) => ({ welcome: "Welcome Center", explorer: "Projects", resume: "Résumé — Document Viewer", contact: "Contact", project: w.payload?.title })[w.kind];

    return (
        <div className="lh" data-flip={flip || undefined}>
            <div className="lh-aurora" aria-hidden><i /><i /><i /><i /></div>

            <nav className="lh-icons" aria-label="Desktop">
                {[["folder", "Projects", () => open("explorer")], ["doc", "Résumé.pdf", () => open("resume")], ["card", "Contact", () => open("contact")], ["stack", "Flip 3D", () => setFlip(true)]].map(([k, l, fn], i) => (
                    <button key={l} type="button" style={{ "--i": i }} onClick={fn}><Icon kind={k} /><span>{l}</span></button>
                ))}
            </nav>

            <aside className="lh-gadgets" aria-label="Gadgets">
                <ClockGadget />
                <StatusGadget sites={sites} />
                <div className="lh-gadget lh-now"><p className="lh-gadget-h">Status</p><p><i /> Open to work</p><small>Full-stack · on-site or hybrid · Ahmedabad</small></div>
            </aside>

            {wins.map((w) => (
                <Win key={w.id} w={w} top={w.id === topId} title={titleOf(w)} wide={w.kind === "explorer" || w.kind === "resume"}
                    onFocus={() => focus(w.id)} onClose={() => close(w.id)} onMin={() => toggleMin(w.id)}>
                    {w.kind === "welcome" && <Welcome open={open} flip={() => setFlip(true)} />}
                    {w.kind === "explorer" && <Explorer open={open} />}
                    {w.kind === "resume" && <Resume />}
                    {w.kind === "contact" && <Contact />}
                    {w.kind === "project" && <Project w={w.payload} />}
                </Win>
            ))}

            {flip && <Flip onClose={() => setFlip(false)} onPick={(p) => { setFlip(false); open("project", p); }} />}

            {start && (
                <div className="lh-start" role="menu" aria-label="Start menu">
                    <div className="lh-start-left">
                        <label className="lh-search"><span className="sr-only">Search projects</span><input autoFocus placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
                        {found.length ? found.map((w) => <button key={w.slug} type="button" role="menuitem" onClick={() => open("project", w)}><Icon kind="doc" />{w.title}</button>) : <>
                            <button type="button" role="menuitem" onClick={() => open("explorer")}><Icon kind="folder" />All projects <small>{work.length}</small></button>
                            <button type="button" role="menuitem" onClick={() => open("resume")}><Icon kind="doc" />Résumé</button>
                            <button type="button" role="menuitem" onClick={() => open("contact")}><Icon kind="card" />Contact</button>
                            <button type="button" role="menuitem" onClick={() => { setStart(false); setFlip(true); }}><Icon kind="stack" />Flip 3D</button>
                        </>}
                    </div>
                    <div className="lh-start-right">
                        <span className="lh-avatar" aria-hidden>AP</span>
                        <b>{profile.name}</b>
                        <a href={`mailto:${profile.email}`} role="menuitem">Email</a>
                        <a href={profile.whatsapp} target="_blank" rel="noreferrer" role="menuitem">WhatsApp</a>
                        <a href={profile.resume} target="_blank" rel="noreferrer" role="menuitem">Résumé PDF</a>
                        <button type="button" role="menuitem" onClick={() => shell?.spin()}>Other worlds</button>
                    </div>
                </div>
            )}

            <footer className="lh-taskbar">
                <button type="button" className="lh-orb" aria-label="Start" aria-expanded={start} onClick={() => { setStart((s) => !s); setQ(""); }}><i /></button>
                <div className="lh-tasks">{wins.map((w) => (
                    <button key={w.id} type="button" data-active={(w.id === topId) || undefined} data-min={w.min || undefined} onClick={() => (w.id === topId ? toggleMin(w.id) : open(w.kind, w.payload))}>{titleOf(w)}</button>
                ))}</div>
                <time className="lh-tray">{clock.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })}</time>
            </footer>
        </div>
    );
}
