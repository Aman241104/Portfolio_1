import { useEffect, useMemo, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { work, KINDS } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import "./mission.css";

// World 5: MISSION CONTROL. The portfolio as an ops room, on real data only: the live sites are health-checked
// server-side (/api/status), GitHub activity comes from /api/github, everything else is counted from content/.
// Latency sparklines build up live while the page is open (polled every 60s).
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const ago = (iso) => { const s = (Date.now() - new Date(iso)) / 1000; return s < 3600 ? `${Math.max(1, Math.round(s / 60))}m` : s < 86400 ? `${Math.round(s / 3600)}h` : `${Math.round(s / 86400)}d`; };
const ist = () => new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });
const fleet = work.filter((w) => w.maintained);

const Spark = ({ pts, w = 120, h = 28 }) => {
    if (pts.length < 2) return <svg className="mc-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden><line x1="0" x2={w} y1={h / 2} y2={h / 2} /></svg>;
    const max = Math.max(...pts, 400), step = w / (pts.length - 1);
    const d = pts.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`).join("");
    return <svg className="mc-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden><path d={d} /><circle cx={w} cy={h - 2 - (pts.at(-1) / max) * (h - 4)} r="2.2" /></svg>;
};

// stack telemetry: how many projects use each technology (counted from the work list's stack strings)
const STACK = (() => {
    const n = {};
    work.forEach((w) => (w.stack || "").split(/\s*[·,]\s*/).map((s) => s.replace(/\(.*?\)/g, "").trim()).filter(Boolean).forEach((s) => { n[s] = (n[s] || 0) + 1; }));
    return Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 10);
})();

export default function MissionControl() {
    const [now, setNow] = useState(ist);
    const [hist, setHist] = useState({});           // slug → [ms…]
    const [up, setUp] = useState({});               // slug → ok
    const [checked, setChecked] = useState(null);
    const [gh, setGh] = useState(null);
    const [pulls, setPulls] = useState(null);

    useEffect(() => { const t = setInterval(() => setNow(ist()), 1000); return () => clearInterval(t); }, []);
    useEffect(() => {
        const poll = () => fetch("/api/status").then((r) => r.json()).then((d) => {
            setChecked(d);
            setUp(Object.fromEntries(Object.entries(d.sites).map(([k, v]) => [k, v.ok])));
            setHist((h) => Object.fromEntries(Object.entries(d.sites).map(([k, v]) => [k, [...(h[k] || []), v.ok ? v.ms : 0].slice(-24)])));
        }).catch(() => {});
        poll(); const t = setInterval(poll, 60000);
        fetch("/api/github").then((r) => r.json()).then(setGh).catch(() => setGh({ days: {}, commits: [], repos: [] }));
        fetch("/api/pulls").then((r) => r.json()).then((d) => setPulls(d.pulls)).catch(() => {});
        return () => clearInterval(t);
    }, []);

    const nUp = Object.values(up).filter(Boolean).length, known = Object.keys(up).length;
    const allGood = known && nUp === known;
    // 13-week heatmap ending today (columns = weeks, rows = Mon..Sun)
    const heat = useMemo(() => {
        const out = [], today = new Date(); today.setHours(0, 0, 0, 0);
        const start = new Date(today); start.setDate(start.getDate() - 90);
        for (let i = 0; i < 91; i++) { const d = new Date(start); d.setDate(start.getDate() + i); const k = d.toISOString().slice(0, 10); out.push([k, gh?.days?.[k] || 0, d > today]); }
        return out;
    }, [gh]);
    const ghTotal = gh ? Object.values(gh.days).reduce((a, b) => a + b, 0) : null;
    const maxStack = STACK[0]?.[1] || 1;

    return (
        <div className="mc">
            <header className="mc-top">
                <div className="mc-id"><i className="mc-led" data-ok={allGood || undefined} /> MISSION CONTROL <span>· {profile.name.toUpperCase()} · FULL-STACK ENGINEER</span></div>
                <div className="mc-status" role="status">{known ? (allGood ? `ALL SYSTEMS OPERATIONAL · ${nUp}/${known}` : `${nUp}/${known} SYSTEMS UP`) : "POLLING FLEET…"}</div>
                <div className="mc-clock">AHMEDABAD {now} IST</div>
            </header>

            <section className="mc-hero">
                <div>
                    <p className="mc-k">Operator</p>
                    <h1>{profile.name}</h1>
                    <p className="mc-sub">I build and keep AI products and client sites running. Everything on this screen is live: real health checks, real commits.</p>
                    <div className="mc-cta">
                        <a className="mc-btn" href={profile.resume} target="_blank" rel="noreferrer">Download résumé ↓</a>
                        <a className="mc-btn ghost" href={`mailto:${profile.email}`}>Open a channel: email</a>
                    </div>
                </div>
                <dl className="mc-vitals">
                    {[
                        [work.length, "projects shipped"], [fleet.length, "in production"], [work.filter((w) => w.kind === "client").length, "client sites"],
                        [skillGroups.reduce((a, g) => a + g.items.length, 0), "tools in use"], [ghTotal ?? "—", "GitHub events · 90d"], [pulls ?? "—", "lever pulls, all time"],
                    ].map(([v, l]) => <div key={l}><dd>{v}</dd><dt>{l}</dt></div>)}
                </dl>
            </section>

            <div className="mc-grid">
                <section className="mc-panel mc-fleet" aria-labelledby="mc-fleet">
                    <h2 id="mc-fleet">Fleet <span>{fleet.length} live sites · checked from {checked?.from === "sin1" ? "Singapore" : "the edge"} · every 60s</span></h2>
                    <ul>
                        {fleet.map((w) => {
                            const h = hist[w.slug] || [], ok = up[w.slug];
                            return (
                                <li key={w.slug}>
                                    <i className="mc-led" data-ok={ok || undefined} data-down={ok === false || undefined} aria-label={ok == null ? "checking" : ok ? "up" : "down"} />
                                    <a href={w.url} target="_blank" rel="noreferrer"><b>{w.title}</b><small>{host(w.url)}</small></a>
                                    <Spark pts={h} />
                                    <span className="mc-ms">{ok ? `${h.at(-1)} ms` : ok === false ? "DOWN" : "…"}</span>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="mc-panel mc-activity" aria-labelledby="mc-act">
                    <h2 id="mc-act">Commit activity <span>github.com/{gh?.user || "Aman241104"} · public · 13 weeks</span></h2>
                    <div className="mc-heat" role="img" aria-label={`${ghTotal ?? 0} public GitHub events in 90 days`}>
                        {heat.map(([k, n, future]) => <i key={k} title={`${k}: ${n}`} data-l={future ? "x" : n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4} />)}
                    </div>
                    <ol className="mc-feed">
                        {(gh?.commits || []).slice(0, 6).map((c) => (
                            <li key={c.at + c.repo}><span className="mc-t">{ago(c.at)} ago</span> pushed {c.n > 1 ? `${c.n} commits` : "a commit"} to <b>{c.repo}</b>{c.branch && c.branch !== "main" ? ` (${c.branch})` : ""}</li>
                        ))}
                        {gh && !gh.commits.length && <li className="mc-t">No public pushes in the window. Most client work lives in private repos.</li>}
                    </ol>
                </section>

                <section className="mc-panel mc-stack" aria-labelledby="mc-stack">
                    <h2 id="mc-stack">Stack telemetry <span>technologies by number of projects</span></h2>
                    <ul>
                        {STACK.map(([t, n]) => <li key={t}><span>{t}</span><i style={{ "--w": `${(n / maxStack) * 100}%` }} /><b>{n}</b></li>)}
                    </ul>
                </section>

                <section className="mc-panel mc-log" aria-labelledby="mc-log">
                    <h2 id="mc-log">Mission log <span>career</span></h2>
                    <ol>
                        {experience.map((x) => (
                            <li key={x.role}><span className="mc-t">{x.when}</span><b>{x.role}</b><small>{x.org} · {x.where}</small></li>
                        ))}
                    </ol>
                    <h2 className="mc-h2b">Payloads <span>by kind</span></h2>
                    <ul className="mc-kinds">
                        {Object.entries(KINDS).map(([k, l]) => <li key={k}><b>{work.filter((w) => w.kind === k).length}</b>{l}</li>)}
                    </ul>
                </section>

                <section className="mc-panel mc-comms" aria-labelledby="mc-comms">
                    <h2 id="mc-comms">Comms <span>open channel</span></h2>
                    <a className="mc-big" href={`mailto:${profile.email}`}>{profile.email}</a>
                    <p className="mc-links">{socials.map((s) => <a key={s.id} href={s.link} target="_blank" rel="noreferrer">{s.text} ↗</a>)}</p>
                </section>
            </div>
        </div>
    );
}
