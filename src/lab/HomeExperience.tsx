"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";
import MultiverseName from "./MultiverseName.jsx";
import { audio } from "./audio";
import { findWorld, RECRUITER_WORLD } from "@worlds/registry.js";
import "./lab.css";

gsap.registerPlugin(SplitText);

// The 3D scene is client-only; everything else on this page (gate, title, labels) is server-rendered HTML.
const Machine3D = dynamic(() => import("./Machine3D.jsx"), { ssr: false });

const Clock = () => {
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
    return <>{now ? now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" }) : "--:--:--"} IST</>;
};

// Precise mono counter instead of a spinner (the loader is a brand moment).
const LoadCounter = ({ onDone }: { onDone: () => void }) => {
    const { progress, active } = useProgress();
    const [shown, setShown] = useState(0);
    useEffect(() => {
        const target = active ? Math.min(progress, 99) : 100;
        const id = setInterval(() => setShown((v) => (v >= target ? v : v + 1)), 12);
        return () => clearInterval(id);
    }, [progress, active]);
    useEffect(() => { if (shown >= 100) onDone(); }, [shown, onDone]);
    return (
        <div className="counter" aria-live="polite">
            <span className="counter-num">{String(shown).padStart(3, "0")}</span>
            <span className="counter-bar"><i style={{ transform: `scaleX(${shown / 100})` }} /></span>
        </div>
    );
};

// Intro choreography:
// gate (poster + counter + Enter) → title card reveals over the low wide shot → camera travels the island →
// UI fades in on arrival → pull → reels land → curtain → the chosen world's route.
export default function HomeExperience() {
    const router = useRouter();
    const shot = useSearchParams().get("shot") ?? undefined;   // ?shot=wide holds the opening frame (art direction)
    const review = shot === "wide";
    const [fontReady, setFontReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [entered, setEntered] = useState(review);
    const [arrived, setArrived] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [landing, setLanding] = useState<string | null>(null);
    const [muted, setMuted] = useState(true);
    const title = useRef<HTMLHeadingElement>(null);
    const root = useRef<HTMLDivElement>(null);

    // reel labels are painted onto a canvas: the mono face must be ready before the textures are drawn
    useEffect(() => {
        const mono = new FontFace("Geist Mono", "url(/fonts/GeistMono-500.ttf)", { weight: "600" });
        mono.load().then((f) => document.fonts.add(f)).catch(() => {}).finally(() => setFontReady(true));
    }, []);

    const enter = (withSound: boolean) => {
        if (withSound) { audio.start(); setMuted(false); }
        setEntered(true);
    };

    // title: letters rise out of a mask one by one, ".exe" shimmers, then the card lifts away as the camera moves
    useGSAP(() => {
        if (!entered || !title.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { gsap.set(".titlecard", { autoAlpha: 1 }); return; }
        const split = SplitText.create(title.current.querySelector(".t-word"), { type: "chars", mask: "chars" });
        const tl = gsap.timeline();
        tl.set(".titlecard", { autoAlpha: 1 })
            .from(".titlecard .mono", { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 0)
            .from(split.chars, { yPercent: 110, duration: 1.1, stagger: 0.045, ease: "expo.out" }, 0.2)
            .from(".t-exe", { autoAlpha: 0, x: -14, filter: "blur(10px)", duration: 0.9, ease: "power3.out" }, 0.75)
            .to(".t-exe", { backgroundPosition: "200% 0", duration: 1.4, ease: "power1.inOut" }, 1.1);
        if (!review) tl.to(".titlecard", { autoAlpha: 0, y: -24, filter: "blur(8px)", duration: 1.1, ease: "power2.in" }, 3.4);
        return () => split.revert();
    }, { dependencies: [entered], scope: root });

    // reels landed: hold a beat on the result, drop the curtain, go to the world
    const land = (id: string) => {
        setLanding(id);
        router.prefetch(`/${id}`);
        setTimeout(() => router.push(`/${id}`), 1500);
    };

    const toggleSound = () => {
        if (!audio.enabled && muted) { audio.start(); setMuted(false); return; }
        audio.mute(!muted); setMuted(!muted);
    };

    const landed = landing ? findWorld(landing) : null;

    return (
        <div ref={root} className="stage" data-entered={entered || undefined} data-arrived={arrived || undefined}
            data-landing={landing || undefined} data-shot={shot || undefined}>
            {fontReady && (
                <Machine3D entered={entered} hold={review}
                    onSpin={(on: boolean) => setSpinning(on)} onReady={() => {}} onArrive={() => setArrived(true)} onLand={land} />
            )}

            {/* gate: a still of the opening frame + the load counter; the scene renders behind it */}
            <div className="gate" aria-hidden={entered}>
                <div className="gate-inner">
                    <p className="mono">PX‑01 — Clear Hardware Series</p>
                    <LoadCounter onDone={() => setLoaded(true)} />
                    <div className="gate-actions" data-ready={loaded || undefined}>
                        <button type="button" className="btn-primary" disabled={!loaded} onClick={() => enter(true)}>Enter with sound</button>
                        <button type="button" className="btn-ghost" disabled={!loaded} onClick={() => enter(false)}>Enter quietly</button>
                    </div>
                    <Link className="gate-skip mono" href={`/${RECRUITER_WORLD}`}>Skip to the work →</Link>
                </div>
                <p className="mono gate-foot">Best with headphones · a 7-second intro</p>
            </div>

            <div className="titlecard" aria-hidden={arrived}>
                <p className="mono">Aman Patel presents</p>
                <h1 ref={title}><span className="t-word">PORTFOLIO</span><em className="t-exe">.exe</em></h1>
                <p className="mono">A machine for alternate realities</p>
            </div>

            {/* the opening frame's editorial labels, gone once the camera arrives */}
            <div className="intro-labels" aria-hidden>
                <p className="mono tl">PX‑01 — Clear Hardware Series</p>
                <p className="mono tr">Edition 01 · 2026</p>
                <ol className="chapters mono bl">
                    <li data-on={!arrived || undefined}>01 Arrival</li>
                    <li data-on={(arrived && !spinning && !landing) || undefined}>02 Select</li>
                    <li data-on={spinning || landing || undefined}>03 Enter</li>
                </ol>
                <p className="mono br">Motion respects your settings</p>
            </div>

            <header className="bar top ui-late">
                <MultiverseName scramble={spinning} />
                <p className="mono">Portfolio — Aman Patel</p>
                <p className="mono right">
                    <button type="button" className="sound mono" onClick={toggleSound} aria-pressed={!muted}>Sound {muted ? "off" : "on"}</button>
                    <span> · </span><Clock />
                </p>
            </header>

            <nav className="rail ui-late" aria-label="Worlds">
                <p className="mono rail-title">Index</p>
                <ol>
                    {[["01", "desktop", "Desktop OS"], ["02", "editorial", "Editorial"], ["03", "terminal", "Terminal"]].map(([n, id, w]) => (
                        <li key={n}><Link href={`/${id}`}><span className="mono">{n}</span>{w}</Link></li>
                    ))}
                    <li className="soon"><span className="mono">04</span>Album Rollout <em>soon</em></li>
                </ol>
            </nav>

            <footer className="sheet ui-late">
                <h2 className="model">PX<span>‑</span>01</h2>
                <div className="specs">
                    <div className="spec">
                        <p className="spec-title">Reality Selector</p>
                        <p>A clear-case machine that decides which of my worlds you land in. Three reels: era, medium, mood.</p>
                    </div>
                    <div className="spec">
                        <p className="spec-title">Loaded</p>
                        <p>Desktop OS, Editorial, Terminal. Album Rollout is in production.</p>
                    </div>
                    <dl className="spec-table">
                        <div><dt className="mono">Reels</dt><dd>3</dd></div>
                        <div><dt className="mono">Worlds</dt><dd>3</dd></div>
                        <div><dt className="mono">Plays</dt><dd>000427</dd></div>
                    </dl>
                </div>
                <div className="cta">
                    <span className="mono">{landed ? `Landing in ${landed.name}…` : spinning ? "Selecting…" : "Drag the lever · Space"}</span>
                    <button type="button" className="pull" onClick={() => window.dispatchEvent(new Event("pexe:pull"))}>Pull the lever <i aria-hidden>→</i></button>
                </div>
            </footer>

            <div className="curtain" aria-hidden />
        </div>
    );
}
