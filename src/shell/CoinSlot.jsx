import { useState } from "react";
import { Dices, LayoutGrid, Link2, FileText } from "lucide-react";
import WorldPicker from "#shell/WorldPicker.jsx";
import { profile } from "#content/profile.js";

// The persistent escape hatch, same place in every world. Sits above any world's own stacking.
const CoinSlot = ({ current, onSpin, onSelect }) => {
    const [picking, setPicking] = useState(false);
    const [copied, setCopied] = useState(false);

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
            <nav aria-label="Portfolio worlds"
                className="fixed z-[10000] right-3 bottom-3 max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-[6.5rem] flex items-center gap-0.5 p-1 rounded-full bg-black/75 text-white backdrop-blur border border-white/15 font-georama shadow-lg">
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
