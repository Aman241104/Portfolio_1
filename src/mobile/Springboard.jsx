import { mobileGridApps } from "#constants";
import useMobileNavStore from "#store/mobileNav.js";
import MobileDock from "#mobile/MobileDock.jsx";

const Springboard = () => {
    const { openApp } = useMobileNavStore();

    return (
        <div className="h-full w-full flex flex-col pt-16 pb-28 px-6">
            <div className="grid grid-cols-4 gap-y-6">
                {mobileGridApps.map(({ id, name, icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => openApp(id)}
                        className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                    >
                        <img
                            src={`/images/${icon}`}
                            alt={name}
                            className="size-14 rounded-2xl shadow-lg"
                        />
                        <span className="text-white text-xs font-medium drop-shadow">
                            {name}
                        </span>
                    </button>
                ))}
            </div>

            <MobileDock />
        </div>
    );
};

export default Springboard;
