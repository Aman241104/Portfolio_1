import { Suspense, useEffect, useState } from "react";
import { setWorld } from "./analytics.js";
import { findWorld } from "#worlds/registry.js";
import { setLast } from "#shell/storage.js";
import Machine from "#machine/Machine.jsx";
import Home from "./home/Home.jsx";
import CoinSlot from "#shell/CoinSlot.jsx";
import WorldBoundary from "#shell/WorldBoundary.jsx";

// `/` always opens on the machine; only an explicit ?style= link goes straight into a world.
const initialWorld = () => findWorld(new URLSearchParams(location.search).get("style"))?.id ?? null;

// The 3D home needs WebGL 2; without it the CSS machine still spins and lands.
const hasWebGL = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();

const syncUrl = (id) => {
    const url = new URL(location.href);
    if (id) url.searchParams.set("style", id);
    else url.searchParams.delete("style");
    history.replaceState(null, "", url);
};

const App = () => {
    const [worldId, setWorldId] = useState(initialWorld);
    const [wipe, setWipe] = useState(false);   // only when arriving from the machine, never on a direct link
    const world = findWorld(worldId);
    useEffect(() => { setWorld(world?.id); }, [world]);

    const go = (id) => {
        const next = findWorld(id);
        if (!next) return;
        setLast(next.id);
        setWipe(!world);
        syncUrl(next.id);
        setWorldId(next.id);
    };

    const toMachine = () => {
        syncUrl(null);
        setWorldId(null);
    };

    if (!world) return hasWebGL ? <Home onSelect={go} /> : <Machine onSelect={go} />;

    const { Component } = world;
    return (
        <>
            <WorldBoundary key={world.id}>
                {/* One continuous move from the machine: the curtain faded to this world's paper, the loading screen holds
                    that colour, and once the world is mounted the colour wipes up off it. */}
                <Suspense fallback={<div className="world-wipe hold" style={{ background: world.paper }}><p>Loading {world.name}…</p></div>}>
                    <Component shell={{ go, spin: toMachine }} />
                    {wipe && <div className="world-wipe" style={{ background: world.paper }} aria-hidden />}
                </Suspense>
            </WorldBoundary>
            <CoinSlot current={world.id} onSpin={toMachine} onSelect={go} />
        </>
    );
};

export default App;
