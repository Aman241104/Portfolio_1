import useWindowStore from "#store/window.js";

// PX-OS window controls: text glyphs, all three do something (minimise = put away, maximise = fill the desktop).
const WindowControls = ({ target }) => {
    const { closeWindow } = useWindowStore();
    const maximise = (e) => e.currentTarget.closest(".os-window")?.classList.toggle("is-max");

    return (
        <div id="window-controls">
            <button type="button" className="px-ctl" aria-label="Minimise" onClick={() => closeWindow(target)}>–</button>
            <button type="button" className="px-ctl" aria-label="Maximise" onClick={maximise}>□</button>
            <button type="button" className="px-ctl close" aria-label="Close" onClick={() => closeWindow(target)}>×</button>
        </div>
    );
};
export default WindowControls;
