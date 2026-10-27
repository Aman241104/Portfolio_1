import { Suspense, useState } from "react";
import { findWorld } from "#worlds/registry.js";
import { getLast, setLast } from "#shell/storage.js";
import Machine from "#machine/Machine.jsx";
import CoinSlot from "#shell/CoinSlot.jsx";
import WorldBoundary from "#shell/WorldBoundary.jsx";

// First match wins: valid ?style= → last world this browser visited → the machine.
const initialWorld = () => {
    const fromUrl = findWorld(new URLSearchParams(location.search).get("style"));
    return (fromUrl ?? findWorld(getLast()))?.id ?? null;
};

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

    if (!world) return <Machine onSelect={go} />;

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
