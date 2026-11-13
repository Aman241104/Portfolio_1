import { useCallback, useEffect, useMemo, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { cases } from "../../../content/cases.js";
import { certifications } from "../../../content/certifications.js";
import { useFonts } from "../fonts.js";
import Flap from "./Flap.jsx";
import "./mission.css";

// World 6: DEPARTURES · Mission Control. Live-probed production fleet, Swiss split-flap telemetry,
// interactive platform/stack filtering, expandable project inspector, and verified credentials.
const FONTS = ["Barlow+Condensed:wght@500;600;700", "Barlow:wght@400;500;600"];
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const hhmm = (d = new Date()) => d.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
const ago = (iso) => { const s = (Date.now() - new Date(iso)) / 1000; return s < 3600 ? `${Math.max(1, Math.round(s / 60))} MIN` : s < 86400 ? `${Math.round(s / 3600)} HRS` : `${Math.round(s / 86400)} DAYS`; };
const fleet = work.filter((w) => w.maintained);
const PLATFORM = { product: "1", mobile: "2", client: "3", concept: "4" };

const verdict = (s, w, probing) => {
    if (!w.live) return ["ARCHIVED", ""];
    if (s == null) return [probing ? "PROBING" : "STANDBY", ""];
    if (!s.ok) return ["OFFLINE", "down"];
    return s.ms > 1500 ? ["DELAYED", "late"] : ["ON TIME", "ok"];
};

const LINES = (() => {
    const n = {};
    work.forEach((w) => (w.stack || "").split(/\s*[·,]\s*/).map((s) => s.replace(/\(.*?\)/g, "").trim()).filter(Boolean).forEach((s) => { n[s] = (n[s] || 0) + 1; }));
    return Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 8);
})();

const FILTERS = [
    { id: "live", label: `LIVE PROD (${fleet.length})` },
    { id: "all", label: `ALL (${work.length})` },
    { id: "product", label: "P1 · PRODUCTS" },
    { id: "mobile", label: "P2 · MOBILE" },
    { id: "client", label: "P3 · CLIENT" },
    { id: "concept", label: "P4 · CONCEPTS" },
];

export default function Departures() {
    useFonts(FONTS);
    const [clock, setClock] = useState(hhmm);
    const [sites, setSites] = useState({});
    const [checked, setChecked] = useState(null);
    const [probing, setProbing] = useState(true);
    const [gh, setGh] = useState(null);
    const [filter, setFilter] = useState("live");
    const [techFilter, setTechFilter] = useState(null);
    const [openSlug, setOpenSlug] = useState(null);
    const [scanId, setScanId] = useState(0);

    useEffect(() => { const t = setInterval(() => setClock(hhmm()), 5000); return () => clearInterval(t); }, []);

    const runClientProbe = useCallback(async () => {
        setProbing(true);
        const results = {};
        await Promise.all(work.filter((w) => w.live && w.url).map(async (w) => {
            const t0 = performance.now();
            try {
                const ctrl = new AbortController();
                const timer = setTimeout(() => ctrl.abort(), 4500);
                await fetch(w.url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal });
                clearTimeout(timer);
                results[w.slug] = { ok: true, ms: Math.max(28, Math.round(performance.now() - t0)) };
            } catch {
                results[w.slug] = { ok: false, ms: 0 };
            }
        }));
        setSites(results);
        setChecked({ checkedAt: new Date().toISOString(), from: "client-edge" });
        setProbing(false);
        setScanId((n) => n + 1);
    }, []);

    const pollStatus = useCallback(() => {
        setProbing(true);
        fetch("/api/status")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => {
                if (d?.sites && Object.keys(d.sites).length) {
                    setSites(d.sites);
                    setChecked(d);
                    setProbing(false);
                    setScanId((n) => n + 1);
                } else {
                    runClientProbe();
                }
            })
            .catch(() => runClientProbe());
    }, [runClientProbe]);

    useEffect(() => {
        pollStatus();
        const t = setInterval(pollStatus, 60000);
        fetch("/api/github")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then(setGh)
            .catch(() => setGh({ error: true, commits: [], days: {} }));
        return () => clearInterval(t);
    }, [pollStatus]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.target.closest("input, textarea, select")) return;
            if (e.key.toLowerCase() === "r") pollStatus();
            else if (e.key === "1") { setTechFilter(null); setFilter("product"); }
            else if (e.key === "2") { setTechFilter(null); setFilter("mobile"); }
            else if (e.key === "3") { setTechFilter(null); setFilter("client"); }
            else if (e.key === "4") { setTechFilter(null); setFilter("concept"); }
            else if (e.key === "0") { setTechFilter(null); setFilter("all"); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [pollStatus]);

    const visibleWork = useMemo(() => {
        let list = filter === "live" ? fleet : filter === "all" ? work : work.filter((w) => w.kind === filter);
        if (techFilter) {
            const tf = techFilter.toLowerCase();
            list = work.filter((w) => (w.stack || "").toLowerCase().includes(tf));
        }
        return list;
    }, [filter, techFilter]);

    const vals = Object.values(sites);
    const up = vals.filter((s) => s.ok).length;
    const avgMs = vals.filter((s) => s.ok && s.ms).length
        ? Math.round(vals.filter((s) => s.ok && s.ms).reduce((a, b) => a + b.ms, 0) / vals.filter((s) => s.ok && s.ms).length)
        : null;
    const at = checked ? hhmm(new Date(checked.checkedAt)) : clock;
    const remark = vals.length
        ? up === vals.length
            ? `ALL ${vals.length} LIVE ENDPOINTS NOMINAL · AVG ${avgMs ?? "--"}MS · CHECKED AT ${at} IST`
            : `${vals.length - up} ENDPOINT${vals.length - up > 1 ? "S" : ""} UNREACHABLE · ${up}/${vals.length} NOMINAL`
        : "PROBING LIVE TELEMETRY ENDPOINTS…";

    const pushes = useMemo(() => (gh?.arrivals || []).slice(0, 5), [gh]);
    const total90 = gh && !gh.error ? Object.values(gh.days || {}).reduce((a, b) => a + b, 0) : null;

    return (
        <div className="dp">
            <header className="dp-sign">
                <p className="dp-station"><b>Ahmedabad</b> <span>Aman Patel · Full-stack &amp; 3D web engineer</span></p>
                <p className="dp-clock" aria-label={`${clock} IST`}><Flap text={clock.replace(":", "")} len={4} className="dp-clockflap" /><small>IST</small></p>
            </header>

            <section className="dp-intro">
                <h1>Everything I keep running,<br />live.</h1>
                <div className="dp-intro-r">
                    <div className="dp-hud" aria-label="Mission telemetry summary">
                        <div><span>FLEET HEALTH</span><b>{vals.length ? `${up}/${vals.length} UP` : "PROBING…"}</b></div>
                        <div><span>AVG LATENCY</span><b>{avgMs ? `${avgMs} MS` : "-- MS"}</b></div>
                        <div><span>SHIPPED</span><b>{work.length} BUILDS</b></div>
                        <div><span>STATUS</span><b className="dp-live-dot">● OPEN TO WORK</b></div>
                    </div>
                    <p>{fleet.length} maintained production systems &amp; {work.length} total shipped builds, probed live with real round-trip latency.</p>
                    <p className="dp-who">{experience[0].role} at {experience[0].org} · {experience[1].role}, LDCE · Ahmedabad on-site / hybrid / remote</p>
                    <p className="dp-cta dp-cta-top">
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        <a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
                        <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
                        {socials.filter((x) => /linkedin|github/i.test(x.text || x.id)).map((x) => <a key={x.id} href={x.link} target="_blank" rel="noreferrer">{x.text}</a>)}
                    </p>
                </div>
            </section>

            <section className="dp-board" aria-labelledby="dp-dep">
                <div className="dp-board-head">
                    <div>
                        <h2 id="dp-dep">Departures</h2>
                        <p className="dp-sub">Showing {visibleWork.length} {techFilter ? `on ${techFilter}` : "missions"} · checked {at} IST</p>
                    </div>
                    <div className="dp-controls">
                        <div className="dp-tabs" role="tablist" aria-label="Filter missions">
                            {FILTERS.map((f) => (
                                <button key={f.id} type="button" role="tab" aria-selected={!techFilter && filter === f.id}
                                    onClick={() => { setTechFilter(null); setFilter(f.id); }}>
                                    {f.label}
                                </button>
                            ))}
                            {techFilter && (
                                <button type="button" className="dp-tab-clear" onClick={() => setTechFilter(null)}>
                                    × {techFilter}
                                </button>
                            )}
                        </div>
                        <button type="button" className="dp-rescan" onClick={pollStatus} disabled={probing}>
                            {probing ? "PROBING…" : "↻ RE-SCAN [R]"}
                        </button>
                    </div>
                </div>

                <div className="dp-table">
                    <div className="dp-row dp-th" aria-hidden><span>Time</span><span>Destination</span><span>Via / Stack</span><span>Plat.</span><span>Status</span><span>Latency</span></div>
                    <ol>
                        {visibleWork.map((w, i) => {
                            const s = sites[w.slug];
                            const [v, tone] = verdict(s, w, probing);
                            const isOpen = openSlug === w.slug;
                            return (
                                <li key={w.slug} className={isOpen ? "dp-item-open" : undefined}>
                                    <button type="button" className="dp-row dp-row-btn" data-tone={tone} aria-expanded={isOpen}
                                        onClick={() => setOpenSlug(isOpen ? null : w.slug)}>
                                        <Flap key={`t-${scanId}`} text={w.live ? at.replace(":", ".") : String(w.year)} len={5} start={i * 35} />
                                        <Flap key={`d-${scanId}`} text={w.title} len={22} start={i * 35 + 25} className="dp-dest" />
                                        <span className="dp-via">{w.url ? host(w.url) : w.stack?.split("·")[0]?.trim()}</span>
                                        <Flap text={PLATFORM[w.kind]} len={1} start={i * 35} className="dp-plat" />
                                        <Flap key={`s-${scanId}`} text={v} len={8} start={i * 35 + 60} className="dp-status" />
                                        <Flap key={`m-${scanId}`} text={s?.ok ? `${s.ms}MS` : w.live ? (s ? "TIMEOUT" : "...") : "LOCAL"} len={7} start={i * 35 + 80} />
                                    </button>
                                    {isOpen && (
                                        <div className="dp-drawer">
                                            <img src={shot(w, 600)} alt={`${w.title} preview`} loading="lazy" />
                                            <div className="dp-drawer-body">
                                                <p className="dp-drawer-k">{KINDS[w.kind].toUpperCase()} · {w.year}{w.note ? ` · ${w.note}` : ""}</p>
                                                <h3>{w.title}</h3>
                                                <p>{w.line}</p>
                                                {w.stack && <p className="dp-drawer-stack">STACK: {w.stack}</p>}
                                                <div className="dp-drawer-cta">
                                                    {w.url && <a href={w.url} target="_blank" rel="noreferrer">{w.url.includes("github.com") ? "View Repo ↗" : `Launch ${host(w.url)} ↗`}</a>}
                                                    {cases[w.slug] && <a href={`/case.html?p=${w.slug}`} className="ghost">Case Study →</a>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
                <p className="dp-remark" role="status"><span>Remarks</span><span className="dp-marquee"><i>{remark} · KEYS [R] RE-SCAN · [1-4] PLATFORMS · [0] ALL · TAP ANY ROW TO INSPECT · {remark}</i></span></p>
            </section>

            <div className="dp-split">
                <section className="dp-board dp-arr" aria-labelledby="dp-arr">
                    <div className="dp-board-head">
                        <h2 id="dp-arr">{pushes.length ? "Arrivals" : "Recent Releases"}</h2>
                        <p>{pushes.length ? `Public repositories${total90 != null ? ` · ${total90} commits in 90 days` : ""}` : "Latest shipped milestones (2025–2026)"}</p>
                    </div>
                    <ol>
                        {pushes.length ? pushes.map((c, i) => (
                            <li key={c.at + c.repo} className="dp-row dp-arow">
                                <Flap text={ago(c.at)} len={7} start={i * 70} />
                                <Flap text={c.repo.replace(/[-_]/g, " ")} len={18} start={i * 70 + 50} className="dp-dest" />
                                <Flap text={`${c.n} COMMIT${c.n > 1 ? "S" : ""}`} len={11} start={i * 70 + 100} />
                            </li>
                        )) : work.slice(0, 5).map((w, i) => (
                            <li key={w.slug} className="dp-row dp-arow">
                                <Flap text={String(w.year)} len={5} start={i * 50} />
                                <Flap text={w.title} len={20} start={i * 50 + 30} className="dp-dest" />
                                <Flap text={w.live ? "SHIPPED" : "CONCEPT"} len={8} start={i * 50 + 60} />
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="dp-lines" aria-labelledby="dp-lines">
                    <h2 id="dp-lines">Lines in service</h2>
                    <p className="dp-cap">Tap any technology to filter the departures board.</p>
                    <ul>
                        {LINES.map(([t, n]) => (
                            <li key={t}>
                                <button type="button" className={`dp-line-btn${techFilter === t ? " is-active" : ""}`}
                                    onClick={() => setTechFilter(techFilter === t ? null : t)}>
                                    <b>{t}</b>
                                    <span className="dp-seg" aria-label={`${n} projects`}>{Array.from({ length: n }, (_, k) => <i key={k} />)}</span>
                                    <em>{n}</em>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className="dp-route" aria-labelledby="dp-route">
                <div className="dp-route-grid">
                    <div>
                        <h2 id="dp-route">Route</h2>
                        <ol className="dp-map">
                            {[...experience].reverse().map((x) => (
                                <li key={x.role}>
                                    <i aria-hidden />
                                    <span className="dp-when">{x.when.replace(" — ", "–")}</span>
                                    <b>{x.org}</b>
                                    <small>{x.role}</small>
                                    {x.points?.[0] && <p className="dp-pt">{x.points[0]}</p>}
                                </li>
                            ))}
                            <li className="dp-next">
                                <i aria-hidden />
                                <span className="dp-when">Next stop</span>
                                <b>Your team?</b>
                                <small>Full-stack roles · Ahmedabad on-site, hybrid or remote · available now</small>
                                <span className="dp-cta"><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a></span>
                            </li>
                        </ol>
                    </div>

                    <div className="dp-certs">
                        <h2>Verified Credentials</h2>
                        <ul>
                            {certifications.map((c) => (
                                <li key={c.code}>
                                    <div>
                                        <span className="dp-when">{c.code} · {c.issuer}</span>
                                        <b>{c.title}</b>
                                    </div>
                                    {c.url && <a href={c.url} target="_blank" rel="noreferrer">Verify ↗</a>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <footer className="dp-foot">
                <p>{work.length} projects in total · {Object.entries(KINDS).map(([k, l]) => `${work.filter((w) => w.kind === k).length} ${l.toLowerCase()}`).join(" · ")}</p>
                <p>{socials.map((s) => <a key={s.id} href={s.link} target="_blank" rel="noreferrer">{s.text}</a>)}</p>
            </footer>
        </div>
    );
}
