"use client";

import { useEffect, useRef, useState } from "react";
import { profile, projects, skills, socials } from "@content/profile.js";
import { onRepeat, topArtists, watching } from "@content/taste.js";
import { worlds } from "@worlds/registry.js";
import { useShell } from "@shell/WorldShell";

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
    projects: () => projects.map((p, i) => `[${i + 1}] ${p.title.padEnd(42)} ${p.date}`),
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

const TerminalWorld = () => {
    const shell = useShell();
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
