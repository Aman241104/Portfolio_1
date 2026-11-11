import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { worlds, RECRUITER_WORLD } from "#worlds/registry.js";
import WorldPicker from "#shell/WorldPicker.jsx";
import { pickWorld } from "#machine/Machine.jsx";
import { profile, socials } from "#content/profile.js";
import Work from "./Work.jsx";
import { work } from "../../content/work.js";
import Experience from "./Experience.jsx";
import Maintained from "./Maintained.jsx";
import Skills from "./Skills.jsx";
import Stats, { Tape } from "./Stats.jsx";
import LiquidDock from "./LiquidDock.jsx";
import Nudge from "./Nudge.jsx";
import MultiverseName from "../lab/MultiverseName.jsx";
import sig from "./signature.json";
import { sfx, setSound, soundOn, onSound } from "#machine/sfx.js";
import { track } from "../analytics.js";
import "./home.css";

// Main screen (docs/DESIGN_DIRECTION.md §10–13): PX-01 floating in a dark exhibition space, the component archive
// hanging either side, the giant "Portfolio" signed and annotated by hand, and a footer of dust you can touch.
// Red handwriting: the script name across the word, a few notes, my real signature, "pull me" pinned to the lever,
// and the result circle around the reels.
const Studio = lazy(() => import("./Studio.jsx"));
const DotField = lazy(() => import("./DotField.jsx"));

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The reel labels are painted onto canvases, so the mono face must be loaded before the machine mounts.
const monoReady = new FontFace("Geist Mono", "url(/fonts/GeistMono-500.ttf)", { weight: "600" })
    .load().then((f) => document.fonts.add(f)).catch(() => {});

const useInView = (ref, margin = "0px") => {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
        io.observe(ref.current);
        return () => io.disconnect();
    }, [ref, margin]);
    return inView;
};

const Clock = () => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
    return <>{now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" })} IST</>;
};

// Hand-drawn marks. pathLength=1 lets CSS draw every stroke in with the same dash animation.
const Doodle = ({ d, className, view = "0 0 120 60", style }) => (
    <svg className={`doodle ${className}`} viewBox={view} style={style} aria-hidden>
        {[].concat(d).map((p, i) => <path key={i} d={p} pathLength="1" style={{ "--i": i }} />)}
    </svg>
);
const ARROW = ["M6 8 C 40 4, 86 18, 112 50", "M96 46 L113 52 L112 34"];        // "pull me" → down-right to the knob
const RING = ["M18 34 C 10 8, 186 2, 194 28 C 200 54, 26 62, 12 40 C 6 30, 30 14, 70 10"];  // hand-drawn ellipse
// My real signature (traced from a photo, src/home/signature.json): x in [-1, 1], y up → SVG space 200 wide.
const SIG = sig.strokes.map((st) => "M" + st.map(([x, y]) => `${((x + 1) * 100).toFixed(1)} ${((0.55 - y) * 100).toFixed(1)}`).join(" L"));

// Boot screen = the loader (§5: "the loader is a brand moment"). The counter chases real milestones
// (fonts → 3D code → first rendered frame), then the screen collapses to a line of light and the machine drops in.
const BOOT_LINES = [[0, "PX-01 reality selector"], [0, "Firmware 2026.11 · Aman Patel"], [35, "Reels ............ OK"], [65, "3 realities ...... OK"], [100, "Key light ........ OK"]];
const Boot = ({ target, onDone }) => {
    const [n, setN] = useState(0);
    const [skip, setSkip] = useState(false);              // never trap anyone: after 2.5 s a click ends the boot
    useEffect(() => { const t = setTimeout(() => setSkip(true), 2500); return () => clearTimeout(t); }, []);
    const finish = useRef(onDone);
    finish.current = onDone;
    useEffect(() => {
        let raf, v = 0;
        const tick = () => {
            v = Math.min(target, v + Math.max(0.35, (target - v) * 0.08));
            setN(Math.floor(v));
            if (v < target) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target]);
    const out = n >= 100;
    useEffect(() => {
        if (!out) return;
        const t = setTimeout(() => finish.current(), 900);     // after the collapse-to-a-line animation
        return () => clearTimeout(t);
    }, [out]);
    return (
        <div className="boot" data-out={out || undefined} data-skip={skip || undefined} aria-hidden onClick={() => skip && setN(100)}>
            <div className="boot-log mono">{BOOT_LINES.filter(([at]) => n >= at).map(([, l]) => <p key={l}>{l}</p>)}</div>
            <p className="boot-hint mono">{skip ? "Click anywhere to skip" : isTouch() ? "Sound is off · switch it on top right" : "Sound is off · press S for clicks and coins"}</p>
            <div className="boot-line" />
        </div>
    );
};

// A trailing ring for fine pointers: grows over anything clickable and reads "PULL" over the lever.
const Cursor = () => {
    const ref = useRef(null);
    useEffect(() => {
        if (!matchMedia("(pointer: fine)").matches || reduced()) return;
        const el = ref.current, p = { x: -100, y: -100 }, c = { x: -100, y: -100 };
        let raf, hot = false;
        const move = (e) => { p.x = e.clientX; p.y = e.clientY; hot = !!e.target.closest?.("a, button"); };
        const loop = () => {
            c.x += (p.x - c.x) * 0.2; c.y += (p.y - c.y) * 0.2;
            const grab = document.body.style.cursor.includes("grab");
            el.style.transform = `translate(${c.x}px, ${c.y}px)`;
            el.dataset.state = grab ? "pull" : hot ? "hot" : "";
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("pointermove", move);
        raf = requestAnimationFrame(loop);
        return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
    }, []);
    return <div ref={ref} className="cursor" aria-hidden><span>Pull</span></div>;
};

// Bookend: the giant name at the foot of the page, signed like the hero. Letters lean up toward a mouse cursor;
// on touch they wave in when the word scrolls into view, and any letter jumps when tapped.
const SIGN = "Aman Patel".split("");
const SignOff = () => {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        const el = ref.current;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); el.dataset.live = e.isIntersecting ? "1" : ""; }, { threshold: 0.35 });
        io.observe(el);
        if (!matchMedia("(pointer: fine)").matches || reduced()) return () => io.disconnect();
        const letters = [...el.querySelectorAll(".so-l")], lift = letters.map(() => 0);
        let raf, mx = -1e4, my = -1e4;
        const move = (e) => { mx = e.clientX; my = e.clientY; };
        const loop = () => {
            if (el.dataset.live) {
                const r = el.getBoundingClientRect(), cy = r.top + r.height * 0.55;
                letters.forEach((l, i) => {
                    const cx = r.left + l.offsetLeft + l.offsetWidth / 2;     // offsets ignore transforms: no feedback
                    const k = Math.max(0, 1 - Math.hypot(mx - cx, (my - cy) * 1.6) / 340);
                    lift[i] += (k - lift[i]) * 0.14;
                    l.style.setProperty("--lift", lift[i].toFixed(3));
                });
            }
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("pointermove", move);
        raf = requestAnimationFrame(loop);
        return () => { io.disconnect(); window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
    }, []);
    const jump = (e) => {
        const l = e.target.closest(".so-l");
        if (!l) return;
        l.classList.remove("jump"); void l.offsetWidth; l.classList.add("jump");
        sfx.ratchet();
    };
    return (
        <div ref={ref} className="signoff" data-in={seen || undefined} onPointerDown={jump} aria-hidden>
            <p className="so-word">{SIGN.map((c, i) => <span key={i} className={c === " " ? "so-l so-gap" : "so-l"} style={{ "--i": i }}>{c === " " ? "\u00a0" : c}</span>)}</p>
            <svg className="so-sig doodle" viewBox="0 -4 200 130">
                {SIG.map((d, i) => <path key={i} d={d} pathLength="1" style={{ "--i": i * 0.6 }} />)}
                {sig.dots.map(([x, y], i) => <circle key={i} cx={(x + 1) * 100} cy={(0.55 - y) * 100} r="3" />)}
            </svg>
        </div>
    );
};

// A note sent "through the machine": /api/contact stores it (Neon) and emails it (Resend). If the backend isn't
// switched on, the same words open in the visitor's mail app instead, so nothing typed is ever lost.
const ContactForm = ({ onSent }) => {
    const [state, setState] = useState({ phase: "idle", msg: "" });
    const submit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setState({ phase: "sending", msg: "" });
        const mail = () => `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${data.name || "your site"}`)}&body=${encodeURIComponent(data.message || "")}`;
        try {
            const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            const d = await r.json().catch(() => ({}));
            if (r.ok) { setState({ phase: "sent", msg: d.no ? `Ticket No. ${String(d.no).padStart(4, "0")}` : "" }); onSent(); sfx.win(); track("contact_sent"); return; }
            if (r.status === 400 || r.status === 429) { setState({ phase: "idle", msg: d.error }); return; }
            setState({ phase: "fallback", msg: d.error || "", href: mail() });
        } catch { setState({ phase: "fallback", msg: "", href: mail() }); }
    };
    if (state.phase === "sent") return (
        <div className="msg-sent" role="status">
            <p className="mono red">Delivered{state.msg ? ` · ${state.msg}` : ""}</p>
            <p>Thanks. It's in my inbox, and my reply goes to the address you gave.</p>
        </div>
    );
    return (
        <form className="msg" onSubmit={submit}>
            <p className="mono">Or send a note through the machine</p>
            <div className="msg-row">
                <input name="name" required maxLength={80} placeholder="Your name" autoComplete="name" aria-label="Your name" />
                <input name="email" type="email" required maxLength={200} placeholder="Email" autoComplete="email" aria-label="Your email" />
            </div>
            <textarea name="message" required minLength={10} maxLength={4000} rows={3} placeholder="What are we building?" aria-label="Message" />
            <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
            <div className="msg-foot">
                <p className="mono" aria-live="polite">
                    {state.phase === "fallback" ? <a href={state.href}>{state.msg || "The machine is offline."} Open it in your mail app ↗</a> : state.msg}
                </p>
                <button type="submit" className="block-btn" disabled={state.phase === "sending"}>{state.phase === "sending" ? "Sending…" : "Send →"}</button>
            </div>
        </form>
    );
};

// Sound is off until asked for. S toggles it from anywhere on the page.
const SoundToggle = () => {
    const [on, setOn] = useState(soundOn);
    useEffect(() => onSound(setOn), []);
    useEffect(() => {
        const k = (e) => { if ((e.key === "s" || e.key === "S") && !e.metaKey && !e.ctrlKey && !e.target.closest?.("input, textarea")) setSound(!soundOn()); };
        window.addEventListener("keydown", k);
        return () => window.removeEventListener("keydown", k);
    }, []);
    return (
        <button type="button" className="mono sound" aria-pressed={on} onClick={() => setSound(!on)} title="Sound (S)">
            <span className="eq" aria-hidden><i /><i /><i /></span>Sound {on ? "on" : "off"}
        </button>
    );
};

const MARQUEE = ["Pick a reality", "Desktop OS", "Editorial", "Terminal", "Album Rollout", "Ahmedabad, IN", "Open to work"];

// The machine as an explicit state machine, so a half-finished animation can never strand the UI:
//   idle → armed (lever grabbed) → spinning → locking (reels report as they physically stop) → revealed → transitioning
const LABEL = { idle: "", armed: "Armed — let go past the detent", spinning: "Spinning", locking: "Locking", revealed: "Reality selected", transitioning: "Entering" };
const isTouch = () => matchMedia("(pointer: coarse)").matches;

const Home = ({ onSelect }) => {
    const hero = useRef(null);
    const footer = useRef(null);
    const enterBtn = useRef(null);
    const heroOn = useInView(hero);
    // phones: the world pill steps aside while the liquid dock is up (one floating bar, not two)
    useEffect(() => { document.body.toggleAttribute("data-dock", !heroOn); return () => document.body.removeAttribute("data-dock"); }, [heroOn]);
    // liquid glass: the light inside any .lg panel follows the cursor / finger
    useEffect(() => {
        const light = (e) => {
            const el = e.target.closest?.(".lg");
            if (!el) return;
            const r = el.getBoundingClientRect();
            el.style.setProperty("--gx", `${e.clientX - r.left}px`); el.style.setProperty("--gy", `${e.clientY - r.top}px`);
        };
        addEventListener("pointermove", light, { passive: true }); addEventListener("pointerdown", light, { passive: true });
        return () => { removeEventListener("pointermove", light); removeEventListener("pointerdown", light); };
    }, []);
    const footerOn = useInView(footer, "200px");
    const land = useRef(null);
    const [fontsOk, setFontsOk] = useState(false);
    const [booted, setBooted] = useState(false);
    const [phase, setPhase] = useState("idle");
    const [pulled, setPulled] = useState(false);
    const [result, setResult] = useState(null);
    const [target, setTarget] = useState();
    const [plays, setPlays] = useState(427);
    const [shared, setShared] = useState(false);       // true once the count comes from the shared counter (api/pulls.js)
    const [debug, setDebug] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pulse, setPulse] = useState(0);                         // copy email → a ripple runs through the dunes
    const ripple = (e) => {                                         // click / tap the dunes (not a link) → ring of light
        if (e.target.closest("a, button, form, .signoff, .keys")) return;
        setPulse((n) => n + 1);
        track("dunes_tapped");
        try { navigator.vibrate?.(10); } catch { /* ignore */ }
    };
    const pullAgain = () => {
        hero.current.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
        setTimeout(() => { setPhase("idle"); setTimeout(() => pullRef.current(), 40); }, reduced() ? 0 : 1100);
    };
    const copyEmail = () => {
        navigator.clipboard.writeText(profile.email)
            .then(() => { track("email_copied"); setCopied(true); setPulse((n) => n + 1); sfx.coin(0); try { navigator.vibrate?.(15); } catch { /* ignore */ } setTimeout(() => setCopied(false), 1800); })
            .catch(() => { location.href = `mailto:${profile.email}`; });
    };
    const [picking, setPicking] = useState(false);
    const [progress, setProgress] = useState(8);
    const [lit, setLit] = useState(() => reduced());
    const locked = useRef(0);
    const phaseRef = useRef(phase);
    phaseRef.current = phase;
    const bump = (v) => setProgress((p) => Math.max(p, v));

    useEffect(() => { monoReady.then(() => { setFontsOk(true); bump(35); }); }, []);
    // never trap anyone on the boot screen: a slow GPU or a lost WebGL context still gets the page after 9 s
    useEffect(() => { const t = setTimeout(() => { bump(100); setBooted(true); }, 9000); return () => clearTimeout(t); }, []);
    useEffect(() => { if (phase === "revealed") { enterBtn.current?.focus({ preventScroll: true }); sfx.win(); } }, [phase]);
    useEffect(() => { if (lit) sfx.power(); }, [lit]);
    // Shared pull counter. Not configured (or local dev) → keep the house number and say nothing about it.
    useEffect(() => {
        if (import.meta.env.DEV) return;                // vite dev has no /api
        fetch("/api/pulls").then((r) => (r.ok ? r.json() : null)).then((d) => {
            if (d && Number.isFinite(d.pulls)) { setPlays(d.pulls); setShared(true); }
        }).catch(() => {});
    }, []);

    // Pull → pick a world (no repeats this session) → reels spin → each reel locks on its symbol → reveal.
    const pull = () => {
        if (phaseRef.current !== "idle" && phaseRef.current !== "armed") return;
        const world = pickWorld();
        world.load();                                         // the spin hides the chunk download
        setResult(world); setPlays((n) => n + 1);
        track("lever_pulled", { world: world.id });
        if (!import.meta.env.DEV) fetch("/api/pulls", { method: "POST" }).then((r) => (r.ok ? r.json() : null)).then((d) => { if (d?.pulls) setPlays(d.pulls); }).catch(() => {});
        if (reduced()) { setPhase("revealed"); return; }      // no spin, straight to the result
        locked.current = 0;
        setTarget(worlds.indexOf(world));
        setPulled(true); setPhase("spinning");
        setTimeout(() => setPulled(false), 260);
        setTimeout(() => setPhase("locking"), 1300);          // spin time; the reels then decide when it's over
    };
    const onReelStop = () => { if (++locked.current === 3) setPhase("revealed"); };
    const onArm = (on) => setPhase((p) => (on && p === "idle" ? "armed" : !on && p === "armed" ? "idle" : p));
    const enter = (id) => {
        track("world_entered", { world: id });
        setPhase("transitioning");
        setTimeout(() => onSelect(id), reduced() ? 0 : 950);   // camera push + fade to black
    };
    const again = () => { setPhase("idle"); setTimeout(() => pullRef.current(), 30); };
    const pullRef = useRef(pull);
    pullRef.current = pull;

    // Annotations pinned to the 3D lever + reel window (written as CSS vars, no re-render per frame).
    const onAnchors = ({ kx, ky, wx, wy, ww }) => {
        const st = hero.current?.style;
        if (!st) return;
        st.setProperty("--kx", `${kx.toFixed(1)}px`); st.setProperty("--ky", `${ky.toFixed(1)}px`);
        st.setProperty("--wx", `${wx.toFixed(1)}px`); st.setProperty("--wy", `${wy.toFixed(1)}px`); st.setProperty("--ww", `${ww.toFixed(1)}px`);
    };

    // Space / Enter pulls, but only while the machine is on screen (otherwise Space should scroll).
    useEffect(() => {
        if (!heroOn) return;
        const onKey = (e) => {
            if (e.key !== " " && e.key !== "Enter") return;
            if (e.target.closest?.("button, a, input, textarea")) return;
            e.preventDefault();
            pullRef.current();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [heroOn]);

    const busy = phase !== "idle" && phase !== "armed";
    const status = LABEL[phase] || (isTouch() ? "Tap the red knob" : "Drag the lever · Space");

    return (
        <main className="home" data-lit={lit || undefined} data-booted={booted || undefined} data-phase={phase}
            data-entering={phase === "transitioning" || undefined}>
            <section ref={hero} className="hero" aria-label="PX-01, the reality selector">
                <h1 className="ident mono"><span>Aman Patel</span> — full-stack engineer, Ahmedabad <i aria-hidden>●</i> open to work</h1>
                <p className="hero-word" aria-hidden>{"Portfolio".split("").map((c, i) => <span key={i} style={{ "--i": i }}>{c}</span>)}</p>

                {fontsOk && (
                    <Suspense fallback={null}>
                        <Studio active={heroOn} count={lit ? plays : 0} debug={debug} onDebug={() => { setDebug((d) => !d); track("debug_toggled"); }}
                            ticket={phase === "revealed" && result ? { no: plays, name: result.name, symbols: result.symbols } : null}
                            onTicket={() => { if (!result) return; track("ticket_clicked", { world: result.id }); enter(result.id); }} spinning={phase === "spinning"} pulled={pulled} booted={booted}
                            target={target} entering={phase === "transitioning"} jackpot={phase === "revealed" || phase === "transitioning"} lit={lit}
                            onPull={pull} onArm={onArm} onReelStop={onReelStop} onAnchors={onAnchors}
                            onCreated={() => bump(65)} onFrame={() => bump(100)} onBooted={() => setBooted(true)} />
                    </Suspense>
                )}

                <header className="bar">
                    <MultiverseName scramble={phase === "spinning"} />
                    <p className="mono center">PX‑01 — Reality selector</p>
                    <div className="mono right"><SoundToggle /><span className="clock"><Clock /></span></div>
                </header>

                {/* handwriting pinned to the machine: what to grab, and (after a win) what was chosen */}
                <div className="ink" aria-hidden>
                    <span className="tag mono">[2026]</span>
                    <svg className="sig-mark doodle" viewBox="0 -4 200 130">
                        {SIG.map((d, i) => <path key={i} d={d} pathLength="1" style={{ "--i": i * 0.6 }} />)}
                        {sig.dots.map(([x, y], i) => <circle key={i} cx={(x + 1) * 100} cy={(0.55 - y) * 100} r="3" />)}
                    </svg>
                    <p className="note n-role">full-stack dev</p>
                    <p className="note n-craft">+ 3D &amp; AI</p>
                    <p className="note n-city">Ahmedabad, IN</p>
                    <p className="signature">Aman Patel</p>
                    <div className="pin pin-knob">
                        <p className="note">pull me</p>
                        <Doodle d={ARROW} className="d-arrow" />
                    </div>
                    <div className="pin pin-win"><Doodle d={RING} className="d-ring" view="0 0 206 64" /></div>
                </div>

                <div className="below">
                    {phase === "revealed" || phase === "transitioning" ? (
                        <section className="cta reveal" aria-live="polite" aria-label="Result">
                            <p className="mono">PX‑01 / Result {String(plays).padStart(6, "0")}</p>
                            <p className="mono red">Reality selected</p>
                            <h3>{result.name}</h3>
                            <p className="cta-sub">{result.tagline}</p>
                            <dl className="reels-read">
                                {["Era", "Medium", "Mood"].map((k, i) => <div key={k}><dt className="mono">{k}</dt><dd>{result.symbols[i]}</dd></div>)}
                            </dl>
                            <button ref={enterBtn} type="button" className="pull" onClick={() => enter(result.id)}>Enter this world <i aria-hidden>→</i></button>
                            <div className="cta-alt">
                                <button type="button" onClick={again}>Spin again</button>
                                <button type="button" onClick={() => setPicking(true)}>Browse all worlds</button>
                            </div>
                        </section>
                    ) : (
                        <div className="cta">
                            <p className="mono cta-label">PX‑01 / Reality selector</p>
                            <p className="mono cta-kicker">Optional · a style picker</p>
                            <ol className="how" aria-label="How the machine works">
                                <li><b>1</b>Pull the lever</li>
                                <li><b>2</b>Reels pick an era, medium &amp; mood</li>
                                <li><b>3</b>Your ticket opens that version of this portfolio</li>
                            </ol>
                            <p className="how-m">Optional: pull the lever, the reels pick a design style, your ticket opens it.</p>
                            <p className="mono status" aria-live="polite">{status}</p>
                            {shared && <p className="mono pulls">{plays.toLocaleString("en-IN")} pulls so far</p>}
                            <button type="button" className="pull" onClick={pull} disabled={busy}>Pull the lever <i aria-hidden>→</i></button>
                            <div className="cta-alt">
                                <button type="button" onClick={() => enter(RECRUITER_WORLD)}><span className="desk-only">Skip the machine · </span>View my work</button>
                                <button type="button" className="phone-only" onClick={() => setPicking(true)}>All worlds</button>
                                <a className="phone-only" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="tabs" aria-label="Go straight to a world">
                    {worlds.map((w) => (
                        <button key={w.id} type="button" onClick={() => enter(w.id)}><i aria-hidden>↗</i>{w.name}</button>
                    ))}
                    <a href={profile.resume} target="_blank" rel="noreferrer"><i aria-hidden>↗</i>Résumé</a>
                </nav>
                {/* the false floor fix: say plainly that the portfolio continues below the machine */}
                <button type="button" className="peek" onClick={() => document.querySelector(".stats")?.scrollIntoView({ behavior: "smooth" })}>
                    <span className="mono">Or just scroll · it's all below</span>
                    <span className="peek-list">{work.length} projects · Experience · Skills · Résumé · Contact</span>
                    <i aria-hidden>↓</i>
                </button>
                <div className="curtain" aria-hidden />
                {debug && (
                    <div className="debug-hud mono" role="status">
                        <p>PX-01 / debug view</p><pre />
                        <button type="button" onClick={() => setDebug(false)}>Close · or hold the lever again</button>
                    </div>
                )}
                {!lit && <Boot target={progress} onDone={() => setLit(true)} />}
                {picking && <WorldPicker onSelect={(id) => enter(id)} onClose={() => setPicking(false)} />}
            </section>

            <div className="marquee" aria-hidden>
                <div className="marquee-track">
                    {[0, 1].map((k) => <span key={k}>{MARQUEE.map((m) => <span key={m}>{m}<i>✺</i></span>)}</span>)}
                </div>
            </div>

            <footer ref={footer} className="foot">
<Stats />
                <Work />
                <Maintained />
                <Experience />
                <Skills />
                <Tape items={["Say hello", "Résumé one tap away", "Replies from a real person", "Ahmedabad · IST", "Open to full-stack roles"]} tilt={1.4} />

                <div ref={land} className="land" onClick={ripple}>
                    <div className="foot-dots" aria-hidden>
                        <Suspense fallback={null}><DotField active={footerOn} eventSource={footer} pulse={pulse} /></Suspense>
                    </div>
                    <div className="foot-head">
                        <div>
                            <p className="mono land-hint">↳ The dunes are live. {isTouch() ? "Tap them." : "Move through them, click them."}</p>
                            <h2>Pick a <b>reality</b>,<br />or skip the machine<br />and <b>say hello.</b></h2>
                        </div>
                        <div className="contact">
                            <p className="mono now"><i aria-hidden>●</i> Now: open to full-stack roles · Ahmedabad, on-site</p>
                            <button type="button" className="block-btn copy" onClick={copyEmail} aria-live="polite">
                                {copied ? "Copied to clipboard ✓" : profile.email}<span className="mono">{copied ? "" : "Copy"}</span>
                            </button>
                            <ContactForm onSent={() => setPulse((n) => n + 1)} />
                        </div>
                    </div>
                    <nav className="keys" aria-label="Site index">
                        {[
                            ["Worlds", "Four ways to see this site", worlds.map((w) => ({ label: w.name, hint: w.tagline, onClick: () => onSelect(w.id), icon: "→" }))],
                            ["Contact", "Résumé, email and profiles", [
                                { label: "Résumé", hint: "One-page PDF", href: profile.resume, ext: true, icon: "↓" },
                                { label: "Email", hint: profile.email, href: `mailto:${profile.email}`, icon: "↗" },
                                ...socials.filter((x) => ["LinkedIn", "Github"].includes(x.text)).map((x) => ({ label: x.text === "Github" ? "GitHub" : x.text, hint: x.text === "Github" ? "Code and repos" : "Work history", href: x.link, ext: true, icon: "↗" })),
                            ]],
                            ["Social", "Elsewhere online", socials.filter((x) => !["LinkedIn", "Github"].includes(x.text)).map((x) => ({ label: x.text, hint: "Follow along", href: x.link, ext: true, icon: "↗" }))],
                            ["Play", "For the curious", [
                                { label: "Pull the lever again", hint: "Back up to PX-01", onClick: pullAgain, knob: true },
                                { label: "PX-01 lab", hint: "The machine on its own", href: "/lab/machine.html", icon: "↗" },
                            ]],
                        ].map(([title, sub, items]) => (
                            <div key={title} className="keys-group">
                                <h3 className="mono">{title}</h3>
                                <p className="keys-sub">{sub}</p>
                                {items.map((k) => {
                                    const body = <><span className="k-label">{k.label}</span><span className="k-hint">{k.hint}</span>{k.knob ? <i aria-hidden className="k-dot" /> : <i aria-hidden>{k.icon}</i>}</>;
                                    return k.href
                                        ? <a key={k.label} className="key lg" href={k.href} {...(k.ext ? { target: "_blank", rel: "noreferrer" } : {})}>{body}</a>
                                        : <button key={k.label} type="button" className={k.knob ? "key lg knob" : "key lg"} onClick={k.onClick}>{body}</button>;
                                })}
                            </div>
                        ))}
                    </nav>
                    <SignOff />
                    <div className="legal mono">
                        <span>© 2026 Aman Patel. All realities reserved.</span>
                        <span>Built in Ahmedabad · <Clock /></span>
                    </div>
                </div>
            </footer>
            {/* phones: Mindcore's liquid tab bar (sections + résumé), once the machine is off screen */}
            <LiquidDock on={!heroOn} resume={profile.resume} />
            <Nudge />
            <Cursor />
        </main>
    );
};

export default Home;
