import { Tooltip } from "react-tooltip";
import { APP_ICONS as ICONS } from "#mobile/icons.js";
import { dockApps } from "#constants/index.js";
import useWindowStore from "#store/window.js";

// PX-OS shelf: original line icons, labelled, a 2px lift on hover. (Was Apple PNGs + Gaussian magnification.)

const Dock = () => {
    const { openWindow, closeWindow, windows } = useWindowStore();
    const toggleApp = (id) => (windows[id]?.isOpen ? closeWindow(id) : openWindow(id));

    return (
        <section id="dock">
            <div className="dock-container">
                {dockApps.filter((a) => a.canOpen && ICONS[a.id]).map(({ id, name }) => {
                    const Icon = ICONS[id];
                    return (
                        <button key={id} type="button" className="dock-icon" aria-label={name} aria-pressed={!!windows[id]?.isOpen}
                            data-tooltip-id="dock-tooltip" data-tooltip-content={name} onClick={() => toggleApp(id)}>
                            <Icon strokeWidth={1.5} aria-hidden />
                            <span>{name}</span>
                        </button>
                    );
                })}
                <Tooltip id="dock-tooltip" place="top" className="tooltip" />
            </div>
        </section>
    );
};
export default Dock;
