import { Barcode } from "./Printer.jsx";
import { useEffect, useRef, useState } from "react";
import { work, KINDS, shot } from "#content/work.js";
import { sfx } from "#machine/sfx.js";
import { track } from "../analytics.js";
import { cases } from "#content/cases.js";

// Everything I've built and shipped, made for a recruiter's first 30 seconds: résumé and contact up top, filters by
// kind, real screenshots (Cloudinary) in a browser frame. The shot scrolls through the page on hover; on touch the card
// crossing the middle of the screen does it instead. Opening a live site plays a short "leaving PX-01" transition
// (cmd/ctrl/middle-click still opens a normal new tab).
const host = (u = "") => u.replace(/^https?:\/\//, "").replace(/\/$/, "");
const FIRST = 9;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = () => matchMedia("(pointer: coarse)").matches;
const phone = () => matchMedia("(max-width: 760px)").matches;

const Leaving = ({ item, rect, mode = "external" }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => { const r = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); return () => cancelAnimationFrame(r); }, []);
    const box = open ? { left: 0, top: 0, width: "100vw", height: "100vh" } : { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    return (
        <div className="leaving" data-open={open || undefined} role="status" aria-live="assertive">
            <img src={shot(item, 720)} alt="" style={box} />
            <div className="leaving-card">
                <p className="mono">{mode === "case" ? "PX-01 · Case study" : "Leaving PX-01 · opening"}</p>
                <p className="leaving-host">{mode === "case" ? item.title : host(item.url)}</p>
                <div className="leaving-bar"><i /></div>
                <p className="mono">Back button brings you right back here</p>
            </div>
        </div>
    );
};

// Hover tilt + vertical screenshot scrub: the screenshot leans toward the pointer and scrubs vertically
// through the page with a 1px chrome progress bar.
const tilt = (e) => {
    if (e.pointerType !== "mouse") return;
    const shot = e.target.closest?.(".card-shot");
    if (!shot) return;
    const r = shot.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    shot.style.setProperty("--ry", `${(nx - 0.5) * 7}deg`);
    shot.style.setProperty("--rx", `${(ny - 0.5) * -6}deg`);
    shot.style.setProperty("--py", `${(ny * 100).toFixed(1)}%`);
    shot.style.setProperty("--prog", ny.toFixed(3));
};
const untilt = (e) => e.currentTarget.querySelectorAll(".card-shot").forEach((s) => {
    s.style.removeProperty("--rx"); s.style.removeProperty("--ry");
    s.style.removeProperty("--py"); s.style.removeProperty("--prog");
});

export default function Work() {
    const [kind, setKind] = useState("all");
    const [view, setView] = useState("showcase");
    const [all, setAll] = useState(false);
    const [active, setActive] = useState(null);
    const [leaving, setLeaving] = useState(null);
    const list = useRef(null);

    const shown = work.filter((w) => kind === "all" || w.kind === kind);
    const [isPhone] = useState(phone);                  // phones: every card in one swipeable row
    const visible = all || isPhone ? shown : shown.slice(0, FIRST);
    const [at, setAt] = useState(0);
    const useShowcase = !isPhone && view === "showcase" && kind === "all";
    const flagships = useShowcase ? shown.slice(0, 3) : [];
    // strongest first: products/apps, then live client domains, then preview builds, then concepts (stable within each)
    const rank = (w) => (w.kind === "client" ? (w.live ? 1 : 2) : w.kind === "concept" ? 3 : 0);
    const archive = (useShowcase ? shown.slice(3) : shown).map((w, i) => [w, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([w]) => w);
    const [ledgerAll, setLedgerAll] = useState(false);
    const LEDGER_FIRST = 10;                                   // the critic's 10–12-rows-per-viewport rule
    const ledgerRows = ledgerAll ? archive : archive.slice(0, LEDGER_FIRST);
    const [stageSlug, setStageSlug] = useState(null);
    const staged = archive.find((w) => w.slug === stageSlug) || archive[0] || shown[0];
    const secRef = useRef(null);
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const el = secRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setEntered(true); io.disconnect(); }
        }, { threshold: 0.05 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // back from the project (bfcache) → drop the transition overlay
    useEffect(() => {
        const back = (e) => { if (e.persisted) setLeaving(null); };
        window.addEventListener("pageshow", back);
        return () => window.removeEventListener("pageshow", back);
    }, []);
    // touch: the card in the middle of the screen is "hovered"
    useEffect(() => {
        if (!touch()) return;
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            setActive(e.target.dataset.slug);
            setAt([...list.current.children].indexOf(e.target));
        }), isPhone ? { root: list.current, rootMargin: "0px -45% 0px -45%" } : { rootMargin: "-40% 0px -40% 0px" });
        list.current.querySelectorAll(".card").forEach((c) => io.observe(c));
        return () => io.disconnect();
    }, [kind, all, isPhone]);

    const open = (e, item) => {
        track("project_opened", { project: item.slug, kind: item.kind });
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1 || reduced()) return;   // native behaviour
        e.preventDefault();
        const img = e.currentTarget.querySelector("img") || e.currentTarget.closest?.(".work-ledger-split")?.querySelector(".work-stage img");
        if (!img) { window.open(item.url, "_blank", "noopener,noreferrer"); return; }
        setLeaving({ item, rect: img.getBoundingClientRect(), mode: "external" });
        sfx.detent();
        setTimeout(() => {
            window.open(item.url, "_blank", "noopener,noreferrer");
            setLeaving(null);
        }, 420);
    };

    const openCase = (e, item) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1 || reduced()) return;
        e.preventDefault();
        const img = e.currentTarget.closest?.(".card, .work-stage")?.querySelector("img");
        if (!img) { window.location.assign(`/case.html?p=${item.slug}`); return; }
        setLeaving({ item, rect: img.getBoundingClientRect(), mode: "case" });
        sfx.detent();
        setTimeout(() => { window.location.assign(`/case.html?p=${item.slug}`); }, 380);
    };

    const renderCard = (w, i, cls = "card") => (
        <li key={w.slug} style={{ "--i": Math.min(i, 6) }} className={cls} data-slug={w.slug} data-active={active === w.slug || undefined}>
            {(() => {
                const inner = (
                    <>
                        <div className="card-shot">
                            <div className="card-img"><img src={shot(w, cls.includes("flagship-hero") ? 1600 : 720)} alt="" loading="lazy" /></div>
                        </div>
                        <div className="card-meta">
                            <p className="mono">{String(i + 1).padStart(2, "0")} · {KINDS[w.kind]} · {w.year}{w.live && <span className="live">● Live at {host(w.url).replace(/^www\./, "")}</span>}</p>
                            <h3>{w.title} {w.url && <i aria-hidden>↗</i>}</h3>
                            <p className="card-line">{w.line}</p>
                            {w.stack && <p className="mono card-stack">{w.stack}</p>}
                            {w.note && <p className="mono card-note">{w.note}</p>}
                            <dl className="tkt-credits">
                                <div><dt>Built by</dt><dd>Aman Patel</dd></div>
                                <div><dt>For</dt><dd>{w.kind === "client" ? w.title : w.kind === "concept" ? "Study" : "Own product"}</dd></div>
                                <div><dt>Year</dt><dd>{w.year}</dd></div>
                            </dl>
                            <p className="tkt-stub" aria-hidden>
                                <span>No. {String(i + 1).padStart(3, "0")}-{w.year}</span>
                                <Barcode value={w.slug} />
                                <span className="tkt-state" data-live={w.live || undefined}>{w.live ? "Live" : w.url ? "Shipped" : "Private"}</span>
                            </p>
                        </div>
                    </>
                );
                return w.url
                    ? <a href={w.url} onClick={(e) => open(e, w)} aria-label={`${w.title}, open ${w.live ? "the live site" : "the project"}`}>{inner}</a>
                    : <div className="card-static">{inner}</div>;
            })()}
            <div className="card-foot-links">
                {cases[w.slug] && <a className="card-case mono" href={`/case.html?p=${w.slug}`} onClick={(e) => openCase(e, w)}>Case study →</a>}
                {w.repo && w.repo !== w.url && <a className="card-code mono" href={w.repo} target="_blank" rel="noreferrer">Code ↗</a>}
            </div>
        </li>
    );

    return (
        <section ref={secRef} id="work" className="work" aria-labelledby="work-h">
            <div className="work-head">
                <div className="po-print" data-reveal>
                    <p className="mono sec-kicker">Output 02 · Tickets</p>
                    <h2 id="work-h">Work</h2>
                </div>
                <div className="work-controls">
                    {!isPhone && (
                        <div className="view-toggle" role="group" aria-label="View mode">
                            {[["showcase", "Showcase"], ["index", "Index"]].map(([v, label]) => (
                                <button key={v} type="button" aria-pressed={view === v} onClick={() => {
                                    const update = () => setView(v);
                                    if (document.startViewTransition && !reduced()) document.startViewTransition(update);
                                    else update();
                                }}>{label}</button>
                            ))}
                        </div>
                    )}
                    <div className="filters" role="tablist" aria-label="Filter projects">
                        {Object.entries({ all: "All", ...KINDS }).map(([k, label]) => {
                            const n = k === "all" ? work.length : work.filter((w) => w.kind === k).length;
                            return (
                                <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => {
                                    const update = () => { setKind(k); setAll(false); setAt(0); list.current?.scrollTo({ left: 0 }); };
                                    if (document.startViewTransition && !reduced()) document.startViewTransition(update);
                                    else update();
                                }}>
                                    {label} <span className="mono">{n}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {useShowcase && (
                <>
                    <ul className="work-flagships" data-reveal data-in={entered ? "" : undefined} onPointerMove={tilt} onPointerLeave={untilt}>
                        {flagships.map((w, i) => renderCard(w, i, i === 0 ? "card flagship-hero" : i === 1 ? "card flagship-wide" : "card flagship-side"))}
                    </ul>
                    <div className="ledger-head">
                        <p className="mono">Client &amp; product index · {archive.length} more</p>
                        <p className="mono">Hover any row to inspect · Click to open live</p>
                    </div>
                </>
            )}

            {!isPhone && (useShowcase || view === "index") ? (
                <div className="work-ledger-split" data-reveal data-in={entered ? "" : undefined}>
                    <div className="ledger-col">
                    <ol className="work-ledger">
                        {ledgerRows.map((w, i) => {
                            const idx = useShowcase ? i + 4 : i + 1;
                            const isHot = staged?.slug === w.slug;
                            return (
                                <li key={w.slug} className={isHot ? "is-hot" : undefined} onPointerEnter={() => setStageSlug(w.slug)}>
                                    {w.url ? (
                                        <a href={w.url} onClick={(e) => open(e, w)}>
                                            <span className="mono wl-num">{String(idx).padStart(2, "0")}</span>
                                            <span className="wl-title">{w.title}</span>
                                            <span className="mono wl-kind">{KINDS[w.kind]} · {w.year}</span>
                                            <span className="mono wl-stack">{w.stack || ""}</span>
                                            <span className="wl-go" aria-hidden>↗</span>
                                        </a>
                                    ) : (
                                        <div className="wl-static">
                                            <span className="mono wl-num">{String(idx).padStart(2, "0")}</span>
                                            <span className="wl-title">{w.title}</span>
                                            <span className="mono wl-kind">{KINDS[w.kind]} · {w.year}</span>
                                            <span className="mono wl-stack">{w.stack || ""}</span>
                                            <span className="wl-go" aria-hidden>—</span>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                    {archive.length > LEDGER_FIRST && (
                        <button type="button" className="more ledger-more" onClick={() => setLedgerAll((v) => !v)}>
                            {ledgerAll ? "Show fewer" : `Show all ${archive.length}`}
                        </button>
                    )}
                    </div>
                    {staged && (
                        <aside className="work-stage" aria-live="polite">
                            <div className="card-shot" onPointerMove={tilt} onPointerLeave={untilt}>
                                <div className="card-img"><img src={shot(staged, 720)} alt="" loading="lazy" /></div>
                            </div>
                            <div className="ws-meta">
                                <p className="mono">{KINDS[staged.kind]} · {staged.year}{staged.live && <span className="live"> ● Live</span>}</p>
                                <h3>{staged.title}</h3>
                                <p className="card-line">{staged.line}</p>
                                {staged.stack && <p className="mono card-stack">{staged.stack}</p>}
                                {staged.note && <p className="mono card-note">{staged.note}</p>}
                                <div className="ws-actions">
                                    {staged.url && <a className="mono ws-open" href={staged.url} onClick={(e) => open(e, staged)}>Open live ↗</a>}
                                    {cases[staged.slug] && <a className="card-case mono" href={`/case.html?p=${staged.slug}`} onClick={(e) => openCase(e, staged)}>Case study →</a>}
                                    {staged.repo && staged.repo !== staged.url && <a className="card-code mono" href={staged.repo} target="_blank" rel="noreferrer">Code ↗</a>}
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            ) : (
                <>
                    <ul ref={list} className="cards" data-reveal data-in={entered ? "" : undefined} onPointerMove={tilt} onPointerLeave={untilt}>
                        {visible.map((w, i) => renderCard(w, i))}
                    </ul>
                    {isPhone && <p className="mono swipe-hint" aria-hidden><span>{String(at + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span> Swipe for more →</p>}
                    {!isPhone && shown.length > FIRST && (
                        <button type="button" className="more" onClick={() => setAll((v) => !v)}>
                            {all ? "Show fewer" : `Show all ${shown.length} ${kind === "all" ? "projects" : KINDS[kind].toLowerCase()}`}
                        </button>
                    )}
                </>
            )}
            {leaving && <Leaving {...leaving} />}
        </section>
    );
}
