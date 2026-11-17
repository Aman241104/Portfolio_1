import { useEffect, useRef } from "react";
import { work } from "../../content/work.js";
import { skillGroups } from "../../content/skills.js";
import { profile, socials } from "../../content/profile.js";
import { sfx } from "#machine/sfx.js";
import { track } from "../analytics.js";

const linkedin = socials.find((s) => s.text === "LinkedIn")?.link;

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
            : <span key={i} className="odo-sep" aria-hidden style={{ display: "inline-flex", height: "1.05em", alignItems: "center" }}>{c}</span>)}
    </b>
);

const magMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * 0.22));
    const dy = Math.max(-10, Math.min(10, (e.clientY - (r.top + r.height / 2)) * 0.22));
    e.currentTarget.style.setProperty("--mx", `${dx.toFixed(1)}px`);
    e.currentTarget.style.setProperty("--my", `${dy.toFixed(1)}px`);
};
const magLeave = (e) => {
    e.currentTarget.style.setProperty("--mx", "0px");
    e.currentTarget.style.setProperty("--my", "0px");
};

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
        <section className="stats" aria-label="Telemetry and recruiter fast path">
            <Tape items={["Open to work", "Full-stack engineer", "React · Node · Python", "Ahmedabad, India", "On-site or hybrid", "Available now"]} />
            <div className="calib-grid">
                <aside className="calib-rail" aria-label="Recruiter fast path">
                    <p className="mono sec-kicker po-print" data-reveal>Output 01 · Readout &amp; fast path</p>
                    <p className="calib-lead">Full-stack engineer in Ahmedabad, open to on-site or hybrid roles. Résumé, contact and {work.length} shipped builds.</p>
                    <div className="calib-actions">
                        <a className="block-btn magnet" href={profile.resume} target="_blank" rel="noreferrer" onPointerMove={magMove} onPointerLeave={magLeave} onClick={() => track("resume_opened", { from: "telemetry" })}>Résumé (PDF) ↓</a>
                        <div className="calib-links mono">
                            <a href={`mailto:${profile.email}`}>Email</a>
                            {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                        </div>
                    </div>
                    <p className="mono calib-cv">Tailored: {[["fullstack", "Full-stack"], ["frontend", "Frontend"], ["ai", "AI products"]].map(([k, l], i) => (
                        <span key={k}>{i ? " · " : ""}<a href={`/resume.html?for=${k}`} onClick={() => track("resume_opened", { from: "tailored", variant: k })}>{l}</a></span>
                    ))}</p>
                </aside>
                <dl ref={row} className="stats-row" data-reveal>
                    {STATS.map(([n, suf, label], i) => (
                        <div key={label} className="stat" style={{ "--i": i }}>
                            <dt className="mono">{label}</dt>
                            <dd><Odo value={n} />{suf && <sup>{suf}</sup>}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
