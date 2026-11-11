import { createRoot } from "react-dom/client";
import { cases } from "../../content/cases.js";
import { work } from "../../content/work.js";
import { initAnalytics, track } from "../analytics.js";
import "./case.css";

// Case study page: /case.html?p=<slug>. Content lives in content/cases.js; the screenshot comes from the work list.
initAnalytics();
const q = new URLSearchParams(location.search), slug = q.get("p");
const ed = q.get("skin") === "ed";                      // opened from THE INDEX: same story, set as a broadsheet
const skin = ed ? "&skin=ed" : "";
if (ed) document.body.classList.add("ed-skin");
const c = cases[slug] || cases["job-search-os"];
const w = work.find((x) => x.slug === (cases[slug] ? slug : "job-search-os"));
const shot = `https://res.cloudinary.com/dhrcarq8g/image/upload/f_auto,q_auto,w_1600/${w.img || `portfolio/work/${w.slug}`}`;
document.title = `${c.title} — case study · Aman Patel`;
track("case_study_viewed", { project: slug });
const others = Object.entries(cases).filter(([k]) => k !== slug);

const Case = () => (
    <main className={ed ? "case case-ed" : "case"}>
        <nav className="case-nav"><a href={ed ? "/?style=editorial" : "/"}>{ed ? "← The Index" : "← aman-patel.me"}</a><a href="/resume.html">Résumé</a></nav>
        <header>
            <p className="mono">{ed ? "The Index · Feature" : "Case study"}</p>
            <h1>{c.title}</h1>
            <p className="lede">{c.tagline}</p>
            <dl className="facts">{c.facts.filter(([k]) => k !== "Links").map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}</dl>
            <p className="links">{c.links.map(([l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer">{l} ↗</a>)}</p>
        </header>
        <figure><img src={shot} alt={`${c.title} screenshot`} fetchpriority="high" width="1600" height="1000" /></figure>
        {c.sections.map(([h, ps], i) => (
            <section key={h}>
                <h2><span className="mono">{String(i + 1).padStart(2, "0")}</span>{h}</h2>
                <ul>{ps.map((p) => <li key={p}>{p}</li>)}</ul>
            </section>
        ))}
        <footer>
            {others.map(([k, o]) => <a key={k} className="next" href={`/case.html?p=${k}${skin}`}><span className="mono">Next case study</span>{o.title} →</a>)}
            <p>Want the walkthrough? <a href="mailto:patelaman0241@gmail.com">patelaman0241@gmail.com</a></p>
        </footer>
    </main>
);

createRoot(document.getElementById("root")).render(<Case />);
