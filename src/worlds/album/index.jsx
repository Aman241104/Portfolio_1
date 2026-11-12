import { useEffect, useRef, useState } from "react";
import { drawCover } from "./cover.js";
import { play, stop, BEAT_MS } from "./beat.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { onRepeat, watching } from "#content/taste.js";
import { profile } from "#content/profile.js";
import Deck from "./Deck.jsx";
import "./album.css";

// World 4: the portfolio as an album drop. Projects = tracklist, stack = features, case studies = liner notes,
// concepts = deluxe edition, experience = credits, résumé = merch. Original type, generated cover + beat; the only real
// music is the B-sides player, an official (visible, no-cookie) YouTube embed loaded only when someone taps a song.
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const Wave = ({ seed }) => {
    const bars = Array.from({ length: 40 }).reduce((acc) => {
        const h = ((acc.h * 1103515245 + 12345) >>> 0);
        return { h, v: [...acc.v, 18 + (h % 82)] };
    }, { h: hash(seed), v: [] }).v;
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
    const root = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [open, setOpen] = useState(null);
    const [yt, setYt] = useState(null);
    const toggle = () => { if (playing) { stop(); setPlaying(false); } else { setYt(null); play(); setPlaying(true); } };
    const openTrack = (w) => {
        setOpen(w.slug);
        requestAnimationFrame(() => document.getElementById(`t-${w.slug}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
    };
    const listen = (id) => { stop(); setPlaying(false); setYt(id); };
    useEffect(() => () => stop(), []);
    // era colour follows the side you're reading (lime → pink → blue)
    useEffect(() => {
        const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && root.current?.setAttribute("data-era", e.target.dataset.era)), { rootMargin: "-45% 0px -45% 0px" });
        root.current?.querySelectorAll(".side").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
    useEffect(() => {
        const draw = () => cover.current && drawCover(cover.current, work.map((w) => w.slug));
        document.fonts?.ready.then(draw); draw();
    }, []);
    // track numbers run across the sides: A, then B, then Deluxe
    const numbered = SIDES.flatMap((side) => work.filter((w) => side.kinds.includes(w.kind)));
    const trackNo = (w) => numbered.indexOf(w) + 1;
    const job = experience[0], edu = experience[1];

    return (
        <div ref={root} className="album" data-intro={intro || undefined} data-playing={playing || undefined} style={{ "--beat": `${BEAT_MS}ms` }}>
            {intro && <Countdown onDone={endIntro} />}
            <header className="cover">
                <Deck tracks={numbered} playing={playing} onOpen={openTrack}
                    sleeve={<canvas ref={cover} className="cover-art" width="900" height="900" role="img" aria-label="Generated cover art: one ring per project" />} />
                <div className="cover-copy">
                <p className="mono">Aman Patel · Self-released · Ahmedabad, {new Date().getFullYear()}</p>
                <h1>SHIP<br />IT<span>(Deluxe)</span></h1>
                <p className="cover-sub">{work.length} tracks · {work.filter((w) => w.live).length} out now on their own domains · {skillGroups.reduce((a, g) => a + g.items.length, 0)} instruments</p>
                <div className="cover-cta">
                    <button type="button" className="btn" onClick={toggle} aria-pressed={playing}>{playing ? "❚❚ Pause the record" : "▶ Play the record"}</button>
                    <a href="#tracklist" className="btn ghost">Tracklist ↓</a>
                    <a href={profile.resume} target="_blank" rel="noreferrer" className="btn ghost">Press kit (résumé)</a>
                </div>
                </div>
            </header>

            <main id="tracklist">
                {SIDES.map((side) => {
                    const tracks = work.filter((w) => side.kinds.includes(w.kind));
                    return (
                        <section key={side.id} className={`side side-${side.id}`} data-era={side.id}>
                            <div className="side-head"><h2>{side.label}</h2><p className="mono">{side.note} · {tracks.length} tracks</p></div>
                            <ol>
                                {tracks.map((w) => {
                                    const n = trackNo(w);
                                    const notes = cases[w.slug];
                                    return (
                                        <li key={w.slug} id={`t-${w.slug}`} className="track" data-open={open === w.slug || undefined}
                                            onClick={(e) => { if (!e.target.closest("a")) setOpen(open === w.slug ? null : w.slug); }}>
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
                                            <button type="button" className="track-toggle" aria-expanded={open === w.slug} aria-label={`More about ${w.title}`}>{open === w.slug ? "−" : "+"}</button>
                                            {open === w.slug && (
                                                <div className="track-more">
                                                    <img src={shot(w, 1100)} alt={`${w.title} screenshot`} />
                                                    <div>
                                                        <p className="mono">Track {String(n).padStart(2, "0")} · {KINDS[w.kind]}</p>
                                                        <p>{w.line}</p>
                                                        {w.stack && <p className="mono">feat. {w.stack}</p>}
                                                        <p className="track-links">
                                                            {w.url && <a className="btn" href={w.url} target="_blank" rel="noreferrer">{w.url.includes("github.com") ? "Code ↗" : `Listen live: ${host(w.url)} ↗`}</a>}
                                                            {notes && <a className="btn ghost" href={`/case.html?p=${w.slug}`}>Liner notes →</a>}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
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

            <section className="bsides" aria-labelledby="bs-h">
                <div className="side-head"><h2 id="bs-h">B-sides</h2><p className="mono">What I code to · tap a song to play it</p></div>
                <div className="bs-grid">
                    <div className="bs-player">
                        {yt ? (
                            <iframe key={yt} src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`} title="B-side player"
                                allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
                        ) : (
                            <button type="button" className="bs-idle" onClick={() => listen(onRepeat[0].id)}>
                                <img src={`https://i.ytimg.com/vi/${onRepeat[0].id}/hqdefault.jpg`} alt="" loading="lazy" />
                                <span>▶ {onRepeat[0].title} · {onRepeat[0].artist}</span>
                            </button>
                        )}
                    </div>
                    <ol className="bs-list">
                        {onRepeat.map((t, i) => (
                            <li key={t.id}>
                                <button type="button" aria-pressed={yt === t.id} onClick={() => listen(t.id)}>
                                    <span className="mono">{String.fromCharCode(66)}{i + 1}</span>
                                    <img src={`https://i.ytimg.com/vi/${t.id}/default.jpg`} alt="" loading="lazy" />
                                    <span className="bs-t"><b>{t.title}</b><small>{t.artist}{t.note ? ` · ${t.note}` : ""}</small></span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
                <p className="mono bs-fine">Songs play from YouTube, by their artists. Also rewatching: {watching.sitcoms.slice(0, 3).join(", ")}.</p>
            </section>

            <section className="merch" aria-labelledby="merch-h">
                <div className="side-head"><h2 id="merch-h">Merch table</h2><p className="mono">Everything free · take what you need</p></div>
                <div className="merch-row">
                    <a className="merch-item" href={profile.resume} target="_blank" rel="noreferrer">
                        <span className="merch-tag">FREE</span><span className="mono">The tee</span><b>Résumé</b><small>One page, PDF. Fits every role.</small><i>Download ↓</i>
                    </a>
                    <div className="merch-item">
                        <span className="merch-tag">FREE</span><span className="mono">The poster set</span><b>Tailored résumés</b><small>Pick the cut for the job.</small>
                        <i>{[["fullstack", "Full-stack"], ["frontend", "Frontend"], ["ai", "AI products"]].map(([k, l]) => <a key={k} href={`/resume.html?for=${k}`}>{l} →</a>)}</i>
                    </div>
                    <a className="merch-item hot" href={`mailto:${profile.email}`}>
                        <span className="merch-tag">FREE</span><span className="mono">The vinyl</span><b>Book a show</b><small>{profile.email}</small><i>Email me →</i>
                    </a>
                    <a className="merch-item" href={profile.whatsapp} target="_blank" rel="noreferrer">
                        <span className="mono">The hotline</span><b>WhatsApp</b><small>{profile.phone}</small><i>Message me →</i>
                    </a>
                </div>
                <ul className="tour-dates">
                    <li><b>Ahmedabad</b><span className="mono">on-site · available now</span></li>
                    <li><b>Gujarat</b><span className="mono">hybrid · available now</span></li>
                    <li><b>Remote</b><span className="mono">anywhere · available now</span></li>
                </ul>
            </section>
        </div>
    );
}
