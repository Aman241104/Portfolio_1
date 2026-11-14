import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { worlds, RECRUITER_WORLD, findWorld } from "#worlds/registry.js";
import WorldPicker from "#shell/WorldPicker.jsx";
import { pickWorld } from "#machine/Machine.jsx";
import { profile, socials } from "#content/profile.js";
import Work from "./Work.jsx";
import { work } from "../../content/work.js";
import Experience from "./Experience.jsx";
import Maintained from "./Maintained.jsx";
import Certifications from "./Certifications.jsx";
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

// One observer for the whole scroll story: each [data-reveal] block gets data-in once, CSS does the rest.
const useReveal = (root) => useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.dataset.in = ""; io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    root.current.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
}, [root]);

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
    const [skip] = useState(true);              // instant click-to-skip so recruiters are never gated
    const finish = useRef(onDone);
    finish.current = onDone;
    // the count carries on from where it is when the next milestone arrives (it used to restart from 0 each time)
    const v = useRef(0);
    useEffect(() => {
        let raf, t0 = performance.now();
        const tick = (t = t0) => {
            const f = Math.min(4, (t - t0) / 16.7); t0 = t;           // time-based: same pace on a slow phone
            v.current = Math.min(target, v.current + Math.max(0.35, (target - v.current) * (1 - Math.pow(0.92, f))) * Math.max(1, f));
            setN(Math.floor(v.current));
            if (v.current < target) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target]);
    const skipNow = () => { if (!skip) return; v.current = 100; setN(100); };
    const out = n >= 100;
    useEffect(() => {
        if (!out) return;
        const t = setTimeout(() => finish.current(), 900);     // after the collapse-to-a-line animation
        return () => clearTimeout(t);
    }, [out]);
    return (
        <div className="boot" data-out={out || undefined} data-skip={skip || undefined} aria-hidden onClick={skipNow}>
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
            if (r.ok) { setState({ phase: "sent", msg: d.no ? `Ticket No. ${String(d.no).padStart(4, "0")}` : "" }); onSent(); sfx.print(); track("contact_sent"); return; }
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
        <button type="button" className="mono sound" aria-pressed={on} onClick={() => setSound(!on)} title="Sound (S)" aria-label={`Sound ${on ? "on" : "off"}`}>
            <span className="eq" aria-hidden><i /><i /><i /><b className="eq-dot" /></span>
        </button>
    );
};

// Minimal Geist Mono theme link ("Light" / "Dark") right next to Sound off — triggers the organic Ink-Bleed reveal.
const ThemeToggle = ({ light, onToggle }) => {
    useEffect(() => {
        const k = (e) => { if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey && !e.target.closest?.("input, textarea")) onToggle(null); };
        window.addEventListener("keydown", k);
        return () => window.removeEventListener("keydown", k);
    }, [onToggle]);
    return (
        <button type="button" className="mono theme-link" aria-pressed={light} onClick={(e) => onToggle(e)} title="Studio light (T)">
            <span className="theme-dot" aria-hidden />{light ? "Dark" : "Light"}
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
    const marqueeTrack = useRef(null);
    const lastRatchet = useRef(0);
    const heroOn = useInView(hero);
    // Scroll-velocity WAAPI playbackRate + skewX shear on the marquee band
    useEffect(() => {
        const el = marqueeTrack.current;
        if (!el || reduced()) return;
        let lastY = window.scrollY, lastT = performance.now(), timer;
        const onScroll = () => {
            const y = window.scrollY, now = performance.now();
            const dt = Math.max(8, now - lastT), dy = y - lastY;
            lastY = y; lastT = now;
            const v = dy / dt; // px per ms
            const anim = el.getAnimations?.()[0];
            if (anim) {
                const dir = dy < -1 ? -1 : 1;
                anim.playbackRate = dir * Math.min(4.2, 1 + Math.abs(v) * 1.4);
            }
            el.style.setProperty("--mskw", `${Math.max(-6, Math.min(6, v * 2.2)).toFixed(2)}deg`);
            clearTimeout(timer);
            timer = setTimeout(() => {
                const a = el.getAnimations?.()[0];
                if (a) a.playbackRate = 1;
                el.style.setProperty("--mskw", "0deg");
            }, 160);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
    }, []);
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
    useReveal(footer);
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
    // Light Mode Gallery Atelier ("light") vs Dark Studio (default)
    const [light, setLight] = useState(() => { try { return localStorage.getItem("px01-theme") === "light"; } catch { return false; } });
    const [inkWave, setInkWave] = useState(null);      // { x, y, r, toLight } for the guaranteed SVG fractal ink-bleed transition
    useEffect(() => {
        try { localStorage.setItem("px01-theme", light ? "light" : "dark"); } catch { /* ignore */ }
        document.documentElement.dataset.theme = light ? "light" : "dark";
    }, [light]);

    const toggleLight = (e) => {
        const x = e?.clientX ?? window.innerWidth - 150;
        const y = e?.clientY ?? 36;
        const maxR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 1.25;
        sfx.tick();
        if (reduced()) {
            setLight((l) => !l);
            return;
        }
        const toLight = !light;
        setInkWave({ x, y, maxR, toLight });
        // Flip the underlying DOM + 3D studio right as the fractal ink wave covers the center of the screen
        setTimeout(() => {
            setLight(toLight);
        }, 420);
        setTimeout(() => {
            setInkWave(null);
        }, 1150);
    };

    // the boot plays once per session; coming back from a world goes straight to the machine dropping in
    const [lit, setLit] = useState(() => { try { return reduced() || !!sessionStorage.getItem("px01-booted"); } catch { return reduced(); } });
    const locked = useRef(0);
    const phaseRef = useRef(phase);
    phaseRef.current = phase;
    const bump = (v) => setProgress((p) => Math.max(p, v));

    useEffect(() => { monoReady.then(() => { setFontsOk(true); bump(35); }); }, []);
    // never trap anyone on the boot screen: a slow GPU or a lost WebGL context still gets the page after 9 s
    useEffect(() => { const t = setTimeout(() => { bump(100); setBooted(true); }, 5000); return () => clearTimeout(t); }, []);
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
        hero.current?.style.setProperty("--to", findWorld(id)?.paper ?? "#000");   // fade to the next world's own paper
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
            data-light={light || undefined} data-entering={phase === "transitioning" || undefined}>
            {/* GPU-composited 60fps Ink-Bleed Transition Overlay */}
            {inkWave && (
                <div className="ink-bleed-overlay" aria-hidden="true">
                    <span
                        className="ink-bleed-red"
                        style={{ left: `${inkWave.x}px`, top: `${inkWave.y}px`, width: `${inkWave.maxR * 2}px`, height: `${inkWave.maxR * 2}px` }}
                    />
                    <span
                        className="ink-bleed-body"
                        style={{
                            left: `${inkWave.x}px`,
                            top: `${inkWave.y}px`,
                            width: `${inkWave.maxR * 2}px`,
                            height: `${inkWave.maxR * 2}px`,
                            background: inkWave.toLight ? "#ebe8e2" : "#050506",
                        }}
                    />
                </div>
            )}
            <section ref={hero} className="hero" aria-label="PX-01, the reality selector">
                {/* 0. Background layer: Unified sculpted architectural ridge (Dark Obsidian in Dark Mode ↔ Alabaster Limestone in Light Mode) */}
                <svg className="hero-ridge" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden>
                    <defs>
                        <linearGradient id="ridge-top" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--ridge-0)" />
                            <stop offset="45%" stopColor="var(--ridge-1)" />
                            <stop offset="100%" stopColor="var(--ridge-2)" />
                        </linearGradient>
                        <linearGradient id="ridge-shadow" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="var(--ridge-sh0)" />
                            <stop offset="50%" stopColor="var(--ridge-sh1)" />
                            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </linearGradient>
                        <radialGradient id="top-arch-glow" cx="50%" cy="0%" r="50%">
                            <stop offset="0%" stopColor="var(--arch-0)" stopOpacity="0.92" />
                            <stop offset="70%" stopColor="var(--arch-1)" stopOpacity="0.48" />
                            <stop offset="100%" stopColor="var(--void)" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="960" cy="-60" r="380" fill="url(#top-arch-glow)" />
                    <circle cx="-60" cy="590" r="310" fill="none" stroke="var(--ridge-line)" strokeWidth="1" />
                    <circle cx="1990" cy="540" r="290" fill="none" stroke="var(--ridge-line)" strokeWidth="1" />
                    <path d="M 1860 440 L 1884 440 M 1872 428 L 1872 452" stroke="var(--ridge-cross)" strokeWidth="1" />
                    <path d="M 0 520 Q 190 560 360 660 Q 520 560 720 550 L 1220 550 Q 1450 560 1620 650 Q 1780 610 1920 640 L 1920 1080 L 0 1080 Z" fill="url(#ridge-top)" />
                    <path d="M 360 660 Q 520 560 720 550 L 960 690 L 360 880 Z" fill="url(#ridge-shadow)" />
                    <path d="M 0 895 L 58 904 L 132 942 L 228 968 L 340 1022 L 485 1080 L 0 1080 Z" fill="var(--rock-1)" opacity="0.65" />
                    <path d="M 0 925 L 88 946 L 195 990 L 320 1045 L 410 1080 L 0 1080 Z" fill="var(--rock-2)" opacity="0.45" />
                </svg>

                {/* Subtle atmospheric floor fog & studio depth in Dark Mode */}
                {!light && <div className="dark-floor-fog" aria-hidden />}

                {/* 1. Monumental "Portfolio" wordmark: identical position & scale in both modes (z-index: 1, behind the 3D machine) */}
                <p className="hero-word" aria-hidden>{"Portfolio".split("").map((c, i) => <span key={i} style={{ "--i": i }}>{c}</span>)}</p>

                {fontsOk && (
                    <Suspense fallback={null}>
                        <Studio active={heroOn} count={lit ? plays : 0} debug={debug} onDebug={() => { setDebug((d) => !d); track("debug_toggled"); }}
                            ticket={phase === "revealed" && result ? { no: plays, name: result.name, symbols: result.symbols } : null}
                            onTicket={() => { if (!result) return; track("ticket_clicked", { world: result.id }); enter(result.id); }} spinning={phase === "spinning"} pulled={pulled} booted={booted}
                            target={target} entering={phase === "transitioning"} jackpot={phase === "revealed" || phase === "transitioning"} lit={lit} light={light}
                            onPull={pull} onArm={onArm} onReelStop={onReelStop} onAnchors={onAnchors}
                            onCreated={() => bump(65)} onFrame={() => bump(100)} onBooted={() => setBooted(true)} />
                    </Suspense>
                )}

                <header className="bar">
                    <div className="bar-brand">
                        <span className="mv-text">AMAN</span>
                        <p className="brand-sub mono">FULL-STACK ENGINEER<br /><i aria-hidden>●</i> AHMEDABAD, INDIA</p>
                    </div>
                    <p className="mono center"><span className="star" aria-hidden>✦</span>PX‑01 -- REALITY SELECTOR</p>
                    <div className="mono right">
                        <ThemeToggle light={light} onToggle={toggleLight} />
                        <span className="clock"><Clock /></span>
                        <SoundToggle />
                    </div>
                </header>

                {/* Unified editorial annotations & red signature — identical coordinates across Dark ↔ Light */}
                <div className="ink" aria-hidden>
                    <div className="creative-callout">
                        <p className="creative-script">Creative Developer<span className="creative-line" /></p>
                        <p className="creative-tag mono">[ EXPERIMENTAL PORTFOLIO ]</p>
                    </div>
                    <p className="signature">
                        Aman Patel
                        <svg className="sig-underline" viewBox="0 0 320 28" aria-hidden>
                            <path d="M 18 22 Q 165 11 308 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                        </svg>
                    </p>
                    <div className="pin pin-win"><Doodle d={RING} className="d-ring" view="0 0 206 64" /></div>
                </div>

                <div className="below">
                    {(phase === "revealed" || phase === "transitioning") && result ? (
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
                            <button type="button" className="pull" onClick={pull} disabled={busy}>
                                PULL THE LEVER <i aria-hidden>→</i>
                            </button>
                            <div className="cta-alt">
                                <button type="button" onClick={() => document.querySelector(".work")?.scrollIntoView({ behavior: "smooth" })}>
                                    JUST SHOW ME THE WORK
                                </button>
                                <button type="button" className="phone-only" onClick={() => setPicking(true)}>All worlds</button>
                                <a className="phone-only" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="light-foot-bar">
                    <div className="lf-left">
                        <p className="mono lf-idx"><span>01 / 07</span><i /></p>
                        <p className="lf-tag">One developer. Multiple creative dimensions.</p>
                    </div>
                    <nav className="lf-nav" aria-label="Portfolio sections">
                        <button type="button" onClick={() => document.querySelector(".work")?.scrollIntoView({ behavior: "smooth" })}>Projects</button>
                        <span aria-hidden>·</span>
                        <button type="button" onClick={() => document.querySelector(".xp")?.scrollIntoView({ behavior: "smooth" })}>Experience</button>
                        <span aria-hidden>·</span>
                        <button type="button" onClick={() => document.querySelector(".certs-sec")?.scrollIntoView({ behavior: "smooth" })}>Certs</button>
                        <span aria-hidden>·</span>
                        <button type="button" onClick={() => document.querySelector(".skills-sec")?.scrollIntoView({ behavior: "smooth" })}>Skills</button>
                        <span aria-hidden>·</span>
                        <button type="button" onClick={() => document.querySelector(".land")?.scrollIntoView({ behavior: "smooth" })}>Contact</button>
                        <span aria-hidden>·</span>
                        <a href={profile.resume} target="_blank" rel="noreferrer" onClick={() => track("resume_opened", { from: "hero_bar" })}>Résumé ↗</a>
                        <span aria-hidden>·</span>
                        <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                        <span aria-hidden>·</span>
                        <button type="button" onClick={() => setPicking(true)}>All Worlds</button>
                    </nav>
                    <button type="button" className="lf-scroll" onClick={() => document.querySelector(".stats")?.scrollIntoView({ behavior: "smooth" })}>
                        Scroll <i aria-hidden>︾</i>
                    </button>
                </div>
                <div className="curtain" aria-hidden />
                {debug && (
                    <div className="debug-hud mono" role="status">
                        <p>PX-01 / debug view</p><pre />
                        <button type="button" onClick={() => setDebug(false)}>Close · or hold the lever again</button>
                    </div>
                )}
                {!lit && <Boot target={progress} onDone={() => { setLit(true); try { sessionStorage.setItem("px01-booted", "1"); } catch { /* private mode */ } }} />}
                {picking && <WorldPicker onSelect={(id) => enter(id)} onClose={() => setPicking(false)} />}
            </section>

            <div className="marquee" aria-hidden>
                <div ref={marqueeTrack} className="marquee-track">
                    {[0, 1].map((k) => <span key={k}>{MARQUEE.map((m) => <span key={m}>{m}<i>✺</i></span>)}</span>)}
                </div>
            </div>

            <footer ref={footer} className="foot">
<Stats />
                <Work />
                <Maintained />
                <Experience />
                <Certifications />
                <Skills />
                <Tape items={["Say hello", "Résumé one tap away", "Replies from a real person", "Ahmedabad · IST", "Open to full-stack roles"]} tilt={1.4} />

                <div ref={land} className="land" onClick={ripple}>
                    <div className="foot-dots" aria-hidden>
                        <Suspense fallback={null}><DotField active={footerOn} eventSource={footer} pulse={pulse} light={light} /></Suspense>
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
                    <nav className="keys keys-3" aria-label="Site index" onPointerOver={(e) => {
                        if (e.pointerType !== "mouse" || !e.target.closest?.(".key")) return;
                        const now = performance.now();
                        if (now - lastRatchet.current > 80) { lastRatchet.current = now; sfx.ratchet(); }
                    }}>
                        {[
                            ["Contact", "Résumé, email and profiles", [
                                { label: "Résumé", hint: "One-page PDF", href: profile.resume, ext: true, icon: "↓" },
                                { label: "Email", hint: profile.email, href: `mailto:${profile.email}`, icon: "↗" },
                                { label: "WhatsApp", hint: profile.phone, href: profile.whatsapp, ext: true, icon: "↗" },
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
                    <section className="worlds-matrix-wrap" aria-label="12 portfolio realities">
                        <div className="wm-head">
                            <h3 className="mono">07 // REALITIES ({String(worlds.length).padStart(2, "0")})</h3>
                            <p className="mono">12 interactive dimensions — pick any world</p>
                        </div>
                        <div className="worlds-matrix">
                            {worlds.map((w, i) => (
                                <button key={w.id} type="button" className="wm-cell" onClick={() => onSelect(w.id)}>
                                    <span className="mono wm-idx">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="wm-name">{w.name}</span>
                                    <span className="wm-tag">{w.tagline}</span>
                                    <span className="wm-go" aria-hidden>→</span>
                                </button>
                            ))}
                        </div>
                    </section>
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
