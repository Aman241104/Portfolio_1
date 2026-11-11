import { useEffect, useRef } from "react";
import { work } from "../../content/work.js";
import { skillGroups } from "../../content/skills.js";

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
const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (v, to) => (Number.isInteger(to) ? Math.round(v) : v.toFixed(2));

export function Tape({ items, tilt = -1.6 }) {
    const row = items.map((t) => <span key={t}>{t}<i aria-hidden>✶</i></span>);
    return (
        <div className="tape" style={{ "--tilt": `${tilt}deg` }} aria-label={items.join(", ")}>
            <div className="tape-track" aria-hidden>{row}{row}</div>
        </div>
    );
}

export default function Stats() {
    const root = useRef(null);
    useEffect(() => {
        const nums = [...root.current.querySelectorAll("[data-to]")];
        if (reduced) return;
        nums.forEach((n) => { n.textContent = "0"; });
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            const t0 = performance.now();
            const tick = (t) => {
                const k = Math.min(1, (t - t0) / 1400), ease = 1 - Math.pow(1 - k, 4);
                nums.forEach((n, i) => { const to = +n.dataset.to; n.textContent = fmt(to * Math.min(1, ease * (1 + i * 0.04)), to); });
                if (k < 1) requestAnimationFrame(tick);
                else nums.forEach((n) => { n.textContent = fmt(+n.dataset.to, +n.dataset.to); });
            };
            requestAnimationFrame(tick);
        }, { threshold: 0.4 });
        io.observe(root.current);
        return () => io.disconnect();
    }, []);
    return (
        <section ref={root} className="stats" aria-label="In numbers">
            <Tape items={["Open to work", "Full-stack engineer", "React · Node · Python", "Ahmedabad, India", "On-site or hybrid", "Available now"]} />
            <dl className="stats-row">
                {STATS.map(([n, suf, label]) => (
                    <div key={label} className="stat">
                        <dt className="mono">{label}</dt>
                        <dd><b data-to={n}>{n}</b>{suf && <sup>{suf}</sup>}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
