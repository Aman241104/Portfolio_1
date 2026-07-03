import { useEffect, useState } from "react";

const QUERY = "(max-width: 1023px)";

// Below 1024px (all phones, all iPads in both orientations) the desktop
// window layout genuinely clips — html/body has overflow:hidden and windows
// like Safari (w-4xl/896px) and Finder (w-3xl/768px) assume real desktop
// width. True conditional mount (not CSS-hide) so the unused tree's GSAP
// Draggable setup and Music's Spotify iframe never run/load at all.
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
    );

    useEffect(() => {
        const mql = window.matchMedia(QUERY);
        const onChange = (e) => setIsMobile(e.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
};

export default useIsMobile;
