// POCKET's art, all original and drawn in code: a four-shade LCD palette, 16 px tiles, the player, and a creature
// generator that grows a unique symmetric pixel creature from each project's slug (same project → same creature).
export const SHADES = ["#13261a", "#3d6142", "#88a86c", "#dbe7b8"];   // 0 darkest … 3 lightest (a warm olive LCD, not any console's)
export const T = 16;

const px = (g, c, x, y, w = 1, h = 1) => { g.fillStyle = SHADES[c]; g.fillRect(x, y, w, h); };
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

// ---- tiles (drawn at their top-left x,y in screen pixels) ----
export function grass(g, x, y, tx, ty) {
    px(g, 3, x, y, T, T);
    const h = hash(tx, ty);
    for (let i = 0; i < 3; i++) { const a = (h >> (i * 5)) & 15, b = (h >> (i * 5 + 3)) & 15; px(g, 2, x + a, y + b, 1, 2); px(g, 2, x + a + 1, y + b + 1); }
}
export function tall(g, x, y, t, rustle) {
    px(g, 2, x, y, T, T);
    const sway = rustle ? (Math.floor(t / 90) % 2 ? 1 : -1) : 0;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
        const bx = x + c * 4 + (r ? 2 : 0) + (r ? sway : 0), by = y + r * 8 + 2;
        px(g, 1, bx, by + 2, 1, 4); px(g, 1, bx + 1, by, 1, 5); px(g, 1, bx + 2, by + 3, 1, 3);
    }
    px(g, 1, x, y + 15, T, 1);
}
export function path(g, x, y, tx, ty) {
    px(g, 3, x, y, T, T);
    const h = hash(tx + 7, ty + 3);
    for (let i = 0; i < 4; i++) px(g, 2, x + ((h >> (i * 4)) & 15), y + ((h >> (i * 4 + 2)) & 15));
}
export function water(g, x, y, t) {
    px(g, 1, x, y, T, T);
    const o = Math.floor(t / 260) % 8;
    for (let r = 0; r < 3; r++) { const yy = y + 3 + r * 5; px(g, 2, x + ((o + r * 3) % 8), yy, 4, 1); px(g, 2, x + ((o + r * 3 + 8) % 16), yy + 1, 3, 1); }
}
export function bank(g, x, y) { px(g, 3, x, y, T, T); px(g, 2, x, y + 12, T, 4); px(g, 0, x, y + 15, T, 1); for (let i = 0; i < 16; i += 4) px(g, 1, x + i, y + 12, 2, 1); }
export function tree(g, x, y) {
    px(g, 3, x, y, T, T);
    px(g, 0, x + 3, y + 1, 10, 1); px(g, 0, x + 1, y + 3, 1, 7); px(g, 0, x + 14, y + 3, 1, 7); px(g, 0, x + 3, y + 11, 10, 1);
    px(g, 0, x + 2, y + 2, 1, 1); px(g, 0, x + 13, y + 2, 1, 1); px(g, 0, x + 2, y + 10, 1, 1); px(g, 0, x + 13, y + 10, 1, 1);
    px(g, 1, x + 2, y + 3, 12, 7); px(g, 1, x + 3, y + 2, 10, 9); px(g, 2, x + 4, y + 3, 4, 2); px(g, 2, x + 9, y + 6, 2, 2);
    px(g, 0, x + 7, y + 12, 2, 3); px(g, 2, x + 4, y + 15, 8, 1);
}
export function flowers(g, x, y, tx, ty) { grass(g, x, y, tx, ty); for (const [a, b] of [[3, 4], [10, 9], [6, 12]]) { px(g, 1, x + a, y + b, 3, 1); px(g, 1, x + a + 1, y + b - 1, 1, 3); px(g, 3, x + a + 1, y + b); } }
export function fence(g, x, y) { px(g, 3, x, y, T, T); px(g, 1, x, y + 5, T, 2); px(g, 1, x, y + 10, T, 2); for (const a of [1, 7, 13]) { px(g, 0, x + a, y + 3, 2, 11); } }
export function sign(g, x, y, tx, ty) { grass(g, x, y, tx, ty); px(g, 0, x + 2, y + 2, 12, 8); px(g, 3, x + 3, y + 3, 10, 6); px(g, 1, x + 4, y + 4, 8, 1); px(g, 1, x + 4, y + 6, 6, 1); px(g, 0, x + 7, y + 10, 2, 5); }

// buildings are 3×2 tiles, drawn from their top-left anchor; `label` is a tiny mark on the facade
export function building(g, x, y, kind) {
    const W = T * 3, H = T * 2;
    px(g, 3, x, y, W, H);
    if (kind === "gate") {                                       // an old-city pol gate: carved arch, wooden doors
        px(g, 0, x, y, W, H); px(g, 2, x + 2, y + 2, W - 4, 6); for (let i = 4; i < W - 4; i += 6) px(g, 1, x + i, y + 3, 3, 4);
        px(g, 1, x + 2, y + 9, W - 4, H - 9); px(g, 0, x + 14, y + 12, 20, H - 12); px(g, 3, x + 16, y + 14, 16, H - 14);
        px(g, 2, x + 23, y + 14, 2, H - 14); px(g, 0, x + 18, y + 22, 2, 2); px(g, 0, x + 28, y + 22, 2, 2);
        return;
    }
    const roof = kind === "gym" ? 0 : 1;
    px(g, roof, x, y, W, 12); for (let i = 0; i < W; i += 4) px(g, roof ? 0 : 1, x + i, y + 10, 2, 2);
    px(g, 0, x, y + 12, W, 1); px(g, 3, x + 1, y + 13, W - 2, H - 13); px(g, 0, x, y + 12, 1, H - 12); px(g, 0, x + W - 1, y + 12, 1, H - 12);
    px(g, 0, x + 20, y + 20, 8, 12); px(g, 2, x + 21, y + 21, 6, 11);                                    // door
    px(g, 0, x + 5, y + 17, 9, 7); px(g, 2, x + 6, y + 18, 7, 5); px(g, 0, x + 34, y + 17, 9, 7); px(g, 2, x + 35, y + 18, 7, 5);
    if (kind === "gym") { px(g, 3, x + 16, y + 3, 16, 5); px(g, 0, x + 18, y + 4, 2, 3); px(g, 0, x + 23, y + 4, 2, 3); px(g, 0, x + 28, y + 4, 2, 3); }
    if (kind === "school") { px(g, 3, x + 20, y + 2, 8, 7); px(g, 0, x + 23, y + 3, 2, 5); px(g, 0, x + 21, y + 5, 6, 1); }
    if (kind === "stall") { for (let i = 0; i < W; i += 8) px(g, 3, x + i, y, 4, 12); px(g, 1, x + 2, y + 24, W - 4, 3); px(g, 0, x + 8, y + 19, 4, 5); px(g, 0, x + 36, y + 19, 4, 5); }
    if (kind === "home") { px(g, 3, x + 21, y + 4, 6, 4); px(g, 0, x + 23, y + 5, 2, 2); }
}

// ---- the player: 16×16, four directions, two walking frames ----
export function player(g, x, y, dir, step) {
    const f = step % 2;
    px(g, 0, x + 4, y + 1, 8, 1); px(g, 0, x + 3, y + 2, 10, 4);                                // hair
    px(g, 3, x + 4, y + 4, 8, 4); px(g, 0, x + 3, y + 4, 1, 4); px(g, 0, x + 12, y + 4, 1, 4); // face
    if (dir === "down") { px(g, 0, x + 6, y + 5, 1, 2); px(g, 0, x + 9, y + 5, 1, 2); }
    if (dir === "left") { px(g, 0, x + 5, y + 5, 1, 2); px(g, 0, x + 9, y + 3, 4, 3); }
    if (dir === "right") { px(g, 0, x + 10, y + 5, 1, 2); px(g, 0, x + 3, y + 3, 4, 3); }
    if (dir === "up") px(g, 0, x + 3, y + 4, 10, 3);
    px(g, 0, x + 3, y + 8, 10, 1); px(g, 1, x + 3, y + 9, 10, 4); px(g, 2, x + 7, y + 9, 2, 4);    // shirt + strap
    px(g, 0, x + 2, y + 9, 1, 4); px(g, 0, x + 13, y + 9, 1, 4);
    if (dir === "up" || dir === "down") px(g, 0, x + 4, y + 10, 2, 3);                          // backpack strap
    px(g, 0, x + 4, y + 13, 3, f ? 2 : 3); px(g, 0, x + 9, y + 13, 3, f ? 3 : 2);              // legs
}

// ---- creatures: a seeded, mirrored 12×12 half-grid grown into a 24×24 sprite with an outline and eyes ----
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const seedOf = (s) => [...s].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7);
export function creatureMask(slug) {
    const r = rng(seedOf(slug)), N = 12, m = Array.from({ length: 24 }, () => Array(24).fill(0));
    for (let y = 2; y < 22; y++) for (let x = 2; x < N; x++) {
        const cx = (x - N) / N, cy = (y - 12) / 11, body = 1 - (cx * cx * 1.6 + cy * cy);   // denser near the centre
        if (r() < body * 1.25) { const shade = r() < 0.25 ? 2 : 1; m[y][x] = shade; m[y][23 - x] = shade; }
    }
    for (let y = 1; y < 23; y++) for (let x = 1; x < 23; x++)                                          // outline
        if (!m[y][x] && (m[y - 1][x] > 0 || m[y + 1][x] > 0 || m[y][x - 1] > 0 || m[y][x + 1] > 0)) m[y][x] = -1;
    const ey = 7 + Math.floor(r() * 5);                                                              // eyes, on the body
    for (const ex of [8, 15]) if (m[ey][ex] > 0) { m[ey][ex] = 3; m[ey + 1][ex] = 3; }
    return m;
}
export function creature(g, x, y, slug, scale = 1, silhouette = false) {
    const m = creatureMask(slug);
    for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
        const v = m[j][i];
        if (!v) continue;
        px(g, silhouette ? 0 : v === -1 ? 0 : v, x + i * scale, y + j * scale, scale, scale);
    }
}
