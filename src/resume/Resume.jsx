import { useState } from "react";
import { work } from "../../content/work.js";
import { experience } from "../../content/experience.js";
import { skillGroups } from "../../content/skills.js";

// A one-page résumé generated from the same content files as the site, so it never drifts from the portfolio.
// ?for=fullstack | frontend | ai picks the angle: summary, which projects lead, and skill order. Print = A4 PDF.
const CONTACT = [
    ["patelaman0241@gmail.com", "mailto:patelaman0241@gmail.com"],
    ["+91 95580 09550", "tel:+919558009550"],
    ["aman-patel.me", "https://www.aman-patel.me"],
    ["linkedin.com/in/aman-patel-fullstack", "https://www.linkedin.com/in/aman-patel-fullstack"],
    ["github.com/Aman241104", "https://github.com/Aman241104"],
];

const VARIANTS = {
    fullstack: {
        label: "Full-stack",
        title: "Full-Stack Engineer",
        summary: "Full-stack engineer shipping production apps end to end: React/Next.js frontends, FastAPI and Node services, Postgres with per-tenant isolation, LLM features with failover, and tests that catch real bugs. 12+ client apps live since Jan 2026. Open to on-site or hybrid roles in Ahmedabad; can join immediately.",
        lead: ["job-search-os", "whatsapp-ai", "zing-bliss", "mindcore", "bni-ares"],
        skills: ["Languages", "Frontend", "Backend & APIs", "Data", "AI", "Cloud & ops", "Mobile", "Testing"],
    },
    frontend: {
        label: "Frontend / creative",
        title: "Frontend & Creative Developer",
        summary: "Frontend developer who builds interfaces people remember: React and Next.js with Three.js, GSAP and Framer Motion, tuned for speed (image optimisation, lazy loading, code splitting). 12+ client sites in production, several on their own domains, plus a 3D slot-machine portfolio. Comfortable down the stack when a feature needs an API or a database. Based in Ahmedabad; can join immediately.",
        lead: ["zing-bliss", "bni-ares", "cmj-events", "vitlead", "lightning-kicks"],
        skills: ["Frontend", "Languages", "Mobile", "Backend & APIs", "Cloud & ops", "Data", "Testing", "AI"],
    },
    ai: {
        label: "AI products",
        title: "Full-Stack Engineer · AI Products",
        summary: "Engineer building AI products that hold up in production: multi-source scraping with two-stage LLM scoring, multi-tenant LLM agents on WhatsApp, an Android app that extracts and verifies items from shared content, with provider failover (Gemini, NVIDIA NIM, Groq, Claude) and outputs validated before use. Full-stack underneath: Next.js, FastAPI, Postgres, Cloud Run. Ahmedabad; can join immediately.",
        lead: ["job-search-os", "whatsapp-ai", "mindcore", "zing-bliss", "naam-transfer"],
        skills: ["AI", "Languages", "Backend & APIs", "Data", "Frontend", "Cloud & ops", "Testing", "Mobile"],
    },
};

// richer bullets for the lead projects (from the résumé and project notes); others use the one-line description
const DETAIL = {
    "job-search-os": ["19 job sources scraped concurrently, two-stage LLM scoring, a tailored one-page CV and cover letter per job, live progress over Server-Sent Events.", "LLM layer fails over between NVIDIA NIM and Gemini; generated documents are validated against the résumé before rendering.", "Found and fixed a cross-tenant PII leak through pytest coverage; cut API latency from tens of seconds to under a second."],
    "whatsapp-ai": ["Multi-tenant SaaS: each business runs an LLM agent on its own WhatsApp Business number, isolated with Postgres row-level security.", "Booking state machine and drip-sequence engine; integration tests against the live database caught an RLS misconfiguration."],
    "zing-bliss": ["Production client platform: marketing pages, client-preference quiz, authenticated client portal and admin CMS."],
    mindcore: ["Native Android (Kotlin, Jetpack Compose): share a reel, post, link or screenshot; AI extracts repos, tools, certs and jobs, verifies each online, and answers questions about the library with sources."],
};

const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function Resume() {
    const [key, setKey] = useState(() => {
        const k = new URLSearchParams(location.search).get("for");
        return VARIANTS[k] ? k : "fullstack";
    });
    const v = VARIANTS[key];
    const pick = (k) => { setKey(k); history.replaceState(null, "", `?for=${k}`); };
    const lead = v.lead.map((s) => work.find((w) => w.slug === s)).filter(Boolean);
    const live = work.filter((w) => w.live && !v.lead.includes(w.slug));
    const groups = v.skills.map((g) => skillGroups.find((x) => x.group === g)).filter(Boolean);
    const job = experience[0], edu = experience[1];

    return (
        <>
            <nav className="toolbar" aria-label="Résumé versions">
                <a href="/" className="back">← aman-patel.me</a>
                <div className="tabs">
                    {Object.entries(VARIANTS).map(([k, x]) => (
                        <button key={k} type="button" aria-pressed={k === key} onClick={() => pick(k)}>{x.label}</button>
                    ))}
                </div>
                <button type="button" className="print" onClick={() => window.print()}>Download PDF</button>
            </nav>

            <article className="page">
                <header>
                    <div>
                        <h1>Aman Patel</h1>
                        <p className="role">{v.title} · Ahmedabad, India</p>
                    </div>
                    <ul className="contact">{CONTACT.map(([t, h]) => <li key={t}><a href={h}>{t}</a></li>)}</ul>
                </header>

                <p className="summary">{v.summary}</p>

                <section>
                    <h2>Experience</h2>
                    <div className="item">
                        <div className="row"><h3>{job.role} · {job.org}</h3><span>{job.when.replace("now", "Present")} · {job.where}</span></div>
                        <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    </div>
                </section>

                <section>
                    <h2>Selected projects</h2>
                    {lead.map((w) => (
                        <div className="item" key={w.slug}>
                            <div className="row">
                                <h3>{w.title}{w.stack && <em> · {w.stack}</em>}</h3>
                                {w.url && <a href={w.url}>{host(w.url)}</a>}
                            </div>
                            <ul>{(DETAIL[w.slug] || [w.line]).map((p) => <li key={p}>{p}</li>)}</ul>
                        </div>
                    ))}
                    {live.length > 0 && (
                        <p className="more"><b>Also live in production:</b> {live.map((w, i) => <span key={w.slug}>{i ? ", " : ""}{w.title} (<a href={w.url}>{host(w.url)}</a>)</span>)}.</p>
                    )}
                </section>

                <section>
                    <h2>Skills</h2>
                    <dl className="skills">
                        {groups.map((g) => <div key={g.group}><dt>{g.group}</dt><dd>{g.items.map(([n]) => n).join(", ")}</dd></div>)}
                    </dl>
                </section>

                <section>
                    <h2>Education</h2>
                    <div className="item">
                        <div className="row"><h3>{edu.role} · {edu.org}</h3><span>{edu.when} · {edu.where}</span></div>
                    </div>
                </section>
            </article>
        </>
    );
}
