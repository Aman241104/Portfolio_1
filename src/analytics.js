// PostHog, loaded after the page is idle and only when VITE_POSTHOG_KEY is set (Vercel env). Never in `vite dev`.
// The same events are mirrored to Aman's own Job Search OS (Insights > Portfolio) through a cookie-less beacon:
// a random per-browser id, no IP stored server-side, text/plain body so there's no CORS preflight.
// Product events only (no autocapture, no session recording): what people do with the machine and the footer.
const KEY = import.meta.env.VITE_POSTHOG_KEY;
let ph = null, who = null, world = "home", since = Date.now();
const queue = [];

// Every event is credited to the world it happened in (PLAN_NEXT phase 3 scoring).
// Leaving a world sends `world_left` with seconds spent; bounces (<5 s) and 30 s+ visits are derived from it.
export const setWorld = (id) => {
    const next = id || "home";
    if (next === world) return;
    track("world_left", { seconds: Math.round((Date.now() - since) / 1000) });
    world = next; since = Date.now();
};

// Worlds link to the résumé, mailto and live sites with plain <a>s, so one listener credits them all.
// Home tracks its own links explicitly, so only clicks inside a world are classified here.
const classify = (a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("mailto:")) return ["contact_clicked", { via: "email" }];
    if (href.includes("wa.me/")) return ["contact_clicked", { via: "whatsapp" }];
    if (/resume|\.pdf$/i.test(href)) return ["resume_opened", { from: "world" }];
    if (href.startsWith("/case")) return ["case_study_viewed", { from: "world" }];
    if (/^https?:/.test(href) && a.host !== location.host) return ["live_site_visited", { host: a.host }];
    return null;
};
const onClick = (e) => {
    const a = world !== "home" && e.target.closest?.("a[href]");
    const hit = a && classify(a);
    if (hit) track(...hit);
};

const BEACON = "https://job-search.mind-core.workers.dev/api/portfolio/beacon";
const vid = (() => { try { let v = localStorage.getItem("px01-vid"); if (!v) { v = Math.random().toString(36).slice(2, 12); localStorage.setItem("px01-vid", v); } return v; } catch { return ""; } })();
const beacon = (type, extra) => {
    if (import.meta.env.DEV || navigator.doNotTrack === "1") return;
    try { navigator.sendBeacon?.(BEACON, new Blob([JSON.stringify({ type, vid, path: location.pathname + location.search, ...extra })], { type: "text/plain" })); } catch { /* best effort */ }
};
// PostHog event -> beacon type/target (what Insights > Portfolio ranks).
const mirror = (event, props = {}) => {
    if (event === "resume_opened") beacon("click", { target: "resume" });
    else if (event === "contact_clicked") beacon("click", { target: `contact:${props.via || "?"}` });
    else if (event === "live_site_visited") beacon("click", { target: `live:${props.host || "?"}` });
    else if (event === "case_study_viewed") beacon("project", { target: props.slug || props.project || "case-study" });
    else if (event === "recruiter_mode") beacon("recruiter");
    else if (event === "world_left") beacon("click", { target: `world:${props.world}` });
};

export const initAnalytics = () => {
    if (!import.meta.env.DEV) {
        const t0 = Date.now();
        beacon("view", { ref: document.referrer, device: matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop" });
        addEventListener("pagehide", () => beacon("leave", { ms: Date.now() - t0 }), { once: true });
    }
    if (!KEY || import.meta.env.DEV) return;
    document.addEventListener("click", onClick, true);
    addEventListener("pagehide", () => world !== "home" && track("world_left", { seconds: Math.round((Date.now() - since) / 1000) }));
    const start = () => import("posthog-js").then(({ default: posthog }) => {
        posthog.init(KEY, {
            api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
            person_profiles: "identified_only", autocapture: false, capture_pageview: true,
            disable_session_recording: true, disable_surveys: true, respect_dnt: true,
        });
        ph = posthog;
        if (who) ph.identify(...who);
        queue.splice(0).forEach(([e, p]) => ph.capture(e, p));
    }).catch(() => {});
    (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(start);
};

export const track = (event, props) => {
    if (event === "resume_opened" && typeof window !== "undefined") window.dispatchEvent(new Event("px01:resume"));   // the nudge listens
    props = { world, ...props };
    mirror(event, props);
    if (ph) ph.capture(event, props);
    else if (KEY && queue.length < 50) queue.push([event, props]);
};

// Only ever called with an email the visitor typed into the hiring card themselves.
export const identify = (email, props) => {
    if (ph) ph.identify(email, { email, ...props });
    else who = [email, { email, ...props }];
};
