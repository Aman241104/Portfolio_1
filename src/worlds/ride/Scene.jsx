import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Text } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CylinderCollider, useRapier } from "@react-three/rapier";
import { EffectComposer, Bloom, TiltShift2, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { shot } from "../../../content/work.js";
import { Machine } from "../../machine/MachineModel.jsx";
import { CURVE, ROAD_W, PLINTH, STOPS, SECTORS, SPAWN, START_T, onTrack, standoff, trackT } from "./track.js";

// RIDE: a classic coupe on the PX-01 test track, shot like a miniature — high camera, long lens, tilt-shift,
// one warm key light with soft shadows. Physics: Rapier raycast vehicle (real suspension, grip, drift) plus
// cones and crates you can knock about. Projects are printed tickets standing around the circuit.
const FONT = "/fonts/Geist-800.ttf";
const VOID = "#0b0b0d", FLOOR = "#b8b2a6", INK = "#141416", SIGNAL = "#ff2e1f", BONE = "#edeae3";

// ── car tuning (chassis forward = +X, axle = Z) ────────────────────────────────────────────
const WHEELS = [[1.32, 0.86], [1.32, -0.86], [-1.3, 0.86], [-1.3, -0.86]];   // [x, z]: front L/R, rear L/R
const WHEEL_R = 0.38, REST = 0.32, MASS = 150, ENGINE = 560, BRAKE = 7, STEER = 0.55, TOP = 27;   // TOP m/s ≈ 97 km/h: fast for the plinth, still stoppable at a ticket

const paint = new THREE.MeshPhysicalMaterial({ color: "#17181c", metalness: 0.4, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.06 });   // graphite: chamfers catch the key light
const stripe = new THREE.MeshPhysicalMaterial({ color: SIGNAL, roughness: 0.35, clearcoat: 1 });
const chrome = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.12 });
const glass = new THREE.MeshPhysicalMaterial({ color: "#6d7f8c", metalness: 0.6, roughness: 0.06, opacity: 0.92, transparent: true, clearcoat: 1 });   // reads apart from the body
const rubber = new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.92 });
const lampOn = new THREE.MeshBasicMaterial({ color: "#fff3d6", toneMapped: false });
const tailOn = new THREE.MeshBasicMaterial({ color: "#7a1810", toneMapped: false });   // flares on braking (Car)
const TAIL_DIM = new THREE.Color("#7a1810"), TAIL_LIT = new THREE.Color("#ff3b2a").multiplyScalar(1.6);

// fastback cabin: side profile extruded across the car (windscreen rake at the front, long sloping rear)
const cabinGeo = (() => {
    const s = new THREE.Shape();
    s.moveTo(-1.6, 0); s.lineTo(0.66, 0); s.lineTo(0.14, 0.46); s.lineTo(-0.92, 0.46); s.lineTo(-1.6, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.44, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3, curveSegments: 2 });
    g.translate(0, 0, -0.72); return g;
})();
const grilleMat = new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.6, metalness: 0.4 });

function Coupe() {
    // ~4.3 m long; the group origin is the chassis collider centre. Body sits between the wheels; arches carry over them.
    return (
        <group position={[0, -0.12, 0]}>
            <RoundedBox args={[4.3, 0.52, 1.66]} radius={0.2} smoothness={4} material={paint} castShadow position={[0, 0.05, 0]} />
            {WHEELS.map(([x, z]) => (
                <RoundedBox key={`${x}${z}`} args={[1.12, 0.42, 0.3]} radius={0.14} smoothness={3} material={paint} castShadow position={[x, 0.1, z * 1.02]} />
            ))}
            <mesh geometry={cabinGeo} material={glass} position={[0, 0.3, 0]} castShadow />
            <mesh material={paint} position={[-0.39, 0.775, 0]} castShadow><boxGeometry args={[1.02, 0.05, 1.46]} /></mesh>
            {/* hood bulge between the stripes, ducktail on the deck */}
            <RoundedBox args={[1.3, 0.08, 0.2]} radius={0.03} smoothness={2} material={paint} position={[1.25, 0.34, 0]} />
            <mesh material={paint} position={[-2.02, 0.36, 0]} rotation={[0, 0, -0.25]} castShadow><boxGeometry args={[0.3, 0.05, 1.5]} /></mesh>
            {/* racing stripes over hood, roof and deck */}
            {[-0.2, 0.2].map((z) => (
                <group key={z}>
                    <mesh material={stripe} position={[1.22, 0.315, z]}><boxGeometry args={[1.85, 0.012, 0.15]} /></mesh>
                    <mesh material={stripe} position={[-0.39, 0.803, z]}><boxGeometry args={[1.0, 0.012, 0.15]} /></mesh>
                    <mesh material={stripe} position={[-1.78, 0.315, z]}><boxGeometry args={[0.55, 0.012, 0.15]} /></mesh>
                </group>
            ))}
            {/* grille, chrome bumpers, exhaust */}
            <mesh material={grilleMat} position={[2.151, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.8, 0.18]} /></mesh>
            {[2.18, -2.18].map((x) => (
                <mesh key={x} material={chrome} position={[x, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.065, 1.5, 4, 10]} /></mesh>
            ))}
            {[-0.45, -0.3].map((z) => (
                <mesh key={z} material={chrome} position={[-2.2, -0.22, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.045, 0.045, 0.2, 10]} /></mesh>
            ))}
            {/* round headlights + tail lights, wing mirrors */}
            {[-0.58, 0.58].map((z) => (
                <group key={z}>
                    <mesh material={chrome} position={[2.13, 0.09, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.16, 0.16, 0.06, 20]} /></mesh>
                    <mesh material={lampOn} position={[2.165, 0.09, z]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.12, 20]} /></mesh>
                    <mesh material={tailOn} position={[-2.152, 0.12, z]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.32, 0.1]} /></mesh>
                    <mesh material={chrome} position={[0.55, 0.42, z * 1.42]}><boxGeometry args={[0.1, 0.07, 0.12]} /></mesh>
                </group>
            ))}
            <Text font={FONT} fontSize={0.14} color={BONE} position={[-2.153, -0.06, 0]} rotation={[0, -Math.PI / 2, 0]} letterSpacing={0.12}>PX-01</Text>
        </group>
    );
}

function Wheel() {
    return (
        <group>
            <mesh material={rubber} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.3, 24]} /></mesh>
            <mesh material={chrome} position={[0, 0, 0.152]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.01, 20]} /></mesh>
            <mesh material={chrome} position={[0, 0, -0.152]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.01, 20]} /></mesh>
        </group>
    );
}

const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _fwd = new THREE.Vector3(), _look = new THREE.Vector3(), _cam = new THREE.Vector3(), _off = new THREE.Vector3(), _aim = new THREE.Vector3(SPAWN.x, 0.6, SPAWN.z);
const CAM_OFF = new THREE.Vector3(-24, 33, 38);                  // fixed world-space angle: diorama, never spins with the car

function Headlights() {
    const targets = useMemo(() => [-0.58, 0.58].map((z) => { const o = new THREE.Object3D(); o.position.set(20, -1.2, z * 3); return o; }), []);
    return (
        <group position={[2.1, 0, 0]}>
            {targets.map((o, i) => (
                <group key={i}>
                    <primitive object={o} />
                    <spotLight position={[0, 0, i ? 0.58 : -0.58]} target={o} color="#fff1d6" intensity={160} distance={48} angle={0.42} penumbra={0.65} decay={1.6} />
                </group>
            ))}
        </group>
    );
}

function Car({ input, api, onNear, onTick, onLap, light, started, shadow, night }) {
    const body = useRef(), wheels = useRef([]);
    const { world } = useRapier();
    const ctrl = useRef(null);
    const camera = useThree((s) => s.camera);
    const nearRef = useRef(-1);
    const steer = useRef(0);
    const lap = useRef({ t: -1, lastU: 0, running: false, t0: 0, prog: 0 });

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
            vc.setWheelFrictionSlip(i, i < 2 ? 2.4 : 1.9);
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
            home: () => { place(SPAWN.x, SPAWN.z, SPAWN.yaw); lap.current = { t: -1, lastU: 0, running: false, t0: 0, prog: 0 }; },
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
            if (!isFront) vc.setWheelFrictionSlip(i, k.brake ? 0.8 : 1.9);  // handbrake: rear lets go → drift
        }
        vc.updateVehicle(dt);
        tailOn.color.copy(braking || k.brake || (fwd < 0 && Math.abs(speed) < 1) ? TAIL_LIT : TAIL_DIM);

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

        // sideways slip (m/s): the car's velocity along its own right axis → squeal, skid marks, dust
        const r = b.rotation(), lv = b.linvel();
        _q.set(r.x, r.y, r.z, r.w);
        _v.set(0, 0, 1).applyQuaternion(_q);
        const slip = Math.abs(lv.x * _v.x + lv.z * _v.z);
        const skidding = (slip > 2.6 || (k.brake && Math.abs(speed) > 4) || (braking && Math.abs(speed) > 9));
        if (skidding && fx.mark) {
            for (const i of [2, 3]) {
                if (!vc.wheelIsInContact(i)) continue;
                const c = vc.wheelContactPoint(i);
                if (c) { fx.mark(i, c.x, c.z); if (Math.random() < 0.35) fx.puff(c.x, c.z); }
            }
        }

        // laps: progress only accrues in small forward steps *on the road*, so infield shortcuts and reversing don't
        // count; a lap is crossing the line forwards with ≥ 90% of the loop driven since the last crossing.
        const L = lap.current, tr = trackT(p.x, p.z, L.t), now = performance.now();
        if (tr.dist < ROAD_W * 1.5) {
            const u = (tr.t - START_T + 1) % 1;
            let d = u - L.lastU; if (d > 0.5) d -= 1; else if (d < -0.5) d += 1;
            if (L.t >= 0 && Math.abs(d) < 0.03) L.prog += d;
            if (L.t >= 0 && L.lastU > 0.85 && u < 0.15) {
                if (L.running && L.prog > 0.9) onLap((now - L.t0) / 1000);
                L.running = true; L.t0 = now; L.prog = 0;
            }
            L.lastU = u; L.t = tr.t;
        } else L.t = -1;                                                  // off the road: search the whole loop next frame

        // camera: fixed diorama angle, eased; pulls back a touch with speed
        // portrait sees less width; before the start the shot opens wider so the PX-01 and the track read first
        const pull = (camera.aspect < 1 ? 1.5 : 1) * (started ? 1 + Math.min(0.25, Math.abs(speed) / 120) : 1.3);
        const ax = THREE.MathUtils.clamp(lv.x * 0.28, -6, 6), az = THREE.MathUtils.clamp(lv.z * 0.28, -6, 6);   // look ahead of the nose
        _look.set(p.x + ax, 0.6, p.z + az);
        _aim.lerp(_look, 1 - Math.exp(-dt * 5));
        _off.copy(CAM_OFF).multiplyScalar(pull);
        _cam.copy(_aim).add(_off);
        camera.position.lerp(_cam, 1 - Math.exp(-dt * 3.2));
        camera.lookAt(_v.copy(camera.position).sub(_off));
        // soft contact shadow: stays on the floor, fades as the car leaves it
        if (shadow.current) {
            shadow.current.position.set(p.x, 0.04, p.z);
            shadow.current.rotation.z = Math.atan2(-(_fwd.set(1, 0, 0).applyQuaternion(_q)).z, _fwd.x);
            shadow.current.material.opacity = 0.5 * THREE.MathUtils.clamp(1.6 - p.y, 0, 1);
        }

        // key light + shadow frustum ride along with the car
        if (light.current) { light.current.position.set(p.x - 26, 42, p.z + 18); light.current.target.position.set(p.x, 0, p.z); light.current.target.updateMatrixWorld(); }

        // nearest ticket board → card
        let best = -1, bd = 9.5 * 9.5;
        for (const s of STOPS) { const d = (s.x - p.x) ** 2 + (s.z - p.z) ** 2; if (d < bd) { bd = d; best = s.i; } }
        if (best !== nearRef.current) { nearRef.current = best; onNear(best); }
        onTick(speed, Math.max(0, fwd), slip, L.running ? (now - L.t0) / 1000 : null);
    });

    return (
        <RigidBody ref={body} colliders={false} position={[SPAWN.x, 1.2, SPAWN.z]} rotation={[0, SPAWN.yaw, 0]} canSleep={false} linearDamping={0.05} angularDamping={0.6}>
            <CuboidCollider args={[2.1, 0.3, 0.9]} position={[0, 0.05, 0]} mass={MASS} />
            <CuboidCollider args={[1.0, 0.25, 0.8]} position={[-0.35, 0.55, 0]} mass={0} />
            <Coupe />
            {night && <Headlights />}
            {WHEELS.map(([x, z], i) => (
                <group key={i} ref={(el) => (wheels.current[i] = el)} position={[x, -0.12 - REST, z]}>
                    <Wheel />
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
            for (const s of [-1, 1]) pos.push(f.x + f.nx * s * ROAD_W / 2, 0.03, f.z + f.nz * s * ROAD_W / 2);
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
    const start = onTrack(START_T);
    return (
        <group>
            <mesh geometry={road} receiveShadow><meshStandardMaterial color="#2b2a2a" roughness={0.88} /></mesh>
            <instancedMesh ref={red} args={[null, null, n]} receiveShadow castShadow><boxGeometry args={[1.6, 0.1, 0.7]} /><meshStandardMaterial color={SIGNAL} roughness={0.6} /></instancedMesh>
            <instancedMesh ref={white} args={[null, null, n]} receiveShadow castShadow><boxGeometry args={[1.6, 0.1, 0.7]} /><meshStandardMaterial color="#f2efe8" roughness={0.6} /></instancedMesh>
            {/* chequered start line */}
            <group position={[start.x, 0.04, start.z]} rotation={[0, Math.atan2(-start.tz, start.tx), 0]}>
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
                    <group key={s.kind} position={[f.x, 0.045, f.z]} rotation={[-Math.PI / 2, 0, yaw]}>
                        <Text font={FONT} fontSize={1.5} color={BONE} anchorX="center" anchorY="middle" letterSpacing={0.04}>{s.label.toUpperCase()}</Text>
                        <Text font={FONT} fontSize={0.55} color={SIGNAL} anchorX="center" anchorY="middle" position={[0, 1.35, 0]} letterSpacing={0.2}>{`OUTPUT ${s.n} · ${s.count} TICKETS`}</Text>
                    </group>
                );
            })}
        </group>
    );
}

// ── tickets: one standing thermal-paper slab per project, its face printed onto one canvas texture ──────────
// (one texture + two quads per ticket instead of ~10 text meshes per side: 44 tickets stay cheap on phones)
const paperMat = new THREE.MeshStandardMaterial({ color: "#fbfaf6", roughness: 0.78 });
const TW = 256, TH = 424;                                         // canvas units; the ticket is 3.2 × 5.3 m
const fontsReady = typeof document !== "undefined" ? document.fonts.load('800 20px "Archivo"').catch(() => {}) : Promise.resolve();

function wrap(g, text, x, y, maxW, lh, maxLines) {
    const words = text.split(/\s+/); let line = "", n = 0;
    for (let i = 0; i < words.length; i++) {
        const test = line ? `${line} ${words[i]}` : words[i];
        if (g.measureText(test).width > maxW && line) {
            if (++n === maxLines) { g.fillText(`${line}…`, x, y); return y + lh; }
            g.fillText(line, x, y); y += lh; line = words[i];
        } else line = test;
    }
    if (line) { g.fillText(line, x, y); y += lh; }
    return y;
}

function printTicket(canvas, s, img) {
    const g = canvas.getContext("2d"), k = canvas.width / TW;
    g.setTransform(k, 0, 0, k, 0, 0);
    g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, TW, TH);
    g.fillStyle = SIGNAL; g.font = '600 10px "Geist Mono", ui-monospace, monospace';
    g.fillText(`№ ${String(s.i + 1).padStart(2, "0")} · ${s.kind.toUpperCase()}`, 14, 22);
    g.fillStyle = "#d9d5cc"; g.fillRect(14, 30, 228, 143);
    if (img) {                                                     // cover-fit, top-aligned like the site's thumbnails
        const sc = Math.max(228 / img.width, 143 / img.height);
        g.save(); g.beginPath(); g.rect(14, 30, 228, 143); g.clip();
        g.drawImage(img, 14 + (228 - img.width * sc) / 2, 30, img.width * sc, img.height * sc); g.restore();
    }
    g.fillStyle = INK; g.font = '800 23px "Archivo", "Geist", system-ui, sans-serif';
    let y = wrap(g, s.title.toUpperCase(), 14, 205, 228, 24, 3);
    g.fillStyle = "#64615b"; g.font = '400 11.5px "Geist", system-ui, sans-serif';
    wrap(g, s.w.line, 14, y + 6, 228, 15, 4);
    // status stamp
    const live = s.status === "Live";
    g.save(); g.translate(186, 352); g.rotate(-0.12);
    g.strokeStyle = g.fillStyle = live ? SIGNAL : "#64615b"; g.lineWidth = 2; g.strokeRect(-36, -14, 72, 24);
    g.font = '700 12px "Geist Mono", ui-monospace, monospace'; g.textAlign = "center"; g.fillText(s.status.toUpperCase(), 0, 3); g.restore();
    // barcode from the slug
    g.fillStyle = INK; let x = 14, h = 0;
    for (const ch of s.w.slug.repeat(4)) { h = (h * 31 + ch.charCodeAt(0)) >>> 0; const w = 1 + (h % 3); if (x + w > 150) break; if (h % 5) g.fillRect(x, 378, w, 32); x += w + 1 + ((h >> 3) % 2); }
    g.fillStyle = "#64615b"; g.font = '400 8px "Geist Mono", ui-monospace, monospace'; g.fillText(s.w.slug.toUpperCase().slice(0, 26), 14, 418);
}

const LOAD_RANK = new Map(STOPS.map((s) => [s.i, Math.hypot(s.x - SPAWN.x, s.z - SPAWN.z)]).sort((a, b) => a[1] - b[1]).map(([i], r) => [i, r]));

function Ticket({ stop, active, res = 1, night }) {
    const tex = useMemo(() => {
        const c = document.createElement("canvas"); c.width = TW * res; c.height = TH * res;
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
    }, [res]);
    useEffect(() => {
        let alive = true;
        fontsReady.then(() => { if (!alive) return; printTicket(tex.image, stop); tex.needsUpdate = true; });
        const img = new Image(); img.crossOrigin = "anonymous"; img.decoding = "async";
        img.onload = () => fontsReady.then(() => { if (!alive) return; printTicket(tex.image, stop, img); tex.needsUpdate = true; });
        const later = setTimeout(() => { img.src = shot(stop.w, 360 * res); }, LOAD_RANK.get(stop.i) * 110);   // ~5 s, nearest first
        return () => { alive = false; clearTimeout(later); img.onload = null; tex.dispose(); };
    }, [stop, tex, res]);
    const lift = useRef();
    useFrame((_, dt) => { if (lift.current) lift.current.position.y += ((active ? 0.35 : 0) - lift.current.position.y) * (1 - Math.exp(-dt * 6)); });
    return (
        <RigidBody type="fixed" colliders={false} position={[stop.x, 0, stop.z]} rotation={[0, stop.face, 0]}>
            <CuboidCollider args={[1.7, 2.8, 0.12]} position={[0, 2.8, 0]} />
            <group ref={lift}>
                <mesh material={paperMat} position={[0, 2.85, 0]} castShadow receiveShadow><boxGeometry args={[3.2, 5.3, 0.1]} /></mesh>
                {[0, Math.PI].map((r) => (
                    <group key={r} rotation={[0, r, 0]} position={[0, 2.85, 0]}>
                        <mesh position={[0, 0, 0.052]}>
                            <planeGeometry args={[3.2, 5.3]} />
                            <meshStandardMaterial map={tex} roughness={0.8} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={night ? 0.5 : 0} />
                        </mesh>
                    </group>
                ))}
                <mesh material={chrome} position={[0, 0.12, -0.02]} castShadow><boxGeometry args={[1.2, 0.24, 0.6]} /></mesh>
            </group>
        </RigidBody>
    );
}

// ── skid marks + dust: ring buffers, one instanced draw each ─────────────────────────────────
const fx = { mark: null, puff: null };
const MARKS = 900, PUFFS = 48;
function Skids() {
    const marks = useRef(), puffs = useRef(), life = useRef(new Float32Array(PUFFS));
    const pos = useRef(new Float32Array(PUFFS * 2));
    useEffect(() => {
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();
        let mi = 0, pi = 0;
        const last = {};                                               // per wheel: each draws its own ribbon
        const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
        for (let i = 0; i < MARKS; i++) marks.current.setMatrixAt(i, hidden);
        for (let i = 0; i < PUFFS; i++) puffs.current.setMatrixAt(i, hidden);
        marks.current.instanceMatrix.needsUpdate = puffs.current.instanceMatrix.needsUpdate = true;
        fx.mark = (w, x, z) => {
            const l = last[w], now = performance.now();
            last[w] = { x, z, at: now };
            if (!l || now - l.at > 120) return;                        // first contact of a new skid: start the ribbon here
            const dx = x - l.x, dz = z - l.z, len = Math.hypot(dx, dz);
            if (len < 0.15) { last[w] = l; return; }
            // one quad spanning from the previous contact to this one → a continuous strip
            m.compose(v.set((x + l.x) / 2, 0.036, (z + l.z) / 2), q.setFromEuler(e.set(-Math.PI / 2, 0, Math.atan2(-dz, dx), "YXZ")), sc.set(len + 0.06, 1, 1));
            marks.current.setMatrixAt(mi, m); mi = (mi + 1) % MARKS;
            marks.current.instanceMatrix.needsUpdate = true;
        };
        fx.puff = (x, z) => { life.current[pi] = 1; pos.current[pi * 2] = x; pos.current[pi * 2 + 1] = z; pi = (pi + 1) % PUFFS; };
        return () => { fx.mark = fx.puff = null; };
    }, []);
    const m = useMemo(() => new THREE.Matrix4(), []), v = useMemo(() => new THREE.Vector3(), []), s = useMemo(() => new THREE.Vector3(), []), q = useMemo(() => new THREE.Quaternion(), []);
    useFrame((_, dt) => {
        const L = life.current; let any = false;
        for (let i = 0; i < PUFFS; i++) {
            if (L[i] <= 0) continue;
            L[i] = Math.max(0, L[i] - dt * 1.4); any = true;
            const a = 1 - L[i], k = L[i] > 0 ? 0.3 + a * 1.3 : 0;
            m.compose(v.set(pos.current[i * 2], 0.25 + a * 0.9, pos.current[i * 2 + 1]), q, s.set(k, k * 0.7, k));
            puffs.current.setMatrixAt(i, m);
        }
        if (any) puffs.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <>
            <instancedMesh ref={marks} args={[null, null, MARKS]} frustumCulled={false}>
                <planeGeometry args={[1, 0.22]} />   {/* unit length, scaled per segment */}
                <meshBasicMaterial color="#111111" transparent opacity={0.4} depthWrite={false} />
            </instancedMesh>
            <instancedMesh ref={puffs} args={[null, null, PUFFS]} frustumCulled={false}>
                <icosahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial color="#e8e2d6" roughness={1} transparent opacity={0.45} depthWrite={false} />
            </instancedMesh>
        </>
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
function Plinth({ night }) {
    return (
        <>
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[PLINTH.w / 2, 1, PLINTH.d / 2]} position={[0, -1, 0]} />
                <mesh position={[0, -1.5, 0]} receiveShadow><boxGeometry args={[PLINTH.w, 3, PLINTH.d]} /><meshStandardMaterial color={FLOOR} roughness={0.92} /></mesh>
            </RigidBody>
            {/* painted floor grid, every 10 m */}
            {/* grid lines are unlit: give night its own dim colours (key remounts the helper) */}
            <gridHelper key={night ? "n" : "d"} args={[PLINTH.w - 4, (PLINTH.w - 4) / 10, night ? "#2a2a30" : "#bdb7aa", night ? "#222228" : "#c7c1b5"]} position={[0, 0.004, 0]} scale={[1, 1, PLINTH.d / PLINTH.w]} />
            <RigidBody type="fixed" colliders={false} position={[0, 0, -2]}>
                <CuboidCollider args={[6.2, 8, 3.6]} position={[0, 8, 0]} />
                <Machine scale={4.2} position={[0, 7.5, 0]} />
                <mesh position={[0, 0.2, 0]} receiveShadow castShadow><boxGeometry args={[14, 0.4, 8]} /><meshStandardMaterial color={INK} roughness={0.5} metalness={0.3} /></mesh>
            </RigidBody>
            <Text font={FONT} fontSize={2.2} color={INK} position={[0, 0.03, 6.2]} rotation={[-Math.PI / 2, 0, 0]} letterSpacing={0.08}>AMAN PATEL · TEST TRACK</Text>
        </>
    );
}

// soft radial blob under the car (grounds it where the shadow map is soft)
const blobTex = (() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    r.addColorStop(0, "rgba(0,0,0,1)"); r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
})();

// a black pylon on the shoulder where each sector begins: big sector number, red cap
function SectorMarker({ s, night }) {
    const f = onTrack(s.t), off = ROAD_W / 2 + 4.2;
    return (
        <RigidBody type="fixed" colliders="cuboid" position={[f.x + f.nx * off, 0, f.z + f.nz * off]} rotation={[0, Math.atan2(-f.nx, -f.nz), 0]}>
            <mesh position={[0, 3.4, 0]} castShadow receiveShadow><boxGeometry args={[1.6, 6.8, 1.6]} /><meshStandardMaterial color={INK} roughness={0.45} metalness={0.2} /></mesh>
            <mesh position={[0, 6.9, 0]} castShadow><boxGeometry args={[1.64, 0.22, 1.64]} /><meshStandardMaterial color={SIGNAL} roughness={0.5} emissive={SIGNAL} emissiveIntensity={night ? 1.4 : 0} /></mesh>
            {[0, Math.PI].map((r) => (
                <group key={r} rotation={[0, r, 0]}>
                    <Text font={FONT} fontSize={1.3} color={BONE} position={[0, 5.2, 0.81]} anchorY="middle">{s.n}</Text>
                    <Text font={FONT} fontSize={0.2} color={BONE} position={[0, 4.15, 0.81]} maxWidth={1.4} textAlign="center" anchorY="top" letterSpacing={0.08}>{s.label.toUpperCase()}</Text>
                </group>
            ))}
        </RigidBody>
    );
}

function Scene({ input, api, onNear, onTick, onLap, started, night = false, tier = "HIGH" }) {
    const light = useRef(), shadow = useRef();
    const high = tier === "HIGH", low = tier === "LOW";
    return (
        <>
            <color attach="background" args={[night ? "#040406" : VOID]} />
            <fog attach="fog" args={[night ? "#040406" : VOID, night ? 50 : 70, night ? 150 : 190]} />
            <hemisphereLight args={night ? ["#7d8cb0", "#0b0b10", 0.12] : ["#fff1dc", "#4a4239", 0.35]} />
            <directionalLight ref={light} color={night ? "#8ea4d8" : "#ffd8a8"} intensity={night ? 0.22 : 1.9} castShadow={!low}
                shadow-mapSize={[high ? 2048 : 1024, high ? 2048 : 1024]} shadow-bias={-0.0004} shadow-normalBias={0.04}
                shadow-camera-left={-48} shadow-camera-right={48} shadow-camera-top={48} shadow-camera-bottom={-48} shadow-camera-far={120} />
            <Environment resolution={128} frames={1} environmentIntensity={night ? 0.07 : 0.45}>
                <Lightformer form="rect" intensity={3} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[20, 8, 1]} />
                <Lightformer form="rect" intensity={2} position={[-10, 3, 6]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color="#ffd2a0" />
                <Lightformer form="rect" intensity={1.2} position={[10, 2, -6]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
            </Environment>

            <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[SPAWN.x, 0.04, SPAWN.z]}>
                <planeGeometry args={[5.2, 2.6]} />
                <meshBasicMaterial map={blobTex} transparent opacity={0.5} depthWrite={false} toneMapped={false} />
            </mesh>
            <Physics gravity={[0, -14, 0]} timeStep="vary">
                <Plinth night={night} />
                <Track />
                {STOPS.map((s) => <TicketSlot key={s.i} stop={s} res={high ? 1.25 : 1} night={night} />)}
                <Props />
                <Car input={input} api={api} onNear={onNear} onTick={onTick} onLap={onLap} light={light} started={started} shadow={shadow} night={night} />
                {SECTORS.map((s) => <SectorMarker key={s.kind} s={s} night={night} />)}
                <Skids />
            </Physics>

            {high && (
                <EffectComposer multisampling={4}>
                    <TiltShift2 blur={0.16} taper={0.5} start={[0, 0.5]} end={[1, 0.5]} samples={10} />
                    <Bloom intensity={0.35} luminanceThreshold={0.92} mipmapBlur />
                    <Vignette offset={0.25} darkness={0.55} />
                </EffectComposer>
            )}
            {!high && !low && (
                <EffectComposer multisampling={0}>
                    <TiltShift2 blur={0.12} taper={0.5} start={[0, 0.5]} end={[1, 0.5]} samples={6} />
                    <Vignette offset={0.25} darkness={0.55} />
                </EffectComposer>
            )}
        </>
    );
}

// tickets light up (lift) when the car is next to them; the active index lives on a tiny store so only 2 boards re-render
const activeStore = { i: -1, subs: new Set() };
export const setActiveTicket = (i) => { activeStore.i = i; activeStore.subs.forEach((f) => f()); };
function TicketSlot({ stop, res, night }) {
    const [active, setActive] = useState(false);
    useEffect(() => { const f = () => setActive(activeStore.i === stop.i); activeStore.subs.add(f); return () => activeStore.subs.delete(f); }, [stop.i]);
    return <Ticket stop={stop} active={active} res={res} night={night} />;
}

export default memo(Scene);
