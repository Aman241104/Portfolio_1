import { useEffect, useRef, useState } from "react";
import { Dices, LayoutGrid, Link2, FileText } from "lucide-react";
import WorldPicker from "#shell/WorldPicker.jsx";
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

    const btn = "flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-xs";

    return (
        <>
            <nav ref={pill} aria-label="Portfolio worlds"
                data-hidden={hidden || undefined}
                className="coin-slot fixed z-[10000] right-3 bottom-3 max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-[6.5rem] flex items-center gap-0.5 p-1 rounded-full lg text-white font-georama transition-[translate,opacity] duration-300 max-lg:data-[hidden]:translate-y-[calc(100%+7rem)] max-lg:data-[hidden]:opacity-0">
                <button type="button" className={btn} onClick={onSpin} title="Back to the machine"><Dices size={14} /> Spin</button>
                <button type="button" className={btn} onClick={() => setPicking(true)} title="All worlds"><LayoutGrid size={14} /> Worlds</button>
                <button type="button" className={`${btn} max-sm:hidden`} onClick={copyLink} title="Copy link to this world"><Link2 size={14} /> {copied ? "Copied" : "Link"}</button>
                <a className={btn} href={profile.resume} target="_blank" rel="noreferrer"><FileText size={14} /> Résumé</a>
            </nav>
            {picking && <WorldPicker current={current} onSelect={onSelect} onClose={() => setPicking(false)} />}
        </>
    );
};

export default CoinSlot;
