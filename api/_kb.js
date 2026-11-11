// The knowledge base behind "Ask Aman": every fact comes from content/ (the same files every world renders),
// split into small cited chunks. Retrieval is a tiny BM25-style keyword scorer: ~60 chunks don't need a vector DB.
// ponytail: swap for embeddings if the content grows past a few hundred chunks.
import { work, KINDS } from "../content/work.js";
import { experience } from "../content/experience.js";
import { skillGroups } from "../content/skills.js";
import { cases } from "../content/cases.js";

const SITE = "https://www.aman-patel.me";
export const PROFILE = {
    name: "Aman Patel", email: "patelaman0241@gmail.com", city: "Ahmedabad, India",
    line: "Full-stack engineer who builds AI products and interfaces; open to on-site or hybrid full-stack roles in Ahmedabad.",
};

export const chunks = [
    { id: "about", title: "About Aman", url: `${SITE}/`, text: `${PROFILE.name}, ${PROFILE.line} Based in ${PROFILE.city}. Email ${PROFILE.email}. Résumé at ${SITE}/files/resume.pdf.` },
    // summary chunks, worded the way people ask
    { id: "education", title: "Education", url: `${SITE}/resume.html`, text: `Education: studied B.E. Electronics & Communication at L.D. College of Engineering, Ahmedabad (GTU), 2022–2026, CGPA 8.67. Degree, college, university, graduated 2026.` },
    { id: "availability", title: "Availability", url: `${SITE}/`, text: `Availability: open to work now, full-stack roles, on-site or hybrid in Ahmedabad, Gujarat, or remote. Hiring, joining, notice period: contact ${PROFILE.email}.` },
    { id: "live-sites", title: "Live sites Aman maintains", url: `${SITE}/#live`, text: `Sites and products Aman built and still maintains in production: ${work.filter((w) => w.maintained).map((w) => `${w.title} (${(w.url || "").replace(/^https?:\/\/(www\.)?/, "")})`).join(", ")}.` },
    { id: "ai-work", title: "AI projects", url: `${SITE}/case.html?p=job-search-os`, text: `AI and LLM projects: ${work.filter((w) => /ai|llm|agent|gemini|groq|nim/i.test(`${w.title} ${w.line} ${w.stack}`)).map((w) => `${w.title}: ${w.line}`).join(" ")}` },
    { id: "mobile-work", title: "Mobile apps", url: `${SITE}/`, text: `Mobile and Android apps: ${work.filter((w) => w.kind === "mobile").map((w) => `${w.title}: ${w.line}`).join(" ")}` },
    ...experience.map((x, i) => ({ id: `xp-${i}`, title: `${x.role} · ${x.org}`, url: `${SITE}/resume.html`, text: `${x.when}: ${x.role} at ${x.org} (${x.where}). ${x.points.join(" ")} ${x.stack ? `Stack: ${x.stack}.` : ""}` })),
    ...skillGroups.map((g) => ({ id: `skills-${g.group}`, title: `Skills · ${g.group}`, url: `${SITE}/#skills`, text: `${g.group} (${g.note}): ${g.items.map(([n]) => n).join(", ")}.` })),
    ...work.map((w) => ({
        id: `work-${w.slug}`, title: w.title, url: cases[w.slug] ? `${SITE}/case.html?p=${w.slug}` : w.url || `${SITE}/`,
        text: `${w.title} (${KINDS[w.kind]}, ${w.year}${w.live ? ", live in production" : ""}${w.maintained ? ", maintained by Aman" : ""}): ${w.line} ${w.stack ? `Stack: ${w.stack}.` : ""} ${w.url ? `Link: ${w.url}` : ""}`,
    })),
    ...Object.entries(cases).flatMap(([slug, c]) => c.sections.map(([h, ps], i) => ({
        id: `case-${slug}-${i}`, title: `${c.title} · ${h}`, url: `${SITE}/case.html?p=${slug}`, text: `${c.title}, ${h}: ${ps.join(" ")}`,
    }))),
];

const STOP = new Set("a an the and or of to in on for with is are was were be by at as it this that what which who how does do did has have he his him aman aman's patel me you your about can tell any some".split(" "));
const stem = (w) => (w.length > 4 ? w.replace(/(ies|ied)$/, "y").replace(/(ing|ed|es|s)$/, "") : w);
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/\s+/).map((w) => w.replace(/^[.-]+|[.-]+$/g, "")).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);
const docs = chunks.map((c) => tok(`${c.title} ${c.text}`));
const avg = docs.reduce((a, d) => a + d.length, 0) / docs.length;
const df = {};
docs.forEach((d) => new Set(d).forEach((w) => { df[w] = (df[w] || 0) + 1; }));

export const retrieve = (q, k = 6) => {
    const qt = [...new Set(tok(q))];
    return docs.map((d, i) => {
        let s = 0;
        for (const w of qt) {
            const f = d.filter((x) => x === w || (w.length > 3 && x.startsWith(w))).length;
            if (!f) continue;
            const idf = Math.log(1 + (docs.length - (df[w] || 0) + 0.5) / ((df[w] || 0) + 0.5));
            s += idf * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * d.length / avg));
        }
        return [s, i];
    }).filter(([s]) => s > 0.8).sort((a, b) => b[0] - a[0]).slice(0, k).map(([s, i]) => ({ ...chunks[i], score: +s.toFixed(2) }));
};

// every skill name, for job-description matching without an LLM
export const SKILLS = skillGroups.flatMap((g) => g.items.map(([n]) => n));
