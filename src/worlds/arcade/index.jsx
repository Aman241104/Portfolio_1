import { useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import "./arcade.css";

// World 8: ARCADE. A brick breaker where every brick is a project: break it, unlock it into the collection.
// Skill capsules fall now and then; catch one and the paddle grows. Canvas 2D, fixed-timestep loop, mouse / touch /
// arrow keys. Recruiters never have to play: "Show all" unlocks the whole collection.
const COLORS = { product: "#ff3df2", mobile: "#3dfff0", client: "#ffe14a", concept: "#7c6bff" };
const SKILLS = skillGroups.flatMap((g) => g.items.map(([n]) => n));
const W = 640, H = 480, COLS = 7;

const level = () => {
    const ordered = ["product", "mobile", "client", "concept"].flatMap((k) => work.filter((w) => w.kind === k));
    const bw = (W - 40 - (COLS - 1) * 6) / COLS;
    return ordered.map((p, i) => ({ p, x: 20 + (i % COLS) * (bw + 6), y: 56 + Math.floor(i / COLS) * 26, w: bw, h: 20, alive: true }));
};

export default function Arcade() {
    const cv = useRef(null), game = useRef(null), keys = useRef({});
    const [hud, setHud] = useState({ score: 0, lives: 3, state: "ready" });   // ready · play · over · won
    const [got, setGot] = useState([]);
    const [all, setAll] = useState(false);
    const [toast, setToast] = useState(null);
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hudRef = useRef("ready"), launchRef = useRef(null);       // the rAF loop reads these, synced after render

    const reset = (full = true) => {
        const g = game.current;
        if (full) { g.bricks = level(); g.score = 0; g.lives = 3; g.caps = []; g.parts = []; setGot([]); }
        g.pad = { x: W / 2 - 50, w: 100 }; g.ball = { x: W / 2, y: H - 60, vx: 0, vy: 0, stuck: true };
    };
    useEffect(() => { game.current = { bricks: level(), score: 0, lives: 3, caps: [], parts: [], pad: { x: W / 2 - 50, w: 100 }, ball: { x: W / 2, y: H - 60, vx: 0, vy: 0, stuck: true } }; }, []);

    const launch = () => {
        const g = game.current;
        if (hud.state === "over" || hud.state === "won") { reset(); setHud({ score: 0, lives: 3, state: "play" }); return; }
        if (g.ball.stuck) { g.ball.stuck = false; g.ball.vx = 3.2 * (Math.random() < 0.5 ? -1 : 1); g.ball.vy = -5.2; setHud((h) => ({ ...h, state: "play" })); }
    };

    useEffect(() => {
        const c = cv.current, ctx = c.getContext("2d");
        let raf, acc = 0, prev = performance.now();
        const step = () => {
            const g = game.current, b = g.ball, p = g.pad;
            if (keys.current.ArrowLeft) p.x -= 8;
            if (keys.current.ArrowRight) p.x += 8;
            p.x = Math.max(0, Math.min(W - p.w, p.x));
            if (b.stuck) { b.x = p.x + p.w / 2; b.y = H - 38; return; }
            b.x += b.vx; b.y += b.vy;
            if (b.x < 6 || b.x > W - 6) { b.vx *= -1; b.x = Math.max(6, Math.min(W - 6, b.x)); }
            if (b.y < 6) { b.vy *= -1; b.y = 6; }
            // paddle: angle depends on where it hits (the classic feel)
            if (b.vy > 0 && b.y > H - 34 && b.y < H - 22 && b.x > p.x - 4 && b.x < p.x + p.w + 4) {
                const t = (b.x - (p.x + p.w / 2)) / (p.w / 2), sp = Math.min(9, Math.hypot(b.vx, b.vy) + 0.06);
                b.vx = sp * Math.sin(t * 1.05); b.vy = -sp * Math.cos(t * 1.05); b.y = H - 34;
            }
            for (const k of g.bricks) {
                if (!k.alive || b.x < k.x - 5 || b.x > k.x + k.w + 5 || b.y < k.y - 5 || b.y > k.y + k.h + 5) continue;
                k.alive = false; g.score += 100;
                const ox = Math.min(Math.abs(b.x - k.x), Math.abs(b.x - k.x - k.w)), oy = Math.min(Math.abs(b.y - k.y), Math.abs(b.y - k.y - k.h));
                if (ox < oy) b.vx *= -1; else b.vy *= -1;
                for (let i = 0; i < 14; i++) g.parts.push({ x: k.x + k.w / 2, y: k.y + k.h / 2, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 30, c: COLORS[k.p.kind] });
                if (Math.random() < 0.22) g.caps.push({ x: k.x + k.w / 2, y: k.y, s: SKILLS[Math.floor(Math.random() * SKILLS.length)] });
                setGot((x) => (x.includes(k.p.slug) ? x : [...x, k.p.slug]));
                setToast({ t: k.p.title, k: k.p.kind, id: Math.random() });
                break;
            }
            for (const cp of g.caps) {
                cp.y += 2.4;
                if (cp.y > H - 34 && cp.y < H - 18 && cp.x > p.x && cp.x < p.x + p.w) { cp.done = true; p.w = Math.min(170, p.w + 16); g.score += 50; setToast({ t: `+ ${cp.s}`, k: "skill", id: Math.random() }); }
            }
            g.caps = g.caps.filter((cp) => !cp.done && cp.y < H);
            if (b.y > H + 10) {
                g.lives -= 1;
                if (g.lives <= 0) setHud({ score: g.score, lives: 0, state: "over" }); else { reset(false); setHud({ score: g.score, lives: g.lives, state: "ready" }); }
                return;
            }
            if (g.bricks.every((k) => !k.alive)) { b.stuck = true; setHud({ score: g.score, lives: g.lives, state: "won" }); }
        };
        const draw = () => {
            const g = game.current;
            ctx.fillStyle = "#12051f"; ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = "rgba(124, 107, 255, .12)"; ctx.lineWidth = 1;          // the neon floor grid
            for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
            ctx.font = "600 9px 'Geist Mono', monospace"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
            for (const k of g.bricks) {
                if (!k.alive) continue;
                ctx.shadowColor = COLORS[k.p.kind]; ctx.shadowBlur = 12; ctx.fillStyle = COLORS[k.p.kind];
                ctx.fillRect(k.x, k.y, k.w, k.h); ctx.shadowBlur = 0;
                ctx.fillStyle = "#12051f"; ctx.fillText(k.p.title.slice(0, 13).toUpperCase(), k.x + k.w / 2, k.y + k.h / 2 + 1);
            }
            for (const pt of g.parts) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life--; ctx.globalAlpha = Math.max(0, pt.life / 30); ctx.fillStyle = pt.c; ctx.fillRect(pt.x, pt.y, 3, 3); }
            ctx.globalAlpha = 1; g.parts = g.parts.filter((pt) => pt.life > 0);
            for (const cp of g.caps) {
                ctx.fillStyle = "#3dfff0"; ctx.shadowColor = "#3dfff0"; ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.roundRect(cp.x - 34, cp.y - 9, 68, 18, 9); ctx.fill(); ctx.shadowBlur = 0;
                ctx.fillStyle = "#12051f"; ctx.fillText(cp.s.slice(0, 11).toUpperCase(), cp.x, cp.y + 1);
            }
            const p = g.pad; ctx.fillStyle = "#fff"; ctx.shadowColor = "#ff3df2"; ctx.shadowBlur = 16;
            ctx.beginPath(); ctx.roundRect(p.x, H - 30, p.w, 10, 5); ctx.fill();
            ctx.beginPath(); ctx.arc(g.ball.x, g.ball.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        };
        const loop = (t) => {
            acc += Math.min(100, t - prev); prev = t;
            if (hudRef.current === "play" || game.current.ball?.stuck) while (acc >= 1000 / 120) { step(); acc -= 1000 / 120; } else acc = 0;
            draw();
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        const kd = (e) => { if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) { e.preventDefault(); keys.current[e.key] = true; if (e.key === " ") launchRef.current(); } };
        const ku = (e) => { keys.current[e.key] = false; };
        addEventListener("keydown", kd); addEventListener("keyup", ku);
        return () => { cancelAnimationFrame(raf); removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
    }, []);
    useEffect(() => { hudRef.current = hud.state; launchRef.current = launch; });
    useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1400); return () => clearTimeout(t); }, [toast]);

    const aim = (e) => { const r = cv.current.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W; game.current.pad.x = Math.max(0, Math.min(W - game.current.pad.w, x - game.current.pad.w / 2)); };
    const unlocked = all ? work.map((w) => w.slug) : got;

    return (
        <div className="ar">
            <header className="ar-top">
                <p className="ar-logo">SHIP<span>·</span>BREAKER</p>
                <p className="ar-hud"><span>SCORE <b>{String(hud.score).padStart(5, "0")}</b></span><span>LIVES <b>{"♥".repeat(Math.max(0, hud.lives))}</b></span><span>UNLOCKED <b>{unlocked.length}/{work.length}</b></span></p>
            </header>
            <div className="ar-stage">
                <div className="ar-cab">
                    <canvas ref={cv} width={W} height={H} className="ar-cv" aria-label="Brick breaker game. Each brick is a project." role="img"
                        onPointerMove={aim} onPointerDown={(e) => { aim(e); launch(); }} />
                    {hud.state !== "play" && (
                        <div className="ar-over" onClick={(e) => { if (hud.state === "ready" && !e.target.closest("a, button")) launch(); }}>
                            {hud.state === "ready" && <><p className="ar-big">{got.length ? "READY" : "INSERT COIN"}</p><p>Every brick is a project I built. Break it to unlock it.</p><button type="button" onClick={launch}>{reduced ? "Start" : "Press space · tap"}</button></>}
                            {hud.state === "over" && <><p className="ar-big">GAME OVER</p><p>You unlocked {got.length} of {work.length}. The rest are one click away.</p><button type="button" onClick={launch}>Play again</button><button type="button" className="ghost" onClick={() => setAll(true)}>Show all projects</button></>}
                            {hud.state === "won" && <><p className="ar-big">ALL {work.length} UNLOCKED</p><p>High score {hud.score}. Bonus level: hire the developer.</p><a className="ar-btn" href={`mailto:${profile.email}`}>Email Aman</a><a className="ar-btn ghost" href={profile.resume} target="_blank" rel="noreferrer">Résumé ↓</a></>}
                        </div>
                    )}
                    {toast && <p key={toast.id} className="ar-toast" data-k={toast.k}>{toast.k === "skill" ? toast.t : `UNLOCKED · ${toast.t}`}</p>}
                </div>
                <p className="ar-help">Move: mouse, finger or ← →. Launch: click, tap or space. Catch the skill capsules to grow the paddle.</p>
            </div>

            <section className="ar-coll" aria-labelledby="ar-coll-h">
                <div className="ar-coll-head">
                    <h2 id="ar-coll-h">Collection <span>{unlocked.length}/{work.length}</span></h2>
                    <label className="ar-all"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Show all (no game needed)</label>
                </div>
                <ul>
                    {work.map((w) => {
                        const open = unlocked.includes(w.slug);
                        return (
                            <li key={w.slug} data-open={open || undefined} style={{ "--c": COLORS[w.kind] }}>
                                {open ? (
                                    <a href={cases[w.slug] ? `/case.html?p=${w.slug}` : w.url || "#"} target={cases[w.slug] ? undefined : "_blank"} rel="noreferrer">
                                        <img src={shot(w, 360)} alt="" loading="lazy" />
                                        <b>{w.title}</b><small>{KINDS[w.kind]} · {w.year}</small>
                                    </a>
                                ) : <span className="ar-locked"><i>?</i><small>{KINDS[w.kind]}</small></span>}
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}
