// POCKET's town: a small, original Ahmedabad. North: an old-city pol gate, the Gravity gym (experience) and Aman's
// house. Middle: a chai stall and LDCE (education). South: tall grass, where the projects live. East: the Sabarmati,
// with the riverfront promenade and a bridge. Legend: t tree · . grass · , path · : tall grass · w water · p promenade ·
// B bridge · f flowers · = fence · S sign · building anchors G gate, Y gym, H home, C chai stall, L school (3×2, # = body).
import { work, KINDS, status } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { profile } from "#content/profile.js";

export const MAP = [
    "tttttttttttttttttttttttttttttt",
    "t.G##......Y##...H##..pwwwwwpt",
    "t.###..ff..###...###..pwwwwwpt",
    "t..,....S...,.....,..Spwwwwwpt",
    "t,,,,,,,,,,,,,,,,,,,,,pwwwwwpt",
    "t........,............pwwwwwpt",
    "tt....ft.,.....ft.....pwwwwwpt",
    "tt.......,............pwwwwwpt",
    "t..C##...,...L##...ff.pwwwwwpt",
    "t..###...,...###......pwwwwwpt",
    "t...,....,....,...ttt.pwwwwwpt",
    "t...,,,,,,,,,,,......Spwwwwwpt",
    "tff......,,,,,,,,,,,,,,BBBBBpt",
    "tt......t,S...........pwwwwwpt",
    "t:::::::.,.::::::::::tpwwwwwpt",
    "t:::::::.,.::::::::::.pwwwwwpt",
    "t:::::::.,.::::::::::.pwwwwwpt",
    "t:::::::.,.::::::::::.pwwwwwpt",
    "t:::::::.,.::::::::::tpwwwwwpt",
    "t:::::::.,.::::::::::.pwwwwwpt",
    "t========,t...........pwwwwwpt",
    "tttttttttttttttttttttttttttttt",
];
export const COLS = MAP[0].length, ROWS = MAP.length;
export const at = (x, y) => (MAP[y] && MAP[y][x]) || "t";
export const SOLID = new Set(["t", "w", "=", "S", "#", "G", "Y", "H", "C", "L"]);
export const BUILDINGS = { G: "gate", Y: "gym", H: "home", C: "stall", L: "school" };
export const START = { x: 9, y: 6, dir: "down" };

const job = experience[0], edu = experience[1];
// What A says when you face something. Doors are the tile below a building's middle column.
export const TALK = {
    "8,3": ["OLD CITY → pol houses, carved wood, and the best chai in town."],
    "21,3": ["SABARMATI RIVERFRONT → walk the promenade, cross the bridge."],
    "21,11": ["RIVERFRONT: Aman's sites are up and running like the river. Probably more reliably."],
    "10,13": ["DANGER! TALL GRASS ↓", `${work.length} wild projects live here. Walk in to meet them.`],
    "3,3": ["The old pol gate. It has stood here for 200 years.", "Aman has shipped for 10 months. Give it time."],
    "12,3": [`GRAVITY GYM · Leader: ${job.org.toUpperCase()}`, `Aman trains here as a ${job.role} since ${job.when.split(" — ")[0]}.`, ...job.points.map((p) => `"${p}"`), "Badge earned: EVERY-CLIENT-SHIPPED."],
    "18,3": ["AMAN'S HOUSE. His PC is on.", "On screen: a résumé. Press START → RÉSUMÉ to read it, or CARD for his contact details."],
    "4,10": ["CHAI STALL: \"One cutting chai, ₹10.\"", `"That boy ${profile.name.split(" ")[0]}? Builds websites for half the shops on this road."`],
    "14,10": [`${edu.org.toUpperCase()}`, `${edu.role}, ${edu.when}. ${edu.where}.`, ...(edu.points || []).slice(0, 2)],
};

// Projects → creatures. Type = kind; moves = the features in its own line; "stats" = its stack.
const TYPES = { product: "SPARK", mobile: "POCKET", client: "CRAFT", concept: "DREAM" };
const moves = (w) => {
    const parts = w.line.replace(/^Prototype · /, "").split(/[,:;]| and | with /).map((s) => s.trim()).filter((s) => s.length > 3);
    return (parts.length >= 2 ? parts : [w.line, ...(w.stack ? w.stack.split(" · ") : [])]).slice(0, 4);
};
export const MONS = work.map((w, i) => ({
    no: i + 1, w, slug: w.slug, name: w.title.toUpperCase(), type: TYPES[w.kind] || "DREAM", kind: KINDS[w.kind],
    status: status(w), moves: moves(w), stack: w.stack ? w.stack.split(" · ") : [],
    dex: `${w.line}${w.stack ? ` Feeds on ${w.stack}.` : ""}${w.live ? " Seen in the wild right now." : ""}`,
}));

// The trainer card's badges are the skill groups.
export const BADGES = skillGroups.map((g) => ({ name: g.group, items: g.items.map(([n]) => n) }));
