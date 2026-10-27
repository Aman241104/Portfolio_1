// Aman's taste, shared by every portfolio world (see docs/PORTFOLIO_EXE_PLAN.md §2.1).
// Music pulled from BitChord (YouTube Music client) history + a 300-track sample of 4,709 liked songs, 2026-10-27.
// Visuals pulled from pinterest.com/patelaman0241 boards (portfolio, web, into-font-style, prompt, helmet-wrap, wallpaper).

// `id` is the YouTube video id: playable through youtube-nocookie embeds and music.youtube.com links.
export const onRepeat = [
    { id: "7YkWRP1zn2E", title: "Virginia Beach", artist: "Drake", note: "most-played right now" },
    { id: "hqvcww4ydh8", title: "Can't Tell Me Nothing", artist: "Kanye West" },
    { id: "eaW_G4ytXrY", title: "Man On The Moon", artist: "Kid Cudi" },
    { id: "ZeKuGrD2fl8", title: "Fire Squad", artist: "J. Cole" },
    { id: "NPqDIwWMtxg", title: "euphoria", artist: "Kendrick Lamar" },
    { id: "YY2ng9SjCTo", title: "Often", artist: "The Weeknd" },
    { id: "Re-rt1a5bKg", title: "Survival Tactics", artist: "Joey Bada$$" },
    { id: "tN2Xwis-Qao", title: "It Ain't Hard to Tell", artist: "Nas" },
    { id: "cYKAr38pZcY", title: "Photosynthesis", artist: "Saba" },
    { id: "r6_KV5gZNHI", title: "Smile", artist: "Juice WRLD" },
    { id: "VI3av8rzXY8", title: "HOME", artist: "Jokhay" },
    { id: "Q29iibXXiOs", title: "In Limbo", artist: "Radiohead" },
];

// Ordered by how often they show up in likes + history.
export const topArtists = [
    "Drake", "Kanye West", "Kid Cudi", "J. Cole", "The Weeknd", "Kendrick Lamar", "Travis Scott",
    "Juice WRLD", "Joey Bada$$", "Nas", "Logic", "Saba", "Don Toliver", "Westside Gunn",
    "Tyler, The Creator", "Vince Staples", "Brent Faiyaz", "Jokhay", "Raftaar", "KING",
];

// Outside rap, but always there.
export const alsoListening = ["Radiohead", "Pink Floyd", "Beach House", "Daniel Caesar", "Joji"];

// Sitcoms + shows pulled from the Nuvio library / watch progress, 2026-10-27.
export const watching = {
    films: ["One Battle After Another", "Akira"],
    anime: [],
    sitcoms: [
        "Friends", "Community", "30 Rock", "Curb Your Enthusiasm", "Malcolm in the Middle",
        "It's Always Sunny in Philadelphia", "black-ish", "BoJack Horseman", "South Park",
    ],
    shows: ["Mirzapur", "The Rookie", "Cobra Kai", "Running Point"],
};

export const playing = [];

export const riding = ["Bikes", "Racing", "Custom helmet wraps"];

// Recurring visual DNA from Pinterest, used as art direction for the worlds.
export const visualDna = {
    palettes: ["black + red (Spider-Verse, helmet flames)", "Klein blue + white", "black + acid green", "black + gold filigree"],
    type: ["oversized editorial grotesk", "liquid chrome lettering", "Devanagari display type", "retro serif", "grunge streetwear posters"],
    materials: ["chrome", "inflated / puffy 3D", "fur", "leather patch", "embroidery", "liquid glass"],
    motifs: ["Spider-Man / Miles Morales", "matte black helmets", "3D character portraits", "pixel / wireframe type"],
};
