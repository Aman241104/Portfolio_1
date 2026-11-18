// Which project goes where on the loop, as fractions t — no geometry, so RIDE's HTML shell (list, cards) can use it
// without three.js. track.js turns each t into a position on the curve.
import { work, KINDS, status } from "../../../content/work.js";

const order = Object.keys(KINDS);
const sorted = work.map((w, i) => ({ w, i })).sort((a, b) => order.indexOf(a.w.kind) - order.indexOf(b.w.kind) || a.i - b.i);
const SLOTS = sorted.length + order.length * 2;                   // two empty slots before each sector for its label
export const SECTORS = [];
export const TICKETS = [];
let slot = 0;
order.forEach((kind, k) => {
    const items = sorted.filter((s) => s.w.kind === kind);
    if (!items.length) return;
    SECTORS.push({ kind, label: KINDS[kind], n: `0${k + 1}`, t: (slot + 1) / SLOTS, count: items.length });
    slot += 2;
    items.forEach(({ w }) => {
        TICKETS.push({ i: TICKETS.length, w, t: (slot + 0.5) / SLOTS, title: w.title, kind: KINDS[w.kind], status: status(w) });
        slot++;
    });
});
