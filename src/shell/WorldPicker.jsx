import { useEffect } from "react";
import { worlds } from "#worlds/registry.js";

// Gallery of every world. Used by the machine ("Pick a world") and the coin slot ("Worlds").
const WorldPicker = ({ onSelect, onClose, current }) => {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div role="dialog" aria-modal="true" aria-label="All worlds"
            className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            style={{ fontFamily: "Geist, system-ui, sans-serif" }} onClick={onClose}>
            <div className="w-full max-w-2xl bg-[#0b0b0c] text-[#edeae3] border border-[#edeae3]/15 p-5 sm:p-7"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-baseline justify-between mb-5">
                    <p className="m-0 text-[11px] tracking-[.12em] uppercase text-[#8a8780]" style={{ fontFamily: "'Geist Mono', monospace" }}>PX‑01 / All worlds</p>
                    <button type="button" onClick={onClose} className="text-[13px] text-[#8a8780] hover:text-[#edeae3] underline underline-offset-4 py-2">Close</button>
                </div>
                <ul className="grid sm:grid-cols-2 gap-px bg-[#edeae3]/15 border border-[#edeae3]/15 list-none p-0 m-0">
                    {worlds.map((w, i) => (
                        <li key={w.id} className="bg-[#0b0b0c]">
                            <button type="button" onClick={() => { onClose(); onSelect(w.id); }}
                                className="group w-full text-left p-5 min-h-[44px] hover:bg-[#151515] transition-colors">
                                <span className="block text-[10px] tracking-[.12em] uppercase text-[#8a8780]" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                    W‑0{i + 1} {current === w.id ? "· current" : ""}
                                </span>
                                <span className="block mt-2 text-[22px] font-semibold tracking-[-0.03em]">{w.name} <span className="text-[#ff2e1f] inline-block transition-transform group-hover:translate-x-1">→</span></span>
                                <span className="block mt-1 text-[14px] text-[#edeae3]/70">{w.tagline}</span>
                                <span className="block mt-3 text-[10px] tracking-[.12em] uppercase text-[#8a8780]" style={{ fontFamily: "'Geist Mono', monospace" }}>{w.symbols.join(" · ")}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WorldPicker;
