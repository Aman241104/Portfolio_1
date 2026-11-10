import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { worlds, RECRUITER_WORLD } from "#worlds/registry.js";
import { pickWorld } from "#machine/Machine.jsx";
import { profile, projects, socials } from "#content/profile.js";
import MultiverseName from "../lab/MultiverseName.jsx";
import sig from "./signature.json";
import "./home.css";

// Main screen (docs/DESIGN_DIRECTION.md §10): the machine floating in the dark over a giant "Portfolio",
// my name written across it by hand, and a footer of dust you can touch.
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
const ARROW = ["M6 50 C 30 8, 78 4, 110 26", "M96 14 L111 27 L93 33"];
const STAR = ["M30 4 C 31 20, 34 26, 56 30 C 36 33, 32 38, 30 56 C 28 38, 24 33, 4 30 C 24 27, 29 20, 30 4"];
const SCRIBBLE = ["M4 22 C 40 6, 80 30, 120 14 S 196 6, 236 20"];
const LOOP = ["M14 34 C 6 10, 104 2, 112 24 C 118 46, 22 56, 8 38 C 2 28, 18 12, 44 9"];
const CROSS = ["M8 8 L 40 38", "M38 6 L 10 40"];
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
            <p className="boot-count">{String(n).padStart(3, "0")}</p>
            <div className="boot-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></div>
            <p className="boot-hint mono">{skip ? "Click anywhere to skip" : "Turn your sound off. There isn't any."}</p>
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

const MARQUEE = ["Pick a reality", "Desktop OS", "Editorial", "Terminal", "Album Rollout — soon", "Open to work"];

const Home = ({ onSelect }) => {
    const hero = useRef(null);
    const footer = useRef(null);
    const heroOn = useInView(hero);
    const footerOn = useInView(footer, "200px");
    const [fontsOk, setFontsOk] = useState(false);
    const [booted, setBooted] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [pulled, setPulled] = useState(false);
    const [landed, setLanded] = useState(null);
    const [entering, setEntering] = useState(false);
    const busy = useRef(false);
    const [target, setTarget] = useState();
    const [progress, setProgress] = useState(8);
    const [lit, setLit] = useState(() => reduced());
    const bump = (v) => setProgress((p) => Math.max(p, v));

    useEffect(() => { monoReady.then(() => { setFontsOk(true); bump(35); }); }, []);
    // never trap anyone on the boot screen: a slow GPU or a lost WebGL context still gets the page after 9 s
    useEffect(() => { const t = setTimeout(() => { bump(100); setBooted(true); }, 9000); return () => clearTimeout(t); }, []);

    // Pull → pick a world (no repeats this session) → reels land on its symbols → push into the window → load it.
    const pull = () => {
        if (busy.current) return;
        busy.current = true;
        const world = pickWorld();
        world.load();                                         // the spin hides the chunk download
        if (reduced()) { setLanded(world); setTimeout(() => onSelect(world.id), 400); return; }
        setTarget(worlds.indexOf(world));
        setPulled(true); setSpinning(true); setLanded(null);
        setTimeout(() => setPulled(false), 260);
        setTimeout(() => setSpinning(false), 1400);
        setTimeout(() => setLanded(world), 3000);
        setTimeout(() => setEntering(true), 3700);
        setTimeout(() => onSelect(world.id), 4700);
    };
    const pullRef = useRef(pull);
    pullRef.current = pull;

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

    const status = landed ? `Landing in ${landed.name}` : spinning ? "Selecting a reality…" : matchMedia("(pointer: coarse)").matches ? "Tap the red knob" : "Drag the lever · Space";

    return (
        <main className="home" data-lit={lit || undefined} data-booted={booted || undefined} data-entering={entering || undefined}>
            <section ref={hero} className="hero" aria-label="PX-01, the reality selector">
                <h1 className="ident mono"><span>Aman Patel</span> — full-stack engineer, Ahmedabad <i aria-hidden>●</i> open to work</h1>
                <p className="hero-word" aria-hidden>{"Portfolio".split("").map((c, i) => <span key={i} style={{ "--i": i }}>{c}</span>)}</p>

                {fontsOk && (
                    <Suspense fallback={null}>
                        <Studio active={heroOn} spinning={spinning} pulled={pulled} booted={booted}
                            target={target} entering={entering} jackpot={!!landed} lit={lit} onPull={pull}
                            onCreated={() => bump(65)} onFrame={() => bump(100)} onBooted={() => setBooted(true)} />
                    </Suspense>
                )}

                <header className="bar">
                    <MultiverseName scramble={spinning} />
                    <p className="mono center">PX‑01 — Reality selector</p>
                    <p className="mono right"><Clock /></p>
                </header>

                <div className="ink" aria-hidden>
                    <span className="tag mono">[2026]</span>
                    <svg className="sig-mark doodle" viewBox="0 -4 200 130" aria-hidden>
                        {SIG.map((d, i) => <path key={i} d={d} pathLength="1" style={{ "--i": i * 0.6 }} />)}
                        {sig.dots.map(([x, y], i) => <circle key={i} cx={(x + 1) * 100} cy={(0.55 - y) * 100} r="3" />)}
                    </svg>
                    <Doodle d={LOOP} className="d-loop" />
                    <p className="note n-role">full-stack dev</p>
                    <Doodle d={ARROW} className="d-arrow" />
                    <p className="note n-craft">+ 3D &amp; AI</p>
                    <Doodle d={STAR} className="d-star" view="0 0 60 60" />
                    <p className="note n-city">Ahmedabad, IN</p>
                    <Doodle d={CROSS} className="d-cross" view="0 0 48 48" />
                    <p className="signature">Aman Patel</p>
                    <Doodle d={SCRIBBLE} className="d-scribble" view="0 0 240 30" />
                </div>

                <nav className="tabs" aria-label="Go straight to a world">
                    {worlds.map((w) => (
                        <button key={w.id} type="button" onClick={() => onSelect(w.id)}><i aria-hidden>↗</i>{w.name}</button>
                    ))}
                    <a href={profile.resume} target="_blank" rel="noreferrer"><i aria-hidden>↗</i>Résumé</a>
                </nav>

                <div className="cta">
                    <p className="mono" aria-live="polite">{status}</p>
                    <button type="button" className="pull" onClick={pull} disabled={spinning || !!landed}>Pull the lever <i aria-hidden>→</i></button>
                    <button type="button" className="skip" onClick={() => onSelect(RECRUITER_WORLD)}>Just show me the work</button>
                </div>
                <p className="mono scroll-hint" aria-hidden>Scroll ↓</p>
                <div className="curtain" aria-hidden />
                {!lit && <Boot target={progress} onDone={() => setLit(true)} />}
            </section>

            <div className="marquee" aria-hidden>
                <div className="marquee-track">
                    {[0, 1].map((k) => <span key={k}>{MARQUEE.map((m) => <span key={m}>{m}<i>✺</i></span>)}</span>)}
                </div>
                <p className="marquee-note">— built by hand in Ahmedabad</p>
            </div>

            <footer ref={footer} className="foot">
                <div className="foot-dots" aria-hidden>
                    <Suspense fallback={null}><DotField active={footerOn} eventSource={footer} /></Suspense>
                </div>
                <div className="foot-head">
                    <h2>Pick a <b>reality</b>,<br />or skip the machine<br />and say hello.</h2>
                    <a className="block-btn" href={`mailto:${profile.email}`}>Email me</a>
                </div>
                <div className="cols">
                    <div>
                        <p className="mono">Realities</p>
                        {worlds.map((w) => <button key={w.id} type="button" onClick={() => onSelect(w.id)}>{w.name}</button>)}
                        <span className="soon">Album Rollout — soon</span>
                    </div>
                    <div>
                        <p className="mono">Selected work</p>
                        {projects.slice(0, 4).map((p) => <a key={p.id} href={p.link} target="_blank" rel="noreferrer">{p.title}</a>)}
                    </div>
                    <div>
                        <p className="mono">Contact</p>
                        <a href={`mailto:${profile.email}`}>Email</a>
                        <a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
                        {socials.filter((s) => ["Github", "LinkedIn"].includes(s.text)).map((s) => <a key={s.id} href={s.link} target="_blank" rel="noreferrer">{s.text === "Github" ? "GitHub" : s.text}</a>)}
                    </div>
                    <div>
                        <p className="mono">Elsewhere</p>
                        {socials.filter((s) => !["Github", "LinkedIn"].includes(s.text)).map((s) => <a key={s.id} href={s.link} target="_blank" rel="noreferrer">{s.text}</a>)}
                        <a href="/lab/machine.html">PX‑01 lab</a>
                        <button type="button" onClick={() => hero.current.scrollIntoView({ behavior: "smooth" })}>Back to the machine</button>
                    </div>
                </div>
                <div className="legal mono">
                    <span>© 2026 Aman Patel. All realities reserved.</span>
                    <span>Built in Ahmedabad · <Clock /></span>
                </div>
            </footer>
            <Cursor />
        </main>
    );
};

export default Home;
