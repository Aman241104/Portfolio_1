import { useEffect, useState } from "react";
import Machine3D from "./Machine3D.jsx";
import MultiverseName from "./MultiverseName.jsx";
import "./lab.css";

const Clock = () => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
    return <>{now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" })} IST</>;
};

// Intro choreography: black → title card over the low wide shot of the island → the title fades as the
// camera rises into the machine → the page UI (header + spec sheet) fades in only once the camera arrives.
// Product-launch layout after arrival (N8 glass-camera ref): big serif model name, two spec columns, one CTA.
const LabPage = () => {
    const [spinning, setSpinning] = useState(false);
    const [ready, setReady] = useState(false);
    const [arrived, setArrived] = useState(false);
    return (
        <div className="stage" data-ready={ready || undefined} data-arrived={arrived || undefined} data-shot={new URLSearchParams(location.search).get("shot") || undefined}>
            <Machine3D onSpin={setSpinning} onReady={() => setReady(true)} onArrive={() => setArrived(true)} />

            <div className="curtain" aria-hidden />
            <div className="titlecard" aria-hidden={arrived}>
                <p className="mono">Aman Patel presents</p>
                <h1>PORTFOLIO<em>.exe</em></h1>
                <p className="mono">A machine for alternate realities</p>
            </div>

            {/* intro frame labels: an editorial system at the four corners, gone once the camera arrives */}
            <div className="intro-labels" aria-hidden>
                <p className="mono tl">PX‑01 — Clear Hardware Series</p>
                <p className="mono tr">Edition 01 · 2026</p>
                <ol className="chapters mono bl">
                    <li data-on={!arrived || undefined}>01 Arrival</li>
                    <li data-on={(arrived && !spinning) || undefined}>02 Select</li>
                    <li data-on={spinning || undefined}>03 Enter</li>
                </ol>
                <p className="mono br">Sound off · Motion respects your settings</p>
            </div>

            {/* after arrival: an index rail of the worlds on the reels */}
            <nav className="rail ui-late" aria-label="Worlds">
                <p className="mono rail-title">Index</p>
                <ol>
                    {[["01", "Desktop OS"], ["02", "Editorial"], ["03", "Terminal"]].map(([n, w]) => (
                        <li key={n}><span className="mono">{n}</span>{w}</li>
                    ))}
                    <li className="soon"><span className="mono">04</span>Album Rollout <em>soon</em></li>
                </ol>
            </nav>

            <header className="bar top ui-late">
                <MultiverseName scramble={spinning} />
                <p className="mono">Portfolio — Aman Patel</p>
                <p className="mono right"><Clock /></p>
            </header>

            <footer className="sheet ui-late">
                <h2 className="model">PX<span>‑</span>01</h2>
                <div className="specs">
                    <div className="spec">
                        <p className="spec-title">Reality Selector</p>
                        <p>A clear-case machine that decides which of my worlds you land in. Three reels: era, medium, mood.</p>
                    </div>
                    <div className="spec">
                        <p className="spec-title">Loaded</p>
                        <p>Desktop OS, Editorial, Terminal. Album Rollout is in production.</p>
                    </div>
                    <dl className="spec-table">
                        <div><dt className="mono">Reels</dt><dd>3</dd></div>
                        <div><dt className="mono">Worlds</dt><dd>3</dd></div>
                        <div><dt className="mono">Plays</dt><dd>000427</dd></div>
                    </dl>
                </div>
                <div className="cta">
                    <span className="mono">{spinning ? "Selecting…" : "Drag the lever · Space"}</span>
                    <button type="button" className="pull" onClick={() => window.dispatchEvent(new Event("pexe:pull"))}>Pull the lever <i aria-hidden>→</i></button>
                </div>
            </footer>
        </div>
    );
};

export default LabPage;
