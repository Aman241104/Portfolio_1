import React from 'react'
import { Navbar, Welcome, Dock} from "#components"
import Snowfall from "react-snowfall/src";

const App = () => {
    return (
        <>
            <Snowfall color="#ffffff" />
            <main>
                <Navbar />
                <Welcome />
                <Dock />
            </main>
        </>
    )
}
export default App
