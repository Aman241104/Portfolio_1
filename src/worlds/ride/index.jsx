import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { profile, socials } from "#content/profile.js";
import { shot, KINDS, host } from "../../../content/work.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import { track } from "../../analytics.js";
import { STOPS, SECTORS } from "./track.js";
import Scene, { setActiveTicket } from "./Scene.jsx";
import { detectQualityTier } from "../../three/cinematography.js";
import "./ride.css";

// World 12: RIDE — the PX-01 test track. Drive a classic coupe around a miniature circuit; every project is a printed
// ticket standing beside the track, and pulling up next to one opens it. Arrows/WASD drive, Space handbrakes,
// R puts the car back on the track, M opens the full list. Low-power devices and reduced motion get the list.
const FONTS = ["Saira+Condensed:wght@600;800", "Saira:wght@400;600"];
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const lowPower = () => {
    try {
        if (!document.createElement("canvas").getContext("webgl2")) return true;
        return (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
    } catch { return true; }
};
const linkedin = socials.find((s) => s.text === "LinkedIn")?.link;
const KEYS = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right", " ": "brake" };

function StopCard({ stop }) {
    if (!stop) return null;
    const href = cases[stop.w.slug] ? `/case.html?p=${stop.w.slug}` : null;
    return (
        <aside className="rd-card" key={stop.i} aria-live="polite">
            <p className="rd-kicker">Ticket {String(stop.i + 1).padStart(2, "0")} of {STOPS.length} · {stop.kind} · {stop.status}</p>
            <h2>{stop.title}</h2>
            <p>{stop.w.line}</p>
            {stop.w.stack && <p className="rd-stack">{stop.w.stack}</p>}
            <p className="rd-actions">
                {stop.w.url && <a className="rd-btn rd-go" href={stop.w.url} target="_blank" rel="noreferrer">{stop.w.url.includes("github.com") ? "View code" : `Visit ${host(stop.w.url)}`}</a>}
                {href && <a className="rd-btn" href={href}>Case study</a>}
            </p>
        </aside>
    );
}

function TicketList({ onGo, onClose, here = -1 }) {
    const [kind, setKind] = useState("all");
    const [q, setQ] = useState("");
    const query = q.trim().toLowerCase();
    const list = STOPS.filter((s) =>
        (kind === "all" || s.w.kind === kind) &&
        (!query || s.title.toLowerCase().includes(query) || (s.w.stack || "").toLowerCase().includes(query) || s.w.line.toLowerCase().includes(query))
    );
    return (
        <section className="rd-map" role="dialog" aria-label="Every ticket on the track">
            <header>
                <h2>Track sheet</h2>
                <p>PX-01 test track · {STOPS.length} tickets in {SECTORS.length} sectors</p>
                {onClose && <button type="button" onClick={onClose}>Back to the track</button>}
            </header>
            <div className="rd-map-tools">
                <div className="rd-map-filters" role="tablist" aria-label="Filter tickets">
                    {Object.entries({ all: "All", ...KINDS }).map(([k, label]) => (
                        <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>{label}</button>
                    ))}
                </div>
                <input id="rd-map-search" name="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search project or stack (e.g. FastAPI, Three.js)…" aria-label="Search tickets" />
            </div>
            <ol>{list.map((s) => (
                <li key={s.i} data-here={here === s.i || undefined}>
                    <button type="button" onClick={() => onGo?.(s)} disabled={!onGo}>
                        <img src={shot(s.w, 240)} alt="" loading="lazy" />
                        <span><small>№ {String(s.i + 1).padStart(2, "0")} · {s.kind}</small><b>{s.title}</b><small>{s.w.line}</small>{s.w.stack && <small className="rd-map-stack">{s.w.stack}</small>}</span>
                    </button>
                    {s.w.url && <a href={s.w.url} target="_blank" rel="noreferrer">Visit ↗</a>}
                </li>
            ))}
                <li className="rd-map-end"><b>Finish line: your team.</b> <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> · <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a> · {linkedin && <><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · </>}<a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a></li>
            </ol>
        </section>
    );
}

function Pad({ input, k, label, children }) {
    const set = (v) => () => { input.current[k] = v; };
    return <button type="button" aria-label={label} onPointerDown={set(1)} onPointerUp={set(0)} onPointerLeave={set(0)} onPointerCancel={set(0)}>{children}</button>;
}

export default function RideWorld() {
    useFonts(FONTS);
    const [flat] = useState(() => reduced || lowPower());
    const [force3d, setForce3d] = useState(false);
    const input = useRef({ up: 0, down: 0, left: 0, right: 0, brake: 0 });
    const api = useRef(null);
    const [started, setStarted] = useState(false);
    const [map, setMap] = useState(false);
    const [near, setNear] = useState(-1);
    const kmh = useRef(null);
    const seen = useRef(new Set());
    const [tier] = useState(detectQualityTier);
    const show3d = !flat || force3d;

    const onNear = useCallback((i) => {
        setNear(i); setActiveTicket(i);
        if (i >= 0 && !seen.current.has(i)) { seen.current.add(i); track("ride_stop", { project: STOPS[i].w.slug }); }
    }, []);
    const onSpeed = useCallback((v) => { if (kmh.current) kmh.current.textContent = String(Math.round(Math.abs(v) * 3.6)).padStart(3, "0"); }, []);

    useEffect(() => {
        if (!show3d) return;
        const kd = (e) => {
            if (e.target.closest?.("input, textarea")) return;
            const k = KEYS[e.key];
            if (k) { e.preventDefault(); input.current[k] = 1; setStarted(true); }
            else if (e.key === "m" || e.key === "M") setMap((m) => !m);
            else if (e.key === "r" || e.key === "R") api.current?.reset();
        };
        const ku = (e) => { const k = KEYS[e.key]; if (k) input.current[k] = 0; };
        const blur = () => Object.keys(input.current).forEach((k) => { input.current[k] = 0; });
        addEventListener("keydown", kd); addEventListener("keyup", ku); addEventListener("blur", blur);
        return () => { removeEventListener("keydown", kd); removeEventListener("keyup", ku); removeEventListener("blur", blur); };
    }, [show3d]);

    if (!show3d) {
        return (
            <div className="rd rd-flat">
                <header className="rd-top"><p className="rd-brand">RIDE <span>· Aman Patel, full-stack engineer</span></p>
                    <nav><a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a><a href={`mailto:${profile.email}`}>Email</a><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></nav></header>
                <p className="rd-flat-note">{reduced ? "Reduced motion is on, so here is the track as a list." : "This device looks light on graphics power, so here is the track as a list."} <button type="button" onClick={() => setForce3d(true)}>Drive in 3D anyway</button></p>
                <TicketList />
            </div>
        );
    }

    const go = (s) => { api.current?.go(s); setMap(false); setStarted(true); };

    return (
        <div className="rd" data-started={started || undefined}>
            <Canvas className="rd-canvas" shadows={tier.name !== "LOW" ? "soft" : false} dpr={tier.dpr} camera={{ fov: 30, near: 1, far: 400, position: [-24, 33, 68] }} gl={{ antialias: tier.name !== "LOW", powerPreference: "high-performance" }}>
                <Suspense fallback={null}><Scene input={input} api={api} onNear={onNear} onSpeed={onSpeed} tier={tier.name} /></Suspense>
            </Canvas>

            <header className="rd-top">
                <p className="rd-brand">RIDE <span>· PX-01 test track · Aman Patel</span></p>
                <nav>
                    <button type="button" onClick={() => setMap(true)}>Tickets ({STOPS.length})</button>
                    <a href={profile.resume} target="_blank" rel="noreferrer" onClick={() => track("resume_opened", { from: "world" })}>Résumé</a>
                    <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                    <a href={`mailto:${profile.email}`}>Email</a>
                </nav>
            </header>

            {!started && (
                <section className="rd-intro">
                    <p className="rd-kicker">PX-01 test track · {STOPS.length} tickets · {SECTORS.length} sectors</p>
                    <h1>Take it for a spin.</h1>
                    <p>Every ticket standing round this track is something Aman built, and most of them are live right now. Pull up next to one to open it.</p>
                    <div className="rd-intro-cta">
                        <button type="button" className="rd-btn rd-go rd-start" onClick={() => setStarted(true)}>Start driving</button>
                        <button type="button" className="rd-btn" onClick={() => setMap(true)}>Just show me the list</button>
                    </div>
                </section>
            )}

            {started && near >= 0 && !map && <StopCard stop={STOPS[near]} />}
            {started && <p className="rd-speed" aria-hidden><b ref={kmh}>000</b> km/h</p>}
            {started && (
                <div className="rd-hint">
                    <div className="rd-pads">
                        <Pad input={input} k="left" label="Steer left">◀</Pad>
                        <Pad input={input} k="right" label="Steer right">▶</Pad>
                        <Pad input={input} k="brake" label="Handbrake">HB</Pad>
                        <Pad input={input} k="down" label="Brake / reverse">▼</Pad>
                        <Pad input={input} k="up" label="Accelerate">▲</Pad>
                    </div>
                    <span>WASD / arrows drive · Space handbrake · R reset · M tickets</span>
                </div>
            )}
            {map && <TicketList here={near} onGo={go} onClose={() => setMap(false)} />}
        </div>
    );
}
