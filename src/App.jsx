import { Suspense, useState } from "react";
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
    const world = findWorld(worldId);

    const go = (id) => {
        const next = findWorld(id);
        if (!next) return;
        setLast(next.id);
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
                <Suspense fallback={<p className="min-h-dvh flex items-center justify-center font-georama text-neutral-400">Loading {world.name}…</p>}>
                    <Component shell={{ go, spin: toMachine }} />
                </Suspense>
            </WorldBoundary>
            <CoinSlot current={world.id} onSpin={toMachine} onSelect={go} />
        </>
    );
};

export default App;
