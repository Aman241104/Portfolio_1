import { useEffect, useState } from "react";
import { navLinks } from "../constants";
import useWindowStore from "#store/window.js";

// PX-OS menubar: the OS the slot machine runs. Mark, menus, availability and a live Ahmedabad clock.
const istTime = () => new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const Navbar = () => {
    const { openWindow } = useWindowStore();
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
                </ul>
            </div>
            <div>
                <p className="px-status"><i aria-hidden />Open to work</p>
                <time>{now} IST</time>
            </div>
        </nav>
    );
};
export default Navbar;
