import { certifications } from "#content/certifications.js";

// Verified AI & Engineering Certifications — editorial gallery index matching Dark Studio & Light Atelier.
export default function Certifications() {
    return (
        <section className="xp certs-sec" aria-labelledby="certs-h">
            <div className="work-head">
                <h2 id="certs-h">Certifications <span className="mono">({String(certifications.length).padStart(2, "0")})</span></h2>
                <p className="mono">Verified AI, Cloud &amp; Agentic Engineering</p>
            </div>
            <ul className="cert-grid" data-reveal>
                {certifications.map((c, i) => (
                    <li key={c.code} className="cert-card" style={{ "--i": i, "--cert-accent": c.accent }}>
                        <div className="cert-top">
                            <span className="mono cert-code">{c.code}</span>
                            <span className="mono cert-issuer">{c.short} · {c.date}</span>
                        </div>
                        <h3 className="cert-title">{c.title}</h3>
                        <p className="cert-org">{c.issuer}</p>
                        <div className="cert-foot">
                            <span className="mono cert-focus">{c.focus}</span>
                            {c.url && (
                                <a className="mono cert-link" href={c.url} target="_blank" rel="noreferrer">
                                    Verify ↗
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
