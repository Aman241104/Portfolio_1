import { experience } from "#content/experience.js";
import { profile } from "#content/profile.js";

// Experience + education, straight from the résumé, in the same hairline system as Work.
export default function Experience() {
    return (
        <section className="xp split-sec" aria-labelledby="xp-h">
            <aside className="split-rail">
                <p className="mono sec-kicker">04 // TIMELINE</p>
                <h2 id="xp-h">Experience</h2>
                <p className="xp-span mono">2022 — PRESENT · AHMEDABAD / REMOTE</p>
                <a className="mono xp-cv" href={profile.resume} target="_blank" rel="noreferrer">Full résumé (PDF) ↓</a>
            </aside>
            <ol className="xp-list" data-reveal>
                {experience.map((x, i) => (
                    <li key={x.role} style={{ "--i": i }}>
                        <p className="mono xp-when">{x.when}</p>
                        <div>
                            <h3>{x.role} <span>· {x.org}</span></h3>
                            <p className="mono xp-where">{x.where}</p>
                            <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
                            {x.stack && <p className="mono card-stack">{x.stack}</p>}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
