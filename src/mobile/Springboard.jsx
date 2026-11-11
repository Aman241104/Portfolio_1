import { mobileGridApps } from "#constants";
import useMobileNavStore from "#store/mobileNav.js";
import MobileDock from "#mobile/MobileDock.jsx";
import { work, shot } from "../../content/work.js";
import { profile } from "#content/profile.js";
import { APP_ICONS } from "#mobile/icons.js";

const FEATURED = work.filter((w) => w.live).slice(0, 3);

const Springboard = () => {
    const { openApp } = useMobileNavStore();

    return (
        <div className="h-full w-full flex flex-col pt-14 pb-28 px-5 overflow-y-auto">
            {/* widgets: who + what, before any app icon */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button type="button" onClick={() => openApp("resume")} className="lg text-left rounded-3xl p-4 active:scale-[.97] transition">
                    <p className="text-[10px] uppercase tracking-widest text-emerald-300">● Open to work</p>
                    <p className="text-white text-lg font-semibold leading-tight mt-2">{profile.name}</p>
                    <p className="text-white/60 text-xs mt-1">Full-stack engineer · Ahmedabad</p>
                    <p className="text-white text-xs mt-3 underline underline-offset-4">Résumé →</p>
                </button>
                <button type="button" onClick={() => openApp("finder")} className="lg relative rounded-3xl overflow-hidden active:scale-[.97] transition">
                    {FEATURED.map((w, i) => (
                        <img key={w.slug} src={shot(w, 360)} alt="" className="absolute w-[86%] aspect-[4/3] object-cover object-top rounded-xl shadow-xl"
                            style={{ left: `${7 + i * 3}%`, top: `${10 + i * 12}%`, transform: `rotate(${(i - 1) * 5}deg)`, zIndex: 3 - i }} />
                    ))}
                    <p className="absolute left-3 bottom-2.5 z-10 text-white text-xs font-semibold drop-shadow">{work.length} projects →</p>
                </button>
            </div>
            <div className="grid grid-cols-4 gap-y-6">
                {mobileGridApps.map(({ id, name }) => {
                    const Icon = APP_ICONS[id];
                    return (
                        <button key={id} type="button" onClick={() => openApp(id)} className="px-app flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                            <span className="lg size-14 rounded-[18px] grid place-items-center"><Icon size={26} strokeWidth={1.5} aria-hidden /></span>
                            <span className="text-white/85 text-[11px] font-medium tracking-wide">{name}</span>
                        </button>
                    );
                })}
            </div>

            <MobileDock />
        </div>
    );
};

export default Springboard;
