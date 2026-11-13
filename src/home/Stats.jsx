import { useEffect, useRef } from "react";
import { work } from "../../content/work.js";
import { skillGroups } from "../../content/skills.js";
import { sfx } from "#machine/sfx.js";

// The numbers strip: every figure comes from content/ (nothing typed in by hand except the two from the CV),
// counting up once when the strip scrolls in. Plus the tape: a moving band between sections.
const STATS = [
    [work.length, "", "Projects shipped"],
    [work.filter((w) => w.kind === "client").length, "", "Client websites"],
    [work.filter((w) => w.maintained).length, "", "Live, maintained by me"],
    [12, "+", "Client apps at Gravity"],
    [skillGroups.reduce((n, g) => n + g.items.length, 0), "", "Tools used in projects"],
    [8.67, "", "CGPA, B.E. at LDCE"],
];
// Odometer: each digit is a strip of 0–9 (twice, so it rolls past once) that slides to its value when the row is
// revealed. The real number is the accessible text; the strips are decoration.
const Odo = ({ value }) => (
    <b aria-label={String(value)}>
        {[...String(value)].map((c, i, all) => /\d/.test(c)
            ? <span key={i} className="odo" aria-hidden style={{ "--d": +c + 10, "--k": all.length - i }}><span>{"01234567890123456789".split("").map((d, j) => <i key={j}>{d}</i>)}</span></span>
            : <span key={i} aria-hidden>{c}</span>)}
    </b>
);

export function Tape({ items, tilt = -1.6 }) {
    const row = items.map((t) => <span key={t}>{t}<i aria-hidden>✶</i></span>);
    return (
        <div className="tape" style={{ "--tilt": `${tilt}deg` }} aria-label={items.join(", ")}>
            <div className="tape-track" aria-hidden>{row}{row}</div>
        </div>
    );
}

export default function Stats() {
    const row = useRef(null);
    useEffect(() => {
        const el = row.current;
        if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            [0, 90, 180].forEach((ms) => setTimeout(() => sfx.tick(), ms));
        }, { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <section className="stats" aria-label="In numbers">
            <Tape items={["Open to work", "Full-stack engineer", "React · Node · Python", "Ahmedabad, India", "On-site or hybrid", "Available now"]} />
            <dl ref={row} className="stats-row" data-reveal>
                {STATS.map(([n, suf, label], i) => (
                    <div key={label} className="stat" style={{ "--i": i }}>
                        <dt className="mono">{label}</dt>
                        <dd><Odo value={n} />{suf && <sup>{suf}</sup>}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
