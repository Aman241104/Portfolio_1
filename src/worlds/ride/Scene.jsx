import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { shot } from "../../../content/work.js";
import { STOPS, END, LENGTH, ROAD_W, LANE_X, MODELS, frame, at, scenery } from "./route.js";

const FONT = "/fonts/Geist-800.ttf";

export const RIDE_PRESETS = {
    golden: {
        id: "golden",
        idx: "01",
        label: "GOLDEN HOUR",
        sub: "Ahmedabad Coast",
        fog: "#f0b07a",
        skyZen: [0.28, 0.44, 0.68],
        skyMid: [0.98, 0.68, 0.42],
        skyHor: [1.0, 0.84, 0.56],
        sunColor: [1.0, 0.62, 0.30],
        sunHex: "#ffb06a",
        sunIntensity: 2.6,
        hemiSky: "#ffd9ad",
        hemiGround: "#6f5a3c",
        waterDeep: [0.04, 0.16, 0.26],
        waterShallow: [0.12, 0.36, 0.44],
        waterGlint: [1.0, 0.78, 0.42],
        recolour: {
            leafsGreen: "#748a3a",
            leafsDark: "#5d7232",
            woodBark: "#6a4630",
            grass: "#b49d4f",
            dirt: "#9a6a44",
            stone: "#a99179",
            rock: "#a58a70",
        },
        asphalt: "#383430",
        shoulder: "#b88757",
        lineColor: "#efe6d2",
        rayColor: "#ffd28a",
        rayOpacity: 0.18,
    },
    fjord: {
        id: "fjord",
        idx: "02",
        label: "FJORD SHIMMER",
        sub: "Nordic Slate",
        fog: "#9ab8cb",
        skyZen: [0.16, 0.28, 0.42],
        skyMid: [0.54, 0.68, 0.78],
        skyHor: [0.82, 0.90, 0.95],
        sunColor: [0.95, 0.97, 1.0],
        sunHex: "#e6f2ff",
        sunIntensity: 2.9,
        hemiSky: "#d8ecff",
        hemiGround: "#2c3b47",
        waterDeep: [0.02, 0.09, 0.15],
        waterShallow: [0.06, 0.24, 0.32],
        waterGlint: [0.92, 0.97, 1.0],
        recolour: {
            leafsGreen: "#355846",
            leafsDark: "#243f32",
            woodBark: "#3e322b",
            grass: "#586e54",
            dirt: "#4a443f",
            stone: "#56616b",
            rock: "#49545e",
        },
        asphalt: "#262b30",
        shoulder: "#525b63",
        lineColor: "#dce6f0",
        rayColor: "#e0f2fe",
        rayOpacity: 0.22,
    },
    sakura: {
        id: "sakura",
        idx: "03",
        label: "KYOTO TOUGE",
        sub: "Midnight Pass",
        fog: "#160b24",
        skyZen: [0.03, 0.02, 0.08],
        skyMid: [0.14, 0.05, 0.20],
        skyHor: [0.36, 0.12, 0.28],
        sunColor: [1.0, 0.42, 0.65],
        sunHex: "#ff85ad",
        sunIntensity: 2.2,
        hemiSky: "#ff9eb5",
        hemiGround: "#180b26",
        waterDeep: [0.03, 0.02, 0.08],
        waterShallow: [0.14, 0.05, 0.22],
        waterGlint: [1.0, 0.58, 0.76],
        recolour: {
            leafsGreen: "#ffb7c5",
            leafsDark: "#ff7597",
            woodBark: "#2d1a24",
            grass: "#381c36",
            dirt: "#26152b",
            stone: "#3b2d4a",
            rock: "#2c2138",
        },
        asphalt: "#16131f",
        shoulder: "#2a1b30",
        lineColor: "#ff9eb5",
        rayColor: "#ff7597",
        rayOpacity: 0.16,
    },
};

const SUN = new THREE.Vector3(-0.35, 0.14, -1).normalize();

// ---- sky: dynamic preset-aware dome shader ----
function Sky({ preset }) {
    const ref = useRef();
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const material = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
            sun: { value: SUN },
            uZen: { value: new THREE.Vector3(...p.skyZen) },
            uMid: { value: new THREE.Vector3(...p.skyMid) },
            uHor: { value: new THREE.Vector3(...p.skyHor) },
            uSunCol: { value: new THREE.Vector3(...p.sunColor) },
        },
        vertexShader: `
            varying vec3 v;
            void main() {
                v = normalize(position);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 v;
            uniform vec3 sun;
            uniform vec3 uZen;
            uniform vec3 uMid;
            uniform vec3 uHor;
            uniform vec3 uSunCol;
            void main() {
                float h = clamp(v.y, -0.2, 1.0);
                vec3 c = mix(uHor, uMid, smoothstep(0.0, 0.18, h));
                c = mix(c, uZen, smoothstep(0.16, 0.85, h));
                float s = max(dot(normalize(v), sun), 0.0);
                c += uSunCol * pow(s, 20.0) * 0.62 + vec3(1.0, 0.96, 0.92) * smoothstep(0.9965, 0.9992, s);
                gl_FragColor = vec4(c, 1.0);
            }
        `,
    }), []);

    useEffect(() => {
        material.uniforms.uZen.value.set(...p.skyZen);
        material.uniforms.uMid.value.set(...p.skyMid);
        material.uniforms.uHor.value.set(...p.skyHor);
        material.uniforms.uSunCol.value.set(...p.sunColor);
    }, [p, material]);

    useFrame(({ camera }) => {
        if (ref.current) ref.current.position.copy(camera.position);
    });
    return <mesh ref={ref} material={material} renderOrder={-1}><sphereGeometry args={[850, 32, 16]} /></mesh>;
}

// ---- Chetan Ankola Reel-level Gerstner Ocean Water Shader with Solar Glitter ----
function CoastalOcean({ preset }) {
    const meshRef = useRef();
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;

    const mat = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uSunDir: { value: SUN },
            uDeep: { value: new THREE.Vector3(...p.waterDeep) },
            uShallow: { value: new THREE.Vector3(...p.waterShallow) },
            uGlint: { value: new THREE.Vector3(...p.waterGlint) },
        },
        vertexShader: `
            uniform float uTime;
            varying vec3 vWorldPos;
            varying vec3 vNormal;
            void main() {
                vec3 pos = position;
                vec4 wp = modelMatrix * vec4(pos, 1.0);
                // Multi-wave Gerstner-inspired displacement
                float w1 = sin(wp.x * 0.08 + wp.z * 0.05 + uTime * 1.6) * 0.55;
                float w2 = cos(wp.x * 0.15 - wp.z * 0.11 + uTime * 2.3) * 0.28;
                float w3 = sin(wp.x * 0.34 + wp.z * 0.29 - uTime * 3.1) * 0.12;
                pos.z += w1 + w2 + w3;

                float dx = 0.08 * cos(wp.x * 0.08 + wp.z * 0.05 + uTime * 1.6) * 0.55
                         - 0.15 * sin(wp.x * 0.15 - wp.z * 0.11 + uTime * 2.3) * 0.28;
                float dz = 0.05 * cos(wp.x * 0.08 + wp.z * 0.05 + uTime * 1.6) * 0.55
                         + 0.11 * sin(wp.x * 0.15 - wp.z * 0.11 + uTime * 2.3) * 0.28;
                vNormal = normalize(vec3(-dx * 2.4, 1.0, -dz * 2.4));
                vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
                vWorldPos = worldPosition.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uSunDir;
            uniform vec3 uDeep;
            uniform vec3 uShallow;
            uniform vec3 uGlint;
            varying vec3 vWorldPos;
            varying vec3 vNormal;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            void main() {
                vec3 V = normalize(cameraPosition - vWorldPos);
                // High-frequency micro-ripple normal perturbation for sparkling sun glitter
                vec2 uv = vWorldPos.xz * 0.35;
                float micro = sin(uv.x * 6.0 + uTime * 4.2) * cos(uv.y * 5.5 - uTime * 3.7);
                vec3 N = normalize(vNormal + vec3(micro * 0.14, 0.0, micro * 0.14));

                float fresnel = pow(1.0 - max(dot(V, N), 0.0), 4.0);
                vec3 baseCol = mix(uDeep, uShallow, clamp(fresnel * 1.15, 0.0, 1.0));

                // Specular solar path + sparkling micro-facet glints
                vec3 H = normalize(uSunDir + V);
                float spec = pow(max(dot(N, H), 0.0), 96.0);
                float sparkleCell = hash(floor(vWorldPos.xz * 1.8 + uTime * 0.8));
                float sparkle = pow(max(dot(N, H), 0.0), 28.0) * step(0.84, sparkleCell) * 2.8;

                vec3 col = baseCol + uGlint * (spec * 2.4 + sparkle);
                gl_FragColor = vec4(col, 1.0);
            }
        `,
    }), []);

    useEffect(() => {
        mat.uniforms.uDeep.value.set(...p.waterDeep);
        mat.uniforms.uShallow.value.set(...p.waterShallow);
        mat.uniforms.uGlint.value.set(...p.waterGlint);
    }, [p, mat]);

    useFrame(({ clock, camera }) => {
        mat.uniforms.uTime.value = clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.z = camera.position.z - 220;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[260, -0.65, 0]} material={mat}>
            <planeGeometry args={[480, 950, 96, 96]} />
        </mesh>
    );
}

// ---- Towering Wet Fjord Cliffs + Volumetric Canyon God-Rays ----
function FjordCliffs({ preset }) {
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const cliffMat = useMemo(() => {
        const loader = new THREE.TextureLoader();
        const diff = loader.load("/textures/coast_land_rocks_01_diff_1k.jpg");
        const nor = loader.load("/textures/coast_land_rocks_01_nor_gl_1k.jpg");
        const rough = loader.load("/textures/coast_land_rocks_01_rough_1k.jpg");
        [diff, nor, rough].forEach((t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(3, 2);
        });
        diff.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshStandardMaterial({
            map: diff,
            normalMap: nor,
            roughnessMap: rough,
            roughness: 0.58,
            metalness: 0.12,
        });
    }, []);

    useEffect(() => {
        if (preset === "sakura") cliffMat.color.set("#4a3559");
        else if (preset === "fjord") cliffMat.color.set("#7d93a6");
        else cliffMat.color.set("#d8a47f");
    }, [preset, cliffMat]);

    const cliffs = useMemo(() => {
        const arr = [];
        for (let d = 20; d < LENGTH + 120; d += 55) {
            const posL = at(d, -ROAD_W / 2 - 28 - ((d * 17) % 18));
            const posR = at(d + 25, ROAD_W / 2 + 65 + ((d * 23) % 45));
            arr.push({
                x: posL.x,
                z: posL.z,
                sx: 22 + ((d * 13) % 16),
                sy: 26 + ((d * 29) % 34),
                sz: 24 + ((d * 19) % 18),
                rot: (d * 0.17) % Math.PI,
            });
            // Sea stack / fjord island on the ocean side
            if (d % 110 === 0) {
                arr.push({
                    x: posR.x,
                    z: posR.z,
                    sx: 28 + ((d * 11) % 24),
                    sy: 32 + ((d * 31) % 38),
                    sz: 28 + ((d * 17) % 22),
                    rot: (d * 0.31) % Math.PI,
                });
            }
        }
        return arr;
    }, []);

    const rayGeo = useMemo(() => new THREE.PlaneGeometry(24, 58), []);
    const rayMat = useMemo(() => new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
            uColor: { value: new THREE.Color(p.rayColor) },
            uOpacity: { value: p.rayOpacity },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            uniform float uOpacity;
            varying vec2 vUv;
            void main() {
                float beam = sin(vUv.x * 3.14159265);
                beam = pow(max(0.0, beam), 1.8);
                float fadeY = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.15, vUv.y);
                gl_FragColor = vec4(uColor, beam * fadeY * uOpacity);
            }
        `,
    }), []);

    useEffect(() => {
        rayMat.uniforms.uColor.value.set(p.rayColor);
        rayMat.uniforms.uOpacity.value = p.rayOpacity;
    }, [p, rayMat]);

    const cliffGeo = useMemo(() => {
        const g = new THREE.IcosahedronGeometry(1, 4);
        const pos = g.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
            const n = Math.sin(x * 3.7 + z * 2.9) * 0.16
                    + Math.cos(y * 4.3 - x * 2.4) * 0.12
                    + Math.sin(z * 6.1 + y * 5.2) * 0.06;
            const flatBottom = y < -0.35 ? 0.65 : 1.0;
            pos.setXYZ(i, x * (1 + n), y * (1 + n * 0.7) * flatBottom, z * (1 + n));
        }
        g.computeVertexNormals();
        return g;
    }, []);

    return (
        <group>
            {cliffs.map((c, i) => (
                <mesh
                    key={i}
                    geometry={cliffGeo}
                    position={[c.x, c.sy * 0.36, c.z]}
                    scale={[c.sx, c.sy, c.sz]}
                    rotation={[0, c.rot, 0]}
                    material={cliffMat}
                    castShadow
                    receiveShadow
                />
            ))}
            {/* Volumetric god-rays cutting between the fjord cliffs */}
            {cliffs.filter((_, i) => i % 3 === 0).map((c, i) => (
                <mesh
                    key={`ray-${i}`}
                    geometry={rayGeo}
                    material={rayMat}
                    position={[c.x + 16, 18, c.z + 12]}
                    rotation={[0.18, -0.45, -0.38]}
                />
            ))}
        </group>
    );
}

// ---- Real BlenderKit PBR Torii Gates, Blooming Sakura Trees & Swirling 3D Sakura Petals (Kyoto Touge Mode) ----
function SakuraHighwayAtmosphere({ active, state }) {
    const petalsRef = useRef();
    const { scene: toriiScene } = useGLTF("/models/bk/bk-torii-gate.glb");
    const { scene: sakuraScene } = useGLTF("/models/bk/bk-sakura-blooming.glb");
    const { scene: lanternScene } = useGLTF("/models/bk/bk-silk-lantern.glb");

    const count = 420;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({
        ox: (Math.sin(i * 12.7) * 0.5) * 36,
        oy: 0.5 + ((i * 19.3) % 11),
        oz: ((i * 31.1) % 90) - 45,
        speed: 0.7 + (i % 7) * 0.18,
        phase: i * 0.43,
        scale: 0.08 + (i % 4) * 0.03,
    })), []);

    const petalGeo = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, -0.6);
        s.quadraticCurveTo(0.55, -0.2, 0.42, 0.45);
        s.lineTo(0.12, 0.62);
        s.lineTo(0, 0.36);
        s.lineTo(-0.12, 0.62);
        s.lineTo(-0.42, 0.45);
        s.quadraticCurveTo(-0.55, -0.2, 0, -0.6);
        return new THREE.ShapeGeometry(s, 4);
    }, []);

    const toriiStops = useMemo(() => {
        const list = [];
        for (let d = 160; d < END - 60; d += 340) {
            list.push(frame(d));
        }
        return list;
    }, []);

    useFrame(({ clock }) => {
        if (!active || !petalsRef.current) return;
        const t = clock.getElapsedTime();
        const bikeD = state.current.d;
        const f = frame(bikeD);

        for (let i = 0; i < count; i++) {
            const p = seeds[i];
            const zOff = ((p.oz - t * p.speed * 6.0) % 90 + 90) % 90 - 30;
            const y = ((p.oy - t * p.speed * 0.85) % 11 + 11) % 11;
            const x = f.x + f.tx * zOff + f.rx * (p.ox + Math.sin(t * 1.8 + p.phase) * 2.2);
            const z = f.z + f.tz * zOff + f.rz * (p.ox + Math.cos(t * 1.5 + p.phase) * 2.2);

            dummy.position.set(x, y, z);
            dummy.rotation.set(t * 2.4 + p.phase, t * 1.9 + p.phase, t * 1.5);
            dummy.scale.setScalar(p.scale);
            dummy.updateMatrix();
            petalsRef.current.setMatrixAt(i, dummy.matrix);
        }
        petalsRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!active) return null;

    return (
        <group>
            <instancedMesh ref={petalsRef} args={[petalGeo, null, count]} frustumCulled={false}>
                <meshBasicMaterial color="#ffb7c5" side={THREE.DoubleSide} transparent opacity={0.92} />
            </instancedMesh>
            {/* Roadside Real BlenderKit PBR Torii Gates, Blooming Sakura Trees & Silk Lanterns */}
            {toriiStops.map((g, idx) => (
                <group key={idx} position={[g.x, 0, g.z]} rotation={[0, g.heading + Math.PI, 0]}>
                    <primitive object={toriiScene.clone(true)} position={[0, 0, 0]} scale={[14.5, 13.5, 14.5]} />
                    <primitive object={sakuraScene.clone(true)} position={[-9.2, 0, -2.5]} rotation={[0, 0.5, 0]} scale={7.2} />
                    <primitive object={sakuraScene.clone(true)} position={[9.2, 0, 2.5]} rotation={[0, -0.5, 0]} scale={7.2} />
                    {[-4.4, 4.4].map((lx) => (
                        <group key={`l-${lx}`} position={[lx, 6.1, 0]}>
                            <primitive object={lanternScene.clone(true)} scale={1.15} />
                            <pointLight position={[0, 0.3, 0]} color="#ff6b4a" intensity={3.5} distance={10} />
                        </group>
                    ))}
                </group>
            ))}
        </group>
    );
}

// ---- the road: shoulders, asphalt, edge lines as ribbons; centre dashes instanced ----
function ribbon(w, y, from = -80, to = LENGTH + 200, step = 3) {
    const pos = [], idx = [], f = {};
    let i = 0;
    for (let d = from; d <= to; d += step, i++) {
        frame(d, f);
        pos.push(f.x - f.rx * w / 2, y, f.z - f.rz * w / 2, f.x + f.rx * w / 2, y, f.z + f.rz * w / 2);
        if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return g;
}
function offsetRibbon(off, w, y) {
    const pos = [], idx = [], f = {};
    let i = 0;
    for (let d = -80; d <= LENGTH + 200; d += 3, i++) {
        frame(d, f);
        const cx = f.x + f.rx * off, cz = f.z + f.rz * off;
        pos.push(cx - f.rx * w / 2, y, cz - f.rz * w / 2, cx + f.rx * w / 2, y, cz + f.rz * w / 2);
        if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return g;
}
function Road({ preset }) {
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const [shoulder, asphalt, lineL, lineR] = useMemo(() => [
        ribbon(ROAD_W + 4.5, 0.01),
        ribbon(ROAD_W, 0.03),
        offsetRibbon(-ROAD_W / 2 + 0.35, 0.16, 0.04),
        offsetRibbon(ROAD_W / 2 - 0.35, 0.16, 0.04),
    ], []);
    const dashes = useRef();
    const n = Math.floor((LENGTH + 280) / 9);
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), f = {};
        for (let i = 0; i < n; i++) {
            frame(-80 + i * 9, f);
            q.setFromEuler(new THREE.Euler(0, f.heading, 0));
            m.compose(new THREE.Vector3(f.x, 0.045, f.z), q, new THREE.Vector3(0.16, 0.01, 3.2));
            dashes.current.setMatrixAt(i, m);
        }
        dashes.current.instanceMatrix.needsUpdate = true;
    }, [n]);
    return (
        <group>
            <mesh geometry={shoulder} receiveShadow><meshStandardMaterial color={p.shoulder} roughness={0.95} /></mesh>
            <mesh geometry={asphalt} receiveShadow><meshStandardMaterial color={p.asphalt} roughness={0.76} metalness={0.08} /></mesh>
            <mesh geometry={lineL}><meshBasicMaterial color={p.lineColor} /></mesh>
            <mesh geometry={lineR}><meshBasicMaterial color={p.lineColor} /></mesh>
            <instancedMesh ref={dashes} args={[null, null, n]} frustumCulled={false}><boxGeometry /><meshBasicMaterial color={p.lineColor} /></instancedMesh>
        </group>
    );
}

// ---- scenery: every Kenney model drawn as instanced meshes, recoloured dynamically per preset ----
function Model({ name, items, preset }) {
    const { scene } = useGLTF(`/ride/${name}.glb`);
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const parts = useMemo(() => {
        scene.updateMatrixWorld(true);
        const out = [];
        scene.traverse((o) => {
            if (!o.isMesh) return;
            const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
            const name2 = o.material.name || "";
            const key = Object.keys(p.recolour).find((k) => name2.toLowerCase().includes(k.toLowerCase().replace(/s$/, "")));
            const col = p.recolour[key] || o.material.color;
            const isSakuraLeaf = preset === "sakura" && (key === "leafsGreen" || key === "leafsDark");
            out.push({
                g,
                m: new THREE.MeshStandardMaterial({
                    color: col,
                    emissive: isSakuraLeaf ? "#ff5c8a" : "#000000",
                    emissiveIntensity: isSakuraLeaf ? 0.25 : 0,
                    roughness: 0.9,
                    flatShading: true,
                }),
            });
        });
        return out;
    }, [scene, preset, p]);
    const refs = useRef([]);
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
        refs.current.forEach((im) => {
            if (!im) return;
            items.forEach((it, i) => {
                e.set(0, it.rot, 0); q.setFromEuler(e);
                m.compose(new THREE.Vector3(it.x, 0, it.z), q, new THREE.Vector3(it.s, it.s * (0.9 + (i % 5) * 0.05), it.s));
                im.setMatrixAt(i, m);
            });
            im.instanceMatrix.needsUpdate = true;
            im.computeBoundingSphere();
        });
    }, [items, parts]);
    return parts.map((pt, k) => <instancedMesh key={k} ref={(el) => { refs.current[k] = el; }} args={[pt.g, pt.m, items.length]} castShadow receiveShadow frustumCulled={false} />);
}
function Scenery({ preset }) {
    const s = useMemo(() => scenery(), []);
    return Object.keys(MODELS).map((k) => <Model key={k} name={k} items={s[k]} preset={preset} />);
}

// ---- far hills ----
function Hills({ preset }) {
    const ref = useRef();
    const hills = useMemo(() => Array.from({ length: 46 }, (_, i) => {
        const a = (i / 46) * Math.PI * 2 + Math.sin(i * 7.3) * 0.05, r = 430 + ((i * 53) % 90);
        return { x: Math.sin(a) * r, z: Math.cos(a) * r, s: 40 + ((i * 37) % 70), h: 18 + ((i * 29) % 34), rot: i };
    }), []);
    useFrame(({ camera }) => { ref.current.position.x = camera.position.x; ref.current.position.z = camera.position.z; });
    const c1 = preset === "sakura" ? "#261538" : preset === "fjord" ? "#3b4f5e" : "#a07a5c";
    const c2 = preset === "sakura" ? "#1b0e29" : preset === "fjord" ? "#2d3e4c" : "#8d6c55";
    return (
        <group ref={ref}>
            {hills.map((h, i) => (
                <mesh key={i} position={[h.x, -2, h.z]} scale={[h.s, h.h, h.s * 0.8]} rotation={[0, h.rot, 0]}>
                    <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 3 ? c1 : c2} flatShading roughness={1} />
                </mesh>
            ))}
        </group>
    );
}

// ---- a project's billboard: two poles, a frame, the real screenshot (loaded only when the bike is near) ----
function Billboard({ stop, near, preset }) {
    const p = useMemo(() => at(stop.d, -ROAD_W / 2 - 6.5), [stop.d]);
    const [tex, setTex] = useState(null);
    useEffect(() => {
        if (!near || tex) return;
        new THREE.TextureLoader().setCrossOrigin("anonymous").load(shot(stop.w, 640), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; setTex(t); });
    }, [near, tex, stop.w]);
    useEffect(() => () => tex?.dispose(), [tex]);
    const isSakura = preset === "sakura";
    return (
        <group position={[p.x, 0, p.z]} rotation={[0, p.heading + Math.PI + 0.55, 0]}>
            {[-2.9, 2.9].map((x) => <mesh key={x} position={[x, 2.6, -0.1]} castShadow><boxGeometry args={[0.22, 5.2, 0.22]} /><meshStandardMaterial color={isSakura ? "#d91b26" : "#3b3530"} /></mesh>)}
            <mesh position={[0, 5.4, -0.08]} castShadow><boxGeometry args={[6.6, 4.3, 0.18]} /><meshStandardMaterial color={isSakura ? "#1a0e26" : "#2c2723"} roughness={0.8} /></mesh>
            <mesh position={[0, 5.4, 0.02]}>
                <planeGeometry args={[6.2, 3.875]} />
                {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshStandardMaterial color="#d9c6a6" />}
            </mesh>
            <mesh position={[0, 2.85, 0.05]}><boxGeometry args={[6.6, 0.9, 0.12]} /><meshStandardMaterial color={isSakura ? "#241130" : "#f3ead8"} /></mesh>
            <Text font={FONT} position={[0, 2.86, 0.13]} fontSize={0.42} maxWidth={6.2} color={isSakura ? "#ffb7c5" : "#231f1b"} anchorX="center" anchorY="middle">{stop.title}</Text>
        </group>
    );
}

// ---- green highway signboard 45 m before each stop ----
function Sign({ stop, preset }) {
    const p = useMemo(() => at(stop.d - 45, -ROAD_W / 2 - 2.2), [stop.d]);
    const boardCol = preset === "sakura" ? "#261033" : "#13704a";
    const textCol = preset === "sakura" ? "#ffb7c5" : "#f4f4ee";
    return (
        <group position={[p.x, 0, p.z]} rotation={[0, p.heading + Math.PI, 0]}>
            <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.07, 0.07, 3.2, 6]} /><meshStandardMaterial color="#8f9aa0" /></mesh>
            <mesh position={[0, 3.35, 0]} castShadow><boxGeometry args={[3.4, 1.5, 0.08]} /><meshStandardMaterial color={boardCol} roughness={0.6} /></mesh>
            <mesh position={[0, 3.35, 0.045]}><planeGeometry args={[3.2, 1.3]} /><meshBasicMaterial color={boardCol} /></mesh>
            <Text font={FONT} position={[0, 3.62, 0.06]} fontSize={0.3} maxWidth={3.1} color={textCol} anchorX="center" anchorY="middle">{stop.title}</Text>
            <Text font={FONT} position={[0, 3.08, 0.06]} fontSize={0.2} color={textCol} anchorX="center" anchorY="middle">{`${stop.kind}  ·  45 m  ↑`}</Text>
        </group>
    );
}

// ---- kilometre stones: white block, yellow cap, "AMD" and the distance ----
function Milestones() {
    const stones = useMemo(() => Array.from({ length: Math.floor(LENGTH / 200) }, (_, i) => ({ d: 100 + i * 200, p: at(100 + i * 200, -ROAD_W / 2 - 1.1) })), []);
    return stones.map((s) => (
        <group key={s.d} position={[s.p.x, 0, s.p.z]} rotation={[0, s.p.heading + Math.PI + 0.4, 0]}>
            <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.46, 0.7, 0.18]} /><meshStandardMaterial color="#f1ece2" /></mesh>
            <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.23, 0.23, 0.18, 12, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#f2b81c" /></mesh>
            <Text font={FONT} position={[0, 0.52, 0.1]} fontSize={0.1} color="#222" anchorX="center">AMD</Text>
            <Text font={FONT} position={[0, 0.34, 0.1]} fontSize={0.14} color="#222" anchorX="center">{(s.d / 1000).toFixed(1)}</Text>
        </group>
    ));
}

// ---- the city gateway at the start, and the exit sign at the end ----
function Landmarks({ preset }) {
    const g = useMemo(() => frame(28), []), e = useMemo(() => at(END, -ROAD_W / 2 - 3), []);
    const isSakura = preset === "sakura";
    return (
        <>
            <group position={[g.x, 0, g.z]} rotation={[0, g.heading + Math.PI, 0]}>
                {[-5.4, 5.4].map((x) => <mesh key={x} position={[x, 3.6, 0]} castShadow><boxGeometry args={[1.3, 7.2, 1.3]} /><meshStandardMaterial color={isSakura ? "#d91b26" : "#c58b5b"} flatShading /></mesh>)}
                <mesh position={[0, 7.6, 0]} castShadow><boxGeometry args={[12.4, 1.4, 1.4]} /><meshStandardMaterial color={isSakura ? "#221229" : "#b27a4d"} flatShading /></mesh>
                {[-5.4, 5.4].map((x) => <mesh key={`d${x}`} position={[x, 8.9, 0]}><sphereGeometry args={[0.9, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={isSakura ? "#ff7597" : "#d7a06e"} flatShading /></mesh>)}
                <Text font={FONT} position={[0, 7.6, -0.72]} rotation={[0, Math.PI, 0]} fontSize={0.62} color={isSakura ? "#ffb7c5" : "#3b2414"} anchorX="center" anchorY="middle">{isSakura ? "NEO-KYOTO · SAKURA TOUGE" : "AHMEDABAD · RIDE"}</Text>
                <Text font={FONT} position={[0, 7.6, 0.72]} fontSize={0.62} color={isSakura ? "#ffb7c5" : "#3b2414"} anchorX="center" anchorY="middle">{isSakura ? "NEO-KYOTO · SAKURA TOUGE" : "AHMEDABAD · RIDE"}</Text>
            </group>
            <group position={[e.x, 0, e.z]} rotation={[0, e.heading + Math.PI + 0.3, 0]}>
                {[-2.6, 2.6].map((x) => <mesh key={x} position={[x, 2.3, 0]}><cylinderGeometry args={[0.1, 0.1, 4.6, 6]} /><meshStandardMaterial color="#8f9aa0" /></mesh>)}
                <mesh position={[0, 4.6, 0]} castShadow><boxGeometry args={[6, 2.6, 0.1]} /><meshStandardMaterial color="#13704a" /></mesh>
                <Text font={FONT} position={[0, 5.2, 0.07]} fontSize={0.5} color="#f4f4ee" anchorX="center">YOUR TEAM</Text>
                <Text font={FONT} position={[0, 4.4, 0.07]} fontSize={0.3} color="#f4f4ee" anchorX="center">NEXT EXIT ↗  ·  AHMEDABAD</Text>
            </group>
        </>
    );
}

// ---- the bike and rider; leans into the bends; glowing JDM tail-light streak in Sakura/Night mode ----
function Rider({ state, preset }) {
    const { scene } = useGLTF("/ride/motorcycle.glb");
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const bike = useMemo(() => {
        const s = scene.clone(true);
        s.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.material = o.material.clone(); o.material.roughness = 0.42; o.material.metalness = 0.25; } });
        return s;
    }, [scene]);
    const root = useRef(), body = useRef(), light = useRef(), tailTrail = useRef();
    const f = useMemo(() => ({}), []), ahead = useMemo(() => ({}), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ camera }, dt) => {
        const s = state.current, d = s.d;
        frame(d, f); frame(d + 6, ahead);
        const x = f.x + f.rx * LANE_X, z = f.z + f.rz * LANE_X;
        root.current.position.set(x, 0, z);
        root.current.rotation.y = f.heading + Math.PI;
        let dh = ahead.heading - f.heading; if (dh > Math.PI) dh -= Math.PI * 2; if (dh < -Math.PI) dh += Math.PI * 2;
        const lean = THREE.MathUtils.clamp(-dh * s.v * 0.9, -0.38, 0.38);
        body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, lean, 6, dt);
        body.current.position.y = Math.sin(d * 1.7) * 0.012 * Math.min(1, s.v / 6);
        // Stretch glowing Akira/JDM tail-light trail with speed
        if (tailTrail.current) {
            const stretch = THREE.MathUtils.clamp(s.v * 0.14, 0.2, 4.8);
            tailTrail.current.scale.set(1, 1, stretch);
            tailTrail.current.position.z = 0.95 + stretch * 0.42;
        }
        const back = 7.2 + s.v * 0.12, up = 2.6 + s.v * 0.03;
        const cx = x - f.tx * back + f.rx * 0.6, cz = z - f.tz * back + f.rz * 0.6;
        const k = 1 - Math.exp(-dt * (s.snap ? 30 : 4));
        // eslint-disable-next-line react-hooks/immutability
        camera.position.x += (cx - camera.position.x) * k; camera.position.z += (cz - camera.position.z) * k; camera.position.y += (up - camera.position.y) * k;
        look.set(x + f.tx * 9, 1.1, z + f.tz * 9);
        camera.lookAt(look);
        s.snap = false;
        if (light.current) { light.current.position.set(x - SUN.x * 60, 40, z - SUN.z * 60); light.current.target.position.set(x, 0, z); light.current.target.updateMatrixWorld(); }
    });
    return (
        <>
            <directionalLight ref={light} intensity={p.sunIntensity} color={p.sunHex} castShadow shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-camera-far={140} shadow-bias={-0.0005} />
            <group ref={root}>
                <group ref={body}>
                    <primitive object={bike} scale={0.0165} />
                    {/* Glowing JDM / Akira LED Tail-Light & Speed Trail */}
                    <mesh position={[0, 0.68, 0.92]}>
                        <boxGeometry args={[0.26, 0.07, 0.06]} />
                        <meshBasicMaterial color="#ff1e42" />
                    </mesh>
                    <mesh ref={tailTrail} position={[0, 0.68, 1.35]}>
                        <boxGeometry args={[0.22, 0.045, 1.0]} />
                        <meshBasicMaterial color="#ff1e42" transparent opacity={preset === "sakura" ? 0.72 : 0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                    {/* Headlight cone */}
                    <pointLight position={[0, 0.85, -1.2]} intensity={preset === "sakura" ? 4.5 : 1.2} distance={18} color="#fff6d6" />
                    {/* the rider */}
                    <group position={[0, 0.98, 0.05]} rotation={[0, Math.PI, 0]}>
                        <mesh position={[0, 0.34, 0.08]} rotation={[0.35, 0, 0]} castShadow><boxGeometry args={[0.42, 0.62, 0.3]} /><meshStandardMaterial color={preset === "sakura" ? "#d91b26" : "#2f4a5a"} flatShading /></mesh>
                        <mesh position={[0, 0.78, 0.2]} castShadow><icosahedronGeometry args={[0.17, 1]} /><meshStandardMaterial color="#e9e2d6" flatShading roughness={0.4} /></mesh>
                        <mesh position={[0, 0.76, 0.33]}><boxGeometry args={[0.2, 0.08, 0.04]} /><meshStandardMaterial color="#1c1c1c" /></mesh>
                        {[-0.24, 0.24].map((sx) => <mesh key={sx} position={[sx, 0.3, 0.32]} rotation={[1.0, 0, sx > 0 ? -0.25 : 0.25]} castShadow><boxGeometry args={[0.11, 0.5, 0.11]} /><meshStandardMaterial color={preset === "sakura" ? "#d91b26" : "#2f4a5a"} flatShading /></mesh>)}
                        {[-0.16, 0.16].map((sx) => <mesh key={`l${sx}`} position={[sx, -0.12, 0.12]} rotation={[-0.9, 0, 0]} castShadow><boxGeometry args={[0.14, 0.52, 0.14]} /><meshStandardMaterial color="#1e1b24" flatShading /></mesh>)}
                    </group>
                </group>
            </group>
        </>
    );
}

export default function Scene({ state, near, preset = "golden" }) {
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const groundCol = preset === "sakura" ? "#140b1f" : preset === "fjord" ? "#3b493f" : "#b29a58";
    return (
        <>
            <fog attach="fog" args={[p.fog, 65, 540]} />
            <hemisphereLight args={[p.hemiSky, p.hemiGround, 1.1]} />
            <Sky preset={preset} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-380, 0, -LENGTH / 2]} receiveShadow>
                <planeGeometry args={[800, LENGTH + 1200]} /><meshStandardMaterial color={groundCol} roughness={1} />
            </mesh>
            <CoastalOcean preset={preset} />
            <FjordCliffs preset={preset} />
            <SakuraHighwayAtmosphere active={preset === "sakura"} state={state} />
            <Road preset={preset} />
            <Scenery preset={preset} />
            <Hills preset={preset} />
            <Landmarks preset={preset} />
            <Milestones />
            {STOPS.map((s) => <Sign key={`s${s.i}`} stop={s} preset={preset} />)}
            {STOPS.map((s) => <Billboard key={s.i} stop={s} near={Math.abs(near - s.d) < 320} preset={preset} />)}
            <Rider state={state} preset={preset} />
        </>
    );
}
