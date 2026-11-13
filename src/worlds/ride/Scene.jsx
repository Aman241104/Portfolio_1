import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { shot } from "../../../content/work.js";
import { STOPS, END, LENGTH, ROAD_W, LANE_X, MODELS, CERT_ORBS, APEX_GATES, frame, at, scenery } from "./route.js";

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
        if (preset === "sakura") cliffMat.color.set("#72548a");
        else if (preset === "fjord") cliffMat.color.set("#8da5ba");
        else cliffMat.color.set("#d8a47f");
    }, [preset, cliffMat]);

    const cliffs = useMemo(() => {
        const arr = [];
        for (let d = 20; d < LENGTH + 120; d += 55) {
            const sxL = 22 + ((d * 13) % 16);
            // Keep inner cliff edge >= 26m left of centreline so cliffs never clip the highway
            const posL = at(d, -ROAD_W / 2 - 48 - sxL * 0.85 - ((d * 17) % 14));
            const posR = at(d + 25, ROAD_W / 2 + 78 + ((d * 23) % 45));
            arr.push({
                x: posL.x,
                z: posL.z,
                sx: sxL,
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
                    <primitive object={sakuraScene.clone(true)} position={[-14.5, 0, -3.5]} rotation={[0, 0.5, 0]} scale={5.4} />
                    <primitive object={sakuraScene.clone(true)} position={[14.5, 0, 3.5]} rotation={[0, -0.5, 0]} scale={5.4} />
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

// ---- the road: shoulders, wet-asphalt PBR ribbon, Armco steel guardrails, cat's-eye studs & touge lamps ----
function ribbon(w, y, from = -80, to = LENGTH + 200, step = 3) {
    const pos = [], uvs = [], idx = [], f = {};
    let i = 0;
    for (let d = from; d <= to; d += step, i++) {
        frame(d, f);
        pos.push(f.x - f.rx * w / 2, y, f.z - f.rz * w / 2, f.x + f.rx * w / 2, y, f.z + f.rz * w / 2);
        uvs.push(0, d * 0.14, 1, d * 0.14);
        if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
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
function wallRibbon(off, y0, y1, from = -80, to = LENGTH + 200, step = 4) {
    const pos = [], idx = [], f = {};
    let i = 0;
    for (let d = from; d <= to; d += step, i++) {
        frame(d, f);
        const cx = f.x + f.rx * off, cz = f.z + f.rz * off;
        pos.push(cx, y0, cz, cx, y1, cz);
        if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return g;
}
function asphaltPbrMaps() {
    const loader = new THREE.TextureLoader();
    const diff = loader.load("/textures/asphalt_02_Diffuse_1k.jpg");
    const nor = loader.load("/textures/asphalt_02_nor_gl_1k.jpg");
    const rough = loader.load("/textures/asphalt_02_Rough_1k.jpg");
    [diff, nor, rough].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(1.5, 1.5);
    });
    diff.colorSpace = THREE.SRGBColorSpace;
    return { diff, nor, rough };
}
function Road({ preset }) {
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const isNight = preset === "sakura";
    const roadMaps = useMemo(() => asphaltPbrMaps(), []);
    const [shoulder, asphalt, lineL, lineR, railL, railR] = useMemo(() => [
        ribbon(ROAD_W + 4.8, 0.01),
        ribbon(ROAD_W, 0.03),
        offsetRibbon(-ROAD_W / 2 + 0.35, 0.16, 0.04),
        offsetRibbon(ROAD_W / 2 - 0.35, 0.16, 0.04),
        wallRibbon(-ROAD_W / 2 - 0.55, 0.42, 0.74),
        wallRibbon(ROAD_W / 2 + 0.55, 0.42, 0.74),
    ], []);
    const dashes = useRef(), studs = useRef(), posts = useRef(), lamps = useRef();
    const n = Math.floor((LENGTH + 280) / 9);
    const nPosts = Math.floor((LENGTH + 280) / 8) * 2;
    const nLamps = Math.floor((LENGTH + 200) / 56);
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), f = {};
        for (let i = 0; i < n; i++) {
            frame(-80 + i * 9, f);
            q.setFromEuler(new THREE.Euler(0, f.heading, 0));
            m.compose(new THREE.Vector3(f.x, 0.045, f.z), q, new THREE.Vector3(0.16, 0.01, 3.2));
            dashes.current.setMatrixAt(i, m);
            m.compose(new THREE.Vector3(f.x, 0.055, f.z), q, new THREE.Vector3(0.12, 0.04, 0.12));
            studs.current.setMatrixAt(i, m);
        }
        dashes.current.instanceMatrix.needsUpdate = true;
        studs.current.instanceMatrix.needsUpdate = true;
        let pi = 0;
        for (let d = -80; d <= LENGTH + 200 && pi + 1 < nPosts; d += 8) {
            frame(d, f);
            q.setFromEuler(new THREE.Euler(0, f.heading, 0));
            for (const side of [-1, 1]) {
                const off = side * (ROAD_W / 2 + 0.62);
                m.compose(new THREE.Vector3(f.x + f.rx * off, 0.38, f.z + f.rz * off), q, new THREE.Vector3(0.08, 0.76, 0.08));
                posts.current.setMatrixAt(pi++, m);
            }
        }
        posts.current.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < nLamps; i++) {
            frame(-40 + i * 56, f);
            q.setFromEuler(new THREE.Euler(0, f.heading, 0));
            const off = ROAD_W / 2 + 1.25;
            m.compose(new THREE.Vector3(f.x + f.rx * off, 0, f.z + f.rz * off), q, new THREE.Vector3(1, 1, 1));
            lamps.current.setMatrixAt(i, m);
        }
        lamps.current.instanceMatrix.needsUpdate = true;
    }, [n, nPosts, nLamps]);
    return (
        <group>
            <mesh geometry={shoulder} receiveShadow><meshStandardMaterial color={p.shoulder} roughness={0.95} /></mesh>
            <mesh geometry={asphalt} receiveShadow>
                <meshStandardMaterial color={isNight ? "#444854" : "#8e8a84"} map={roadMaps.diff} normalMap={roadMaps.nor} roughnessMap={roadMaps.rough} roughness={isNight ? 0.35 : 0.72} metalness={isNight ? 0.28 : 0.08} />
            </mesh>
            <mesh geometry={lineL}><meshBasicMaterial color={p.lineColor} /></mesh>
            <mesh geometry={lineR}><meshBasicMaterial color={p.lineColor} /></mesh>
            <mesh geometry={railL} castShadow receiveShadow><meshStandardMaterial color="#b4bcc2" metalness={0.72} roughness={0.34} side={THREE.DoubleSide} /></mesh>
            <mesh geometry={railR} castShadow receiveShadow><meshStandardMaterial color="#b4bcc2" metalness={0.72} roughness={0.34} side={THREE.DoubleSide} /></mesh>
            <instancedMesh ref={dashes} args={[null, null, n]} frustumCulled={false}><boxGeometry /><meshBasicMaterial color={p.lineColor} /></instancedMesh>
            <instancedMesh ref={studs} args={[null, null, n]} frustumCulled={false}>
                <boxGeometry />
                <meshStandardMaterial color="#ff9d2e" emissive="#ff7b00" emissiveIntensity={isNight ? 1.8 : 0.85} />
            </instancedMesh>
            <instancedMesh ref={posts} args={[null, null, nPosts]} frustumCulled={false}><boxGeometry /><meshStandardMaterial color="#6e767d" metalness={0.6} roughness={0.45} /></instancedMesh>
            <instancedMesh ref={lamps} args={[null, null, nLamps]} frustumCulled={false}>
                <cylinderGeometry args={[0.07, 0.1, 6.2, 8]} />
                <meshStandardMaterial color="#4a4e54" metalness={0.7} roughness={0.35} />
            </instancedMesh>
        </group>
    );
}

function extractParts(gltfScene) {
    gltfScene.updateMatrixWorld(true);
    const out = [];
    gltfScene.traverse((o) => {
        if (!o.isMesh) return;
        const g = o.geometry.clone();
        g.applyMatrix4(o.matrixWorld);
        out.push({ g, m: o.material });
    });
    return out;
}

// ---- realistic PBR scenery: PolyHaven fern_02 + shrub_01 + boulder_01 + BlenderKit sakura (zero toy blocks) ----
function Scenery() {
    const s = useMemo(() => scenery(), []);
    const { scene: fernGltf } = useGLTF("/models/fern_02/fern_02.gltf");
    const { scene: shrubGltf } = useGLTF("/models/shrub_01/shrub_01.gltf");
    const { scene: boulderGltf } = useGLTF("/models/boulder_01/boulder_01.gltf");
    const { scene: sakuraGltf } = useGLTF("/models/bk/bk-sakura-blooming.glb");

    const fernParts = useMemo(() => extractParts(fernGltf), [fernGltf]);
    const shrubParts = useMemo(() => extractParts(shrubGltf), [shrubGltf]);
    const boulderParts = useMemo(() => extractParts(boulderGltf), [boulderGltf]);

    const ferns = useMemo(() => [...(s.grass_large || []), ...(s.plant_bush || [])].slice(0, 220), [s]);
    const shrubs = useMemo(() => [...(s.plant_bushLarge || []), ...(s.plant_bush || [])].filter((_, i) => i % 2 === 0).slice(0, 140), [s]);
    const rocks = useMemo(() => [...(s.rock_largeA || []), ...(s.rock_largeC || []), ...(s.rock_tallB || [])].slice(0, 90), [s]);
    const trees = useMemo(() => [...(s.tree_oak || []), ...(s.tree_default || []), ...(s.tree_palm || [])].filter((_, i) => i % 3 === 0).slice(0, 48), [s]);

    const fernRefs = useRef([]);
    const shrubRefs = useRef([]);
    const boulderRefs = useRef([]);

    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
        const fill = (refs, list, scaleFn, yFn) => {
            refs.current.forEach((im) => {
                if (!im) return;
                list.forEach((it, i) => {
                    e.set(0, it.rot, 0); q.setFromEuler(e);
                    const sc = scaleFn(it, i);
                    m.compose(new THREE.Vector3(it.x, yFn(it, sc), it.z), q, new THREE.Vector3(sc, sc, sc));
                    im.setMatrixAt(i, m);
                });
                im.instanceMatrix.needsUpdate = true;
                im.computeBoundingSphere();
            });
        };
        fill(fernRefs, ferns, (_, i) => 2.5 + (i % 4) * 0.55, () => 0);
        fill(shrubRefs, shrubs, (_, i) => 1.8 + (i % 3) * 0.55, () => 0);
        fill(boulderRefs, rocks, (it) => 0.48 + (it.s || 4) * 0.14, () => -0.15);
    }, [ferns, shrubs, rocks, fernParts, shrubParts, boulderParts]);

    return (
        <group>
            {fernParts.map((pt, k) => (
                <instancedMesh key={`fn-${k}`} ref={(el) => { fernRefs.current[k] = el; }} args={[pt.g, pt.m, ferns.length]} castShadow receiveShadow frustumCulled={false} />
            ))}
            {shrubParts.map((pt, k) => (
                <instancedMesh key={`sh-${k}`} ref={(el) => { shrubRefs.current[k] = el; }} args={[pt.g, pt.m, shrubs.length]} castShadow receiveShadow frustumCulled={false} />
            ))}
            {boulderParts.map((pt, k) => (
                <instancedMesh key={`bd-${k}`} ref={(el) => { boulderRefs.current[k] = el; }} args={[pt.g, pt.m, rocks.length]} castShadow receiveShadow frustumCulled={false} />
            ))}
            {trees.map((t, i) => (
                <primitive key={`bk-t-${i}`} object={sakuraGltf.clone(true)} position={[t.x, 0, t.z]} rotation={[0, t.rot, 0]} scale={t.s * 0.85} />
            ))}
        </group>
    );
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
        <group position={[p.x, 0, p.z]} rotation={[0, p.heading + Math.PI + 0.36, 0]}>
            {[-2.9, 2.9].map((x) => <mesh key={x} position={[x, 2.6, -0.1]} castShadow><boxGeometry args={[0.22, 5.2, 0.22]} /><meshStandardMaterial color={isSakura ? "#d91b26" : "#3b3530"} /></mesh>)}
            <mesh position={[0, 5.4, -0.08]} castShadow><boxGeometry args={[6.6, 4.3, 0.18]} /><meshStandardMaterial color={isSakura ? "#1a0e26" : "#2c2723"} roughness={0.65} metalness={0.35} /></mesh>
            {/* Steel truss cross-brace & overhead billboard lamp */}
            <mesh position={[0, 5.4, -0.22]}><boxGeometry args={[5.8, 0.16, 0.12]} /><meshStandardMaterial color="#58524c" metalness={0.6} roughness={0.4} /></mesh>
            <mesh position={[0, 7.72, 0.28]}><boxGeometry args={[4.4, 0.08, 0.24]} /><meshStandardMaterial color={isSakura ? "#ff7aa2" : "#fff1d0"} emissive={isSakura ? "#ff4d79" : "#ffcf87"} emissiveIntensity={1.2} /></mesh>
            <mesh position={[0, 5.4, 0.02]}>
                <planeGeometry args={[6.2, 3.875]} />
                {tex ? <meshBasicMaterial map={tex} color="#e2ddd4" toneMapped={false} /> : <meshStandardMaterial color="#d9c6a6" />}
            </mesh>
            <mesh position={[0, 2.85, 0.05]}><boxGeometry args={[6.6, 0.9, 0.12]} /><meshStandardMaterial color={isSakura ? "#241130" : "#f3ead8"} /></mesh>
            <Text font={FONT} position={[0, 2.86, 0.13]} fontSize={0.34} maxWidth={6.1} color={isSakura ? "#ffb7c5" : "#231f1b"} anchorX="center" anchorY="middle">{stop.title}</Text>
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
            <Text font={FONT} position={[0, 3.64, 0.06]} fontSize={0.25} maxWidth={3.0} color={textCol} anchorX="center" anchorY="middle">{stop.title}</Text>
            <Text font={FONT} position={[0, 3.04, 0.06]} fontSize={0.18} color={textCol} anchorX="center" anchorY="middle">{`${stop.kind}  ·  45 m  ↑`}</Text>
        </group>
    );
}

// ---- kilometre stones: white block, yellow cap, "AMD" and the distance ----
function Milestones() {
    const stones = useMemo(() => Array.from({ length: Math.floor(LENGTH / 200) }, (_, i) => ({ d: 100 + i * 200, p: at(100 + i * 200, -ROAD_W / 2 - 1.1) })), []);
    return stones.map((s) => (
        <group key={s.d} position={[s.p.x, 0, s.p.z]} rotation={[0, s.p.heading + Math.PI + 0.4, 0]}>
            <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.46, 0.7, 0.18]} /><meshStandardMaterial color="#f1ece2" /></mesh>
            <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}><cylinderGeometry args={[0.23, 0.23, 0.18, 12, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#f2b81c" /></mesh>
            <Text font={FONT} position={[0, 0.52, 0.1]} fontSize={0.1} color="#222" anchorX="center">AMD</Text>
            <Text font={FONT} position={[0, 0.34, 0.1]} fontSize={0.14} color="#222" anchorX="center">{(s.d / 1000).toFixed(1)}</Text>
        </group>
    ));
}

// ---- sleek architectural coastal highway gantry at the start, and the exit sign at the end ----
function Landmarks({ preset }) {
    const g = useMemo(() => frame(28), []), e = useMemo(() => at(END, -ROAD_W / 2 - 3), []);
    const isSakura = preset === "sakura";
    const steel = isSakura ? "#d91b26" : "#c58b5b";
    return (
        <>
            <group position={[g.x, 0, g.z]} rotation={[0, g.heading + Math.PI, 0]}>
                {[-5.6, 5.6].map((x) => (
                    <group key={x} position={[x, 0, 0]}>
                        <mesh position={[0, 3.8, -0.35]} rotation={[0.1, 0, 0]} castShadow><cylinderGeometry args={[0.24, 0.34, 7.8, 10]} /><meshStandardMaterial color={steel} metalness={0.55} roughness={0.38} /></mesh>
                        <mesh position={[0, 3.8, 0.35]} rotation={[-0.1, 0, 0]} castShadow><cylinderGeometry args={[0.24, 0.34, 7.8, 10]} /><meshStandardMaterial color={steel} metalness={0.55} roughness={0.38} /></mesh>
                        <mesh position={[0, 0.25, 0]}><boxGeometry args={[1.1, 0.5, 1.3]} /><meshStandardMaterial color="#3c3733" roughness={0.9} /></mesh>
                    </group>
                ))}
                <mesh position={[0, 7.45, 0]} castShadow><boxGeometry args={[12.8, 1.15, 0.55]} /><meshStandardMaterial color={isSakura ? "#1e0d2b" : "#1d1a18"} metalness={0.5} roughness={0.35} /></mesh>
                <mesh position={[0, 8.08, 0]}><boxGeometry args={[12.9, 0.1, 0.62]} /><meshStandardMaterial color={isSakura ? "#ff7aa2" : "#ffb35c"} emissive={isSakura ? "#ff4d79" : "#ff9b3d"} emissiveIntensity={1.15} /></mesh>
                <Text font={FONT} position={[0, 7.45, -0.3]} rotation={[0, Math.PI, 0]} fontSize={0.56} letterSpacing={0.08} color={isSakura ? "#ffd0de" : "#fff4e2"} anchorX="center" anchorY="middle">{isSakura ? "NEO-KYOTO · SAKURA TOUGE" : "AHMEDABAD · NH-PX01"}</Text>
                <Text font={FONT} position={[0, 7.45, 0.3]} fontSize={0.56} letterSpacing={0.08} color={isSakura ? "#ffd0de" : "#fff4e2"} anchorX="center" anchorY="middle">{isSakura ? "NEO-KYOTO · SAKURA TOUGE" : "AHMEDABAD · NH-PX01"}</Text>
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

// ---- the autonomous sportbike (motorcycle.glb) + Akira/JDM LED tail-light trail ----
function Rider({ state, preset }) {
    const { scene } = useGLTF("/ride/motorcycle.glb");
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const bike = useMemo(() => {
        const s = scene.clone(true);
        s.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.material = o.material.clone(); o.material.roughness = 0.36; o.material.metalness = 0.32; } });
        return s;
    }, [scene]);
    const root = useRef(), body = useRef(), light = useRef(), tailTrail = useRef();
    const f = useMemo(() => ({}), []), ahead = useMemo(() => ({}), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ camera }, dt) => {
        const s = state.current, d = s.d, lane = s.lane ?? LANE_X;
        frame(d, f); frame(d + 6, ahead);
        const x = f.x + f.rx * lane, z = f.z + f.rz * lane;
        root.current.position.set(x, 0, z);
        root.current.rotation.y = f.heading + Math.PI - (s.steer || 0) * 0.08;
        let dh = ahead.heading - f.heading; if (dh > Math.PI) dh -= Math.PI * 2; if (dh < -Math.PI) dh += Math.PI * 2;
        const lean = THREE.MathUtils.clamp(-dh * s.v * 0.9 - (s.steer || 0) * 0.28, -0.46, 0.46);
        body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, lean, 6, dt);
        s.leanDeg = Math.round((body.current.rotation.z * 180) / Math.PI);
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
        const targetFov = 52 + THREE.MathUtils.clamp(s.v / 42, 0, 1) * 9;
        if (Math.abs(camera.fov - targetFov) > 0.05) {
            // eslint-disable-next-line react-hooks/immutability
            camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4, dt);
            camera.updateProjectionMatrix();
        }
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
                </group>
            </group>
        </>
    );
}

function groundPbrMaps() {
    const loader = new THREE.TextureLoader();
    const diff = loader.load("/textures/aerial_grass_rock_diff_1k.jpg");
    const nor = loader.load("/textures/aerial_grass_rock_nor_1k.jpg");
    const rough = loader.load("/textures/aerial_grass_rock_rough_1k.jpg");
    [diff, nor, rough].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(95, 280);
    });
    diff.colorSpace = THREE.SRGBColorSpace;
    return { diff, nor, rough };
}

// ---- Initial D Touge Objectives: 4 AI Certification Orbs + 8 Apex Clipping Gates ----
function Objectives({ collected = [], clearedGates = [] }) {
    const orbs = useMemo(() => CERT_ORBS.map((o) => ({ ...o, p: at(o.d, o.lane) })), []);
    const gates = useMemo(() => APEX_GATES.map((g) => ({ ...g, p: at(g.d, g.lane) })), []);
    const spinRef = useRef([]);
    useFrame((state, dt) => {
        const t = state.clock.elapsedTime;
        spinRef.current.forEach((m, i) => {
            if (!m) return;
            m.rotation.y += dt * 2.1;
            m.position.y = 1.25 + Math.sin(t * 2.8 + i) * 0.14;
        });
    });
    return (
        <group>
            {orbs.map((o, idx) => {
                if (collected.includes(o.id)) return null;
                return (
                    <group key={o.id} position={[o.p.x, 0, o.p.z]} rotation={[0, o.p.heading + Math.PI, 0]}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                            <ringGeometry args={[0.72, 0.96, 24]} />
                            <meshBasicMaterial color={o.color} transparent opacity={0.85} side={THREE.DoubleSide} />
                        </mesh>
                        <mesh ref={(el) => { spinRef.current[idx] = el; }} position={[0, 1.25, 0]}>
                            <octahedronGeometry args={[0.48, 0]} />
                            <meshStandardMaterial color={o.color} emissive={o.color} emissiveIntensity={1.6} roughness={0.2} metalness={0.6} />
                        </mesh>
                        <Text font={FONT} position={[0, 2.15, 0]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle">{o.label}</Text>
                    </group>
                );
            })}
            {gates.map((g) => {
                const done = clearedGates.includes(g.id);
                const col = done ? "#34d399" : "#ff2e1f";
                return (
                    <group key={g.id} position={[g.p.x, 0, g.p.z]} rotation={[0, g.p.heading + Math.PI, 0]}>
                        {[-1.35, 1.35].map((sx) => (
                            <mesh key={sx} position={[sx, 1.15, 0]}>
                                <cylinderGeometry args={[0.06, 0.08, 2.3, 8]} />
                                <meshStandardMaterial color={col} emissive={col} emissiveIntensity={done ? 0.5 : 1.5} />
                            </mesh>
                        ))}
                        <mesh position={[0, 2.32, 0]}>
                            <boxGeometry args={[2.8, 0.14, 0.14]} />
                            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={done ? 0.5 : 1.5} />
                        </mesh>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                            <planeGeometry args={[2.5, 0.45]} />
                            <meshBasicMaterial color={col} transparent opacity={done ? 0.25 : 0.65} side={THREE.DoubleSide} />
                        </mesh>
                        {!done && <Text font={FONT} position={[0, 2.65, 0]} fontSize={0.22} color="#ffd6d6" anchorX="center" anchorY="middle">{`APEX // ${g.label}`}</Text>}
                    </group>
                );
            })}
        </group>
    );
}

export default function Scene({ state, near, preset = "golden", collected = [], clearedGates = [] }) {
    const p = RIDE_PRESETS[preset] || RIDE_PRESETS.golden;
    const groundCol = preset === "sakura" ? "#4e3966" : preset === "fjord" ? "#6d8572" : "#d9be94";
    const groundMaps = useMemo(() => groundPbrMaps(), []);
    const seawallGeo = useMemo(() => {
        const pos = [], idx = [], f = {};
        let i = 0;
        for (let d = -80; d <= LENGTH + 200; d += 5, i++) {
            frame(d, f);
            const x = Math.min(18.5, f.x + f.rx * (ROAD_W / 2 + 2.4));
            pos.push(x, 0, f.z, x, 0.68, f.z);
            if (i > 0) { const a = i * 2 - 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
    }, []);
    return (
        <>
            <fog attach="fog" args={[p.fog, 65, 540]} />
            <hemisphereLight args={[p.hemiSky, p.hemiGround, 1.25]} />
            {/* Rear-right fill light so the left FjordCliffs show rock relief instead of a crushed-black wall */}
            <directionalLight position={[45, 22, 60]} intensity={preset === "sakura" ? 0.95 : 1.15} color={preset === "sakura" ? "#ffb7c5" : "#ffd6a8"} />
            <Sky preset={preset} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-380, 0, -LENGTH / 2]} receiveShadow>
                <planeGeometry args={[800, LENGTH + 1200]} /><meshStandardMaterial color={groundCol} map={groundMaps.diff} normalMap={groundMaps.nor} roughnessMap={groundMaps.rough} roughness={0.94} />
            </mesh>
            {/* Coastal highway seawall along the ocean shoulder */}
            <mesh geometry={seawallGeo} receiveShadow castShadow>
                <meshStandardMaterial color={preset === "sakura" ? "#2e233a" : "#c8bfb2"} roughness={0.82} side={THREE.DoubleSide} />
            </mesh>
            <CoastalOcean preset={preset} />
            <FjordCliffs preset={preset} />
            <SakuraHighwayAtmosphere active={preset === "sakura"} state={state} />
            <Road preset={preset} />
            <Scenery preset={preset} />
            <Hills preset={preset} />
            <Landmarks preset={preset} />
            <Milestones />
            <Objectives collected={collected} clearedGates={clearedGates} />
            {STOPS.map((s) => <Sign key={`s${s.i}`} stop={s} preset={preset} />)}
            {STOPS.map((s) => <Billboard key={s.i} stop={s} near={Math.abs(near - s.d) < 320} preset={preset} />)}
            <Rider state={state} preset={preset} />
            <EffectComposer multisampling={0}>
                <Bloom mipmapBlur luminanceThreshold={0.82} intensity={preset === "sakura" ? 0.65 : 0.34} />
            </EffectComposer>
        </>
    );
}
