import { useRef } from "react";
import {
    siTypescript, siJavascript, siPython, siKotlin, siCplusplus, siOpenjdk, siReact, siNextdotjs, siTailwindcss, siGsap, siFramer,
    siThreedotjs, siReactquery, siVite, siAndroid, siJetpackcompose, siPwa, siNodedotjs, siExpress, siFastapi, siPostgresql, siNeon,
    siSupabase, siDrizzle, siMongodb, siMysql, siGooglegemini, siClaude, siNvidia, siVercel, siGooglecloud, siCloudflareworkers,
    siDocker, siGithub, siCloudinary, siResend, siPosthog, siN8n, siPytest, siVitest, siJest,
} from "simple-icons";
import { skillGroups } from "#content/skills.js";
import { work } from "#content/work.js";
import { sfx } from "#machine/sfx.js";

// Skills as a panel of labelled chips: monochrome logos that take their brand colour on hover.
const ICONS = Object.fromEntries([
    siTypescript, siJavascript, siPython, siKotlin, siCplusplus, siOpenjdk, siReact, siNextdotjs, siTailwindcss, siGsap, siFramer,
    siThreedotjs, siReactquery, siVite, siAndroid, siJetpackcompose, siPwa, siNodedotjs, siExpress, siFastapi, siPostgresql, siNeon,
    siSupabase, siDrizzle, siMongodb, siMysql, siGooglegemini, siClaude, siNvidia, siVercel, siGooglecloud, siCloudflareworkers,
    siDocker, siGithub, siCloudinary, siResend, siPosthog, siN8n, siPytest, siVitest, siJest,
].map((i) => [i.title, i]));
const bySlug = Object.fromEntries(Object.values(ICONS).map((i) => [i.slug, i]));
const find = (name) => name && (bySlug[name.toLowerCase()] || ICONS[name]);
const countProjects = (name) => {
    const k = name.toLowerCase();
    return work.reduce((n, w) => n + (`${w.stack || ""} ${w.line || ""}`.toLowerCase().includes(k) ? 1 : 0), 0);
};

export default function Skills() {
    const lastTick = useRef(0);
    const tick = (e) => {
        if (e.pointerType !== "mouse" || !e.target.closest?.("li")) return;
        const now = performance.now();
        if (now - lastTick.current > 70) { lastTick.current = now; sfx.tick(); }
    };
    return (
        <section className="skills-sec split-sec" aria-labelledby="skills-h">
            <aside className="split-rail po-print" data-reveal>
                <p className="mono sec-kicker">Output 06 · Parts list</p>
                <h2 id="skills-h">Skills</h2>
                <p className="mono xp-span">Everything here is used in a project above</p>
            </aside>
            <div className="skill-groups" onPointerOver={tick}>
                {skillGroups.map((g) => (
                    <div key={g.group} className="skill-group" data-reveal>
                        <h3 className="mono">{g.group}</h3>
                        <p className="keys-sub">{g.note}</p>
                        <ul>
                            {g.items.map(([name, icon], k) => {
                                const i = find(icon);
                                const hits = countProjects(name);
                                return (
                                    <li key={name} style={{ "--i": k, ...(i && { "--brand": `#${i.hex}` }) }}>
                                        {i ? <svg viewBox="0 0 24 24" aria-hidden><path d={i.path} /></svg> : <b aria-hidden>{name.slice(0, 1)}</b>}
                                        {name}
                                        {hits > 0 && <sup className="mono skill-hits" aria-hidden>×{hits}</sup>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
