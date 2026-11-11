import { useRef } from "react";
import { mobileDockApps } from "#constants";
import useMobileNavStore from "#store/mobileNav.js";
import { APP_ICONS } from "#mobile/icons.js";
import { useLiquid } from "../liquid.js";

// PX-OS phone dock: one liquid-glass capsule (real lens on Chromium), line icons with short mono labels.
const LENS = { edge: 22, amount: 24, extra: "blur(2px) saturate(1.7) brightness(1.05)" };

const MobileDock = () => {
    const { openApp } = useMobileNavStore();
    const bar = useRef(null);
    useLiquid(bar, LENS);
    return (
        <nav className="px-dock-wrap fixed bottom-4 inset-x-4 z-[60]" aria-label="Dock">
            <div ref={bar} className="px-dock lg">
                {mobileDockApps.map(({ id, name }) => {
                    const Icon = APP_ICONS[id];
                    return (
                        <button key={id} type="button" onClick={() => openApp(id)} className={id === "resume" ? "is-hot" : undefined}>
                            <Icon size={24} strokeWidth={1.6} aria-hidden /><span>{name === "Resume" ? "CV" : name}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileDock;
