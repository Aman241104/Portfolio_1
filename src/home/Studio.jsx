import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float, PresentationControls, SpotLight, Sparkles, Preload } from "@react-three/drei";
import { Machine, GlassSurface } from "#machine/MachineModel.jsx";
import Keychains from "./Keychains.jsx";

// Hero: PX-01 floating in a black void under one volumetric key light (docs/DESIGN_DIRECTION.md §10–11).
// The canvas is transparent so the giant "Portfolio" word in the DOM sits behind the machine.
// Intro (once `lit`): the machine drops in through the beam, spins once and settles; the key light ramps up.

const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const KEY = 340;                       // key light intensity at full power (physical units, decay 2)
const REEL_WINDOW = new THREE.Vector3(0, 0.42, 0);
const clamp01 = (x) => THREE.MathUtils.clamp(x, 0, 1);
const outCubic = (k) => 1 - Math.pow(1 - k, 3);
const outBack = (k, s = 1.4) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);

// Seconds since `on` first became true (null before). Every intro beat is timed from this one clock.
const useSince = (on) => {
    const t0 = useRef(null);
    return (clock) => {
        if (!on) return null;
        if (t0.current === null) t0.current = clock.elapsedTime;
        return clock.elapsedTime - t0.current;
    };
};

const KeyLight = ({ lit, onBooted }) => {
    const ref = useRef();
    const since = useSince(lit);
    const done = useRef(false);
    useFrame(({ clock }) => {
        const t = since(clock);
        const k = reduced ? 1 : t === null ? 0 : clamp01((t - 0.35) / 1.4);
        ref.current.intensity = KEY * outCubic(k);
        if (k === 1 && !done.current) { done.current = true; onBooted(); }
    });
    return (
        <SpotLight ref={ref} position={[0.4, 8.5, 2.2]} angle={0.36} penumbra={0.75} distance={16}
            attenuation={11} anglePower={5} opacity={0.32} radiusTop={0.15} radiusBottom={4.2} color="#fff3e6" intensity={0} />
    );
};

// The drop: from above the frame, through the beam, one turn, a little overshoot, then hand over to Float.
const Entrance = ({ lit, innerRef: ref, children }) => {
    const since = useSince(lit);
    useFrame(({ clock }) => {
        const t = since(clock);
        const k = reduced ? 1 : t === null ? 0 : clamp01(t / 1.5);
        ref.current.position.y = (1 - outBack(k, 1.2)) * 9;
        ref.current.rotation.y = (1 - outCubic(k)) * Math.PI * 1.5;
        ref.current.visible = k > 0;
    });
    return <group ref={ref} visible={false}>{children}</group>;
};

// Soft light pool far below the machine, with a shadow that tightens as the machine bobs down.
const poolTexture = (stops) => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([at, col]) => gr.addColorStop(at, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
};
const FLOOR_Y = -3.4;
const Ground = ({ floatRef, dropRef }) => {
    const shadow = useRef();
    const tex = useMemo(() => ({
        pool: poolTexture([[0, "rgba(255,236,214,.16)"], [0.45, "rgba(255,236,214,.05)"], [1, "rgba(255,236,214,0)"]]),
        shadow: poolTexture([[0, "rgba(0,0,0,.9)"], [0.5, "rgba(0,0,0,.45)"], [1, "rgba(0,0,0,0)"]]),
    }), []);
    useFrame(() => {
        const y = (floatRef.current?.position.y ?? 0) + (dropRef.current?.position.y ?? 0);
        const s = 1 + y * 0.6;
        shadow.current.scale.set(s, s, 1);
        shadow.current.material.opacity = THREE.MathUtils.clamp(0.45 - y * 0.6, 0, 0.6);
    });
    return (
        <group position={[0, FLOOR_Y, 0]} rotation-x={-Math.PI / 2}>
            <mesh><planeGeometry args={[12, 7]} /><meshBasicMaterial map={tex.pool} transparent depthWrite={false} toneMapped={false} /></mesh>
            <mesh ref={shadow} position-z={0.01}><planeGeometry args={[5.4, 2.6]} /><meshBasicMaterial map={tex.shadow} transparent depthWrite={false} /></mesh>
        </group>
    );
};

// A short red-warm flash from the reel window when the reels come to rest on a world.
const WinFlash = ({ jackpot }) => {
    const ref = useRef();
    const t = useRef(9);
    const was = useRef(false);
    useFrame((_, dt) => {
        if (jackpot && !was.current) t.current = 0;
        was.current = !!jackpot;
        t.current += dt;
        ref.current.intensity = 60 * Math.exp(-t.current * 3) * (t.current < 4 ? 1 : 0);
    });
    return <pointLight ref={ref} position={[0, 0.5, 2.2]} color="#ff5a3c" distance={9} intensity={0} />;
};

// The machine leans a little toward the cursor, like it's paying attention.
const Lean = ({ children }) => {
    const ref = useRef();
    useFrame(({ pointer, clock }, dt) => {
        if (reduced) return;
        // no mouse on touch screens: a slow idle sway instead
        const px = matchMedia("(pointer: coarse)").matches ? Math.sin(clock.elapsedTime * 0.35) * 0.6 : pointer.x;
        ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, -0.32 + px * 0.28, 3, dt);
        ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, 0.06 - pointer.y * 0.1, 3, dt);
    });
    return <group ref={ref} rotation={[0.06, -0.32, 0]}>{children}</group>;
};

// Camera: machine in the top ~60% (the word owns the bottom), backs off on narrow screens so the whole
// machine + lever fits, eases with the cursor, and on `entering` pushes into the reel window.
// Base framing for a screen shape: camera distance (narrow screens back off so the machine + lever fit)
// and where it looks (machine in the top ~60%). Shared with the keychain placement.
const TAN = Math.tan(THREE.MathUtils.degToRad(15));
export const framing = (aspect) => ({
    // phones: the machine fills ~80% of the width and sits at the visual centre, keychains hang above it
    dist: Math.max(aspect > 2.1 ? 11.6 : 12.6, (aspect < 0.8 ? 2.3 : 2.55) / (TAN * aspect)),
    lookY: aspect < 0.8 ? -0.75 : aspect < 1.2 ? -1.1 : -0.45,
});

// Product-reveal light sweep: a bright strip glides across the environment so a highlight runs over every
// chrome edge, once after power-on and then every 7 s. (Desktop only: it re-renders the env cube each frame.)
const Sweep = ({ lit }) => {
    const ref = useRef();
    const since = useSince(lit);
    useFrame(({ clock }) => {
        const t = since(clock);
        const k = t === null || reduced ? 1 : ((t - 2.2) % 7) / 1.8;          // 0..1 during a pass
        ref.current.visible = k >= 0 && k <= 1;
        ref.current.position.x = THREE.MathUtils.lerp(-9, 9, THREE.MathUtils.smoothstep(k, 0, 1));
    });
    return <Lightformer ref={ref} form="rect" intensity={9} position={[0, 1, 5]} rotation-z={0.35} scale={[0.6, 12, 1]} visible={false} />;
};
const Rig = ({ entering }) => {
    const pos = useMemo(() => new THREE.Vector3(), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ camera, pointer, size }, dt) => {
        const { dist, lookY } = framing(size.width / size.height);
        if (entering) { pos.copy(REEL_WINDOW).setZ(2.4); look.copy(REEL_WINDOW); }
        else {
            pos.set(pointer.x * 0.6, 0.2 + pointer.y * 0.3, dist);
            look.set(0, lookY, 0);
        }
        const k = entering ? 2.2 : 2.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, k, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, k, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, k, dt);
        camera.lookAt(look);
    });
    return null;
};

// Screen positions of the lever knob and the reel window, so DOM annotations ("pull me", the result circle)
// stay pinned to the real 3D parts while the machine floats, leans and is dragged around.
const KNOB = new THREE.Vector3(1.8, 1.46, 0.05), WIN_L = new THREE.Vector3(-1.45, 0.42, 0.85), WIN_R = new THREE.Vector3(1.45, 0.42, 0.85);
const Anchors = ({ onAnchors }) => {
    const ref = useRef();
    const v = useMemo(() => new THREE.Vector3(), []);
    const n = useRef(0);
    useFrame(({ camera, size }) => {
        if (!onAnchors || n.current++ % 2) return;                    // every other frame is plenty
        const px = (local) => {
            ref.current.localToWorld(v.copy(local)).project(camera);
            return [(v.x * 0.5 + 0.5) * size.width, (-v.y * 0.5 + 0.5) * size.height];
        };
        const [kx, ky] = px(KNOB), [lx, ly] = px(WIN_L), [rx, ry] = px(WIN_R);
        onAnchors({ kx, ky, wx: (lx + rx) / 2, wy: (ly + ry) / 2, ww: Math.hypot(rx - lx, ry - ly) });
    });
    return <group ref={ref} />;
};

// Reports the first rendered frame (after Preload compiled every shader), which ends the boot screen.
const FirstFrame = ({ onFrame }) => {
    const done = useRef(false);
    useFrame(() => { if (!done.current) { done.current = true; onFrame?.(); } });
    return null;
};

export default function Studio({ spinning, pulled, booted, target, entering, jackpot, lit, onPull, onArm, onReelStop, onAnchors, onBooted, onFrame, onCreated, active }) {
    const floatRef = useRef();
    const dropRef = useRef();
    useEffect(() => { onCreated?.(); }, [onCreated]);
    const coarse = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;

    return (
        <Canvas className="studio" frameloop={active ? "always" : "never"} dpr={coarse ? [1, 1.5] : [1, 1.75]}
            camera={{ position: [0, 0.2, 14], fov: 30 }}
            gl={{ alpha: true, antialias: true, toneMapping: THREE.AgXToneMapping, toneMappingExposure: 1.3 }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
            <GlassSurface />
            <Rig entering={entering} />
            <KeyLight lit={lit} onBooted={onBooted} />
            <WinFlash jackpot={jackpot} />

            {/* rims: cool from behind-left, warm from behind-right, so every edge of the case is drawn in light */}
            <directionalLight position={[-6, 3, -5]} intensity={2.6} color="#cfe0ff" />
            <directionalLight position={[6, 1.5, -4]} intensity={1.8} color="#ffd6b0" />
            <directionalLight position={[2, 2, 9]} intensity={0.35} />
            {/* separation: a cool top rim and a faint red kicker from below-behind (ties the machine to the red ink) */}
            <directionalLight position={[0, 7, -5]} intensity={1.6} color="#dfe8ff" />
            <directionalLight position={[0, -3, -6]} intensity={1.3} color="#ff3a22" />
            <hemisphereLight args={["#ffffff", "#000000", 0.12]} />

            {/* reflections come only from these strips: chrome reads as bright bars on black, the product-shot look */}
            <Environment resolution={coarse ? 128 : 256} frames={coarse || reduced ? 1 : Infinity}>
                {!coarse && <Sweep lit={lit} />}
                <Lightformer form="rect" intensity={2.2} position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[7, 3, 1]} />
                <Lightformer form="rect" intensity={5} position={[-5, 1, -1]} rotation-y={Math.PI / 2.4} scale={[0.5, 7, 1]} />
                <Lightformer form="rect" intensity={3} color="#ffd9b8" position={[5, 1, -1]} rotation-y={-Math.PI / 2.4} scale={[0.5, 7, 1]} />
                <Lightformer form="rect" intensity={0.7} position={[0, -1.5, 7]} scale={[9, 0.3, 1]} />
                <Lightformer form="ring" intensity={1.2} position={[2.5, 3, 6]} scale={1.2} />
            </Environment>

            {/* dust hanging in the beam */}
            {!reduced && <Sparkles count={coarse ? 40 : 80} scale={[3.6, 7, 3]} position={[0.2, 1.2, 0.6]} size={2.2} speed={0.25} opacity={0.55} color="#fff1df" noise={0.6} />}

            <Entrance lit={lit} innerRef={dropRef}>
                    <Float ref={floatRef} enabled={!reduced} speed={1.3} rotationIntensity={0.18} floatIntensity={0.55} floatingRange={[-0.18, 0.18]}>
                        <PresentationControls global={false} cursor={!entering} snap speed={1.4} polar={[-0.35, 0.35]} azimuth={[-0.9, 0.9]} damping={0.25}>
                            <Lean>
                                <Machine spinning={spinning} pulled={pulled} booted={booted} target={target} onPull={onPull} onArm={onArm} onReelStop={onReelStop} />
                                <Anchors onAnchors={onAnchors} />
                            </Lean>
                        </PresentationControls>
                    </Float>
            </Entrance>
            <Keychains lit={lit} jackpot={jackpot} framing={framing} />
            <Ground floatRef={floatRef} dropRef={dropRef} />
            <FirstFrame onFrame={onFrame} />
            <Preload all />
        </Canvas>
    );
}
