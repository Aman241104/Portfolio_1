import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Text } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CylinderCollider, useRapier } from "@react-three/rapier";
import { EffectComposer, Bloom, TiltShift2, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { shot } from "../../../content/work.js";
import { Machine } from "../../machine/MachineModel.jsx";
import { CURVE, ROAD_W, PLINTH, STOPS, SECTORS, SPAWN, onTrack, standoff } from "./track.js";

// RIDE: a classic coupe on the PX-01 test track, shot like a miniature — high camera, long lens, tilt-shift,
// one warm key light with soft shadows. Physics: Rapier raycast vehicle (real suspension, grip, drift) plus
// cones and crates you can knock about. Projects are printed tickets standing around the circuit.
const FONT = "/fonts/Geist-800.ttf";
const VOID = "#0b0b0d", FLOOR = "#b8b2a6", INK = "#141416", SIGNAL = "#ff2e1f", BONE = "#edeae3";

// ── car tuning (chassis forward = +X, axle = Z) ────────────────────────────────────────────
const WHEELS = [[1.32, 0.86], [1.32, -0.86], [-1.3, 0.86], [-1.3, -0.86]];   // [x, z]: front L/R, rear L/R
const WHEEL_R = 0.38, REST = 0.32, MASS = 150, ENGINE = 620, BRAKE = 7, STEER = 0.55, TOP = 32;   // TOP m/s ≈ 115 km/h

const paint = new THREE.MeshPhysicalMaterial({ color: "#0e0e10", metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 });
const stripe = new THREE.MeshPhysicalMaterial({ color: SIGNAL, roughness: 0.35, clearcoat: 1 });
const chrome = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.12 });
const glass = new THREE.MeshPhysicalMaterial({ color: "#1b2026", metalness: 0.2, roughness: 0.05, transmission: 0, opacity: 0.85, transparent: true, clearcoat: 1 });
const rubber = new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.92 });
const lampOn = new THREE.MeshBasicMaterial({ color: "#fff3d6", toneMapped: false });
const tailOn = new THREE.MeshBasicMaterial({ color: "#ff3b2a", toneMapped: false });

function Coupe() {
    // body ~4.3 m long; the group origin is the chassis collider centre
    return (
        <group position={[0, -0.12, 0]}>
            <RoundedBox args={[4.3, 0.56, 1.86]} radius={0.22} smoothness={4} material={paint} castShadow position={[0, 0.05, 0]} />
            {/* long hood, set-back cabin, short deck — the classic coupe silhouette */}
            <RoundedBox args={[2.0, 0.5, 1.6]} radius={0.24} smoothness={4} material={paint} castShadow position={[-0.35, 0.52, 0]} />
            <RoundedBox args={[1.86, 0.4, 1.66]} radius={0.16} smoothness={3} material={glass} position={[-0.35, 0.5, 0]} />
            {/* racing stripes over hood, roof and deck */}
            {[-0.2, 0.2].map((z) => (
                <group key={z}>
                    <mesh material={stripe} position={[1.25, 0.335, z]}><boxGeometry args={[1.8, 0.012, 0.16]} /></mesh>
                    <mesh material={stripe} position={[-0.35, 0.775, z]}><boxGeometry args={[1.5, 0.012, 0.16]} /></mesh>
                    <mesh material={stripe} position={[-1.75, 0.335, z]}><boxGeometry args={[0.75, 0.012, 0.16]} /></mesh>
                </group>
            ))}
            {/* chrome bumpers */}
            {[2.18, -2.18].map((x) => (
                <mesh key={x} material={chrome} position={[x, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <capsuleGeometry args={[0.07, 1.62, 4, 10]} />
                </mesh>
            ))}
            {/* round headlights + tail lights */}
            {[-0.62, 0.62].map((z) => (
                <group key={z}>
                    <mesh material={chrome} position={[2.14, 0.1, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.17, 0.17, 0.06, 20]} /></mesh>
                    <mesh material={lampOn} position={[2.175, 0.1, z]} rotation={[0, 0, Math.PI / 2]}><circleGeometry args={[0.13, 20]} /></mesh>
                    <mesh material={tailOn} position={[-2.16, 0.12, z]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.3, 0.12]} /></mesh>
                </group>
            ))}
            <Text font={FONT} fontSize={0.16} color={BONE} position={[-2.16, -0.1, 0]} rotation={[0, -Math.PI / 2, 0]} letterSpacing={0.12}>PX-01</Text>
        </group>
    );
}

function Wheel({ front }) {
    return (
        <group>
            <mesh material={rubber} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.3, 24]} /></mesh>
            <mesh material={chrome} position={[0, 0, front ? 0.152 : 0.152]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.01, 20]} /></mesh>
            <mesh material={chrome} position={[0, 0, -0.152]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.01, 20]} /></mesh>
        </group>
    );
}

const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _look = new THREE.Vector3(), _cam = new THREE.Vector3();
const CAM_OFF = new THREE.Vector3(-24, 33, 38);                  // fixed world-space angle: diorama, never spins with the car

function Car({ input, api, onNear, onSpeed, light }) {
    const body = useRef(), wheels = useRef([]);
    const { world } = useRapier();
    const ctrl = useRef(null);
    const camera = useThree((s) => s.camera);
    const nearRef = useRef(-1);
    const steer = useRef(0);

    useEffect(() => {
        const vc = world.createVehicleController(body.current);
        vc.indexUpAxis = 1; vc.setIndexForwardAxis = 0;                 // chassis: +Y up, +X forward
        WHEELS.forEach(([x, z]) => {
            vc.addWheel({ x, y: -0.12, z }, { x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }, REST, WHEEL_R);
        });
        for (let i = 0; i < 4; i++) {
            vc.setWheelSuspensionStiffness(i, 26);
            vc.setWheelMaxSuspensionTravel(i, 0.3);
            vc.setWheelSuspensionCompression(i, 2.6);
            vc.setWheelSuspensionRelaxation(i, 3.4);
            vc.setWheelFrictionSlip(i, i < 2 ? 2.4 : 2.1);
            vc.setWheelSideFrictionStiffness(i, 1.15);
            vc.setWheelMaxSuspensionForce(i, 1e5);
        }
        ctrl.current = vc;
        const place = (x, z, yaw) => {
            const b = body.current;
            b.setTranslation({ x, y: 1.2, z }, true);
            b.setRotation(_q.setFromEuler(_e.set(0, yaw, 0)), true);
            b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true);
        };
        api.current = {
            reset: () => { const p = body.current.translation(); const f = nearestOnTrack(p.x, p.z); place(f.x, f.z, f.yaw); },
            home: () => place(SPAWN.x, SPAWN.z, SPAWN.yaw),
            go: (s) => { const p = standoff(s); place(p.x, p.z, p.yaw); },
        };
        return () => { world.removeVehicleController(vc); ctrl.current = null; };
    }, [world, api]);

    useFrame((_, dt) => {
        const vc = ctrl.current, b = body.current;
        if (!vc || !b) return;
        dt = Math.min(dt, 1 / 30);
        const k = input.current;
        const speed = vc.currentVehicleSpeed();                       // m/s along forward axis
        // steering eases in, and narrows with speed so it stays planted at the top end
        const target = (k.left - k.right) * STEER * (1 - Math.min(0.55, Math.abs(speed) / 40));
        steer.current += (target - steer.current) * (1 - Math.exp(-dt * 9));
        const fwd = k.up - k.down;
        const braking = fwd !== 0 && Math.sign(fwd) !== Math.sign(speed) && Math.abs(speed) > 1;
        for (let i = 0; i < 4; i++) {
            const isFront = i < 2;
            vc.setWheelSteering(i, isFront ? steer.current : 0);
            vc.setWheelEngineForce(i, !isFront && !braking ? fwd * ENGINE * Math.max(0, 1 - Math.abs(speed) / TOP) : 0);   // tapers to 0 at top speed
            vc.setWheelBrake(i, braking ? BRAKE : k.brake ? (isFront ? 1 : 4) : fwd === 0 ? 0.25 : 0);
            if (!isFront) vc.setWheelFrictionSlip(i, k.brake ? 0.9 : 2.1);  // handbrake: rear lets go → drift
        }
        vc.updateVehicle(dt);

        // wheels follow the suspension
        for (let i = 0; i < 4; i++) {
            const w = wheels.current[i]; if (!w) continue;
            const [x, z] = WHEELS[i];
            w.position.set(x, -0.12 - (vc.wheelSuspensionLength(i) ?? REST), z);
            w.rotation.set(0, vc.wheelSteering(i) ?? 0, 0);
            w.children[0].rotation.z = -(vc.wheelRotation(i) ?? 0);
        }

        const p = b.translation();
        if (p.y < -12) api.current.home();                              // drove off the plinth

        // camera: fixed diorama angle, eased; pulls back a touch with speed
        const pull = (camera.aspect < 1 ? 1.5 : 1) * (1 + Math.min(0.25, Math.abs(speed) / 120));   // portrait sees less width: back off
        _look.set(p.x, 0.6, p.z);
        _cam.copy(CAM_OFF).multiplyScalar(pull).add(_look);
        camera.position.lerp(_cam, 1 - Math.exp(-dt * 3.2));
        camera.lookAt(_v.copy(camera.position).sub(CAM_OFF.clone().multiplyScalar(pull)));

        // key light + shadow frustum ride along with the car
        if (light.current) { light.current.position.set(p.x - 26, 42, p.z + 18); light.current.target.position.set(p.x, 0, p.z); light.current.target.updateMatrixWorld(); }

        // nearest ticket board → card
        let best = -1, bd = 9.5 * 9.5;
        for (const s of STOPS) { const d = (s.x - p.x) ** 2 + (s.z - p.z) ** 2; if (d < bd) { bd = d; best = s.i; } }
        if (best !== nearRef.current) { nearRef.current = best; onNear(best); }
        onSpeed(speed);
    });

    return (
        <RigidBody ref={body} colliders={false} position={[SPAWN.x, 1.2, SPAWN.z]} rotation={[0, SPAWN.yaw, 0]} canSleep={false} linearDamping={0.05} angularDamping={0.6}>
            <CuboidCollider args={[2.1, 0.3, 0.9]} position={[0, 0.05, 0]} mass={MASS} />
            <CuboidCollider args={[1.0, 0.25, 0.8]} position={[-0.35, 0.55, 0]} mass={0} />
            <Coupe />
            {WHEELS.map(([x, z], i) => (
                <group key={i} ref={(el) => (wheels.current[i] = el)} position={[x, -0.12 - REST, z]}>
                    <Wheel front={i < 2} />
                </group>
            ))}
        </RigidBody>
    );
}

function nearestOnTrack(x, z) {
    let bt = 0, bd = Infinity;
    for (let i = 0; i < 200; i++) { const f = onTrack(i / 200), d = (f.x - x) ** 2 + (f.z - z) ** 2; if (d < bd) { bd = d; bt = i / 200; } }
    const f = onTrack(bt);
    return { x: f.x, z: f.z, yaw: Math.atan2(-f.tz, f.tx) };
}

// ── track: asphalt ribbon, red/white kerbs, start line, painted sector labels ─────────────────
function Track() {
    const { road, kerbs } = useMemo(() => {
        const N = 360, pos = [], idx = [], kerb = [];
        for (let i = 0; i <= N; i++) {
            const f = onTrack(i / N);
            for (const s of [-1, 1]) pos.push(f.x + f.nx * s * ROAD_W / 2, 0.012, f.z + f.nz * s * ROAD_W / 2);
            if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        // kerb blocks every ~1.6 m along both edges, alternating colour
        const K = Math.round(CURVE.getLength() / 1.6);
        for (let i = 0; i < K; i++) {
            const f = onTrack(i / K);
            for (const s of [-1, 1]) kerb.push({ x: f.x + f.nx * s * (ROAD_W / 2 + 0.35), z: f.z + f.nz * s * (ROAD_W / 2 + 0.35), yaw: Math.atan2(-f.tz, f.tx), red: i % 2 === 0 });
        }
        return { road: g, kerbs: kerb };
    }, []);
    const red = useRef(), white = useRef();
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
        let r = 0, w = 0;
        kerbs.forEach((k) => {
            m.compose(new THREE.Vector3(k.x, 0.05, k.z), q.setFromEuler(e.set(0, k.yaw, 0)), one);
            if (k.red) red.current.setMatrixAt(r++, m); else white.current.setMatrixAt(w++, m);
        });
        red.current.count = r; white.current.count = w;
        red.current.instanceMatrix.needsUpdate = white.current.instanceMatrix.needsUpdate = true;
    }, [kerbs]);
    const n = kerbs.length;
    const start = onTrack(1 - 35 / CURVE.getLength() + 14 / CURVE.getLength());
    return (
        <group>
            <mesh geometry={road} receiveShadow><meshStandardMaterial color="#2b2a2a" roughness={0.88} /></mesh>
            <instancedMesh ref={red} args={[null, null, n]} receiveShadow castShadow><boxGeometry args={[1.6, 0.1, 0.7]} /><meshStandardMaterial color={SIGNAL} roughness={0.6} /></instancedMesh>
            <instancedMesh ref={white} args={[null, null, n]} receiveShadow castShadow><boxGeometry args={[1.6, 0.1, 0.7]} /><meshStandardMaterial color="#f2efe8" roughness={0.6} /></instancedMesh>
            {/* chequered start line */}
            <group position={[start.x, 0.02, start.z]} rotation={[0, Math.atan2(-start.tz, start.tx), 0]}>
                {Array.from({ length: 18 }, (_, i) => (
                    <mesh key={i} position={[((i / 9) | 0) * 0.5 - 0.25, 0, (i % 9) - 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                        <planeGeometry args={[0.5, 1]} /><meshStandardMaterial color={(i + ((i / 9) | 0)) % 2 ? "#f2efe8" : INK} roughness={0.7} />
                    </mesh>
                ))}
            </group>
            {SECTORS.map((s) => {
                const f = onTrack(s.t);
                // paint the label along the road, turned so it reads upright from the fixed camera
                let yaw = Math.atan2(-f.tz, f.tx);
                if (Math.sin(yaw) * CAM_OFF.x + Math.cos(yaw) * CAM_OFF.z < 0) yaw += Math.PI;   // label "up" must point away from the camera
                return (
                    <group key={s.kind} position={[f.x, 0.025, f.z]} rotation={[-Math.PI / 2, 0, yaw]}>
                        <Text font={FONT} fontSize={1.5} color={BONE} anchorX="center" anchorY="middle" letterSpacing={0.04}>{s.label.toUpperCase()}</Text>
                        <Text font={FONT} fontSize={0.55} color={SIGNAL} anchorX="center" anchorY="middle" position={[0, 1.35, 0]} letterSpacing={0.2}>{`OUTPUT ${s.n} · ${s.count} TICKETS`}</Text>
                    </group>
                );
            })}
        </group>
    );
}

// ── tickets: one standing thermal-paper slab per project ────────────────────────────────────
const paperMat = new THREE.MeshStandardMaterial({ color: "#fbfaf6", roughness: 0.78 });
const barcodeTex = (() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas"); c.width = 256; c.height = 32;
    const g = c.getContext("2d"); g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 256, 32); g.fillStyle = INK;
    let x = 0, s = 7; while (x < 256) { s = (s * 16807) % 2147483647; const w = 1 + (s % 4); if (s % 3) g.fillRect(x, 0, w, 32); x += w + 1 + (s % 3); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t;
})();

function Ticket({ stop, active }) {
    const [tex, setTex] = useState(null);
    const bar = useMemo(() => { const t = barcodeTex.clone(); t.offset.x = (stop.i * 0.137) % 1; t.repeat.x = 0.5; t.needsUpdate = true; return t; }, [stop.i]);
    useEffect(() => {
        let live = true;
        new THREE.TextureLoader().setCrossOrigin("anonymous").load(shot(stop.w, 480), (t) => {
            if (!live) return t.dispose();
            t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; setTex(t);
        });
        return () => { live = false; };
    }, [stop.w]);
    useEffect(() => () => { tex?.dispose(); bar.dispose(); }, [tex, bar]);
    const lift = useRef();
    useFrame((_, dt) => { if (lift.current) lift.current.position.y += ((active ? 0.35 : 0) - lift.current.position.y) * (1 - Math.exp(-dt * 6)); });
    const live = stop.status === "Live";
    return (
        <RigidBody type="fixed" colliders={false} position={[stop.x, 0, stop.z]} rotation={[0, stop.face, 0]}>
            <CuboidCollider args={[1.7, 2.8, 0.12]} position={[0, 2.8, 0]} />
            <group ref={lift}>
                <mesh material={paperMat} position={[0, 2.85, 0]} castShadow receiveShadow><boxGeometry args={[3.2, 5.3, 0.1]} /></mesh>
                {[0, Math.PI].map((r) => <group key={r} rotation={[0, r, 0]}>
                <mesh position={[0, 3.85, 0.056]}>
                    <planeGeometry args={[2.86, 1.79]} />
                    <meshBasicMaterial map={tex} color={tex ? "#ffffff" : "#d9d5cc"} toneMapped={false} />
                </mesh>
                <Text font={FONT} fontSize={0.15} color={SIGNAL} anchorX="left" position={[-1.43, 5.15, 0.06]} letterSpacing={0.14}>{`№ ${String(stop.i + 1).padStart(2, "0")} · ${stop.kind.toUpperCase()}`}</Text>
                <Text font={FONT} fontSize={0.3} color={INK} anchorX="left" anchorY="top" maxWidth={2.86} lineHeight={1.05} position={[-1.43, 2.78, 0.06]}>{stop.title.toUpperCase()}</Text>
                <Text font={FONT} fontSize={0.13} color="#64615b" anchorX="left" anchorY="top" maxWidth={2.86} lineHeight={1.3} position={[-1.43, 2.0, 0.06]}>{stop.w.line}</Text>
                <mesh position={[0, 0.72, 0.056]}><planeGeometry args={[2.86, 0.34]} /><meshBasicMaterial map={bar} toneMapped={false} /></mesh>
                {/* status stamp */}
                <group position={[0.95, 1.25, 0.06]} rotation={[0, 0, 0.12]}>
                    <Text font={FONT} fontSize={0.2} color={live ? SIGNAL : "#64615b"} letterSpacing={0.12}>{stop.status.toUpperCase()}</Text>
                </group>
                </group>)}
                {/* steel stand */}
                <mesh material={chrome} position={[0, 0.12, -0.02]} castShadow><boxGeometry args={[1.2, 0.24, 0.6]} /></mesh>
            </group>
        </RigidBody>
    );
}

// ── props: ramps, cones, crates ─────────────────────────────────────────────────────────────
function Ramp({ position, yaw = 0 }) {
    const L = 7, H = 1.3, W = 5, a = Math.atan2(H, L);
    return (
        <RigidBody type="fixed" colliders={false} position={position} rotation={[0, yaw, 0]}>
            <group rotation={[0, 0, a]} position={[0, H / 2 - 0.15, 0]}>
                <CuboidCollider args={[Math.hypot(L, H) / 2, 0.15, W / 2]} />
                <mesh castShadow receiveShadow><boxGeometry args={[Math.hypot(L, H), 0.3, W]} /><meshStandardMaterial color="#e9e5dc" roughness={0.7} /></mesh>
                {[-1.6, 0, 1.6].map((z) => <mesh key={z} position={[0, 0.152, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[Math.hypot(L, H) * 0.92, 0.35]} /><meshStandardMaterial color={SIGNAL} roughness={0.6} /></mesh>)}
            </group>
        </RigidBody>
    );
}

const coneMat = new THREE.MeshStandardMaterial({ color: SIGNAL, roughness: 0.55 });
const coneBand = new THREE.MeshStandardMaterial({ color: "#f2efe8", roughness: 0.5 });
function Cone({ position }) {
    return (
        <RigidBody colliders={false} position={position} mass={1.5} linearDamping={0.3} angularDamping={0.3}>
            <CylinderCollider args={[0.42, 0.28]} position={[0, 0.42, 0]} />
            <mesh material={coneMat} position={[0, 0.42, 0]} castShadow><coneGeometry args={[0.3, 0.84, 16]} /></mesh>
            <mesh material={coneBand} position={[0, 0.48, 0]}><cylinderGeometry args={[0.15, 0.2, 0.14, 16]} /></mesh>
            <mesh material={coneMat} position={[0, 0.03, 0]} castShadow><boxGeometry args={[0.66, 0.06, 0.66]} /></mesh>
        </RigidBody>
    );
}

const crateMat = new THREE.MeshStandardMaterial({ color: "#c9b48a", roughness: 0.85 });
function Crate({ position }) {
    return (
        <RigidBody colliders="cuboid" position={position} mass={6} linearDamping={0.2} angularDamping={0.3}>
            <mesh material={crateMat} castShadow receiveShadow><boxGeometry args={[1.1, 1.1, 1.1]} /></mesh>
            <Text font={FONT} fontSize={0.2} color={INK} position={[0, 0, 0.555]} letterSpacing={0.1}>PX-01</Text>
        </RigidBody>
    );
}

function Props() {
    const cones = useMemo(() => {
        const out = [];
        for (let i = 0; i < 8; i++) out.push([-26 + i * 4.2, 0, -12 + (i % 2) * 1.2]);      // slalom
        for (let i = 0; i < 6; i++) out.push([18 + (i % 3) * 1.4, 0, 14 + ((i / 3) | 0) * 1.4]);
        return out;
    }, []);
    const crates = useMemo(() => {
        const out = [];
        for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++) out.push([28 + (i + row / 2) * 1.15 - 2, 0.55 + row * 1.1, -6]);
        return out;
    }, []);
    return (
        <>
            <Ramp position={[-24, 0, 8]} yaw={0} />
            <Ramp position={[30, 0, 10]} yaw={Math.PI} />
            {cones.map((p, i) => <Cone key={i} position={p} />)}
            {crates.map((p, i) => <Crate key={i} position={p} />)}
        </>
    );
}

// ── the plinth + the giant PX-01 in the infield ─────────────────────────────────────────────
function Plinth() {
    return (
        <>
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[PLINTH.w / 2, 1, PLINTH.d / 2]} position={[0, -1, 0]} />
                <mesh position={[0, -1.5, 0]} receiveShadow><boxGeometry args={[PLINTH.w, 3, PLINTH.d]} /><meshStandardMaterial color={FLOOR} roughness={0.92} /></mesh>
            </RigidBody>
            {/* painted floor grid, every 10 m */}
            <gridHelper args={[PLINTH.w - 4, (PLINTH.w - 4) / 10, "#bdb7aa", "#c7c1b5"]} position={[0, 0.004, 0]} scale={[1, 1, PLINTH.d / PLINTH.w]} />
            <RigidBody type="fixed" colliders={false} position={[0, 0, -2]}>
                <CuboidCollider args={[6.2, 8, 3.6]} position={[0, 8, 0]} />
                <Machine scale={4.2} position={[0, 7.5, 0]} />
                <mesh position={[0, 0.2, 0]} receiveShadow castShadow><boxGeometry args={[14, 0.4, 8]} /><meshStandardMaterial color={INK} roughness={0.5} metalness={0.3} /></mesh>
            </RigidBody>
            <Text font={FONT} fontSize={2.2} color={INK} position={[0, 0.03, 6.2]} rotation={[-Math.PI / 2, 0, 0]} letterSpacing={0.08}>AMAN PATEL · TEST TRACK</Text>
        </>
    );
}

function Scene({ input, api, onNear, onSpeed, tier = "HIGH" }) {
    const light = useRef();
    const high = tier === "HIGH", low = tier === "LOW";
    return (
        <>
            <color attach="background" args={[VOID]} />
            <fog attach="fog" args={[VOID, 70, 190]} />
            <hemisphereLight args={["#fff1dc", "#4a4239", 0.35]} />
            <directionalLight ref={light} color="#ffd8a8" intensity={1.9} castShadow={!low}
                shadow-mapSize={[high ? 2048 : 1024, high ? 2048 : 1024]} shadow-bias={-0.0004} shadow-normalBias={0.04}
                shadow-camera-left={-48} shadow-camera-right={48} shadow-camera-top={48} shadow-camera-bottom={-48} shadow-camera-far={120} />
            <Environment resolution={128} frames={1} environmentIntensity={0.45}>
                <Lightformer form="rect" intensity={3} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[20, 8, 1]} />
                <Lightformer form="rect" intensity={2} position={[-10, 3, 6]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color="#ffd2a0" />
                <Lightformer form="rect" intensity={1.2} position={[10, 2, -6]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
            </Environment>

            <Physics gravity={[0, -14, 0]} timeStep="vary">
                <Plinth />
                <Track />
                {STOPS.map((s) => <TicketSlot key={s.i} stop={s} />)}
                <Props />
                <Car input={input} api={api} onNear={onNear} onSpeed={onSpeed} light={light} />
            </Physics>

            {!low && (
                <EffectComposer multisampling={high ? 4 : 0}>
                    <TiltShift2 blur={high ? 0.22 : 0.16} taper={0.6} start={[0.5, 0.0]} end={[0.5, 1.0]} samples={high ? 10 : 6} />
                    <Bloom intensity={0.35} luminanceThreshold={0.92} mipmapBlur />
                    <Vignette offset={0.25} darkness={0.55} />
                </EffectComposer>
            )}
        </>
    );
}

// tickets light up (lift) when the car is next to them; the active index lives on a tiny store so only 2 boards re-render
const activeStore = { i: -1, subs: new Set() };
export const setActiveTicket = (i) => { activeStore.i = i; activeStore.subs.forEach((f) => f()); };
function TicketSlot({ stop }) {
    const [active, setActive] = useState(false);
    useEffect(() => { const f = () => setActive(activeStore.i === stop.i); activeStore.subs.add(f); return () => activeStore.subs.delete(f); }, [stop.i]);
    return <Ticket stop={stop} active={active} />;
}

export default memo(Scene);
