import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { profile } from "#content/profile.js";
import { shot } from "../../../content/work.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import { track } from "../../analytics.js";
import { STOPS, END, LENGTH } from "./route.js";
import Scene from "./Scene.jsx";
import "./ride.css";

// World 12: RIDE, "Golden hour highway". A motorbike ride out of Ahmedabad at golden hour; each project is a roadside
// billboard showing the real site, announced by a green highway sign. It cruises on its own like a film (and eases off
// at every stop so the card can be read); scroll or the arrow keys ride faster, Space pauses, M opens the map.
// Low-power devices and reduced motion get the same journey as a 2D route map.
const FONTS = ["Saira+Condensed:wght@600;800", "Saira:wght@400;600"];
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const lowPower = () => {
    try {
        if (!document.createElement("canvas").getContext("webgl2")) return true;
        return (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
    } catch { return true; }
};
const CRUISE = 13, MAX = 42;                                       // m/s: ~47 km/h cruise, ~150 km/h flat out
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Speedo({ kmh, visited }) {
    const a = -120 + Math.min(1, kmh / 160) * 240;
    return (
        <div className="rd-speedo" aria-label={`${Math.round(kmh)} km per hour, ${visited} of ${STOPS.length} projects visited`}>
            <svg viewBox="0 0 120 120" aria-hidden>
                <circle cx="60" cy="60" r="56" className="rd-dial" />
                {Array.from({ length: 17 }, (_, i) => { const t = (-120 + i * 15) * Math.PI / 180, r1 = i % 2 ? 46 : 42; return <line key={i} x1={60 + Math.sin(t) * r1} y1={60 - Math.cos(t) * r1} x2={60 + Math.sin(t) * 52} y2={60 - Math.cos(t) * 52} className="rd-tick" />; })}
                {[0, 40, 80, 120, 160].map((v, i) => { const t = (-120 + i * 60) * Math.PI / 180; return <text key={v} x={60 + Math.sin(t) * 33} y={64 - Math.cos(t) * 33} className="rd-num">{v}</text>; })}
                <line x1="60" y1="60" x2="60" y2="14" className="rd-needle" style={{ transform: `rotate(${a}deg)` }} />
                <circle cx="60" cy="60" r="5" className="rd-hub" />
            </svg>
            <p className="rd-kmh"><b>{Math.round(kmh)}</b> km/h</p>
            <p className="rd-odo"><span>{String(visited).padStart(2, "0")}</span>/{STOPS.length} projects</p>
        </div>
    );
}

function StopCard({ stop }) {
    if (!stop) return null;
    const href = cases[stop.w.slug] ? `/case.html?p=${stop.w.slug}` : null;
    return (
        <aside className="rd-card" key={stop.i} aria-live="polite">
            <p className="rd-kicker">Stop {stop.i + 1} of {STOPS.length} · {stop.kind} · {stop.status}</p>
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

function RouteMap({ onGo, onClose, here }) {
    return (
        <section className="rd-map" role="dialog" aria-label="Route map: every stop">
            <header><h2>Route map</h2><p>NH-PX01 · Ahmedabad → your team · {(LENGTH / 1000).toFixed(1)} km · {STOPS.length} stops</p>{onClose && <button type="button" onClick={onClose}>Back to the ride</button>}</header>
            <ol>{STOPS.map((s) => (
                <li key={s.i} data-here={Math.abs(here - s.d) < 37 || undefined}>
                    <button type="button" onClick={() => onGo?.(s)} disabled={!onGo}>
                        <img src={shot(s.w, 240)} alt="" loading="lazy" />
                        <span><small>km {(s.d / 1000).toFixed(2)} · {s.kind}</small><b>{s.title}</b><small>{s.w.line}</small>{s.w.stack && <small className="rd-map-stack">{s.w.stack}</small>}</span>
                    </button>
                    {s.w.url && <a href={s.w.url} target="_blank" rel="noreferrer">Visit ↗</a>}
                </li>
            ))}
                <li className="rd-map-end"><b>Next exit: your team.</b> <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> · <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a></li>
            </ol>
        </section>
    );
}

const BIOMES = [["golden", "Golden Hour"], ["fjord", "Fjord"], ["sakura", "Kyoto Touge"]];

export default function RideWorld() {
    useFonts(FONTS);
    const [flat] = useState(() => reduced || lowPower());
    const [force3d, setForce3d] = useState(false);
    const state = useRef({ d: 0, v: 0, cruise: true, push: 0, hold: 0, snap: true });
    const [hud, setHud] = useState({ d: 0, v: 0 });
    const [started, setStarted] = useState(false);
    const [map, setMap] = useState(false);
    const [cruise, setCruise] = useState(true);
    const [preset, setPreset] = useState("golden");
    const [near, setNear] = useState(0);
    const visitedRef = useRef(new Set());
    const show3d = !flat || force3d;

    // the ride itself: speed eases toward a target; cruising eases off around every stop
    useEffect(() => {
        if (!show3d) return;
        let raf, last = performance.now();
        const tick = (now) => {
            const s = state.current, dt = Math.min(0.05, (now - last) / 1000); last = now;
            let target = 0;
            if (started) {
                if (s.cruise) {
                    const next = STOPS.find((st) => st.d > s.d - 18);
                    const gap = next ? next.d - s.d : 999;
                    target = gap < 26 && gap > -18 ? 3.2 : CRUISE;          // slow roll past each billboard
                }
                target = Math.max(target, s.push);
                if (s.hold) target = s.hold > 0 ? MAX : 0;
            }
            s.v += (target - s.v) * (1 - Math.exp(-dt * (target > s.v ? 1.6 : 2.4)));
            s.push *= Math.exp(-dt * 1.4);
            s.d = Math.min(END + 30, Math.max(0, s.d + s.v * dt));
            STOPS.forEach((st) => { if (s.d > st.d && !visitedRef.current.has(st.i)) { visitedRef.current.add(st.i); track("ride_stop", { project: st.w.slug }); } });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const hudT = setInterval(() => { const s = state.current; setHud({ d: s.d, v: s.v }); setNear((n) => (Math.abs(n - s.d) > 40 ? s.d : n)); }, 120);
        return () => { cancelAnimationFrame(raf); clearInterval(hudT); };
    }, [show3d, started]);

    // input: wheel and touch drags push speed; arrows hold throttle / brake; Space toggles cruise; M map
    useEffect(() => {
        if (!show3d) return;
        const s = state.current;
        const begin = () => setStarted(true);
        const wheel = (e) => { if (e.target.closest?.(".rd-map, .rd-card")) return; e.preventDefault(); begin(); s.push = Math.min(MAX, Math.max(0, s.push + e.deltaY * 0.05)); };
        let ty = null;
        const ts = (e) => { ty = e.touches[0].clientY; };
        const tm = (e) => { if (ty == null || e.target.closest?.(".rd-map, .rd-card, a, button")) return; const dy = ty - e.touches[0].clientY; ty = e.touches[0].clientY; begin(); s.push = Math.min(MAX, Math.max(0, s.push + dy * 0.12)); };
        const kd = (e) => {
            if (e.target.closest?.("input, textarea")) return;
            if (["ArrowUp", "w", "W"].includes(e.key)) { e.preventDefault(); begin(); s.hold = 1; }
            else if (["ArrowDown", "s", "S"].includes(e.key)) { e.preventDefault(); s.hold = -1; }
            else if (e.key === " ") { e.preventDefault(); begin(); s.cruise = !s.cruise; setCruise(s.cruise); }
            else if (e.key === "m" || e.key === "M") setMap((m) => !m);
            else if (e.key === "b" || e.key === "B") setPreset((p) => BIOMES[(BIOMES.findIndex(([id]) => id === p) + 1) % BIOMES.length][0]);
        };
        const ku = (e) => { if (["ArrowUp", "w", "W", "ArrowDown", "s", "S"].includes(e.key)) s.hold = 0; };
        addEventListener("wheel", wheel, { passive: false }); addEventListener("touchstart", ts, { passive: true }); addEventListener("touchmove", tm, { passive: true });
        addEventListener("keydown", kd); addEventListener("keyup", ku);
        return () => { removeEventListener("wheel", wheel); removeEventListener("touchstart", ts); removeEventListener("touchmove", tm); removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
    }, [show3d]);

    const go = (stop) => { const s = state.current; s.d = Math.max(0, stop.d - 30); s.v = 4; s.snap = true; setMap(false); setStarted(true); setHud({ d: s.d, v: s.v }); setNear(s.d); };
    const stop = STOPS.find((s) => hud.d > s.d - 28 && hud.d < s.d + 22);
    const atEnd = hud.d > END - 40;
    const visited = STOPS.filter((s) => hud.d > s.d).length;

    if (!show3d) {
        return (
            <div className="rd rd-flat">
                <header className="rd-top"><p className="rd-brand">RIDE <span>· Aman Patel, full-stack engineer</span></p>
                    <nav><a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a><a href={`mailto:${profile.email}`}>Email</a><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></nav></header>
                <p className="rd-flat-note">{reduced ? "Reduced motion is on, so here is the route as a map." : "This device looks light on graphics power, so here is the route as a map."} <button type="button" onClick={() => setForce3d(true)}>Ride in 3D anyway</button></p>
                <RouteMap here={-999} />
            </div>
        );
    }

    const stepStop = (dir) => {
        const curIdx = STOPS.findIndex((s) => s.d > state.current.d - 18);
        const idx = curIdx === -1 ? STOPS.length - 1 : Math.max(0, Math.min(STOPS.length - 1, curIdx + dir));
        go(STOPS[idx]);
    };

    return (
        <div className="rd" data-started={started || undefined} data-preset={preset}>
            <Canvas className="rd-canvas" shadows dpr={[1, 1.6]} camera={{ fov: 52, near: 0.5, far: 1200, position: [-8, 3, 10] }} gl={{ antialias: true, powerPreference: "high-performance" }}>
                <Suspense fallback={null}><Scene state={state} near={near} preset={preset} /></Suspense>
            </Canvas>
            <div className="rd-grade" aria-hidden />

            <header className="rd-top">
                <p className="rd-brand">RIDE <span>· Aman Patel, full-stack engineer · Ahmedabad</span></p>
                <div className="rd-biomes" role="group" aria-label="Biome">
                    {BIOMES.map(([id, label]) => (
                        <button key={id} type="button" aria-pressed={preset === id} onClick={() => setPreset(id)}>{label}</button>
                    ))}
                </div>
                <nav>
                    <button type="button" onClick={() => setMap(true)}>Map</button>
                    <a href={profile.resume} target="_blank" rel="noreferrer" onClick={() => track("resume_opened", { from: "world" })}>Résumé</a>
                    <a href={`mailto:${profile.email}`}>Email</a>
                </nav>
            </header>

            {!started && (
                <section className="rd-intro">
                    <p className="rd-kicker">NH-PX01 · Ahmedabad → your team · {(LENGTH / 1000).toFixed(1)} km</p>
                    <h1>Golden hour.<br />{STOPS.length} projects down the road.</h1>
                    <p>Every billboard on this highway is something Aman built, and most of them are live right now. It rides itself; scroll to go faster.</p>
                    <div className="rd-intro-cta">
                        <button type="button" className="rd-btn rd-go rd-start" onClick={() => setStarted(true)}>Start the ride</button>
                        <button type="button" className="rd-btn" onClick={() => setMap(true)}>See the route map</button>
                    </div>
                </section>
            )}

            {started && <Speedo kmh={hud.v * 3.6} visited={visited} />}
            {started && !atEnd && <StopCard stop={stop} />}
            {atEnd && (
                <aside className="rd-card rd-end">
                    <p className="rd-kicker">Next exit</p>
                    <h2>Your team.</h2>
                    <p>That was all {STOPS.length}. If one of them looked like the work you need, Aman is a full-stack engineer in Ahmedabad, open to on-site or hybrid roles.</p>
                    <p className="rd-actions">
                        <a className="rd-btn rd-go" href={`mailto:${profile.email}`}>{profile.email}</a>
                        <a className="rd-btn" href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
                        <a className="rd-btn" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
                        <button type="button" className="rd-btn" onClick={() => go(STOPS[0])}>Ride again</button>
                    </p>
                </aside>
            )}
            {started && (
                <p className="rd-hint">
                    <button type="button" onClick={() => stepStop(-1)} aria-label="Previous stop">← Prev</button>
                    <button type="button" onClick={() => { state.current.cruise = !state.current.cruise; setCruise(state.current.cruise); }}>{cruise ? "Cruise on" : "Cruise off"}</button>
                    <button type="button" onClick={() => stepStop(1)} aria-label="Next stop">Next →</button>
                    <span>Scroll / ↑ faster · Space pause · B biome · M map</span>
                </p>
            )}
            <p className="rd-progress" aria-hidden><i style={{ width: `${Math.min(100, (hud.d / END) * 100)}%` }} /></p>
            {map && <RouteMap here={hud.d} onGo={go} onClose={() => setMap(false)} />}
            <p className="rd-credit">Trees &amp; rocks: Kenney (CC0) · Motorcycle: Poly by Google, CC BY 3.0</p>
        </div>
    );
}
