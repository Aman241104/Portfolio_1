import React from 'react'
import {Navbar, Welcome, Dock, Home} from "#components"

import gsap from 'gsap';

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable)

import {Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos, Game, Music} from '#windows';
import Snowfall from "react-snowfall/src";
import useIsMobile from "#hooks/useIsMobile.js";
import MobileRoot from "#mobile/MobileRoot.jsx";

const App = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileRoot />;
    }

    return (
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
    )
}
export default App
