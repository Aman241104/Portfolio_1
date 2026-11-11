import { useEffect, useRef, useState } from "react";

// One split-flap character: when its target changes it riffles through the drum (a few random flaps, each a real
// top-half fold), then lands. `delay` staggers a row left to right, like a Solari board updating.
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·.-:/";
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const Cell = ({ ch, delay }) => {
    const [shown, setShown] = useState(reduced ? ch : " ");
    const [tick, setTick] = useState(0);
    const timer = useRef();
    useEffect(() => {
        if (reduced) { setShown(ch); return; }
        let n = 0; const flips = 3 + Math.floor(Math.random() * 5);
        const start = setTimeout(function flip() {
            n++;
            setShown(n >= flips ? ch : DRUM[Math.floor(Math.random() * DRUM.length)]);
            setTick((t) => t + 1);
            if (n < flips) timer.current = setTimeout(flip, 55);
        }, delay);
        return () => { clearTimeout(start); clearTimeout(timer.current); };
    }, [ch, delay]);
    return <span className="fl-c" key={tick} data-flip={tick > 0 || undefined}>{shown}</span>;
};

// A fixed-width field of cells. Text is upper-cased and padded/truncated to `len`, like the real hardware.
export default function Flap({ text, len, start = 0, className = "" }) {
    const t = String(text ?? "").toUpperCase().slice(0, len).padEnd(len, " ");
    return <span className={`fl ${className}`} aria-label={String(text ?? "")}>{[...t].map((c, i) => <Cell key={i} ch={c} delay={start + i * 28} />)}</span>;
}
