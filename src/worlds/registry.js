import { lazy } from "react";

// The only contract a world has: an id, how it shows up on the reels, and a lazy component.
// Only finished worlds go in here. That is what keeps the machine honest.
// Lazy components are created once, here, never during render. `load()` preloads a world's chunk.
export const worlds = [
    {
        id: "desktop",
        name: "Desktop OS",
        tagline: "The one you know. Windows, dock, Finder.",
        symbols: ["2026", "Desktop", "Calm"],
        accent: "#3b82f6",
        load: () => import("./desktop/index.jsx"),
    },
    {
        id: "editorial",
        name: "Editorial",
        tagline: "Just the work, set like a magazine.",
        symbols: ["Now", "Magazine", "Clean"],
        accent: "#1d4ed8",
        load: () => import("./editorial/index.jsx"),
    },
    {
        id: "terminal",
        name: "Terminal",
        tagline: "Type your way in.",
        symbols: ["1988", "Terminal", "Nerdy"],
        accent: "#22c55e",
        load: () => import("./terminal/index.jsx"),
    },
    {
        id: "album",
        name: "Album Rollout",
        tagline: "The portfolio, deluxe. Projects as a tracklist.",
        symbols: ["Y2K", "Album", "Loud"],
        accent: "#c8ff2e",
        load: () => import("./album/index.jsx"),
    },
    {
        id: "mission",
        name: "Mission Control",
        tagline: "Live data: uptime, commits, the stack in numbers.",
        symbols: ["Live", "Dashboard", "Exact"],
        accent: "#3ddc84",
        load: () => import("./mission/index.jsx"),
    },
    {
        id: "ask",
        name: "Ask Aman",
        tagline: "Ask anything. Answers cite the real work.",
        symbols: ["2030", "Chat", "Curious"],
        accent: "#ff8a5c",
        load: () => import("./ask/index.jsx"),
    },
    {
        id: "canvas",
        name: "Canvas",
        tagline: "The portfolio as a design file. Pan, zoom, click.",
        symbols: ["Draft", "Canvas", "Free"],
        accent: "#0d99ff",
        load: () => import("./canvas/index.jsx"),
    },
    {
        id: "arcade",
        name: "Arcade",
        tagline: "Break bricks, unlock projects.",
        symbols: ["8-Bit", "Arcade", "Wild"],
        accent: "#ff3df2",
        load: () => import("./arcade/index.jsx"),
    },
];

// One lazy component per world, from the same loader, so preloading on lever pull warms the chunk it will render.
worlds.forEach((w) => { w.Component = lazy(w.load); });

export const ALIASES = { classic: "editorial" };
export const RECRUITER_WORLD = "editorial";

export const findWorld = (id) => worlds.find((w) => w.id === (ALIASES[id] ?? id));
