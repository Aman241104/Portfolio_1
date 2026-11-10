import { useEffect, useRef, useState } from "react";
import { work, KINDS } from "#content/work.js";

// Production sites and products I built and still look after. The status column is a real check, run from the
// visitor's browser when the section scrolls into view (no-cors fetch: reachable or not, plus round-trip time).
const host = (u) => u.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^www\./, "");
const ping = async (url) => {
    const t = performance.now();
    try {
        await Promise.race([fetch(url, { mode: "no-cors", cache: "no-store" }), new Promise((_, no) => setTimeout(no, 8000))]);
        return Math.round(performance.now() - t);
    } catch { return -1; }
};

export default function Maintained() {
    const list = work.filter((w) => w.maintained);
    const [status, setStatus] = useState({});
    const ref = useRef(null);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            list.forEach((w) => ping(w.url).then((ms) => setStatus((s) => ({ ...s, [w.slug]: ms }))));
        }, { rootMargin: "200px" });
        io.observe(ref.current);
        return () => io.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const up = Object.values(status).filter((ms) => ms >= 0).length;

    return (
        <section ref={ref} className="kept" aria-labelledby="kept-h">
            <div className="work-head">
                <h2 id="kept-h">Live &amp; maintained</h2>
                <p className="mono kept-sum" aria-live="polite">
                    {Object.keys(status).length < list.length ? "Checking from your browser…" : `${up} of ${list.length} up · checked from your browser just now`}
                </p>
            </div>
            <p className="kept-intro">Sites and products I built that are in production today. I still ship fixes, content and features on them.</p>
            <ol className="kept-list">
                {list.map((w) => {
                    const ms = status[w.slug];
                    const state = ms === undefined ? "wait" : ms < 0 ? "down" : "up";
                    return (
                        <li key={w.slug}>
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
