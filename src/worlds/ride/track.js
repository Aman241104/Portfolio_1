// RIDE's test track: a closed circuit on a floating PX-01 studio plinth. Every project is a printed ticket standing
// on the outside of the circuit, grouped into four painted sectors by kind. All placement is deterministic.
import * as THREE from "three";
import { work, KINDS, status } from "../../../content/work.js";

export const ROAD_W = 9;
export const PLINTH = { w: 150, d: 104 };                       // floor slab, top face at y = 0

// rounded-rectangle centreline: the near straight (z = +HZ) runs toward +X, then the loop turns toward -Z.
// Each corner arc is (cx + R cos a, cz + R sin a) with a sweeping a0 → a0 - 90°.
const HX = 52, HZ = 30, R = 17, pts = [];
for (const [cx, cz, a0] of [[HX - R, HZ - R, 90], [HX - R, -(HZ - R), 0], [-(HX - R), -(HZ - R), -90], [-(HX - R), HZ - R, -180]]) {
    for (let k = 0; k <= 6; k++) { const a = THREE.MathUtils.degToRad(a0 - k * 15); pts.push(new THREE.Vector3(cx + Math.cos(a) * R, 0, cz + Math.sin(a) * R)); }
}
export const CURVE = new THREE.CatmullRomCurve3(pts, true, "centripetal");
export const LENGTH = CURVE.getLength();

// point, unit tangent and outward normal at fraction t of the loop
const _p = new THREE.Vector3(), _t = new THREE.Vector3();
export function onTrack(t, out = {}) {
    CURVE.getPointAt(((t % 1) + 1) % 1, _p); CURVE.getTangentAt(((t % 1) + 1) % 1, _t);
    const nx = _t.z, nz = -_t.x;                                 // right-hand normal
    const outward = nx * _p.x + nz * _p.z > 0 ? 1 : -1;          // flip so it always points away from the infield
    out.x = _p.x; out.z = _p.z; out.tx = _t.x; out.tz = _t.z; out.nx = nx * outward; out.nz = nz * outward;
    return out;
}

// projects grouped by kind → contiguous sectors, boards evenly spaced with a gap between sectors
const order = Object.keys(KINDS);
const sorted = work.map((w, i) => ({ w, i })).sort((a, b) => order.indexOf(a.w.kind) - order.indexOf(b.w.kind) || a.i - b.i);
const SLOTS = sorted.length + order.length * 2;                   // two empty slots before each sector for its label
export const SECTORS = [];
export const STOPS = [];
let slot = 0;
order.forEach((kind, k) => {
    const items = sorted.filter((s) => s.w.kind === kind);
    if (!items.length) return;
    SECTORS.push({ kind, label: KINDS[kind], n: `0${k + 1}`, t: (slot + 1) / SLOTS, count: items.length });
    slot += 2;
    items.forEach(({ w }) => {
        const t = (slot + 0.5) / SLOTS, f = onTrack(t);
        const off = ROAD_W / 2 + 4.2;
        STOPS.push({
            i: STOPS.length, w, t, title: w.title, kind: KINDS[w.kind], status: status(w),
            x: f.x + f.nx * off, z: f.z + f.nz * off,
            face: Math.atan2(-f.nx, -f.nz),                       // board faces the road
        });
        slot++;
    });
});

// spawn mid-way down the near straight, which is the tail end of the loop
export const SPAWN = (() => { const f = onTrack(1 - 35 / LENGTH); return { x: f.x, z: f.z, yaw: Math.atan2(-f.tz, f.tx) }; })();
// where the car is placed for stop s: on the road, right beside its board
export function standoff(s) { const f = onTrack(s.t); return { x: f.x, z: f.z, yaw: Math.atan2(-f.tz, f.tx) }; }

// start/finish line: 14 m ahead of the spawn point
export const START_T = 1 - 21 / LENGTH;

// fraction of the loop nearest to (x, z). With a previous answer it only searches nearby, so it's cheap per frame.
const N = 400, SAMPLES = Array.from({ length: N }, (_, i) => { const f = onTrack(i / N); return [f.x, f.z]; });
export function trackT(x, z, prev = -1) {
    let bi = 0, bd = Infinity;
    const from = prev < 0 ? 0 : Math.round(prev * N) - 14, to = prev < 0 ? N : Math.round(prev * N) + 14;
    for (let j = from; j < to; j++) {
        const i = ((j % N) + N) % N, d = (SAMPLES[i][0] - x) ** 2 + (SAMPLES[i][1] - z) ** 2;
        if (d < bd) { bd = d; bi = i; }
    }
    return { t: bi / N, dist: Math.sqrt(bd) };
}
