import { useEffect, useMemo, useRef, useState } from "react";
import { profile, socials } from "#content/profile.js";
import { onRepeat, topArtists, watching } from "#content/taste.js";
import { worlds } from "#worlds/registry.js";
import { work, KINDS, shot } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";
import { skillGroups } from "../../../content/skills.js";
import { cases } from "../../../content/cases.js";
import { certifications } from "../../../content/certifications.js";
import { Screensaver } from "./idle.jsx";
import { keyClick } from "./keyclick.js";
import { track } from "../../analytics.js";
import "./crt.css";

// World 4: tty1 · AHMEDABAD. A split-pane phosphor CRT workstation with tmux chrome, live project inspector,
// argument-level Tab completion, and 1-click recruiter fast-path.
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const secondsSince = (t) => Math.round((Date.now() - t) / 1000);
const live = work.filter((w) => w.live);
const THEMES = ["amber", "green", "plain"];

const POST = [
    "PX-01 BIOS v2026.11 · AHMEDABAD",
    `MEM CHECK ............ ${work.length} PROJECTS OK`,
    `NET .................. ${work.filter((w) => w.maintained).length} SITES IN PRODUCTION`,
    `CERTS ................ ${certifications.length} VERIFIED CREDENTIALS`,
    `ROLE ................. ${experience[0].role.toUpperCase()}`,
    "BOOTING tty1 .........",
];

function findProject(query = "") {
    const q = String(query).trim().toLowerCase();
    if (!q) return null;
    if (/^\d+$/.test(q)) return work[Number(q) - 1] || null;
    return (
        work.find((w) => w.slug.toLowerCase() === q) ||
        work.find((w) => w.slug.toLowerCase().includes(q) || w.title.toLowerCase().includes(q)) ||
        null
    );
}

const TerminalWorld = ({ shell }) => {
    const [log, setLog] = useState([]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [skip, setSkip] = useState(false);
    const [cursor, setCursor] = useState(-1);
    const [booting, setBooting] = useState(() => {
        try { return !reduced() && !sessionStorage.getItem("px01-tty"); } catch { return false; }
    });
    const [post, setPost] = useState(0);
    const [theme, setTheme] = useState("amber");
    const [shake, setShake] = useState(false);
    const [sound, setSound] = useState(false);
    const [idle, setIdle] = useState(0);
    const [inspected, setInspected] = useState(null);
    const [clock, setClock] = useState(() => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));

    const away = useRef(0);
    const bootedRef = useRef(false);
    const inputRef = useRef(null);
    const endRef = useRef(null);
    const id = useRef(0);

    useEffect(() => {
        const t = setInterval(() => {
            setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const cmd = (c, children) => (
        <button type="button" className="tty-cmd" onClick={() => run(c)}>{children || c}</button>
    );
    const ext = (href, children) => (
        <a className="tty-link" href={href} target="_blank" rel="noreferrer">{children}</a>
    );

    const row = (w, i) => (
        <div key={w.slug} className="tty-row">
            {cmd(`cat ${w.slug}`, <>[{String(i + 1).padStart(2, "0")}] {w.title}</>)}
            <span className="dim"> · {w.year}</span>
            {w.stack && <span className="tty-tag"> [{w.stack.split("·")[0].trim()}]</span>}
            {w.live && <span> · {ext(w.url, <>● {host(w.url)}</>)}</span>}
        </div>
    );

    const commands = {
        help: () => [
            <p key="h" className="dim">tap any highlighted word, or type it. Tab completes args, ↑↓ recalls, Ctrl+L clears, / focuses.</p>,
            ...[
                ["about", "sysinfo dossier & quick links"],
                ["projects", "all 26 builds (--live, --ai, --client)"],
                ["cat <slug|n>", "inspect project in CRT preview pane"],
                ["open <slug|n>", "launch project URL in new tab"],
                ["live", "13 production sites I maintain"],
                ["experience", "work history & client impact"],
                ["certs", "verified industry credentials"],
                ["skills", "full-stack, AI & 3D toolkit"],
                ["cv [role]", "tailored résumés (fullstack|frontend|ai)"],
                ["contact", "email, whatsapp & socials"],
                ["music", "what's on repeat"],
                ["worlds", "switch portfolio world (go <id>)"],
                ["theme <mode>", "amber | green | plain"],
                ["sound [on|off]", "mechanical key clicks"],
                ["clear", "clear terminal buffer (Ctrl+L)"],
                ["spin", "back to the slot machine"],
            ].map(([c, d]) => (
                <div key={c} className="tty-row">
                    {cmd(c.split(" ")[0], <>{c.padEnd(15)}</>)}
                    <span className="dim">{d}</span>
                </div>
            )),
        ],
        about: () => {
            setInspected(null);
            return [
                <p key="a" className="tty-h">{profile.name.toUpperCase()} — {experience[0].role.toUpperCase()}</p>,
                <p key="b">{profile.line}</p>,
                <p key="c" className="dim">
                    Now: {experience[0].org} ({experience[0].where}) · {work.length} shipped · {work.filter((w) => w.maintained).length} live in prod · {certifications.length} verified certs
                </p>,
                <p key="d" className="dim">Core stack: TypeScript · React · Next.js · Python · FastAPI · Three.js · PostgreSQL</p>,
                <p key="e">
                    Fast path: <a className="tty-link" href={profile.resume} target="_blank" rel="noreferrer">[Résumé PDF ↗]</a>{" "}
                    · <a className="tty-link" href={`mailto:${profile.email}`}>[Email]</a>{" "}
                    · {cmd("projects", "[All 26 Projects]")} · {cmd("live", "[13 Live Sites]")} · {cmd("certs", "[Certs]")} · {cmd("cv", "[Tailored CVs]")}
                </p>,
            ];
        },
        projects: (flag = "") => {
            const f = flag.toLowerCase();
            let filtered = work.map((w, i) => [w, i]);
            let label = "all 26 builds";
            if (f === "--live") { filtered = filtered.filter(([w]) => w.live); label = "live deployments"; }
            else if (f === "--ai") { filtered = filtered.filter(([w]) => /ai|python|llm|agent|rag/i.test(`${w.line} ${w.stack || ""}`)); label = "AI & backend"; }
            else if (f === "--client") { filtered = filtered.filter(([w]) => w.kind === "client"); label = "client websites"; }

            return [
                <p key="f" className="dim">
                    Filter: {cmd("projects", f ? "[all]" : "[*all]")} {cmd("projects --live", f === "--live" ? "[*live]" : "[live]")} {cmd("projects --ai", f === "--ai" ? "[*ai]" : "[ai]")} {cmd("projects --client", f === "--client" ? "[*client]" : "[client]")} — showing {filtered.length} ({label})
                </p>,
                ...Object.entries(KINDS).flatMap(([k, kLabel]) => {
                    const group = filtered.filter(([w]) => w.kind === k);
                    if (!group.length) return [];
                    return [
                        <p key={k} className="tty-h">── {kLabel.toLowerCase()} ({group.length}) ──</p>,
                        ...group.map(([w, i]) => row(w, i)),
                    ];
                }),
                <p key="t" className="dim">tap any project or run `cat &lt;slug|n&gt;` to load it into the inspector.</p>,
            ];
        },
        cat: (arg = "") => {
            if (arg === "about") return commands.about();
            const w = findProject(arg);
            if (!w) return [<p key="e">cat: {arg || "?"}: no such project. Try {cmd("projects")} or `cat pulse`.</p>];
            setInspected(w);
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
        open: (arg = "") => {
            const w = findProject(arg);
            if (!w?.url) return [<p key="e">open: no live URL for {arg || "?"}. Try {cmd("projects --live")}.</p>];
            setInspected(w);
            window.open(w.url, "_blank", "noopener");
            track("live_site_visited", { host: host(w.url) });
            return [<p key="o">opening {w.title} → {ext(w.url, <>{host(w.url)}</>)}</p>];
        },
        live: () => [
            <p key="h" className="dim">in production today, still maintained:</p>,
            ...work.filter((w) => w.maintained).map((w) => (
                <div key={w.slug} className="tty-row">
                    <span className="ok">●</span> {cmd(`cat ${w.slug}`, w.title)} <span className="dim">·</span> {ext(w.url, <>{host(w.url)} ↗</>)}
                </div>
            )),
        ],
        experience: () => experience.map((x) => (
            <div key={x.role} className="tty-block">
                <p className="tty-h">{x.when} · {x.role}</p>
                <p className="dim">{x.org} · {x.where}{x.stack ? ` · ${x.stack}` : ""}</p>
                <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
        )),
        certs: () => [
            <p key="h" className="dim">verified industry credentials ({certifications.length}):</p>,
            ...certifications.map((c, i) => (
                <div key={c.code} className="tty-row">
                    <span className="ok">[{String(i + 1).padStart(2, "0")}]</span> {c.title} <span className="dim">· {c.issuer} ({c.date})</span>{" "}
                    {c.url && ext(c.url, <>[verify ↗]</>)}
                </div>
            )),
        ],
        skills: () => skillGroups.map((g) => (
            <div key={g.group} className="tty-row">
                <span className="tty-h">{g.group.padEnd(16)}</span>
                <span>{g.items.map(([n]) => n).join(", ")}</span>
            </div>
        )),
        cv: (v) => {
            if (v && ["fullstack", "frontend", "ai"].includes(v)) {
                window.open(`/resume.html?for=${v}`, "_blank", "noopener");
                track("resume_opened", { from: "world", variant: v });
                return [<p key="o">opening the {v} résumé…</p>];
            }
            return [
                <p key="p">
                    pick one: <a className="tty-link" href="/resume.html?for=fullstack" target="_blank" rel="noreferrer">[full-stack]</a>{" "}
                    <a className="tty-link" href="/resume.html?for=frontend" target="_blank" rel="noreferrer">[frontend]</a>{" "}
                    <a className="tty-link" href="/resume.html?for=ai" target="_blank" rel="noreferrer">[ai products]</a>{" "}
                    <a className="tty-link" href={profile.resume} target="_blank" rel="noreferrer">[original pdf ↗]</a>
                </p>,
            ];
        },
        resume: () => commands.cv(),
        contact: () => [
            <p key="e">email    <a className="tty-link" href={`mailto:${profile.email}`}>{profile.email}</a></p>,
            <p key="w">whatsapp <a className="tty-link" href={profile.whatsapp} target="_blank" rel="noreferrer">{profile.phone}</a></p>,
            ...socials.map((s) => <p key={s.text}>{s.text.toLowerCase().padEnd(9)}{ext(s.link, <>{host(s.link.split("?")[0])}</>)}</p>),
        ],
        music: () => [
            ...onRepeat.slice(0, 8).map((t) => <p key={t.id}>♪ {t.title} <span className="dim">· {t.artist}</span></p>),
            <p key="r" className="dim">rotation: {topArtists.slice(0, 10).join(", ")}</p>,
        ],
        watching: () => [<p key="f">films: {watching.films.join(", ")}</p>, <p key="s">sitcoms: {watching.sitcoms.join(", ")}</p>],
        worlds: () => worlds.map((w) => <div key={w.id} className="tty-row">{cmd(`go ${w.id}`, w.id.padEnd(10))}<span className="dim">{w.tagline}</span></div>),
        go: (wid) => {
            if (!worlds.some((w) => w.id === wid)) return commands.worlds();
            setTimeout(() => shell.go(wid), 250);
            return [<p key="g">switching to {wid}…</p>];
        },
        spin: () => { setTimeout(shell.spin, 250); return [<p key="s">pulling the lever…</p>]; },
        theme: (t) => {
            if (!t) {
                const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
                setTheme(next);
                return [<p key="t">theme → {next} ({cmd("theme amber")} · {cmd("theme green")} · {cmd("theme plain")})</p>];
            }
            if (!THEMES.includes(t)) return [<p key="t">themes: {cmd("theme amber")} {cmd("theme green")} {cmd("theme plain")}</p>];
            setTheme(t);
            return [<p key="t">theme → {t}</p>];
        },
        whoami: () => [<p key="w">a visitor with good taste, apparently.</p>],
        man: (c) => [<p key="m">{c ? `${c}: it does what it says. Try it.` : "What manual page do you want?"} See {cmd("help")}.</p>],
        sudo: (...a) => a.join(" ") === "hire aman"
            ? [<p key="1">[sudo] verifying offer… <span className="tty-bar" aria-hidden /></p>, <p key="2">permission granted. send it to <a className="tty-link" href={`mailto:${profile.email}`}>{profile.email}</a></p>]
            : [<p key="n">nice try.</p>],
        rm: () => { if (!reduced()) { setShake(true); setTimeout(() => setShake(false), 500); } return [<p key="r">rm: permission denied. this portfolio is load-bearing.</p>]; },
        coffee: () => [<p key="c">brewing… the build runs on it.</p>],
        sound: (v) => {
            const on = v === "on" ? true : v === "off" ? false : !sound;
            setSound(on);
            if (on) keyClick(true);
            return [<p key="s">key sounds {on ? "on" : "off"}. {cmd(on ? "sound off" : "sound on")}</p>];
        },
        screensaver: () => { setTimeout(() => { away.current = Date.now(); setIdle(2); }, 300); return [<p key="z" className="dim">dimming the phosphor…</p>]; },
    };
    const alias = { ls: "projects", dir: "projects", exit: "spin", hire: "contact", "?": "help", cls: "clear" };

    function getCompletions(raw) {
        const val = raw.trimStart();
        if (!val) return [];
        const parts = val.split(/\s+/);
        if (parts.length === 1 && !raw.endsWith(" ")) {
            return [...Object.keys(commands), ...Object.keys(alias), "clear"].filter((c) => c.startsWith(parts[0].toLowerCase()));
        }
        const cmdName = (alias[parts[0].toLowerCase()] || parts[0].toLowerCase());
        const arg = raw.endsWith(" ") ? "" : (parts[1] || "").toLowerCase();
        if (cmdName === "cat" || cmdName === "open") {
            return work.map((w) => w.slug).filter((s) => s.startsWith(arg)).map((s) => `${parts[0]} ${s}`);
        }
        if (cmdName === "go") {
            return worlds.map((w) => w.id).filter((id_) => id_.startsWith(arg)).map((id_) => `go ${id_}`);
        }
        if (cmdName === "theme") {
            return THEMES.filter((t) => t.startsWith(arg)).map((t) => `theme ${t}`);
        }
        if (cmdName === "cv") {
            return ["fullstack", "frontend", "ai"].filter((v) => v.startsWith(arg)).map((v) => `cv ${v}`);
        }
        return [];
    }

    const ghost = useMemo(() => {
        if (!input) return "";
        const matches = getCompletions(input);
        if (matches.length >= 1 && matches[0].toLowerCase().startsWith(input.trimStart().toLowerCase())) {
            return matches[0].slice(input.trimStart().length);
        }
        return "";
    }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

    function run(raw) {
        const text = raw.trim();
        if (!text) return;
        let [name, ...args] = text.split(/\s+/);
        name = name.toLowerCase();
        if (name === "clear" || name === "cls") { setLog([]); return; }
        if (name === "cd") name = args[0] === ".." || args[0] === "~" ? "spin" : "projects";
        const fn = commands[alias[name] || name];
        const out = fn ? fn(...args) : [<p key="nf">{name}: command not found. Try {cmd("help")}.</p>];
        setSkip(false);
        setLog((l) => [...l, { id: id.current++, cmd: text, out }]);
        setHistory((h) => [text, ...h]);
        setCursor(-1);
    }

    useEffect(() => {
        if (!booting) {
            if (!bootedRef.current) {
                bootedRef.current = true;
                run("about");
            }
            return;
        }
        if (post < POST.length) { const t = setTimeout(() => setPost(post + 1), 220); return () => clearTimeout(t); }
        const t = setTimeout(() => { setBooting(false); try { sessionStorage.setItem("px01-tty", "1"); } catch { /* ignore */ } }, 600);
        return () => clearTimeout(t);
    }, [booting, post]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!booting) return;
        const skipBoot = () => { setPost(POST.length); setBooting(false); };
        window.addEventListener("keydown", skipBoot, { once: true });
        return () => window.removeEventListener("keydown", skipBoot);
    }, [booting]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end" });
        document.querySelectorAll(".tty-log > article:last-child .tty-out > *").forEach((el, idx) => {
            el.style.setProperty("--n", el.textContent.length);
            el.style.setProperty("--i", idx);
        });
    }, [log]);

    useEffect(() => {
        if (booting) return;
        const onGlobalKey = (e) => {
            if (e.key === "/" && document.activeElement !== inputRef.current && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onGlobalKey);
        return () => window.removeEventListener("keydown", onGlobalKey);
    }, [booting]);

    useEffect(() => {
        if (booting) return;
        let last = Date.now();
        const poke = () => { last = Date.now(); setIdle((v) => (v === 1 ? 0 : v)); };
        const t = setInterval(() => {
            const q = Date.now() - last;
            setIdle((v) => (v === 2 ? 2 : q > 45000 && !reduced() ? (away.current = last, 2) : q > 20000 ? 1 : v));
        }, 1000);
        const evs = ["keydown", "pointerdown", "pointermove", "scroll", "wheel"];
        evs.forEach((e) => window.addEventListener(e, poke, { passive: true }));
        return () => { clearInterval(t); evs.forEach((e) => window.removeEventListener(e, poke)); };
    }, [booting]);

    const wake = () => {
        const s = secondsSince(away.current);
        setIdle(0);
        setLog((l) => [...l, { id: id.current++, cmd: null, out: [<p key="w">welcome back. you were away {s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`} · while you were gone, {work.filter((w) => w.maintained).length} sites stayed up. try {cmd("sudo hire aman")}</p>] }]);
        inputRef.current?.focus();
    };

    const onKeyDown = (e) => {
        if (e.key !== "Enter") setSkip(true);
        if ((sound && e.key.length <= 1) || (sound && ["Enter", "Backspace"].includes(e.key))) keyClick(e.key === "Enter");

        if (e.ctrlKey && e.key.toLowerCase() === "l") {
            e.preventDefault();
            setLog([]);
            return;
        }
        if (e.ctrlKey && e.key.toLowerCase() === "c") {
            e.preventDefault();
            setLog((l) => [...l, { id: id.current++, cmd: `${input}^C`, out: [] }]);
            setInput("");
            return;
        }
        if (e.key === "Enter") { run(input); setInput(""); }
        else if (e.key === "ArrowUp" && history.length) { e.preventDefault(); const n = Math.min(cursor + 1, history.length - 1); setCursor(n); setInput(history[n]); }
        else if (e.key === "ArrowDown") { e.preventDefault(); const n = cursor - 1; setCursor(n); setInput(n < 0 ? "" : history[n]); }
        else if (e.key === "Tab") {
            e.preventDefault();
            const m = getCompletions(input);
            if (m.length === 1) setInput(m[0] + (m[0].includes(" ") ? "" : " "));
            else if (m.length > 1) setLog((l) => [...l, { id: id.current++, cmd: null, out: [<p key="m" className="dim">{m.slice(0, 12).join("  ")}</p>] }]);
        }
    };

    return (
        <div className={`tty tty-${theme}`} data-shake={shake || undefined} onClick={(e) => { if (!e.target.closest("a, button")) inputRef.current?.focus(); }}>
            <div className="tty-glass">
                <div className="tty-tmux" aria-label="Session status bar">
                    <span>[0:aman@px01] · ● {work.length} PROJECTS · {work.filter((w) => w.maintained).length} LIVE · AHMEDABAD</span>
                    <span className="tty-tmux-r">
                        <span>Tab · ↑↓ · Ctrl+L · /</span>
                        <button type="button" className="tty-cmd" onClick={() => run("theme")}>[{theme.toUpperCase()}]</button>
                        <span>{clock}</span>
                    </span>
                </div>

                {booting ? (
                    <div className="tty-boot" onClick={() => { setPost(POST.length); setBooting(false); }}>
                        {POST.slice(0, post).map((l) => <p key={l}>{l}</p>)}
                        {post >= POST.length && <p className="tty-big" aria-label="Aman">अमन</p>}
                        <p className="dim">press any key or tap to skip</p>
                    </div>
                ) : (
                    <div className="tty-split">
                        <div className="tty-main">
                            <header className="tty-head">
                                <p className="tty-big" aria-hidden>अमन</p>
                                <p>tty1 · AHMEDABAD · {profile.name.toUpperCase()} · {experience[0].role.toUpperCase()}</p>
                                <p className="dim">▸ tap anything highlighted, or type {cmd("help")}. Featured: {live.slice(0, 3).map((w, i) => <span key={w.slug}>{i ? " · " : ""}{cmd(`cat ${w.slug}`, w.title)}</span>)}</p>
                            </header>
                            <div className="tty-log" role="log" aria-live="polite" aria-label="Terminal output" data-skip={skip || undefined}>
                                {log.map((e) => (
                                    <article key={e.id}>
                                        {e.cmd && <p className="tty-echo"><span className="tty-ps">aman@tty1:~$</span> {e.cmd}</p>}
                                        <div className="tty-out">{e.out}</div>
                                    </article>
                                ))}
                            </div>
                            <label className="tty-input" htmlFor="tty-cmd-input">
                                <span className="tty-ps">aman@tty1:~$</span>
                                <span className="tty-input-wrap">
                                    <input
                                        id="tty-cmd-input"
                                        name="command"
                                        ref={inputRef}
                                        autoFocus
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={onKeyDown}
                                        placeholder={idle === 1 ? "try: sudo hire aman" : "type a command (e.g. projects, cat pulse, cv)…"}
                                        aria-label="Terminal command"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        spellCheck={false}
                                    />
                                    {ghost && <span className="tty-ghost" aria-hidden>{input}{ghost}</span>}
                                </span>
                            </label>
                            <div ref={endRef} />
                        </div>

                        <aside className="tty-inspector" aria-label="CRT Inspector">
                            {inspected ? (
                                <div className="tty-card">
                                    <div className="tty-card-hd">
                                        <span>INSPECTOR · {inspected.slug.toUpperCase()}</span>
                                        <button type="button" className="tty-cmd" onClick={() => setInspected(null)}>[sysinfo]</button>
                                    </div>
                                    <figure className="tty-shot tty-shot-side">
                                        <img src={shot(inspected, 480)} alt={`${inspected.title} preview`} />
                                    </figure>
                                    <p className="tty-h">{inspected.title}</p>
                                    <p className="dim">{KINDS[inspected.kind]} · {inspected.year}</p>
                                    <p className="tty-card-body">{inspected.line}</p>
                                    {inspected.stack && <p className="dim">STACK: {inspected.stack}</p>}
                                    {inspected.note && <p className="dim">{inspected.note}</p>}
                                    <div className="tty-card-actions">
                                        {inspected.url && ext(inspected.url, <>[visit {host(inspected.url)} ↗]</>)}
                                        {cases[inspected.slug] && <a className="tty-link" href={`/case.html?p=${inspected.slug}`}>[case study →]</a>}
                                    </div>
                                </div>
                            ) : (
                                <div className="tty-card">
                                    <div className="tty-card-hd">
                                        <span>SYSINFO · NEOFETCH</span>
                                        <span className="ok">● ONLINE</span>
                                    </div>
                                    <dl className="tty-kv">
                                        <div><dt>HOST</dt><dd>{profile.name} · Ahmedabad, IN</dd></div>
                                        <div><dt>ROLE</dt><dd>{experience[0].role} @ {experience[0].org}</dd></div>
                                        <div><dt>SHIPPED</dt><dd>{work.length} builds · {work.filter((w) => w.maintained).length} live in prod</dd></div>
                                        <div><dt>STACK</dt><dd>TS · React · Next · Python · Three.js</dd></div>
                                        <div><dt>CERTS</dt><dd>{certifications.length} verified ({certifications.map((c) => c.issuer.split(" ")[0]).join(", ")})</dd></div>
                                    </dl>
                                    <div className="tty-card-hd" style={{ marginTop: 14 }}>
                                        <span>RECRUITER FAST-PATH</span>
                                    </div>
                                    <div className="tty-card-actions">
                                        <a className="tty-link" href={profile.resume} target="_blank" rel="noreferrer">[Résumé PDF ↗]</a>
                                        <a className="tty-link" href={`mailto:${profile.email}`}>[Email]</a>
                                        {socials.slice(0, 2).map((s) => (
                                            <a key={s.text} className="tty-link" href={s.link} target="_blank" rel="noreferrer">[{s.text} ↗]</a>
                                        ))}
                                    </div>
                                    <div className="tty-card-hd" style={{ marginTop: 14 }}>
                                        <span>QUICK INSPECT</span>
                                    </div>
                                    <div className="tty-card-actions">
                                        {live.slice(0, 4).map((w) => (
                                            <button key={w.slug} type="button" className="tty-cmd" onClick={() => run(`cat ${w.slug}`)}>[{w.title}]</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </div>

            {!booting && (
                <nav className="tty-dock" aria-label="Quick commands">
                    {["projects", "live", "experience", "certs", "skills", "contact", "cv", "help", "clear"].map((c) => (
                        <button key={c} type="button" onClick={() => run(c)}>{c}</button>
                    ))}
                    <button type="button" onClick={() => run("theme")}>theme:{theme}</button>
                    <button type="button" aria-pressed={sound} onClick={() => run(sound ? "sound off" : "sound on")}>{sound ? "♪ on" : "♪ off"}</button>
                </nav>
            )}
            {idle === 2 && <Screensaver onWake={wake} />}
            <div className="tty-scan" aria-hidden />
        </div>
    );
};

export default TerminalWorld;
