import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { navLinks, locations } from "../constants";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";

// PX-OS menubar: the OS the slot machine runs. Mark, menus, Spotlight ⌘K, wallpaper switcher, availability and a live Ahmedabad clock.
const istTime = () => new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const Navbar = ({ onSpotlight, wallpaper, onCycleWallpaper }) => {
    const { openWindow } = useWindowStore();
    const { setActiveLocation } = useLocationStore();
    const [now, setNow] = useState(istTime);
    useEffect(() => { const t = setInterval(() => setNow(istTime()), 20000); return () => clearInterval(t); }, []);

    return (
        <nav className="px-menubar">
            <div>
                <p className="px-mark"><i aria-hidden />PX-OS</p>
                <ul>
                    {navLinks.map(({ id, name, type }) => (
                        <li key={id}><button type="button" onClick={() => openWindow(type)}>{name}</button></li>
                    ))}
                    <li>
                        <button type="button" onClick={() => { setActiveLocation(locations.certs); openWindow("finder"); }}>Certs (4)</button>
                    </li>
                </ul>
            </div>
            <div>
                <button type="button" className="px-menu-pill" onClick={onSpotlight} title="Search ⌘K">
                    <Search size={12} aria-hidden />
                    <span>Search</span>
                    <kbd>⌘K</kbd>
                </button>
                <button type="button" className="px-menu-pill" onClick={onCycleWallpaper} title="Switch wallpaper">
                    <span>BG: {wallpaper}</span>
                </button>
                <p className="px-status"><i aria-hidden />Open to work</p>
                <time>{now} IST</time>
            </div>
        </nav>
    );
};
export default Navbar;
