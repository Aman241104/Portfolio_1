import { useEffect, useRef, useState } from "react";
import { work, KINDS } from "#content/work.js";

// Production sites and products I built and still look after. Status comes from /api/status (checked server-side,
// cached 5 min); if that's unavailable (local dev), the visitor's browser pings each site instead, with a retry.
const host = (u) => u.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^www\./, "");
const ping = async (url) => {
    for (let i = 0; i < 2; i++) {
        const t = performance.now();
        try {
            await Promise.race([fetch(url, { mode: "no-cors", cache: "no-store" }), new Promise((_, no) => setTimeout(no, 12000))]);
            return Math.round(performance.now() - t);
        } catch { /* one retry */ }
    }
    return -1;
};
const ago = (iso) => { const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? "just now" : `${m} min ago`; };

export default function Maintained() {
    const list = work.filter((w) => w.maintained);
    const [status, setStatus] = useState({});
    const [checked, setChecked] = useState(null);       // { at, from } when the server check answered
    const ref = useRef(null);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            fetch("/api/status").then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => {
                setStatus(Object.fromEntries(list.map((w) => [w.slug, d.sites[w.slug]?.ok ? d.sites[w.slug].ms : -1])));
                setChecked({ at: d.checkedAt, from: d.from });
            }).catch(() => list.forEach((w) => ping(w.url).then((ms) => setStatus((s) => ({ ...s, [w.slug]: ms })))));
        }, { rootMargin: "200px" });
        io.observe(ref.current);
        return () => io.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const up = Object.values(status).filter((ms) => ms >= 0).length;

    return (
        <section ref={ref} className="kept split-sec" aria-labelledby="kept-h">
            <aside className="split-rail">
                <p className="mono sec-kicker">03 // PRODUCTION</p>
                <h2 id="kept-h">Live &amp; maintained</h2>
                <p className="kept-intro">Sites and products I built that are in production today. I still ship fixes, content and features on them.</p>
                <p className="mono kept-sum" aria-live="polite">
                    {Object.keys(status).length < list.length ? "Checking endpoints…" : `${up} / ${list.length} operational · ${checked ? `${ago(checked.at)} (${checked.from === "sin1" ? "SIN1" : "server"})` : "live browser probe"}`}
                </p>
            </aside>
            <ol className="kept-list" data-reveal>
                {list.map((w, i) => {
                    const ms = status[w.slug];
                    const state = ms === undefined ? "wait" : ms < 0 ? "down" : "up";
                    const lat = state === "up" ? Math.max(0.08, Math.min(1, ms / 900)).toFixed(3) : 0;
                    return (
                        <li key={w.slug} style={{ "--i": i, "--lat": lat }}>
                            <a href={w.url} target="_blank" rel="noreferrer">
                                <i className="dot" data-state={state} aria-hidden />
                                <span className="kept-name">{w.title}</span>
                                <span className="mono kept-host">{host(w.url)}</span>
                                <span className="mono kept-kind">{w.kind === "client" ? "Client site" : KINDS[w.kind].replace(/s$/, "")}</span>
                                <span className="mono kept-ms">{state === "wait" ? "…" : state === "down" ? "no answer" : `up · ${ms} ms`}</span>
                            </a>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
