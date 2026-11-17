import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowUpRight, Dices, FileText, Mail } from "lucide-react";
import { worlds } from "#worlds/registry.js";
import { profile } from "#content/profile.js";
import { work } from "#content/work.js";

const GROUPS = [
    { id: "all", label: "All (12)" },
    { id: "3d", label: "3D & Game", ids: ["ride", "arcade", "pocket"] },
    { id: "os", label: "OS & Retro", ids: ["desktop", "longhorn", "terminal", "y2001"] },
    { id: "editorial", label: "Editorial & AI", ids: ["editorial", "album", "mission", "ask", "canvas"] },
];

// Gallery of every world, shown as a rack of cartridges (library.jjangik.kr's numbered spines). Used by the machine,
// the coin slot, and ⌘K / Ctrl+K anywhere on the home page — typing also finds projects (aadi.is-a.dev's command menu).
const WorldPicker = ({ onSelect, onClose, current, onSpin }) => {
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState("all");
    const inputRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "/" && document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    const sorted = useMemo(
        () => [...worlds].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)),
        []
    );

    const filtered = useMemo(() => {
        const g = GROUPS.find((x) => x.id === group);
        const q = query.trim().toLowerCase();
        return sorted.filter((w) => {
            if (g?.ids && !g.ids.includes(w.id)) return false;
            if (!q) return true;
            return (
                w.name.toLowerCase().includes(q) ||
                w.tagline.toLowerCase().includes(q) ||
                w.symbols.join(" ").toLowerCase().includes(q) ||
                w.id.toLowerCase().includes(q)
            );
        });
    }, [sorted, group, query]);
    const projects = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return [];
        return work.filter((w) => `${w.title} ${w.stack || ""} ${w.line}`.toLowerCase().includes(q)).slice(0, 6);
    }, [query]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="All worlds"
            className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-5"
            style={{ fontFamily: "Geist, system-ui, sans-serif" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl max-h-[88dvh] sm:max-h-[84dvh] flex flex-col bg-[#0a0a0c] text-[#edeae3] border border-[#edeae3]/15 sm:rounded-2xl rounded-t-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sticky Header */}
                <div className="shrink-0 px-5 pt-4 pb-3 border-b border-[#edeae3]/10 bg-[#0d0d10]">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#ff2e1f] shadow-[0_0_8px_#ff2e1f]" />
                            <p className="m-0 text-[11px] tracking-[.14em] uppercase text-[#a39f96]" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                PX‑01 · {worlds.length} cartridges · ⌘K
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close worlds selector"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-[#a39f96] hover:text-[#edeae3] hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <span className="hidden sm:inline text-[10px] tracking-wider uppercase opacity-70" style={{ fontFamily: "'Geist Mono', monospace" }}>ESC</span>
                            <X size={15} />
                        </button>
                    </div>

                    {/* Search + Filter Pills */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2.5">
                        <label className="relative flex-1 block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8780] pointer-events-none" />
                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Find a world or a project…"
                                aria-label="Filter worlds"
                                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#141418] border border-[#edeae3]/12 text-[13px] text-[#edeae3] placeholder:text-[#7a7770] focus:outline-none focus:border-[#ff2e1f]/70"
                            />
                        </label>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
                            {GROUPS.map((g) => {
                                const active = group === g.id;
                                return (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => setGroup(g.id)}
                                        aria-pressed={active}
                                        className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] tracking-wide transition-colors cursor-pointer ${
                                            active
                                                ? "bg-[#edeae3] text-[#0a0a0c] font-medium"
                                                : "bg-[#141418] text-[#a39f96] hover:text-[#edeae3] border border-[#edeae3]/10"
                                        }`}
                                    >
                                        {g.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Scrollable Grid */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5" style={{ scrollbarColor: "rgba(237,234,227,.18) transparent" }}>
                    {projects.length > 0 && (
                        <ul className="list-none p-0 m-0 mb-4 border-y border-[#edeae3]/10">
                            {projects.map((w) => (
                                <li key={w.slug}>
                                    <a href={w.url || `/case.html?p=${w.slug}`} target={w.url ? "_blank" : undefined} rel="noreferrer"
                                        className="group flex items-center justify-between gap-3 py-2.5 border-b border-[#edeae3]/8 last:border-0 text-[#edeae3] no-underline">
                                        <span className="text-[14px] font-medium">{w.title}</span>
                                        <span className="text-[10px] tracking-[.06em] uppercase text-[#8a8780] group-hover:text-[#ff2e1f]" style={{ fontFamily: "'Geist Mono', monospace" }}>Project · {w.year} ↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {filtered.length === 0 && projects.length > 0 ? null : filtered.length === 0 ? (
                        <div className="py-12 text-center text-[#8a8780] text-[14px]">
                            No worlds match "{query}".{" "}
                            <button type="button" onClick={() => { setQuery(""); setGroup("all"); }} className="text-[#ff2e1f] underline underline-offset-4 cursor-pointer">
                                Reset filters
                            </button>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none p-0 m-0">
                            {filtered.map((w, i) => {
                                const isCurrent = current === w.id;
                                return (
                                    <li key={w.id}>
                                        <button
                                            type="button"
                                            onClick={() => { onClose(); onSelect(w.id); }}
                                            className={`group w-full h-full text-left rounded-[6px] border overflow-hidden transition-colors cursor-pointer flex flex-col active:scale-[.98] ${
                                                isCurrent ? "bg-[#151517] border-[#edeae3]/45" : "bg-[#111114] border-[#edeae3]/10 hover:border-[#edeae3]/30"
                                            }`}
                                        >
                                            {/* the cartridge label: each world's own paper colour, with grip ridges */}
                                            <span aria-hidden="true" className="block h-[10px] w-full" style={{ background: w.paper || "#222", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 1px, transparent 1px 6px)" }} />
                                            <span className="flex items-start gap-4 p-4 flex-1">
                                                <span className="shrink-0 text-[44px] leading-[.8] font-extrabold text-[#edeae3]/25 group-hover:text-[#edeae3]/60 transition-colors" style={{ fontFamily: "Archivo, Geist, sans-serif", fontStretch: "62%" }}>
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center justify-between gap-2">
                                                        <span className="block text-[17px] font-semibold tracking-[-0.02em] text-[#edeae3]">{w.name}</span>
                                                        <ArrowUpRight size={15} className="text-[#8a8780] group-hover:text-[#ff2e1f] transition-colors shrink-0" />
                                                    </span>
                                                    <span className="block mt-1 text-[13px] leading-snug text-[#edeae3]/60">{w.tagline}</span>
                                                    <span className="block mt-2.5 text-[10px] tracking-[.06em] uppercase text-[#8a8780]" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                        {w.symbols.join(" · ")}{w.featured ? " · Featured" : ""}{isCurrent ? " · Inserted" : ""}
                                                    </span>
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Sticky Recruiter & Studio Footer */}
                <div className="shrink-0 px-5 py-3 border-t border-[#edeae3]/10 bg-[#0d0d10] flex flex-wrap items-center justify-between gap-2 text-[12px]">
                    <div className="flex items-center gap-3 text-[#a39f96]">
                        <a href={profile.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#edeae3] transition-colors">
                            <FileText size={13} /> Résumé
                        </a>
                        <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-[#edeae3] transition-colors">
                            <Mail size={13} /> Email
                        </a>
                    </div>
                    {onSpin && (
                        <button
                            type="button"
                            onClick={() => { onClose(); onSpin(); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#edeae3]/10 hover:bg-[#ff2e1f] text-[#edeae3] hover:text-white text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
                            style={{ fontFamily: "'Geist Mono', monospace" }}
                        >
                            <Dices size={13} /> Back to Studio Machine
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorldPicker;
