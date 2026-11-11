import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile, socials } from "#content/profile.js";
import { onRepeat, watching } from "#content/taste.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import "./editorial.css";

// World 2: THE INDEX. A one-ink broadsheet (paper, ink, International Klein Blue). Front page first, then a Swiss
// project index with a cursor-following duotone preview. The recruiter view: everything one scroll away.
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const bySlug = (s) => work.find((w) => w.slug === s);
const LEAD = bySlug("job-search-os"), SECOND = [bySlug("whatsapp-ai"), bySlug("mindcore")];
const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const Duo = ({ w, size = 900, className = "" }) => (
    <span className={`ed-duo ${className}`}><img src={shot(w, size)} alt="" loading="lazy" /></span>
);
const href = (w) => (cases[w.slug] ? `/case.html?p=${w.slug}&skin=ed` : w.url);
const TITLE = "The Index";
const words = (t) => t.split(" ").map((x, i) => <Fragment key={i}>{i > 0 && " "}<span className="ed-w"><span>{x}</span></span></Fragment>);

export default function EditorialWorld() {
    const root = useRef(null);
    const preview = useRef(null);
    const [kind, setKind] = useState("all");
    const [peek, setPeek] = useState(null);
    const rows = work.filter((w) => kind === "all" || w.kind === kind);
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = typeof window !== "undefined" && matchMedia("(pointer: fine)").matches;

    useGSAP(() => {
        if (reduced) return;
        // one press run, ~1.3 s: the masthead sets letter by letter straight up out of the rule (type doesn't tilt),
        // the dateline and front page follow, then the lead headline word by word
        gsap.timeline({ defaults: { ease: "expo.out" } })
            .from(".ed-ch", { yPercent: 110, duration: 0.8, stagger: 0.035 }, 0.05)
            .from(".ed-mast > :not(h1)", { y: 16, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.3)
            .from(".ed-front > *", { y: 28, opacity: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" }, 0.35)
            .from(".ed-lead h2 .ed-w > span", { yPercent: 110, duration: 0.7, stagger: 0.03 }, 0.5);
        // print run: each section's rule draws across, then its content rises in, once. IntersectionObserver (not
        // ScrollTrigger positions) so late-loading fonts/images can never leave anything stuck invisible.
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            gsap.fromTo(e.target, { "--rule": 0 }, { "--rule": 1, duration: 1.1, ease: "power3.inOut" });
            gsap.to(e.target.querySelectorAll(".ed-in"), { y: 0, opacity: 1, duration: 0.7, stagger: 0.035, ease: "power3.out" });
        }), { rootMargin: "0px 0px -15% 0px" });
        gsap.utils.toArray(".ed-sec").forEach((sec) => {
            const items = sec.querySelectorAll("h2, .ed-tabs, .ed-xp, .ed-live li, .ed-tools > div, .ed-pull, .ed-email, .ed-table li:not(.ed-th)");
            items.forEach((el) => el.classList.add("ed-in"));
            gsap.set(items, { y: 22, opacity: 0 });
            io.observe(sec);
        });
        return () => io.disconnect();
    }, { scope: root });

    // one preview image follows the cursor over the index (fine pointers only, never under reduced motion)
    useEffect(() => {
        if (!fine || reduced || !preview.current) return;
        const x = gsap.quickTo(preview.current, "x", { duration: 0.45, ease: "power3" });
        const y = gsap.quickTo(preview.current, "y", { duration: 0.45, ease: "power3" });
        const move = (e) => { x(e.clientX + 24); y(e.clientY - 120); };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
    }, [fine, reduced]);

    return (
        <div ref={root} className="ed">
            <header className="ed-mast">
                <p className="ed-meta"><span>Ahmedabad</span><span>{today}</span><span>Vol. 2026 · {work.length} projects · {work.filter((w) => w.maintained).length} in production</span></p>
                <h1 aria-label={TITLE}>{[...TITLE].map((c, i) => <span key={i} className="ed-ch" aria-hidden>{c === " " ? "\u00a0" : c}</span>)}</h1>
                <p className="ed-deck"><em>The collected work of</em> {profile.name}, full-stack engineer. AI products, Android apps, live client sites.</p>
                <nav className="ed-ear">
                    <a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
                    <a href="/resume.html?for=fullstack">Full-stack</a><a href="/resume.html?for=frontend">Frontend</a><a href="/resume.html?for=ai">AI products</a>
                    <a href={`mailto:${profile.email}`} className="ed-ink">{profile.email}</a>
                </nav>
            </header>

            <section className="ed-front" aria-label="Front page">
                <a className="ed-lead" href={href(LEAD)}>
                    <Duo w={LEAD} size={1400} />
                    <p className="ed-kicker">Lead story · Product · {LEAD.year}</p>
                    <h2>{words(`${LEAD.title}: an AI job search, built for one, then for many.`)}</h2>
                    <p className="ed-standfirst">{LEAD.line}</p>
                    <p className="ed-more">Read the case study →</p>
                </a>
                <div className="ed-side">
                    {SECOND.map((w) => (
                        <a key={w.slug} className="ed-second" href={href(w)} target={cases[w.slug] ? undefined : "_blank"} rel="noreferrer">
                            <Duo w={w} size={800} />
                            <p className="ed-kicker">{KINDS[w.kind].replace(/s$/, "")} · {w.year}</p>
                            <h3>{w.title}</h3>
                            <p>{w.line}</p>
                            <p className="ed-more">{cases[w.slug] ? "Read the case study →" : `${host(w.url)} ↗`}</p>
                        </a>
                    ))}
                </div>
            </section>

            <section className="ed-sec" aria-labelledby="ed-index">
                <div className="ed-sec-head">
                    <h2 id="ed-index">Index of work</h2>
                    <div className="ed-tabs" role="tablist" aria-label="Filter by kind">
                        {Object.entries({ all: "All", ...KINDS }).map(([k, l]) => (
                            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>
                                {l} <span>{k === "all" ? work.length : work.filter((w) => w.kind === k).length}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <ol className="ed-table" onPointerLeave={() => setPeek(null)}>
                    <li className="ed-th" aria-hidden><span>№</span><span>Title</span><span>Kind</span><span>Year</span><span>Status</span><span /></li>
                    {rows.map((w) => (
                        <li key={w.slug}>
                            <a href={href(w) || "#"} target={cases[w.slug] || !w.url ? undefined : "_blank"} rel="noreferrer" onPointerEnter={() => setPeek(w)} onFocus={() => setPeek(w)}>
                                <span className="ed-no">{String(work.indexOf(w) + 1).padStart(2, "0")}</span>
                                <span className="ed-title">{w.title}<small>{w.line}</small></span>
                                <span>{KINDS[w.kind].replace(/s$/, "")}</span>
                                <span>{w.year}</span>
                                <span>{cases[w.slug] ? <b className="ed-ink">Case study</b> : w.live ? <b className="ed-ink">● {host(w.url)}</b> : w.url ? "Online" : "Private"}</span>
                                <span aria-hidden>↗</span>
                            </a>
                        </li>
                    ))}
                </ol>
                {fine && !reduced && (
                    <div ref={preview} className="ed-peek" data-on={peek ? "" : undefined} aria-hidden>
                        {peek && <Duo w={peek} size={720} className="ed-peek-img" />}
                    </div>
                )}
            </section>

            <section className="ed-sec ed-cols" aria-labelledby="ed-xp">
                <div>
                    <h2 id="ed-xp">Experience</h2>
                    {experience.map((x) => (
                        <article key={x.role} className="ed-xp">
                            <p className="ed-kicker">{x.when} · {x.where}</p>
                            <h3>{x.role}, <em>{x.org}</em></h3>
                            <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
                        </article>
                    ))}
                </div>
                <div>
                    <h2>In production</h2>
                    <ul className="ed-live">
                        {work.filter((w) => w.maintained).map((w) => (
                            <li key={w.slug}><a href={w.url} target="_blank" rel="noreferrer"><span>{w.title}</span><span className="ed-mono">{host(w.url)}</span></a></li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="ed-sec" aria-labelledby="ed-tools">
                <h2 id="ed-tools">Toolkit</h2>
                <dl className="ed-tools">
                    {skillGroups.map((g) => <div key={g.group}><dt>{g.group}</dt><dd>{g.items.map(([n]) => n).join(", ")}</dd></div>)}
                </dl>
            </section>

            <section className="ed-sec ed-colophon" aria-labelledby="ed-contact">
                <p className="ed-pull"><em>“Off the clock: {onRepeat.slice(0, 3).map((t) => t.artist).join(", ")} on repeat, {watching.sitcoms[0]} on rewatch, and a lot of bikes.”</em></p>
                <h2 id="ed-contact">Letters to the editor</h2>
                <a className="ed-email" href={`mailto:${profile.email}`}>{profile.email}</a>
                <ul className="ed-social">{socials.map((s) => <li key={s.id}><a href={s.link} target="_blank" rel="noreferrer">{s.text} ↗</a></li>)}</ul>
                <p className="ed-meta"><span>Set in Schibsted Grotesk & Newsreader</span><span>Printed in Ahmedabad</span><span>© {new Date().getFullYear()} {profile.name}</span></p>
            </section>
        </div>
    );
}
