import { lazy } from "react";

// The only contract a world has: an id, how it shows up on the reels, and a lazy component.
// Only finished worlds go in here. That is what keeps the machine honest.
// Lazy components are created once, here, never during render. `load()` preloads a world's chunk.
export const worlds = [
    {
        id: "desktop",
        paper: "#0b0b0b",   // the world's own background: the enter transition wipes in this colour
        name: "Desktop OS",
        tagline: "The one you know. Windows, dock, Finder.",
        symbols: ["2026", "Desktop", "Calm"],
        accent: "#3b82f6",
        load: () => import("./desktop/index.jsx"),
    },
    {
        id: "editorial",
        paper: "#f2f0ea",   // the world's own background: the enter transition wipes in this colour
        name: "Editorial",
        tagline: "Just the work, set like a magazine.",
        symbols: ["Now", "Magazine", "Clean"],
        accent: "#1d4ed8",
        load: () => import("./editorial/index.jsx"),
    },
    {
        id: "terminal",
        paper: "#120c02",   // the world's own background: the enter transition wipes in this colour
        name: "Terminal",
        tagline: "Type your way in.",
        symbols: ["1988", "Terminal", "Nerdy"],
        accent: "#22c55e",
        load: () => import("./terminal/index.jsx"),
    },
    {
        id: "album",
        paper: "#070707",   // the world's own background: the enter transition wipes in this colour
        name: "Album Rollout",
        tagline: "The portfolio, deluxe. Projects as a tracklist.",
        symbols: ["Y2K", "Album", "Loud"],
        accent: "#c8ff2e",
        load: () => import("./album/index.jsx"),
    },
    {
        id: "mission",
        paper: "#0c0c0b",   // the world's own background: the enter transition wipes in this colour
        name: "Mission Control",
        tagline: "Live data: uptime, commits, the stack in numbers.",
        symbols: ["Live", "Dashboard", "Exact"],
        accent: "#3ddc84",
        load: () => import("./mission/index.jsx"),
    },
    {
        id: "ask",
        paper: "#3f4c3e",   // the world's own background: the enter transition wipes in this colour
        name: "Ask Aman",
        tagline: "Ask anything. Answers cite the real work.",
        symbols: ["2030", "Chat", "Curious"],
        accent: "#ff8a5c",
        load: () => import("./ask/index.jsx"),
    },
    {
        id: "canvas",
        paper: "#123f6e",   // the world's own background: the enter transition wipes in this colour
        name: "Canvas",
        tagline: "The portfolio as a design file. Pan, zoom, click.",
        symbols: ["Draft", "Canvas", "Free"],
        accent: "#0d99ff",
        load: () => import("./canvas/index.jsx"),
    },
    {
        id: "arcade",
        beta: true,   // out of the machine's pool (Aman, 2026-11-11): reachable from All worlds and ?style=arcade only
        paper: "#1b1b1b",   // the world's own background: the enter transition wipes in this colour
        name: "Arcade",
        tagline: "Break bricks, unlock projects.",
        symbols: ["8-Bit", "Arcade", "Wild"],
        accent: "#ff3df2",
        load: () => import("./arcade/index.jsx"),
    },
    {
        id: "y2001",
        paper: "#000033",   // the world's own background: the enter transition wipes in this colour
        beta: true,   // new (2026-11-12): out of the machine's pool until the reviewers pass it
        name: "2001 Homepage",
        tagline: "Under construction since 2001. Sign the guestbook.",
        symbols: ["2001", "Homepage", "Sincere"],
        accent: "#ffff00",
        load: () => import("./y2001/index.jsx"),
    },
    {
        id: "longhorn",
        paper: "#021626",   // the world's own background: the enter transition wipes in this colour
        beta: true,   // new (2026-11-12): out of the machine's pool until the reviewers pass it
        name: "Longhorn",
        tagline: "A glossy 2000s desktop. Flip through the projects in 3D.",
        symbols: ["2006", "Aero", "Glossy"],
        accent: "#3fa9f5",
        load: () => import("./longhorn/index.jsx"),
    },
    {
        id: "pocket",
        paper: "#1d2620",   // the world's own background: the enter transition wipes in this colour
        beta: true,   // new (2026-11-12): out of the machine's pool until the reviewers pass it
        name: "Pocket",
        tagline: "A pixel town where projects live in the tall grass.",
        symbols: ["1998", "Pocket", "Pixel"],
        accent: "#88a86c",
        load: () => import("./pocket/index.jsx"),
    },
];

// One lazy component per world, from the same loader, so preloading on lever pull warms the chunk it will render.
worlds.forEach((w) => { w.Component = lazy(w.load); });

export const ALIASES = { classic: "editorial" };
export const RECRUITER_WORLD = "editorial";

export const findWorld = (id) => worlds.find((w) => w.id === (ALIASES[id] ?? id));
