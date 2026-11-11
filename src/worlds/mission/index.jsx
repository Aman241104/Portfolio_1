import { useEffect, useMemo, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { work, KINDS } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { useFonts } from "../fonts.js";
import Flap from "./Flap.jsx";
import "./mission.css";

// World 5: DEPARTURES. My live sites as a station's split-flap board, health-checked server-side every minute
// (/api/status). Public GitHub pushes arrive on the second board (/api/github). The career runs as a metro line
// whose next stop is the visitor's team. Swiss grid, black and signal yellow, red only when something is down.
const FONTS = ["Barlow+Condensed:wght@500;600;700", "Barlow:wght@400;500;600"];
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const hhmm = (d = new Date()) => d.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
const ago = (iso) => { const s = (Date.now() - new Date(iso)) / 1000; return s < 3600 ? `${Math.max(1, Math.round(s / 60))} MIN` : s < 86400 ? `${Math.round(s / 3600)} HRS` : `${Math.round(s / 86400)} DAYS`; };
const fleet = work.filter((w) => w.maintained);
const PLATFORM = { product: "1", mobile: "2", client: "3", concept: "4" };
const verdict = (s) => (s == null ? ["CHECKING", ""] : !s.ok ? ["CANCELLED", "down"] : s.ms > 1500 ? ["DELAYED", "late"] : ["ON TIME", "ok"]);

// the "lines": technologies by how many projects run on them
const LINES = (() => {
    const n = {};
    work.forEach((w) => (w.stack || "").split(/\s*[·,]\s*/).map((s) => s.replace(/\(.*?\)/g, "").trim()).filter(Boolean).forEach((s) => { n[s] = (n[s] || 0) + 1; }));
    return Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 8);
})();

export default function Departures() {
    useFonts(FONTS);
    const [clock, setClock] = useState(hhmm);
    const [sites, setSites] = useState({});
    const [checked, setChecked] = useState(null);
    const [gh, setGh] = useState(null);

    useEffect(() => { const t = setInterval(() => setClock(hhmm()), 5000); return () => clearInterval(t); }, []);
    useEffect(() => {
        const poll = () => fetch("/api/status").then((r) => r.json()).then((d) => { setSites(d.sites || {}); setChecked(d); }).catch(() => {});
        poll(); const t = setInterval(poll, 60000);
        fetch("/api/github").then((r) => r.json()).then(setGh).catch(() => setGh({ commits: [], days: {} }));
        return () => clearInterval(t);
    }, []);

    const vals = Object.values(sites), up = vals.filter((s) => s.ok).length;
    const at = checked ? hhmm(new Date(checked.checkedAt)) : "--:--";
    const remark = vals.length
        ? up === vals.length ? `ALL ${vals.length} SERVICES RUNNING · CHECKED FROM ${checked?.from === "sin1" ? "SINGAPORE" : "THE EDGE"} AT ${at} IST`
            : `${vals.length - up} SERVICE${vals.length - up > 1 ? "S" : ""} DISRUPTED · ENGINEER NOTIFIED`
        : "FETCHING LIVE STATUS…";
    const pushes = useMemo(() => (gh?.commits || []).slice(0, 5), [gh]);
    const total90 = gh ? Object.values(gh.days || {}).reduce((a, b) => a + b, 0) : null;

    return (
        <div className="dp">
            <header className="dp-sign">
                <p className="dp-station"><b>Ahmedabad</b> <span>Aman Patel · Full-stack engineer</span></p>
                <p className="dp-clock" aria-label={`${clock} IST`}><Flap text={clock.replace(":", "")} len={4} className="dp-clockflap" /><small>IST</small></p>
            </header>

            <section className="dp-intro">
                <h1>Everything I keep running,<br />live.</h1>
                <p>{fleet.length} sites and products I built and still maintain, health-checked from a server every minute. Nothing on this board is a mock-up.</p>
            </section>

            <section className="dp-board" aria-labelledby="dp-dep">
                <div className="dp-board-head">
                    <h2 id="dp-dep">Departures</h2>
                    <p>Live sites · checked {at} IST</p>
                </div>
                <div className="dp-table">
                <div className="dp-row dp-th" aria-hidden><span>Time</span><span>Destination</span><span>Via</span><span>Plat.</span><span>Status</span><span>Latency</span></div>
                <ol>
                    {fleet.map((w, i) => {
                        const s = sites[w.slug], [v, tone] = verdict(s);
                        return (
                            <li key={w.slug}>
                                <a className="dp-row" href={w.url} target="_blank" rel="noreferrer" data-tone={tone}>
                                    <Flap text={at.replace(":", ".")} len={5} start={i * 60} />
                                    <Flap text={w.title} len={18} start={i * 60 + 40} className="dp-dest" />
                                    <span className="dp-via">{host(w.url)}</span>
                                    <Flap text={PLATFORM[w.kind]} len={1} start={i * 60} className="dp-plat" />
                                    <Flap text={v} len={9} start={i * 60 + 120} className="dp-status" />
                                    <Flap text={s?.ok ? `${s.ms}MS` : s ? "----" : ""} len={6} start={i * 60 + 160} />
                                </a>
                            </li>
                        );
                    })}
                </ol>
                </div>
                <p className="dp-remark" role="status"><span>Remarks</span><span className="dp-marquee"><i>{remark} · PLATFORM 1 PRODUCTS · 2 MOBILE · 3 CLIENT SITES · {remark}</i></span></p>
            </section>

            <div className="dp-split">
                <section className="dp-board dp-arr" aria-labelledby="dp-arr">
                    <div className="dp-board-head"><h2 id="dp-arr">Arrivals</h2><p>Public GitHub pushes{total90 != null ? ` · ${total90} in 90 days` : ""}</p></div>
                    <ol>
                        {pushes.map((c, i) => (
                            <li key={c.at + c.repo} className="dp-row dp-arow">
                                <Flap text={ago(c.at)} len={7} start={i * 70} />
                                <Flap text={c.repo.replace(/[-_]/g, " ")} len={16} start={i * 70 + 50} className="dp-dest" />
                                <Flap text={`${c.n} COMMIT${c.n > 1 ? "S" : ""}`} len={9} start={i * 70 + 100} />
                            </li>
                        ))}
                        {gh && !pushes.length && <li className="dp-empty">No public pushes this week. Most client work lives in private repositories.</li>}
                    </ol>
                </section>

                <section className="dp-lines" aria-labelledby="dp-lines">
                    <h2 id="dp-lines">Lines in service</h2>
                    <p className="dp-cap">Technologies, by the number of projects running on them.</p>
                    <ul>
                        {LINES.map(([t, n]) => (
                            <li key={t}><b>{t}</b><span className="dp-seg" aria-label={`${n} projects`}>{Array.from({ length: n }, (_, k) => <i key={k} />)}</span><em>{n}</em></li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className="dp-route" aria-labelledby="dp-route">
                <h2 id="dp-route">Route</h2>
                <ol className="dp-map">
                    {[...experience].reverse().map((x) => (
                        <li key={x.role}><i aria-hidden /><span className="dp-when">{x.when.replace(" — ", "–")}</span><b>{x.org}</b><small>{x.role}</small></li>
                    ))}
                    <li className="dp-next"><i aria-hidden /><span className="dp-when">Next stop</span><b>Your team?</b>
                        <small>Full-stack roles · Ahmedabad on-site or hybrid · available now</small>
                        <span className="dp-cta"><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a></span>
                    </li>
                </ol>
            </section>

            <footer className="dp-foot">
                <p>{work.length} projects in total · {Object.entries(KINDS).map(([k, l]) => `${work.filter((w) => w.kind === k).length} ${l.toLowerCase()}`).join(" · ")}</p>
                <p>{socials.map((s) => <a key={s.id} href={s.link} target="_blank" rel="noreferrer">{s.text}</a>)}</p>
            </footer>
        </div>
    );
}
