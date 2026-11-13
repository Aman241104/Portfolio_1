// POCKET COLOR art: full-color 16-bit handheld pixel art, 16px tiles, animated water/tall grass,
// 4-direction trainer sprite, and a multi-color procedural creature generator seeded by project slug.
export const SHADES = ["#161822", "#3a4466", "#7a9e68", "#f4f6e8"]; // crisp high-contrast UI inks & paper
export const T = 16;

const px = (g, c, x, y, w = 1, h = 1) => {
    g.fillStyle = typeof c === "number" ? SHADES[c] : c;
    g.fillRect(x, y, w, h);
};
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

// ---- full-color overworld tiles ----
export function grass(g, x, y, tx, ty) {
    px(g, "#58b848", x, y, T, T);
    const h = hash(tx, ty);
    for (let i = 0; i < 4; i++) {
        const a = (h >> (i * 4)) & 14;
        const b = (h >> (i * 4 + 3)) & 14;
        px(g, i % 2 ? "#74d45c" : "#449c36", x + a, y + b, 2, 1);
        px(g, "#449c36", x + a, y + b + 1, 1, 1);
    }
}

export function tall(g, x, y, t, rustle) {
    px(g, "#3e8e34", x, y, T, T);
    const sway = rustle ? (Math.floor(t / 90) % 2 ? 1 : -1) : (Math.floor(t / 650 + x) % 2 ? 0 : 0);
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
            const bx = x + c * 4 + (r ? 2 : 0) + (r ? sway : 0);
            const by = y + r * 8 + 1;
            px(g, "#1d5c24", bx, by + 2, 1, 5);
            px(g, "#76e058", bx + 1, by, 1, 6);
            px(g, "#2a762c", bx + 2, by + 3, 1, 4);
        }
    }
    px(g, "#1d5c24", x, y + 15, T, 1);
}

export function path(g, x, y, tx, ty) {
    px(g, "#e8cfa0", x, y, T, T);
    const h = hash(tx + 7, ty + 3);
    for (let i = 0; i < 5; i++) {
        const sx = x + ((h >> (i * 4)) & 14);
        const sy = y + ((h >> (i * 4 + 2)) & 14);
        px(g, i % 2 ? "#d4b078" : "#f4e0b8", sx, sy, 2, 1);
    }
}

export function water(g, x, y, t) {
    px(g, "#2674c4", x, y, T, T);
    const o = Math.floor(t / 240) % 16;
    for (let r = 0; r < 3; r++) {
        const yy = y + 3 + r * 5;
        px(g, "#449ef2", x + ((o + r * 5) % 12), yy, 4, 1);
        px(g, "#9ce4ff", x + ((o + r * 5 + 7) % 13), yy + 1, 2, 1);
    }
}

export function bank(g, x, y) {
    px(g, "#e8cfa0", x, y, T, T);
    px(g, "#c49c64", x, y + 12, T, 4);
    px(g, "#7c542c", x, y + 15, T, 1);
}

export function tree(g, x, y) {
    px(g, "#58b848", x, y, T, T);
    // shadow & trunk
    px(g, "#2e6828", x + 3, y + 13, 10, 3);
    px(g, "#7a4a24", x + 6, y + 10, 4, 5);
    px(g, "#522e14", x + 9, y + 10, 1, 5);
    // lush canopy
    px(g, "#184c22", x + 3, y + 1, 10, 1);
    px(g, "#184c22", x + 1, y + 3, 14, 8);
    px(g, "#184c22", x + 3, y + 10, 10, 2);
    px(g, "#2e8a38", x + 2, y + 3, 12, 7);
    px(g, "#2e8a38", x + 4, y + 2, 8, 8);
    px(g, "#56c44e", x + 4, y + 3, 5, 3);
    px(g, "#7ae868", x + 5, y + 3, 2, 2);
    px(g, "#56c44e", x + 9, y + 6, 3, 2);
}

export function flowers(g, x, y, tx, ty) {
    grass(g, x, y, tx, ty);
    const cols = ["#ff4d6d", "#ffd43b", "#4dabf7"];
    [[3, 4], [10, 8], [6, 12]].forEach(([a, b], i) => {
        const c = cols[(tx + ty + i) % cols.length];
        px(g, c, x + a, y + b, 3, 1);
        px(g, c, x + a + 1, y + b - 1, 1, 3);
        px(g, "#fff9db", x + a + 1, y + b, 1, 1);
    });
}

export function fence(g, x, y) {
    px(g, "#58b848", x, y, T, T);
    px(g, "#c89658", x, y + 5, T, 2);
    px(g, "#c89658", x, y + 10, T, 2);
    for (const a of [1, 7, 13]) {
        px(g, "#8c5c2c", x + a, y + 3, 2, 11);
        px(g, "#e4b87a", x + a, y + 3, 1, 10);
    }
}

export function sign(g, x, y, tx, ty) {
    grass(g, x, y, tx, ty);
    px(g, "#6e421c", x + 7, y + 10, 2, 5);
    px(g, "#6e421c", x + 2, y + 2, 12, 8);
    px(g, "#e6b87a", x + 3, y + 3, 10, 6);
    px(g, "#8c5424", x + 4, y + 4, 8, 1);
    px(g, "#8c5424", x + 4, y + 6, 6, 1);
}

// 3×2 buildings in full color
export function building(g, x, y, kind) {
    const W = T * 3, H = T * 2;
    if (kind === "gate") {
        px(g, "#c8945c", x, y, W, H);
        px(g, "#f0c88c", x + 2, y + 2, W - 4, 6);
        for (let i = 4; i < W - 4; i += 6) px(g, "#946232", x + i, y + 3, 3, 4);
        px(g, "#a87444", x + 2, y + 9, W - 4, H - 9);
        px(g, "#4c2c16", x + 14, y + 12, 20, H - 12);
        px(g, "#7c4824", x + 16, y + 14, 16, H - 14);
        px(g, "#3c2010", x + 23, y + 14, 2, H - 14);
        px(g, "#ffd43b", x + 18, y + 22, 2, 2);
        px(g, "#ffd43b", x + 28, y + 22, 2, 2);
        return;
    }

    const roofs = { gym: ["#2b59c3", "#1d3d8a"], school: ["#b84a39", "#8c3022"], stall: ["#d93829", "#fff2d6"], home: ["#d9534f", "#a83632"] };
    const [r1, r2] = roofs[kind] || ["#c9513c", "#963424"];

    // Roof
    px(g, r1, x, y, W, 12);
    if (kind === "stall") {
        for (let i = 0; i < W; i += 8) px(g, r2, x + i, y, 4, 12);
    } else {
        for (let i = 0; i < W; i += 4) px(g, r2, x + i, y + 10, 2, 2);
    }
    px(g, "#2a201c", x, y + 12, W, 1);

    // Cream / Sandstone walls
    px(g, "#f5ead6", x + 1, y + 13, W - 2, H - 13);
    px(g, "#d8c6a8", x + 1, y + H - 2, W - 2, 2);
    px(g, "#4a382c", x, y + 12, 1, H - 12);
    px(g, "#4a382c", x + W - 1, y + 12, 1, H - 12);

    // Door
    px(g, "#54321c", x + 20, y + 20, 8, 12);
    px(g, "#8c5832", x + 21, y + 21, 6, 11);
    px(g, "#ffd43b", x + 25, y + 26, 1, 1);

    // Windows
    px(g, "#38485c", x + 5, y + 17, 9, 7);
    px(g, kind === "home" ? "#74c0fc" : "#a5d8ff", x + 6, y + 18, 7, 5);
    px(g, "#38485c", x + 34, y + 17, 9, 7);
    px(g, "#a5d8ff", x + 35, y + 18, 7, 5);

    if (kind === "gym") {
        px(g, "#ffd43b", x + 16, y + 3, 16, 5);
        px(g, "#1d3d8a", x + 18, y + 4, 2, 3);
        px(g, "#1d3d8a", x + 23, y + 4, 2, 3);
        px(g, "#1d3d8a", x + 28, y + 4, 2, 3);
    }
    if (kind === "school") {
        px(g, "#fff9db", x + 20, y + 2, 8, 7);
        px(g, "#2b59c3", x + 23, y + 3, 2, 5);
        px(g, "#2b59c3", x + 21, y + 5, 6, 1);
    }
    if (kind === "stall") {
        px(g, "#8c5832", x + 2, y + 24, W - 4, 3);
        px(g, "#d97706", x + 8, y + 19, 4, 5);
        px(g, "#d97706", x + 36, y + 19, 4, 5);
    }
    if (kind === "home") {
        px(g, "#fff9db", x + 21, y + 4, 6, 4);
        px(g, "#e03131", x + 23, y + 5, 2, 2);
    }
}

// ---- full-color trainer sprite (16×16) ----
export function player(g, x, y, dir, step) {
    const f = step % 2;
    // soft ground shadow
    px(g, "rgba(0,0,0,0.22)", x + 4, y + 14, 8, 2);
    // hair / cap
    px(g, "#1e202c", x + 4, y + 1, 8, 1);
    px(g, "#1e202c", x + 3, y + 2, 10, 4);
    px(g, "#e03131", x + 4, y + 2, 8, 2); // crimson cap band
    // face
    px(g, "#f4c094", x + 4, y + 4, 8, 4);
    px(g, "#1e202c", x + 3, y + 4, 1, 4);
    px(g, "#1e202c", x + 12, y + 4, 1, 4);
    if (dir === "down") { px(g, "#1e202c", x + 6, y + 5, 1, 2); px(g, "#1e202c", x + 9, y + 5, 1, 2); }
    if (dir === "left") { px(g, "#1e202c", x + 5, y + 5, 1, 2); px(g, "#1e202c", x + 9, y + 3, 4, 3); }
    if (dir === "right") { px(g, "#1e202c", x + 10, y + 5, 1, 2); px(g, "#1e202c", x + 3, y + 3, 4, 3); }
    if (dir === "up") px(g, "#1e202c", x + 3, y + 4, 10, 3);
    // jacket + backpack
    px(g, "#1e202c", x + 3, y + 8, 10, 1);
    px(g, "#d63031", x + 3, y + 9, 10, 4);
    px(g, "#f5f6fa", x + 7, y + 9, 2, 4);
    px(g, "#f4c094", x + 2, y + 9, 1, 4);
    px(g, "#f4c094", x + 13, y + 9, 1, 4);
    if (dir === "up" || dir === "down") px(g, "#2d3436", x + 4, y + 10, 2, 3);
    // jeans & shoes
    px(g, "#2e5c9a", x + 4, y + 13, 3, f ? 2 : 3);
    px(g, "#2e5c9a", x + 9, y + 13, 3, f ? 3 : 2);
}

// ---- multi-color procedural creatures ----
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const seedOf = (s) => [...s].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7);

const CREATURE_PAL = {
    product: ["#e8590c", "#ffd43b", "#fff3bf"],
    mobile: ["#1c7ed6", "#4dabf7", "#d0ebff"],
    client: ["#2b8a3e", "#69db7c", "#d3f9d8"],
    concept: ["#7048e8", "#b197fc", "#f3d9fa"],
};

export function creatureMask(slug) {
    const r = rng(seedOf(slug)), N = 12, m = Array.from({ length: 24 }, () => Array(24).fill(0));
    for (let y = 2; y < 22; y++) for (let x = 2; x < N; x++) {
        const cx = (x - N) / N, cy = (y - 12) / 11, body = 1 - (cx * cx * 1.6 + cy * cy);
        if (r() < body * 1.25) { const shade = r() < 0.28 ? 2 : 1; m[y][x] = shade; m[y][23 - x] = shade; }
    }
    for (let y = 1; y < 23; y++) for (let x = 1; x < 23; x++)
        if (!m[y][x] && (m[y - 1][x] > 0 || m[y + 1][x] > 0 || m[y][x - 1] > 0 || m[y][x + 1] > 0)) m[y][x] = -1;
    const ey = 7 + Math.floor(r() * 5);
    for (const ex of [8, 15]) if (m[ey][ex] > 0) { m[ey][ex] = 3; m[ey + 1][ex] = 3; }
    return m;
}

export function creature(g, x, y, slug, scale = 1, silhouette = false, kind = "concept") {
    const m = creatureMask(slug);
    const pal = CREATURE_PAL[kind] || CREATURE_PAL.concept;
    for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
        const v = m[j][i];
        if (!v) continue;
        const c = silhouette ? "#212529" : v === -1 ? "#161822" : v === 3 ? "#fff9db" : pal[v - 1];
        px(g, c, x + i * scale, y + j * scale, scale, scale);
    }
}
