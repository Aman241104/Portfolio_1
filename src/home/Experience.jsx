import { experience } from "#content/experience.js";
import { profile } from "#content/profile.js";

// Experience + education, straight from the résumé, in the same hairline system as Work.
export default function Experience() {
    return (
        <section className="xp" aria-labelledby="xp-h">
            <div className="work-head">
                <h2 id="xp-h">Experience</h2>
                <a className="mono xp-cv" href={profile.resume} target="_blank" rel="noreferrer">Full résumé (PDF) ↓</a>
            </div>
            <ol className="xp-list">
                {experience.map((x) => (
                    <li key={x.role}>
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
