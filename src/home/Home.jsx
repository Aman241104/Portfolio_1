import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { worlds, RECRUITER_WORLD } from "#worlds/registry.js";
import WorldPicker from "#shell/WorldPicker.jsx";
import { pickWorld } from "#machine/Machine.jsx";
import { profile, projects, socials } from "#content/profile.js";
import MultiverseName from "../lab/MultiverseName.jsx";
import sig from "./signature.json";
import { sfx, setSound, soundOn, onSound } from "#machine/sfx.js";
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

const MARQUEE = ["Pick a reality", "Desktop OS", "Editorial", "Terminal", "Ahmedabad, IN", "Open to work"];

// The machine as an explicit state machine, so a half-finished animation can never strand the UI:
//   idle → armed (lever grabbed) → spinning → locking (reels report as they physically stop) → revealed → transitioning
const LABEL = { idle: "", armed: "Armed — let go past the detent", spinning: "Spinning", locking: "Locking", revealed: "Reality selected", transitioning: "Entering" };
const isTouch = () => matchMedia("(pointer: coarse)").matches;

const Home = ({ onSelect }) => {
    const hero = useRef(null);
    const footer = useRef(null);
    const enterBtn = useRef(null);
    const heroOn = useInView(hero);
    const footerOn = useInView(footer, "200px");
    const [fontsOk, setFontsOk] = useState(false);
    const [booted, setBooted] = useState(false);
    const [phase, setPhase] = useState("idle");
    const [pulled, setPulled] = useState(false);
    const [result, setResult] = useState(null);
    const [target, setTarget] = useState();
    const [plays, setPlays] = useState(427);
    const [shared, setShared] = useState(false);       // true once the count comes from the shared counter (api/pulls.js)
    const [debug, setDebug] = useState(false);
    const [peek, setPeek] = useState({ src: null, on: false });   // hover preview in the work list
    const [copied, setCopied] = useState(false);
    const [pulse, setPulse] = useState(0);                         // copy email → a ripple runs through the dunes
    const work = useRef(null);
    const copyEmail = () => {
        navigator.clipboard.writeText(profile.email)
            .then(() => { setCopied(true); setPulse((n) => n + 1); sfx.coin(0); setTimeout(() => setCopied(false), 1800); })
            .catch(() => { location.href = `mailto:${profile.email}`; });
    };
    const onWorkMove = (e) => {
        const r = work.current.getBoundingClientRect();
        work.current.style.setProperty("--px", `${e.clientX - r.left}px`);
        work.current.style.setProperty("--py", `${e.clientY - r.top}px`);
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
                        <Studio active={heroOn} count={lit ? plays : 0} debug={debug} onDebug={() => setDebug((d) => !d)}
                            ticket={phase === "revealed" && result ? { no: plays, name: result.name, symbols: result.symbols } : null}
                            onTicket={() => result && enter(result.id)} spinning={phase === "spinning"} pulled={pulled} booted={booted}
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
                            <p className="cta-sub">Three reels, one world. Pull the lever to choose how you see my work.</p>
                            <p className="mono status" aria-live="polite">{status}</p>
                            {shared && <p className="mono pulls">{plays.toLocaleString("en-IN")} pulls so far</p>}
                            <button type="button" className="pull" onClick={pull} disabled={busy}>Pull the lever <i aria-hidden>→</i></button>
                            <div className="cta-alt">
                                <button type="button" onClick={() => enter(RECRUITER_WORLD)}>Skip the machine · View my work</button>
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
                <p className="mono scroll-hint" aria-hidden>Scroll ↓</p>
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
                <section ref={work} className="work" aria-labelledby="work-h" onPointerMove={onWorkMove}>
                    <div className="work-head">
                        <h2 id="work-h" className="mono">Selected work <span>({String(projects.length).padStart(2, "0")})</span></h2>
                        <p className="mono">2025 — 2026 · built, shipped, on GitHub</p>
                    </div>
                    <ol className="work-list">
                        {projects.map((p, i) => (
                            <li key={p.id}>
                                <a href={p.link} target="_blank" rel="noreferrer"
                                    onPointerEnter={() => setPeek({ src: p.image, on: true })} onPointerLeave={() => setPeek((v) => ({ ...v, on: false }))}>
                                    <span className="mono w-no">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="w-title">{p.title}</span>
                                    <span className="w-desc">{p.description}</span>
                                    <span className="mono w-date">{p.date}</span>
                                    <i aria-hidden>↗</i>
                                </a>
                            </li>
                        ))}
                    </ol>
                    {peek.src && <img className="peek" src={peek.src} alt="" data-on={peek.on || undefined} aria-hidden />}
                </section>

                <div className="land">
                    <div className="foot-dots" aria-hidden>
                        <Suspense fallback={null}><DotField active={footerOn} eventSource={footer} pulse={pulse} /></Suspense>
                    </div>
                    <div className="foot-head">
                        <h2>Pick a <b>reality</b>,<br />or skip the machine<br />and <b>say hello.</b></h2>
                        <div className="contact">
                            <p className="mono now"><i aria-hidden>●</i> Now: open to full-stack roles · Ahmedabad, on-site</p>
                            <button type="button" className="block-btn copy" onClick={copyEmail} aria-live="polite">
                                {copied ? "Copied to clipboard ✓" : profile.email}<span className="mono">{copied ? "" : "Copy"}</span>
                            </button>
                            <div className="contact-alt">
                                <a href={`mailto:${profile.email}`}>Write an email</a>
                                <a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
                                {socials.filter((s) => s.text === "LinkedIn").map((s) => <a key={s.id} href={s.link} target="_blank" rel="noreferrer">LinkedIn</a>)}
                            </div>
                        </div>
                    </div>
                    <div className="cols">
                        <div>
                            <p className="mono">Realities</p>
                            {worlds.map((w) => <button key={w.id} type="button" onClick={() => onSelect(w.id)}>{w.name}</button>)}
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
                </div>
            </footer>
            <Cursor />
        </main>
    );
};

export default Home;
