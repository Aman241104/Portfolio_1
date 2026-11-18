import { useEffect, useRef } from "react";
import { work } from "#content/work.js";

// Project deep links: ?style=<world>&p=<slug> opens a world straight onto one project, and opening a project in a
// world writes ?p= back so the address bar is always a shareable link. App drops ?p= when the world changes.
export const linkedProject = () => {
    const slug = new URLSearchParams(location.search).get("p");
    return slug ? work.find((w) => w.slug === slug) ?? null : null;
};

export const shareProject = (slug) => {
    const url = new URL(location.href);
    if (slug) url.searchParams.set("p", slug); else url.searchParams.delete("p");
    if (url.href !== location.href) history.replaceState(history.state, "", url);
};

// write ?p= only when the open project actually changes (never for the initial value, so an incoming ?p= survives
// until the world reads it; comparing values also holds under StrictMode's double-run effects)
export function useShareProject(slug = null) {
    const prev = useRef(slug);
    useEffect(() => { if (prev.current === slug) return; prev.current = slug; shareProject(slug); }, [slug]);
}
