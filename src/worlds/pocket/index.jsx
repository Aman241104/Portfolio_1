import { useCallback, useEffect, useRef, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { cases } from "../../../content/cases.js";
import { useFonts } from "../fonts.js";
import { track } from "../../analytics.js";
import * as A from "./art.js";
import { MAP, COLS, ROWS, at, SOLID, BUILDINGS, START, TALK, MONS, BADGES } from "./town.js";
import "./pocket.css";

// World 11: POCKET, "Monochrome pocket". An original handheld-RPG homage: a four-shade LCD town (a small Ahmedabad),
// projects as creatures in the tall grass, a battle as a case study (moves = features, stats = stack), a Dex in their
// own voice, the gym as experience and the trainer card as the hire card. Everything is drawn in code (art.js).
const FONTS = ["Pixelify+Sans:wght@400;600", "Silkscreen:wght@400;700"];
const W = 160, H = 144, VT = 10, VR = 9;                        // the screen is 10×9 tiles
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const STEP_MS = 170;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const linkedin = socials.find((s) => /linkedin/i.test(s.text || s.id));
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const loadCaught = () => { try { return new Set(JSON.parse(localStorage.getItem("px01-pocket-dex") || "[]")); } catch { return new Set(); } };

// ---- a tiny original chiptune (square waves), only when sound is switched on ----
let ac = null;
const tone = (f, d = 0.08, t0 = 0, type = "square", vol = 0.05) => {
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.02);
};
const SFX = {
    blip: () => tone(988, 0.05),
    meet: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.09, i * 0.07)),
    catch: () => [784, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.12, i * 0.1, "triangle", 0.07)),
    bump: () => tone(110, 0.06, 0, "square", 0.04),
};
const TUNE = [392, 0, 440, 494, 0, 523, 494, 440, 392, 0, 330, 392, 440, 0, 392, 0];   // an original 16-step loop

export default function PocketWorld({ shell }) {
    useFonts(FONTS);
    const cv = useRef(null);
    const g = useRef({ x: START.x, y: START.y, dir: START.dir, moving: null, held: null, steps: 0, sinceBattle: 3, wipe: null, boot: reduced ? 0 : -1 });   // -1: the power-on starts on the first drawn frame
    const [mode, setMode] = useState("walk");                    // walk · talk · battle · start · dex · card
    const [talk, setTalk] = useState(null);                      // { lines, i }
    const [battle, setBattle] = useState(null);                  // { mon, phase, sel, msg, sub }
    const [sel, setSel] = useState(0);
    const [dexOpen, setDexOpen] = useState(null);               // a mon shown in detail
    const [caught, setCaught] = useState(loadCaught);
    const [sound, setSound] = useState(false);
    const [typed, setTyped] = useState(0);
    const [prompt, setPrompt] = useState("");
    const modeRef = useRef(mode); modeRef.current = mode;

    const save = (set) => { try { localStorage.setItem("px01-pocket-dex", JSON.stringify([...set])); } catch { /* ignore */ } };
    const say = useCallback((lines) => { setTalk({ lines, i: 0 }); setTyped(reduced ? 999 : 0); setMode("talk"); }, []);

    // ---- typewriter for the text box ----
    const line = mode === "talk" ? talk?.lines[talk.i] : mode === "battle" ? battle?.msg : null;
    useEffect(() => {
        if (!line || typed >= line.length) return;
        const t = setTimeout(() => setTyped((n) => n + 2), 22);
        return () => clearTimeout(t);
    }, [line, typed]);
    useEffect(() => { setTyped(reduced ? 999 : 0); }, [line]);

    // ---- encounters ----
    const encounter = useCallback(() => {
        const pool = MONS.filter((m) => !caught.has(m.slug));
        const mon = (pool.length ? pool : MONS)[Math.floor(Math.random() * (pool.length || MONS.length))];
        SFX.meet();
        track("pocket_encounter", { project: mon.slug });
        const go = () => { g.current.wipe = null; setBattle({ mon, phase: "intro", msg: `A wild ${mon.name} appeared!`, sel: 0, used: [] }); setMode("battle"); };
        if (reduced) return go();
        g.current.wipe = { t0: performance.now(), done: go };
        setMode("wipe");
    }, [caught]);

    // ---- the game loop: movement, camera, drawing, LCD ghosting ----
    useEffect(() => {
        const c = cv.current, ctx = c.getContext("2d");
        const buf = document.createElement("canvas"); buf.width = W; buf.height = H;
        const b = buf.getContext("2d");
        let raf;
        const loop = (now) => {
            const s = g.current;
            // movement (only while walking)
            if (modeRef.current === "walk" && !s.moving && s.held) {
                s.dir = s.held;
                const [dx, dy] = DIRS[s.held], nx = s.x + dx, ny = s.y + dy;
                if (!SOLID.has(at(nx, ny))) s.moving = { fx: s.x, fy: s.y, t0: now };
                else if (!s.bumped) { SFX.bump(); s.bumped = true; }
                if (!SOLID.has(at(nx, ny))) { s.x = nx; s.y = ny; s.bumped = false; }
            }
            let ox = 0, oy = 0;
            if (s.moving) {
                const k = Math.min(1, (now - s.moving.t0) / STEP_MS);
                ox = (s.moving.fx - s.x) * (1 - k) * A.T; oy = (s.moving.fy - s.y) * (1 - k) * A.T;
                if (k >= 1) {
                    s.moving = null; s.steps++; s.sinceBattle++;
                    if (at(s.x, s.y) === ":" && s.sinceBattle > 3 && Math.random() < 0.17) { s.sinceBattle = 0; s.held = null; encounter(); }
                }
            }
            // camera centred on the player, clamped to the map
            const pxw = s.x * A.T + ox, pyw = s.y * A.T + oy;
            const camX = Math.max(0, Math.min(COLS * A.T - W, pxw - (W - A.T) / 2)), camY = Math.max(0, Math.min(ROWS * A.T - H, pyw - (H - A.T) / 2 + 8));
            draw(b, now, s, camX, camY, pxw, pyw);
            ctx.globalAlpha = 1;
            ctx.drawImage(buf, 0, 0);
            if (modeRef.current === "walk") {
                const [dx, dy] = DIRS[s.dir], fx = s.x + dx, fy = s.y + dy, ahead = at(fx, fy);
                const nextPrompt = ahead === "S" && TALK[`${fx},${fy}`]
                    ? "[A] READ SIGN"
                    : s.dir === "up" && (ahead === "#" || BUILDINGS[ahead]) && TALK[`${s.x},${s.y}`]
                        ? "[A] INSPECT"
                        : at(s.x, s.y) === ":"
                            ? "TALL GRASS · PROJECTS"
                            : "";
                setPrompt((prev) => (prev === nextPrompt ? prev : nextPrompt));
            } else {
                setPrompt((prev) => (prev === "" ? prev : ""));
            }
            raf = requestAnimationFrame(loop);
        };
        const draw = (gx, now, s, camX, camY, pxw, pyw) => {
            const m = modeRef.current;
            if (m === "battle") return drawBattle(gx, now);
            const tx0 = Math.floor(camX / A.T), ty0 = Math.floor(camY / A.T);
            for (let ty = ty0 - 2; ty <= ty0 + VR + 1; ty++) for (let tx = tx0 - 3; tx <= tx0 + VT + 1; tx++) {
                const ch = at(tx, ty), x = Math.round(tx * A.T - camX), y = Math.round(ty * A.T - camY);
                if (x < -48 || y < -32 || x > W || y > H) continue;
                if (ch === ":") A.tall(gx, x, y, now, s.x === tx && s.y === ty);
                else if (ch === "w") A.water(gx, x, y, now);
                else if (ch === "p" || ch === "B") { A.path(gx, x, y, tx, ty); if (ch === "B") { gx.fillStyle = A.SHADES[1]; gx.fillRect(x, y, A.T, 2); gx.fillRect(x, y + 14, A.T, 2); } }
                else if (ch === ",") A.path(gx, x, y, tx, ty);
                else if (ch === "t") A.tree(gx, x, y);
                else if (ch === "f") A.flowers(gx, x, y, tx, ty);
                else if (ch === "=") A.fence(gx, x, y);
                else if (ch === "S") A.sign(gx, x, y, tx, ty);
                else A.grass(gx, x, y, tx, ty);
            }
            for (let ty = ty0 - 2; ty <= ty0 + VR + 1; ty++) for (let tx = tx0 - 3; tx <= tx0 + VT + 1; tx++) {
                const k = BUILDINGS[at(tx, ty)];
                if (k) A.building(gx, Math.round(tx * A.T - camX), Math.round(ty * A.T - camY), k);
            }
            const px = Math.round(pxw - camX), py = Math.round(pyw - camY);
            A.player(gx, px, py, s.dir, s.moving ? Math.floor(now / 90) : 0);
            if (at(s.x, s.y) === ":" && !s.moving) A.tall(gx, px, py + 8, now, true);   // grass covers the legs
            // the stripe wipe into a battle
            if (s.wipe) {
                const k = Math.min(1, (now - s.wipe.t0) / 650);
                gx.fillStyle = A.SHADES[0];
                for (let i = 0; i < 9; i++) { const w2 = W * Math.min(1, k * 1.6 - i * 0.07); if (w2 > 0) gx.fillRect(i % 2 ? W - w2 : 0, i * 16, w2, 16); }
                if (k >= 1) s.wipe.done();
            }
            // power-on: the logo drops in, then the town fades up
            if (s.boot === -1) s.boot = now;
            if (s.boot) {
                const k = (now - s.boot) / 1700;
                if (k >= 1) s.boot = 0;
                else {
                    gx.fillStyle = A.SHADES[3]; gx.globalAlpha = Math.min(1, 2.2 - k * 2.2); gx.fillRect(0, 0, W, H); gx.globalAlpha = 1;
                    const y = Math.min(54, -20 + k * 3 * 74) + (k > 0.33 && k < 0.45 ? -3 : 0);
                    gx.fillStyle = A.SHADES[0]; gx.font = "700 16px 'Silkscreen', monospace"; gx.textAlign = "center"; gx.globalAlpha = Math.min(1, 2.2 - k * 2.2);
                    gx.fillText("POCKET", W / 2, y); gx.font = "400 8px 'Silkscreen', monospace"; gx.fillText("AMAN PATEL EDITION", W / 2, y + 14); gx.globalAlpha = 1;
                }
            }
        };
        const drawBattle = (gx, now) => {
            const bt = battleRef.current;
            gx.fillStyle = "#d8f0ff"; gx.fillRect(0, 0, W, 80);
            gx.fillStyle = "#b2e2a4"; gx.fillRect(0, 80, W, H - 80);
            gx.fillStyle = "#7bc96f"; gx.beginPath(); gx.ellipse(124, 62, 32, 8, 0, 0, 7); gx.fill();
            gx.fillStyle = "#5aa84e"; gx.beginPath(); gx.ellipse(40, 104, 36, 9, 0, 0, 7); gx.fill();
            if (!bt) return;
            const age = now - (bt.t0 || now);
            const slide = reduced ? 0 : Math.max(0, 1 - age / 500);
            if (!bt.gone) {
                const bob = bt.phase === "throw" ? 0 : Math.round(Math.sin(now / 300));
                A.creature(gx, 100 + slide * 80, 10 + bob, bt.mon.slug, 2, false, bt.mon.w.kind);
            }
            gx.save(); gx.translate(Math.round(18 - slide * 80), 64); gx.scale(2, 2); A.player(gx, 0, 0, "up", 0); gx.restore();   // the player, from behind, at 2×
            // the kulhad (a clay chai cup) does the catching here
            if (bt.phase === "throw" || bt.gone) {
                const k = Math.min(1, age / 500), cx = 30 + (124 - 30) * k, cy = 80 - Math.sin(k * Math.PI) * 50 + (k >= 1 ? 2 : 0);
                const wob = bt.gone && !bt.done ? Math.sin(now / 80) * 2 : 0;
                gx.fillStyle = "#7c441e"; gx.fillRect(cx - 5 + wob, cy - 6, 10, 2); gx.fillStyle = "#c86d3b"; gx.fillRect(cx - 4 + wob, cy - 4, 8, 7); gx.fillStyle = "#f4c094"; gx.fillRect(cx - 3 + wob, cy - 3, 2, 5);
            }
            // a stack bar instead of HP: how much of the stack you've seen it use
            gx.fillStyle = "#161822"; gx.font = "700 8px 'Silkscreen', monospace"; gx.textAlign = "left";
            gx.fillText(bt.mon.name.slice(0, 16), 6, 12);
            gx.fillStyle = "#cbd5e1"; gx.fillRect(6, 16, 60, 4); gx.fillStyle = "#2b8a3e";
            gx.fillRect(6, 16, 60 * Math.min(1, (bt.used?.length || 0) / Math.max(1, bt.mon.moves.length)), 4);
            gx.fillStyle = "#3b4260"; gx.font = "400 7px 'Silkscreen', monospace"; gx.fillText(`TYPE/${bt.mon.type}`, 6, 28);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [encounter]);
    const battleRef = useRef(null);
    useEffect(() => { battleRef.current = battle ? { ...battle, t0: battleRef.current?.mon === battle.mon ? battleRef.current.t0 : performance.now() } : null; }, [battle]);

    // ---- music loop ----
    useEffect(() => {
        if (!sound) return;
        let i = 0;
        const t = setInterval(() => { const f = TUNE[i++ % TUNE.length]; if (f) tone(f, 0.16, 0, "square", 0.025); if (i % 4 === 1) tone(f ? f / 2 : 196, 0.2, 0, "triangle", 0.04); }, 190);
        return () => clearInterval(t);
    }, [sound]);

    // ---- actions (keyboard and on-screen buttons share these) ----
    const facing = () => { const s = g.current, [dx, dy] = DIRS[s.dir]; return [s.x + dx, s.y + dy]; };
    const doA = () => {
        SFX.blip();
        const m = modeRef.current;
        if (m === "walk") {
            const s = g.current, [fx, fy] = facing(), ahead = at(fx, fy);
            // signs talk when you face them; buildings talk when you stand at the door (below the middle) facing up
            if (ahead === "S" && TALK[`${fx},${fy}`]) say(TALK[`${fx},${fy}`]);
            else if (s.dir === "up" && (ahead === "#" || BUILDINGS[ahead]) && TALK[`${s.x},${s.y}`]) say(TALK[`${s.x},${s.y}`]);
            return;
        }
        if (m === "talk") {
            if (typed < (talk.lines[talk.i]?.length || 0)) return setTyped(999);
            if (talk.i + 1 < talk.lines.length) { setTalk({ ...talk, i: talk.i + 1 }); return; }
            setTalk(null); setMode("walk"); return;
        }
        if (m === "battle") battleA();
    };
    const doB = () => {
        const m = modeRef.current;
        if (m === "talk") { setTalk(null); setMode("walk"); }
        else if (m === "battle" && battle?.phase === "fight") setBattle({ ...battle, phase: "menu", sel: 0 });
        else if (m === "start" || m === "card") setMode("walk");
        else if (m === "dex") { if (dexOpen) setDexOpen(null); else setMode("walk"); }
    };
    const doStart = () => { SFX.blip(); const m = modeRef.current; if (m === "walk") { setSel(0); setMode("start"); } else if (m === "start") setMode("walk"); };

    // ---- battle ----
    const OPTIONS = ["FIGHT", "INFO", "CATCH", "RUN"];
    const battleA = (pick) => {
        const bt = battle;
        if (!bt) return;
        if (bt.phase === "intro") return setBattle({ ...bt, phase: "menu", msg: `What will you do?`, sel: 0 });
        if (bt.phase === "said") return setBattle({ ...bt, phase: "menu", msg: `What will you do?` });
        if (bt.phase === "menu") {
            const o = OPTIONS[pick ?? bt.sel];
            if (o === "FIGHT") return setBattle({ ...bt, phase: "fight", sel: 0 });
            if (o === "INFO") return setBattle({ ...bt, phase: "info", msg: `${bt.mon.name} · ${bt.mon.kind} · ${bt.mon.status}. ${bt.mon.w.line}` });
            if (o === "RUN") { setBattle(null); setMode("walk"); return; }
            if (o === "CATCH") {
                setBattle({ ...bt, phase: "throw", msg: `You threw a KULHAD!` });
                setTimeout(() => setBattle((b2) => b2 && { ...b2, gone: true, msg: "…  …  …" }), reduced ? 0 : 550);
                setTimeout(() => {
                    SFX.catch();
                    const next = new Set(caught); next.add(bt.mon.slug); setCaught(next); save(next);
                    track("pocket_caught", { project: bt.mon.slug });
                    setBattle((b2) => b2 && { ...b2, phase: "caught", done: true, msg: `Gotcha! ${bt.mon.name} was added to the DEX.` });
                }, reduced ? 0 : 1900);
                return;
            }
        }
        if (bt.phase === "fight") {
            const mv = bt.mon.moves[pick ?? bt.sel];
            if (!mv) return;
            return setBattle({ ...bt, phase: "said", used: [...new Set([...(bt.used || []), mv])], msg: `${bt.mon.name} used ${mv.toUpperCase()}! It's super effective.` });
        }
        if (bt.phase === "info" || bt.phase === "caught") { setBattle(null); setMode("walk"); }
    };

    // ---- keyboard ----
    useEffect(() => {
        const keyDir = { ArrowUp: "up", w: "up", ArrowDown: "down", s: "down", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
        const down = (e) => {
            if (e.target.closest?.("input, textarea") || e.metaKey || e.ctrlKey) return;
            const dir = keyDir[e.key];
            const m = modeRef.current;
            if (dir) {
                e.preventDefault();
                if (m === "walk") g.current.held = dir;
                else if (m === "start") setSel((v) => (v + (dir === "down" ? 1 : dir === "up" ? -1 : 0) + 5) % 5);
                else if (m === "battle" && battle && (battle.phase === "menu" || battle.phase === "fight")) {
                    const n = battle.phase === "menu" ? 4 : battle.mon.moves.length;
                    const d = { right: 1, left: -1, down: 2, up: -2 }[dir];
                    setBattle({ ...battle, sel: (battle.sel + d + n) % n });
                }
                return;
            }
            if (["z", " ", "Z"].includes(e.key)) { e.preventDefault(); if (m === "start") startPick(sel); else doA(); }
            else if (["x", "X", "Escape", "Backspace"].includes(e.key)) { e.preventDefault(); doB(); }
            else if (e.key === "Enter") { e.preventDefault(); if (m === "start") startPick(sel); else if (m === "talk" || m === "battle") doA(); else doStart(); }
        };
        const up = (e) => { if (keyDir[e.key] === g.current.held) g.current.held = null; };
        addEventListener("keydown", down); addEventListener("keyup", up);
        return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); };
    });

    const START_ITEMS = ["DEX", "CARD", "RÉSUMÉ", sound ? "SOUND: ON" : "SOUND: OFF", "LEAVE"];
    const startPick = (i) => {
        SFX.blip();
        const it = START_ITEMS[i];
        if (it === "DEX") { setDexOpen(null); setMode("dex"); }
        else if (it === "CARD") setMode("card");
        else if (it === "RÉSUMÉ") { track("resume_opened", { from: "world" }); window.open(profile.resume, "_blank", "noopener"); }
        else if (it.startsWith("SOUND")) { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); ac.resume?.(); setSound((v) => !v); }
        else shell?.spin();
    };

    // on-screen pad: hold to walk
    const hold = (dir) => ({
        onPointerDown: (e) => { e.preventDefault(); if (modeRef.current === "walk") g.current.held = dir; else window.dispatchEvent(new KeyboardEvent("keydown", { key: { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" }[dir] })); },
        onPointerUp: () => { if (g.current.held === dir) g.current.held = null; },
        onPointerLeave: () => { if (g.current.held === dir) g.current.held = null; },
    });

    const shown = line ? line.slice(0, typed) : "";
    return (
        <div className="pk">
            <p className="pk-fast">
                <button type="button" onClick={() => { setDexOpen(null); setMode("dex"); }}>All {MONS.length} projects</button>
                <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
                <a href={`mailto:${profile.email}`}>Email</a>
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            </p>

            <div className="pk-device">
                <div className="pk-bezel">
                    <span className="pk-led" data-on={sound || undefined} aria-hidden />
                    <div className="pk-screen">
                        <canvas ref={cv} width={W} height={H} role="img" aria-label="A small pixel town. Arrow keys or the pad to walk, Z or A to talk, Enter for the menu. Walk into the tall grass in the south to meet projects." />

                        {(mode === "talk" || (mode === "battle" && battle && battle.phase !== "fight" && battle.phase !== "menu")) && line && (
                            <div className="pk-box" aria-live="polite" onClick={doA}>
                                <p>{shown}{typed >= line.length && <i className="pk-more" aria-hidden>▼</i>}</p>
                                {mode === "battle" && battle?.phase === "info" && (
                                    <p className="pk-links">
                                        {battle.mon.w.url && <a href={battle.mon.w.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{battle.mon.w.url.includes("github.com") ? "CODE ▸" : `VISIT ${host(battle.mon.w.url).toUpperCase()} ▸`}</a>}
                                        {cases[battle.mon.slug] && <a href={`/case.html?p=${battle.mon.slug}`} onClick={(e) => e.stopPropagation()}>CASE STUDY ▸</a>}
                                    </p>
                                )}
                            </div>
                        )}
                        {mode === "battle" && battle?.phase === "menu" && (
                            <div className="pk-box pk-menu4" role="menu" aria-label="Battle">
                                <p className="pk-q">What will you do?</p>
                                {OPTIONS.map((o, i) => <button key={o} type="button" role="menuitem" data-sel={battle.sel === i || undefined} onClick={() => battleA(i)}>{o}</button>)}
                            </div>
                        )}
                        {mode === "battle" && battle?.phase === "fight" && (
                            <div className="pk-box pk-moves" role="menu" aria-label="Moves">
                                {battle.mon.moves.map((mv, i) => <button key={mv} type="button" role="menuitem" data-sel={battle.sel === i || undefined} onClick={() => battleA(i)}>{mv.toUpperCase().slice(0, 34)}</button>)}
                            </div>
                        )}
                        {mode === "start" && (
                            <div className="pk-start" role="menu" aria-label="Menu">
                                {START_ITEMS.map((it, i) => <button key={it} type="button" role="menuitem" data-sel={sel === i || undefined} onClick={() => startPick(i)}>{it}</button>)}
                            </div>
                        )}
                        {mode === "card" && (
                            <div className="pk-card" role="dialog" aria-label="Trainer card">
                                <p className="pk-card-h">TRAINER CARD <span>ID No.26026</span></p>
                                <p><b>NAME/</b> {profile.name.toUpperCase()}</p>
                                <p><b>CLASS/</b> FULL-STACK ENGINEER</p>
                                <p><b>TOWN/</b> AHMEDABAD · ON-SITE OR HYBRID</p>
                                <p><b>DEX/</b> {caught.size} OF {MONS.length} CAUGHT</p>
                                <div className="pk-badges" aria-label="Badges (skill groups)">{BADGES.map((b) => <span key={b.name} title={`${b.name}: ${b.items.join(", ")}`}>{b.name.slice(0, 2).toUpperCase()}</span>)}</div>
                                <p className="pk-links">
                                    <a href={profile.resume} target="_blank" rel="noreferrer">RÉSUMÉ ▸</a>
                                    <a href={`mailto:${profile.email}`}>EMAIL ▸</a>
                                    <a href={profile.github} target="_blank" rel="noreferrer">GITHUB ▸</a>
                                    <a href={profile.whatsapp} target="_blank" rel="noreferrer">WHATSAPP ▸</a>
                                    {linkedin && <a href={linkedin.link} target="_blank" rel="noreferrer">LINKEDIN ▸</a>}
                                </p>
                                <button type="button" className="pk-close" onClick={() => setMode("walk")}>B · BACK</button>
                            </div>
                        )}
                        {mode === "walk" && prompt && <div className="pk-prompt" aria-live="polite">{prompt}</div>}
                    </div>
                    <p className="pk-brand" aria-hidden>POCKET <i>COLOR</i></p>
                </div>
                <span className="pk-speaker" aria-hidden="true" />

                <div className="pk-controls">
                    <div className="pk-dpad" aria-label="Direction pad">
                        <button type="button" className="pk-up" aria-label="Up" {...hold("up")} />
                        <button type="button" className="pk-left" aria-label="Left" {...hold("left")} />
                        <span className="pk-hub" aria-hidden />
                        <button type="button" className="pk-right" aria-label="Right" {...hold("right")} />
                        <button type="button" className="pk-down" aria-label="Down" {...hold("down")} />
                    </div>
                    <div className="pk-ab">
                        <button type="button" className="pk-b" onClick={doB} aria-label="B (back)">B</button>
                        <button type="button" className="pk-a" onClick={() => (modeRef.current === "start" ? startPick(sel) : doA())} aria-label="A (talk, confirm)">A</button>
                    </div>
                    <div className="pk-ss">
                        <button type="button" onClick={() => { setDexOpen(null); setMode("dex"); }}>SELECT · DEX</button>
                        <button type="button" onClick={doStart}>START</button>
                    </div>
                </div>
                <p className="pk-keys">Arrows / WASD walk · Z or Space = A · X = B · Enter = START</p>
            </div>

            {mode === "dex" && (
                <section className="pk-dex" role="dialog" aria-label="Dex: every project">
                    <header><h2>DEX</h2><p>{caught.size}/{MONS.length} caught · every entry is readable, caught or not</p><button type="button" onClick={() => setMode("walk")}>Close</button></header>
                    {dexOpen ? (
                        <article className="pk-entry">
                            <button type="button" className="pk-back" onClick={() => setDexOpen(null)}>◂ All entries</button>
                            <DexSprite mon={dexOpen} big caught={caught.has(dexOpen.slug)} />
                            <div>
                                <p className="pk-no">No.{String(dexOpen.no).padStart(3, "0")} · {dexOpen.type} TYPE · {dexOpen.status}</p>
                                <h3>{dexOpen.w.title}</h3>
                                <p>{dexOpen.dex}</p>
                                {dexOpen.stack.length > 0 && <p className="pk-stats">{dexOpen.stack.map((s) => <span key={s}>{s}</span>)}</p>}
                                <p className="pk-links">
                                    {dexOpen.w.url && <a href={dexOpen.w.url} target="_blank" rel="noreferrer">{dexOpen.w.url.includes("github.com") ? "Code" : `Visit ${host(dexOpen.w.url)}`} ▸</a>}
                                    {cases[dexOpen.slug] && <a href={`/case.html?p=${dexOpen.slug}`}>Case study ▸</a>}
                                </p>
                            </div>
                        </article>
                    ) : (
                        <ol className="pk-list">{MONS.map((m) => (
                            <li key={m.slug}><button type="button" onClick={() => setDexOpen(m)}>
                                <DexSprite mon={m} caught={caught.has(m.slug)} />
                                <span><small>No.{String(m.no).padStart(3, "0")}</small><b>{m.w.title}</b><small>{m.kind} · {m.status}</small></span>
                                {caught.has(m.slug) && <i aria-label="caught">★</i>}
                            </button></li>
                        ))}</ol>
                    )}
                </section>
            )}
        </div>
    );
}

// a creature drawn into its own little canvas (silhouette until caught)
function DexSprite({ mon, big, caught }) {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current, x = c.getContext("2d");
        x.clearRect(0, 0, 24, 24); A.creature(x, 0, 0, mon.slug, 1, !caught, mon.w.kind);
    }, [mon, caught]);
    return <canvas ref={ref} className={big ? "pk-sprite pk-sprite-big" : "pk-sprite"} width={24} height={24} aria-hidden />;
}
