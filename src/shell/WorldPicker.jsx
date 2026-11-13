import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowUpRight, Sparkles, Dices, FileText, Mail } from "lucide-react";
import { worlds } from "#worlds/registry.js";
import { profile } from "#content/profile.js";

const GROUPS = [
    { id: "all", label: "All (12)" },
    { id: "3d", label: "3D & Game", ids: ["ride", "arcade", "pocket"] },
    { id: "os", label: "OS & Retro", ids: ["desktop", "longhorn", "terminal", "y2001"] },
    { id: "editorial", label: "Editorial & AI", ids: ["editorial", "album", "mission", "ask", "canvas"] },
];

// Gallery of every world. Used by the machine ("Pick a world") and the coin slot ("Worlds").
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
                                PX‑01 // Reality Selector · {worlds.length} Worlds
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
                                placeholder="Filter worlds by vibe, era, or name…"
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
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
                    {filtered.length === 0 ? (
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
                                            className={`group w-full h-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                                isCurrent
                                                    ? "bg-[#171414] border-[#ff2e1f]/70 shadow-[0_0_0_1px_rgba(255,46,31,0.3)]"
                                                    : "bg-[#111114] border-[#edeae3]/10 hover:border-[#edeae3]/30 hover:bg-[#16161b]"
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="inline-flex items-center gap-2 text-[10px] tracking-[.12em] uppercase text-[#8a8780]" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full border border-white/25 shrink-0"
                                                            style={{ background: w.paper || "#111" }}
                                                            aria-hidden="true"
                                                        />
                                                        {w.featured ? (
                                                            <span className="inline-flex items-center gap-1 text-[#ff2e1f] font-medium"><Sparkles size={10} /> Featured</span>
                                                        ) : (
                                                            `W‑${String(i + 1).padStart(2, "0")}`
                                                        )}
                                                        {isCurrent && <span className="text-[#ff2e1f] font-semibold">· ACTIVE</span>}
                                                    </span>
                                                    <ArrowUpRight size={15} className="text-[#8a8780] group-hover:text-[#ff2e1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                                </div>
                                                <span className="block mt-2 text-[19px] font-semibold tracking-[-0.02em] text-[#edeae3] group-hover:text-white">
                                                    {w.name}
                                                </span>
                                                <span className="block mt-1 text-[13px] leading-snug text-[#edeae3]/65">
                                                    {w.tagline}
                                                </span>
                                            </div>
                                            <span className="block mt-3 pt-2.5 border-t border-[#edeae3]/8 text-[10px] tracking-[.12em] uppercase text-[#8a8780]" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                {w.symbols.join(" · ")}
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
