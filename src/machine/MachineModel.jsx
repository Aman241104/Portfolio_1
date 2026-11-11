import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { worlds } from "#worlds/registry.js";
import { sfx } from "./sfx.js";
import { receiptTexture, receiptGeometry } from "./receipt.js";

// PX-01, the clear-case reality selector. Shared by the home screen (src/home) and the lab (/lab/machine.html).
// Everything is code + PBR. Units ≈ decimetres. The machine is centred on its own origin.
const MONO = "/fonts/GeistMono-500.ttf";
const BONE = "#edeae3";
const SIGNAL = "#ff2e1f";
const WIRE = "#ff7a1a";
/* ---------------------------------------------------------------- materials */

export const mat = {
    // clear acrylic with a faint cool tint and hand-made smudge/scratch roughness, so it reads as glass, not CG
    shell: new THREE.MeshPhysicalMaterial({ color: "#f4fbfb", roughness: 0.06, transmission: 1, thickness: 0.08, ior: 1.46, clearcoat: 1, clearcoatRoughness: 0.08, attenuationColor: "#cfe9e6", attenuationDistance: 2.5, specularIntensity: 1 }),
    // thick optical glass block: green edges, dispersion, smudges
    plinth: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 1, thickness: 2.4, ior: 1.52, dispersion: 3, clearcoat: 1, clearcoatRoughness: 0.06, attenuationColor: "#7fc4b8", attenuationDistance: 3 }),
    chrome: new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03 }),
    brushed: new THREE.MeshPhysicalMaterial({ color: "#c4c7cc", metalness: 1, roughness: 0.3, anisotropy: 0.9 }),
    black: new THREE.MeshPhysicalMaterial({ color: "#0d0d0f", metalness: 0.2, roughness: 0.55 }),
    pcb: new THREE.MeshPhysicalMaterial({ color: "#10140f", metalness: 0.3, roughness: 0.4, clearcoat: 0.6 }),
    chip: new THREE.MeshStandardMaterial({ color: "#151517", roughness: 0.35 }),
    gold: new THREE.MeshStandardMaterial({ color: "#d6a14a", metalness: 1, roughness: 0.25 }),
    wire: new THREE.MeshPhysicalMaterial({ color: WIRE, roughness: 0.35, clearcoat: 0.8, emissive: WIRE, emissiveIntensity: 0.15 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.9 }),
    knob: new THREE.MeshPhysicalMaterial({ color: SIGNAL, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.04, emissive: SIGNAL, emissiveIntensity: 0 }),
};

/* ---------------------------------------------------------------- reels */

const SLOTS = 12;
const SLOT_ANGLE = (Math.PI * 2) / SLOTS;
const SLOT_OFFSET = SLOT_ANGLE / 2;

// Cylinder UVs: u runs around the drum (vertical on screen once laid on its side), v along the axis.
const useReelTexture = (reel) => useMemo(() => {
    const labels = Array.from({ length: SLOTS }, (_, i) => worlds[i % worlds.length].symbols[reel].toUpperCase());
    const slot = 160;
    const c = document.createElement("canvas");
    c.width = slot * SLOTS; c.height = 512;
    const g = c.getContext("2d");
    g.fillStyle = BONE; g.fillRect(0, 0, c.width, c.height);
    labels.forEach((t, i) => {
        g.save();
        g.translate(slot * i + slot / 2, c.height / 2);
        g.rotate(Math.PI / 2);
        g.fillStyle = "#0b0b0c"; g.font = "700 92px 'Geist Mono', ui-monospace, monospace";
        g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText(t, 0, 0);
        g.restore();
        g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(slot * i, 0, 2, c.height);
    });
    const sharp = new THREE.CanvasTexture(c);
    sharp.colorSpace = THREE.SRGBColorSpace; sharp.anisotropy = 8;
    // motion-blurred copy: the strip smeared along the direction of travel (u = around the drum)
    const b = document.createElement("canvas"); b.width = c.width; b.height = c.height;
    const bg = b.getContext("2d");
    bg.fillStyle = BONE; bg.fillRect(0, 0, b.width, b.height);
    for (let k = -8; k <= 8; k++) { bg.globalAlpha = 0.09; bg.drawImage(c, k * 9, 0); }
    const blur = new THREE.CanvasTexture(b);
    blur.colorSpace = THREE.SRGBColorSpace; blur.anisotropy = 8;
    return { sharp, blur };
}, [reel]);

// The slot facing the viewer is the one whose centre angle equals rotation.x, so slot k shows worlds[k % 3].
// On stop, a reel picks the first slot ahead that shows `target` (a world index; nearest slot if none) and far
// enough away to decelerate into without a speed jump. Later reels add extra slots, so they stop one by one.
const STOP_EASE = 2.4;
const Reel = ({ index, x, spinning, target, onStop }) => {
    const ref = useRef();
    const { sharp, blur } = useReelTexture(index);
    const drum = useRef();
    const speed = useRef(0);
    const stop = useRef(null);
    const spun = useRef(false);                     // report a lock only after a real spin, not on mount
    const slot = useRef(0);
    const tease = useRef(false), hold = useRef(0), ease = useRef(STOP_EASE);
    useFrame((_, dt) => {
        const r = ref.current.rotation;
        const k = Math.floor(r.x / SLOT_ANGLE);
        if (k !== slot.current) { slot.current = k; if (spun.current) sfx.tick(); }
        if (spinning) {
            stop.current = null;
            spun.current = true;
            speed.current = THREE.MathUtils.damp(speed.current, 14 - index * 2, 3, dt);
            r.x += speed.current * dt;
        } else {
            if (stop.current === null) {
                const ahead = Math.round(speed.current / STOP_EASE / SLOT_ANGLE) + (speed.current > 1 ? index * 5 : 0);
                let k = Math.ceil((r.x - SLOT_OFFSET) / SLOT_ANGLE - 1e-6) + ahead;
                if (target != null) while ((((k % SLOTS) + SLOTS) % SLOTS) % worlds.length !== target) k++;
                tease.current = index === 2 && spun.current && Math.random() < 0.5;   // the near miss, half the time
                hold.current = 0; ease.current = STOP_EASE;
                stop.current = (k + (tease.current ? 1 : 0)) * SLOT_ANGLE + SLOT_OFFSET;
            }
            const before = r.x;
            r.x = THREE.MathUtils.damp(r.x, stop.current, ease.current, dt);
            speed.current = (r.x - before) / Math.max(dt, 1e-4);
            if (spun.current && Math.abs(stop.current - r.x) < 0.004) {
                if (tease.current) {                                       // hang on the wrong symbol… then click back
                    if ((hold.current += dt) > 0.5) { tease.current = false; stop.current -= SLOT_ANGLE; ease.current = 11; }
                } else { spun.current = false; r.x = stop.current; sfx.lock(index); onStop?.(index); }
            }
        }
        drum.current.map = speed.current > 5 ? blur : sharp;
    });
    return (
        <group position={[x, 0.42, 0.25]}>
            <mesh ref={ref} rotation={[SLOT_OFFSET, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.55, 0.55, 0.78, 64, 1, true]} />
                <meshStandardMaterial ref={drum} map={sharp} roughness={0.45} side={THREE.DoubleSide} />
            </mesh>
            {/* chrome drum caps + axle: visible through the clear shell */}
            {[-0.4, 0.4].map((dx) => (
                <mesh key={dx} position={[dx, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat.chrome}>
                    <cylinderGeometry args={[0.56, 0.56, 0.02, 64]} />
                </mesh>
            ))}
        </group>
    );
};

/* ---------------------------------------------------------------- internals (seen through the glass) */

const Tube = ({ points, radius = 0.018, material = mat.wire }) => {
    const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), 64, radius, 10, false), [points, radius]);
    return <mesh geometry={geo} material={material} />;
};

const Internals = () => (
    <group>
        {/* chassis: chrome rails at the inner corners */}
        {[[-1.45, -0.65], [1.45, -0.65], [-1.45, 0.62], [1.45, 0.62]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0, z]} material={mat.chrome}><cylinderGeometry args={[0.03, 0.03, 2.3, 16]} /></mesh>
        ))}
        {[-1.05, 1.05].map((y) => (
            <mesh key={y} position={[0, y, -0.65]} rotation={[0, 0, Math.PI / 2]} material={mat.chrome}><cylinderGeometry args={[0.025, 0.025, 2.9, 16]} /></mesh>
        ))}
        {/* reel carriage */}
        <mesh position={[0, 0.42, -0.35]} material={mat.brushed}><boxGeometry args={[2.8, 0.06, 0.5]} /></mesh>

        {/* logic board on the back wall */}
        <group position={[0, -0.55, -0.6]}>
            <RoundedBox args={[2.5, 0.85, 0.04]} radius={0.015} material={mat.pcb} />
            {[[-0.8, 0.12, 0.28, 0.28], [-0.35, -0.1, 0.4, 0.22], [0.25, 0.15, 0.22, 0.22], [0.75, -0.08, 0.36, 0.3], [0.2, -0.22, 0.5, 0.12]].map(([x, y, w, h], i) => (
                <mesh key={i} position={[x, y, 0.035]} material={mat.chip}><boxGeometry args={[w, h, 0.04]} /></mesh>
            ))}
            {Array.from({ length: 14 }, (_, i) => (
                <mesh key={i} position={[-1.1 + i * 0.17, 0.36, 0.025]} material={mat.gold}><boxGeometry args={[0.06, 0.05, 0.01]} /></mesh>
            ))}
            {/* power cell, like a clear-case handheld */}
            <mesh position={[1.05, 0.05, 0.08]} rotation={[0, 0, Math.PI / 2]} material={mat.brushed}><cylinderGeometry args={[0.11, 0.11, 0.45, 32]} /></mesh>
        </group>

        {/* speaker driver behind the lower front */}
        <group position={[0.75, -0.6, 0.55]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={mat.black}><coneGeometry args={[0.36, 0.22, 48, 1, true]} /></mesh>
            <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]} material={mat.chrome}><torusGeometry args={[0.37, 0.03, 16, 64]} /></mesh>
            <mesh position={[0, 0, 0.02]} material={mat.chrome}><sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        </group>

        {/* orange wiring: board → LEDs, board → lever hub, board → speaker */}
        <Tube points={[[-0.6, -0.15, -0.55], [-0.9, 0.4, -0.5], [-0.95, 1.0, 0.2], [-0.9, 1.08, 0.6]]} />
        <Tube points={[[0.9, -0.3, -0.55], [1.3, 0.0, -0.3], [1.42, 0.1, 0.05]]} />
        <Tube points={[[0.4, -0.7, -0.55], [0.6, -0.75, 0.0], [0.75, -0.62, 0.42]]} radius={0.014} />
    </group>
);


/* ---------------------------------------------------------------- mechanism detail (clear-case hardware) */

export const brass = new THREE.MeshPhysicalMaterial({ color: "#c9a24e", metalness: 1, roughness: 0.22, clearcoat: 0.6 });
const capBlue = new THREE.MeshPhysicalMaterial({ color: "#1f4fa8", roughness: 0.35, clearcoat: 0.8 });
const resistor = new THREE.MeshStandardMaterial({ color: "#d9c7a0", roughness: 0.6 });
const tubeGlass = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.04, transmission: 1, thickness: 0.05, ior: 1.45, clearcoat: 1 });

// Toothed gear: a circle of alternating radii, extruded with a small bevel and a hub hole.
const makeGear = (r, teeth, depth) => {
    const s = new THREE.Shape();
    const tooth = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
        const a = i * tooth;
        [[a, r * 0.86], [a + tooth * 0.15, r], [a + tooth * 0.45, r], [a + tooth * 0.6, r * 0.86]].forEach(([ang, rad], k) =>
            (i === 0 && k === 0 ? s.moveTo : s.lineTo).call(s, Math.cos(ang) * rad, Math.sin(ang) * rad));
    }
    const hole = new THREE.Path(); hole.absarc(0, 0, r * 0.18, 0, Math.PI * 2, true); s.holes.push(hole);
    for (let k = 0; k < 4; k++) {                                // lightening holes
        const a = k * Math.PI / 2 + 0.4, h = new THREE.Path();
        h.absarc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.14, 0, Math.PI * 2, true); s.holes.push(h);
    }
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 6 });
    g.translate(0, 0, -depth / 2);
    return g;
};

const Gear = ({ r, teeth, position, material, dir = 1, spinning }) => {
    const ref = useRef();
    const geo = useMemo(() => makeGear(r, teeth, 0.05), [r, teeth]);
    const v = useRef(0);
    useFrame((_, dt) => {
        v.current = THREE.MathUtils.damp(v.current, spinning ? 6 : 0, 3, dt);
        ref.current.rotation.z += (v.current / r) * 0.12 * dir * dt;   // meshing gears: speed ∝ 1/radius
    });
    return <mesh ref={ref} geometry={geo} material={material} position={position} />;
};

const Fan = ({ position, spinning }) => {
    const blades = useRef();
    useFrame((_, dt) => { blades.current.rotation.z += (spinning ? 22 : 2.5) * dt; });
    return (
        <group position={position}>
            <RoundedBox args={[0.5, 0.5, 0.08]} radius={0.04} material={mat.black} />
            <group ref={blades} position={[0, 0, 0.05]}>
                {Array.from({ length: 7 }, (_, i) => (
                    <mesh key={i} rotation={[0.35, 0, (i / 7) * Math.PI * 2]} position={[Math.cos((i / 7) * Math.PI * 2) * 0.1, Math.sin((i / 7) * Math.PI * 2) * 0.1, 0]} material={mat.chip}>
                        <boxGeometry args={[0.16, 0.07, 0.006]} />
                    </mesh>
                ))}
                <mesh material={mat.chrome} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.03, 24]} /></mesh>
            </group>
        </group>
    );
};

// Helix return spring for the lever.
const Spring = ({ position }) => {
    const geo = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 200; i++) { const t = i / 200, a = t * Math.PI * 2 * 9; pts.push(new THREE.Vector3(Math.cos(a) * 0.07, t * 0.5, Math.sin(a) * 0.07)); }
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.008, 6, false);
    }, []);
    return <mesh geometry={geo} material={mat.chrome} position={position} />;
};

// Mechanical play counter: digits on a dark plate behind the glass.
// Mechanical play counter. Rolls up from 000000 to `count` on power-on, then ticks once per pull.
const Counter = ({ position, count = 427 }) => {
    const { tex, draw } = useMemo(() => {
        const c = document.createElement("canvas"); c.width = 256; c.height = 64;
        const g = c.getContext("2d"), t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        const draw = (n) => {
            g.fillStyle = "#0b0b0c"; g.fillRect(0, 0, 256, 64);
            String(n).padStart(6, "0").slice(-6).split("").forEach((d, i) => {
                g.fillStyle = i < 3 ? "#202024" : "#2a2a2e"; g.fillRect(6 + i * 41, 6, 36, 52);
                g.fillStyle = "#edeae3"; g.font = "600 38px 'Geist Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
                g.fillText(d, 24 + i * 41, 33);
            });
            t.needsUpdate = true;
        };
        draw(0);
        return { tex: t, draw };
    }, []);
    const v = useRef(0), shown = useRef(0);
    useFrame((_, dt) => {
        v.current = count < v.current ? count : Math.min(count, v.current + Math.max(dt * 30, (count - v.current) * dt * 2.5));
        const n = Math.floor(v.current);
        if (n !== shown.current) { shown.current = n; draw(n); }
    });
    return (
        <mesh position={position}>
            <planeGeometry args={[0.56, 0.14]} />
            <meshStandardMaterial map={tex} roughness={0.4} />
        </mesh>
    );
};

const Mechanism = ({ spinning, count }) => (
    <group>
        {/* gear train, lower left, facing the viewer */}
        <Gear r={0.32} teeth={22} position={[-0.95, -0.55, 0.35]} material={mat.chrome} spinning={spinning} />
        <Gear r={0.18} teeth={13} position={[-0.47, -0.42, 0.37]} material={brass} dir={-1} spinning={spinning} />
        <Gear r={0.12} teeth={9} position={[-0.42, -0.74, 0.39]} material={mat.chrome} spinning={spinning} />
        {[[-0.95, -0.55], [-0.47, -0.42], [-0.42, -0.74]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.2]} rotation={[Math.PI / 2, 0, 0]} material={mat.brushed}><cylinderGeometry args={[0.025, 0.025, 0.45, 12]} /></mesh>
        ))}

        {/* cooling fan + finned heatsink on the board */}
        <Fan position={[0.0, -0.55, -0.42]} spinning={spinning} />
        <group position={[-0.35, -0.72, -0.5]}>
            <mesh material={mat.brushed}><boxGeometry args={[0.36, 0.04, 0.16]} /></mesh>
            {Array.from({ length: 8 }, (_, i) => (
                <mesh key={i} position={[-0.16 + i * 0.045, 0.09, 0]} material={mat.brushed}><boxGeometry args={[0.012, 0.16, 0.16]} /></mesh>
            ))}
        </group>

        {/* capacitors + resistors along the board's top edge */}
        {[-1.0, -0.86, 0.45, 0.58].map((x, i) => (
            <group key={i} position={[x, -0.22, -0.48]}>
                <mesh material={capBlue}><cylinderGeometry args={[0.045, 0.045, 0.16, 20]} /></mesh>
                <mesh position={[0, 0.082, 0]} material={mat.brushed}><cylinderGeometry args={[0.046, 0.046, 0.01, 20]} /></mesh>
            </group>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} position={[0.12 + i * 0.06, -0.95, -0.52]} rotation={[0, 0, Math.PI / 2]} material={resistor}><cylinderGeometry args={[0.014, 0.014, 0.09, 10]} /></mesh>
        ))}

        {/* striped ribbon cable from the board up to the reel carriage */}
        {["#ff7a1a", "#edeae3", "#ff7a1a", "#9a9a9e", "#ff7a1a", "#edeae3"].map((c, i) => (
            <Tube key={i} radius={0.009} material={new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 })}
                points={[[0.62 + i * 0.022, -0.2, -0.56], [0.66 + i * 0.022, 0.1, -0.5], [0.6 + i * 0.022, 0.38, -0.32]]} />
        ))}

        {/* coin path: slot on the roof → glass chute with coins → payout tray at the front */}
        <group position={[1.18, 1.26, -0.5]}>
            <RoundedBox args={[0.34, 0.03, 0.22]} radius={0.01} material={mat.chrome} />
            <mesh position={[0, 0.017, 0]} material={mat.black}><boxGeometry args={[0.2, 0.005, 0.03]} /></mesh>
        </group>
        <mesh position={[1.18, 0.1, -0.5]} material={tubeGlass}><cylinderGeometry args={[0.09, 0.09, 2.2, 32, 1, true]} /></mesh>
        {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} position={[1.18, -0.95 + i * 0.03, -0.5]} rotation={[0, i * 0.4, (i % 2) * 0.05]} material={brass}><cylinderGeometry args={[0.075, 0.075, 0.025, 32]} /></mesh>
        ))}
        <group position={[1.05, -1.08, 0.86]}>
            <RoundedBox args={[0.7, 0.08, 0.3]} radius={0.03} material={mat.chrome} />
            {[[-0.12, 0.05], [0.08, 0.06]].map(([x, y], i) => (
                <mesh key={i} position={[x, y, 0]} rotation={[0.2, 0, 0.1 * i]} material={brass}><cylinderGeometry args={[0.075, 0.075, 0.025, 32]} /></mesh>
            ))}
        </group>

        {/* lever return spring + play counter */}
        <Spring position={[1.38, -0.15, 0.05]} />
        <Counter position={[0.2, 1.07, 0.845]} count={count} />

        {/* chrome screws at the shell corners */}
        {[[-1.48, 1.13], [1.48, 1.13], [-1.48, -1.13], [1.48, -1.13]].map(([x, y], i) => (
            <group key={i} position={[x, y, 0.83]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh material={mat.chrome}><cylinderGeometry args={[0.035, 0.035, 0.015, 20]} /></mesh>
                <mesh position={[0, 0.009, 0]} material={mat.black}><boxGeometry args={[0.05, 0.003, 0.008]} /></mesh>
            </group>
        ))}
    </group>
);

/* ---------------------------------------------------------------- lever, LEDs */

// Grab the knob and drag down: the arm follows with resistance, fires past 70% of travel, springs back otherwise.
const Lever = ({ pulled, onPull, onArm, onDebug }) => {
    const pivot = useRef();
    const drag = useRef(null);                      // { startY, angle } while dragging
    useEffect(() => {
        const move = (e) => {
            if (!drag.current) return;
            const raw = Math.max(0, (e.clientY - drag.current.startY) / 160);
            drag.current.angle = Math.min(1, raw / (1 + raw * 0.6)) * 0.95;   // resistance: diminishing return
            const notch = Math.floor(drag.current.angle * 10);
            if (notch > drag.current.notch) drag.current.angle > 0.66 && drag.current.notch * 0.1 <= 0.66 ? sfx.detent() : sfx.ratchet();
            drag.current.notch = notch;
        };
        const up = () => {
            if (!drag.current) return;
            // a past-70% drag fires; so does a plain tap on the knob (touch screens scroll instead of dragging)
            if (drag.current.debug) onArm?.(false);   // the hold opened the debug view: no pull
            else if (drag.current.angle > 0.66 || drag.current.angle < 0.03) onPull();
            else onArm?.(false);                      // let go before the detent: back to idle
            drag.current = null; document.body.style.cursor = "";
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    }, [onPull, onArm]);
    const hot = useRef(false);
    useFrame((_, dt) => {
        const d = drag.current;
        if (d && onDebug && !d.debug && d.angle < 0.03 && performance.now() - d.t0 > 3000) { d.debug = true; sfx.detent(); onDebug(); }
        const target = drag.current ? drag.current.angle : pulled ? 0.9 : 0;
        pivot.current.rotation.x = THREE.MathUtils.damp(pivot.current.rotation.x, target, drag.current ? 20 : pulled ? 14 : 5, dt);
        mat.knob.emissiveIntensity = THREE.MathUtils.damp(mat.knob.emissiveIntensity, hot.current || drag.current ? 1.6 : 0, 8, dt);
    });
    const grab = (e) => { e.stopPropagation(); drag.current = { startY: e.clientY, angle: 0, notch: 0, t0: performance.now() }; document.body.style.cursor = "grabbing"; onArm?.(true); };
    return (
        <group position={[1.6, 0.1, 0.05]}>
            <mesh material={mat.black} rotation={[0, 0, Math.PI / 2]} position={[0.04, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.08, 48]} /></mesh>
            <mesh material={mat.chrome} rotation={[0, 0, Math.PI / 2]} position={[0.15, 0, 0]}><cylinderGeometry args={[0.22, 0.24, 0.16, 48]} /></mesh>
            <group ref={pivot} position={[0.2, 0, 0]}>
                <mesh material={mat.chrome} position={[0, 0.65, 0]}><cylinderGeometry args={[0.04, 0.055, 1.3, 32]} /></mesh>
                <mesh material={mat.knob} position={[0, 1.36, 0]}><sphereGeometry args={[0.17, 64, 64]} /></mesh>
                {/* invisible, generous hit area: the knob alone is a few pixels wide on a phone */}
                <mesh position={[0, 1.2, 0]} onPointerDown={grab}
                    onPointerOver={() => { hot.current = true; document.body.style.cursor = "grab"; }}
                    onPointerOut={() => { hot.current = false; if (!drag.current) document.body.style.cursor = ""; }}>
                    <sphereGeometry args={[0.42, 12, 12]} />
                    <meshBasicMaterial visible={false} />
                </mesh>
            </group>
        </group>
    );
};

const Leds = ({ spinning, booted }) => {
    const refs = useRef([]);
    useFrame(({ clock }, dt) => {
        const t = clock.elapsedTime;
        refs.current.forEach((m, i) => {
            if (!m) return;
            const lit = spinning ? (Math.floor(t * 18) % 9 === i ? 20 : 3) : booted ? 9 : (t * 6 > i ? 9 : 0);
            m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, lit, 12, dt);
        });
    });
    return (
        <group position={[-0.78, 1.07, 0.845]}>
            {Array.from({ length: 9 }, (_, i) => (
                <mesh key={i} position={[i * 0.075, 0, 0]}>
                    <sphereGeometry args={[0.022, 16, 16]} />
                    <meshStandardMaterial ref={(m) => (refs.current[i] = m)} color="#2a0b09" emissive={SIGNAL} emissiveIntensity={0} toneMapped={false} />
                </mesh>
            ))}
        </group>
    );
};

// Case built from panels so the front can have a real reel window (a refracting box over the reels made them unreadable).
const roundedRect = (shape, x, y, w, h, r) => {
    shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
};
const WIN = { w: 2.86, h: 1.0, y: 0.42 };           // reel window
const smoke = new THREE.MeshPhysicalMaterial({ color: "#0b0c0e", roughness: 0.25, metalness: 0.2, clearcoat: 1, transparent: true, opacity: 0.9 });
const windowGlass = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.07, clearcoat: 1, clearcoatRoughness: 0.03 });

const Case = () => {
    const front = useMemo(() => {
        const sh = roundedRect(new THREE.Shape(), -1.6, -1.25, 3.2, 2.5, 0.12);
        sh.holes.push(roundedRect(new THREE.Path(), -WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h, 0.05));
        const g = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3, curveSegments: 12 });
        g.translate(0, 0, 0.76);
        return g;
    }, []);
    const t = 0.04;
    return (
        <group>
            <mesh geometry={front} material={mat.shell} />
            <mesh position={[0, 0, -0.78]} material={mat.shell}><boxGeometry args={[3.2, 2.5, t]} /></mesh>
            {[-1.58, 1.58].map((x) => <mesh key={x} position={[x, 0, 0]} material={mat.shell}><boxGeometry args={[t, 2.42, 1.52]} /></mesh>)}
            {[-1.23, 1.23].map((y) => <mesh key={y} position={[0, y, 0]} material={mat.shell}><boxGeometry args={[3.12, t, 1.52]} /></mesh>)}
            {/* polished chrome cap, base and edge rods: the light-catching frame of a clear case */}
            {[1.27, -1.27].map((y) => <RoundedBox key={y} args={[3.28, 0.07, 1.68]} radius={0.03} position={[0, y, 0]} material={mat.chrome} />)}
            {[[-1.6, 0.8], [1.6, 0.8], [-1.6, -0.8], [1.6, -0.8]].map(([x, z], i) => (
                <mesh key={i} position={[x, 0, z]} material={mat.chrome}><cylinderGeometry args={[0.026, 0.026, 2.5, 16]} /></mesh>
            ))}
            {/* flat, non-distorting window over the reels */}
            <mesh position={[0, WIN.y, 0.79]} material={windowGlass}><planeGeometry args={[WIN.w, WIN.h]} /></mesh>
            {/* chrome window frame */}
            {[[0, WIN.y + WIN.h / 2 + 0.02, WIN.w + 0.08, 0.04], [0, WIN.y - WIN.h / 2 - 0.02, WIN.w + 0.08, 0.04]].map(([x, y, w, h], i) => (
                <RoundedBox key={i} args={[w, h, 0.05]} radius={0.015} position={[x, y, 0.82]} material={mat.chrome} />
            ))}
            {[-1, 1].map((d) => (
                <RoundedBox key={d} args={[0.04, WIN.h + 0.08, 0.05]} radius={0.015} position={[d * (WIN.w / 2 + 0.02), WIN.y, 0.82]} material={mat.chrome} />
            ))}
            {/* smoked print bands: white print needs a dark ground to read */}
            <RoundedBox args={[3.0, 0.24, 0.012]} radius={0.004} position={[0, 1.07, 0.83]} material={smoke} />
            <RoundedBox args={[3.0, 0.2, 0.012]} radius={0.004} position={[0, -0.2, 0.83]} material={smoke} />
            <RoundedBox args={[3.0, 0.18, 0.012]} radius={0.004} position={[0, -1.1, 0.83]} material={smoke} />
        </group>
    );
};

// A bright band sweeps across the reel window glass each time the reels come to rest.
const GlintSweep = ({ spinning }) => {
    const ref = useRef();
    const t = useRef(2);
    const was = useRef(spinning);
    const tex = useMemo(() => {
        const c = document.createElement("canvas"); c.width = 256; c.height = 8;
        const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 256, 0);
        gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr; g.fillRect(0, 0, 256, 8);
        return new THREE.CanvasTexture(c);
    }, []);
    useFrame((_, dt) => {
        if (was.current && !spinning) t.current = 0;      // reels just stopped
        was.current = spinning;
        t.current = Math.min(t.current + dt / 0.7, 2);
        const k = t.current;
        ref.current.visible = k < 1;
        ref.current.position.x = THREE.MathUtils.lerp(-1.8, 1.8, k);
        ref.current.material.opacity = Math.sin(Math.min(k, 1) * Math.PI) * 0.55;
    });
    return (
        <mesh ref={ref} position={[0, WIN.y, 0.805]} rotation={[0, 0, -0.35]} visible={false}>
            <planeGeometry args={[0.5, 1.3]} />
            <meshBasicMaterial map={tex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
    );
};

// `target`: index into worlds the reels should land on (undefined = wherever they stop).
// `onReelStop(i)` fires when reel i physically locks after a spin; `onArm(bool)` when the lever is grabbed/released.
// Jackpot payout: a handful of coins jump out of the chute mouth into the tray, tumble and settle.
const COINS = 7;
const Payout = ({ jackpot }) => {
    const refs = useRef([]);
    const t = useRef(-1);
    const was = useRef(false);
    const seeds = useMemo(() => Array.from({ length: COINS }, (_, i) => {
        const r = (n) => (Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 * 0.5 + 0.5;   // fixed scatter, same every win
        return {
            vx: -0.55 + r(1) * 0.5, vz: 0.9 + r(2) * 0.5, vy: 1.4 + r(3) * 0.8, delay: i * 0.07,
            spin: 6 + r(4) * 8, rest: [0.75 + (i % 4) * 0.13 - r(5) * 0.05, -1.0 + (i % 3) * 0.012, 0.8 + (i % 2) * 0.08],
        };
    }), []);
    useFrame((_, dt) => {
        if (jackpot && !was.current) { t.current = 0; seeds.forEach((_, i) => sfx.coin(i)); }
        was.current = !!jackpot;
        if (!jackpot) t.current = -1;
        refs.current.forEach((m, i) => {
            if (!m) return;
            const s = seeds[i], k = t.current - s.delay;
            m.visible = t.current >= 0 && k > 0;
            if (!m.visible) return;
            const fly = Math.min(k, 0.55);                                    // ballistic arc, then settle in the tray
            if (k < 0.55) m.position.set(1.18 + s.vx * fly, -0.95 + s.vy * fly - 4.9 * fly * fly, -0.5 + s.vz * fly * 2.2);
            else m.position.lerp(new THREE.Vector3(...s.rest), 1 - Math.exp(-dt * 10));
            m.rotation.x += dt * (k < 0.55 ? s.spin : 0); m.rotation.x = k < 0.55 ? m.rotation.x : THREE.MathUtils.damp(m.rotation.x, 0.15, 8, dt);
        });
        if (t.current >= 0) t.current += dt;
    });
    return Array.from({ length: COINS }, (_, i) => (
        <mesh key={i} ref={(m) => (refs.current[i] = m)} visible={false} material={brass}><cylinderGeometry args={[0.075, 0.075, 0.025, 32]} /></mesh>
    ));
};

// Win ticket: prints out of a slot under the case, curls toward you, and is the way in (click = enter the world).
const TICKET_H = 1.05;
const Ticket = ({ ticket, onTicket }) => {
    const root = useRef(), paper = useRef(), t = useRef(0), hot = useRef(false);
    const narrow = useThree((st) => st.size.width / st.size.height < 0.62);   // tall phones: shorter ticket so it clears the result card
    useFrame(({ clock }, dt) => {
        t.current = ticket ? t.current + dt : 0;
        if (ticket && t.current - dt < 0.45 && t.current >= 0.45) sfx.print();
        const k = THREE.MathUtils.clamp((t.current - 0.45) / 1.0, 0, 1), e = 1 - Math.pow(1 - k, 3);
        root.current.visible = k > 0;
        paper.current.scale.y = Math.max(e, 0.001);
        root.current.rotation.x = 0.14 * e + Math.sin(clock.elapsedTime * 1.4) * 0.025 * e - (hot.current ? 0.12 : 0);
    });
    const tk = ticket;
    const sheet = useMemo(() => receiptGeometry(0.86, TICKET_H), []);
    const tex = useMemo(() => (tk ? receiptTexture(tk, TICKET_H / 0.86) : null), [tk]);
    useEffect(() => () => tex?.dispose(), [tex]);
    return (
        <group position={[0, -1.24, 0.92]}>
            <mesh material={mat.black}><boxGeometry args={[1.0, 0.035, 0.06]} /></mesh>
            <group ref={root} visible={false} scale={narrow ? 0.9 : 1.3}>
                <group ref={paper}>
                    <mesh geometry={sheet} onClick={(e) => { e.stopPropagation(); onTicket?.(); }}
                        onPointerOver={() => { hot.current = true; document.body.style.cursor = "pointer"; }}
                        onPointerOut={() => { hot.current = false; document.body.style.cursor = ""; }}>
                        <meshStandardMaterial map={tex} color={tex ? "#ffffff" : "#f2eee4"} roughness={0.92} metalness={0} alphaTest={0.5} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </group>
        </group>
    );
};

export const Machine = ({ spinning, pulled, booted, onPull, onArm, onReelStop, target, jackpot, count, ticket, onTicket, onDebug, ...props }) => (
    <group {...props}>
        <Internals />
        <Mechanism spinning={spinning} count={count} />
        {[-0.95, 0, 0.95].map((x, i) => <Reel key={i} index={i} x={x} spinning={spinning} target={target} onStop={onReelStop} />)}
        <Case />

        {/* printed bands */}
        <Text font={MONO} fontSize={0.1} letterSpacing={0.1} color={BONE} anchorX="left" anchorY="middle" position={[-1.42, 1.07, 0.845]}>PX-01</Text>
        <Text font={MONO} fontSize={0.075} letterSpacing={0.12} color={BONE} anchorX="right" anchorY="middle" position={[1.42, 1.07, 0.845]}>REALITY SELECTOR</Text>
        {["ERA", "MEDIUM", "MOOD"].map((t, i) => (
            <Text key={t} font={MONO} fontSize={0.075} letterSpacing={0.14} color={BONE} anchorX="center" anchorY="middle" position={[(i - 1) * 0.95, -0.2, 0.845]}>{`0${i + 1}  ${t}`}</Text>
        ))}
        <Text font={MONO} fontSize={0.065} letterSpacing={0.12} color={BONE} anchorX="left" anchorY="middle" position={[-1.42, -1.1, 0.845]}>AMAN PATEL — CLEAR EDITION</Text>
        <Text font={MONO} fontSize={0.065} letterSpacing={0.12} color={SIGNAL} anchorX="right" anchorY="middle" position={[1.42, -1.1, 0.845]}>EST. 2026</Text>
        {/* payline: red hairline + chrome arrow tabs at both ends */}
        <mesh position={[0, WIN.y, 0.8]}><planeGeometry args={[WIN.w, 0.008]} /><meshBasicMaterial color={SIGNAL} toneMapped={false} /></mesh>
        {[-1, 1].map((d) => (
            <mesh key={d} position={[d * (WIN.w / 2 + 0.09), WIN.y, 0.84]} rotation={[0, 0, d > 0 ? Math.PI / 2 : -Math.PI / 2]}>
                <coneGeometry args={[0.05, 0.09, 3]} /><meshBasicMaterial color={SIGNAL} toneMapped={false} />
            </mesh>
        ))}

        <Leds spinning={spinning} booted={booted} />
        <Lever pulled={pulled} onPull={onPull} onArm={onArm} onDebug={onDebug} />
        <GlintSweep spinning={spinning} />
        <Payout jackpot={jackpot} />
        <Ticket ticket={ticket} onTicket={onTicket} />
        {[[-1.4, 0.6], [1.4, 0.6], [-1.4, -0.6], [1.4, -0.6]].map(([x, z], i) => (
            <mesh key={i} position={[x, -1.3, z]} material={mat.chrome}><cylinderGeometry args={[0.1, 0.12, 0.1, 24]} /></mesh>
        ))}
    </group>
);

/* ---------------------------------------------------------------- glass surface: smudges + hairline scratches */

// Built once and assigned to the glass materials, so they catch light unevenly like real handled glass.
let smudgeTex;
const getSmudge = () => {
    if (smudgeTex) return smudgeTex;
    const c = document.createElement("canvas"); c.width = c.height = 512;
    const g = c.getContext("2d");
    g.fillStyle = "#1a1a1a"; g.fillRect(0, 0, 512, 512);              // mostly polished
    for (let i = 0; i < 40; i++) {                                       // soft fingerprint-like smudges
        const x = Math.random() * 512, y = Math.random() * 512, r = 20 + Math.random() * 60;
        const grad = g.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, "rgba(120,120,120,.35)"); grad.addColorStop(1, "rgba(120,120,120,0)");
        g.fillStyle = grad; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.strokeStyle = "rgba(200,200,200,.25)"; g.lineWidth = 0.6;          // hairline scratches
    for (let i = 0; i < 70; i++) {
        const x = Math.random() * 512, y = Math.random() * 512, a = Math.random() * Math.PI, l = 10 + Math.random() * 60;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    smudgeTex = new THREE.CanvasTexture(c);
    smudgeTex.wrapS = smudgeTex.wrapT = THREE.RepeatWrapping;
    return smudgeTex;
};
export const GlassSurface = () => {
    useEffect(() => {
        const t = getSmudge();
        [mat.shell, mat.plinth].forEach((m) => { m.roughnessMap = t; m.clearcoatRoughnessMap = t; m.needsUpdate = true; });
    }, []);
    return null;
};
