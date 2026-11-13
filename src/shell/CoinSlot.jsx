import { useEffect, useRef, useState } from "react";
import { Dices, LayoutGrid, Link2, FileText, MessageCircle, Check } from "lucide-react";
import WorldPicker from "#shell/WorldPicker.jsx";
import { findWorld } from "#worlds/registry.js";
import { profile } from "#content/profile.js";
import { useLiquid } from "../liquid.js";

const LENS = { edge: 16, amount: 20 };

// The persistent escape hatch, same place in every world. Sits above any world's own stacking.
const CoinSlot = ({ current, onSpin, onSelect }) => {
    const [picking, setPicking] = useState(false);
    const [copied, setCopied] = useState(false);
    // phones: slide away while reading down, come back on any scroll up (scroll events don't bubble, so capture)
    const [hidden, setHidden] = useState(false);
    const last = useRef(new WeakMap());
    const pill = useRef(null);
    useLiquid(pill, LENS);

    const activeWorld = findWorld(current);

    useEffect(() => {
        if (!matchMedia("(max-width: 1023px)").matches) return;
        const onScroll = (e) => {
            const el = e.target === document ? document.scrollingElement : e.target;
            if (!el || typeof el.scrollTop !== "number") return;
            const y = el.scrollTop, prev = last.current.get(el) ?? 0;
            last.current.set(el, y);
            if (Math.abs(y - prev) < 6) return;
            setHidden(y > prev && y > 80);
        };
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        return () => document.removeEventListener("scroll", onScroll, { capture: true });
    }, []);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${location.origin}${location.pathname}?style=${current}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { /* clipboard blocked: the URL bar already has the link */ }
    };

    const btn = "inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-full hover:bg-white/15 active:scale-95 text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap";

    return (
        <>
            <nav
                ref={pill}
                aria-label="Portfolio worlds dock"
                data-hidden={hidden || undefined}
                className="coin-slot fixed z-[10000] right-3 bottom-3 max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-3 flex items-center gap-0.5 p-1.5 rounded-full bg-[#0b0b0e]/88 backdrop-blur-md border border-[#edeae3]/18 shadow-[0_14px_40px_rgba(0,0,0,0.55)] text-[#edeae3] font-georama transition-[translate,opacity] duration-300 max-lg:data-[hidden]:translate-y-[calc(100%+2rem)] max-lg:data-[hidden]:opacity-0"
            >
                <button type="button" className={btn} onClick={onSpin} title="Back to 3D Studio Machine">
                    <Dices size={14} className="text-[#ff2e1f]" />
                    <span className="max-sm:sr-only">Studio</span>
                </button>
                <span className="w-px h-4 bg-white/15 shrink-0" aria-hidden="true" />
                <button
                    type="button"
                    className={`${btn} bg-white/8 hover:bg-white/18`}
                    onClick={() => setPicking(true)}
                    title="Switch between all 12 worlds"
                >
                    <LayoutGrid size={14} />
                    <span>Worlds</span>
                    {activeWorld && (
                        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-[#ff2e1f]/20 text-[#ff6b5e] text-[10px] tracking-wider uppercase" style={{ fontFamily: "'Geist Mono', monospace" }}>
                            {activeWorld.name}
                        </span>
                    )}
                </button>
                <button type="button" className={`${btn} max-sm:hidden`} onClick={copyLink} title="Copy link to this world">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Link2 size={14} />}
                    <span>{copied ? "Copied" : "Link"}</span>
                </button>
                <a className={btn} href={profile.resume} target="_blank" rel="noreferrer">
                    <FileText size={14} />
                    <span>Résumé</span>
                </a>
                <a className={`${btn} max-sm:hidden`} href={profile.whatsapp} target="_blank" rel="noreferrer" title={`WhatsApp ${profile.phone}`}>
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                </a>
            </nav>
            {picking && <WorldPicker current={current} onSelect={onSelect} onClose={() => setPicking(false)} onSpin={onSpin} />}
        </>
    );
};

export default CoinSlot;
