import { useEffect, useRef, useState } from "react";
import { drawCover } from "./cover.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { onRepeat, watching } from "#content/taste.js";
import { profile } from "#content/profile.js";
import "./album.css";

// World 4: the portfolio as an album drop. Projects = tracklist, stack = features, case studies = liner notes,
// concepts = deluxe edition, experience = credits. Original type and generated waveforms only: no cover art, no audio.
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const Wave = ({ seed }) => {
    let h = hash(seed);
    const bars = Array.from({ length: 40 }, () => { h = (h * 1103515245 + 12345) >>> 0; return 18 + (h % 82); });
    return <span className="wave" aria-hidden>{bars.map((v, i) => <i key={i} style={{ "--h": `${v}%`, "--d": `${(i % 7) * 60}ms` }} />)}</span>;
};

const SIDES = [
    { id: "a", label: "Side A", note: "Products & apps", kinds: ["product", "mobile"] },
    { id: "b", label: "Side B", note: "Out now: client singles", kinds: ["client"] },
    { id: "deluxe", label: "Deluxe", note: "Concepts, demos & B-sides", kinds: ["concept"] },
];

const Countdown = ({ onDone }) => {
    const [n, setN] = useState(3);
    const btn = useRef(null);
    useEffect(() => { btn.current?.focus(); }, []);
    useEffect(() => {
        if (n === 0) { const t = setTimeout(onDone, 450); return () => clearTimeout(t); }
        const t = setTimeout(() => setN(n - 1), 420);
        return () => clearTimeout(t);
    }, [n, onDone]);
    return (
        <button ref={btn} type="button" className="drop" onClick={onDone} onKeyDown={(e) => e.key === "Escape" && onDone()} aria-label="Skip the intro">
            <span className="drop-k">The album drops in</span>
            <span className="drop-n" key={n}>{n || "OUT NOW"}</span>
            <span className="drop-k">tap or press Esc to skip</span>
        </button>
    );
};

export default function AlbumWorld() {
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the countdown plays once per session (visitors coming back skip straight to the record)
    const [intro, setIntro] = useState(() => { try { return !reduced && !sessionStorage.getItem("px01-album-intro"); } catch { return !reduced; } });
    const endIntro = () => { setIntro(false); try { sessionStorage.setItem("px01-album-intro", "1"); } catch { /* private mode */ } };
    const cover = useRef(null);
    useEffect(() => {
        const draw = () => cover.current && drawCover(cover.current, work.map((w) => w.slug));
        document.fonts?.ready.then(draw); draw();
    }, []);
    let n = 0;
    const job = experience[0], edu = experience[1];

    return (
        <div className="album">
            {intro && <Countdown onDone={endIntro} />}
            <header className="cover">
                <canvas ref={cover} className="cover-art" width="900" height="900" role="img" aria-label="Generated cover art: one ring per project" />
                <div className="cover-copy">
                <p className="mono">Aman Patel · Self-released · Ahmedabad, {new Date().getFullYear()}</p>
                <h1>SHIP<br />IT<span>(Deluxe)</span></h1>
                <p className="cover-sub">{work.length} tracks · {work.filter((w) => w.live).length} out now on their own domains · {skillGroups.reduce((a, g) => a + g.items.length, 0)} instruments</p>
                <div className="cover-cta">
                    <a href="#tracklist" className="btn">Play tracklist ↓</a>
                    <a href={profile.resume} target="_blank" rel="noreferrer" className="btn ghost">Press kit (résumé)</a>
                </div>
                </div>
            </header>

            <main id="tracklist">
                {SIDES.map((side) => {
                    const tracks = work.filter((w) => side.kinds.includes(w.kind));
                    return (
                        <section key={side.id} className={`side side-${side.id}`}>
                            <div className="side-head"><h2>{side.label}</h2><p className="mono">{side.note} · {tracks.length} tracks</p></div>
                            <ol>
                                {tracks.map((w) => {
                                    n += 1;
                                    const notes = cases[w.slug];
                                    return (
                                        <li key={w.slug} className="track">
                                            <span className="tn mono">{String(n).padStart(2, "0")}</span>
                                            <img src={shot(w, 160)} alt="" loading="lazy" />
                                            <div className="tt">
                                                <a href={w.url || "#"} target={w.url ? "_blank" : undefined} rel="noreferrer">
                                                    <b>{w.title}</b>{w.stack && <span className="feat"> (feat. {w.stack.split(" · ").slice(0, 3).join(", ")})</span>}
                                                </a>
                                                <p>{w.line}</p>
                                                <p className="mono meta">
                                                    {KINDS[w.kind]} · {w.year}
                                                    {w.live && <em className="single">● Single · out now at {host(w.url)}</em>}
                                                    {notes && <a className="liner" href={`/case.html?p=${w.slug}`}>Liner notes →</a>}
                                                    {w.note && <em> · {w.note}</em>}
                                                </p>
                                            </div>
                                            <Wave seed={w.slug} />
                                        </li>
                                    );
                                })}
                            </ol>
                        </section>
                    );
                })}
            </main>

            <section className="credits">
                <h2>Credits</h2>
                <dl>
                    <div><dt className="mono">Written, produced & engineered by</dt><dd>Aman Patel</dd></div>
                    <div><dt className="mono">Recorded at</dt><dd>{job.org} · {job.when} · {job.role}</dd></div>
                    <div><dt className="mono">Studied at</dt><dd>{edu.org} · {edu.when} · {edu.where}</dd></div>
                    {skillGroups.slice(0, 6).map((g) => <div key={g.group}><dt className="mono">{g.group}</dt><dd>{g.items.map(([x]) => x).join(", ")}</dd></div>)}
                </dl>
            </section>

            <section className="samples">
                <h2>Samples &amp; influences</h2>
                <p>On repeat while building this: {onRepeat.slice(0, 6).map((t) => `${t.title} (${t.artist})`).join(", ")}.</p>
                <p>Rewatching {watching.sitcoms.slice(0, 3).join(", ")}.</p>
            </section>

            <section className="tour">
                <h2>Tour dates</h2>
                <ul>
                    <li><b>Ahmedabad</b><span className="mono">on-site · available now</span></li>
                    <li><b>Hybrid</b><span className="mono">Gujarat · available now</span></li>
                    <li><b>Remote</b><span className="mono">anywhere · available now</span></li>
                </ul>
                <a className="btn" href={`mailto:${profile.email}`}>Book a show: {profile.email}</a>
            </section>
        </div>
    );
}
