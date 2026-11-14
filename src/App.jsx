import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { setWorld } from "./analytics.js";
import { findWorld } from "#worlds/registry.js";
import { setLast } from "#shell/storage.js";
const Machine = lazy(() => import("#machine/Machine.jsx"));   // only for browsers without WebGL 2 (keeps GSAP off every other page)
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

// Simple luminance check so telemetry text on the portal shutter always has high contrast.
const isLightHex = (hex = "#0a0a0a") => {
    const h = hex.replace("#", "");
    if (h.length !== 6) return false;
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 145;
};

const App = () => {
    const [worldId, setWorldId] = useState(initialWorld);
    const [portal, setPortal] = useState(null);   // { phase: "in" | "out", color, name, symbols }
    const timers = useRef([]);
    const world = findWorld(worldId);

    useEffect(() => {
        setWorld(world?.id);
        document.documentElement.style.setProperty("--paper0", world?.paper ?? "#0a0a0a");
    }, [world]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const transitionTo = (target, apply) => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            apply();
            window.scrollTo(0, 0);
            setPortal(null);
            return;
        }
        setPortal({ phase: "in", ...target });
        const t1 = setTimeout(() => {
            apply();
            window.scrollTo(0, 0);
            // Wait two animation frames so heavy WebGL/DOM mounts settle behind the shutter before sliding out at 60fps
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setPortal((p) => (p ? { ...p, phase: "out" } : null));
                });
            });
        }, 320);
        const t2 = setTimeout(() => setPortal(null), 780);
        timers.current = [t1, t2];
    };

    const go = (id) => {
        const next = findWorld(id);
        if (!next || next.id === worldId) return;
        transitionTo(
            { color: next.paper || "#0a0a0a", name: next.name, symbols: next.symbols?.join(" · ") || "PX-01" },
            () => {
                setLast(next.id);
                syncUrl(next.id);
                setWorldId(next.id);
            }
        );
    };

    const toMachine = () => {
        if (!worldId) return;
        transitionTo(
            { color: "#050506", name: "Studio Machine", symbols: "PX-01 · REALITY SELECTOR" },
            () => {
                syncUrl(null);
                setWorldId(null);
            }
        );
    };

    const portalOverlay = portal && (
        <div
            className={`world-portal world-portal--${portal.phase}`}
            style={{ "--portal-bg": portal.color, "--portal-fg": isLightHex(portal.color) ? "#111113" : "#edeae3" }}
            aria-hidden="true"
        >
            <div className="world-portal-edge" />
            <div className="world-portal-hud">
                <span className="world-portal-kicker">PX‑01 // REALITY SHIFT</span>
                <strong className="world-portal-name">{portal.name}</strong>
                <span className="world-portal-sym">{portal.symbols}</span>
            </div>
        </div>
    );

    if (!world) {
        return (
            <>
                {hasWebGL ? <Home onSelect={go} /> : <Suspense fallback={null}><Machine onSelect={go} /></Suspense>}
                {portalOverlay}
            </>
        );
    }

    const { Component } = world;
    return (
        <>
            <WorldBoundary key={world.id}>
                <Suspense fallback={<div className="world-wipe hold" style={{ background: world.paper }}><p>Loading {world.name}…</p></div>}>
                    <div className="world-stage">
                        <Component shell={{ go, spin: toMachine }} />
                    </div>
                </Suspense>
            </WorldBoundary>
            <CoinSlot current={world.id} onSpin={toMachine} onSelect={go} />
            {portalOverlay}
        </>
    );
};

export default App;
