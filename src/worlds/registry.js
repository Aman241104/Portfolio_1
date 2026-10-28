// Every finished world: its id (= its route, /<id>), how it shows up on the reels, and its accent.
// Only finished worlds go in here. That is what keeps the machine honest.
export const worlds = [
    {
        id: "desktop",
        name: "Desktop OS",
        tagline: "The one you know. Windows, dock, Finder.",
        symbols: ["2026", "Desktop", "Calm"],
        accent: "#3b82f6",
    },
    {
        id: "editorial",
        name: "Editorial",
        tagline: "Just the work, set like a magazine.",
        symbols: ["Now", "Magazine", "Clean"],
        accent: "#1d4ed8",
    },
    {
        id: "terminal",
        name: "Terminal",
        tagline: "Type your way in.",
        symbols: ["1988", "Terminal", "Nerdy"],
        accent: "#22c55e",
    },
];

export const ALIASES = { classic: "editorial" };
export const RECRUITER_WORLD = "editorial";

export const findWorld = (id) => worlds.find((w) => w.id === (ALIASES[id] ?? id));
export const worldHref = (id) => `/${findWorld(id)?.id ?? RECRUITER_WORLD}`;
