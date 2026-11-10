import { useEffect, useRef, useState } from "react";
import { work, KINDS } from "#content/work.js";
import { profile, socials } from "#content/profile.js";
import { sfx } from "#machine/sfx.js";
import { track } from "../analytics.js";

// Everything I've built and shipped, made for a recruiter's first 30 seconds: résumé and contact up top, filters by
// kind, real screenshots (Cloudinary) in a browser frame. The shot scrolls through the page on hover; on touch the card
// crossing the middle of the screen does it instead. Opening a live site plays a short "leaving PX-01" transition
// (cmd/ctrl/middle-click still opens a normal new tab).
const shot = (item, w) => `https://res.cloudinary.com/dhrcarq8g/image/upload/f_auto,q_auto,w_${w}/${item.img || `portfolio/work/${item.slug}`}`;
const host = (u) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");
const FIRST = 9;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = () => matchMedia("(pointer: coarse)").matches;
const linkedin = socials.find((s) => s.text === "LinkedIn")?.link;

const Leaving = ({ item, rect }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => { const r = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); return () => cancelAnimationFrame(r); }, []);
    const box = open ? { left: 0, top: 0, width: "100vw", height: "100vh" } : { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    return (
        <div className="leaving" data-open={open || undefined} role="status" aria-live="assertive">
            <img src={shot(item, 720)} alt="" style={box} />
            <div className="leaving-card">
                <p className="mono">Leaving PX-01 · opening</p>
                <p className="leaving-host">{host(item.url)}</p>
                <div className="leaving-bar"><i /></div>
                <p className="mono">Back button brings you right back here</p>
            </div>
        </div>
    );
};

export default function Work() {
    const [kind, setKind] = useState("all");
    const [all, setAll] = useState(false);
    const [active, setActive] = useState(null);
    const [leaving, setLeaving] = useState(null);
    const list = useRef(null);

    const shown = work.filter((w) => kind === "all" || w.kind === kind);
    const visible = all ? shown : shown.slice(0, FIRST);

    // back from the project (bfcache) → drop the transition overlay
    useEffect(() => {
        const back = (e) => { if (e.persisted) setLeaving(null); };
        window.addEventListener("pageshow", back);
        return () => window.removeEventListener("pageshow", back);
    }, []);
    // touch: the card in the middle of the screen is "hovered"
    useEffect(() => {
        if (!touch()) return;
        const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.dataset.slug)), { rootMargin: "-40% 0px -40% 0px" });
        list.current.querySelectorAll(".card").forEach((c) => io.observe(c));
        return () => io.disconnect();
    }, [kind, all]);

    const open = (e, item) => {
        track("project_opened", { project: item.slug, kind: item.kind });
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1 || reduced()) return;   // native behaviour
        e.preventDefault();
        const img = e.currentTarget.querySelector("img");
        setLeaving({ item, rect: img.getBoundingClientRect() });
        sfx.detent();
        setTimeout(() => window.location.assign(item.url), 1050);
    };

    return (
        <section className="work" aria-labelledby="work-h">
            <div className="hire">
                <div>
                    <p className="mono">For recruiters</p>
                    <p className="hire-line">Full-stack engineer in Ahmedabad, open to on-site or hybrid roles. Résumé, contact and {work.length} projects, all on this page.</p>
                </div>
                <div className="hire-actions">
                    <a className="block-btn" href={profile.resume} target="_blank" rel="noreferrer" onClick={() => track("resume_opened", { from: "work" })}>Résumé (PDF) ↓</a>
                    <a href={`mailto:${profile.email}`}>Email</a>
                    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                    <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                </div>
            </div>

            <div className="work-head">
                <h2 id="work-h">Work <span className="mono">({String(work.length).padStart(2, "0")})</span></h2>
                <div className="filters" role="tablist" aria-label="Filter projects">
                    {Object.entries({ all: "All", ...KINDS }).map(([k, label]) => {
                        const n = k === "all" ? work.length : work.filter((w) => w.kind === k).length;
                        return (
                            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setAll(false); }}>
                                {label} <span className="mono">{n}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <ul ref={list} className="cards">
                {visible.map((w) => (
                    <li key={w.slug} className="card" data-slug={w.slug} data-active={active === w.slug || undefined}>
                        <a href={w.url} onClick={(e) => open(e, w)} aria-label={`${w.title}, open the live site`}>
                            <div className="card-shot">
                                <div className="chrome" aria-hidden><i /><i /><i /><span>{host(w.url)}</span></div>
                                <div className="card-img"><img src={shot(w, 720)} alt="" loading="lazy" /></div>
                            </div>
                            <div className="card-meta">
                                <p className="mono">{KINDS[w.kind]}{w.client ? ` · ${w.client}` : ""} · {w.year}</p>
                                <h3>{w.title} <i aria-hidden>↗</i></h3>
                                <p className="card-line">{w.line}</p>
                                {w.stack && <p className="mono card-stack">{w.stack}</p>}
                            </div>
                        </a>
                        {w.repo && <a className="card-code mono" href={w.repo} target="_blank" rel="noreferrer">Code ↗</a>}
                    </li>
                ))}
            </ul>
            {shown.length > FIRST && (
                <button type="button" className="more" onClick={() => setAll((v) => !v)}>
                    {all ? "Show fewer" : `Show all ${shown.length} ${kind === "all" ? "projects" : KINDS[kind].toLowerCase()}`}
                </button>
            )}
            {leaving && <Leaving {...leaving} />}
        </section>
    );
}
