import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work, KINDS, shot, status } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import "./canvas.css";

// World 7: THE DRAWING. The portfolio as a blueprint on a drafting table: an infinite cyanotype sheet you pan and
// zoom (zoom reads as a drawing scale), every project a sheet with dimension lines and a title block, skills as a bill
// of materials, experience as the revision history. Pan/zoom/pinch/key plan are hand-written, one transform.
const FONTS = ["B612+Mono:wght@400;700", "B612:wght@400;700", "Architects+Daughter"];
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const FW = 340, FH = 300, GAP = 48;

// A drafter's revision cloud: scalloped arcs walked around a rectangle, drawn on with stroke-dashoffset when a sheet
// is selected. Built once (every sheet is the same size).
const CLOUD = (() => {
    const pad = 22, w = FW + pad * 2, h = FH + pad * 2, r = 16;
    const pts = [];
    const edge = (x0, y0, x1, y1) => { const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / (r * 1.6)); for (let i = 0; i < n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n]); };
    edge(0, 0, w, 0); edge(w, 0, w, h); edge(w, h, 0, h); edge(0, h, 0, 0);
    const d = pts.map(([x, y], i) => { const [nx, ny] = pts[(i + 1) % pts.length]; return `${i ? "" : `M${x} ${y}`}A${r} ${r} 0 0 1 ${nx} ${ny}`; }).join("");
    return { d, w, h, pad };
})();

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
    // Pack Approval & Revision history right beside Zones A & B so the arrival viewport is dense and balanced
    const mid = 2 * FW + GAP + 120;
    sections.push({ id: "contact", label: "Approval", x: mid, y: 520, w: 940, h: 380 });
    items.push({ type: "contact", x: mid + 30, y: 590 });
    sections.push({ id: "career", label: "Revision history", x: mid, y: 940, w: 940, h: 340 });
    items.push({ type: "rev", x: mid + 30, y: 1010 });
    const right = 5 * FW + 4 * GAP + 140;
    sections.push({ id: "skills", label: "Bill of materials", x: right, y: 520, w: 980, h: 720 });
    items.push({ type: "bom", x: right + 30, y: 590 });
    const W = right + 980 + 180, H = Math.max(y, 1500);
    return { items, sections, W, H };
};

export default function CanvasWorld() {
    useFonts(FONTS);
    const { items, sections, W, H } = useMemo(() => build(), []);
    const vp = useRef(null), board = useRef(null);
    const view = useRef({ x: 0, y: 0, k: 0.4 });
    const [vstate, setV] = useState({ x: 0, y: 0, k: 0.4 }); // for the minimap + zoom readout
    const [vpSize, setVpSize] = useState({ w: 0, h: 0 });
    const [focus, setFocus] = useState(null);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    // phones open on a plain scrolling print of the same drawing (readable, no pan/zoom work); the full sheet is one tap away
    const [list, setList] = useState(() => typeof window !== "undefined" && matchMedia("(max-width: 760px)").matches);
    const [mate, setMate] = useState({ x: 300, y: 300, label: "A.P." });
    const pts = useRef(new Map()), last = useRef(null), start = useRef([0, 0]);
    const vel = useRef([0, 0]), coast = useRef(0);   // pan momentum (px/ms) and its rAF
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = useCallback((v, animate = false) => {
        view.current = v;
        if (board.current) {
            board.current.style.transition = animate && !reduced ? "transform .7s var(--ease-out)" : "none";
            board.current.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.k})`;
        }
        setV(v);
    }, [reduced]);
    const fitTo = useCallback((x, y, w, h, pad = 60, offsetX = 0) => {
        const r = vp.current.getBoundingClientRect();
        const k = Math.min((r.width - pad * 2) / w, (r.height - pad * 2) / h, 1.5);
        apply({ k, x: r.width / 2 + offsetX - (x + w / 2) * k, y: r.height / 2 - (y + h / 2) * k }, true);
    }, [apply]);
    // phones open on the title block (readable), wide screens on the first zones
    useEffect(() => {
        if (innerWidth < 760) fitTo(0, 0, 1150, 900, 12); else fitTo(0, 0, Math.min(W, 1900), 1300, 30);
        // Only what is on screen drafts itself on arrival; everything else is simply already drawn (keeps raster cheap).
        const v = view.current, r = vp.current.getBoundingClientRect();
        board.current.querySelectorAll(".bp-sheet, .bp-zone").forEach((el) => {
            const x = parseFloat(el.style.left) * v.k + v.x, y = parseFloat(el.style.top) * v.k + v.y;
            if (x > r.width || y > r.height || x + el.offsetWidth * v.k < 0 || y + el.offsetHeight * v.k < 0) el.dataset.still = "";
        });
    }, [fitTo, W]);
    useEffect(() => {
        const ro = new ResizeObserver(([e]) => setVpSize({ w: e.contentRect.width, h: e.contentRect.height }));
        ro.observe(vp.current); return () => ro.disconnect();
    }, []);

    const zoomAt = (cx, cy, f, animate = false) => {
        const v = view.current, k = Math.min(3, Math.max(0.12, v.k * f));
        apply({ k, x: cx - (cx - v.x) * (k / v.k), y: cy - (cy - v.y) * (k / v.k) }, animate);
    };
    const onWheel = (e) => {
        if (list) return;
        e.preventDefault(); cancelAnimationFrame(coast.current);
        const r = vp.current.getBoundingClientRect();
        if (e.ctrlKey || e.metaKey) zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.01));
        else apply({ ...view.current, x: view.current.x - e.deltaX, y: view.current.y - e.deltaY });
    };
    useEffect(() => { const el = vp.current; el.addEventListener("wheel", onWheel, { passive: false }); return () => el.removeEventListener("wheel", onWheel); });

    // Physics: the sheet has mass. Drag tracks velocity; release coasts it out with exponential decay; past the edge of
    // the drawing it pulls with resistance (rubber band) and springs back when let go.
    const bounds = (v) => {
        const r = vp.current.getBoundingClientRect(), m = 160;
        const minX = Math.min(m, r.width - W * v.k - m), minY = Math.min(m, r.height - H * v.k - m);
        return { minX, maxX: m, minY, maxY: m };
    };
    const over = (val, lo, hi) => (val < lo ? val - lo : val > hi ? val - hi : 0);
    const stop = () => { cancelAnimationFrame(coast.current); coast.current = 0; };
    const release = () => {
        if (reduced) return;
        let [vx, vy] = vel.current, t0 = performance.now();
        const step = (t) => {
            const dt = Math.min(32, t - t0); t0 = t;
            const v = view.current, b = bounds(v);
            const ox = over(v.x, b.minX, b.maxX), oy = over(v.y, b.minY, b.maxY);
            const decay = Math.pow(0.94, dt / 16.7);
            vx *= decay; vy *= decay;
            // outside the drawing: momentum is soaked up and the sheet eases back to the edge (damped, can't overshoot)
            const pull = 1 - Math.pow(0.8, dt / 16.7);
            if (ox) vx *= 0.5;
            if (oy) vy *= 0.5;
            apply({ ...v, x: v.x + vx * dt - ox * pull, y: v.y + vy * dt - oy * pull });
            if (Math.abs(vx) + Math.abs(vy) > 0.01 || Math.abs(ox) + Math.abs(oy) > 0.5) coast.current = requestAnimationFrame(step);
            else coast.current = 0;
        };
        coast.current = requestAnimationFrame(step);
    };

    useEffect(() => () => cancelAnimationFrame(coast.current), []);

    // capture only once the pointer really drags, so a plain click still reaches the sheet under it
    const down = (e) => { if (list || e.target.closest("a, button")) return; stop(); vel.current = [0, 0]; pts.current.set(e.pointerId, [e.clientX, e.clientY, performance.now()]); start.current = [e.clientX, e.clientY]; last.current = null; };
    const move = (e) => {
        if (!pts.current.has(e.pointerId)) return;
        if (!vp.current.hasPointerCapture(e.pointerId) && Math.hypot(e.clientX - start.current[0], e.clientY - start.current[1]) > 4) vp.current.setPointerCapture(e.pointerId);
        const prev = pts.current.get(e.pointerId), now = performance.now(); pts.current.set(e.pointerId, [e.clientX, e.clientY, now]);
        const all = [...pts.current.values()];
        if (all.length === 2) {
            const r = vp.current.getBoundingClientRect(), d = Math.hypot(all[0][0] - all[1][0], all[0][1] - all[1][1]);
            if (last.current) zoomAt((all[0][0] + all[1][0]) / 2 - r.left, (all[0][1] + all[1][1]) / 2 - r.top, d / last.current);
            last.current = d; vel.current = [0, 0];
        } else {
            const v = view.current, b = bounds(v);
            let dx = e.clientX - prev[0], dy = e.clientY - prev[1];
            // rubber band: resistance grows with how far past the edge you already are
            dx /= 1 + Math.abs(over(v.x, b.minX, b.maxX)) / 80;
            dy /= 1 + Math.abs(over(v.y, b.minY, b.maxY)) / 80;
            const dt = Math.max(1, now - prev[2]);
            vel.current = [vel.current[0] * 0.6 + (dx / dt) * 0.4, vel.current[1] * 0.6 + (dy / dt) * 0.4];
            apply({ ...v, x: v.x + dx, y: v.y + dy });
        }
    };
    const up = (e) => {
        const had = pts.current.get(e.pointerId);
        pts.current.delete(e.pointerId);
        if (pts.current.size < 2) last.current = null;
        if (pts.current.size === 0 && had) {
            if (performance.now() - had[2] > 80) vel.current = [0, 0];   // held still before letting go: no fling
            release();
        }
    };

    // the collaborator: drifts from frame to frame, sometimes "commenting"
    useEffect(() => {
        if (reduced) return;
        const frames = items.filter((i) => i.type === "frame");
        let i = 0;
        const t = setInterval(() => { const f = frames[(i = (i + 1 + Math.floor(Math.random() * 3)) % frames.length)]; setMate({ x: f.x + 60 + Math.random() * 200, y: f.y + 40 + Math.random() * 160, label: Math.random() < 0.35 ? `A.P. · rev ${f.p.year}` : "A.P." }); }, 2600);
        return () => clearInterval(t);
    }, [items, reduced]);

    const open = useCallback((it) => {
        setFocus(it.p);
        if (!list) fitTo(it.x, it.y, FW, FH, 60, -170);
    }, [fitTo, list]);

    useEffect(() => {
        const frames = items.filter((i) => i.type === "frame");
        const onKey = (e) => {
            if (e.target.closest("input, textarea")) return;
            if (e.key === "Escape") setFocus(null);
            else if (e.key === "0" || e.key.toLowerCase() === "f") { setFocus(null); fitTo(0, 0, W, H, 30); }
            else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const idx = focus ? frames.findIndex((f) => f.p === focus) : -1;
                const next = e.key === "ArrowRight" ? (idx + 1) % frames.length : (idx - 1 + frames.length) % frames.length;
                open(frames[next]);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [focus, items, open, fitTo, W, H]);

    const MM = 180 / W;

    return (
        <div className="cv" data-list={list || undefined}>
            <header className="cv-bar">
                <button type="button" className="cv-mode" onClick={() => { setList(!list); setFocus(null); }}>{list ? "Open the full drawing" : "Plain view"}</button>
                <p className="cv-file"><b>AP-2026-001</b> Portfolio, general arrangement</p>
                <nav className="cv-jump" aria-label="Go to section">
                    {sections.map((s) => <button key={s.id} type="button" onClick={() => { setFocus(null); fitTo(s.x, s.y, s.w, s.h); }}>{s.label}</button>)}
                </nav>
                <div className="cv-zoom">
                    <span className="cv-coords" aria-hidden>X:{String(coords.x).padStart(4, "0")} Y:{String(coords.y).padStart(4, "0")}</span>
                    <button type="button" aria-label="Zoom out" onClick={() => { const b = vp.current.getBoundingClientRect(); zoomAt(b.width / 2, b.height / 2, 0.8, true); }}>−</button>
                    <span>Scale {vstate.k >= 1 ? `${vstate.k.toFixed(1)}:1` : `1:${(1 / vstate.k).toFixed(1)}`}</span>
                    <button type="button" aria-label="Zoom in" onClick={() => { const b = vp.current.getBoundingClientRect(); zoomAt(b.width / 2, b.height / 2, 1.25, true); }}>+</button>
                    <button type="button" className="cv-fit" onClick={() => { setFocus(null); fitTo(0, 0, W, H, 30); }}>Whole sheet</button>
                    <a className="cv-fit cv-res" href={profile.resume} target="_blank" rel="noreferrer">Résumé ↗</a>
                </div>
            </header>

            <div ref={vp} className="cv-vp" onPointerDown={down} onPointerMove={(e) => {
                if (vp.current && !list) {
                    const r = vp.current.getBoundingClientRect();
                    const bx = Math.round((e.clientX - r.left - view.current.x) / view.current.k);
                    const by = Math.round((e.clientY - r.top - view.current.y) / view.current.k);
                    setCoords({ x: Math.max(0, bx), y: Math.max(0, by) });
                }
                move(e);
            }} onPointerUp={up} onPointerCancel={up}>
                <div ref={board} className="cv-board" style={{ width: W, height: H }}>
                    <section className="bp-cover">
                        <p className="bp-dwg">Dwg. no. AP-2026-001 · General arrangement</p>
                        <h1>Aman Patel</h1>
                        <p>Full-stack engineer, Ahmedabad. {work.length} projects drawn to scale on this sheet. {list ? "Tap a sheet to inspect it." : "Drag to move, scroll or pinch to zoom, click a sheet to inspect it."}</p>
                    </section>
                    <p className="bp-hand bp-hire" style={{ left: 1180, top: 70 }}>open to work · full-stack · on-site or hybrid ↘</p>
                    {sections.map((s) => <div key={s.id} className="bp-zone" style={{ left: s.x, top: s.y, width: s.w, height: s.h, "--i": sections.indexOf(s) }}><span>Zone {String.fromCharCode(65 + sections.indexOf(s))} · {s.label}</span></div>)}
                    {items.map((it, i) => {
                        if (it.type === "frame") {
                            const no = work.indexOf(it.p) + 1;
                            return (
                                <article key={i} className="bp-sheet" data-on={focus === it.p || undefined} style={{ left: it.x, top: it.y, width: FW, height: FH, "--i": i }} onClick={() => open(it)}
                                    role="button" tabIndex={0} aria-label={`${it.p.title}, ${KINDS[it.p.kind]} ${it.p.year}. Inspect`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(it); } }}>
                                    {focus === it.p && (
                                        <svg className="bp-cloud" aria-hidden width={CLOUD.w} height={CLOUD.h} style={{ left: -CLOUD.pad, top: -CLOUD.pad }} viewBox={`-4 -4 ${CLOUD.w + 8} ${CLOUD.h + 8}`}>
                                            <path d={CLOUD.d} pathLength="1" />
                                            <text x={CLOUD.w - 6} y={-10}>△ REV {String.fromCharCode(64 + Math.min(26, no % 26 || 26))}</text>
                                        </svg>
                                    )}
                                    <span className="bp-dim bp-dim-x" aria-hidden><i />1440<i /></span>
                                    <span className="bp-dim bp-dim-y" aria-hidden><i />900<i /></span>
                                    <div className="bp-print"><img src={shot(it.p, 520)} alt="" loading="lazy" draggable={false} /></div>
                                    <p className="bp-note" aria-hidden>{it.p.stack ? it.p.stack.split(" · ")[0] : KINDS[it.p.kind]}</p>
                                    <dl className="bp-block">
                                        <div className="bp-title"><dt>Project</dt><dd>{it.p.title}</dd></div>
                                        <div><dt>Year</dt><dd>{it.p.year}</dd></div>
                                        <div><dt>Status</dt><dd>{status(it.p)}</dd></div>
                                        <div><dt>Sheet</dt><dd>{String(no).padStart(2, "0")}/{work.length}</dd></div>
                                        <div><dt>Drawn</dt><dd>A. Patel</dd></div>
                                    </dl>
                                </article>
                            );
                        }
                        if (it.type === "bom") return (
                            <table key={i} className="bp-table bp-bom" style={{ left: it.x, top: it.y }}>
                                <caption>Bill of materials · everything used in a shipped project</caption>
                                <thead><tr><th>Item</th><th>Assembly</th><th>Specification</th><th>Qty</th></tr></thead>
                                <tbody>{skillGroups.map((g, k) => <tr key={g.group}><td>{String(k + 1).padStart(2, "0")}</td><td>{g.group}</td><td>{g.items.map(([n]) => n).join(", ")}</td><td>{g.items.length}</td></tr>)}</tbody>
                            </table>
                        );
                        if (it.type === "rev") return (
                            <table key={i} className="bp-table bp-rev" style={{ left: it.x, top: it.y }}>
                                <caption>Revision history</caption>
                                <thead><tr><th>Rev</th><th>Date</th><th>Description</th><th>By</th></tr></thead>
                                <tbody>
                                    {[...experience].reverse().map((x, k) => <tr key={x.role}><td>{String.fromCharCode(65 + k)}</td><td>{x.when.replace(" — ", "–")}</td><td><b>{x.role}</b>, {x.org}. {x.points[0]}</td><td>A.P.</td></tr>)}
                                    <tr className="bp-next"><td>{String.fromCharCode(65 + experience.length)}</td><td>Next</td><td><b>Your team.</b> Full-stack, Ahmedabad on-site or hybrid. Available now.</td><td>?</td></tr>
                                </tbody>
                            </table>
                        );
                        return (
                            <div key={i} className="bp-approve" style={{ left: it.x, top: it.y }}>
                                <p className="bp-hand">for review →</p>
                                <div className="bp-stampbox">
                                    <p>Approved for hire</p>
                                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                                    <p className="bp-sign">Signature <span /> Date <span /></p>
                                </div>
                                <a className="bp-btn" href={profile.resume} target="_blank" rel="noreferrer">Print the résumé (PDF)</a>
                                <a className="bp-btn" href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp {profile.phone}</a>
                            </div>
                        );
                    })}
                    <div className="cv-mate" style={{ transform: `translate(${mate.x}px, ${mate.y}px)` }} aria-hidden>
                        <svg viewBox="0 0 24 24"><path d="M3 21l3.5-1 12-12-2.5-2.5-12 12z" /><path d="M15.5 5.5l2.5-2.5 3 3-2.5 2.5" /></svg><span>{mate.label}</span>
                    </div>
                </div>
            </div>

            {focus && (
                <aside className="cv-inspect" aria-label={`${focus.title}, details`} onKeyDown={(e) => { if (e.key === "Escape") setFocus(null); }}>
                    <button type="button" className="cv-x" aria-label="Close" autoFocus onClick={() => setFocus(null)}>×</button>
                    <p className="cv-tag">Sheet {String(work.indexOf(focus) + 1).padStart(2, "0")} · {KINDS[focus.kind]} · {focus.year}</p>
                    <h2>{focus.title}</h2>
                    <p>{focus.line}</p>
                    {focus.stack && <p className="cv-stack">{focus.stack}</p>}
                    <p className="cv-links">
                        {cases[focus.slug] && <a className="cv-btn" href={`/case.html?p=${focus.slug}`}>Case study →</a>}
                        {focus.url && <a className="cv-btn ghost" href={focus.url} target="_blank" rel="noreferrer">{focus.url.includes("github.com") ? "View Code ↗" : "Visit Live Site ↗"}</a>}
                    </p>
                    <p className="cv-nav-hint">Keys: ← / → step sheets · Esc close · 0 fit all</p>
                </aside>
            )}

            <div className="cv-mini" aria-label="Key plan" role="img" onClick={(e) => { const b = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - b.left) / MM, y = (e.clientY - b.top) / MM; const R = vp.current.getBoundingClientRect(); apply({ ...view.current, x: R.width / 2 - x * view.current.k, y: R.height / 2 - y * view.current.k }, true); }}
                style={{ width: W * MM, height: H * MM }}>
                {sections.map((s) => <i key={s.id} style={{ left: s.x * MM, top: s.y * MM, width: s.w * MM, height: s.h * MM }} />)}
                {vpSize.w > 0 && <b style={{ left: -vstate.x / vstate.k * MM, top: -vstate.y / vstate.k * MM, width: vpSize.w / vstate.k * MM, height: vpSize.h / vstate.k * MM }} />}
            </div>
        </div>
    );
}
