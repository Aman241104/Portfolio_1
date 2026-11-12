import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { shot } from "../../../content/work.js";
import { STOPS, END, LENGTH, ROAD_W, LANE_X, MODELS, frame, at, scenery } from "./route.js";

const FONT = "/fonts/Geist-800.ttf";
const SUN = new THREE.Vector3(-0.35, 0.12, -1).normalize();        // low, ahead and to the left: everything is backlit gold
const FOG = "#f0b07a";
// Kenney's stock palette is a cool teal; golden hour over Gujarat wants olive leaves, dusty gold grass and warm stone.
const RECOLOUR = { leafsGreen: "#748a3a", leafsDark: "#5d7232", woodBark: "#6a4630", grass: "#b49d4f", dirt: "#9a6a44", stone: "#a99179", rock: "#a58a70" };
const mat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1, flatShading: true });

// ---- sky: a gradient dome with a soft sun, drawn on the inside of a sphere that follows the camera ----
function Sky() {
    const ref = useRef();
    const material = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false,
        uniforms: { sun: { value: SUN } },
        vertexShader: "varying vec3 v; void main(){ v = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",
        fragmentShader: `varying vec3 v; uniform vec3 sun;
            void main(){
                float h = clamp(v.y, -0.2, 1.0);
                vec3 zen = vec3(0.36, 0.48, 0.70), mid = vec3(0.98, 0.72, 0.48), hor = vec3(1.0, 0.82, 0.58);
                vec3 c = mix(hor, mid, smoothstep(0.0, 0.18, h)); c = mix(c, zen, smoothstep(0.16, 0.85, h));
                float s = max(dot(normalize(v), sun), 0.0);
                c += vec3(1.0, 0.62, 0.32) * pow(s, 24.0) * 0.55 + vec3(1.0, 0.95, 0.8) * smoothstep(0.9975, 0.999, s);
                gl_FragColor = vec4(c, 1.0);
            }`,
    }), []);
    useFrame(({ camera }) => ref.current.position.copy(camera.position));
    return <mesh ref={ref} material={material} renderOrder={-1}><sphereGeometry args={[800, 32, 16]} /></mesh>;
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
function offsetRibbon(off, w, y) {   // a thin line at lateral offset `off`
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
function Road() {
    const [shoulder, asphalt, lineL, lineR] = useMemo(() => [ribbon(ROAD_W + 4.5, 0.01), ribbon(ROAD_W, 0.03), offsetRibbon(-ROAD_W / 2 + 0.35, 0.16, 0.04), offsetRibbon(ROAD_W / 2 - 0.35, 0.16, 0.04)], []);
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
            <mesh geometry={shoulder} receiveShadow><meshStandardMaterial color="#b88757" roughness={1} /></mesh>
            <mesh geometry={asphalt} receiveShadow><meshStandardMaterial color="#45403b" roughness={0.92} /></mesh>
            <mesh geometry={lineL}><meshBasicMaterial color="#efe6d2" /></mesh>
            <mesh geometry={lineR}><meshBasicMaterial color="#efe6d2" /></mesh>
            <instancedMesh ref={dashes} args={[null, null, n]} frustumCulled={false}><boxGeometry /><meshBasicMaterial color="#f2e9d5" /></instancedMesh>
        </group>
    );
}

// ---- scenery: every Kenney model drawn as instanced meshes (one draw call per material), recoloured warm ----
function Model({ name, items }) {
    const { scene } = useGLTF(`/ride/${name}.glb`);
    const parts = useMemo(() => {
        scene.updateMatrixWorld(true);
        const out = [];
        scene.traverse((o) => {
            if (!o.isMesh) return;
            const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
            const name2 = o.material.name || "";
            const key = Object.keys(RECOLOUR).find((k) => name2.toLowerCase().includes(k.toLowerCase().replace(/s$/, "")));
            out.push({ g, m: mat(RECOLOUR[key] || o.material.color) });
        });
        return out;
    }, [scene]);
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
    return parts.map((p, k) => <instancedMesh key={k} ref={(el) => { refs.current[k] = el; }} args={[p.g, p.m, items.length]} castShadow receiveShadow frustumCulled={false} />);
}
function Scenery() {
    const s = useMemo(() => scenery(), []);
    return Object.keys(MODELS).map((k) => <Model key={k} name={k} items={s[k]} />);
}

// ---- far hills: a ring of flat-shaded humps that follows the camera, so the horizon never runs out ----
function Hills() {
    const ref = useRef();
    const hills = useMemo(() => Array.from({ length: 46 }, (_, i) => {
        const a = (i / 46) * Math.PI * 2 + Math.sin(i * 7.3) * 0.05, r = 430 + ((i * 53) % 90);
        return { x: Math.sin(a) * r, z: Math.cos(a) * r, s: 40 + ((i * 37) % 70), h: 18 + ((i * 29) % 34), rot: i };
    }), []);
    useFrame(({ camera }) => { ref.current.position.x = camera.position.x; ref.current.position.z = camera.position.z; });
    return (
        <group ref={ref}>
            {hills.map((h, i) => (
                <mesh key={i} position={[h.x, -2, h.z]} scale={[h.s, h.h, h.s * 0.8]} rotation={[0, h.rot, 0]}>
                    <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 3 ? "#a07a5c" : "#8d6c55"} flatShading roughness={1} />
                </mesh>
            ))}
        </group>
    );
}

// ---- a project's billboard: two poles, a frame, the real screenshot (loaded only when the bike is near) ----
function Billboard({ stop, near }) {
    const p = useMemo(() => at(stop.d, -ROAD_W / 2 - 6.5), [stop.d]);
    const [tex, setTex] = useState(null);
    useEffect(() => {
        if (!near || tex) return;
        new THREE.TextureLoader().setCrossOrigin("anonymous").load(shot(stop.w, 640), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; setTex(t); });
    }, [near, tex, stop.w]);
    useEffect(() => () => tex?.dispose(), [tex]);
    return (
        <group position={[p.x, 0, p.z]} rotation={[0, p.heading + Math.PI + 0.55, 0]}>
            {[-2.9, 2.9].map((x) => <mesh key={x} position={[x, 2.6, -0.1]} castShadow><boxGeometry args={[0.22, 5.2, 0.22]} /><meshStandardMaterial color="#3b3530" /></mesh>)}
            <mesh position={[0, 5.4, -0.08]} castShadow><boxGeometry args={[6.6, 4.3, 0.18]} /><meshStandardMaterial color="#2c2723" roughness={0.8} /></mesh>
            <mesh position={[0, 5.4, 0.02]}>
                <planeGeometry args={[6.2, 3.875]} />
                {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshStandardMaterial color="#d9c6a6" />}
            </mesh>
            <mesh position={[0, 2.85, 0.05]}><boxGeometry args={[6.6, 0.9, 0.12]} /><meshStandardMaterial color="#f3ead8" /></mesh>
            <Text font={FONT} position={[0, 2.86, 0.13]} fontSize={0.42} maxWidth={6.2} color="#231f1b" anchorX="center" anchorY="middle">{stop.title}</Text>
        </group>
    );
}

// ---- green highway signboard 45 m before each stop ----
function Sign({ stop }) {
    const p = useMemo(() => at(stop.d - 45, -ROAD_W / 2 - 2.2), [stop.d]);
    return (
        <group position={[p.x, 0, p.z]} rotation={[0, p.heading + Math.PI, 0]}>
            <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.07, 0.07, 3.2, 6]} /><meshStandardMaterial color="#8f9aa0" /></mesh>
            <mesh position={[0, 3.35, 0]} castShadow><boxGeometry args={[3.4, 1.5, 0.08]} /><meshStandardMaterial color="#13704a" roughness={0.6} /></mesh>
            <mesh position={[0, 3.35, 0.045]}><planeGeometry args={[3.2, 1.3]} /><meshBasicMaterial color="#13704a" /></mesh>
            <Text font={FONT} position={[0, 3.62, 0.06]} fontSize={0.3} maxWidth={3.1} color="#f4f4ee" anchorX="center" anchorY="middle">{stop.title}</Text>
            <Text font={FONT} position={[0, 3.08, 0.06]} fontSize={0.2} color="#f4f4ee" anchorX="center" anchorY="middle">{`${stop.kind}  ·  45 m  ↑`}</Text>
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
function Landmarks() {
    const g = useMemo(() => frame(28), []), e = useMemo(() => at(END, -ROAD_W / 2 - 3), []);
    return (
        <>
            <group position={[g.x, 0, g.z]} rotation={[0, g.heading + Math.PI, 0]}>
                {[-5.4, 5.4].map((x) => <mesh key={x} position={[x, 3.6, 0]} castShadow><boxGeometry args={[1.3, 7.2, 1.3]} /><meshStandardMaterial color="#c58b5b" flatShading /></mesh>)}
                <mesh position={[0, 7.6, 0]} castShadow><boxGeometry args={[12.4, 1.4, 1.4]} /><meshStandardMaterial color="#b27a4d" flatShading /></mesh>
                {[-5.4, 5.4].map((x) => <mesh key={`d${x}`} position={[x, 8.9, 0]}><sphereGeometry args={[0.9, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#d7a06e" flatShading /></mesh>)}
                <Text font={FONT} position={[0, 7.6, -0.72]} rotation={[0, Math.PI, 0]} fontSize={0.62} color="#3b2414" anchorX="center" anchorY="middle">AHMEDABAD · RIDE</Text>
                <Text font={FONT} position={[0, 7.6, 0.72]} fontSize={0.62} color="#3b2414" anchorX="center" anchorY="middle">AHMEDABAD · RIDE</Text>
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

// ---- the bike and a simple low-poly rider; leans into the bends; the camera chases ----
function Rider({ state }) {
    const { scene } = useGLTF("/ride/motorcycle.glb");
    const bike = useMemo(() => {
        const s = scene.clone(true);
        s.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.material = o.material.clone(); o.material.roughness = 0.55; } });
        return s;
    }, [scene]);
    const root = useRef(), body = useRef(), light = useRef();
    const f = useMemo(() => ({}), []), ahead = useMemo(() => ({}), []);
    const look = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ camera }, dt) => {
        const s = state.current, d = s.d;
        frame(d, f); frame(d + 6, ahead);
        const x = f.x + f.rx * LANE_X, z = f.z + f.rz * LANE_X;
        root.current.position.set(x, 0, z);
        root.current.rotation.y = f.heading + Math.PI;
        // lean: how fast the heading turns, times speed
        let dh = ahead.heading - f.heading; if (dh > Math.PI) dh -= Math.PI * 2; if (dh < -Math.PI) dh += Math.PI * 2;
        const lean = THREE.MathUtils.clamp(-dh * s.v * 0.9, -0.38, 0.38);
        body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, lean, 6, dt);
        body.current.position.y = Math.sin(d * 1.7) * 0.012 * Math.min(1, s.v / 6);
        // chase camera: behind and above, looking ahead along the road; pulls back a little with speed
        const back = 7.2 + s.v * 0.12, up = 2.6 + s.v * 0.03;
        const cx = x - f.tx * back + f.rx * 0.6, cz = z - f.tz * back + f.rz * 0.6;
        const k = 1 - Math.exp(-dt * (s.snap ? 30 : 4));
        // eslint-disable-next-line react-hooks/immutability -- R3F: the camera is moved imperatively every frame by design
        camera.position.x += (cx - camera.position.x) * k; camera.position.z += (cz - camera.position.z) * k; camera.position.y += (up - camera.position.y) * k;
        look.set(x + f.tx * 9, 1.1, z + f.tz * 9);
        camera.lookAt(look);
        s.snap = false;
        // the sun's shadow box follows the bike
        if (light.current) { light.current.position.set(x - SUN.x * 60, 40, z - SUN.z * 60); light.current.target.position.set(x, 0, z); light.current.target.updateMatrixWorld(); }
    });
    return (
        <>
            <directionalLight ref={light} intensity={2.4} color="#ffb06a" castShadow shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-camera-far={140} shadow-bias={-0.0005} />
            <group ref={root}>
                <group ref={body}>
                    <primitive object={bike} scale={0.0165} />
                    {/* the rider: helmet, jacket, arms reaching for the bars (drawn here, flat-shaded) */}
                    <group position={[0, 0.98, 0.05]} rotation={[0, Math.PI, 0]}>   {/* faces the bike's front (the model's -Z) */}
                        <mesh position={[0, 0.34, 0.08]} rotation={[0.35, 0, 0]} castShadow><boxGeometry args={[0.42, 0.62, 0.3]} /><meshStandardMaterial color="#2f4a5a" flatShading /></mesh>
                        <mesh position={[0, 0.78, 0.2]} castShadow><icosahedronGeometry args={[0.17, 1]} /><meshStandardMaterial color="#e9e2d6" flatShading roughness={0.4} /></mesh>
                        <mesh position={[0, 0.76, 0.33]}><boxGeometry args={[0.2, 0.08, 0.04]} /><meshStandardMaterial color="#1c1c1c" /></mesh>
                        {[-0.24, 0.24].map((sx) => <mesh key={sx} position={[sx, 0.3, 0.32]} rotation={[1.0, 0, sx > 0 ? -0.25 : 0.25]} castShadow><boxGeometry args={[0.11, 0.5, 0.11]} /><meshStandardMaterial color="#2f4a5a" flatShading /></mesh>)}
                        {[-0.16, 0.16].map((sx) => <mesh key={`l${sx}`} position={[sx, -0.12, 0.12]} rotation={[-0.9, 0, 0]} castShadow><boxGeometry args={[0.14, 0.52, 0.14]} /><meshStandardMaterial color="#3a3530" flatShading /></mesh>)}
                    </group>
                </group>
            </group>
        </>
    );
}

export default function Scene({ state, near }) {
    return (
        <>
            <fog attach="fog" args={[FOG, 70, 560]} />
            <hemisphereLight args={["#ffd9ad", "#6f5a3c", 1.05]} />
            <Sky />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -LENGTH / 2]} receiveShadow>
                <planeGeometry args={[1600, LENGTH + 1200]} /><meshStandardMaterial color="#b29a58" roughness={1} />
            </mesh>
            <Road />
            <Scenery />
            <Hills />
            <Landmarks />
            <Milestones />
            {STOPS.map((s) => <Sign key={`s${s.i}`} stop={s} />)}
            {STOPS.map((s) => <Billboard key={s.i} stop={s} near={Math.abs(near - s.d) < 320} />)}
            <Rider state={state} />
        </>
    );
}
