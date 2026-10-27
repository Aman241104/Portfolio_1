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
        <div role="dialog" aria-modal="true" aria-label="Pick a world"
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-georama"
            onClick={onClose}>
            <div className="w-full max-w-2xl rounded-2xl bg-neutral-900 text-white border border-white/10 p-5"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Pick a world</h2>
                    <button type="button" onClick={onClose} className="text-sm text-neutral-400 hover:text-white">Close</button>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3">
                    {worlds.map((w) => (
                        <li key={w.id}>
                            <button type="button" onClick={() => { onClose(); onSelect(w.id); }}
                                className="w-full text-left rounded-xl p-4 bg-white/5 hover:bg-white/10 border border-white/10"
                                style={current === w.id ? { borderColor: w.accent } : undefined}>
                                <span className="block font-semibold" style={{ color: w.accent }}>{w.name}</span>
                                <span className="block text-sm text-neutral-400">{w.tagline}</span>
                                <span className="block mt-2 text-[10px] uppercase tracking-widest text-neutral-500">{w.symbols.join(" · ")}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WorldPicker;
