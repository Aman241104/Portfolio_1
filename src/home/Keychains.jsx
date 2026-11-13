import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { siReact, siTypescript, siNodedotjs, siThreedotjs } from "simple-icons";
import { mat } from "#machine/MachineModel.jsx";
import { sfx } from "#machine/sfx.js";

// Keychains on display cables either side of PX-01: the stack I build with (enamel charms with the real logos),
// a red ENTER keycap, and a racing helmet (bikes + helmet wraps). A designed layout, not a scatter: one depth,
// one size, mirrored. They're lowered in on load, sway together, turn once when touched or when the reels land.

const MONO = "/fonts/GeistMono-500.ttf";
const BOLD = "/fonts/Geist-800.ttf";
const SIGNAL = "#ff2e1f";
const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp01 = (x) => THREE.MathUtils.clamp(x, 0, 1);
const outBack = (k, s = 1.6) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);

const m = {
    redAnodised: new THREE.MeshPhysicalMaterial({ color: SIGNAL, metalness: 0.7, roughness: 0.32, clearcoat: 0.6 }),
    visor: new THREE.MeshPhysicalMaterial({ color: "#1b1d22", metalness: 0.9, roughness: 0.05, clearcoat: 1 }),
};

/* ---------------------------------------------------------------- the objects (each hangs from y = 0) */

// Enamel-pin style charm: chrome backplate (the rim), black enamel face, the real logo (Simple Icons, CC0)
// extruded on top in its brand colour, name engraved on the back, chrome hanging loop.
const plate = (size, r, depth) => {
    const h = size / 2, sh = new THREE.Shape();
    sh.moveTo(-h + r, -h); sh.lineTo(h - r, -h); sh.quadraticCurveTo(h, -h, h, -h + r); sh.lineTo(h, h - r);
    sh.quadraticCurveTo(h, h, h - r, h); sh.lineTo(-h + r, h); sh.quadraticCurveTo(-h, h, -h, h - r);
    sh.lineTo(-h, -h + r); sh.quadraticCurveTo(-h, -h, -h + r, -h);
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 10 });
    g.translate(0, 0, -depth / 2);
    return g;
};
const rimGeo = plate(0.96, 0.26, 0.09);
const faceGeo = plate(0.84, 0.21, 0.1);
const enamel = new THREE.MeshPhysicalMaterial({ color: "#0d0d0f", roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 });
const lightRim = new THREE.MeshPhysicalMaterial({
    color: "#e6e4de", roughness: 0.22, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.06,
    emissive: "#d8d5ce", emissiveIntensity: 0.32,
});
const clearFace = new THREE.MeshPhysicalMaterial({
    color: "#f7f5f0", roughness: 0.12, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04,
    emissive: "#ece9e2", emissiveIntensity: 0.38,
});
const darkInkLogo = new THREE.MeshPhysicalMaterial({ color: "#1c1c1f", roughness: 0.28, metalness: 0.2, clearcoat: 0.8 });
const logoCache = new Map();
const logoGeo = (icon) => {
    if (logoCache.has(icon.slug)) return logoCache.get(icon.slug);
    const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}"/></svg>`);
    const shapes = data.paths.flatMap((p) => p.toShapes(true));
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 1.4, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.25, bevelSegments: 2, curveSegments: 8 });
    g.translate(-12, -12, 0);
    logoCache.set(icon.slug, g);
    return g;
};
const LOGO_SCALE = 0.025;                                  // 24-unit icon → 0.6
const Charm = ({ icon, label, light }) => {
    const brand = useMemo(() => {
        const dark = parseInt(icon.hex, 16) < 0x333333;     // black logos (Next.js, three.js) become bone enamel
        return new THREE.MeshPhysicalMaterial({ color: dark ? "#edeae3" : `#${icon.hex}`, roughness: 0.28, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08 });
    }, [icon]);
    const geo = logoGeo(icon);
    return (
        <group position-y={-0.6}>
            <mesh geometry={rimGeo} material={light ? lightRim : mat.chrome} />
            <mesh geometry={faceGeo} material={light ? clearFace : enamel} position-z={0.012} />
            {/* the logo, front face; in Light Mode it renders as crisp carbon/gunmetal inside frosted gallery glass */}
            <mesh geometry={geo} material={light ? darkInkLogo : brand} position-z={0.065} scale={[LOGO_SCALE, -LOGO_SCALE, LOGO_SCALE]} />
            <Text font={MONO} fontSize={0.085} letterSpacing={0.12} color={light ? "#5a5854" : "#8a8780"} anchorX="center" anchorY="middle"
                position={[0, 0, -0.07]} rotation-y={Math.PI}>{label}</Text>
            <mesh position-y={0.5} rotation-y={Math.PI / 2} material={light ? lightRim : mat.chrome}><torusGeometry args={[0.07, 0.016, 10, 24]} /></mesh>
        </group>
    );
};

const Keycap = ({ label, material, ink, wide = 1 }) => (
    <group position-y={-0.42}>
        {/* stepped profile: wide skirt, narrower dished top */}
        <RoundedBox args={[0.62 * wide, 0.62, 0.3]} radius={0.07} smoothness={3} material={material} />
        <RoundedBox args={[0.5 * wide, 0.5, 0.12]} radius={0.06} smoothness={3} position-z={0.16} material={material} />
        <Text font={BOLD} fontSize={label.length > 2 ? 0.13 : 0.2} color={ink} anchorX="center" anchorY="middle" position-z={0.225}>{label}</Text>
    </group>
);

const Helmet = () => (
    <group position-y={-0.5}>
        <mesh material={mat.black}><sphereGeometry args={[0.38, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.62]} /></mesh>
        {/* smoked visor across the front */}
        <mesh rotation-y={-Math.PI / 2} material={m.visor}><sphereGeometry args={[0.385, 40, 16, Math.PI * 0.68, Math.PI * 0.64, Math.PI * 0.3, Math.PI * 0.18]} /></mesh>
        {/* red racing pinstripe over the crown */}
        <mesh rotation-y={Math.PI / 2} material={m.redAnodised}><torusGeometry args={[0.383, 0.018, 8, 64, Math.PI * 0.95]} /></mesh>
        <mesh position-y={-0.08} rotation-x={Math.PI / 2} material={mat.chrome}><torusGeometry args={[0.31, 0.012, 8, 48]} /></mesh>
    </group>
);

/* ---------------------------------------------------------------- hardware: split ring + two chain links */

const ringGeo = new THREE.TorusGeometry(0.13, 0.016, 10, 40);
const linkGeo = new THREE.TorusGeometry(0.05, 0.012, 8, 20);
const Hardware = () => (
    <group>
        <mesh geometry={linkGeo} material={mat.chrome} position-y={0.36} />
        <mesh geometry={linkGeo} material={mat.chrome} position-y={0.27} rotation-y={Math.PI / 2} />
        <mesh geometry={ringGeo} material={mat.chrome} position-y={0.1} rotation-x={0.25} />
    </group>
);

const Thing = ({ kind, ...p }) =>
    kind === "charm" ? <Charm {...p} /> : kind === "key" ? <Keycap {...p} /> : <Helmet />;

/* ---------------------------------------------------------------- placement */

// Unified 1:1 Match-Cut layout across both Dark Studio and Light Atelier:
// The 4 exhibition charms (UI-01 REACT, LANG-02 TYPESCRIPT, RUNTIME-03 NODE.JS, ENGINE-04 THREE.JS)
// stay at the exact same 3D coordinates, scale, and sway phase during Dark ↔ Light transitions.
const DESKTOP = [
    { sx: -0.82, sy: 0.66, item: "react", outer: true }, { sx: -0.52, sy: 0.56, item: "typescript", outer: false },
    { sx: 0.52, sy: 0.56, item: "node", outer: false }, { sx: 0.82, sy: 0.66, item: "three", outer: true },
];
// phones: a small even row on cables above the machine, clear of the lever on the right
const PHONE = [
    { sx: -0.62, sy: 0.46, item: "react" }, { sx: -0.2, sy: 0.49, item: "enter" }, { sx: 0.22, sy: 0.46, item: "node" },
];
const place = (aspect, framing) => {
    const { dist, lookY } = framing(aspect);
    const cam = new THREE.PerspectiveCamera(30, aspect, 0.1, 100);
    cam.position.set(0, 0.2, dist); cam.lookAt(0, lookY, 0); cam.updateMatrixWorld();
    const box = new THREE.Box2();
    for (const x of [-1.8, 2.2]) for (const y of [-1.5, 2.9]) for (const z of [-0.9, 0.9]) {
        const v = new THREE.Vector3(x, y, z).project(cam); box.expandByPoint(new THREE.Vector2(v.x, v.y));
    }
    const phone = aspect < 0.8;
    const ray = new THREE.Raycaster();
    const list = phone ? PHONE : DESKTOP;
    // Guarantee clean separation between the machine, inner keychains, and outer keychains on all laptop/desktop widths
    const innerLeft = Math.max(0.47, -box.min.x + 0.10);
    const innerRight = Math.max(0.47, box.max.x + 0.10);
    const outerLeft = Math.min(0.89, Math.max(0.76, innerLeft + 0.23));
    const outerRight = Math.min(0.89, Math.max(0.76, innerRight + 0.23));
    const deskScale = THREE.MathUtils.clamp(aspect * 0.52, 0.66, 0.84);
    return list.map(({ sx, sy, item, outer }, i) => {
        if (!phone) {
            const side = Math.sign(sx);
            const xMag = side < 0 ? (outer ? outerLeft : innerLeft) : (outer ? outerRight : innerRight);
            sx = side * xMag;
        }
        const at = (y) => { ray.setFromCamera({ x: sx, y }, cam); return ray.ray.at(((phone ? -3 : -3.2) - cam.position.z) / ray.ray.direction.z, new THREE.Vector3()); };
        let pos = at(sy), scale = phone ? 1 : deskScale;
        if (phone) {
            const bottomY = (p, k) => new THREE.Vector3(p.x, p.y - 1.7 * k, p.z).project(cam).y;
            const clear = box.max.y + 0.04;
            for (let y = sy; y <= 0.82 && bottomY(pos, scale) < clear; y += 0.02) pos = at(y);
            while (scale > 0.6 && bottomY(pos, scale) < clear) scale -= 0.05;
        }
        return { pos, item, seed: i + 1, cable: true, phone, scale };
    });
};

// The component archive: every object carries a catalogue number, like pieces in an exhibition.
const BY_ID = {
    react: { kind: "charm", icon: siReact, label: "REACT", code: "UI-01", note: "REACT" },
    typescript: { kind: "charm", icon: siTypescript, label: "TYPESCRIPT", code: "LANG-02", note: "TYPESCRIPT" },
    node: { kind: "charm", icon: siNodedotjs, label: "NODE.JS", code: "RUNTIME-03", note: "NODE.JS" },
    three: { kind: "charm", icon: siThreedotjs, label: "THREE.JS", code: "ENGINE-04", note: "THREE.JS" },
    enter: { kind: "key", label: "ENTER", material: m.redAnodised, ink: "#edeae3", wide: 1.7, code: "KEY-05", note: "ENTER" },
    helmet: { kind: "helmet", code: "GEAR-06", note: "HELMET" },
};

// hairline display cable from the ring up out of frame
const cableGeo = new THREE.CylinderGeometry(0.006, 0.006, 14, 6).translate(0, 7 + 0.42, 0);
const cableMatDark = new THREE.MeshBasicMaterial({ color: "#4a4844" });
const cableMatLight = new THREE.MeshBasicMaterial({ color: "#9c9891" });

const Keychain = ({ spot, index, lit, light, jackpot, kick }) => {
    const root = useRef(), swing = useRef(), hover = useRef(false);
    const turns = useRef(0), turned = useRef(0);
    const t0 = useRef(null), burst = useRef(9), was = useRef(false);
    const still = reduced ? 0 : 1;
    useFrame(({ clock }, dt) => {
        const t = clock.elapsedTime;
        if (lit && t0.current === null) t0.current = t;
        if (jackpot && !was.current) { burst.current = 0; turns.current += Math.PI * 2; }
        was.current = !!jackpot;
        burst.current += dt;
        // lowered in on their cables one after another, settle with a little bounce
        const k = reduced ? 1 : t0.current === null ? 0 : clamp01((t - t0.current - 1.4 - index * 0.12) / 1.2);
        const pop = Math.sin(clamp01(burst.current / 1.4) * Math.PI);
        root.current.position.set(spot.pos.x, spot.pos.y + (1 - outBack(k, 1.1)) * 6 + Math.sin(t * 0.8 + index * 0.9) * 0.06 * still + pop * 0.25, spot.pos.z);
        root.current.scale.setScalar(spot.scale * (hover.current ? 1.08 : 1));
        root.current.visible = k > 0;
        // one gentle wave across the set (phase by position), facing front; touch/win = one full turn, settles front
        turned.current = THREE.MathUtils.damp(turned.current, turns.current, 2.4, dt);
        // scrolling jolts the display: pieces swing on their cables (the touch-screen answer to hover)
        swing.current.rotation.z = Math.sin(t * 0.9 + index * 0.7) * 0.06 * still + kick.current * (index % 2 ? 1 : -0.8);
        swing.current.rotation.x = kick.current * 1.4 * (1 + (index % 3) * 0.25);
        swing.current.rotation.y = turned.current + Math.sin(t * 0.6 + index * 0.7) * 0.28 * still;
    });
    const info = BY_ID[spot.item];
    return (
        <group ref={root} visible={false}
            onPointerOver={(e) => { e.stopPropagation(); if (!hover.current) { turns.current += Math.PI * 2; sfx.coin(index); } hover.current = true; }}
            onPointerOut={() => { hover.current = false; }}
            onPointerDown={(e) => { e.stopPropagation(); turns.current += Math.PI * 2; sfx.coin(index); }}>
            {spot.cable && <mesh geometry={cableGeo} material={light ? cableMatLight : cableMatDark} />}
            <Hardware />
            <group ref={swing}><Thing {...info} light={light} /></group>
            {/* catalogue label on the display, not on the object: stays level while the piece sways; off during a win */}
            <group visible={!jackpot}>
            <Text font={MONO} fontSize={spot.phone ? 0.13 : 0.095} letterSpacing={0.12} color={light ? "#52504c" : "#8a8780"} anchorX="center" anchorY="top" position-y={-1.28}>
                {info.code}
            </Text>
            <Text font={MONO} fontSize={spot.phone ? 0.13 : 0.095} letterSpacing={0.08} color={light ? "#141416" : "#edeae3"} anchorX="center" anchorY="top" position-y={-1.44}>
                {info.note}
            </Text>
            </group>
        </group>
    );
};

export default function Keychains({ lit, light = false, jackpot, framing }) {
    const aspect = useThree((st) => st.size.width / st.size.height);
    // re-place only when the screen shape changes meaningfully (rotate, resize), not every pixel
    const bucket = Math.round(aspect * 10) / 10;
    const spots = useMemo(() => place(bucket, framing), [bucket, framing]);
    // scroll velocity → a decaying, springy kick shared by every piece
    const kick = useRef(0), vel = useRef(0), lastY = useRef(null);
    useFrame((_, dt) => {
        if (reduced) return;
        const y = window.scrollY, dy = lastY.current === null ? 0 : y - lastY.current;
        lastY.current = y;
        vel.current += THREE.MathUtils.clamp(dy, -80, 80) * 0.0016;      // impulse
        vel.current -= kick.current * 40 * dt;                            // spring back
        vel.current *= Math.exp(-3.2 * dt);                               // damping
        kick.current = THREE.MathUtils.clamp(kick.current + vel.current * dt * 10, -0.6, 0.6);
    });
    return spots.map((spot, i) => <Keychain key={`${bucket}-${light ? "L" : "D"}-${i}`} spot={spot} index={i} lit={lit} light={light} jackpot={jackpot} kick={kick} />);
}
