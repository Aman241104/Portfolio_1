import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

// Footer: dunes of dust (Acquire footer ref), streaked bright along their crests, under a few stars, with PX-01
// standing on a ridge made of the same dust. The cursor lifts and parts the dots and sends a ripple out.

const rand = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const height = (x, z) => 2.1 * Math.sin(x * 0.09 + 0.6) * Math.sin(z * 0.07 + 1.2) + 0.7 * Math.sin(x * 0.2 - z * 0.12) + 0.35 * Math.sin(x * 0.5 + z * 0.3);
const crest = (x, z) => Math.sin(x * 0.11 + z * 0.34 + 1.4 * Math.sin(x * 0.05 + 0.3));

// The machine's silhouette (case, reel window, lever, knob), sampled from a tiny canvas drawing.
const silhouette = () => {
    const W = 120, H = 140, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.beginPath(); g.roundRect(4, 40, 86, 74, 6); g.fill();             // case
    g.fillRect(10, 114, 8, 8); g.fillRect(76, 114, 8, 8);              // feet
    g.fillRect(90, 70, 10, 12);                                         // lever hub
    g.fillRect(98, 20, 4, 56);                                          // arm
    g.beginPath(); g.arc(100, 16, 8, 0, Math.PI * 2); g.fill();        // knob
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(12, 58, 70, 26);         // reel window: thinner dust
    const px = g.getImageData(0, 0, W, H).data;
    return { W, H, alpha: (x, y) => px[(y * W + x) * 4 + 3] / 255 };
};

const build = (count) => {
    const pos = [], size = [], kind = [], seed = [];
    const push = (x, y, z, s, k) => { pos.push(x, y, z); size.push(s); kind.push(k); seed.push(rand(pos.length)); };
    // dunes: rejection-sample so dots crowd onto the crests
    for (let i = 0, n = 0; n < count && i < count * 8; i++) {
        const x = (rand(i * 2.1) - 0.5) * 72, z = -44 + rand(i * 3.7) * 50;
        const c = Math.max(crest(x, z), 0);
        if (rand(i * 5.3) > 0.1 + 0.9 * c ** 6) continue;
        push(x, height(x, z) + (rand(i * 7.9) - 0.5) * 0.12, z, 0.6 + rand(i * 9.1) * 1.1 + c * 0.6, 0);
        n++;
    }
    // stars
    for (let i = 0; i < 900; i++) push((rand(i + 0.5) - 0.5) * 120, 5 + rand(i + 0.7) * 26, -60 + rand(i + 0.9) * 30, 0.6 + rand(i + 0.3) * 1.6, 1);
    // the machine, standing on a ridge to the right
    const sil = silhouette(), mx = 7.5, mz = -9, base = height(mx, mz), scale = 3.4 / sil.H;
    for (let i = 0; i < 9000; i++) {
        const u = Math.floor(rand(i * 1.3 + 9) * sil.W), v = Math.floor(rand(i * 2.9 + 4) * sil.H);
        if (rand(i * 4.1 + 2) > sil.alpha(u, v)) continue;
        push(mx + (u - sil.W / 2) * scale, base + (sil.H - v) * scale - 0.2, mz + (rand(i * 6.7) - 0.5) * 0.5, 1.1 + rand(i * 8.3) * 0.8, 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
    geo.setAttribute("aKind", new THREE.Float32BufferAttribute(kind, 1));
    geo.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
    return geo;
};

const vertexShader = /* glsl */ `
uniform float uTime, uPR, uActive;
uniform vec3 uMouse;
attribute float aSize, aKind, aSeed;
varying float vAlpha;
void main() {
    vec3 p = position;
    bool star = aKind > 0.5 && aKind < 1.5;
    if (!star) {
        p.y += sin(p.x * 0.25 + p.z * 0.15 + uTime * 0.6) * 0.1 * (aKind < 0.5 ? 1.0 : 0.15);  // wind swell
        vec2 d = p.xz - uMouse.xz;
        float dist = length(d);
        float f = smoothstep(3.4, 0.0, dist) * uActive;                 // lift + part around the cursor
        p.y += f * 1.2;
        p.xz += normalize(d + 1e-4) * f * 1.1;
        p.y += sin(dist * 2.0 - uTime * 4.0) * smoothstep(8.0, 1.5, dist) * 0.14 * uActive;   // ripple
        vAlpha = 0.72 + f * 0.28;
    } else vAlpha = 0.55 + 0.45 * sin(uTime * 1.7 + aSeed * 60.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPR * 19.0 / -mv.z;
    vAlpha *= smoothstep(70.0, 10.0, -mv.z) * (aKind > 1.5 ? 1.25 : 1.0);
}`;
const fragmentShader = /* glsl */ `
varying float vAlpha;
void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(0.93, 0.92, 0.89, vAlpha * smoothstep(0.5, 0.15, r));
}`;

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.4);
const hit = new THREE.Vector3();

const Dust = ({ count }) => {
    const geo = useMemo(() => build(count), [count]);
    const uniforms = useMemo(() => ({
        uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector3(0, 0, -100) }, uActive: { value: 0 },
    }), []);
    const last = useRef({ x: 9, y: 9, moved: 0 });
    useFrame(({ clock, pointer, raycaster, camera }, dt) => {
        uniforms.uTime.value = clock.elapsedTime;
        const l = last.current;
        if (pointer.x !== l.x || pointer.y !== l.y) { l.x = pointer.x; l.y = pointer.y; l.moved = clock.elapsedTime; }
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.lerp(hit, 1 - Math.exp(-8 * dt));
        // the field calms down a couple of seconds after the cursor stops
        const live = clock.elapsedTime - l.moved < 2.5 && Math.abs(pointer.y) < 1;
        uniforms.uActive.value = THREE.MathUtils.damp(uniforms.uActive.value, live ? 1 : 0, live ? 6 : 1.5, dt);
    });
    return (
        <points geometry={geo} frustumCulled={false}>
            <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}
                transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

// `eventSource`: the footer element, so the dots react even when the cursor is over the footer's text.
export default function DotField({ active, eventSource }) {
    const count = typeof window !== "undefined" && window.innerWidth < 700 ? 40000 : 95000;
    return (
        <Canvas className="dots" frameloop={active ? "always" : "never"} dpr={[1, 1.5]} eventSource={eventSource} eventPrefix="client"
            camera={{ position: [0, 3.4, 12], fov: 45, far: 200 }} gl={{ antialias: false }}
            onCreated={({ camera, gl }) => { camera.lookAt(0, 0.2, -10); gl.setClearColor("#050506"); }}>
            <Dust count={count} />
        </Canvas>
    );
}
