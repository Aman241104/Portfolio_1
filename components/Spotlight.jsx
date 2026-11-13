import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowUpRight, Folder, Terminal, Award, Mail, FileText, Copy, Check } from "lucide-react";
import { work } from "../content/work.js";
import { certifications } from "../content/certifications.js";
import { profile, socials } from "../content/profile.js";
import { dockApps, locations } from "#constants";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";

const linkedin = socials.find((s) => s.text === "LinkedIn")?.link;

const Spotlight = ({ open, onClose }) => {
    const [q, setQ] = useState("");
    const [active, setActive] = useState(0);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);
    const { openWindow } = useWindowStore();
    const { setActiveLocation } = useLocationStore();

    useEffect(() => {
        if (open) {
            setQ("");
            setActive(0);
            setTimeout(() => inputRef.current?.focus(), 20);
        }
    }, [open]);

    const items = useMemo(() => {
        const list = [
            { id: "act-resume", group: "Quick Actions", title: "Open Résumé PDF", meta: "1-page technical CV", icon: FileText, run: () => openWindow("resume") },
            {
                id: "act-email", group: "Quick Actions", title: `Copy Email (${profile.email})`, meta: "Clipboard", icon: Copy,
                run: () => { navigator.clipboard?.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1400); }
            },
            { id: "act-github", group: "Quick Actions", title: "Open GitHub Profile", meta: "Aman241104", icon: ArrowUpRight, run: () => window.open(profile.github, "_blank", "noreferrer") },
            ...(linkedin ? [{ id: "act-li", group: "Quick Actions", title: "Open LinkedIn Profile", meta: "Verified profile", icon: ArrowUpRight, run: () => window.open(linkedin, "_blank", "noreferrer") }] : []),
            ...dockApps.filter((a) => a.canOpen).map((a) => ({
                id: `app-${a.id}`, group: "PX-OS Apps", title: a.name, meta: `Open ${a.id} window`, icon: Terminal,
                run: () => openWindow(a.id),
            })),
            ...certifications.map((c) => ({
                id: `cert-${c.id || c.title}`, group: "AI Certifications", title: `${c.issuer} — ${c.title}`, meta: `${c.date} · Verified`, icon: Award,
                run: () => window.open(c.url, "_blank", "noreferrer"),
            })),
            ...work.map((w) => ({
                id: `work-${w.slug}`, group: "Shipped Projects", title: w.title, meta: `${w.kind} · ${w.stack || w.year}`, icon: Folder,
                search: `${w.title} ${w.line} ${w.stack || ""} ${w.kind}`,
                run: () => {
                    if (w.url) window.open(w.url, "_blank", "noreferrer");
                    else { setActiveLocation(locations.work); openWindow("finder"); }
                },
            })),
        ];

        const query = q.trim().toLowerCase();
        if (!query) return list.slice(0, 14);
        return list.filter((it) => (`${it.title} ${it.meta} ${it.group} ${it.search || ""}`).toLowerCase().includes(query)).slice(0, 16);
    }, [q, openWindow, setActiveLocation]);

    useEffect(() => { setActive(0); }, [q]);

    if (!open) return null;

    const execute = (item) => {
        if (!item) return;
        item.run();
        if (item.id !== "act-email") onClose();
    };

    const onKeyDown = (e) => {
        if (e.key === "Escape") { e.preventDefault(); onClose(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(items.length - 1, i + 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
        else if (e.key === "Enter" && items[active]) { e.preventDefault(); execute(items[active]); }
    };

    return (
        <div className="px-spotlight-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="PX-OS Spotlight Search">
            <div className="px-spotlight" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
                <div className="px-spot-bar">
                    <Search size={16} aria-hidden />
                    <input ref={inputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)}
                        placeholder="Search 26 projects, 4 AI certs, apps, or actions…" aria-label="Spotlight search" />
                    <kbd>ESC</kbd>
                </div>
                <ul className="px-spot-list" role="listbox">
                    {items.length === 0 && <li className="px-spot-empty">No matches for &ldquo;{q}&rdquo;</li>}
                    {items.map((it, i) => {
                        const Icon = it.id === "act-email" && copied ? Check : it.icon;
                        return (
                            <li key={it.id} role="option" aria-selected={i === active}>
                                <button type="button" className={i === active ? "is-active" : ""} onMouseEnter={() => setActive(i)} onClick={() => execute(it)}>
                                    <span className="px-spot-l">
                                        <Icon size={15} aria-hidden />
                                        <b>{it.id === "act-email" && copied ? "Copied amanpatel2512006@gmail.com!" : it.title}</b>
                                    </span>
                                    <span className="px-spot-r">
                                        <small>{it.meta}</small>
                                        <em>{it.group}</em>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Spotlight;
