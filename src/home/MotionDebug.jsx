import { useEffect, useState } from "react";
import { CAMERA_SHOTS, detectQualityTier } from "../three/cinematography.js";

const isDebug = typeof location !== "undefined" && new URLSearchParams(location.search).get("motion") === "debug";

export default function MotionDebug({ phase, light }) {
    const [fps, setFps] = useState(60);
    const [tier] = useState(() => detectQualityTier());

    useEffect(() => {
        if (!isDebug) return;
        let frames = 0;
        let last = performance.now();
        let raf = 0;
        const tick = (now) => {
            frames++;
            if (now - last >= 500) {
                setFps(Math.round((frames * 1000) / (now - last)));
                frames = 0;
                last = now;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    if (!isDebug) return null;

    const shot = phase === "transitioning" ? CAMERA_SHOTS.REEL_MATCH_CUT.name : CAMERA_SHOTS.HERO_ESTABLISHING.name;

    return (
        <aside
            aria-label="Motion telemetry"
            style={{
                position: "fixed", left: 16, bottom: 16, zIndex: 9999,
                padding: "10px 14px", borderRadius: 8,
                background: "rgba(5, 5, 6, 0.86)", color: "#edeae3",
                border: "1px solid rgba(255, 46, 31, 0.45)",
                font: "500 11px/1.55 'Geist Mono', ui-monospace, monospace",
                pointerEvents: "none", backdropFilter: "blur(8px)",
            }}
        >
            <div style={{ color: "#ff2e1f", marginBottom: 4 }}>PX-01 // MOTION DEBUG</div>
            <div>FPS: {fps} · TIER: {tier.name} (DPR {tier.dpr[0]}–{tier.dpr[1]})</div>
            <div>PHASE: {phase} · THEME: {light ? "Gallery Atelier" : "Dark Studio"}</div>
            <div>SHOT: {shot}</div>
        </aside>
    );
}
