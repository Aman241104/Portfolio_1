import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import "./arcade.css";

// World 9: SHIP·BREAKER. An 80s arcade cabinet: every brick is a project, break it to unlock it.
// Features AI attract-mode demo, Web Audio chiptune SFX, multi-ball/wide/pierce skill capsules,
// live brick inspector, and localStorage fallback scoreboard.
const FONTS = ["Bungee", "Silkscreen:wght@400;700"];
const COLORS = { product: "#e8392b", mobile: "#ffd23f", client: "#2f6fe4", concept: "#f2efe8" };
const SKILLS = skillGroups.flatMap((g) => g.items.map(([n]) => n));
const W = 640, H = 480, COLS = 7;
const LS_KEY = "px01-arcade-scores";

const level = () => {
    const ordered = ["product", "mobile", "client", "concept"].flatMap((k) => work.filter((w) => w.kind === k));
    const bw = (W - 40 - (COLS - 1) * 6) / COLS;
    return ordered.map((p, i) => ({ p, x: 20 + (i % COLS) * (bw + 6), y: 58 + Math.floor(i / COLS) * 26, w: bw, h: 20, alive: true }));
};
const reducedMotion = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fresh = (demo = false) => ({
    bricks: level(),
    score: 0,
    lives: 3,
    caps: [],
    parts: [],
    flashes: [],
    pops: [],
    trail: [],
    stop: 0,
    shake: 0,
    combo: 0,
    pierce: 0,
    pad: { x: W / 2 - 50, w: 100 },
    balls: [{ x: W / 2, y: H - 60, vx: demo ? 3.1 : 0, vy: demo ? -4.8 : 0, stuck: !demo }],
});

function loadLocalScores() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveLocalScore(entry) {
    const next = [...loadLocalScores(), entry].sort((a, b) => b.score - a.score).slice(0, 10);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    return next;
}

export default function ShipBreaker() {
    useFonts(FONTS);
    const cv = useRef(null), game = useRef(null), keys = useRef({});
    const audioCtx = useRef(null);
    const [hud, setHud] = useState({ score: 0, lives: 3, state: "attract" });
    const [got, setGot] = useState([]);
    const [all, setAll] = useState(() => typeof window !== "undefined" && matchMedia("(max-width: 760px)").matches);
    const [toast, setToast] = useState(null);
    const [inspected, setInspected] = useState(work[0]);
    const [scores, setScores] = useState([]);
    const [initials, setInitials] = useState("");
    const [saved, setSaved] = useState(null);
    const [muted, setMuted] = useState(false);
    const mutedRef = useRef(false);
    const hudRef = useRef("attract"), launchRef = useRef(null), startRef = useRef(null);

    useEffect(() => { mutedRef.current = muted; }, [muted]);

    const blip = useCallback((freq = 440, dur = 0.06, type = "square", gain = 0.06) => {
        if (mutedRef.current || hudRef.current === "attract") return;
        try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            if (!audioCtx.current) audioCtx.current = new Ctx();
            const ctx = audioCtx.current;
            if (ctx.state === "suspended") ctx.resume();
            const osc = ctx.createOscillator(), g = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            g.gain.setValueAtTime(gain, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(g); g.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + dur);
        } catch { /* audio blocked */ }
    }, []);

    useEffect(() => {
        game.current = fresh(true);
        fetch("/api/scores")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => setScores(d.scores?.length ? d.scores : loadLocalScores()))
            .catch(() => setScores(loadLocalScores()));
    }, []);

    const launch = useCallback(() => {
        const g = game.current;
        if (["over", "won"].includes(hudRef.current)) {
            game.current = fresh(false);
            setGot([]); setSaved(null); setInitials("");
            setHud({ score: 0, lives: 3, state: "ready" });
            blip(523, 0.08);
            return;
        }
        const stuck = g.balls.find((b) => b.stuck);
        if (stuck) {
            stuck.stuck = false;
            stuck.vx = 3.2 * (Math.random() < 0.5 ? -1 : 1);
            stuck.vy = -5.2;
            setHud((h) => ({ ...h, state: "play" }));
            blip(660, 0.07);
        }
    }, [blip]);

    const start = useCallback(() => {
        if (hudRef.current === "attract") {
            game.current = fresh(false);
            setHud({ score: 0, lives: 3, state: "ready" });
            blip(880, 0.1);
        } else {
            launch();
        }
    }, [blip, launch]);

    useEffect(() => {
        const c = cv.current, ctx = c.getContext("2d");
        let raf, acc = 0, prev = performance.now();

        const step = () => {
            const g = game.current, p = g.pad, isDemo = hudRef.current === "attract";
            if (isDemo && g.balls[0]) {
                const target = g.balls[0].x - p.w / 2;
                p.x += (target - p.x) * 0.14;
            } else {
                if (keys.current.ArrowLeft) p.x -= 8;
                if (keys.current.ArrowRight) p.x += 8;
            }
            p.x = Math.max(0, Math.min(W - p.w, p.x));
            if (g.pierce > 0) g.pierce--;

            for (const b of g.balls) {
                if (b.stuck) { b.x = p.x + p.w / 2; b.y = H - 38; continue; }
                g.trail.push({ x: b.x, y: b.y, life: 8 });
                b.x += b.vx; b.y += b.vy;
                if (b.x < 6 || b.x > W - 6) { b.vx *= -1; b.x = Math.max(6, Math.min(W - 6, b.x)); blip(320, 0.04); }
                if (b.y < 6) { b.vy *= -1; b.y = 6; blip(320, 0.04); }
                if (b.vy > 0 && b.y > H - 34 && b.y < H - 22 && b.x > p.x - 4 && b.x < p.x + p.w + 4) {
                    const t = (b.x - (p.x + p.w / 2)) / (p.w / 2), sp = Math.min(9, Math.hypot(b.vx, b.vy) + 0.06);
                    b.vx = sp * Math.sin(t * 1.05); b.vy = -sp * Math.cos(t * 1.05); b.y = H - 34;
                    g.combo = 0; p.squash = 6;
                    blip(440, 0.05);
                }
                for (const k of g.bricks) {
                    if (!k.alive || b.x < k.x - 5 || b.x > k.x + k.w + 5 || b.y < k.y - 5 || b.y > k.y + k.h + 5) continue;
                    k.alive = false;
                    if (!isDemo) {
                        g.combo += 1; g.score += 100 * g.combo;
                        g.stop = 36; g.shake = Math.max(g.shake, 3);
                        blip(380 + Math.min(8, g.combo) * 65, 0.07);
                        setGot((x) => (x.includes(k.p.slug) ? x : [...x, k.p.slug]));
                        setInspected(k.p);
                        setToast({ t: k.p.title, k: k.p.kind, id: Math.random() });
                    }
                    g.flashes.push({ x: k.x, y: k.y, w: k.w, h: k.h, life: 9 });
                    if (!isDemo && g.combo > 1) g.pops.push({ x: k.x + k.w / 2, y: k.y, text: `x${g.combo} COMBO`, life: 48 });
                    if (g.pierce <= 0) {
                        const ox = Math.min(Math.abs(b.x - k.x), Math.abs(b.x - k.x - k.w)), oy = Math.min(Math.abs(b.y - k.y), Math.abs(b.y - k.y - k.h));
                        if (ox < oy) b.vx *= -1; else b.vy *= -1;
                    }
                    for (let i = 0; i < 10; i++) g.parts.push({ x: k.x + k.w / 2, y: k.y + k.h / 2, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 24, c: COLORS[k.p.kind] });
                    if (!isDemo && Math.random() < 0.28) {
                        const kind = Math.random() < 0.28 ? "MULTI" : Math.random() < 0.45 ? "PIERCE" : "WIDE";
                        g.caps.push({ x: k.x + k.w / 2, y: k.y, kind, s: kind === "WIDE" ? SKILLS[Math.floor(Math.random() * SKILLS.length)] : kind });
                    }
                    break;
                }
            }

            if (g.trail.length > 36) g.trail.splice(0, g.trail.length - 36);
            g.balls = g.balls.filter((b) => b.y <= H + 10);

            if (!isDemo) {
                for (const cp of g.caps) {
                    cp.y += 2.4;
                    if (cp.y > H - 34 && cp.y < H - 18 && cp.x > p.x && cp.x < p.x + p.w) {
                        cp.done = true; g.score += 50;
                        blip(784, 0.11, "triangle");
                        if (cp.kind === "MULTI" && g.balls.length < 3 && g.balls[0]) {
                            const b0 = g.balls[0];
                            g.balls.push({ x: b0.x, y: b0.y, vx: -b0.vx || 3.2, vy: b0.vy || -4.8, stuck: false });
                            setToast({ t: "+ MULTI-BALL!", k: "skill", id: Math.random() });
                        } else if (cp.kind === "PIERCE") {
                            g.pierce = 360;
                            setToast({ t: "+ PIERCE LASER!", k: "skill", id: Math.random() });
                        } else {
                            p.w = Math.min(175, p.w + 18);
                            setToast({ t: `+ ${cp.s}`, k: "skill", id: Math.random() });
                        }
                    }
                }
                g.caps = g.caps.filter((cp) => !cp.done && cp.y < H);
            }

            if (g.balls.length === 0) {
                if (isDemo) { game.current = fresh(true); return; }
                g.lives -= 1; g.shake = 14; g.combo = 0; g.pierce = 0;
                blip(160, 0.22, "sawtooth");
                if (g.lives <= 0) setHud({ score: g.score, lives: 0, state: "over" });
                else {
                    g.pad = { x: W / 2 - 50, w: g.pad.w };
                    g.balls = [{ x: W / 2, y: H - 60, vx: 0, vy: 0, stuck: true }];
                    setHud({ score: g.score, lives: g.lives, state: "ready" });
                }
                return;
            }
            if (g.bricks.every((k) => !k.alive)) {
                if (isDemo) { game.current = fresh(true); return; }
                g.balls.forEach((b) => { b.stuck = true; });
                blip(988, 0.24, "triangle");
                setHud({ score: g.score, lives: g.lives, state: "won" });
            }
        };

        const draw = (t) => {
            const g = game.current;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W, H);
            if (g.shake > 0.3 && !reducedMotion) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
            g.shake *= 0.86;
            ctx.textBaseline = "middle"; ctx.textAlign = "center";
            ctx.font = "700 8px Silkscreen, monospace";
            for (const k of g.bricks) {
                if (!k.alive) continue;
                ctx.fillStyle = COLORS[k.p.kind]; ctx.fillRect(k.x, k.y, k.w, k.h);
                ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(k.x, k.y, k.w, 2);
                ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(k.x, k.y + k.h - 2, k.w, 2);
                const label = k.p.title.length > 10 ? `${k.p.title.slice(0, 9)}…` : k.p.title;
                ctx.fillStyle = k.p.kind === "client" ? "#fff" : "#111";
                ctx.fillText(label.toUpperCase(), k.x + k.w / 2, k.y + k.h / 2 + 1);
            }
            for (const f of g.flashes) { ctx.fillStyle = `rgba(255,255,255,${f.life / 9})`; ctx.fillRect(f.x - (9 - f.life), f.y - (9 - f.life) / 2, f.w + (9 - f.life) * 2, f.h + 9 - f.life); f.life--; }
            g.flashes = g.flashes.filter((f) => f.life > 0);
            for (const pt of g.parts) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.18; pt.life--; ctx.fillStyle = pt.c; ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 4, 4); }
            g.parts = g.parts.filter((pt) => pt.life > 0);
            for (const tr of g.trail) {
                tr.life--;
                ctx.fillStyle = g.pierce > 0 ? `rgba(232,57,43,${tr.life / 16})` : `rgba(242,239,232,${tr.life / 24})`;
                ctx.fillRect(Math.round(tr.x) - 3, Math.round(tr.y) - 3, 6, 6);
            }
            g.trail = g.trail.filter((tr) => tr.life > 0);
            ctx.font = "700 9px Silkscreen, monospace";
            for (const cp of g.caps) {
                ctx.fillStyle = cp.kind === "MULTI" ? "#2f6fe4" : cp.kind === "PIERCE" ? "#e8392b" : "#ffd23f";
                ctx.fillRect(cp.x - 38, cp.y - 8, 76, 16);
                ctx.fillStyle = cp.kind === "WIDE" ? "#111" : "#fff";
                ctx.fillText(cp.s.slice(0, 11).toUpperCase(), cp.x, cp.y + 1);
            }
            const p = g.pad, sq = reducedMotion ? 0 : (p.squash || 0); p.squash = sq * 0.8;
            ctx.fillStyle = "#f2efe8"; ctx.fillRect(Math.round(p.x - sq), H - 30 + sq / 2, p.w + sq * 2, 10 - sq / 2);
            ctx.fillStyle = "#e8392b"; ctx.fillRect(Math.round(p.x - sq), H - 30 + sq / 2, 8, 10 - sq / 2); ctx.fillRect(Math.round(p.x + p.w + sq - 8), H - 30 + sq / 2, 8, 10 - sq / 2);
            ctx.textAlign = "center";
            for (const pp of g.pops) {
                const age = 48 - pp.life, sc = reducedMotion ? 1 : age < 8 ? 0.6 + age * 0.08 : 1.24 - Math.min(0.24, (age - 8) * 0.03);
                ctx.save(); ctx.translate(pp.x, pp.y - age * 0.6); ctx.scale(sc, sc);
                ctx.font = "400 14px Silkscreen, monospace"; ctx.fillStyle = `rgba(255,210,63,${Math.min(1, pp.life / 16)})`; ctx.fillText(pp.text, 0, 0);
                ctx.restore(); pp.life--;
            }
            g.pops = g.pops.filter((pp) => pp.life > 0);
            for (const b of g.balls) {
                ctx.fillStyle = g.pierce > 0 ? "#ff4d3d" : "#f2efe8";
                ctx.fillRect(Math.round(b.x) - 5, Math.round(b.y) - 5, 10, 10);
            }
            ctx.font = "400 14px Silkscreen, monospace"; ctx.textAlign = "left"; ctx.fillStyle = "#e8392b"; ctx.fillText("1UP", 16, 20);
            ctx.fillStyle = "#f2efe8"; ctx.fillText(String(g.score).padStart(6, "0"), 60, 20);
            ctx.textAlign = "center"; ctx.fillStyle = "#e8392b"; ctx.fillText("HI-SCORE", W / 2 - 40, 20);
            ctx.fillStyle = "#f2efe8"; ctx.fillText(String(Math.max(g.score, hiRef.current)).padStart(6, "0"), W / 2 + 50, 20);
            ctx.textAlign = "right"; ctx.fillStyle = "#ffd23f"; ctx.fillText("■ ".repeat(Math.max(0, g.lives)).trim(), W - 16, 20);
            if (hudRef.current === "attract" && (reducedMotion || Math.floor(t / 600) % 2 === 0)) {
                ctx.textAlign = "center"; ctx.fillStyle = "#ffd23f"; ctx.font = "400 22px Silkscreen, monospace";
                ctx.fillText("INSERT COIN", W / 2, H - 80);
            }
        };

        const loop = (t) => {
            const dt = Math.min(100, t - prev); prev = t;
            const st = hudRef.current, g = game.current;
            if (g.stop > 0) { g.stop -= dt; acc = 0; }
            else if (st === "play" || st === "ready" || st === "attract") {
                acc += dt;
                while (acc >= 1000 / 120 && g.stop <= 0) { step(); acc -= 1000 / 120; }
            } else acc = 0;
            draw(t);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        const kd = (e) => {
            if (e.target.closest?.("input")) return;
            if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
                keys.current[e.key] = true;
                if (e.key === " ") launchRef.current?.();
            } else if (e.key === "Enter") {
                startRef.current?.();
            }
        };
        const ku = (e) => { keys.current[e.key] = false; };
        addEventListener("keydown", kd); addEventListener("keyup", ku);
        return () => { cancelAnimationFrame(raf); removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
    }, [blip]);

    const hiRef = useRef(0);
    useEffect(() => { hudRef.current = hud.state; launchRef.current = launch; startRef.current = start; hiRef.current = scores?.[0]?.score || 0; });
    useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1400); return () => clearTimeout(t); }, [toast]);

    const aim = (e) => {
        if (hudRef.current === "attract") return;
        const r = cv.current.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W;
        const g = game.current;
        g.pad.x = Math.max(0, Math.min(W - g.pad.w, x - g.pad.w / 2));
    };
    const hold = (k, v) => () => { keys.current[k] = v; };
    const qualifies = hud.score > 0 && ((scores?.length ?? 0) < 10 || hud.score > (scores?.at(-1)?.score ?? 0));

    const viewAll = () => {
        setAll(true);
        document.getElementById("sb-coll-h")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (initials.length !== 3) return;
        setSaved("saving");
        try {
            const r = await fetch("/api/scores", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initials, score: hud.score, unlocked: got.length }) });
            const d = await r.json();
            if (!r.ok || d.error) throw new Error(d.error || "Local save");
            setScores(d.scores); setSaved("saved");
        } catch {
            const local = saveLocalScore({ initials, score: hud.score, unlocked: got.length });
            setScores(local); setSaved("saved");
        }
    };

    const unlocked = all ? work.map((w) => w.slug) : got;
    const board = !scores?.length ? (
        <p className="sb-empty">No scores yet. Play a round to set the 1st high score — or jump straight to all {work.length} projects.</p>
    ) : (
        <ol className="sb-scores">
            {scores.slice(0, 10).map((s, i) => (
                <li key={i} data-me={saved === "saved" && s.initials === initials && s.score === hud.score ? "" : undefined}>
                    <span>{["1ST", "2ND", "3RD"][i] || `${i + 1}TH`}</span><b>{s.initials}</b><em>{String(s.score).padStart(6, "0")}</em><small>{`${s.unlocked}/${work.length}`}</small>
                </li>
            ))}
        </ol>
    );

    return (
        <div className="sb">
            <div className="sb-cab">
                <header className="sb-marquee"><p>SHIP<span>·</span>BREAKER</p><small>Aman Patel · Full-stack &amp; 3D engineer · Ahmedabad · every brick is a project</small></header>
                <div className="sb-bezel">
                    <div className="sb-screen">
                        <canvas ref={cv} width={W} height={H} aria-label="Brick breaker. Each brick is a project Aman built." role="img"
                            onPointerMove={aim} onPointerDown={(e) => { aim(e); start(); }} />
                        {hud.state === "attract" && (
                            <div className="sb-over sb-attract" onClick={(e) => { if (!e.target.closest("button, a")) start(); }}>
                                <span className="sb-demo-tag">AI DEMO · PRESS COIN</span>
                                <div className="sb-attract-card">
                                    <p className="sb-title">High scores</p>
                                    {board}
                                </div>
                                <div className="sb-row">
                                    <button type="button" onClick={start}>Insert Coin / Start</button>
                                    <button type="button" className="ghost" onClick={viewAll}>View All {work.length} ↓</button>
                                </div>
                                <p className="sb-blink">Press Enter or Start</p>
                            </div>
                        )}
                        {hud.state === "over" && (
                            <div className="sb-over">
                                <p className="sb-title">Game over</p>
                                <p>{hud.score.toLocaleString("en-IN")} points · {got.length} of {work.length} projects unlocked</p>
                                {qualifies && saved !== "saved" ? (
                                    <form className="sb-initials" onSubmit={submit}>
                                        <label htmlFor="sb-in">New high score. Enter your initials</label>
                                        <input id="sb-in" value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3))} maxLength={3} autoComplete="off" autoCapitalize="characters" autoFocus />
                                        <button type="submit" disabled={initials.length !== 3 || saved === "saving"}>{saved === "saving" ? "Saving" : "Enter"}</button>
                                    </form>
                                ) : board}
                                <div className="sb-row"><button type="button" onClick={launch}>Play again</button><button type="button" className="ghost" onClick={viewAll}>Show all projects</button></div>
                            </div>
                        )}
                        {hud.state === "won" && (
                            <div className="sb-over">
                                <p className="sb-title">All {work.length} unlocked</p>
                                <p>Bonus stage: hire the developer.</p>
                                <div className="sb-row"><a href={`mailto:${profile.email}`}>Email Aman</a><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a className="ghost" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a></div>
                            </div>
                        )}
                        {toast && <p key={toast.id} className="sb-toast" data-k={toast.k}>{toast.k === "skill" ? toast.t : `Unlocked: ${toast.t}`}</p>}
                    </div>
                </div>

                {inspected && (
                    <div className="sb-inspector" aria-label="Live brick inspector">
                        <span className="sb-insp-badge" style={{ background: COLORS[inspected.kind], color: inspected.kind === "client" ? "#fff" : "#111" }}>{KINDS[inspected.kind]}</span>
                        <div className="sb-insp-info">
                            <b>{inspected.title}</b>
                            <small>{inspected.line}</small>
                        </div>
                        <div className="sb-insp-cta">
                            {cases[inspected.slug] && <a href={`/case.html?p=${inspected.slug}`}>Case →</a>}
                            {inspected.url && <a href={inspected.url} target="_blank" rel="noreferrer">Open ↗</a>}
                        </div>
                    </div>
                )}

                <div className="sb-panel" aria-label="Controls">
                    <button type="button" className="sb-key" aria-label="Move left" onPointerDown={hold("ArrowLeft", true)} onPointerUp={hold("ArrowLeft", false)} onPointerLeave={hold("ArrowLeft", false)}>◀</button>
                    <button type="button" className="sb-key" aria-label="Move right" onPointerDown={hold("ArrowRight", true)} onPointerUp={hold("ArrowRight", false)} onPointerLeave={hold("ArrowRight", false)}>▶</button>
                    <button type="button" className="sb-arc-btn" onClick={viewAll}>All {work.length}</button>
                    <a className="sb-arc-btn" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
                    <a className="sb-arc-btn" href={`mailto:${profile.email}`}>Email</a>
                    <button type="button" className="sb-arc-btn" onClick={() => setMuted((m) => !m)} aria-pressed={!muted}>{muted ? "♪ Off" : "♪ On"}</button>
                    <button type="button" className="sb-coin" onClick={start} title="Insert Coin (25¢) to Start"><i aria-hidden="true" />25¢</button>
                    <button type="button" className="sb-fire" onClick={start}>{hud.state === "attract" ? "Start" : "Launch"}</button>
                </div>
            </div>

            <section className="sb-coll" aria-labelledby="sb-coll-h">
                <div className="sb-coll-head">
                    <h2 id="sb-coll-h">Collection <span>{unlocked.length}/{work.length}</span></h2>
                    <label className="sb-all"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Show everything, no game needed</label>
                </div>
                <ul>
                    {work.map((w) => {
                        const open = unlocked.includes(w.slug);
                        return (
                            <li key={w.slug} data-open={open || undefined} style={{ "--c": COLORS[w.kind] }} onMouseEnter={() => setInspected(w)}>
                                {open ? ((cases[w.slug] || w.url) ? (
                                    <a href={cases[w.slug] ? `/case.html?p=${w.slug}` : w.url} target={cases[w.slug] ? undefined : "_blank"} rel="noreferrer">
                                        <img src={shot(w, 360)} alt="" loading="lazy" />
                                        <b>{w.title}</b><small>{KINDS[w.kind]} · {w.year}</small>
                                    </a>
                                ) : (
                                    <div className="sb-nolink">
                                        <img src={shot(w, 360)} alt="" loading="lazy" />
                                        <b>{w.title}</b><small>{KINDS[w.kind]} · {w.year} · private build</small>
                                    </div>
                                )) : <span className="sb-locked"><i>?</i><small>{KINDS[w.kind]}</small></span>}
                            </li>
                        );
                    })}
                </ul>
                <p className="sb-help">Move with mouse, finger, or ← →. Catch yellow/blue/red skill capsules for Wide Paddle, Multi-Ball, and Pierce Laser!</p>
            </section>
        </div>
    );
}
