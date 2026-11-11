import { useEffect, useRef, useState } from "react";
import { Briefcase, Route, Layers, AtSign, FileDown } from "lucide-react";
import { track } from "../analytics.js";
import { useLiquid } from "../liquid.js";

const BAR = { edge: 20, amount: 22, extra: "blur(3px) saturate(1.7) brightness(1.05)" }, PUCK = { edge: 18, amount: 30, fringe: 0.22, extra: "saturate(2)" }, ACT = { edge: 22, amount: 28 };

// Phones: Mindcore's liquid tab bar, ported. A glass capsule of four sections with a puck that follows the page
// (scroll spy); press and the puck swells into a lens, drag it across the tabs and it stretches with speed, let go
// and it springs onto the nearest tab. Beside it, the round glass action: the résumé.
const TABS = [["Work", Briefcase, ".work"], ["Career", Route, ".xp"], ["Skills", Layers, ".skills-sec"], ["Contact", AtSign, ".land"]].map(([label, Icon, sel]) => ({ label, Icon, sel }));
const lockFor = (ref, ms) => { ref.current = Date.now() + ms; };
const locked = (ref) => Date.now() < ref.current;
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function LiquidDock({ on, resume }) {
    const [at, setAt] = useState(0);
    const bar = useRef(null), puck = useRef(null), act = useRef(null), drag = useRef(null), lock = useRef(0);
    useLiquid(bar, BAR); useLiquid(puck, PUCK); useLiquid(act, ACT);

    useEffect(() => {
        const spy = () => {
            if (drag.current || locked(lock)) return;
            const line = innerHeight * 0.45;
            let i = 0;
            TABS.forEach(({ sel }, k) => { const el = document.querySelector(sel); if (el && el.getBoundingClientRect().top < line) i = k; });
            setAt(i);
        };
        // one read per frame, and a tab jump's lock ends when the smooth scroll actually ends (scrollend), not on a timer
        let raf = 0;
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; spy(); }); };
        const onEnd = () => { lock.current = 0; spy(); };
        spy();
        addEventListener("scroll", onScroll, { passive: true });
        addEventListener("scrollend", onEnd);
        return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("scrollend", onEnd); };
    }, []);

    const go = (i) => {
        setAt(i);
        lockFor(lock, 3000);                   // smooth scroll passes other sections; released on scrollend (fallback cap 3 s)
        document.querySelector(TABS[i].sel)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        track("dock_tab", { tab: TABS[i].label });
    };

    const geo = () => { const r = bar.current.getBoundingClientRect(); return { left: r.left + 4, w: (r.width - 8) / TABS.length }; };
    const down = (e) => {
        const { left, w } = geo();
        drag.current = { left, w, x0: e.clientX, last: e.clientX, moved: false };
        bar.current.setPointerCapture(e.pointerId);
        bar.current.dataset.press = "";
        move(e);
    };
    const move = (e) => {
        const d = drag.current;
        if (!d) return;
        if (Math.abs(e.clientX - d.x0) > 6) d.moved = true;
        const x = clamp(e.clientX - d.left - d.w / 2, 0, d.w * (TABS.length - 1));
        // speed → stretch, low-passed so it flows instead of jittering per event (Mindcore: scaleX /= 1 - v*.75)
        d.v = (d.v || 0) * 0.7 + clamp(Math.abs(e.clientX - d.last) / 30, 0, 0.2) * 0.3;
        d.last = e.clientX; d.x = x;
        const v = d.v;
        puck.current.style.transform = `translateX(${x}px) scale(${1.28 + v}, ${1.28 - v * 0.6})`;
        // when the finger rests, the liquid relaxes back to round
        clearTimeout(d.rest);
        d.rest = setTimeout(() => { if (drag.current === d) { d.v = 0; puck.current.style.transform = `translateX(${d.x}px) scale(1.28)`; } }, 90);
        const r = bar.current.getBoundingClientRect();
        bar.current.style.setProperty("--gx", `${e.clientX - r.left}px`);
        bar.current.style.setProperty("--gy", "50%");
    };
    const up = (e) => {
        const d = drag.current;
        if (!d) return;
        drag.current = null;
        delete bar.current.dataset.press;
        puck.current.style.transform = "";
        go(d.moved ? Math.round(d.x / d.w) : clamp(Math.floor((e.clientX - d.left) / d.w), 0, TABS.length - 1));
    };

    return (
        <nav className="ld" data-on={on || undefined} aria-label="Sections">
            <div ref={bar} className="ld-tabs lg" style={{ "--i": at }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
                <span ref={puck} className="ld-puck" aria-hidden />
                {TABS.map((t, i) => (
                    <button key={t.label} type="button" className="ld-tab" aria-current={at === i || undefined}
                        onClick={(e) => e.detail === 0 && go(i)}>   {/* keyboard only: pointer taps resolve in `up` */}
                        <t.Icon size={21} strokeWidth={1.75} aria-hidden /><span>{t.label}</span>
                    </button>
                ))}
            </div>
            <a ref={act} className="ld-act lg" href={resume} target="_blank" rel="noreferrer" aria-label="Résumé (PDF)"
                onClick={() => track("resume_opened", { from: "dock" })}>
                <FileDown size={24} strokeWidth={1.75} aria-hidden /><span>CV</span>
            </a>
        </nav>
    );
}
