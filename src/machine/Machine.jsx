import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { worlds, RECRUITER_WORLD } from "#worlds/registry.js";
import { getSeen, setSeen } from "#shell/storage.js";
import WorldPicker from "#shell/WorldPicker.jsx";

const LOOPS = 14;      // how many times each strip repeats, i.e. how far a reel travels
const REELS = [0, 1, 2];

const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// No repeats until every world has been seen this session, then start over.
const pickWorld = () => {
    const seen = getSeen();
    let pool = worlds.filter((w) => !seen.includes(w.id));
    if (pool.length === 0) pool = worlds;
    const world = pool[Math.floor(Math.random() * pool.length)];
    setSeen(pool === worlds ? [world.id] : [...seen, world.id]);
    return world;
};

const Machine = ({ onSelect }) => {
    const root = useRef(null);
    const strips = useRef([]);
    const lever = useRef(null);
    const [spinning, setSpinning] = useState(false);
    const [landed, setLanded] = useState(null);
    const [picking, setPicking] = useState(false);

    // Power-on: cabinet rises, bulbs start chasing.
    useGSAP(() => {
        if (prefersReducedMotion()) return;
        gsap.from(".machine-cabinet", { y: 40, opacity: 0, duration: 0.7, ease: "power3.out" });
        gsap.from(".machine-actions > *", { y: 12, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.35 });
    }, { scope: root });

    const spin = () => {
        if (spinning) return;
        const world = pickWorld();
        const target = worlds.indexOf(world);
        setSpinning(true);
        setLanded(null);

        const land = () => {
            setLanded(world);
            setTimeout(() => onSelect(world.id), prefersReducedMotion() ? 300 : 900);
        };

        if (prefersReducedMotion()) {
            strips.current.forEach((el) => gsap.set(el, { yPercent: (-100 * target) / (worlds.length * LOOPS) }));
            land();
            return;
        }

        gsap.timeline()
            .to(lever.current, { rotate: 38, duration: 0.18, ease: "power2.in", transformOrigin: "50% 100%" })
            .to(lever.current, { rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });

        const tl = gsap.timeline({ onComplete: land });
        strips.current.forEach((el, i) => {
            const stop = (worlds.length * (LOOPS - 1) + target) / (worlds.length * LOOPS);
            tl.fromTo(el,
                { yPercent: 0 },
                { yPercent: -100 * stop, duration: 1.6 + i * 0.55, ease: "power4.out" },
                0.15);
        });
    };

    // Space / Enter pulls the lever (unless the picker is open).
    useEffect(() => {
        const onKey = (e) => {
            if (picking || (e.key !== " " && e.key !== "Enter")) return;
            if (e.target.closest?.("button, a, input, textarea")) return;
            e.preventDefault();
            spin();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    return (
        <div ref={root} className="min-h-dvh w-full flex flex-col items-center justify-center gap-8 px-4 py-10 bg-[radial-gradient(ellipse_at_top,#1e1b4b_0%,#0a0a0a_60%)] text-white font-georama select-none">
            <header className="text-center">
                <p className="text-xs tracking-[0.4em] uppercase text-neutral-400">Aman Patel presents</p>
                <h1 className="mt-2 text-5xl sm:text-7xl font-black italic tracking-tight bg-gradient-to-b from-white via-neutral-400 to-neutral-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                    PORTFOLIO.exe
                </h1>
                <p className="mt-2 text-sm text-neutral-400">A machine for alternate realities. Pull the lever.</p>
            </header>

            <div className="machine-cabinet relative flex items-center gap-3 sm:gap-5">
                <div className="relative rounded-[28px] p-3 sm:p-5 bg-gradient-to-b from-neutral-700 via-neutral-900 to-black border border-white/15 shadow-[0_30px_80px_-20px_rgba(99,102,241,0.45)]">
                    {/* chasing bulbs */}
                    <div aria-hidden className="absolute inset-x-6 -top-2 flex justify-between">
                        {Array.from({ length: 9 }, (_, i) => (
                            <span key={i} className="size-2 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
                        ))}
                    </div>

                    <div className="flex gap-2 sm:gap-3" role="group" aria-label="Reels">
                        {REELS.map((r) => (
                            <div key={r} className="relative h-24 sm:h-28 w-24 sm:w-36 overflow-hidden rounded-xl bg-neutral-100 text-neutral-900 shadow-inner">
                                <div ref={(el) => (strips.current[r] = el)}>
                                    {Array.from({ length: LOOPS }, (_, loop) =>
                                        worlds.map((w) => (
                                            <div key={`${loop}-${w.id}`} className="h-24 sm:h-28 flex items-center justify-center text-base sm:text-xl font-bold uppercase tracking-wide">
                                                {w.symbols[r]}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/35" />
                            </div>
                        ))}
                    </div>

                    <p aria-live="polite" className="mt-3 h-6 text-center text-sm">
                        {landed ? <>Landing in <strong style={{ color: landed.accent }}>{landed.name}</strong>…</> : spinning ? "Spinning…" : " "}
                    </p>
                </div>

                {/* lever */}
                <button
                    type="button"
                    onClick={spin}
                    disabled={spinning}
                    aria-label="Pull the lever to spin"
                    className="group flex flex-col items-center disabled:cursor-wait cursor-grab"
                >
                    <span ref={lever} className="flex flex-col items-center">
                        <span className="size-7 sm:size-9 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform" />
                        <span className="w-1.5 sm:w-2 h-16 sm:h-24 bg-gradient-to-r from-neutral-300 to-neutral-500 rounded-full" />
                    </span>
                    <span className="w-6 sm:w-8 h-3 rounded bg-neutral-700" />
                </button>
            </div>

            <div className="machine-actions flex flex-wrap justify-center gap-3">
                <button type="button" onClick={spin} disabled={spinning}
                    className="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-50">
                    Spin
                </button>
                <button type="button" onClick={() => setPicking(true)}
                    className="px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/10">
                    Pick a world
                </button>
                <button type="button" onClick={() => onSelect(RECRUITER_WORLD)}
                    className="px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/10">
                    Just show me the work
                </button>
            </div>

            {picking && <WorldPicker onSelect={onSelect} onClose={() => setPicking(false)} />}
        </div>
    );
};

export default Machine;
