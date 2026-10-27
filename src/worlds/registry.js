import { lazy } from "react";

// The only contract a world has: an id, how it shows up on the reels, and a lazy component.
// Only finished worlds go in here. That is what keeps the machine honest.
// Lazy components are created once, here, never during render.
export const worlds = [
    {
        id: "desktop",
        name: "Desktop OS",
        tagline: "The one you know. Windows, dock, Finder.",
        symbols: ["2026", "Desktop", "Calm"],
        accent: "#3b82f6",
        Component: lazy(() => import("./desktop/index.jsx")),
    },
    {
        id: "editorial",
        name: "Editorial",
        tagline: "Just the work, set like a magazine.",
        symbols: ["Now", "Magazine", "Clean"],
        accent: "#1d4ed8",
        Component: lazy(() => import("./editorial/index.jsx")),
    },
    {
        id: "terminal",
        name: "Terminal",
        tagline: "Type your way in.",
        symbols: ["1988", "Terminal", "Nerdy"],
        accent: "#22c55e",
        Component: lazy(() => import("./terminal/index.jsx")),
    },
];

export const ALIASES = { classic: "editorial" };
export const RECRUITER_WORLD = "editorial";

export const findWorld = (id) => worlds.find((w) => w.id === (ALIASES[id] ?? id));
