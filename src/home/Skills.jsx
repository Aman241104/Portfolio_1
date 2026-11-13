import { useRef } from "react";
import {
    siTypescript, siJavascript, siPython, siKotlin, siCplusplus, siOpenjdk, siReact, siNextdotjs, siTailwindcss, siGsap, siFramer,
    siThreedotjs, siReactquery, siVite, siAndroid, siJetpackcompose, siPwa, siNodedotjs, siExpress, siFastapi, siPostgresql, siNeon,
    siSupabase, siDrizzle, siMongodb, siMysql, siGooglegemini, siClaude, siNvidia, siVercel, siGooglecloud, siCloudflareworkers,
    siDocker, siGithub, siCloudinary, siResend, siPosthog, siN8n, siPytest, siVitest, siJest,
} from "simple-icons";
import { skillGroups } from "#content/skills.js";
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

export default function Skills() {
    const total = skillGroups.reduce((n, g) => n + g.items.length, 0);
    const lastTick = useRef(0);
    const tick = (e) => {
        if (e.pointerType !== "mouse" || !e.target.closest?.("li")) return;
        const now = performance.now();
        if (now - lastTick.current > 70) { lastTick.current = now; sfx.tick(); }
    };
    return (
        <section className="skills-sec" aria-labelledby="skills-h">
            <div className="work-head">
                <h2 id="skills-h">Skills <span className="mono">({total})</span></h2>
                <p className="mono">Everything here is used in a project above</p>
            </div>
            <div className="skill-groups" onPointerOver={tick}>
                {skillGroups.map((g) => (
                    <div key={g.group} className="skill-group" data-reveal>
                        <h3 className="mono">{g.group}</h3>
                        <p className="keys-sub">{g.note}</p>
                        <ul>
                            {g.items.map(([name, icon], k) => {
                                const i = find(icon);
                                return (
                                    <li key={name} style={{ "--i": k, ...(i && { "--brand": `#${i.hex}` }) }}>
                                        {i ? <svg viewBox="0 0 24 24" aria-hidden><path d={i.path} /></svg> : <b aria-hidden>{name.slice(0, 1)}</b>}
                                        {name}
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
