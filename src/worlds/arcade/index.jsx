import { useEffect, useRef, useState } from "react";
import { profile } from "#content/profile.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import "./arcade.css";

// World 8: SHIP·BREAKER. An 80s cabinet: every brick is a project, break it to unlock it. Skill capsules widen the
// paddle. Global high scores (initials, Neon via /api/scores) give people a reason to come back and share.
// Canvas 2D, fixed-timestep loop, mouse / touch / arrow keys / the cabinet's own buttons. Nobody has to play:
// "Show all" opens the whole collection.
const FONTS = ["Bungee", "Silkscreen:wght@400;700"];
const COLORS = { product: "#e8392b", mobile: "#ffd23f", client: "#2f6fe4", concept: "#f2efe8" };
const SKILLS = skillGroups.flatMap((g) => g.items.map(([n]) => n));
const W = 640, H = 480, COLS = 7;

const level = () => {
    const ordered = ["product", "mobile", "client", "concept"].flatMap((k) => work.filter((w) => w.kind === k));
    const bw = (W - 40 - (COLS - 1) * 6) / COLS;
    return ordered.map((p, i) => ({ p, x: 20 + (i % COLS) * (bw + 6), y: 60 + Math.floor(i / COLS) * 26, w: bw, h: 20, alive: true }));
};
const reducedMotion = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
// Juice state: hit-stop (ms frozen on impact), shake (px, decays), white crack flashes, combo pops.
const fresh = () => ({ bricks: level(), score: 0, lives: 3, caps: [], parts: [], flashes: [], pops: [], stop: 0, shake: 0, combo: 0, pad: { x: W / 2 - 50, w: 100 }, ball: { x: W / 2, y: H - 60, vx: 0, vy: 0, stuck: true } });

export default function ShipBreaker() {
    useFonts(FONTS);
    const cv = useRef(null), game = useRef(null), keys = useRef({});
    const [hud, setHud] = useState({ score: 0, lives: 3, state: "attract" });    // attract · ready · play · over · won
    const [got, setGot] = useState([]);
    const [all, setAll] = useState(false);
    const [toast, setToast] = useState(null);
    const [scores, setScores] = useState([]);
    const [initials, setInitials] = useState("");
    const [saved, setSaved] = useState(null);       // null · "saving" · "saved" · error text
    const hudRef = useRef("attract"), launchRef = useRef(null);

    useEffect(() => { game.current = fresh(); fetch("/api/scores").then((r) => r.json()).then((d) => setScores(d.scores || [])).catch(() => {}); }, []);

    const launch = () => {
        const g = game.current;
        if (["over", "won"].includes(hud.state)) { game.current = fresh(); setGot([]); setSaved(null); setInitials(""); setHud({ score: 0, lives: 3, state: "ready" }); return; }
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
            if (b.vy > 0 && b.y > H - 34 && b.y < H - 22 && b.x > p.x - 4 && b.x < p.x + p.w + 4) {
                const t = (b.x - (p.x + p.w / 2)) / (p.w / 2), sp = Math.min(9, Math.hypot(b.vx, b.vy) + 0.06);
                b.vx = sp * Math.sin(t * 1.05); b.vy = -sp * Math.cos(t * 1.05); b.y = H - 34;
                g.combo = 0; p.squash = 6;
            }
            for (const k of g.bricks) {
                if (!k.alive || b.x < k.x - 5 || b.x > k.x + k.w + 5 || b.y < k.y - 5 || b.y > k.y + k.h + 5) continue;
                k.alive = false; g.combo += 1; g.score += 100 * g.combo;
                g.stop = 40; g.shake = Math.max(g.shake, 3);          // hit-stop: the world holds its breath for 40 ms
                g.flashes.push({ x: k.x, y: k.y, w: k.w, h: k.h, life: 9 });
                if (g.combo > 1) g.pops.push({ x: k.x + k.w / 2, y: k.y, text: `x${g.combo} COMBO`, life: 48 });
                const ox = Math.min(Math.abs(b.x - k.x), Math.abs(b.x - k.x - k.w)), oy = Math.min(Math.abs(b.y - k.y), Math.abs(b.y - k.y - k.h));
                if (ox < oy) b.vx *= -1; else b.vy *= -1;
                for (let i = 0; i < 12; i++) g.parts.push({ x: k.x + k.w / 2, y: k.y + k.h / 2, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 26, c: COLORS[k.p.kind] });
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
                g.lives -= 1; g.shake = 14; g.combo = 0;
                if (g.lives <= 0) setHud({ score: g.score, lives: 0, state: "over" });
                else { g.pad = { x: W / 2 - 50, w: g.pad.w }; g.ball = { x: W / 2, y: H - 60, vx: 0, vy: 0, stuck: true }; setHud({ score: g.score, lives: g.lives, state: "ready" }); }
                return;
            }
            if (g.bricks.every((k) => !k.alive)) { b.stuck = true; setHud({ score: g.score, lives: g.lives, state: "won" }); }
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
                ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(k.x, k.y, k.w, 2);           // bevel
                ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(k.x, k.y + k.h - 2, k.w, 2);
                ctx.fillStyle = k.p.kind === "client" ? "#fff" : "#111"; ctx.fillText(k.p.title.slice(0, 12).toUpperCase(), k.x + k.w / 2, k.y + k.h / 2 + 1);
            }
            for (const f of g.flashes) { ctx.fillStyle = `rgba(255,255,255,${f.life / 9})`; ctx.fillRect(f.x - (9 - f.life), f.y - (9 - f.life) / 2, f.w + (9 - f.life) * 2, f.h + 9 - f.life); f.life--; }
            g.flashes = g.flashes.filter((f) => f.life > 0);
            for (const pt of g.parts) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.18; pt.life--; ctx.fillStyle = pt.c; ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 4, 4); }
            g.parts = g.parts.filter((pt) => pt.life > 0);
            ctx.font = "700 9px Silkscreen, monospace";
            for (const cp of g.caps) {
                ctx.fillStyle = "#ffd23f"; ctx.fillRect(cp.x - 36, cp.y - 8, 72, 16);
                ctx.fillStyle = "#111"; ctx.fillText(cp.s.slice(0, 11).toUpperCase(), cp.x, cp.y + 1);
            }
            // the paddle squashes on contact and springs back
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
            ctx.fillStyle = "#f2efe8"; ctx.fillRect(Math.round(g.ball.x) - 5, Math.round(g.ball.y) - 5, 10, 10);   // a square ball, like the hardware
            // HUD painted on the glass
            ctx.font = "400 14px Silkscreen, monospace"; ctx.textAlign = "left"; ctx.fillStyle = "#e8392b"; ctx.fillText("1UP", 16, 20);
            ctx.fillStyle = "#f2efe8"; ctx.fillText(String(g.score).padStart(6, "0"), 60, 20);
            ctx.textAlign = "center"; ctx.fillStyle = "#e8392b"; ctx.fillText("HI-SCORE", W / 2 - 40, 20);
            ctx.fillStyle = "#f2efe8"; ctx.fillText(String(Math.max(g.score, hiRef.current)).padStart(6, "0"), W / 2 + 50, 20);
            ctx.textAlign = "right"; ctx.fillStyle = "#ffd23f"; ctx.fillText("■ ".repeat(Math.max(0, g.lives)).trim(), W - 16, 20);
            if (hudRef.current === "attract" && (reducedMotion || Math.floor(t / 600) % 2 === 0)) { ctx.textAlign = "center"; ctx.fillStyle = "#ffd23f"; ctx.font = "400 22px Silkscreen, monospace"; ctx.fillText("INSERT COIN", W / 2, H - 80); }
        };
        const loop = (t) => {
            const dt = Math.min(100, t - prev); prev = t;
            const st = hudRef.current, g = game.current;
            if (g.stop > 0) { g.stop -= dt; acc = 0; }        // hit-stop: physics paused, drawing goes on
            else if (st === "play" || st === "ready") { acc += dt; while (acc >= 1000 / 120 && g.stop <= 0) { step(); acc -= 1000 / 120; } }
            else acc = 0;
            draw(t);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        const kd = (e) => {
            if (e.target.closest?.("input")) return;
            if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) { e.preventDefault(); keys.current[e.key] = true; if (e.key === " ") launchRef.current?.(); }
        };
        const ku = (e) => { keys.current[e.key] = false; };
        addEventListener("keydown", kd); addEventListener("keyup", ku);
        return () => { cancelAnimationFrame(raf); removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
    }, []);
    const hiRef = useRef(0);
    useEffect(() => { hudRef.current = hud.state; launchRef.current = launch; hiRef.current = scores[0]?.score || 0; });
    useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1400); return () => clearTimeout(t); }, [toast]);

    const aim = (e) => { const r = cv.current.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W; const g = game.current; g.pad.x = Math.max(0, Math.min(W - g.pad.w, x - g.pad.w / 2)); };
    const hold = (k, v) => () => { keys.current[k] = v; };
    const start = () => { if (hud.state === "attract") setHud((h) => ({ ...h, state: "ready" })); else launch(); };
    const qualifies = hud.score > 0 && (scores.length < 10 || hud.score > (scores.at(-1)?.score ?? 0));
    const submit = async (e) => {
        e.preventDefault();
        if (initials.length !== 3) return;
        setSaved("saving");
        try {
            const r = await fetch("/api/scores", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initials, score: hud.score, unlocked: got.length }) });
            const d = await r.json();
            if (!r.ok || d.error) throw new Error(d.error || "Couldn't save");
            setScores(d.scores); setSaved("saved");
        } catch (x) { setSaved(x.message); }
    };
    const unlocked = all ? work.map((w) => w.slug) : got;
    const board = (
        <ol className="sb-scores">
            {(scores.length ? scores : Array.from({ length: 5 }, () => null)).slice(0, 10).map((s, i) => (
                <li key={i} data-me={saved === "saved" && s?.initials === initials && s?.score === hud.score ? "" : undefined}>
                    <span>{["1ST", "2ND", "3RD"][i] || `${i + 1}TH`}</span><b>{s?.initials || "---"}</b><em>{s ? String(s.score).padStart(6, "0") : "000000"}</em><small>{s ? `${s.unlocked}/${work.length}` : ""}</small>
                </li>
            ))}
        </ol>
    );

    return (
        <div className="sb">
            <div className="sb-cab">
                <header className="sb-marquee"><p>SHIP<span>·</span>BREAKER</p><small>Every brick is a project · Est. 2026 · Ahmedabad</small></header>
                <div className="sb-bezel">
                    <div className="sb-screen">
                        <canvas ref={cv} width={W} height={H} aria-label="Brick breaker. Each brick is a project Aman built." role="img"
                            onPointerMove={aim} onPointerDown={(e) => { aim(e); start(); }} />
                        {hud.state === "attract" && (
                            <div className="sb-over sb-attract" onClick={start}>
                                <p className="sb-title">High scores</p>
                                {board}
                                <p className="sb-blink">Press start</p>
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
                                        {saved && saved !== "saving" && <p className="sb-err">{saved}</p>}
                                    </form>
                                ) : {board}}
                                <div className="sb-row"><button type="button" onClick={launch}>Play again</button><button type="button" className="ghost" onClick={() => setAll(true)}>Show all projects</button></div>
                            </div>
                        )}
                        {hud.state === "won" && (
                            <div className="sb-over">
                                <p className="sb-title">All {work.length} unlocked</p>
                                <p>Bonus stage: hire the developer.</p>
                                {qualifies && saved !== "saved" && (
                                    <form className="sb-initials" onSubmit={submit}>
                                        <label htmlFor="sb-in2">Enter your initials</label>
                                        <input id="sb-in2" value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3))} maxLength={3} autoComplete="off" autoFocus />
                                        <button type="submit" disabled={initials.length !== 3}>Enter</button>
                                    </form>
                                )}
                                <div className="sb-row"><a href={`mailto:${profile.email}`}>Email Aman</a><a className="ghost" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a></div>
                            </div>
                        )}
                        {toast && <p key={toast.id} className="sb-toast" data-k={toast.k}>{toast.k === "skill" ? toast.t : `Unlocked: ${toast.t}`}</p>}
                    </div>
                </div>
                <div className="sb-panel" aria-label="Controls">
                    <button type="button" className="sb-key" aria-label="Move left" onPointerDown={hold("ArrowLeft", true)} onPointerUp={hold("ArrowLeft", false)} onPointerLeave={hold("ArrowLeft", false)}>◀</button>
                    <button type="button" className="sb-key" aria-label="Move right" onPointerDown={hold("ArrowRight", true)} onPointerUp={hold("ArrowRight", false)} onPointerLeave={hold("ArrowRight", false)}>▶</button>
                    <p className="sb-coin"><i /> 1 credit = free</p>
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
                            <li key={w.slug} data-open={open || undefined} style={{ "--c": COLORS[w.kind] }}>
                                {open ? (
                                    <a href={cases[w.slug] ? `/case.html?p=${w.slug}` : w.url || "#"} target={cases[w.slug] ? undefined : "_blank"} rel="noreferrer">
                                        <img src={shot(w, 360)} alt="" loading="lazy" />
                                        <b>{w.title}</b><small>{KINDS[w.kind]} · {w.year}</small>
                                    </a>
                                ) : <span className="sb-locked"><i>?</i><small>{KINDS[w.kind]}</small></span>}
                            </li>
                        );
                    })}
                </ul>
                <p className="sb-help">Move with the mouse, a finger or ← →. Launch with a click, a tap or space. Catch the yellow skill capsules to widen the paddle.</p>
            </section>
        </div>
    );
}
