import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, ContactShadows, useGLTF, useTexture, Clouds, Cloud, Sky as PhysicalSky } from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { Machine, GlassSurface, mat } from "#machine/MachineModel.jsx";

// D2 lab: "clear hardware on an island". The machine itself lives in src/machine/MachineModel.jsx.

const FLOOR = -2.75;
// one low golden-hour sun, behind-left of the machine: drives the sky, the sea glint and the rim light
const SUN = new THREE.Vector3(-0.32, 0.035, -1).normalize();
const PLINTH_H = 0.8;
const PLINTH_TOP = FLOOR + PLINTH_H;
const MACHINE_Y = PLINTH_TOP + 0.06 + 1.35;


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
        return { geo, material, count: 22000 };
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
        <group key={i} ref={(g) => { refs.current[i] = g; }} scale={b.s}>
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
    useFrame((_, dt) => { if (ref.current) ref.current.material.uniforms.time.value += dt * 0.35; });
    return <water ref={ref} args={[geo, config]} rotation-x={-Math.PI / 2} position={[0, SEA, 0]} />;
};

/* ---------------------------------------------------------------- camera */

// Opens wide on the whole floating island (the diorama), then glides in until the reels fill the frame.
const HOLD_WIDE = typeof location !== "undefined" && new URLSearchParams(location.search).get("shot") === "wide";
const WIDE = { pos: new THREE.Vector3(7, -7.6, 44), look: new THREE.Vector3(0, -3.2, 0) };  // low over the water, far enough for negative space
const CLOSE = { pos: new THREE.Vector3(1.5, 1.3, 12.8), look: new THREE.Vector3(-0.2, -0.95, 0) };
const Rig = ({ onBooted, onStart }) => {
    const t0 = useRef(null);
    const done = useRef(false);
    const pos = useMemo(() => new THREE.Vector3(), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock, camera, pointer }) => {
        if (t0.current === null) { t0.current = clock.elapsedTime; onStart?.(); }   // first rendered frame with everything loaded
        const t = clock.elapsedTime - t0.current;
        // ?shot=wide freezes the opening frame (for reviewing/art-directing the intro)
        const k = HOLD_WIDE ? 0 : THREE.MathUtils.clamp((t - 2.6) / 5, 0, 1); // hold the wide shot under the title card, then glide
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // ease in-out cubic
        pos.lerpVectors(WIDE.pos, CLOSE.pos, e);
        look.lerpVectors(WIDE.look, CLOSE.look, e);
        pos.x += pointer.x * 0.8 * e; pos.y += pointer.y * 0.3 * e;        // parallax only once we've arrived
        camera.position.lerp(pos, 0.12);
        camera.lookAt(look);
        if (k === 1 && !done.current) { done.current = true; onBooted(); }
    });
    return null;
};

/* ---------------------------------------------------------------- scene */

export default function Machine3D({ onSpin, onArrive, onReady }) {
    const [spinning, setSpinning] = useState(false);
    const [pulled, setPulled] = useState(false);
    const [booted, setBooted] = useState(false);

    const pull = () => {
        if (spinning) return;
        setPulled(true); setSpinning(true); onSpin?.(true);
        setTimeout(() => setPulled(false), 260);
        setTimeout(() => { setSpinning(false); onSpin?.(false); }, 1600);
    };

    useEffect(() => {
        const onKey = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); pull(); } };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pexe:pull", pull);           // the page's "Pull the lever" button
        return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pexe:pull", pull); };
    });

    return (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [7, -7.6, 44], fov: 32, far: 1000 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.36 }}>
            {/* physical golden-hour sky with the sun low on the horizon, and warm haze that melts the far sea into it */}
            <PhysicalSky sunPosition={SUN.clone().multiplyScalar(100)} distance={4000} turbidity={2.6} rayleigh={1.3} mieCoefficient={0.0012} mieDirectionalG={0.96} />
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
                {/* the camera move starts only once everything above has loaded, so the wide shot is never wasted on a blank canvas */}
                <Rig onStart={onReady} onBooted={() => { setBooted(true); onArrive?.(); }} />
            </Suspense>
            <Plinth />
            <Machine position={[0, MACHINE_Y, 0]} spinning={spinning} pulled={pulled} booted={booted} onPull={pull} />
            <ContactShadows position={[0, FLOOR + 0.01, 0]} opacity={0.6} scale={12} blur={2.4} far={4} />

            {/* backlight from the low sun: hot rim on glass + chrome, long shadows toward camera */}
            <directionalLight position={SUN.clone().multiplyScalar(30).toArray()} intensity={3.4} color="#ff9e5e" castShadow shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0003} />
            {/* soft cool fill from the camera side so the front never goes black */}
            <directionalLight position={[4, 5, 10]} intensity={1.4} color="#a9bfdc" />
            <hemisphereLight args={["#ffd6b8", "#24302c", 0.35]} />

            {/* CC0 Poly Haven clear sunset for reflections only (the visible sky is the physical sky above) */}
            <Environment files="/hdri/kiara_8_sunset_1k.hdr" environmentIntensity={1.4}>
                <Lightformer form="rect" intensity={2} position={[0, 6, 6]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
                <Lightformer form="rect" intensity={1.5} position={[-6, 2, 4]} rotation-y={Math.PI / 3} scale={[2, 6, 1]} />
            </Environment>

            <EffectComposer multisampling={4}>
                {/* shallow focus on the machine: the foreground grass and far sea soften */}
                {booted ? <DepthOfField worldFocusDistance={13} worldFocusRange={7} bokehScale={2.2} /> : <></>}
                <Bloom mipmapBlur luminanceThreshold={7} intensity={0.45} radius={0.4} />  {/* only LEDs/payline exceed 7 */}
                <Vignette offset={0.3} darkness={0.55} />
            </EffectComposer>
        </Canvas>
    );
}

["fern_02"].forEach((n) => useGLTF.preload(`/models/${n}/${n}.gltf`));
