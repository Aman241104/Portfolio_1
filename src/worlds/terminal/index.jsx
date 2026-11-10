import { useEffect, useRef, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { onRepeat, topArtists, watching } from "#content/taste.js";
import { worlds } from "#worlds/registry.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import "./crt.css";

// World 3: tty1 · AHMEDABAD. An amber-phosphor workstation. Every command prints real React nodes, so anything
// that looks like a link is one, and recruiters never have to type (tap a highlighted word or a chip in the dock).
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const live = work.filter((w) => w.live);
const POST = [
    "PX-01 BIOS v2026.11 · AHMEDABAD",
    `MEM CHECK ............ ${work.length} PROJECTS OK`,
    `NET .................. ${work.filter((w) => w.maintained).length} SITES IN PRODUCTION`,
    `ROLE ................. ${experience[0].role.toUpperCase()}`,
    "BOOTING tty1 .........",
];

const TerminalWorld = ({ shell }) => {
    const [log, setLog] = useState([]);              // [{ id, cmd, out: ReactNode[] }]
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [cursor, setCursor] = useState(-1);
    const [booting, setBooting] = useState(() => { try { return !reduced() && !sessionStorage.getItem("px01-tty"); } catch { return false; } });
    const [post, setPost] = useState(0);
    const [theme, setTheme] = useState("amber");
    const [shake, setShake] = useState(false);
    const inputRef = useRef(null);
    const endRef = useRef(null);
    const id = useRef(0);

    const cmd = (c, children) => <button type="button" className="tty-cmd" onClick={() => run(c)}>{children || c}</button>;
    const ext = (href, children) => <a className="tty-link" href={href} target="_blank" rel="noreferrer">{children}</a>;
    const row = (w, i) => (
        <div key={w.slug} className="tty-row">
            {cmd(`cat ${i + 1}`, <>[{String(i + 1).padStart(2, "0")}] {w.title}</>)}
            <span className="dim"> · {w.year}</span>
            {w.live && <span> · {ext(w.url, <>● {host(w.url)}</>)}</span>}
        </div>
    );

    const commands = {
        help: () => [
            <p key="h" className="dim">tap any highlighted word, or type it. Tab completes, ↑ recalls.</p>,
            ...[["about", "who I am"], ["projects", "everything I've built (ls)"], ["cat <n>", "one project, with a preview"], ["live", "production sites I maintain"],
                ["experience", "where I've worked"], ["skills", "toolkit"], ["cv", "tailored résumés"], ["contact", "email + socials"],
                ["music", "what's on repeat"], ["worlds", "other ways to see this site"], ["theme", "amber | green | plain"], ["spin", "back to the machine (exit)"]]
                .map(([c, d]) => <div key={c} className="tty-row">{cmd(c.split(" ")[0], <>{c.padEnd(12)}</>)}<span className="dim">{d}</span></div>),
        ],
        about: () => [
            <p key="a">{profile.name}: full-stack engineer in Ahmedabad. {profile.line}</p>,
            <p key="b" className="dim">Now: {experience[0].role} at {experience[0].org}. Open to on-site or hybrid roles.</p>,
            <p key="c">Next: {cmd("projects")} · {cmd("live")} · {cmd("cv")}</p>,
        ],
        projects: () => Object.entries(KINDS).flatMap(([k, label]) => [
            <p key={k} className="tty-h">── {label.toLowerCase()} ──</p>,
            ...work.map((w, i) => [w, i]).filter(([w]) => w.kind === k).map(([w, i]) => row(w, i)),
        ]).concat(<p key="t" className="dim">tap a project for its preview.</p>),
        cat: (arg = "") => {
            if (arg === "about") return commands.about();
            const w = work[Number(arg) - 1];
            if (!w) return [<p key="e">cat: {arg || "?"}: no such project. Try {cmd("projects")}.</p>];
            return [
                <figure key="f" className="tty-shot"><img src={shot(w, 480)} alt={`${w.title} screenshot`} loading="lazy" /></figure>,
                <p key="t" className="tty-h">{w.title} <span className="dim">· {KINDS[w.kind]} · {w.year}</span></p>,
                <p key="l">{w.line}</p>,
                w.stack && <p key="s" className="dim">stack: {w.stack}</p>,
                w.note && <p key="n" className="dim">{w.note}</p>,
                <p key="x">
                    {w.url && ext(w.url, <>[visit {host(w.url)} ↗]</>)}
                    {cases[w.slug] && <> <a className="tty-link" href={`/case.html?p=${w.slug}`}>[read the case study →]</a></>}
                </p>,
            ].filter(Boolean);
        },
        open: (n) => {
            const w = work[Number(n) - 1];
            if (!w?.url) return [<p key="e">open: no project {n ?? ""}. Try {cmd("projects")}.</p>];
            window.open(w.url, "_blank", "noopener");
            return [<p key="o">opening {w.title} → {ext(w.url, <>{host(w.url)}</>)}</p>];
        },
        live: () => [<p key="h" className="dim">in production today, still maintained:</p>, ...work.filter((w) => w.maintained).map((w) => (
            <div key={w.slug} className="tty-row"><span className="ok">●</span> {ext(w.url, <>{w.title}</>)} <span className="dim">{host(w.url)}</span></div>
        ))],
        experience: () => experience.map((x) => (
            <div key={x.role} className="tty-block">
                <p className="tty-h">{x.when} · {x.role}</p>
                <p className="dim">{x.org} · {x.where}</p>
                <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
        )),
        skills: () => skillGroups.map((g) => <div key={g.group} className="tty-row"><span className="tty-h">{g.group.padEnd(16)}</span><span>{g.items.map(([n]) => n).join(", ")}</span></div>),
        cv: (v) => {
            if (v && ["fullstack", "frontend", "ai"].includes(v)) { window.open(`/resume.html?for=${v}`, "_blank", "noopener"); return [<p key="o">opening the {v} résumé…</p>]; }
            return [<p key="p">pick one: <a className="tty-link" href="/resume.html?for=fullstack">[full-stack]</a> <a className="tty-link" href="/resume.html?for=frontend">[frontend]</a> <a className="tty-link" href="/resume.html?for=ai">[ai products]</a> <a className="tty-link" href={profile.resume} target="_blank" rel="noreferrer">[original pdf]</a></p>];
        },
        resume: () => commands.cv(),
        contact: () => [
            <p key="e">email   <a className="tty-link" href={`mailto:${profile.email}`}>{profile.email}</a></p>,
            ...socials.map((s) => <p key={s.text}>{s.text.toLowerCase().padEnd(8)}{ext(s.link, <>{host(s.link.split("?")[0])}</>)}</p>),
        ],
        music: () => [...onRepeat.slice(0, 8).map((t) => <p key={t.id}>♪ {t.title} <span className="dim">· {t.artist}</span></p>), <p key="r" className="dim">rotation: {topArtists.slice(0, 10).join(", ")}</p>],
        watching: () => [<p key="f">films: {watching.films.join(", ")}</p>, <p key="s">sitcoms: {watching.sitcoms.join(", ")}</p>],
        worlds: () => worlds.map((w) => <div key={w.id} className="tty-row">{cmd(`go ${w.id}`, w.id.padEnd(10))}<span className="dim">{w.tagline}</span></div>),
        go: (wid) => {
            if (!worlds.some((w) => w.id === wid)) return commands.worlds();
            setTimeout(() => shell.go(wid), 250); return [<p key="g">switching to {wid}…</p>];
        },
        spin: () => { setTimeout(shell.spin, 250); return [<p key="s">pulling the lever…</p>]; },
        theme: (t) => {
            if (!["amber", "green", "plain"].includes(t)) return [<p key="t">themes: {cmd("theme amber")} {cmd("theme green")} {cmd("theme plain")}</p>];
            setTheme(t); return [<p key="t">theme → {t}</p>];
        },
        whoami: () => [<p key="w">a visitor with good taste, apparently.</p>],
        man: (c) => [<p key="m">{c ? `${c}: it does what it says. Try it.` : "What manual page do you want?"} See {cmd("help")}.</p>],
        sudo: (...a) => a.join(" ") === "hire aman"
            ? [<p key="1">[sudo] verifying offer… <span className="tty-bar" aria-hidden /></p>, <p key="2">permission granted. send it to <a className="tty-link" href={`mailto:${profile.email}`}>{profile.email}</a></p>]
            : [<p key="n">nice try.</p>],
        rm: () => { if (!reduced()) { setShake(true); setTimeout(() => setShake(false), 500); } return [<p key="r">rm: permission denied. this portfolio is load-bearing.</p>]; },
        coffee: () => [<p key="c">brewing… the build runs on it.</p>],
    };
    const alias = { ls: "projects", dir: "projects", exit: "spin", hire: "contact", "?": "help" };

    function run(raw) {
        const text = raw.trim();
        if (!text) return;
        let [name, ...args] = text.split(/\s+/);
        name = name.toLowerCase();
        if (name === "clear") { setLog([]); return; }
        if (name === "cd") name = args[0] === ".." || args[0] === "~" ? "spin" : "projects";
        const fn = commands[alias[name] || name];
        const out = fn ? fn(...args) : [<p key="nf">{name}: command not found. Try {cmd("help")}.</p>];
        setLog((l) => [...l, { id: id.current++, cmd: text, out }]);
        setHistory((h) => [text, ...h]);
        setCursor(-1);
    }

    // boot (once per session) → `about`, so nobody lands on an empty prompt
    useEffect(() => {
        if (!booting) { if (!log.length) run("about"); return; }
        if (post < POST.length) { const t = setTimeout(() => setPost(post + 1), 260); return () => clearTimeout(t); }
        const t = setTimeout(() => { setBooting(false); try { sessionStorage.setItem("px01-tty", "1"); } catch { /* ignore */ } }, 700);
        return () => clearTimeout(t);
    }, [booting, post]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!booting) return;
        const skip = () => { setPost(POST.length); setBooting(false); };
        window.addEventListener("keydown", skip, { once: true });
        return () => window.removeEventListener("keydown", skip);
    }, [booting]);
    useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [log]);

    const onKeyDown = (e) => {
        if (e.key === "Enter") { run(input); setInput(""); }
        else if (e.key === "ArrowUp" && history.length) { e.preventDefault(); const n = Math.min(cursor + 1, history.length - 1); setCursor(n); setInput(history[n]); }
        else if (e.key === "ArrowDown") { e.preventDefault(); const n = cursor - 1; setCursor(n); setInput(n < 0 ? "" : history[n]); }
        else if (e.key === "Tab") {
            e.preventDefault();
            const m = [...Object.keys(commands), ...Object.keys(alias)].filter((c) => c.startsWith(input.trim()));
            if (m.length === 1) setInput(m[0] + " ");
            else if (m.length > 1) setLog((l) => [...l, { id: id.current++, cmd: null, out: [<p key="m" className="dim">{m.join("  ")}</p>] }]);
        }
    };

    return (
        <div className={`tty tty-${theme}`} data-shake={shake || undefined} onClick={(e) => { if (!e.target.closest("a, button")) inputRef.current?.focus(); }}>
            <div className="tty-glass">
                {booting ? (
                    <div className="tty-boot" onClick={() => { setPost(POST.length); setBooting(false); }}>
                        {POST.slice(0, post).map((l) => <p key={l}>{l}</p>)}
                        {post >= POST.length && <p className="tty-big" aria-label="Aman">अमन</p>}
                        <p className="dim">press any key or tap to skip</p>
                    </div>
                ) : (
                    <>
                        <header className="tty-head">
                            <p className="tty-big" aria-hidden>अमन</p>
                            <p>tty1 · AHMEDABAD · {profile.name.toUpperCase()} · {experience[0].role.toUpperCase()}</p>
                            <p className="dim">▸ tap anything highlighted, or type {cmd("help")}. Featured: {live.slice(0, 3).map((w, i) => <span key={w.slug}>{i ? " · " : ""}{ext(w.url, <>{w.title}</>)}</span>)}</p>
                        </header>
                        <div className="tty-log" role="log" aria-live="polite" aria-label="Terminal output">
                            {log.map((e) => (
                                <article key={e.id}>
                                    {e.cmd && <p className="tty-echo"><span className="tty-ps">aman@tty1:~$</span> {e.cmd}</p>}
                                    <div className="tty-out">{e.out}</div>
                                </article>
                            ))}
                        </div>
                        <label className="tty-input">
                            <span className="tty-ps">aman@tty1:~$</span>
                            <input ref={inputRef} autoFocus value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
                                aria-label="Terminal command" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                        </label>
                        <div ref={endRef} />
                    </>
                )}
            </div>
            {!booting && (
                <nav className="tty-dock" aria-label="Quick commands">
                    {["projects", "live", "experience", "skills", "contact", "cv", "help"].map((c) => (
                        <button key={c} type="button" onClick={() => run(c)}>{c}</button>
                    ))}
                </nav>
            )}
            <div className="tty-scan" aria-hidden />
        </div>
    );
};

export default TerminalWorld;
