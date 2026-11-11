// Build-time SEO: the page ships with real, crawlable HTML (who, what, every project with its link, experience)
// inside #root, plus rich JSON-LD, all generated from the same content files the site renders. React replaces the
// HTML on mount, so people see the machine; crawlers and link unfurlers see everything without running JS.
import { work, KINDS } from "./content/work.js";
import { experience, skills } from "./content/experience.js";

const SITE = "https://www.aman-patel.me";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const SAME_AS = ["https://github.com/Aman241104", "https://www.linkedin.com/in/aman-patel-fullstack", "https://x.com/Aman60734818"];

const jsonLd = () => {
    const person = {
        "@type": "Person", "@id": `${SITE}/#aman`, name: "Aman Patel", url: `${SITE}/`, image: `${SITE}/og.jpg`,
        jobTitle: "Full Stack Engineer", email: "mailto:patelaman0241@gmail.com",
        description: "Full-stack engineer in Ahmedabad building web apps, AI products and 3D interfaces with React, Next.js, TypeScript and Python.",
        address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
        worksFor: { "@type": "Organization", name: experience[0].org },
        alumniOf: { "@type": "CollegeOrUniversity", name: "L.D. College of Engineering, Ahmedabad" },
        knowsAbout: skills.flatMap(([, v]) => v.split(", ")),
        sameAs: SAME_AS,
    };
    return {
        "@context": "https://schema.org",
        "@graph": [
            person,
            { "@type": "WebSite", "@id": `${SITE}/#site`, url: `${SITE}/`, name: "Aman Patel", inLanguage: "en", publisher: { "@id": `${SITE}/#aman` } },
            { "@type": "ProfilePage", "@id": `${SITE}/#page`, url: `${SITE}/`, name: "Aman Patel — Full-Stack Engineer, Ahmedabad", isPartOf: { "@id": `${SITE}/#site` }, mainEntity: { "@id": `${SITE}/#aman` } },
            {
                "@type": "ItemList", name: "Projects by Aman Patel", numberOfItems: work.length,
                itemListElement: work.map((w, i) => ({
                    "@type": "ListItem", position: i + 1,
                    item: { "@type": "CreativeWork", name: w.title, url: w.url, description: w.line, dateCreated: String(w.year), creator: { "@id": `${SITE}/#aman` }, genre: KINDS[w.kind] },
                })),
            },
        ],
    };
};

const body = () => `
<main class="seo" style="max-width:760px;margin:0 auto;padding:48px 20px;font:15px/1.6 system-ui,sans-serif;color:#8a8780">
  <h1 style="color:#edeae3;margin:0">Aman Patel — Full-Stack Engineer in Ahmedabad</h1>
  <p>Full-stack engineer building web apps, AI products and 3D interfaces with React, Next.js, TypeScript and Python. Open to on-site or hybrid roles.
  <a href="/files/resume.pdf">Résumé (PDF)</a> · <a href="mailto:patelaman0241@gmail.com">patelaman0241@gmail.com</a> · ${SAME_AS.map((u) => `<a href="${u}">${esc(u.replace(/^https:\/\/(www\.)?/, ""))}</a>`).join(" · ")}</p>
  <h2>Projects</h2>
  <ul>${work.map((w) => `<li><a href="${esc(w.url)}">${esc(w.title)}</a> (${esc(KINDS[w.kind])}, ${w.year}): ${esc(w.line)}${w.stack ? ` — ${esc(w.stack)}` : ""}</li>`).join("")}</ul>
  <h2>Experience</h2>
  <ul>${experience.map((x) => `<li><strong>${esc(x.role)}</strong>, ${esc(x.org)} (${esc(x.when)}). ${x.points.map(esc).join(" ")}</li>`).join("")}</ul>
  <h2>Skills</h2>
  <ul>${skills.map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`).join("")}</ul>
</main>`;

export const seo = () => ({
    name: "px01-seo",
    transformIndexHtml: {
        order: "pre",
        handler(html, ctx) {
            if (!ctx.path.endsWith("/index.html") && ctx.path !== "/") return html;
            return html
                .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>`)
                .replace('<div id="root"></div>', `<div id="root">${body()}</div>`);
        },
    },
});
