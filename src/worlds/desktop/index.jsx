import { useEffect, useState } from "react";
import "./desktop.css";
import { Navbar, Welcome, Dock, Home } from "#components";
import DesktopWallpaper from "../../../components/DesktopWallpaper.jsx";
import Spotlight from "../../../components/Spotlight.jsx";

import gsap from 'gsap';

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable)

import {Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos, Game, Music} from '#windows';
import useIsMobile from "#hooks/useIsMobile.js";
import MobileRoot from "#mobile/MobileRoot.jsx";

const WALLPAPERS = ["signal", "grid", "minimal"];

// World 1: PX-OS desktop (and its iOS layout on phones).
const DesktopWorld = () => {
    const isMobile = useIsMobile();
    const [spotlight, setSpotlight] = useState(false);
    const [wallpaperIdx, setWallpaperIdx] = useState(0);
    const wallpaper = WALLPAPERS[wallpaperIdx];

    useEffect(() => {
        if (isMobile) return;
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setSpotlight((o) => !o);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isMobile]);

    return (
        <div className="world-desktop">
            {isMobile ? <MobileRoot /> : (
                <>
                    <main>
                        <DesktopWallpaper mode={wallpaper} />
                        <Navbar onSpotlight={() => setSpotlight(true)} wallpaper={wallpaper} onCycleWallpaper={() => setWallpaperIdx((i) => (i + 1) % WALLPAPERS.length)} />
                        <Welcome />
                        <Dock />

                        <Terminal />
                        <Safari />
                        <Resume />
                        <Finder />
                        <Text />
                        <Image />
                        <Contact />
                        <Photos />
                        <Game />
                        <Music />

                        <Home onSpotlight={() => setSpotlight(true)} />
                        <Spotlight open={spotlight} onClose={() => setSpotlight(false)} />
                    </main>
                </>
            )}
        </div>
    )
}
export default DesktopWorld
