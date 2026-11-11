import { memo, useEffect, useRef } from "react";
import { ease } from "../../motion.js";

// One split-flap character. When its target changes it riffles through the drum, then lands with a small settle.
// The landing flip is a real leaf: the old character's top half folds down over the new one (WAAPI, transform only).
// No React state per flip: React renders a cell once per target change; the riffle is plain DOM + compositor.
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·.-:/";
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FOLD = [{ transform: "perspective(220px) rotateX(0deg)", visibility: "visible" }, { transform: "perspective(220px) rotateX(-90deg)", visibility: "visible" }];
const SETTLE = [{ transform: "translateY(0)" }, { transform: "translateY(.04em)" }, { transform: "translateY(0)" }];

// One frame loop drives every cell on the board: all DOM writes for a frame land together (one style pass),
// instead of ~440 independent timers each forcing its own.
const jobs = new Set();
let raf = 0;
const loop = (now) => {
    // the world's fonts are still loading (fonts.js): hold the board, shifting every job, so it riffles in the real face
    if ("fontsWait" in document.documentElement.dataset) { for (const j of jobs) j.at += 16.7; raf = requestAnimationFrame(loop); return; }
    for (const j of jobs) if (now >= j.at) j.step(now);
    raf = jobs.size ? requestAnimationFrame(loop) : 0;
};
const schedule = (j) => { jobs.add(j); if (!raf) raf = requestAnimationFrame(loop); };

const Cell = memo(({ ch, delay }) => {
    const face = useRef(), leaf = useRef(), box = useRef();
    useEffect(() => {
        const f = face.current, l = leaf.current;
        if (reduced) { f.textContent = ch; return; }
        if (f.textContent === ch) return;
        let n = 0;
        const flips = 2 + Math.floor(Math.random() * 3);   // 2–4 riffles: reads as a riffle, half the DOM writes
        const job = { at: performance.now() + delay, step(now) {
            n++;
            const last = n >= flips;
            // The riffle is a blur of character swaps (paint only, contained); only the landing gets a real fold,
            // which keeps the number of live compositor layers small while a whole board updates.
            if (last) { l.firstChild.textContent = f.textContent; l.animate(FOLD, { duration: 140, easing: ease.snap }); }
            f.textContent = last ? ch : DRUM[Math.floor(Math.random() * DRUM.length)];
            if (last) { jobs.delete(job); box.current.animate(SETTLE, { duration: 160, delay: 100, easing: ease.spring }); }
            else job.at = now + 70;
        } };
        schedule(job);
        return () => jobs.delete(job);
    }, [ch, delay]);
    return (
        <span className="fl-c" ref={box}>
            <b ref={face}>{reduced ? ch : " "}</b>
            <i ref={leaf} aria-hidden><b> </b></i>
        </span>
    );
});

// A fixed-width field of cells. Text is upper-cased and padded/truncated to `len`, like the real hardware.
export default function Flap({ text, len, start = 0, className = "" }) {
    const t = String(text ?? "").toUpperCase().slice(0, len).padEnd(len, " ");
    return <span className={`fl ${className}`} aria-label={String(text ?? "")}>{[...t].map((c, i) => <Cell key={i} ch={c} delay={start + i * 28} />)}</span>;
}
