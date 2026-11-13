import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// Footer: dunes of dust (Acquire footer ref), streaked bright along their crests, under a few stars, with code
// glyphs (</>, { }, AP, >_) standing on a ridge, morphing, made of the same dust. The cursor lifts and parts the dots and sends a ripple out.

const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const height = (x, z) => 2.1 * Math.sin(x * 0.09 + 0.6) * Math.sin(z * 0.07 + 1.2) + 0.7 * Math.sin(x * 0.2 - z * 0.12) + 0.35 * Math.sin(x * 0.5 + z * 0.3);
const crest = (x, z) => Math.sin(x * 0.11 + z * 0.34 + 1.4 * Math.sin(x * 0.05 + 0.3));

// What the dust spells: code glyphs and my initials, drawn once on a small canvas and sampled into point clouds
// (every dot has a home in every glyph, so they can morph). Font: whatever Geist weight is loaded, else sans.
const GLYPHS = ["</>", "{ }", "AP", ">_"];
const glyphPoints = (n) => {
    const W = 220, H = 120, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true });
    return GLYPHS.map((txt, gi) => {
        g.clearRect(0, 0, W, H); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
        g.font = `800 ${txt.length > 2 ? 96 : 104}px Geist, system-ui, sans-serif`;
        g.fillText(txt, W / 2, H / 2 + 6);
        const px = g.getImageData(0, 0, W, H).data, on = [];
        for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (px[(y * W + x) * 4 + 3] > 128) on.push(x, y);
        const out = new Float32Array(n * 3), m = on.length / 2;
        for (let i = 0; i < n; i++) {
            const k = Math.floor(rand(i * 3.3 + gi * 17.1) * m);
            out[i * 3] = (on[k * 2] - W / 2) / H; out[i * 3 + 1] = (H / 2 - on[k * 2 + 1]) / H; out[i * 3 + 2] = rand(i * 1.7 + gi) - 0.5;
        }
        return out;
    });
};
const GLYPH_AT = typeof window !== "undefined" && window.innerWidth < 700 ? [1.2, -12] : [7.5, -9];

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
    // the glyph, standing on a ridge: dots carry their home in each glyph as attributes; position = the ridge spot
    const N = count < 60000 ? 2600 : 4200, [gx, gz] = GLYPH_AT, gy = height(gx, gz) + 1.9, shapes = glyphPoints(N);
    const first = pos.length / 3;
    for (let i = 0; i < N; i++) push(gx, gy, gz, 1.1 + rand(i * 8.3) * 0.8, 2);
    const total = pos.length / 3, attr = shapes.map(() => new Float32Array(total * 3));
    shapes.forEach((sh, k) => attr[k].set(sh, first * 3));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
    geo.setAttribute("aKind", new THREE.Float32BufferAttribute(kind, 1));
    geo.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
    attr.forEach((a, k) => geo.setAttribute(`aT${k}`, new THREE.BufferAttribute(a, 3)));
    return geo;
};

const vertexShader = /* glsl */ `
uniform float uTime, uPR, uActive, uBurst, uMorph, uAspect;
uniform vec3 uMouse;
uniform vec2 uPointer, uGlyph;
attribute float aSize, aKind, aSeed;
attribute vec3 aT0, aT1, aT2, aT3;
vec3 shapeAt(float k) { k = mod(k, 4.0); return k < 0.5 ? aT0 : k < 1.5 ? aT1 : k < 2.5 ? aT2 : aT3; }
varying float vAlpha;
varying float vKind;
void main() {
    vKind = aKind;
    vec3 p = position;
    bool star = aKind > 0.5 && aKind < 1.5;
    if (aKind > 1.5) {
        // glyph: hold, then each dot flies (staggered, with a swirl) to its home in the next glyph
        float i = floor(uMorph), fr = fract(uMorph), st = 0.62 + aSeed * 0.16;
        float f = smoothstep(st, st + 0.2, fr);
        vec3 a = shapeAt(i), b = shapeAt(i + 1.0);
        vec3 l = mix(a, b, f);
        float swirl = f * (1.0 - f) * 4.0;
        l.xy += vec2(sin(aSeed * 40.0 + uTime), cos(aSeed * 33.0 + uTime)) * swirl * 0.25;
        p += vec3(l.xy * 3.3, l.z * 0.35 + swirl * (aSeed - 0.5) * 2.0);
        // split around the cursor / finger, measured on screen (the glyph stands upright, the dunes lie flat)
        vec4 c = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        vec2 d = c.xy / c.w - uPointer; d.x *= uAspect;
        float k = smoothstep(0.24, 0.0, length(d)) * uActive;
        vec2 dir = normalize(d + 1e-4);
        p.xy += vec2(dir.x / uAspect, dir.y) * k * 1.7;
        p.z += k * (1.5 + aSeed * 1.5);
    }
    if (!star) {
        p.y += sin(p.x * 0.25 + p.z * 0.15 + uTime * 0.6) * 0.1 * (aKind < 0.5 ? 1.0 : 0.15);  // wind swell
        vec2 d = p.xz - uMouse.xz;
        float dist = length(d);
        float f = smoothstep(3.4, 0.0, dist) * uActive;                 // lift + part around the cursor
        p.y += f * 1.2;
        p.xz += normalize(d + 1e-4) * f * 1.1;
        p.y += sin(dist * 2.0 - uTime * 4.0) * smoothstep(8.0, 1.5, dist) * 0.14 * uActive;   // ripple
        vAlpha = 0.72 + f * 0.28;
        // "copy email": a ring of light leaves the glyph and rolls out across the dunes
        float bt = uTime - uBurst, dm = length(p.xz - uGlyph), front = bt * 6.0;
        float wave = step(0.0, bt) * exp(-bt * 0.7) * smoothstep(2.5, 0.0, abs(dm - front));
        p.y += wave * 0.55 * (aKind < 0.5 ? 1.0 : 0.0);
        vAlpha += wave * 0.6 + (aKind > 1.5 ? step(0.0, bt) * exp(-bt * 1.6) * 0.9 : 0.0);
    } else vAlpha = 0.55 + 0.45 * sin(uTime * 1.7 + aSeed * 60.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPR * 19.0 / -mv.z;
    vAlpha *= smoothstep(70.0, 10.0, -mv.z) * (aKind > 1.5 ? 1.25 : 1.0);
}`;
const fragmentShader = /* glsl */ `
varying float vAlpha;
varying float vKind;
uniform vec3 uColor;
uniform vec3 uGlyphColor;
void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    vec3 col = vKind > 1.5 ? uGlyphColor : uColor;
    gl_FragColor = vec4(col, vAlpha * smoothstep(0.5, 0.15, r));
}`;

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.4);
const hit = new THREE.Vector3();

const DARK_INK = new THREE.Color(0.93, 0.92, 0.89);
const LIGHT_INK = new THREE.Color(0.08, 0.08, 0.09);     // deep carbon iron-filings on warm paper
const LIGHT_GLYPH = new THREE.Color(1.0, 0.18, 0.12);    // vermilion #ff2e1f code glyphs in Daylight Atelier
const DARK_BG = new THREE.Color("#050506");
const LIGHT_BG = new THREE.Color("#f2ede4");

const Dust = ({ count, pulse, light, eventSource }) => {
    const geo = useMemo(() => build(count), [count]);
    const uniforms = useMemo(() => ({
        uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector3(0, 0, -100) }, uActive: { value: 0 }, uBurst: { value: -100 },
        uMorph: { value: 0 }, uAspect: { value: 1 }, uPointer: { value: new THREE.Vector2(9, 9) }, uGlyph: { value: new THREE.Vector2(...GLYPH_AT) },
        uColor: { value: DARK_INK.clone() },
        uGlyphColor: { value: DARK_INK.clone() },
    }), []);
    const bgCol = useMemo(() => DARK_BG.clone(), []);
    const last = useRef({ x: 9, y: 9, moved: 0 });
    const seen = useRef(pulse);
    // touch: a tap or drag on the footer counts as the pointer (R3F only tracks mouse-style moves)
    const get = useThree((st) => st.get);
    useEffect(() => {
        const el = eventSource?.current;
        if (!el) return;
        const touch = (e) => {
            if (e.pointerType === "mouse") return;
            const { gl, pointer } = get(), r = gl.domElement.getBoundingClientRect();
            pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        };
        el.addEventListener("pointerdown", touch, { passive: true }); el.addEventListener("pointermove", touch, { passive: true });
        return () => { el.removeEventListener("pointerdown", touch); el.removeEventListener("pointermove", touch); };
    }, [eventSource, get]);
    useFrame(({ clock, pointer, raycaster, camera, size, gl }, dt) => {
        const k = 1 - Math.exp(-8 * dt);
        bgCol.lerp(light ? LIGHT_BG : DARK_BG, k);
        gl.setClearColor(bgCol);
        uniforms.uColor.value.lerp(light ? LIGHT_INK : DARK_INK, k);
        uniforms.uGlyphColor.value.lerp(light ? LIGHT_GLYPH : DARK_INK, k);
        uniforms.uTime.value = clock.elapsedTime;
        uniforms.uMorph.value = reduced ? 0 : clock.elapsedTime / 4.2;     // a glyph every ~4s
        uniforms.uAspect.value = size.width / size.height;
        uniforms.uPointer.value.lerp(pointer, 1 - Math.exp(-14 * dt));
        if (pulse !== seen.current) { seen.current = pulse; uniforms.uBurst.value = clock.elapsedTime; }
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
                transparent depthWrite={false} blending={light ? THREE.NormalBlending : THREE.AdditiveBlending} />
        </points>
    );
};

// `eventSource`: the footer element, so the dots react even when the cursor is over the footer's text.
export default function DotField({ active, eventSource, pulse = 0, light = false }) {
    const count = typeof window !== "undefined" && window.innerWidth < 700 ? 40000 : 95000;
    return (
        <Canvas className="dots" frameloop={active ? "always" : "never"} dpr={[1, 1.5]} eventSource={eventSource} eventPrefix="client"
            camera={{ position: [0, 3.4, 12], fov: 45, far: 200 }} gl={{ antialias: false }}
            onCreated={({ camera, gl }) => { camera.lookAt(0, 0.2, -10); gl.setClearColor(light ? "#f2ede4" : "#050506"); }}>
            <Dust count={count} pulse={pulse} light={light} eventSource={eventSource} />
        </Canvas>
    );
}
