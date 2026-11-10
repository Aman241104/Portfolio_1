// PostHog, loaded after the page is idle and only when VITE_POSTHOG_KEY is set (Vercel env). Never in `vite dev`.
// Product events only (no autocapture, no session recording): what people do with the machine and the footer.
const KEY = import.meta.env.VITE_POSTHOG_KEY;
let ph = null;
const queue = [];

export const initAnalytics = () => {
    if (!KEY || import.meta.env.DEV) return;
    const start = () => import("posthog-js").then(({ default: posthog }) => {
        posthog.init(KEY, {
            api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
            person_profiles: "identified_only", autocapture: false, capture_pageview: true,
            disable_session_recording: true, respect_dnt: true,
        });
        ph = posthog;
        queue.splice(0).forEach(([e, p]) => ph.capture(e, p));
    }).catch(() => {});
    (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(start);
};

export const track = (event, props) => {
    if (ph) ph.capture(event, props);
    else if (KEY && queue.length < 50) queue.push([event, props]);
};
