import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Float, PresentationControls, SpotLight, Sparkles, Preload } from "@react-three/drei";
import { Machine, GlassSurface, mat } from "#machine/MachineModel.jsx";
import Keychains from "./Keychains.jsx";

// Hero: PX-01 floating in a black void under one volumetric key light (docs/DESIGN_DIRECTION.md §10–11).
// The canvas is transparent so the giant "Portfolio" word in the DOM sits behind the machine.
// Intro (once `lit`): the machine drops in through the beam, spins once and settles; the key light ramps up.

const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const KEY = 340;                       // key light intensity at full power (physical units, decay 2)
const REEL_WINDOW = new THREE.Vector3(0, 0.42, 0);
const DIVE = new THREE.Vector3(0, 0.42, 3.2);
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

const KeyLight = ({ lit, light, onBooted }) => {
    const ref = useRef();
    const since = useSince(lit);
    const done = useRef(false);
    const col = useMemo(() => new THREE.Color("#fff3e6"), []);
    const targetCol = useMemo(() => new THREE.Color(), []);
    useFrame(({ clock }, dt) => {
        const t = since(clock);
        const k = reduced ? 1 : t === null ? 0 : clamp01((t - 0.1) / 0.9);
        const baseKey = light ? 440 : KEY;
        ref.current.intensity = THREE.MathUtils.damp(ref.current.intensity, baseKey * outCubic(k), 6, dt);
        targetCol.set(light ? "#fffaf0" : "#fff3e6");
        col.lerp(targetCol, 1 - Math.exp(-6 * dt));
        ref.current.color.copy(col);
        ref.current.opacity = THREE.MathUtils.damp(ref.current.opacity, light ? 0.14 : 0.32, 6, dt);
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
        const k = reduced ? 1 : t === null ? 0 : clamp01(t / 1.1);
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
// The key light falls through a jali: the Sidi Saiyyed tree-of-life window (Ahmedabad), drawn procedurally into the
// light pool on the floor. Canvas top = far side of the floor, so the arch points away from the viewer.
const jaliTexture = (daylight = false) => {
    const W = 1024, H = 600, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d"), pool = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
    if (daylight) {
        // Daylight Atelier: crisp morning sun pool with warm architectural limestone shadow framing the jali arch
        [[0, "rgba(255,252,244,.65)"], [0.42, "rgba(218,208,192,.28)"], [1, "rgba(242,237,228,0)"]].forEach(([a, col]) => pool.addColorStop(a, col));
    } else {
        [[0, "rgba(255,236,214,.13)"], [0.45, "rgba(255,236,214,.04)"], [1, "rgba(255,236,214,0)"]].forEach(([a, col]) => pool.addColorStop(a, col));
    }
    g.fillStyle = pool; g.fillRect(0, 0, W, H);
    // arch window, ~1/3 of the pool, centred
    const cx = W / 2, base = H * 0.86, aw = 250, top = H * 0.12;
    const arch = new Path2D();
    arch.moveTo(cx - aw / 2, base); arch.lineTo(cx - aw / 2, top + aw * 0.5);
    arch.quadraticCurveTo(cx - aw / 2, top, cx, top); arch.quadraticCurveTo(cx + aw / 2, top, cx + aw / 2, top + aw * 0.5);
    arch.lineTo(cx + aw / 2, base); arch.closePath();
    g.save(); g.clip(arch);
    if (daylight) {
        g.fillStyle = "rgba(255,253,247,.55)";
        g.fill(arch);
    }
    g.filter = "blur(2.5px)";
    g.strokeStyle = daylight ? "rgba(38,34,28,.22)" : "rgba(255,236,214,.22)";
    g.lineCap = "round";
    // the tree: a trunk that splits into curling branches, each ending in a spiral leaf
    const branch = (x, y, ang, len, w, depth) => {
        const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, curl = ang + (depth % 2 ? 0.5 : -0.5);
        g.lineWidth = w; g.beginPath(); g.moveTo(x, y);
        g.quadraticCurveTo(x + Math.cos(curl) * len * 0.6, y + Math.sin(curl) * len * 0.6, ex, ey); g.stroke();
        if (depth === 0) {
            g.lineWidth = 2; g.beginPath();
            for (let a = 0; a < 9; a += 0.3) g.lineTo(ex + Math.cos(a + ang) * a * 1.4, ey + Math.sin(a + ang) * a * 1.4);
            g.stroke(); return;
        }
        branch(ex, ey, ang - 0.55, len * 0.72, w * 0.7, depth - 1);
        branch(ex, ey, ang + 0.55, len * 0.72, w * 0.7, depth - 1);
    };
    branch(cx, base, -Math.PI / 2, 120, 12, 5);
    // stone lattice along the bottom third
    g.lineWidth = 3;
    for (let x = cx - aw / 2; x < cx + aw / 2; x += 22) for (let y = base - 110; y < base; y += 22) { g.beginPath(); g.arc(x + 11, y + 11, 8, 0, Math.PI * 2); g.stroke(); }
    g.restore();
    g.filter = "none";
    g.strokeStyle = daylight ? "rgba(38,34,28,.16)" : "rgba(255,236,214,.12)";
    g.lineWidth = 4; g.stroke(arch);
    return new THREE.CanvasTexture(c);
};
const FLOOR_Y = -3.4;
const Ground = ({ floatRef, dropRef, light }) => {
    const shadow = useRef();
    const darkPool = useRef();
    const lightPool = useRef();
    const tex = useMemo(() => ({
        poolDark: jaliTexture(false),
        poolLight: jaliTexture(true),
        shadowDark: poolTexture([[0, "rgba(0,0,0,.9)"], [0.5, "rgba(0,0,0,.45)"], [1, "rgba(0,0,0,0)"]]),
        shadowLight: poolTexture([[0, "rgba(24,22,18,.38)"], [0.5, "rgba(24,22,18,.15)"], [1, "rgba(24,22,18,0)"]]),
    }), []);
    useFrame((_, dt) => {
        const y = (floatRef.current?.position.y ?? 0) + (dropRef.current?.position.y ?? 0);
        const s = 1 + y * 0.6;
        shadow.current.scale.set(s, s, 1);
        const baseOp = light ? 0.34 : 0.45;
        shadow.current.material.opacity = THREE.MathUtils.clamp(baseOp - y * 0.45, 0, 0.6);
        shadow.current.material.map = light ? tex.shadowLight : tex.shadowDark;
        if (darkPool.current && lightPool.current) {
            darkPool.current.material.opacity = THREE.MathUtils.damp(darkPool.current.material.opacity, light ? 0 : 1, 6, dt);
            lightPool.current.material.opacity = THREE.MathUtils.damp(lightPool.current.material.opacity, light ? 0.32 : 0, 6, dt);
        }
    });
    return (
        <group position={[0, FLOOR_Y, 0]} rotation-x={-Math.PI / 2}>
            <mesh ref={darkPool}><planeGeometry args={[12, 7]} /><meshBasicMaterial map={tex.poolDark} transparent depthWrite={false} toneMapped={false} /></mesh>
            <mesh ref={lightPool} position-z={0.002}><planeGeometry args={[12, 7]} /><meshBasicMaterial map={tex.poolLight} transparent opacity={0} depthWrite={false} toneMapped={false} /></mesh>
            <mesh ref={shadow} position-z={0.01}><planeGeometry args={[5.4, 2.6]} /><meshBasicMaterial map={tex.shadowDark} transparent depthWrite={false} /></mesh>
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
    dist: Math.max(aspect > 2.1 ? 11.6 : 12.6, (aspect < 0.8 ? 2.62 : 2.55) / (TAN * aspect)),   // phones: a smaller machine leaves room to read
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
    const dive = useRef(0);                    // scroll progress, shared with the DOM as --dive (fades the overlays)
    const pos = useMemo(() => new THREE.Vector3(), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ camera, pointer, size }, dt) => {
        const { dist, lookY } = framing(size.width / size.height);
        if (entering) { pos.copy(REEL_WINDOW).setZ(2.4); look.copy(REEL_WINDOW); }
        else {
            pos.set(pointer.x * 0.6, 0.2 + pointer.y * 0.3, dist);
            look.set(0, lookY, 0);
            // scrolling away dives the camera into the reels (the hero leaves through the machine)
            const p = THREE.MathUtils.smoothstep(window.scrollY / (window.innerHeight * 0.75), 0, 1);
            if (p > 0) { pos.lerp(DIVE, p); look.lerp(REEL_WINDOW, p); }
            if (Math.abs(p - dive.current) > 0.004) { dive.current = p; document.documentElement.style.setProperty("--dive", p.toFixed(3)); }
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

// Engineer's easter egg (hold the lever 3 s): wireframe everything and print live renderer stats into .debug-hud.
const Debug = ({ on }) => {
    const { scene } = useThree();
    useEffect(() => {
        scene.traverse((o) => { if (o.material && "wireframe" in o.material) o.material.wireframe = on; });
    }, [on, scene]);
    const n = useRef(0), last = useRef(0);
    useFrame(({ gl }) => {
        if (gl.info.autoReset === on) { gl.info.autoReset = !on; gl.info.reset(); }   // debug: count every pass (env cube + main), averaged below
        if (!on || ++n.current % 20) return;
        const now = performance.now(), fps = last.current ? 20000 / (now - last.current) : 0;
        last.current = now;
        const el = document.querySelector(".debug-hud pre");
        const { render, memory } = gl.info;
        if (el) el.textContent = `fps        ${fps.toFixed(0)}\ndraw calls ${Math.round(render.calls / 20)} / frame\ntriangles  ${Math.round(render.triangles / 20).toLocaleString()}\ngeometries ${memory.geometries}\ntextures   ${memory.textures}\ndpr        ${gl.getPixelRatio().toFixed(2)}`;
        gl.info.reset();
    });
    return null;
};

// Reports the first rendered frame (after Preload compiled every shader), which ends the boot screen.
const FirstFrame = ({ onFrame }) => {
    const done = useRef(false);
    useFrame(() => { if (!done.current) { done.current = true; onFrame?.(); } });
    return null;
};

// Smoothly shifts PX-01's studio fill & floating sphere between Dark Studio (crimson-red anodized orb) and Light Mode Atelier (polished silver-chrome orb)
const DARK_BLACK = new THREE.Color("#0d0d0f");
const LIGHT_BLACK = new THREE.Color("#141416");
const DARK_SHELL = new THREE.Color("#cfe9e6");
const LIGHT_SHELL = new THREE.Color("#e8ecef");
const ORB_DARK_COL = new THREE.Color("#ff2214");
const ORB_LIGHT_COL = new THREE.Color("#f4f2ee");
const ORB_DARK_EMISSIVE = new THREE.Color("#7a0b04");
const ORB_LIGHT_EMISSIVE = new THREE.Color("#dad6ce");

const AtelierRig = ({ light }) => {
    const hemi = useRef();
    const frontFill = useRef();
    const orb = useRef();
    const { size } = useThree();
    const aspect = size.width / Math.max(1, size.height);
    const orbX = aspect < 0.8 ? -2.2 : -THREE.MathUtils.clamp(aspect * 2.85, 2.95, 5.15);
    const orbMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ff2214",
        metalness: 0.88,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        emissive: "#7a0b04",
        emissiveIntensity: 0.45,
    }), []);
    useFrame(({ clock }, dt) => {
        const k = 1 - Math.exp(-6 * dt);
        mat.black.color.lerp(light ? LIGHT_BLACK : DARK_BLACK, k);
        mat.black.roughness = THREE.MathUtils.damp(mat.black.roughness, light ? 0.28 : 0.55, 6, dt);
        mat.black.metalness = THREE.MathUtils.damp(mat.black.metalness, light ? 0.35 : 0.2, 6, dt);
        mat.shell.attenuationColor.lerp(light ? LIGHT_SHELL : DARK_SHELL, k);
        if (hemi.current) hemi.current.intensity = THREE.MathUtils.damp(hemi.current.intensity, light ? 0.95 : 0.12, 6, dt);
        if (frontFill.current) frontFill.current.intensity = THREE.MathUtils.damp(frontFill.current.intensity, light ? 1.25 : 0.35, 6, dt);
        orbMat.color.lerp(light ? ORB_LIGHT_COL : ORB_DARK_COL, k);
        orbMat.emissive.lerp(light ? ORB_LIGHT_EMISSIVE : ORB_DARK_EMISSIVE, k);
        orbMat.roughness = THREE.MathUtils.damp(orbMat.roughness, light ? 0.14 : 0.14, 6, dt);
        orbMat.metalness = THREE.MathUtils.damp(orbMat.metalness, light ? 0.45 : 0.88, 6, dt);
        if (orb.current) {
            orb.current.position.x = THREE.MathUtils.damp(orb.current.position.x, orbX, 6, dt);
            orb.current.position.y = -1.12 + Math.sin(clock.elapsedTime * 1.1) * 0.07;
            orb.current.position.z = -1.2 + Math.sin(clock.elapsedTime * 0.72) * 0.14;
        }
    });
    return (
        <>
            <directionalLight ref={frontFill} position={[2, 2, 9]} intensity={0.35} color="#ffffff" />
            <hemisphereLight ref={hemi} args={["#ffffff", light ? "#e4e2dd" : "#000000", 0.12]} />
            {/* Cohesive floating metallic sphere on the left: Crimson-Red Anodized Metal in Dark Mode, Bright Silver-Chrome in Light Mode */}
            <mesh ref={orb} position={[orbX, -1.12, -1.2]} material={orbMat}>
                <sphereGeometry args={[0.25, 48, 32]} />
            </mesh>
        </>
    );
};

export default function Studio({ count, ticket, onTicket, onDebug, debug, spinning, pulled, booted, target, entering, jackpot, lit, light = false, onPull, onArm, onReelStop, onAnchors, onBooted, onFrame, onCreated, active }) {
    const floatRef = useRef();
    const dropRef = useRef();
    useEffect(() => { onCreated?.(); }, [onCreated]);
    const coarse = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;

    return (
        <Canvas className="studio" frameloop={active ? "always" : "never"} dpr={coarse ? [1, 1.5] : [1, 1.75]}
            camera={{ position: [0, 0.2, 14], fov: 30 }}
            gl={{ alpha: true, antialias: true, toneMapping: THREE.AgXToneMapping, toneMappingExposure: 1.3 }}
            onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.localClippingEnabled = true; }}>   {/* the ticket feeds out of its slot */}
            <GlassSurface />
            <Rig entering={entering} />
            <KeyLight lit={lit} light={light} onBooted={onBooted} />
            <AtelierRig light={light} />
            <WinFlash jackpot={jackpot} />

            {/* rims: cool from behind-left, warm from behind-right, so every edge of the case is drawn in light */}
            <directionalLight position={[-6, 3, -5]} intensity={light ? 3.2 : 2.6} color={light ? "#ffffff" : "#cfe0ff"} />
            <directionalLight position={[6, 1.5, -4]} intensity={light ? 2.4 : 1.8} color="#ffd6b0" />
            {/* separation: a cool top rim and a faint red kicker from below-behind (ties the machine to the red ink) */}
            <directionalLight position={[0, 7, -5]} intensity={1.6} color="#dfe8ff" />
            <directionalLight position={[0, -3, -6]} intensity={1.3} color="#ff3a22" />

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
            {!reduced && <Sparkles count={coarse ? 40 : 80} scale={[3.6, 7, 3]} position={[0.2, 1.2, 0.6]} size={2.2} speed={0.25} opacity={light ? 0.22 : 0.55} color={light ? "#ff2e1f" : "#fff1df"} noise={0.6} />}

            <Entrance lit={lit} innerRef={dropRef}>
                    <Float ref={floatRef} enabled={!reduced} speed={1.3} rotationIntensity={0.18} floatIntensity={0.55} floatingRange={[-0.18, 0.18]}>
                        <PresentationControls global={false} cursor={!entering} snap speed={1.4} polar={[-0.35, 0.35]} azimuth={[-0.9, 0.9]} damping={0.25}>
                            <Lean>
                                <Machine spinning={spinning} pulled={pulled} booted={booted} target={target} jackpot={jackpot} count={count} ticket={ticket} onTicket={onTicket} onDebug={onDebug} onPull={onPull} onArm={onArm} onReelStop={onReelStop} />
                                <Anchors onAnchors={onAnchors} />
                            </Lean>
                        </PresentationControls>
                    </Float>
            </Entrance>
            <Keychains lit={lit} light={light} jackpot={jackpot} framing={framing} />
            <Ground floatRef={floatRef} dropRef={dropRef} light={light} />
            <FirstFrame onFrame={onFrame} />
            <Debug on={!!debug} />
            <Preload all />
        </Canvas>
    );
}
