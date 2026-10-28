"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Text, ContactShadows, useGLTF, useTexture, Clouds, Cloud, Sky as PhysicalSky } from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { worlds } from "@worlds/registry.js";
import { getSeen, setSeen } from "@shell/storage.js";
import { audio } from "./audio";

// D2 lab: "clear hardware on an island". The clear-case machine on a glass plinth, standing on a small
// island of rock, grass and flowers floating on a dusk ocean ("Enjoy the Edge" ref). The sea and sky give
// the glass something real to reflect and refract.
// Everything is code + PBR + one CC0 Poly Haven HDRI. Units ≈ decimetres.

const MONO = "/fonts/GeistMono-500.ttf";
const BONE = "#edeae3";
const SIGNAL = "#ff2e1f";
const WIRE = "#ff7a1a";

const FLOOR = -2.75;
// one low golden-hour sun, behind-left of the machine: drives the sky, the sea glint and the rim light
const SUN = new THREE.Vector3(-0.32, 0.035, -1).normalize();
// the sun sinks during the intro: everything that depends on it reads this vector every frame
const sunDir = SUN.clone();
const setSunElevation = (y) => sunDir.set(-0.32, y, -1).normalize();
// lighter tier for phones / low-core laptops: fewer grass blades, no depth of field, lower DPR
const LITE = typeof window !== "undefined" &&
    (window.matchMedia("(max-width: 768px)").matches || (navigator.hardwareConcurrency || 8) <= 4);
const PLINTH_H = 0.8;
const PLINTH_TOP = FLOOR + PLINTH_H;
const MACHINE_Y = PLINTH_TOP + 0.06 + 1.35;

/* ---------------------------------------------------------------- materials */

const mat = {
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
    knob: new THREE.MeshPhysicalMaterial({ color: SIGNAL, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.04 }),
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

// Slot k on the payline ⇔ drum angle SLOT_OFFSET + k·SLOT_ANGLE. A spin carries the drum forward several
// whole turns and eases into the target world's slot, each reel later than the last.
const REEL_DIR = 1;
const easeOutBack = (t, s = 0.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const reelDuration = (index) => 1.5 + index * 0.5;

const Reel = ({ index, x, spin }) => {
    const ref = useRef();
    const { sharp, blur } = useReelTexture(index);
    const drum = useRef();
    const anim = useRef(null);           // { from, to, start, dur }
    const lastSlot = useRef(0);
    useFrame(({ clock }) => {
        const r = ref.current.rotation;
        if (spin && anim.current?.id !== spin.id) {
            const target = SLOT_OFFSET + REEL_DIR * spin.world * SLOT_ANGLE;
            const turns = (3 + index) * Math.PI * 2;
            const delta = (((target - r.x) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            anim.current = { id: spin.id, from: r.x, to: r.x + turns + delta, start: clock.elapsedTime, dur: reelDuration(index) };
        }
        let speed = 0;
        const a = anim.current;
        if (a) {
            const t = Math.min((clock.elapsedTime - a.start) / a.dur, 1);
            const prev = r.x;
            r.x = a.from + (a.to - a.from) * easeOutBack(t);
            speed = Math.abs(r.x - prev) * 60;
            const slot = Math.floor(r.x / SLOT_ANGLE);
            if (slot !== lastSlot.current) { lastSlot.current = slot; if (speed > 0.5) audio.click(1200 + speed * 60, 0.06, 0.02); }
        }
        drum.current.map = speed > 5 ? blur : sharp;
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

const brass = new THREE.MeshPhysicalMaterial({ color: "#c9a24e", metalness: 1, roughness: 0.22, clearcoat: 0.6 });
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
const Counter = ({ position }) => {
    const tex = useMemo(() => {
        const c = document.createElement("canvas"); c.width = 256; c.height = 64;
        const g = c.getContext("2d");
        g.fillStyle = "#0b0b0c"; g.fillRect(0, 0, 256, 64);
        "000427".split("").forEach((d, i) => {
            g.fillStyle = i < 3 ? "#202024" : "#2a2a2e"; g.fillRect(6 + i * 41, 6, 36, 52);
            g.fillStyle = "#edeae3"; g.font = "600 38px 'Geist Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
            g.fillText(d, 24 + i * 41, 33);
        });
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }, []);
    return (
        <mesh position={position}>
            <planeGeometry args={[0.56, 0.14]} />
            <meshStandardMaterial map={tex} roughness={0.4} />
        </mesh>
    );
};

const Mechanism = ({ spinning }) => (
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
        <Counter position={[0.2, 1.07, 0.845]} />

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
const Lever = ({ pulled, onPull }) => {
    const pivot = useRef();
    const drag = useRef(null);                      // { startY, angle } while dragging
    useEffect(() => {
        const move = (e) => {
            if (!drag.current) return;
            const raw = Math.max(0, (e.clientY - drag.current.startY) / 160);
            drag.current.angle = Math.min(1, raw / (1 + raw * 0.6)) * 0.95;   // resistance: diminishing return
        };
        const up = () => {
            if (!drag.current) return;
            if (drag.current.angle > 0.66) onPull();
            drag.current = null; document.body.style.cursor = "";
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    }, [onPull]);
    useFrame((_, dt) => {
        const target = drag.current ? drag.current.angle : pulled ? 0.9 : 0;
        pivot.current.rotation.x = THREE.MathUtils.damp(pivot.current.rotation.x, target, drag.current ? 20 : pulled ? 14 : 5, dt);
    });
    const grab = (e) => { e.stopPropagation(); drag.current = { startY: e.clientY, angle: 0 }; document.body.style.cursor = "grabbing"; };
    return (
        <group position={[1.6, 0.1, 0.05]}>
            <mesh material={mat.black} rotation={[0, 0, Math.PI / 2]} position={[0.04, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.08, 48]} /></mesh>
            <mesh material={mat.chrome} rotation={[0, 0, Math.PI / 2]} position={[0.15, 0, 0]}><cylinderGeometry args={[0.22, 0.24, 0.16, 48]} /></mesh>
            <group ref={pivot} position={[0.2, 0, 0]}>
                <mesh material={mat.chrome} position={[0, 0.65, 0]}><cylinderGeometry args={[0.04, 0.055, 1.3, 32]} /></mesh>
                <mesh material={mat.knob} position={[0, 1.36, 0]} onPointerDown={grab}
                    onPointerOver={() => (document.body.style.cursor = "grab")} onPointerOut={() => !drag.current && (document.body.style.cursor = "")}>
                    <sphereGeometry args={[0.17, 64, 64]} />
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

const Machine = ({ spinning, spin, pulled, booted, onPull }) => (
    <group position={[0, MACHINE_Y, 0]} onClick={(e) => { e.stopPropagation(); onPull(); }}>
        <Internals />
        <Mechanism spinning={spinning} />
        {[-0.95, 0, 0.95].map((x, i) => <Reel key={i} index={i} x={x} spin={spin} />)}
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
        <Lever pulled={pulled} onPull={onPull} />
        <GlintSweep spinning={spinning} />
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
const GlassSurface = () => {
    useEffect(() => {
        const t = getSmudge();
        [mat.shell, mat.plinth].forEach((m) => { m.roughnessMap = t; m.clearcoatRoughnessMap = t; m.needsUpdate = true; });
    }, []);
    return null;
};

/* ---------------------------------------------------------------- island */

const ISLAND_R = 6;
const ISLAND_DEPTH = 2.4;   // rock showing above the waterline
const UNDER = 4.4;          // rocky underside tapering below the rim
const SEA = FLOOR - ISLAND_DEPTH - UNDER - 1.8;  // the island hangs well above the water

const Plinth = () => (
    <group>
        <RoundedBox args={[3.9, PLINTH_H, 2.3]} radius={0.05} smoothness={4} position={[0, FLOOR + PLINTH_H / 2, 0]} material={mat.plinth} castShadow />
        <RoundedBox args={[3.5, 0.06, 2.0]} radius={0.02} position={[0, PLINTH_TOP + 0.03, 0]} material={mat.chrome} />
    </group>
);

// Rock drum with an irregular, tapering edge + a grass-and-rock top. CC0 Poly Haven textures.
// Underside: a short dark rock core wrapped in tiers of real textured boulders that shrink toward a tip,
// so it reads as broken-off rock, not a smooth cone.
const Underside = () => {
    const [diff, nor, rough] = useTexture(["/textures/coast_land_rocks_01_diff_1k.jpg", "/textures/coast_land_rocks_01_nor_1k.jpg", "/textures/coast_land_rocks_01_rough_1k.jpg"]);
    const core = useMemo(() => {
        const g = new THREE.ConeGeometry(ISLAND_R * 0.7, UNDER * 0.75, 48, 8, true);
        g.rotateX(Math.PI);
        return g;
    }, []);
    const chunks = useMemo(() => {
        const out = [];
        const tiers = [[ISLAND_R * 0.64, 0.3, 1.5, 9], [ISLAND_R * 0.42, 1.4, 1.1, 7], [ISLAND_R * 0.24, 2.6, 0.75, 5], [ISLAND_R * 0.1, 3.7, 0.5, 3], [0, 4.6, 0.32, 1]];
        let k = 0;
        tiers.forEach(([r, depth, size, n]) => {
            for (let i = 0; i < n; i++, k++) {
                const a = (i / n) * Math.PI * 2 + rand(k + 700) * 0.5;
                const sc = size * (0.45 + rand(k + 710) * 1.0);                      // wide size spread: a few big, many small
                out.push({ seed: k + 60, pos: [Math.cos(a) * r, FLOOR - ISLAND_DEPTH - depth - rand(k + 720) * 0.5, Math.sin(a) * r], sc: [sc, sc * (1.2 + rand(k + 730) * 0.9), sc], shade: 1 - depth / 7 });
            }
        });
        return out;
    }, []);
    return (
        <group>
            <mesh geometry={core} position={[0, FLOOR - ISLAND_DEPTH - UNDER * 0.375, 0]}>
                <meshStandardMaterial color="#2e2a26" roughness={1} side={THREE.DoubleSide} />
            </mesh>
            {chunks.map((c) => <HangingRock key={c.seed} {...c} maps={[diff, nor, rough]} />)}
        </group>
    );
};
const HangingRock = ({ seed, pos, sc, maps, shade }) => {
    const geo = useBoulderGeo(seed);
    return (
        <mesh geometry={geo} position={pos} scale={sc} rotation={[rand(seed) * 0.6, seed, rand(seed + 1) * 0.6]} castShadow>
            <meshStandardMaterial map={maps[0]} normalMap={maps[1]} roughnessMap={maps[2]} color={new THREE.Color("#8a827a").multiplyScalar(0.55 + shade * 0.45)} />
        </mesh>
    );
};

// Roots dangling from the rim's underside, swaying slightly.
const Roots = () => {
    const ref = useRef();
    const geos = useMemo(() => Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + rand(i + 300) * 0.3, r = ISLAND_R * (0.66 + rand(i + 310) * 0.1);
        const len = 1.2 + rand(i + 320) * 2.4, y0 = FLOOR - ISLAND_DEPTH + 0.1;
        const pts = Array.from({ length: 6 }, (_, k) => {
            const t = k / 5, wob = Math.sin(t * 6 + i) * 0.18 * t;
            return new THREE.Vector3(Math.cos(a) * (r - t * 0.6) + wob, y0 - t * len, Math.sin(a) * (r - t * 0.6) + wob);
        });
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.03 * (1 - rand(i + 330) * 0.5), 6, false);
    }), []);
    useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.006; });
    const rootMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3b2c22", roughness: 0.9 }), []);
    return <group ref={ref}>{geos.map((g, i) => <mesh key={i} geometry={g} material={rootMat} />)}</group>;
};

const Island = () => {
    const [rDiff, rNor, rRough, gDiff, gNor, gRough] = useTexture([
        "/textures/coast_land_rocks_01_diff_1k.jpg", "/textures/coast_land_rocks_01_nor_1k.jpg", "/textures/coast_land_rocks_01_rough_1k.jpg",
        "/textures/aerial_grass_rock_diff_1k.jpg", "/textures/aerial_grass_rock_nor_1k.jpg", "/textures/aerial_grass_rock_rough_1k.jpg",
    ]);
    useLayoutEffectOnce(() => {
        [rDiff, rNor, rRough].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 1.2); });
        [gDiff, gNor, gRough].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); });
        rDiff.colorSpace = gDiff.colorSpace = THREE.SRGBColorSpace;
    });
    const sideGeo = useMemo(() => {
        const g = new THREE.CylinderGeometry(ISLAND_R, ISLAND_R * 0.72, ISLAND_DEPTH, 96, 8, true);
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {                    // lumpy, eroded edge
            const x = p.getX(i), z = p.getZ(i), y = p.getY(i);
            const a = Math.atan2(z, x);
            const n = 1 + Math.sin(a * 5) * 0.04 + Math.sin(a * 13 + y * 2) * 0.03 + Math.sin(a * 29) * 0.015;
            p.setX(i, x * n); p.setZ(i, z * n);
        }
        g.computeVertexNormals();
        return g;
    }, []);
    const topGeo = useMemo(() => {
        const g = new THREE.CircleGeometry(ISLAND_R, 96);
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), a = Math.atan2(y, x);
            const n = 1 + Math.sin(a * 5) * 0.04 + Math.sin(a * 13 + 1.2) * 0.03 + Math.sin(a * 29) * 0.015;
            p.setX(i, x * n); p.setY(i, y * n);
        }
        return g;
    }, []);
    return (
        <group>
            <mesh geometry={sideGeo} position={[0, FLOOR - ISLAND_DEPTH / 2, 0]} receiveShadow>
                <meshStandardMaterial map={rDiff} normalMap={rNor} roughnessMap={rRough} color="#8d8780" side={THREE.DoubleSide} />
            </mesh>
            <mesh geometry={topGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR, 0]} receiveShadow>
                <meshStandardMaterial map={gDiff} normalMap={gNor} roughnessMap={gRough} color="#9aa58a" />
            </mesh>
        </group>
    );
};

function useLayoutEffectOnce(fn) {
    const done = useRef(false);
    useEffect(() => { if (!done.current) { done.current = true; fn(); } });
}

// ~22k instanced grass blades on the island top, swaying in a shader. Clear of the plinth footprint.
const Grass = () => {
    const ref = useRef();
    const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
    const { geo, material, count } = useMemo(() => {
        const geo = new THREE.PlaneGeometry(0.06, 0.55, 1, 4);
        geo.translate(0, 0.275, 0);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {                    // taper to a point
            const y = p.getY(i) / 0.55;
            p.setX(i, p.getX(i) * (1 - y * 0.95));
        }
        const material = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.75, side: THREE.DoubleSide });
        material.onBeforeCompile = (s) => {
            s.uniforms.uTime = uniforms.uTime;
            s.vertexShader = "uniform float uTime;\nvarying float vH;\n" + s.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
                float h = position.y / 0.55;
                vH = h;
                vec4 wp = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
                transformed.x += sin(uTime * 1.4 + wp.x * 0.7 + wp.z * 0.5) * 0.08 * h * h;
                transformed.z += cos(uTime * 1.1 + wp.x * 0.4) * 0.05 * h * h;`);
            s.fragmentShader = "varying float vH;\n" + s.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
                diffuseColor.rgb *= mix(0.25, 0.85, vH);   // dark roots, sunlit tips (kept below clipping in backlight)`);
        };
        return { geo, material, count: LITE ? 8000 : 22000 };
    }, [uniforms]);
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pos = new THREE.Vector3(), e = new THREE.Euler(), col = new THREE.Color();
        let n = 0;
        while (n < count) {
            const r = Math.sqrt(Math.random()) * (ISLAND_R - 0.3), a = Math.random() * Math.PI * 2;
            const x = Math.cos(a) * r, z = Math.sin(a) * r;
            if (Math.abs(x) < 2.05 && Math.abs(z) < 1.3) continue; // leave the plinth's footprint clear
            pos.set(x, FLOOR, z);
            q.setFromEuler(e.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4));
            const h = 0.22 + Math.random() * Math.random() * 0.55;      // mostly short, a few taller tufts
            s.set(1, h, 1);
            ref.current.setMatrixAt(n, m.compose(pos, q, s));
            // per-blade colour: greens with the odd dry, sun-bleached blade
            col.setHSL(0.24 + (Math.random() - 0.5) * 0.06, 0.45 + Math.random() * 0.2, 0.32 + Math.random() * 0.12);
            if (Math.random() < 0.08) col.setHSL(0.13, 0.45, 0.55);
            ref.current.setColorAt(n++, col);
        }
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.instanceColor.needsUpdate = true;
    }, [count]);
    useFrame(({ clock }) => { uniforms.uTime.value = clock.elapsedTime; });
    return <instancedMesh ref={ref} args={[geo, material, count]} receiveShadow />;
};

// CC0 Poly Haven plants, fitted to a target height and placed on the island top.
const Plant = ({ name, height, position, rotation = 0 }) => {
    const { scene } = useGLTF(`/models/${name}/${name}.gltf`);
    const model = useMemo(() => {
        const m = scene.clone(true);
        m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), sc = height / size.y;
        m.scale.setScalar(sc);
        m.position.set(-(box.min.x + size.x / 2) * sc, -box.min.y * sc, -(box.min.z + size.z / 2) * sc);
        return m;
    }, [scene, height]);
    return <primitive object={model} position={[position[0], FLOOR, position[1]]} rotation-y={rotation} />;
};

const Vegetation = () => (
    <>
        {/* ferns only: the gazania/dandelion models are wide scattered patches that overhang the rim; the flower carpet covers flowers */}
        <Plant name="fern_02" height={2.0} position={[-3.4, -2.3]} rotation={0.8} />
        <Plant name="fern_02" height={1.5} position={[3.2, -2.5]} rotation={2.2} />
    </>
);


/* ---------------------------------------------------------------- rocks, foam, clouds */

// Seeded pseudo-random so the island looks the same on every load.
const rand = (seed) => { const x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); };

// Boulder: icosphere with layered sine displacement, squashed, wearing the CC0 coastal-rock texture.
const useBoulderGeo = (seed) => useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 4);
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        const n = 1 + Math.sin(v.x * 3 + seed) * 0.12 + Math.sin(v.y * 5 + seed * 2) * 0.08 + Math.sin(v.z * 7 + seed * 3) * 0.05;
        v.multiplyScalar(n); v.y *= 0.62;
        p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
}, [seed]);

const Boulder = ({ seed, position, scale }) => {
    const geo = useBoulderGeo(seed);
    const [diff, nor, rough] = useTexture(["/textures/coast_land_rocks_01_diff_1k.jpg", "/textures/coast_land_rocks_01_nor_1k.jpg", "/textures/coast_land_rocks_01_rough_1k.jpg"]);
    return (
        <mesh geometry={geo} position={position} scale={scale} rotation-y={seed} castShadow receiveShadow>
            <meshStandardMaterial map={diff} normalMap={nor} roughnessMap={rough} color="#a39e96" />
        </mesh>
    );
};

const Rocks = () => {
    const list = useMemo(() => {
        const out = [];
        // three accent clusters on the rim (big + small), not a full ring
        [[2.4, 0.9], [4.1, 0.4], [-0.5, 0.75]].forEach(([a, sc], k) => {
            const r = ISLAND_R * 0.93;
            out.push({ seed: k * 3 + 1, position: [Math.cos(a) * r, FLOOR - 0.05 + sc * 0.2, Math.sin(a) * r], scale: sc });
            out.push({ seed: k * 3 + 2, position: [Math.cos(a + 0.18) * r, FLOOR + 0.05, Math.sin(a + 0.18) * r], scale: sc * 0.45 });
            out.push({ seed: k * 3 + 3, position: [Math.cos(a - 0.14) * (r - 0.4), FLOOR + 0.02, Math.sin(a - 0.14) * (r - 0.4)], scale: sc * 0.3 });
        });
        return out;
    }, []);
    return list.map((r, i) => <Boulder key={i} {...r} />);
};

// Volumetric cloud banks along the horizon (drei Clouds with a locally generated sprite), warm-lit by the low sun.
const CloudBank = () => (
    <Clouds material={THREE.MeshLambertMaterial} texture="/textures/cloud.png" limit={400}>
        <Cloud seed={1} segments={40} bounds={[40, 6, 6]} volume={18} position={[-30, 16, -110]} color="#ffd2b0" fade={60} speed={0.05} />
        <Cloud seed={2} segments={40} bounds={[50, 7, 6]} volume={22} position={[35, 20, -130]} color="#f7c9a8" fade={60} speed={0.04} />
        <Cloud seed={3} segments={30} bounds={[30, 4, 5]} volume={14} position={[5, 11, -90]} color="#ffe0c2" fade={50} speed={0.06} />
        <Cloud seed={4} segments={24} bounds={[24, 3, 4]} volume={10} position={[-55, 9, -80]} color="#e9b99c" fade={40} speed={0.05} />
    </Clouds>
);

// Dense ring of small flower heads between the plinth and the rim ("Enjoy the Edge" flower island).
const FLOWER_COLORS = ["#e8743a", "#efb56a", "#ece6da", "#d77aa3", "#8f7fd6", "#e9c95a"];
const FlowerCarpet = () => {
    const petals = useRef(), centres = useRef(), stems = useRef();
    const count = 700;
    const { headGeo, centreGeo, stemGeo } = useMemo(() => {
        const parts = Array.from({ length: 5 }, (_, i) => {
            const g = new THREE.CircleGeometry(0.05, 10);
            g.scale(1, 0.48, 1); g.translate(0, 0.045, 0);            // elongated petal pointing out
            g.rotateX(-Math.PI / 2 + 0.35);                           // lie open, slightly cupped
            g.rotateY((i / 5) * Math.PI * 2);
            return g;
        });
        const headGeo = mergeGeometries(parts); headGeo.translate(0, 0.26, 0);
        const centreGeo = new THREE.SphereGeometry(0.022, 10, 8); centreGeo.translate(0, 0.27, 0);
        const stemGeo = new THREE.CylinderGeometry(0.004, 0.006, 0.26, 5); stemGeo.translate(0, 0.13, 0);
        return { headGeo, centreGeo, stemGeo };
    }, []);
    const mats = useMemo(() => ({
        petal: new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }),
        centre: new THREE.MeshStandardMaterial({ color: "#e0a83a", roughness: 0.7 }),
        stem: new THREE.MeshStandardMaterial({ color: "#4d6b34", roughness: 0.8 }),
    }), []);
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), col = new THREE.Color(), axis = new THREE.Vector3();
        let n = 0, k = 0;
        while (n < count) {
            k++;
            const r = 3.9 + rand(k) * (ISLAND_R - 4.2), a = rand(k + 1000) * Math.PI * 2;
            const x = Math.cos(a) * r, z = Math.sin(a) * r;
            if (Math.abs(x) < 2.2 && Math.abs(z) < 1.4) continue;
            const pick = Math.floor((a / (Math.PI * 2)) * 9 + rand(k + 7) * 2.2) % FLOWER_COLORS.length;
            pos.set(x, FLOOR, z);
            q.setFromAxisAngle(axis.set(rand(k + 4) - 0.5, 4, rand(k + 5) - 0.5).normalize(), rand(k + 6) * 6);
            const size = 0.8 + rand(k + 8) * 0.9;
            sc.set(size, size * (0.8 + rand(k + 9) * 0.6), size);
            m.compose(pos, q, sc);
            [petals, centres, stems].forEach((r) => r.current.setMatrixAt(n, m));
            petals.current.setColorAt(n++, col.set(FLOWER_COLORS[pick]));
        }
        [petals, centres, stems].forEach((r) => (r.current.instanceMatrix.needsUpdate = true));
        petals.current.instanceColor.needsUpdate = true;
    }, []);
    return (
        <>
            <instancedMesh ref={petals} args={[headGeo, mats.petal, count]} castShadow />
            <instancedMesh ref={centres} args={[centreGeo, mats.centre, count]} />
            <instancedMesh ref={stems} args={[stemGeo, mats.stem, count]} />
        </>
    );
};

// One hero chrome cosmos beside the plinth: the island's single "designed" flower.
const usePetalGeometry = (len, width, cup) => useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(0, 0);
    sh.bezierCurveTo(width, len * 0.25, width * 0.9, len * 0.85, 0, len);
    sh.bezierCurveTo(-width * 0.9, len * 0.85, -width, len * 0.25, 0, 0);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.012, bevelSegments: 3, curveSegments: 24 });
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), t = y / len;
        p.setZ(i, p.getZ(i) + cup * t * t + Math.abs(x) * cup * 0.8);
    }
    g.computeVertexNormals();
    return g;
}, [len, width, cup]);

const HeroFlower = () => {
    const head = useRef();
    const petal = usePetalGeometry(0.5, 0.16, 0.18);
    const curve = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.1, 1.2, 0.05), new THREE.Vector3(-0.35, 2.3, 0.15)]), []);
    const stem = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.02, 10, false), [curve]);
    const leaf = usePetalGeometry(0.45, 0.12, 0.1);
    useFrame(({ clock }) => { if (head.current) head.current.rotation.z = 0.25 + Math.sin(clock.elapsedTime * 0.7) * 0.04; });
    return (
        <group position={[-2.55, FLOOR, 0.95]}>
            <mesh geometry={stem} material={mat.chrome} castShadow />
            <mesh geometry={leaf} material={mat.chrome} position={[-0.06, 0.8, 0.02]} rotation={[0.4, 0.3, 0.9]} />
            <mesh geometry={leaf} material={mat.chrome} position={[-0.08, 1.25, 0.04]} rotation={[0.3, -0.4, -0.8]} scale={0.8} />
            <group ref={head} position={curve.getPoint(1)} rotation={[0.55, 0, 0.25]}>
                {Array.from({ length: 8 }, (_, i) => (
                    <mesh key={i} geometry={petal} material={mat.chrome} rotation={[Math.PI / 2 - 0.25, 0, (i / 8) * Math.PI * 2]} castShadow />
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                    <mesh key={`in${i}`} geometry={petal} material={mat.chrome} scale={0.6} rotation={[Math.PI / 2 - 0.85, 0, ((i + 0.5) / 8) * Math.PI * 2]} />
                ))}
                <mesh material={mat.knob}><sphereGeometry args={[0.075, 32, 16]} /></mesh>
            </group>
        </group>
    );
};

// A loose flock crossing the low sun: two-plane silhouettes that flap and drift.
const Birds = () => {
    const refs = useRef([]);
    const birds = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
        x: -48 + rand(i + 500) * 26, y: 2.5 + rand(i + 510) * 3.5, z: -85 - rand(i + 520) * 20, s: 1.3 + rand(i + 530) * 0.7, ph: rand(i + 540) * 6,
    })), []);
    const wing = useMemo(() => {
        const sh = new THREE.Shape();
        sh.moveTo(0, -0.08); sh.quadraticCurveTo(0.6, 0.1, 1.25, -0.02); sh.quadraticCurveTo(0.6, -0.02, 0, 0.08);
        return new THREE.ShapeGeometry(sh);
    }, []);
    const ink = useMemo(() => new THREE.MeshBasicMaterial({ color: "#3a2a26", side: THREE.DoubleSide, fog: false }), []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        refs.current.forEach((g, i) => {
            if (!g) return;
            const b = birds[i];
            g.position.set(((b.x + t * 1.6 + 60) % 120) - 60, b.y + Math.sin(t * 0.7 + b.ph) * 0.6, b.z);
            const flap = 0.25 + Math.sin(t * 6 + b.ph) * 0.45;
            g.children[0].rotation.z = flap; g.children[1].rotation.z = Math.PI - flap;
        });
    });
    return birds.map((b, i) => (
        <group key={i} ref={(g) => (refs.current[i] = g)} scale={b.s}>
            <mesh geometry={wing} material={ink} />
            <mesh geometry={wing} material={ink} />
        </group>
    ));
};

/* ---------------------------------------------------------------- ocean */

extend({ Water });
const Ocean = () => {
    const ref = useRef();
    const normals = useTexture("/textures/waternormals.jpg");
    const geo = useMemo(() => new THREE.PlaneGeometry(600, 600), []);
    const config = useMemo(() => {
        normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
        return {
            textureWidth: 512, textureHeight: 512, waterNormals: normals,
            sunDirection: SUN.clone(), sunColor: 0xffa860,
            waterColor: 0x0b2c38, distortionScale: 2.4, fog: true,
        };
    }, [normals]);
    useFrame((_, dt) => {
        if (!ref.current) return;
        ref.current.material.uniforms.time.value += dt * 0.35;
        ref.current.material.uniforms.sunDirection.value.copy(sunDir);
    });
    return <water ref={ref} args={[geo, config]} rotation-x={-Math.PI / 2} position={[0, SEA, 0]} />;
};

// Sky + key light track the animated sun.
const SunRig = ({ light }) => {
    const sky = useRef();
    useFrame(() => {
        sky.current?.material.uniforms.sunPosition.value.copy(sunDir).multiplyScalar(100);
        light.current?.position.copy(sunDir).multiplyScalar(30);
    });
    return <PhysicalSky ref={sky} sunPosition={SUN.clone().multiplyScalar(100)} distance={4000} turbidity={2.6} rayleigh={1.3} mieCoefficient={0.0012} mieDirectionalG={0.96} />;
};

/* ---------------------------------------------------------------- camera */

// The intro camera: a curve, not a straight glide. Low over the water → arc around the island's side →
// rise past the rocky underside → push in to the machine. Held on the first frame until the visitor enters.
const PATH = new THREE.CatmullRomCurve3([
    new THREE.Vector3(7, -7.6, 44), new THREE.Vector3(-14, -6.2, 30), new THREE.Vector3(-13, -3.2, 17),
    new THREE.Vector3(-4, 1.8, 15), new THREE.Vector3(1.5, 1.3, 12.8),
], false, "centripetal");
const LOOK = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0, -4.4, 0), new THREE.Vector3(0, -3.6, 0),
    new THREE.Vector3(0, -1.4, 0), new THREE.Vector3(-0.2, -0.95, 0),
], false, "centripetal");
const INTRO_SECONDS = 7;

const Rig = ({ entered, hold, dof, onBooted, onStart }) => {
    const t0 = useRef(null);
    const done = useRef(false);
    const pos = useMemo(() => new THREE.Vector3(), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock, camera, pointer }) => {
        if (t0.current === null) onStart?.();                               // first rendered frame with everything loaded
        if (t0.current === null && entered && !hold) t0.current = clock.elapsedTime + 0.9;  // a beat after Enter
        const t = t0.current === null ? 0 : Math.max(0, clock.elapsedTime - t0.current);
        const k = Math.min(t / INTRO_SECONDS, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // ease in-out cubic
        PATH.getPoint(e, pos); LOOK.getPoint(e, look);
        // handheld: a little drift while travelling, none on arrival
        const shake = Math.sin(Math.PI * e) * 0.06;
        pos.x += Math.sin(clock.elapsedTime * 0.9) * shake; pos.y += Math.sin(clock.elapsedTime * 1.3 + 1) * shake;
        pos.x += pointer.x * 0.8 * e; pos.y += pointer.y * 0.3 * e;              // parallax once arrived
        camera.position.lerp(pos, 0.12);
        camera.lookAt(look);
        // portrait screens: widen the lens so the island fits
        const fov = camera.aspect < 0.9 ? 48 : 32;
        if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
        setSunElevation(0.07 - 0.035 * e);                                       // the sun sinks while we travel
        audio.swell(k > 0 && k < 1 ? k : 0);
        if (dof.current) dof.current.bokehScale = 2.2 * THREE.MathUtils.smoothstep(e, 0.85, 1);  // focus pull on arrival
        if (k === 1 && !done.current) { done.current = true; onBooted(); }
    });
    return null;
};

/* ---------------------------------------------------------------- scene */

// No repeats until every world has been seen this session, then start over.
const pickWorld = () => {
    const seen = getSeen();
    let pool = worlds.filter((w) => !seen.includes(w.id));
    if (pool.length === 0) pool = worlds;
    const w = pool[Math.floor(Math.random() * pool.length)];
    setSeen(pool === worlds ? [w.id] : [...seen, w.id]);
    return w;
};

export default function Machine3D({ entered = false, hold = false, onSpin, onArrive, onReady, onLand }) {
    const [spin, setSpin] = useState(null);          // { id, world: index, worldId }
    const [spinning, setSpinning] = useState(false);
    const [pulled, setPulled] = useState(false);
    const [booted, setBooted] = useState(false);
    const dof = useRef(null);
    const key = useRef(null);

    const pull = () => {
        if (spinning || !booted) return;
        const w = pickWorld();
        setPulled(true); setSpinning(true); onSpin?.(true, w);
        setSpin((prev) => ({ id: (prev?.id ?? 0) + 1, world: worlds.indexOf(w), worldId: w.id }));
        audio.ratchet();
        setTimeout(() => setPulled(false), 260);
        setTimeout(() => {                                   // the last reel has settled
            setSpinning(false); onSpin?.(false, w); audio.chime();
            onLand?.(w.id);
        }, reelDuration(2) * 1000 + 150);
    };

    useEffect(() => {
        const onKey = (e) => { if ((e.key === " " || e.key === "Enter") && !e.target.closest?.("button, a, input")) { e.preventDefault(); pull(); } };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pexe:pull", pull);           // the page's "Pull the lever" button
        return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pexe:pull", pull); };
    });

    return (
        <Canvas shadows dpr={[1, LITE ? 1.25 : 2]} camera={{ position: [7, -7.6, 44], fov: 32, far: 1000 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.36 }}>
            {/* physical golden-hour sky; the sun sinks a little during the intro */}
            <SunRig light={key} />
            <fog attach="fog" args={["#e7b493", 60, 340]} />
            <GlassSurface />

            <Suspense fallback={null}>
                <Island />
                <Grass />
                <Vegetation />
                <Rocks />
                <Ocean />
                <Underside />
                <Roots />
                <FlowerCarpet />
                <HeroFlower />
                <Birds />
                <CloudBank />
                {/* mounted after everything above has loaded, so the opening frame is never a blank canvas */}
                <Rig entered={entered} hold={hold} dof={dof} onStart={onReady} onBooted={() => { setBooted(true); onArrive?.(); }} />
            </Suspense>
            <Plinth />
            <Machine spinning={spinning} spin={spin} pulled={pulled} booted={booted} onPull={pull} />
            <ContactShadows position={[0, FLOOR + 0.01, 0]} opacity={0.6} scale={12} blur={2.4} far={4} />

            {/* backlight from the low sun: hot rim on glass + chrome, long shadows toward camera */}
            <directionalLight ref={key} position={SUN.clone().multiplyScalar(30).toArray()} intensity={3.4} color="#ff9e5e" castShadow shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0003} />
            {/* soft cool fill from the camera side so the front never goes black */}
            <directionalLight position={[4, 5, 10]} intensity={1.4} color="#a9bfdc" />
            <hemisphereLight args={["#ffd6b8", "#24302c", 0.35]} />

            {/* CC0 Poly Haven clear sunset for reflections only (the visible sky is the physical sky) */}
            <Environment files="/hdri/kiara_8_sunset_1k.hdr" environmentIntensity={1.4}>
                <Lightformer form="rect" intensity={2} position={[0, 6, 6]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
                <Lightformer form="rect" intensity={1.5} position={[-6, 2, 4]} rotation-y={Math.PI / 3} scale={[2, 6, 1]} />
            </Environment>

            <EffectComposer multisampling={LITE ? 0 : 4}>
                {/* focus pulls onto the machine as the camera arrives (bokeh ramps 0 → 2.2) */}
                {LITE ? <></> : <DepthOfField ref={dof} worldFocusDistance={13} worldFocusRange={7} bokehScale={0} />}
                <Bloom mipmapBlur luminanceThreshold={7} intensity={0.45} radius={0.4} />  {/* only LEDs/payline exceed 7 */}
                <Vignette offset={0.3} darkness={0.55} />
            </EffectComposer>
        </Canvas>
    );
}

["fern_02"].forEach((n) => useGLTF.preload(`/models/${n}/${n}.gltf`));
