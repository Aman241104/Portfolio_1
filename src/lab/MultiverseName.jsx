import { useEffect, useRef, useState } from "react";

// "Aman" across universes. Swaps step at 12 fps (Spider-Verse "on twos"), each swap = 3 glitch frames.
const NAMES = [
    { text: "AMAN", font: "'Geist', sans-serif", weight: 800, label: "EN" },
    { text: "अमन", font: "'Rozha One', serif", weight: 400, label: "HI" },
    { text: "અમન", font: "'Baloo Bhai 2', sans-serif", weight: 800, label: "GU" },
    { text: "アマン", font: "'Dela Gothic One', sans-serif", weight: 400, label: "JA" },
    { text: "ਅਮਨ", font: "'Baloo Paaji 2', sans-serif", weight: 800, label: "PA" },
    { text: "아만", font: "'Black Han Sans', sans-serif", weight: 400, label: "KO" },
    { text: "আমন", font: "'Baloo Da 2', sans-serif", weight: 800, label: "BN" },
    { text: "أمان", font: "'Lalezar', sans-serif", weight: 400, label: "AR" },
    { text: "அமன்", font: "'Baloo Thambi 2', sans-serif", weight: 800, label: "TA" },
    { text: "АМАН", font: "'Russo One', sans-serif", weight: 400, label: "RU" },
    { text: "అమన్", font: "'Baloo Tammudu 2', sans-serif", weight: 800, label: "TE" },
];

const FRAME = 1000 / 12;

const MultiverseName = ({ scramble = false, hold = 1100 }) => {
    const [i, setI] = useState(0);
    const [glitch, setGlitch] = useState(false);
    const timer = useRef();

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let frames = 0;
        const step = () => {
            if (frames < 3) {                                   // 3 glitch frames on random universes
                setGlitch(true);
                setI(Math.floor(Math.random() * NAMES.length));
                frames++;
                timer.current = setTimeout(step, FRAME);
            } else {                                            // hard cut to the next universe, then hold
                setGlitch(false);
                setI((n) => (n + 1) % NAMES.length);
                frames = 0;
                timer.current = setTimeout(step, scramble ? FRAME * 2 : hold);
            }
        };
        timer.current = setTimeout(step, hold);
        return () => clearTimeout(timer.current);
    }, [scramble, hold]);

    const n = NAMES[i];
    return (
        <span className="mv" aria-label="Aman Patel" data-glitch={glitch || undefined}>
            <span aria-hidden className="mv-text" data-text={n.text} style={{ fontFamily: n.font, fontWeight: n.weight }}>{n.text}</span>
            <span aria-hidden className="mv-tag">{n.label}</span>
        </span>
    );
};

export default MultiverseName;
