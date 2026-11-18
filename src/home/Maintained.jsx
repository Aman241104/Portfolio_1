import { useEffect, useRef, useState } from "react";
import { work, KINDS, inProduction, host } from "#content/work.js";
import { liveStatus } from "../status.js";

// Production sites and products I built and still look after, checked live (src/status.js).
const ago = (iso) => { const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? "just now" : `${m} min ago`; };

export default function Maintained() {
    const list = work.filter(inProduction);
    const [status, setStatus] = useState({});
    const [checked, setChecked] = useState(null);       // { at, from } when the server check answered
    const ref = useRef(null);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            liveStatus().then((d) => {
                setStatus(Object.fromEntries(list.map((w) => [w.slug, d.sites[w.slug]?.ok ? d.sites[w.slug].ms : -1])));
                setChecked({ at: d.checkedAt, from: d.from });
            });
        }, { rootMargin: "200px" });
        io.observe(ref.current);
        return () => io.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const up = Object.values(status).filter((ms) => ms >= 0).length;

    return (
        <section ref={ref} className="kept split-sec" aria-labelledby="kept-h">
            <aside className="split-rail po-print" data-reveal>
                <p className="mono sec-kicker">Output 03 · Live telemetry</p>
                <h2 id="kept-h">Live &amp; maintained</h2>
                <p className="kept-intro">Every site and product I built that is in production today, checked live. The ones marked maintained still get fixes, content and features from me.</p>
                <p className="mono kept-sum" aria-live="polite">
                    {Object.keys(status).length < list.length ? `Probing ${Object.keys(status).length} / ${list.length}…` : `${up} / ${list.length} operational · ${checked.from === "browser" ? "live browser probe" : `${ago(checked.at)} (${checked.from === "sin1" ? "SIN1" : "server"})`}`}
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
                                <span className="mono kept-kind">{w.kind === "client" ? "Client site" : KINDS[w.kind].replace(/s$/, "")}{w.maintained ? " · maintained" : ""}</span>
                                <span className="mono kept-ms">{state === "wait" ? "…" : state === "down" ? "no answer" : `up · ${ms} ms`}</span>
                            </a>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
