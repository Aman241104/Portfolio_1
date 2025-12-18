import React from 'react'
import { Navbar, Welcome} from "#components"
import Snowfall from "react-snowfall/src";

const App = () => {
    return (
        <>
            <Snowfall color="#ffffff" />
            <main>
                    <Navbar />
                    <Welcome />
                {/*</snowfall>*/}
            </main>
        </>
    )
}
export default App
