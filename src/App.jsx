import React from 'react'
import { Navbar, Welcome, Dock} from "#components"

import gsap from 'gsap';

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable)

import {Terminal} from '#windows';
import Snowfall from "react-snowfall/src";

const App = () => {
    return (
        <>
            <Snowfall color="#ffffff" />
            <main>
                <Navbar />
                <Welcome />
                <Dock />

                <Terminal />
            </main>
        </>
    )
}
export default App
