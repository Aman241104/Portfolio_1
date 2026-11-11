import { useEffect } from "react";

// A world's own typefaces load only when that world opens (the home page never pays for them).
export const useFonts = (families) => useEffect(() => {
    const href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = Object.assign(document.createElement("link"), { rel: "stylesheet", href });
    document.head.appendChild(l);
}, [families]);
