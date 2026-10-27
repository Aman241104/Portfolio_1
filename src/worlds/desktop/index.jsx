import "./desktop.css";
import {Navbar, Welcome, Dock, Home} from "#components";

import gsap from 'gsap';

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable)

import {Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos, Game, Music} from '#windows';
import Snowfall from "react-snowfall/src";
import useIsMobile from "#hooks/useIsMobile.js";
import MobileRoot from "#mobile/MobileRoot.jsx";

// World 1: the original macOS desktop (and its iOS layout on phones), unchanged.
const DesktopWorld = () => {
    const isMobile = useIsMobile();

    return (
        <div className="world-desktop">
            {isMobile ? <MobileRoot /> : (
                <>
                    <Snowfall color="#ffffff" />
                    <main>
                        <Navbar />
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

                        <Home />
                    </main>
                </>
            )}
        </div>
    )
}
export default DesktopWorld
