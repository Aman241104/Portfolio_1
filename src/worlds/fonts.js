import { useEffect } from "react";

// A world's own typefaces load only when that world opens (the home page never pays for them).
// Until they arrive (capped at 600 ms) arrival animations hold on their first frame, so the choreography plays in
// the real face instead of reflowing mid-entrance when the fallback swaps out.
export const useFonts = (families) => useEffect(() => {
    const html = document.documentElement;
    const href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) return;
    html.dataset.fontsWait = "";
    const done = () => { delete html.dataset.fontsWait; };
    const cap = setTimeout(done, 600);
    const l = Object.assign(document.createElement("link"), { rel: "stylesheet", href });
    l.onload = () => Promise.all(families.map((f) => document.fonts.load(`16px "${f.split(":")[0].replace(/\+/g, " ")}"`)))
        .catch(() => {}).then(done);
    l.onerror = done;
    document.head.appendChild(l);
    return () => { clearTimeout(cap); done(); };
}, [families]);
