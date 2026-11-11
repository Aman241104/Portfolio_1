import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import "./canvas.css";

// World 7: CANVAS. The portfolio as a design file: an infinite board you pan and zoom, every project a frame,
// skills on sticky notes, a collaborator cursor drifting between frames. Pan/zoom/pinch/minimap are hand-written
// (one transform on one board), no canvas library.
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const FW = 340, FH = 300, GAP = 48;
const NOTE = ["#fff3a3", "#ffd6e7", "#cdeffd", "#d9f7c8", "#ffe1c2", "#e5dcff", "#fde2b4", "#d4f1ec"];

// layout: one section per kind, laid out as rows of frames; then skills, career and contact boards
const build = () => {
    const items = [], sections = [];
    let y = 520;
    const order = ["product", "mobile", "client", "concept"];
    order.forEach((k) => {
        const list = work.filter((w) => w.kind === k), cols = Math.min(list.length, 5);
        const w = cols * FW + (cols - 1) * GAP, rows = Math.ceil(list.length / cols);
        sections.push({ id: k, label: KINDS[k], x: 0, y, w: Math.max(w, 2 * FW + GAP), h: rows * (FH + GAP) + 70 });
        list.forEach((p, i) => items.push({ type: "frame", p, x: 24 + (i % cols) * (FW + GAP), y: y + 60 + Math.floor(i / cols) * (FH + GAP) }));
        y += rows * (FH + GAP) + 150;
    });
    const right = 5 * FW + 4 * GAP + 160;
    sections.push({ id: "skills", label: "Skills", x: right, y: 520, w: 980, h: 760 });
    skillGroups.forEach((g, i) => items.push({ type: "note", g, color: NOTE[i % NOTE.length], x: right + 30 + (i % 4) * 236, y: 600 + Math.floor(i / 4) * 330, r: ((i * 37) % 7) - 3 }));
    sections.push({ id: "career", label: "Career", x: right, y: 1360, w: 980, h: 420 });
    experience.forEach((x, i) => items.push({ type: "xp", x: right + 30 + i * 470, y: 1430, xp: x }));
    sections.push({ id: "contact", label: "Contact", x: right, y: 1860, w: 980, h: 360 });
    items.push({ type: "contact", x: right + 30, y: 1930 });
    const W = right + 980 + 200, H = Math.max(y, 2300);
    return { items, sections, W, H };
};

export default function CanvasWorld() {
    const { items, sections, W, H } = useMemo(() => build(), []);
    const vp = useRef(null), board = useRef(null);
    const view = useRef({ x: 0, y: 0, k: 0.4 });
    const [vstate, setV] = useState({ x: 0, y: 0, k: 0.4 }); // for the minimap + zoom readout
    const [vpSize, setVpSize] = useState({ w: 0, h: 0 });
    const [focus, setFocus] = useState(null);
    const [mate, setMate] = useState({ x: 300, y: 300, label: "Aman" });
    const pts = useRef(new Map()), last = useRef(null);
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = useCallback((v, animate = false) => {
        view.current = v;
        if (board.current) {
            board.current.style.transition = animate && !reduced ? "transform .7s cubic-bezier(.2, .9, .2, 1)" : "none";
            board.current.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.k})`;
        }
        setV(v);
    }, [reduced]);
    const fitTo = useCallback((x, y, w, h, pad = 60) => {
        const r = vp.current.getBoundingClientRect();
        const k = Math.min((r.width - pad * 2) / w, (r.height - pad * 2) / h, 1.6);
        apply({ k, x: r.width / 2 - (x + w / 2) * k, y: r.height / 2 - (y + h / 2) * k }, true);
    }, [apply]);
    useEffect(() => { fitTo(0, 0, Math.min(W, 1900), 1300, 30); }, [fitTo, W]);
    useEffect(() => {
        const ro = new ResizeObserver(([e]) => setVpSize({ w: e.contentRect.width, h: e.contentRect.height }));
        ro.observe(vp.current); return () => ro.disconnect();
    }, []);

    const zoomAt = (cx, cy, f) => {
        const v = view.current, k = Math.min(3, Math.max(0.12, v.k * f));
        apply({ k, x: cx - (cx - v.x) * (k / v.k), y: cy - (cy - v.y) * (k / v.k) });
    };
    const onWheel = (e) => {
        e.preventDefault();
        const r = vp.current.getBoundingClientRect();
        if (e.ctrlKey || e.metaKey) zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.01));
        else apply({ ...view.current, x: view.current.x - e.deltaX, y: view.current.y - e.deltaY });
    };
    useEffect(() => { const el = vp.current; el.addEventListener("wheel", onWheel, { passive: false }); return () => el.removeEventListener("wheel", onWheel); });

    const down = (e) => { if (e.target.closest("a, button")) return; vp.current.setPointerCapture(e.pointerId); pts.current.set(e.pointerId, [e.clientX, e.clientY]); last.current = null; };
    const move = (e) => {
        if (!pts.current.has(e.pointerId)) return;
        const prev = pts.current.get(e.pointerId); pts.current.set(e.pointerId, [e.clientX, e.clientY]);
        const all = [...pts.current.values()];
        if (all.length === 2) {
            const r = vp.current.getBoundingClientRect(), d = Math.hypot(all[0][0] - all[1][0], all[0][1] - all[1][1]);
            if (last.current) zoomAt((all[0][0] + all[1][0]) / 2 - r.left, (all[0][1] + all[1][1]) / 2 - r.top, d / last.current);
            last.current = d;
        } else apply({ ...view.current, x: view.current.x + e.clientX - prev[0], y: view.current.y + e.clientY - prev[1] });
    };
    const up = (e) => { pts.current.delete(e.pointerId); if (pts.current.size < 2) last.current = null; };

    // the collaborator: drifts from frame to frame, sometimes "commenting"
    useEffect(() => {
        if (reduced) return;
        const frames = items.filter((i) => i.type === "frame");
        let i = 0;
        const t = setInterval(() => { const f = frames[(i = (i + 1 + Math.floor(Math.random() * 3)) % frames.length)]; setMate({ x: f.x + 60 + Math.random() * 200, y: f.y + 40 + Math.random() * 160, label: Math.random() < 0.3 ? `Aman · ${f.p.year}` : "Aman" }); }, 2600);
        return () => clearInterval(t);
    }, [items, reduced]);

    const open = (it) => { setFocus(it.p); fitTo(it.x, it.y, FW, FH, 40); };
    const MM = 180 / W;

    return (
        <div className="cv">
            <header className="cv-bar">
                <p className="cv-file"><b>Aman Patel</b> / Portfolio.fig</p>
                <nav className="cv-jump" aria-label="Go to section">
                    {sections.map((s) => <button key={s.id} type="button" onClick={() => { setFocus(null); fitTo(s.x, s.y, s.w, s.h); }}>{s.label}</button>)}
                </nav>
                <div className="cv-zoom">
                    <button type="button" aria-label="Zoom out" onClick={() => { const b = vp.current.getBoundingClientRect(); zoomAt(b.width / 2, b.height / 2, 0.8); }}>−</button>
                    <span>{Math.round(vstate.k * 100)}%</span>
                    <button type="button" aria-label="Zoom in" onClick={() => { const b = vp.current.getBoundingClientRect(); zoomAt(b.width / 2, b.height / 2, 1.25); }}>+</button>
                    <button type="button" className="cv-fit" onClick={() => { setFocus(null); fitTo(0, 0, W, H, 30); }}>Fit</button>
                </div>
            </header>

            <div ref={vp} className="cv-vp" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
                <div ref={board} className="cv-board" style={{ width: W, height: H }}>
                    <section className="cv-title">
                        <p className="cv-tag">Page 1 · Portfolio</p>
                        <h1>Aman Patel</h1>
                        <p>Full-stack engineer in Ahmedabad. {work.length} projects on this board. Drag to move, scroll or pinch to zoom, click any frame.</p>
                    </section>
                    <div className="cv-note cv-hire" style={{ left: 1180, top: 60, "--r": "3deg" }}>
                        <b>Open to work ✦</b>Full-stack roles · Ahmedabad on-site or hybrid. <a href={profile.resume} target="_blank" rel="noreferrer">Résumé ↓</a>
                    </div>
                    {sections.map((s) => <div key={s.id} className="cv-sec" style={{ left: s.x, top: s.y, width: s.w, height: s.h }}><span>{s.label}</span></div>)}
                    {items.map((it, i) => {
                        if (it.type === "frame") return (
                            <article key={i} className="cv-frame" data-on={focus === it.p || undefined} style={{ left: it.x, top: it.y, width: FW, height: FH }} onClick={() => open(it)}>
                                <span className="cv-name">{it.p.title}</span>
                                <img src={shot(it.p, 520)} alt="" loading="lazy" draggable={false} />
                                <div><b>{it.p.title}</b><p>{it.p.line}</p><small>{it.p.year}{it.p.live ? " · live" : ""}{it.p.stack ? ` · ${it.p.stack.split(" · ").slice(0, 3).join(", ")}` : ""}</small></div>
                            </article>
                        );
                        if (it.type === "note") return (
                            <div key={i} className="cv-note" style={{ left: it.x, top: it.y, "--r": `${it.r}deg`, background: it.color }}>
                                <b>{it.g.group}</b><small>{it.g.note}</small>{it.g.items.map(([n]) => n).join(" · ")}
                            </div>
                        );
                        if (it.type === "xp") return (
                            <div key={i} className="cv-xp" style={{ left: it.x, top: it.y }}>
                                <span className="cv-tag">{it.xp.when}</span><b>{it.xp.role}</b><small>{it.xp.org} · {it.xp.where}</small>
                                <ul>{it.xp.points.map((p) => <li key={p}>{p}</li>)}</ul>
                            </div>
                        );
                        return (
                            <div key={i} className="cv-contact" style={{ left: it.x, top: it.y }}>
                                <span className="cv-tag">Let's talk</span>
                                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                                <a className="cv-btn" href={profile.resume} target="_blank" rel="noreferrer">Download résumé</a>
                            </div>
                        );
                    })}
                    <div className="cv-mate" style={{ transform: `translate(${mate.x}px, ${mate.y}px)` }} aria-hidden>
                        <svg viewBox="0 0 16 16"><path d="M1 1l5.5 14 2-6 6-2z" /></svg><span>{mate.label}</span>
                    </div>
                </div>
            </div>

            {focus && (
                <aside className="cv-inspect">
                    <button type="button" className="cv-x" aria-label="Close" onClick={() => setFocus(null)}>×</button>
                    <p className="cv-tag">{KINDS[focus.kind]} · {focus.year}</p>
                    <h2>{focus.title}</h2>
                    <p>{focus.line}</p>
                    {focus.stack && <p className="cv-stack">{focus.stack}</p>}
                    <p className="cv-links">
                        {cases[focus.slug] && <a className="cv-btn" href={`/case.html?p=${focus.slug}`}>Case study →</a>}
                        {focus.url && <a className="cv-btn ghost" href={focus.url} target="_blank" rel="noreferrer">{focus.url.includes("github.com") ? "Code ↗" : `${host(focus.url)} ↗`}</a>}
                    </p>
                </aside>
            )}

            <div className="cv-mini" aria-hidden onClick={(e) => { const b = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - b.left) / MM, y = (e.clientY - b.top) / MM; const R = vp.current.getBoundingClientRect(); apply({ ...view.current, x: R.width / 2 - x * view.current.k, y: R.height / 2 - y * view.current.k }, true); }}
                style={{ width: W * MM, height: H * MM }}>
                {sections.map((s) => <i key={s.id} style={{ left: s.x * MM, top: s.y * MM, width: s.w * MM, height: s.h * MM }} />)}
                {vpSize.w > 0 && <b style={{ left: -vstate.x / vstate.k * MM, top: -vstate.y / vstate.k * MM, width: vpSize.w / vstate.k * MM, height: vpSize.h / vstate.k * MM }} />}
            </div>
        </div>
    );
}
