import { useEffect, useRef, useState } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { techStack } from "#constants";
import { work } from "../../content/work.js";
import { certifications } from "../../content/certifications.js";
import { experience } from "../../content/experience.js";
import { profile } from "../../content/profile.js";
import useWindowStore from "#store/window.js";
import { WindowControls } from "#components";

const QUICK = ["help", "whoami", "exp", "certs", "stack", "projects", "resume", "clear"];

const runCmd = (raw, openWindow) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return [];
    if (cmd === "help") return [
        "Available commands:",
        "  whoami      — engineer bio, city & availability",
        "  exp         — work experience & LDCE '26 academics",
        "  certs       — 4 verified AI credentials (Anthropic, AWS, Google, MS)",
        "  stack       — full-stack, AI & 3D capabilities",
        "  projects    — list flagship shipped builds (26 total)",
        "  resume      — open Resume.pdf window",
        "  clear       — clear terminal buffer",
    ];
    if (cmd === "whoami") return [`${profile.name} — ${profile.role}`, profile.line, `Email: ${profile.email}`, `GitHub: ${profile.github}`];
    if (cmd === "exp") return experience.map((e) => `${e.role} @ ${e.org} (${e.when} · ${e.where}) — ${e.points[0]}`);
    if (cmd === "certs") return certifications.map((c, i) => `0${i + 1}. ${c.issuer.padEnd(10)} | ${c.title} (${c.date})`);
    if (cmd === "stack") return techStack.map((s) => `${s.category.padEnd(14)}: ${s.items.join(", ")}`);
    if (cmd.startsWith("projects")) return [
        `Showing top 8 of ${work.length} shipped projects (open Repo or ⌘K for all):`,
        ...work.slice(0, 8).map((w, i) => `${String(i + 1).padStart(2, "0")}. ${w.title} — ${w.stack || w.kind}`),
    ];
    if (cmd === "resume") { openWindow("resume"); return ["Opening Resume.pdf..."]; }
    if (cmd === "contact") { openWindow("contact"); return ["Opening Contact window..."]; }
    return [`zsh: command not found: ${raw.trim()} (type 'help')`];
};

const Terminal = () => {
    const { openWindow } = useWindowStore();
    const [input, setInput] = useState("");
    const [hist, setHist] = useState([]);
    const [hIdx, setHIdx] = useState(-1);
    const [log, setLog] = useState(() => [
        { cmd: "show tech stack", out: techStack.map((s) => `${s.category.padEnd(14)}: ${s.items.join(", ")}`) },
        { cmd: "certs --verified", out: certifications.map((c, i) => `0${i + 1}. ${c.issuer.padEnd(10)} | ${c.title}`) },
    ]);
    const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [log]);

    const exec = (raw) => {
        const clean = raw.trim();
        if (!clean) return;
        if (clean.toLowerCase() === "clear") { setLog([]); setInput(""); return; }
        setHist((h) => [clean, ...h]);
        setHIdx(-1);
        setLog((l) => [...l, { cmd: clean, out: runCmd(clean, openWindow) }]);
        setInput("");
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); exec(input); }
        else if (e.key === "ArrowUp" && hist.length) {
            e.preventDefault();
            const n = Math.min(hist.length - 1, hIdx + 1);
            setHIdx(n);
            setInput(hist[n]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const n = hIdx - 1;
            setHIdx(n);
            setInput(n < 0 ? "" : hist[n]);
        }
    };

    return (
        <>
            <div id="window-header">
                <WindowControls target="terminal" />
                <h2>PX-OS Terminal — zsh</h2>
            </div>

            <div className="px-term">
                <div className="px-term-chips" role="toolbar" aria-label="Quick commands">
                    {QUICK.map((c) => (
                        <button key={c} type="button" onClick={() => exec(c)}>{c}</button>
                    ))}
                </div>

                <div className="px-term-body">
                    {log.map((entry, idx) => (
                        <div key={idx} className="px-term-entry">
                            <p className="px-term-cmd"><span>@aman ~ %</span> {entry.cmd}</p>
                            {entry.out.map((line, j) => <pre key={j}>{line}</pre>)}
                        </div>
                    ))}
                    <div className="px-term-prompt">
                        <span>@aman ~ %</span>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
                            placeholder="Type 'help', 'exp', 'certs', 'projects'..." aria-label="Terminal command input" />
                    </div>
                    <div ref={endRef} />
                </div>
            </div>
        </>
    );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;
