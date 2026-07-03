import { mobileDockApps } from "#constants";
import useMobileNavStore from "#store/mobileNav.js";

// Real iOS convention: dock icons carry no label (unlike springboard icons).
const MobileDock = () => {
    const { openApp } = useMobileNavStore();

    return (
        <div className="fixed bottom-5 inset-x-6 z-[60]">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl px-4 py-3 flex items-center justify-between">
                {mobileDockApps.map(({ id, name, icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => openApp(id)}
                        aria-label={name}
                        className="active:scale-90 transition-transform"
                    >
                        <img src={`/images/${icon}`} alt={name} className="size-14 rounded-2xl shadow-lg" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileDock;
