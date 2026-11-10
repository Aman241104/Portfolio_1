import { useEffect, useRef, useState } from "react";
import { profile, projects, skills, socials } from "#content/profile.js";
import { onRepeat, topArtists, watching } from "#content/taste.js";
import { worlds } from "#worlds/registry.js";
import { work, KINDS } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";

// World 3: a shell. Everything is a command; `help` lists them.
const BANNER = [
    "PORTFOLIO.exe — aman@portfolio (tty1)",
    `${profile.name}: ${profile.role}.`,
    "Type `help` to see what you can do. Tab completes.",
    "",
];

const commands = ({ go, spin }) => ({
    help: () => [
        "about           who I am",
        "projects        what I've built   (open <n> to visit one)",
        "experience      where I've worked + education",
        "live            production sites I maintain",
        "cv [version]    tailored résumé: fullstack | frontend | ai",
        "skills          toolkit",
        "music           what's on repeat",
        "watching        films + sitcoms",
        "contact         email + socials",
        "resume          open my résumé",
        "worlds          list portfolio worlds   (go <world> to switch)",
        "spin            back to the machine",
        "clear           clear the screen",
    ],
    about: () => [profile.line, "", "Currently: AI products, multi-agent systems, interfaces with motion."],
    whoami: () => ["a visitor with good taste, apparently."],
    projects: () => Object.entries(KINDS).flatMap(([k, label]) => [
        `── ${label.toLowerCase()} ──`,
        ...projects.map((p, i) => [p, i]).filter(([, i]) => work[i]?.kind === k)
            .map(([p, i]) => `[${String(i + 1).padStart(2)}] ${innerWidth < 640 ? `${p.title} · ${p.date}` : `${p.title.padEnd(36)} ${p.date}`}${work[i].live ? "  ● live" : ""}`),
        "",
    ]).concat(["`open <n>` to visit one."]),
    experience: () => experience.flatMap((x) => [`${x.when} · ${x.role} · ${x.org}`, ...x.points.map((p) => `  - ${p}`), ""]),
    live: () => work.filter((w) => w.maintained).map((w) => `● ${innerWidth < 640 ? `${w.title}\n  ` : w.title.padEnd(34)} ${w.url.replace(/^https?:\/\/(www\.)?/, "")}`),
    cv: (v = "fullstack") => {
        if (!["fullstack", "frontend", "ai"].includes(v)) return ["cv: pick one of fullstack | frontend | ai"];
        window.open(`/resume.html?for=${v}`, "_blank", "noopener");
        return [`opening the ${v} résumé…`];
    },
    hire: () => [`great choice. résumé: \`cv\` · email: ${profile.email}`, "or try `sudo hire aman`."],
    open: (n) => {
        const p = projects[Number(n) - 1];
        if (!p) return [`open: no project ${n ?? ""}. Try \`projects\`.`];
        window.open(p.link, "_blank", "noopener");
        return [`opening ${p.title} → ${p.link}`];
    },
    skills: () => skills.map((s) => `${s.category.padEnd(12)} ${s.items.join(", ")}`),
    music: () => [...onRepeat.slice(0, 8).map((t) => `♪ ${t.title} — ${t.artist}`), "", `rotation: ${topArtists.slice(0, 10).join(", ")}`],
    watching: () => [`films:   ${watching.films.join(", ")}`, `sitcoms: ${watching.sitcoms.join(", ")}`],
    contact: () => [`email    ${profile.email}`, ...socials.map((s) => `${s.text.padEnd(8)} ${s.link.split("?")[0]}`)],
    resume: () => { window.open(profile.resume, "_blank", "noopener"); return ["opening résumé…"]; },
    worlds: () => worlds.map((w) => `${w.id.padEnd(10)} ${w.tagline}`),
    go: (id) => { setTimeout(() => go(id), 250); return [`switching to ${id}…`]; },
    spin: () => { setTimeout(spin, 250); return ["pulling the lever…"]; },
    sudo: (...args) => args.join(" ") === "hire aman"
        ? ["[sudo] permission granted.", `send the offer to ${profile.email} 🫡`]
        : ["nice try."],
});

const TerminalWorld = ({ shell }) => {
    const [lines, setLines] = useState(BANNER);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [cursor, setCursor] = useState(-1);
    const inputRef = useRef(null);
    const endRef = useRef(null);
    const cmds = commands(shell);

    useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [lines]);

    const run = (raw) => {
        const [name, ...args] = raw.trim().split(/\s+/);
        const echo = `aman@portfolio:~$ ${raw}`;
        if (!name) return setLines((l) => [...l, echo]);
        if (name === "clear") return setLines([]);
        const fn = cmds[name.toLowerCase()];
        const out = fn ? fn(...args) : [`${name}: command not found. Try \`help\`.`];
        setLines((l) => [...l, echo, ...out, ""]);
        setHistory((h) => [raw, ...h]);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") { run(input); setInput(""); setCursor(-1); }
        else if (e.key === "ArrowUp" && history.length) {
            e.preventDefault();
            const next = Math.min(cursor + 1, history.length - 1);
            setCursor(next); setInput(history[next]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = cursor - 1;
            setCursor(next); setInput(next < 0 ? "" : history[next]);
        } else if (e.key === "Tab") {
            e.preventDefault();
            const match = Object.keys(cmds).filter((c) => c.startsWith(input.trim()));
            if (match.length === 1) setInput(match[0] + " ");
            else if (match.length > 1) setLines((l) => [...l, match.join("  ")]);
        }
    };

    return (
        <div className="min-h-dvh bg-[#0b0f0b] text-[#9ef0a8] font-roboto text-sm sm:text-[15px] p-4 sm:p-8 pb-24 cursor-text"
            onClick={() => inputRef.current?.focus()}>
            {/* tappable commands: typing on a phone keyboard is no fun */}
            <div className="flex flex-wrap gap-2 mb-4" aria-label="Quick commands">
                {["help", "projects", "experience", "live", "skills", "contact", "cv"].map((c) => (
                    <button key={c} type="button" onClick={(e) => { e.stopPropagation(); run(c); }}
                        className="border border-[#9ef0a8]/40 rounded px-2 py-1 text-xs hover:bg-[#9ef0a8]/10 active:bg-[#9ef0a8]/20">{c}</button>
                ))}
            </div>
            <pre className="whitespace-pre-wrap break-words leading-relaxed">{lines.join("\n")}</pre>
            <label className="flex gap-2">
                <span className="text-[#5eead4] shrink-0">aman@portfolio:~$</span>
                <input
                    ref={inputRef}
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Terminal command"
                    autoCapitalize="off" autoCorrect="off" spellCheck={false}
                    className="flex-1 bg-transparent outline-none caret-[#9ef0a8]"
                />
            </label>
            <div ref={endRef} />
        </div>
    );
};

export default TerminalWorld;
