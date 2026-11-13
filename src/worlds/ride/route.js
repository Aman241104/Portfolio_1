// RIDE's route: a two-lane highway out of Ahmedabad at golden hour. Distance `d` is metres along the road; the
// centreline is a gentle double sine so the road keeps leaning without ever doubling back. Everything (stops,
// signboards, milestones, scenery) is placed deterministically from this, so every visit rides the same road.
import { work, KINDS, status } from "../../../content/work.js";

export const ROAD_W = 7.4, LANE_X = -1.8;                   // India keeps left: the bike rides the left lane
export const FIRST = 150, GAP = 74;
export const STOPS = work.map((w, i) => ({ i, w, d: FIRST + i * GAP, title: w.title, kind: KINDS[w.kind], status: status(w) }));
export const END = FIRST + work.length * GAP + 60;          // the last stop: "your team, next exit"
export const LENGTH = END + 260;

const A1 = 34, F1 = 0.0034, A2 = 11, F2 = 0.0107;
export const xAt = (d) => A1 * Math.sin(d * F1) + A2 * Math.sin(d * F2 + 1.3);
const dxAt = (d) => A1 * F1 * Math.cos(d * F1) + A2 * F2 * Math.cos(d * F2 + 1.3);
// position on the centreline, the unit forward tangent and the unit right normal (road runs toward -Z)
export function frame(d, out = {}) {
    const x = xAt(d), dx = dxAt(d), n = Math.hypot(dx, 1);
    out.x = x; out.z = -d; out.tx = dx / n; out.tz = -1 / n; out.rx = -out.tz; out.rz = out.tx;
    out.heading = Math.atan2(out.tx, out.tz);
    return out;
}
// a point at lateral offset `side` metres (negative = left of the centreline)
export function at(d, side, out = {}) { const f = frame(d); out.x = f.x + f.rx * side; out.z = f.z + f.rz * side; out.heading = f.heading; return out; }

// seeded randomness so the scenery is identical on every load
export function rng(seed) { let s = seed | 0; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// Scenery: which Kenney model goes where. Weighted toward shade trees and palms near the road, scrub and rocks further out.
export const MODELS = {
    tree_oak: { w: 7, s: [4.2, 6.4] }, tree_default: { w: 6, s: [4, 6] }, tree_fat: { w: 5, s: [4, 5.6] }, tree_simple: { w: 3, s: [4, 6] },
    tree_palm: { w: 4, s: [4.5, 6.5] }, tree_palmTall: { w: 3, s: [5, 7] },
    plant_bushLarge: { w: 9, s: [5, 9] }, plant_bush: { w: 7, s: [5, 9] }, grass_large: { w: 9, s: [4, 7] },
    rock_largeA: { w: 2, s: [4, 9] }, rock_largeC: { w: 2, s: [4, 9] }, rock_tallB: { w: 1, s: [3, 6] },
};
const PICK = Object.entries(MODELS).flatMap(([k, v]) => Array(v.w).fill(k));

export function scenery() {
    const r = rng(2026), out = Object.fromEntries(Object.keys(MODELS).map((k) => [k, []]));
    const p = {};
    for (let d = -60; d < LENGTH + 120; d += 6.5) for (const side of [-1, 1]) {
        const n = 1 + Math.floor(r() * 2.4);
        for (let k = 0; k < n; k++) {
            const off = ROAD_W / 2 + 4.5 + r() * r() * 70;
            const dd = d + r() * 6;
            // keep the billboard verges clear on the left
            if (side < 0 && off < 22 && STOPS.some((s) => Math.abs(s.d - dd) < 14 || Math.abs(s.d - 45 - dd) < 6)) continue;
            const m = PICK[Math.floor(r() * PICK.length)], [lo, hi] = MODELS[m].s;
            at(dd, side * off, p);
            if (p.x > 17.5) continue;                       // never spawn land props in the coastal ocean (x >= 20)
            out[m].push({ x: p.x, z: p.z, rot: r() * Math.PI * 2, s: lo + r() * (hi - lo) });
        }
    }
    return out;
}
