import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene.jsx";

// Everything WebGL (renderer, three, rapier) sits behind this one lazy import, so RIDE's HTML shell — the start slip,
// the top bar — paints before ~1 MB of 3D has downloaded.
export default function Stage3D({ tier, ...props }) {
    return (
        <Canvas className="rd-canvas" shadows={tier.name !== "LOW" ? "soft" : false} dpr={tier.dpr} camera={{ fov: 30, near: 1, far: 400, position: [-24, 33, 68] }} gl={{ antialias: tier.name !== "LOW", powerPreference: "high-performance" }}>
            <Suspense fallback={null}><Scene {...props} tier={tier.name} /></Suspense>
        </Canvas>
    );
}
