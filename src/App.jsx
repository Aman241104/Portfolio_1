import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { setWorld } from "./analytics.js";
import { findWorld, worlds } from "#worlds/registry.js";
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
    url.searchParams.delete("p");   // a project deep link belongs to the world it was opened in
    history.replaceState(null, "", url);
};

// Simple luminance check so telemetry text on the portal shutter always has high contrast.
const isLightHex = (hex = "#0a0a0a") => {
    const h = hex.replace("#", "");
    if (h.length !== 6) return false;
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 145;
};

// the shutter is a printed ticket: a barcode drawn from the world's id (same bars every time)
const Barcode = ({ seed = "px01" }) => {
    let h = 7, x = 0; const bars = [];
    for (const ch of seed.repeat(6)) { h = (h * 31 + ch.charCodeAt(0)) >>> 0; const w = 1 + (h % 3); if (x + w > 180) break; if (h % 5) bars.push(<rect key={x} x={x} width={w} height="28" />); x += w + 1 + ((h >> 3) % 2); }
    return <svg className="world-portal-bars" viewBox="0 0 180 28" aria-hidden>{bars}</svg>;
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
        next.load?.();   // start fetching the world's chunk while the ticket feeds up (same import() the lazy component uses)
        transitionTo(
            { color: next.paper || "#0a0a0a", name: next.name, symbols: next.symbols?.join(" · ") || "PX-01", id: next.id, n: worlds.indexOf(next) + 1 },
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
            { color: "#050506", name: "Studio Machine", symbols: "PX-01 · REALITY SELECTOR", id: "studio", n: 0 },
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
            <div className="world-portal-hud">
                <span className="world-portal-kicker">PX‑01 · Ticket № {String(portal.n).padStart(2, "0")} · Now entering</span>
                <strong className="world-portal-name">{portal.name}</strong>
                <span className="world-portal-sym">{portal.symbols}</span>
                <Barcode seed={portal.id} />
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
