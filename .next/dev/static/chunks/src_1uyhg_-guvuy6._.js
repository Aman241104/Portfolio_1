(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lab/Machine3D.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Machine3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-e51d7528.esm.js [app-client] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__e__as__extend$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-e51d7528.esm.js [app-client] (ecmascript) <export e as extend>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Environment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Environment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Lightformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Lightformer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/RoundedBox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/ContactShadows.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Gltf.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Texture.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Cloud.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Sky$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Sky.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$objects$2f$Water$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/objects/Water.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/postprocessing/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/worlds/registry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/storage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lab$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lab/audio.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature(), _s15 = __turbopack_context__.k.signature(), _s16 = __turbopack_context__.k.signature(), _s17 = __turbopack_context__.k.signature(), _s18 = __turbopack_context__.k.signature(), _s19 = __turbopack_context__.k.signature(), _s20 = __turbopack_context__.k.signature(), _s21 = __turbopack_context__.k.signature(), _s22 = __turbopack_context__.k.signature(), _s23 = __turbopack_context__.k.signature(), _s24 = __turbopack_context__.k.signature(), _s25 = __turbopack_context__.k.signature(), _s26 = __turbopack_context__.k.signature(), _s27 = __turbopack_context__.k.signature(), _s28 = __turbopack_context__.k.signature(), _s29 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
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
const SUN = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-0.32, 0.035, -1).normalize();
// the sun sinks during the intro: everything that depends on it reads this vector every frame
const sunDir = SUN.clone();
const setSunElevation = (y)=>sunDir.set(-0.32, y, -1).normalize();
// lighter tier for phones / low-core laptops: fewer grass blades, no depth of field, lower DPR
const LITE = ("TURBOPACK compile-time value", "object") !== "undefined" && (window.matchMedia("(max-width: 768px)").matches || (navigator.hardwareConcurrency || 8) <= 4);
const PLINTH_H = 0.8;
const PLINTH_TOP = FLOOR + PLINTH_H;
const MACHINE_Y = PLINTH_TOP + 0.06 + 1.35;
/* ---------------------------------------------------------------- materials */ const mat = {
    // clear acrylic with a faint cool tint and hand-made smudge/scratch roughness, so it reads as glass, not CG
    shell: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: "#f4fbfb",
        roughness: 0.06,
        transmission: 1,
        thickness: 0.08,
        ior: 1.46,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: "#cfe9e6",
        attenuationDistance: 2.5,
        specularIntensity: 1
    }),
    // thick optical glass block: green edges, dispersion, smudges
    plinth: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: "#ffffff",
        roughness: 0.05,
        transmission: 1,
        thickness: 2.4,
        ior: 1.52,
        dispersion: 3,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        attenuationColor: "#7fc4b8",
        attenuationDistance: 3
    }),
    chrome: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: "#ffffff",
        metalness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.03
    }),
    brushed: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: "#c4c7cc",
        metalness: 1,
        roughness: 0.3,
        anisotropy: 0.9
    }),
    black: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: "#0d0d0f",
        metalness: 0.2,
        roughness: 0.55
    }),
    pcb: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: "#10140f",
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.6
    }),
    chip: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: "#151517",
        roughness: 0.35
    }),
    gold: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: "#d6a14a",
        metalness: 1,
        roughness: 0.25
    }),
    wire: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: WIRE,
        roughness: 0.35,
        clearcoat: 0.8,
        emissive: WIRE,
        emissiveIntensity: 0.15
    }),
    rubber: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: "#050506",
        roughness: 0.9
    }),
    knob: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: SIGNAL,
        roughness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.04
    })
};
/* ---------------------------------------------------------------- reels */ const SLOTS = 12;
const SLOT_ANGLE = Math.PI * 2 / SLOTS;
const SLOT_OFFSET = SLOT_ANGLE / 2;
// Cylinder UVs: u runs around the drum (vertical on screen once laid on its side), v along the axis.
const useReelTexture = (reel)=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useReelTexture.useMemo": ()=>{
            const labels = Array.from({
                length: SLOTS
            }, {
                "useReelTexture.useMemo.labels": (_, i)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"][i % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"].length].symbols[reel].toUpperCase()
            }["useReelTexture.useMemo.labels"]);
            const slot = 160;
            const c = document.createElement("canvas");
            c.width = slot * SLOTS;
            c.height = 512;
            const g = c.getContext("2d");
            g.fillStyle = BONE;
            g.fillRect(0, 0, c.width, c.height);
            labels.forEach({
                "useReelTexture.useMemo": (t, i)=>{
                    g.save();
                    g.translate(slot * i + slot / 2, c.height / 2);
                    g.rotate(Math.PI / 2);
                    g.fillStyle = "#0b0b0c";
                    g.font = "700 92px 'Geist Mono', ui-monospace, monospace";
                    g.textAlign = "center";
                    g.textBaseline = "middle";
                    g.fillText(t, 0, 0);
                    g.restore();
                    g.fillStyle = "rgba(0,0,0,.14)";
                    g.fillRect(slot * i, 0, 2, c.height);
                }
            }["useReelTexture.useMemo"]);
            const sharp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
            sharp.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            sharp.anisotropy = 8;
            // motion-blurred copy: the strip smeared along the direction of travel (u = around the drum)
            const b = document.createElement("canvas");
            b.width = c.width;
            b.height = c.height;
            const bg = b.getContext("2d");
            bg.fillStyle = BONE;
            bg.fillRect(0, 0, b.width, b.height);
            for(let k = -8; k <= 8; k++){
                bg.globalAlpha = 0.09;
                bg.drawImage(c, k * 9, 0);
            }
            const blur = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](b);
            blur.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            blur.anisotropy = 8;
            return {
                sharp,
                blur
            };
        }
    }["useReelTexture.useMemo"], [
        reel
    ]);
};
_s(useReelTexture, "nwk+m61qLgjDVUp4IGV/072DDN4=");
// Slot k on the payline ⇔ drum angle SLOT_OFFSET + k·SLOT_ANGLE. A spin carries the drum forward several
// whole turns and eases into the target world's slot, each reel later than the last.
const REEL_DIR = 1;
const easeOutBack = (t, s = 0.9)=>1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const reelDuration = (index)=>1.5 + index * 0.5;
const Reel = ({ index, x, spin })=>{
    _s1();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const { sharp, blur } = useReelTexture(index);
    const drum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const anim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // { from, to, start, dur }
    const lastSlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Reel.useFrame": ({ clock })=>{
            const r = ref.current.rotation;
            if (spin && anim.current?.id !== spin.id) {
                const target = SLOT_OFFSET + REEL_DIR * spin.world * SLOT_ANGLE;
                const turns = (3 + index) * Math.PI * 2;
                const delta = ((target - r.x) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
                anim.current = {
                    id: spin.id,
                    from: r.x,
                    to: r.x + turns + delta,
                    start: clock.elapsedTime,
                    dur: reelDuration(index)
                };
            }
            let speed = 0;
            const a = anim.current;
            if (a) {
                const t = Math.min((clock.elapsedTime - a.start) / a.dur, 1);
                const prev = r.x;
                r.x = a.from + (a.to - a.from) * easeOutBack(t);
                speed = Math.abs(r.x - prev) * 60;
                const slot = Math.floor(r.x / SLOT_ANGLE);
                if (slot !== lastSlot.current) {
                    lastSlot.current = slot;
                    if (speed > 0.5) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lab$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].click(1200 + speed * 60, 0.06, 0.02);
                }
            }
            drum.current.map = speed > 5 ? blur : sharp;
        }
    }["Reel.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            x,
            0.42,
            0.25
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: ref,
                rotation: [
                    SLOT_OFFSET,
                    0,
                    Math.PI / 2
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.55,
                            0.55,
                            0.78,
                            64,
                            1,
                            true
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 126,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ref: drum,
                        map: sharp,
                        roughness: 0.45,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 127,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 125,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            [
                -0.4,
                0.4
            ].map((dx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        dx,
                        0,
                        0
                    ],
                    rotation: [
                        0,
                        0,
                        Math.PI / 2
                    ],
                    material: mat.chrome,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.56,
                            0.56,
                            0.02,
                            64
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 132,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, dx, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 131,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 124,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(Reel, "YwW3HgqKLvdda86y5R6qKSMm9xk=", false, function() {
    return [
        useReelTexture,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c = Reel;
/* ---------------------------------------------------------------- internals (seen through the glass) */ const Tube = ({ points, radius = 0.018, material = mat.wire })=>{
    _s2();
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Tube.useMemo[geo]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"](points.map({
                "Tube.useMemo[geo]": (p)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...p)
            }["Tube.useMemo[geo]"])), 64, radius, 10, false)
    }["Tube.useMemo[geo]"], [
        points,
        radius
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        material: material
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 143,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(Tube, "piii1S6cZ4PIVk7/qHfg4oHu94E=");
_c1 = Tube;
const Internals = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            [
                [
                    -1.45,
                    -0.65
                ],
                [
                    1.45,
                    -0.65
                ],
                [
                    -1.45,
                    0.62
                ],
                [
                    1.45,
                    0.62
                ]
            ].map(([x, z], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        x,
                        0,
                        z
                    ],
                    material: mat.chrome,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.03,
                            0.03,
                            2.3,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 150,
                        columnNumber: 70
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 150,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            [
                -1.05,
                1.05
            ].map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        y,
                        -0.65
                    ],
                    rotation: [
                        0,
                        0,
                        Math.PI / 2
                    ],
                    material: mat.chrome,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.025,
                            0.025,
                            2.9,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 153,
                        columnNumber: 105
                    }, ("TURBOPACK compile-time value", void 0))
                }, y, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 153,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.42,
                    -0.35
                ],
                material: mat.brushed,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                    args: [
                        2.8,
                        0.06,
                        0.5
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 156,
                    columnNumber: 66
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 156,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    -0.55,
                    -0.6
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            2.5,
                            0.85,
                            0.04
                        ],
                        radius: 0.015,
                        material: mat.pcb
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 160,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    [
                        [
                            -0.8,
                            0.12,
                            0.28,
                            0.28
                        ],
                        [
                            -0.35,
                            -0.1,
                            0.4,
                            0.22
                        ],
                        [
                            0.25,
                            0.15,
                            0.22,
                            0.22
                        ],
                        [
                            0.75,
                            -0.08,
                            0.36,
                            0.3
                        ],
                        [
                            0.2,
                            -0.22,
                            0.5,
                            0.12
                        ]
                    ].map(([x, y, w, h], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                x,
                                y,
                                0.035
                            ],
                            material: mat.chip,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    w,
                                    h,
                                    0.04
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 162,
                                columnNumber: 76
                            }, ("TURBOPACK compile-time value", void 0))
                        }, i, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 162,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))),
                    Array.from({
                        length: 14
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                -1.1 + i * 0.17,
                                0.36,
                                0.025
                            ],
                            material: mat.gold,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.06,
                                    0.05,
                                    0.01
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 165,
                                columnNumber: 93
                            }, ("TURBOPACK compile-time value", void 0))
                        }, i, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 165,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            1.05,
                            0.05,
                            0.08
                        ],
                        rotation: [
                            0,
                            0,
                            Math.PI / 2
                        ],
                        material: mat.brushed,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.11,
                                0.11,
                                0.45,
                                32
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 168,
                            columnNumber: 103
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 168,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 159,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0.75,
                    -0.6,
                    0.55
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        material: mat.black,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                            args: [
                                0.36,
                                0.22,
                                48,
                                1,
                                true
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 173,
                            columnNumber: 71
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 173,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0,
                            0.11
                        ],
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        material: mat.chrome,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                            args: [
                                0.37,
                                0.03,
                                16,
                                64
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 174,
                            columnNumber: 96
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 174,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0,
                            0.02
                        ],
                        material: mat.chrome,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.1,
                                32,
                                16,
                                0,
                                Math.PI * 2,
                                0,
                                Math.PI / 2
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 175,
                            columnNumber: 65
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 175,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 172,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tube, {
                points: [
                    [
                        -0.6,
                        -0.15,
                        -0.55
                    ],
                    [
                        -0.9,
                        0.4,
                        -0.5
                    ],
                    [
                        -0.95,
                        1.0,
                        0.2
                    ],
                    [
                        -0.9,
                        1.08,
                        0.6
                    ]
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 179,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tube, {
                points: [
                    [
                        0.9,
                        -0.3,
                        -0.55
                    ],
                    [
                        1.3,
                        0.0,
                        -0.3
                    ],
                    [
                        1.42,
                        0.1,
                        0.05
                    ]
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 180,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tube, {
                points: [
                    [
                        0.4,
                        -0.7,
                        -0.55
                    ],
                    [
                        0.6,
                        -0.75,
                        0.0
                    ],
                    [
                        0.75,
                        -0.62,
                        0.42
                    ]
                ],
                radius: 0.014
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 181,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 147,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c2 = Internals;
/* ---------------------------------------------------------------- mechanism detail (clear-case hardware) */ const brass = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
    color: "#c9a24e",
    metalness: 1,
    roughness: 0.22,
    clearcoat: 0.6
});
const capBlue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
    color: "#1f4fa8",
    roughness: 0.35,
    clearcoat: 0.8
});
const resistor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    color: "#d9c7a0",
    roughness: 0.6
});
const tubeGlass = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
    color: "#ffffff",
    roughness: 0.04,
    transmission: 1,
    thickness: 0.05,
    ior: 1.45,
    clearcoat: 1
});
// Toothed gear: a circle of alternating radii, extruded with a small bevel and a hub hole.
const makeGear = (r, teeth, depth)=>{
    const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"]();
    const tooth = Math.PI * 2 / teeth;
    for(let i = 0; i < teeth; i++){
        const a = i * tooth;
        [
            [
                a,
                r * 0.86
            ],
            [
                a + tooth * 0.15,
                r
            ],
            [
                a + tooth * 0.45,
                r
            ],
            [
                a + tooth * 0.6,
                r * 0.86
            ]
        ].forEach(([ang, rad], k)=>(i === 0 && k === 0 ? s.moveTo : s.lineTo).call(s, Math.cos(ang) * rad, Math.sin(ang) * rad));
    }
    const hole = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"]();
    hole.absarc(0, 0, r * 0.18, 0, Math.PI * 2, true);
    s.holes.push(hole);
    for(let k = 0; k < 4; k++){
        const a = k * Math.PI / 2 + 0.4, h = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"]();
        h.absarc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.14, 0, Math.PI * 2, true);
        s.holes.push(h);
    }
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrudeGeometry"](s, {
        depth,
        bevelEnabled: true,
        bevelSize: 0.006,
        bevelThickness: 0.006,
        bevelSegments: 2,
        curveSegments: 6
    });
    g.translate(0, 0, -depth / 2);
    return g;
};
const Gear = ({ r, teeth, position, material, dir = 1, spinning })=>{
    _s3();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Gear.useMemo[geo]": ()=>makeGear(r, teeth, 0.05)
    }["Gear.useMemo[geo]"], [
        r,
        teeth
    ]);
    const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Gear.useFrame": (_, dt)=>{
            v.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(v.current, spinning ? 6 : 0, 3, dt);
            ref.current.rotation.z += v.current / r * 0.12 * dir * dt; // meshing gears: speed ∝ 1/radius
        }
    }["Gear.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        ref: ref,
        geometry: geo,
        material: material,
        position: position
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 220,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(Gear, "BOR+NmpDd5IVN36+8Q9/5Z5Rctw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c3 = Gear;
const Fan = ({ position, spinning })=>{
    _s4();
    const blades = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Fan.useFrame": (_, dt)=>{
            blades.current.rotation.z += (spinning ? 22 : 2.5) * dt;
        }
    }["Fan.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: position,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    0.5,
                    0.5,
                    0.08
                ],
                radius: 0.04,
                material: mat.black
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 228,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: blades,
                position: [
                    0,
                    0,
                    0.05
                ],
                children: [
                    Array.from({
                        length: 7
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            rotation: [
                                0.35,
                                0,
                                i / 7 * Math.PI * 2
                            ],
                            position: [
                                Math.cos(i / 7 * Math.PI * 2) * 0.1,
                                Math.sin(i / 7 * Math.PI * 2) * 0.1,
                                0
                            ],
                            material: mat.chip,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.16,
                                    0.07,
                                    0.006
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 232,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, i, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 231,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        material: mat.chrome,
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.06,
                                0.06,
                                0.03,
                                24
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 235,
                            columnNumber: 76
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 235,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 229,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 227,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s4(Fan, "CGAiYM4dSbztZGulY81HIOCsV/Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c4 = Fan;
// Helix return spring for the lever.
const Spring = ({ position })=>{
    _s5();
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Spring.useMemo[geo]": ()=>{
            const pts = [];
            for(let i = 0; i <= 200; i++){
                const t = i / 200, a = t * Math.PI * 2 * 9;
                pts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(a) * 0.07, t * 0.5, Math.sin(a) * 0.07));
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"](pts), 400, 0.008, 6, false);
        }
    }["Spring.useMemo[geo]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        material: mat.chrome,
        position: position
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 248,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s5(Spring, "piii1S6cZ4PIVk7/qHfg4oHu94E=");
_c5 = Spring;
// Mechanical play counter: digits on a dark plate behind the glass.
const Counter = ({ position })=>{
    _s6();
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Counter.useMemo[tex]": ()=>{
            const c = document.createElement("canvas");
            c.width = 256;
            c.height = 64;
            const g = c.getContext("2d");
            g.fillStyle = "#0b0b0c";
            g.fillRect(0, 0, 256, 64);
            "000427".split("").forEach({
                "Counter.useMemo[tex]": (d, i)=>{
                    g.fillStyle = i < 3 ? "#202024" : "#2a2a2e";
                    g.fillRect(6 + i * 41, 6, 36, 52);
                    g.fillStyle = "#edeae3";
                    g.font = "600 38px 'Geist Mono', monospace";
                    g.textAlign = "center";
                    g.textBaseline = "middle";
                    g.fillText(d, 24 + i * 41, 33);
                }
            }["Counter.useMemo[tex]"]);
            const t = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
            t.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            return t;
        }
    }["Counter.useMemo[tex]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        position: position,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                args: [
                    0.56,
                    0.14
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 266,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                map: tex,
                roughness: 0.4
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 267,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 265,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s6(Counter, "bLYtEdzw8sqvk8DwNC2+3sIMTzA=");
_c6 = Counter;
const Mechanism = ({ spinning })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gear, {
                r: 0.32,
                teeth: 22,
                position: [
                    -0.95,
                    -0.55,
                    0.35
                ],
                material: mat.chrome,
                spinning: spinning
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 275,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gear, {
                r: 0.18,
                teeth: 13,
                position: [
                    -0.47,
                    -0.42,
                    0.37
                ],
                material: brass,
                dir: -1,
                spinning: spinning
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 276,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Gear, {
                r: 0.12,
                teeth: 9,
                position: [
                    -0.42,
                    -0.74,
                    0.39
                ],
                material: mat.chrome,
                spinning: spinning
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 277,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                [
                    -0.95,
                    -0.55
                ],
                [
                    -0.47,
                    -0.42
                ],
                [
                    -0.42,
                    -0.74
                ]
            ].map(([x, y], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        x,
                        y,
                        0.2
                    ],
                    rotation: [
                        Math.PI / 2,
                        0,
                        0
                    ],
                    material: mat.brushed,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.025,
                            0.025,
                            0.45,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 279,
                        columnNumber: 104
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 279,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Fan, {
                position: [
                    0.0,
                    -0.55,
                    -0.42
                ],
                spinning: spinning
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 283,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    -0.35,
                    -0.72,
                    -0.5
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        material: mat.brushed,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.36,
                                0.04,
                                0.16
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 285,
                            columnNumber: 42
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 285,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    Array.from({
                        length: 8
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                -0.16 + i * 0.045,
                                0.09,
                                0
                            ],
                            material: mat.brushed,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.012,
                                    0.16,
                                    0.16
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 287,
                                columnNumber: 94
                            }, ("TURBOPACK compile-time value", void 0))
                        }, i, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 287,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 284,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                -1.0,
                -0.86,
                0.45,
                0.58
            ].map((x, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        x,
                        -0.22,
                        -0.48
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            material: capBlue,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    0.045,
                                    0.045,
                                    0.16,
                                    20
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 294,
                                columnNumber: 42
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 294,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                0.082,
                                0
                            ],
                            material: mat.brushed,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    0.046,
                                    0.046,
                                    0.01,
                                    20
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 295,
                                columnNumber: 71
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 295,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, i, true, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 293,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            Array.from({
                length: 6
            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0.12 + i * 0.06,
                        -0.95,
                        -0.52
                    ],
                    rotation: [
                        0,
                        0,
                        Math.PI / 2
                    ],
                    material: resistor,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.014,
                            0.014,
                            0.09,
                            10
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 299,
                        columnNumber: 121
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 299,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            [
                "#ff7a1a",
                "#edeae3",
                "#ff7a1a",
                "#9a9a9e",
                "#ff7a1a",
                "#edeae3"
            ].map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tube, {
                    radius: 0.009,
                    material: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                        color: c,
                        roughness: 0.5
                    }),
                    points: [
                        [
                            0.62 + i * 0.022,
                            -0.2,
                            -0.56
                        ],
                        [
                            0.66 + i * 0.022,
                            0.1,
                            -0.5
                        ],
                        [
                            0.6 + i * 0.022,
                            0.38,
                            -0.32
                        ]
                    ]
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 304,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    1.18,
                    1.26,
                    -0.5
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            0.34,
                            0.03,
                            0.22
                        ],
                        radius: 0.01,
                        material: mat.chrome
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 310,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.017,
                            0
                        ],
                        material: mat.black,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.2,
                                0.005,
                                0.03
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 311,
                            columnNumber: 65
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 311,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 309,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    1.18,
                    0.1,
                    -0.5
                ],
                material: tubeGlass,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.09,
                        0.09,
                        2.2,
                        32,
                        1,
                        true
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 313,
                    columnNumber: 65
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 313,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            Array.from({
                length: 9
            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        1.18,
                        -0.95 + i * 0.03,
                        -0.5
                    ],
                    rotation: [
                        0,
                        i * 0.4,
                        i % 2 * 0.05
                    ],
                    material: brass,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.075,
                            0.075,
                            0.025,
                            32
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 315,
                        columnNumber: 126
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 315,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    1.05,
                    -1.08,
                    0.86
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            0.7,
                            0.08,
                            0.3
                        ],
                        radius: 0.03,
                        material: mat.chrome
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 318,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    [
                        [
                            -0.12,
                            0.05
                        ],
                        [
                            0.08,
                            0.06
                        ]
                    ].map(([x, y], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                x,
                                y,
                                0
                            ],
                            rotation: [
                                0.2,
                                0,
                                0.1 * i
                            ],
                            material: brass,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    0.075,
                                    0.075,
                                    0.025,
                                    32
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 320,
                                columnNumber: 98
                            }, ("TURBOPACK compile-time value", void 0))
                        }, i, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 320,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 317,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spring, {
                position: [
                    1.38,
                    -0.15,
                    0.05
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 325,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Counter, {
                position: [
                    0.2,
                    1.07,
                    0.845
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 326,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                [
                    -1.48,
                    1.13
                ],
                [
                    1.48,
                    1.13
                ],
                [
                    -1.48,
                    -1.13
                ],
                [
                    1.48,
                    -1.13
                ]
            ].map(([x, y], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        x,
                        y,
                        0.83
                    ],
                    rotation: [
                        Math.PI / 2,
                        0,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            material: mat.chrome,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    0.035,
                                    0.035,
                                    0.015,
                                    20
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 331,
                                columnNumber: 45
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 331,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                0.009,
                                0
                            ],
                            material: mat.black,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.05,
                                    0.003,
                                    0.008
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/lab/Machine3D.jsx",
                                lineNumber: 332,
                                columnNumber: 69
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 332,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, i, true, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 330,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 273,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c7 = Mechanism;
/* ---------------------------------------------------------------- lever, LEDs */ // Grab the knob and drag down: the arm follows with resistance, fires past 70% of travel, springs back otherwise.
const Lever = ({ pulled, onPull })=>{
    _s7();
    const pivot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const drag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // { startY, angle } while dragging
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Lever.useEffect": ()=>{
            const move = {
                "Lever.useEffect.move": (e)=>{
                    if (!drag.current) return;
                    const raw = Math.max(0, (e.clientY - drag.current.startY) / 160);
                    drag.current.angle = Math.min(1, raw / (1 + raw * 0.6)) * 0.95; // resistance: diminishing return
                }
            }["Lever.useEffect.move"];
            const up = {
                "Lever.useEffect.up": ()=>{
                    if (!drag.current) return;
                    if (drag.current.angle > 0.66) onPull();
                    drag.current = null;
                    document.body.style.cursor = "";
                }
            }["Lever.useEffect.up"];
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
            return ({
                "Lever.useEffect": ()=>{
                    window.removeEventListener("pointermove", move);
                    window.removeEventListener("pointerup", up);
                }
            })["Lever.useEffect"];
        }
    }["Lever.useEffect"], [
        onPull
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Lever.useFrame": (_, dt)=>{
            const target = drag.current ? drag.current.angle : pulled ? 0.9 : 0;
            pivot.current.rotation.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(pivot.current.rotation.x, target, drag.current ? 20 : pulled ? 14 : 5, dt);
        }
    }["Lever.useFrame"]);
    const grab = (e)=>{
        e.stopPropagation();
        drag.current = {
            startY: e.clientY,
            angle: 0
        };
        document.body.style.cursor = "grabbing";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            1.6,
            0.1,
            0.05
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                material: mat.black,
                rotation: [
                    0,
                    0,
                    Math.PI / 2
                ],
                position: [
                    0.04,
                    0,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.3,
                        0.3,
                        0.08,
                        48
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 366,
                    columnNumber: 95
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 366,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                material: mat.chrome,
                rotation: [
                    0,
                    0,
                    Math.PI / 2
                ],
                position: [
                    0.15,
                    0,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.22,
                        0.24,
                        0.16,
                        48
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 367,
                    columnNumber: 96
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 367,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: pivot,
                position: [
                    0.2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        material: mat.chrome,
                        position: [
                            0,
                            0.65,
                            0
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.04,
                                0.055,
                                1.3,
                                32
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 369,
                            columnNumber: 69
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 369,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        material: mat.knob,
                        position: [
                            0,
                            1.36,
                            0
                        ],
                        onPointerDown: grab,
                        onPointerOver: ()=>document.body.style.cursor = "grab",
                        onPointerOut: ()=>!drag.current && (document.body.style.cursor = ""),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.17,
                                64,
                                64
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 372,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 370,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 368,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 365,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s7(Lever, "EaMgJfCm/W6lxSnd7nz3gP0Vg3A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c8 = Lever;
const Leds = ({ spinning, booted })=>{
    _s8();
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Leds.useFrame": ({ clock }, dt)=>{
            const t = clock.elapsedTime;
            refs.current.forEach({
                "Leds.useFrame": (m, i)=>{
                    if (!m) return;
                    const lit = spinning ? Math.floor(t * 18) % 9 === i ? 20 : 3 : booted ? 9 : t * 6 > i ? 9 : 0;
                    m.emissiveIntensity = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(m.emissiveIntensity, lit, 12, dt);
                }
            }["Leds.useFrame"]);
        }
    }["Leds.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            -0.78,
            1.07,
            0.845
        ],
        children: Array.from({
            length: 9
        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    i * 0.075,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.022,
                            16,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 393,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ref: (m)=>refs.current[i] = m,
                        color: "#2a0b09",
                        emissive: SIGNAL,
                        emissiveIntensity: 0,
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 394,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, i, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 392,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 390,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s8(Leds, "/HUsbemikPuyqe0UJdVVGNxMiZo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c9 = Leds;
// Case built from panels so the front can have a real reel window (a refracting box over the reels made them unreadable).
const roundedRect = (shape, x, y, w, h, r)=>{
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
};
const WIN = {
    w: 2.86,
    h: 1.0,
    y: 0.42
}; // reel window
const smoke = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
    color: "#0b0c0e",
    roughness: 0.25,
    metalness: 0.2,
    clearcoat: 1,
    transparent: true,
    opacity: 0.9
});
const windowGlass = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
    color: "#ffffff",
    roughness: 0.04,
    metalness: 0,
    transparent: true,
    opacity: 0.07,
    clearcoat: 1,
    clearcoatRoughness: 0.03
});
const Case = ()=>{
    _s9();
    const front = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Case.useMemo[front]": ()=>{
            const sh = roundedRect(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"](), -1.6, -1.25, 3.2, 2.5, 0.12);
            sh.holes.push(roundedRect(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"](), -WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h, 0.05));
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrudeGeometry"](sh, {
                depth: 0.04,
                bevelEnabled: true,
                bevelSize: 0.015,
                bevelThickness: 0.015,
                bevelSegments: 3,
                curveSegments: 12
            });
            g.translate(0, 0, 0.76);
            return g;
        }
    }["Case.useMemo[front]"], []);
    const t = 0.04;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: front,
                material: mat.shell
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 424,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0,
                    -0.78
                ],
                material: mat.shell,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                    args: [
                        3.2,
                        2.5,
                        t
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 425,
                    columnNumber: 65
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 425,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            [
                -1.58,
                1.58
            ].map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        x,
                        0,
                        0
                    ],
                    material: mat.shell,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            t,
                            2.42,
                            1.52
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 426,
                        columnNumber: 95
                    }, ("TURBOPACK compile-time value", void 0))
                }, x, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 426,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0))),
            [
                -1.23,
                1.23
            ].map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        y,
                        0
                    ],
                    material: mat.shell,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            3.12,
                            t,
                            1.52
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 427,
                        columnNumber: 95
                    }, ("TURBOPACK compile-time value", void 0))
                }, y, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 427,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0))),
            [
                1.27,
                -1.27
            ].map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        3.28,
                        0.07,
                        1.68
                    ],
                    radius: 0.03,
                    position: [
                        0,
                        y,
                        0
                    ],
                    material: mat.chrome
                }, y, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 429,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0))),
            [
                [
                    -1.6,
                    0.8
                ],
                [
                    1.6,
                    0.8
                ],
                [
                    -1.6,
                    -0.8
                ],
                [
                    1.6,
                    -0.8
                ]
            ].map(([x, z], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        x,
                        0,
                        z
                    ],
                    material: mat.chrome,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.026,
                            0.026,
                            2.5,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 431,
                        columnNumber: 74
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 431,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    WIN.y,
                    0.79
                ],
                material: windowGlass,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                    args: [
                        WIN.w,
                        WIN.h
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 434,
                    columnNumber: 70
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 434,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            [
                [
                    0,
                    WIN.y + WIN.h / 2 + 0.02,
                    WIN.w + 0.08,
                    0.04
                ],
                [
                    0,
                    WIN.y - WIN.h / 2 - 0.02,
                    WIN.w + 0.08,
                    0.04
                ]
            ].map(([x, y, w, h], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        w,
                        h,
                        0.05
                    ],
                    radius: 0.015,
                    position: [
                        x,
                        y,
                        0.82
                    ],
                    material: mat.chrome
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 437,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))),
            [
                -1,
                1
            ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        0.04,
                        WIN.h + 0.08,
                        0.05
                    ],
                    radius: 0.015,
                    position: [
                        d * (WIN.w / 2 + 0.02),
                        WIN.y,
                        0.82
                    ],
                    material: mat.chrome
                }, d, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 440,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    3.0,
                    0.24,
                    0.012
                ],
                radius: 0.004,
                position: [
                    0,
                    1.07,
                    0.83
                ],
                material: smoke
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 443,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    3.0,
                    0.2,
                    0.012
                ],
                radius: 0.004,
                position: [
                    0,
                    -0.2,
                    0.83
                ],
                material: smoke
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 444,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    3.0,
                    0.18,
                    0.012
                ],
                radius: 0.004,
                position: [
                    0,
                    -1.1,
                    0.83
                ],
                material: smoke
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 445,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 423,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s9(Case, "4k5vW3LQmwqnjKWu5RFF32/W73M=");
_c10 = Case;
// A bright band sweeps across the reel window glass each time the reels come to rest.
const GlintSweep = ({ spinning })=>{
    _s10();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(2);
    const was = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(spinning);
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GlintSweep.useMemo[tex]": ()=>{
            const c = document.createElement("canvas");
            c.width = 256;
            c.height = 8;
            const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 256, 0);
            gr.addColorStop(0, "rgba(255,255,255,0)");
            gr.addColorStop(0.5, "rgba(255,255,255,.9)");
            gr.addColorStop(1, "rgba(255,255,255,0)");
            g.fillStyle = gr;
            g.fillRect(0, 0, 256, 8);
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
        }
    }["GlintSweep.useMemo[tex]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "GlintSweep.useFrame": (_, dt)=>{
            if (was.current && !spinning) t.current = 0; // reels just stopped
            was.current = spinning;
            t.current = Math.min(t.current + dt / 0.7, 2);
            const k = t.current;
            ref.current.visible = k < 1;
            ref.current.position.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(-1.8, 1.8, k);
            ref.current.material.opacity = Math.sin(Math.min(k, 1) * Math.PI) * 0.55;
        }
    }["GlintSweep.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        ref: ref,
        position: [
            0,
            WIN.y,
            0.805
        ],
        rotation: [
            0,
            0,
            -0.35
        ],
        visible: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                args: [
                    0.5,
                    1.3
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 473,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                map: tex,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
                toneMapped: false
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 474,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 472,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s10(GlintSweep, "1+NpAZ9LsaSs4PoFNYGBoC9SP8c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c11 = GlintSweep;
const Machine = ({ spinning, spin, pulled, booted, onPull })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            MACHINE_Y,
            0
        ],
        onClick: (e)=>{
            e.stopPropagation();
            onPull();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Internals, {}, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 481,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Mechanism, {
                spinning: spinning
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 482,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                -0.95,
                0,
                0.95
            ].map((x, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Reel, {
                    index: i,
                    x: x,
                    spin: spin
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 483,
                    columnNumber: 41
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Case, {}, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 484,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                font: MONO,
                fontSize: 0.1,
                letterSpacing: 0.1,
                color: BONE,
                anchorX: "left",
                anchorY: "middle",
                position: [
                    -1.42,
                    1.07,
                    0.845
                ],
                children: "PX-01"
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 487,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                font: MONO,
                fontSize: 0.075,
                letterSpacing: 0.12,
                color: BONE,
                anchorX: "right",
                anchorY: "middle",
                position: [
                    1.42,
                    1.07,
                    0.845
                ],
                children: "REALITY SELECTOR"
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 488,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                "ERA",
                "MEDIUM",
                "MOOD"
            ].map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                    font: MONO,
                    fontSize: 0.075,
                    letterSpacing: 0.14,
                    color: BONE,
                    anchorX: "center",
                    anchorY: "middle",
                    position: [
                        (i - 1) * 0.95,
                        -0.2,
                        0.845
                    ],
                    children: `0${i + 1}  ${t}`
                }, t, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 490,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                font: MONO,
                fontSize: 0.065,
                letterSpacing: 0.12,
                color: BONE,
                anchorX: "left",
                anchorY: "middle",
                position: [
                    -1.42,
                    -1.1,
                    0.845
                ],
                children: "AMAN PATEL — CLEAR EDITION"
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 492,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                font: MONO,
                fontSize: 0.065,
                letterSpacing: 0.12,
                color: SIGNAL,
                anchorX: "right",
                anchorY: "middle",
                position: [
                    1.42,
                    -1.1,
                    0.845
                ],
                children: "EST. 2026"
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 493,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    WIN.y,
                    0.8
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            WIN.w,
                            0.008
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 495,
                        columnNumber: 42
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: SIGNAL,
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 495,
                        columnNumber: 81
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 495,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                -1,
                1
            ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        d * (WIN.w / 2 + 0.09),
                        WIN.y,
                        0.84
                    ],
                    rotation: [
                        0,
                        0,
                        d > 0 ? Math.PI / 2 : -Math.PI / 2
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                            args: [
                                0.05,
                                0.09,
                                3
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 498,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                            color: SIGNAL,
                            toneMapped: false
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 498,
                            columnNumber: 56
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, d, true, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 497,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Leds, {
                spinning: spinning,
                booted: booted
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 502,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Lever, {
                pulled: pulled,
                onPull: onPull
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 503,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GlintSweep, {
                spinning: spinning
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 504,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            [
                [
                    -1.4,
                    0.6
                ],
                [
                    1.4,
                    0.6
                ],
                [
                    -1.4,
                    -0.6
                ],
                [
                    1.4,
                    -0.6
                ]
            ].map(([x, z], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        x,
                        -1.3,
                        z
                    ],
                    material: mat.chrome,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.1,
                            0.12,
                            0.1,
                            24
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 506,
                        columnNumber: 73
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 506,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 480,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c12 = Machine;
/* ---------------------------------------------------------------- glass surface: smudges + hairline scratches */ // Built once and assigned to the glass materials, so they catch light unevenly like real handled glass.
let smudgeTex;
const getSmudge = ()=>{
    if (smudgeTex) return smudgeTex;
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d");
    g.fillStyle = "#1a1a1a";
    g.fillRect(0, 0, 512, 512); // mostly polished
    for(let i = 0; i < 40; i++){
        const x = Math.random() * 512, y = Math.random() * 512, r = 20 + Math.random() * 60;
        const grad = g.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, "rgba(120,120,120,.35)");
        grad.addColorStop(1, "rgba(120,120,120,0)");
        g.fillStyle = grad;
        g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.strokeStyle = "rgba(200,200,200,.25)";
    g.lineWidth = 0.6; // hairline scratches
    for(let i = 0; i < 70; i++){
        const x = Math.random() * 512, y = Math.random() * 512, a = Math.random() * Math.PI, l = 10 + Math.random() * 60;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
        g.stroke();
    }
    smudgeTex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    smudgeTex.wrapS = smudgeTex.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    return smudgeTex;
};
const GlassSurface = ()=>{
    _s11();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlassSurface.useEffect": ()=>{
            const t = getSmudge();
            [
                mat.shell,
                mat.plinth
            ].forEach({
                "GlassSurface.useEffect": (m)=>{
                    m.roughnessMap = t;
                    m.clearcoatRoughnessMap = t;
                    m.needsUpdate = true;
                }
            }["GlassSurface.useEffect"]);
        }
    }["GlassSurface.useEffect"], []);
    return null;
};
_s11(GlassSurface, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c13 = GlassSurface;
/* ---------------------------------------------------------------- island */ const ISLAND_R = 6;
const ISLAND_DEPTH = 2.4; // rock showing above the waterline
const UNDER = 4.4; // rocky underside tapering below the rim
const SEA = FLOOR - ISLAND_DEPTH - UNDER - 1.8; // the island hangs well above the water
const Plinth = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    3.9,
                    PLINTH_H,
                    2.3
                ],
                radius: 0.05,
                smoothness: 4,
                position: [
                    0,
                    FLOOR + PLINTH_H / 2,
                    0
                ],
                material: mat.plinth,
                castShadow: true
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 552,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    3.5,
                    0.06,
                    2.0
                ],
                radius: 0.02,
                position: [
                    0,
                    PLINTH_TOP + 0.03,
                    0
                ],
                material: mat.chrome
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 553,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 551,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c14 = Plinth;
// Rock drum with an irregular, tapering edge + a grass-and-rock top. CC0 Poly Haven textures.
// Underside: a short dark rock core wrapped in tiers of real textured boulders that shrink toward a tip,
// so it reads as broken-off rock, not a smooth cone.
const Underside = ()=>{
    _s12();
    const [diff, nor, rough] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"])([
        "/textures/coast_land_rocks_01_diff_1k.jpg",
        "/textures/coast_land_rocks_01_nor_1k.jpg",
        "/textures/coast_land_rocks_01_rough_1k.jpg"
    ]);
    const core = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Underside.useMemo[core]": ()=>{
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](ISLAND_R * 0.7, UNDER * 0.75, 48, 8, true);
            g.rotateX(Math.PI);
            return g;
        }
    }["Underside.useMemo[core]"], []);
    const chunks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Underside.useMemo[chunks]": ()=>{
            const out = [];
            const tiers = [
                [
                    ISLAND_R * 0.64,
                    0.3,
                    1.5,
                    9
                ],
                [
                    ISLAND_R * 0.42,
                    1.4,
                    1.1,
                    7
                ],
                [
                    ISLAND_R * 0.24,
                    2.6,
                    0.75,
                    5
                ],
                [
                    ISLAND_R * 0.1,
                    3.7,
                    0.5,
                    3
                ],
                [
                    0,
                    4.6,
                    0.32,
                    1
                ]
            ];
            let k = 0;
            tiers.forEach({
                "Underside.useMemo[chunks]": ([r, depth, size, n])=>{
                    for(let i = 0; i < n; i++, k++){
                        const a = i / n * Math.PI * 2 + rand(k + 700) * 0.5;
                        const sc = size * (0.45 + rand(k + 710) * 1.0); // wide size spread: a few big, many small
                        out.push({
                            seed: k + 60,
                            pos: [
                                Math.cos(a) * r,
                                FLOOR - ISLAND_DEPTH - depth - rand(k + 720) * 0.5,
                                Math.sin(a) * r
                            ],
                            sc: [
                                sc,
                                sc * (1.2 + rand(k + 730) * 0.9),
                                sc
                            ],
                            shade: 1 - depth / 7
                        });
                    }
                }
            }["Underside.useMemo[chunks]"]);
            return out;
        }
    }["Underside.useMemo[chunks]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: core,
                position: [
                    0,
                    FLOOR - ISLAND_DEPTH - UNDER * 0.375,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#2e2a26",
                    roughness: 1,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 583,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 582,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            chunks.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HangingRock, {
                    ...c,
                    maps: [
                        diff,
                        nor,
                        rough
                    ]
                }, c.seed, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 585,
                    columnNumber: 32
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 581,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s12(Underside, "ZUbWbUZiBH6eaJXFW9yJXZFStCk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"]
    ];
});
_c15 = Underside;
const HangingRock = ({ seed, pos, sc, maps, shade })=>{
    _s13();
    const geo = useBoulderGeo(seed);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        position: pos,
        scale: sc,
        rotation: [
            rand(seed) * 0.6,
            seed,
            rand(seed + 1) * 0.6
        ],
        castShadow: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
            map: maps[0],
            normalMap: maps[1],
            roughnessMap: maps[2],
            color: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]("#8a827a").multiplyScalar(0.55 + shade * 0.45)
        }, void 0, false, {
            fileName: "[project]/src/lab/Machine3D.jsx",
            lineNumber: 593,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 592,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s13(HangingRock, "i2kooNPNLty8L8u0TeM+Wcz4ZmI=", false, function() {
    return [
        useBoulderGeo
    ];
});
_c16 = HangingRock;
// Roots dangling from the rim's underside, swaying slightly.
const Roots = ()=>{
    _s14();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const geos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Roots.useMemo[geos]": ()=>Array.from({
                length: 18
            }, {
                "Roots.useMemo[geos]": (_, i)=>{
                    const a = i / 18 * Math.PI * 2 + rand(i + 300) * 0.3, r = ISLAND_R * (0.66 + rand(i + 310) * 0.1);
                    const len = 1.2 + rand(i + 320) * 2.4, y0 = FLOOR - ISLAND_DEPTH + 0.1;
                    const pts = Array.from({
                        length: 6
                    }, {
                        "Roots.useMemo[geos].pts": (_, k)=>{
                            const t = k / 5, wob = Math.sin(t * 6 + i) * 0.18 * t;
                            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(a) * (r - t * 0.6) + wob, y0 - t * len, Math.sin(a) * (r - t * 0.6) + wob);
                        }
                    }["Roots.useMemo[geos].pts"]);
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"](pts), 24, 0.03 * (1 - rand(i + 330) * 0.5), 6, false);
                }
            }["Roots.useMemo[geos]"])
    }["Roots.useMemo[geos]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Roots.useFrame": ({ clock })=>{
            if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.006;
        }
    }["Roots.useFrame"]);
    const rootMat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Roots.useMemo[rootMat]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: "#3b2c22",
                roughness: 0.9
            })
    }["Roots.useMemo[rootMat]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: ref,
        children: geos.map((g, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: g,
                material: rootMat
            }, i, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 612,
                columnNumber: 49
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 612,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s14(Roots, "0Ow+Cudgj0LNfOKs/HRJX8gr2kY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c17 = Roots;
const Island = ()=>{
    _s15();
    const [rDiff, rNor, rRough, gDiff, gNor, gRough] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"])([
        "/textures/coast_land_rocks_01_diff_1k.jpg",
        "/textures/coast_land_rocks_01_nor_1k.jpg",
        "/textures/coast_land_rocks_01_rough_1k.jpg",
        "/textures/aerial_grass_rock_diff_1k.jpg",
        "/textures/aerial_grass_rock_nor_1k.jpg",
        "/textures/aerial_grass_rock_rough_1k.jpg"
    ]);
    useLayoutEffectOnce({
        "Island.useLayoutEffectOnce": ()=>{
            [
                rDiff,
                rNor,
                rRough
            ].forEach({
                "Island.useLayoutEffectOnce": (t)=>{
                    t.wrapS = t.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"];
                    t.repeat.set(6, 1.2);
                }
            }["Island.useLayoutEffectOnce"]);
            [
                gDiff,
                gNor,
                gRough
            ].forEach({
                "Island.useLayoutEffectOnce": (t)=>{
                    t.wrapS = t.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"];
                    t.repeat.set(3, 3);
                }
            }["Island.useLayoutEffectOnce"]);
            rDiff.colorSpace = gDiff.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
        }
    }["Island.useLayoutEffectOnce"]);
    const sideGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Island.useMemo[sideGeo]": ()=>{
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](ISLAND_R, ISLAND_R * 0.72, ISLAND_DEPTH, 96, 8, true);
            const p = g.attributes.position;
            for(let i = 0; i < p.count; i++){
                const x = p.getX(i), z = p.getZ(i), y = p.getY(i);
                const a = Math.atan2(z, x);
                const n = 1 + Math.sin(a * 5) * 0.04 + Math.sin(a * 13 + y * 2) * 0.03 + Math.sin(a * 29) * 0.015;
                p.setX(i, x * n);
                p.setZ(i, z * n);
            }
            g.computeVertexNormals();
            return g;
        }
    }["Island.useMemo[sideGeo]"], []);
    const topGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Island.useMemo[topGeo]": ()=>{
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](ISLAND_R, 96);
            const p = g.attributes.position;
            for(let i = 0; i < p.count; i++){
                const x = p.getX(i), y = p.getY(i), a = Math.atan2(y, x);
                const n = 1 + Math.sin(a * 5) * 0.04 + Math.sin(a * 13 + 1.2) * 0.03 + Math.sin(a * 29) * 0.015;
                p.setX(i, x * n);
                p.setY(i, y * n);
            }
            return g;
        }
    }["Island.useMemo[topGeo]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: sideGeo,
                position: [
                    0,
                    FLOOR - ISLAND_DEPTH / 2,
                    0
                ],
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: rDiff,
                    normalMap: rNor,
                    roughnessMap: rRough,
                    color: "#8d8780",
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 650,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 649,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: topGeo,
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                position: [
                    0,
                    FLOOR,
                    0
                ],
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: gDiff,
                    normalMap: gNor,
                    roughnessMap: gRough,
                    color: "#9aa58a"
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 653,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 652,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 648,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s15(Island, "vvDyGxCvuwId3k04LGZqsHvzJ7A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"],
        useLayoutEffectOnce
    ];
});
_c18 = Island;
function useLayoutEffectOnce(fn) {
    _s16();
    const done = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLayoutEffectOnce.useEffect": ()=>{
            if (!done.current) {
                done.current = true;
                fn();
            }
        }
    }["useLayoutEffectOnce.useEffect"]);
}
_s16(useLayoutEffectOnce, "103YZx6E0AySCrUKA7nWDHDxUz8=");
// ~22k instanced grass blades on the island top, swaying in a shader. Clear of the plinth footprint.
const Grass = ()=>{
    _s17();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const uniforms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Grass.useMemo[uniforms]": ()=>({
                uTime: {
                    value: 0
                }
            })
    }["Grass.useMemo[uniforms]"], []);
    const { geo, material, count } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Grass.useMemo": ()=>{
            const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.06, 0.55, 1, 4);
            geo.translate(0, 0.275, 0);
            const p = geo.attributes.position;
            for(let i = 0; i < p.count; i++){
                const y = p.getY(i) / 0.55;
                p.setX(i, p.getX(i) * (1 - y * 0.95));
            }
            const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: "#ffffff",
                roughness: 0.75,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
            });
            material.onBeforeCompile = ({
                "Grass.useMemo": (s)=>{
                    s.uniforms.uTime = uniforms.uTime;
                    s.vertexShader = "uniform float uTime;\nvarying float vH;\n" + s.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
                float h = position.y / 0.55;
                vH = h;
                vec4 wp = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
                transformed.x += sin(uTime * 1.4 + wp.x * 0.7 + wp.z * 0.5) * 0.08 * h * h;
                transformed.z += cos(uTime * 1.1 + wp.x * 0.4) * 0.05 * h * h;`);
                    s.fragmentShader = "varying float vH;\n" + s.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
                diffuseColor.rgb *= mix(0.25, 0.85, vH);   // dark roots, sunlit tips (kept below clipping in backlight)`);
                }
            })["Grass.useMemo"];
            return {
                geo,
                material,
                count: LITE ? 8000 : 22000
            };
        }
    }["Grass.useMemo"], [
        uniforms
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Grass.useEffect": ()=>{
            const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix4"](), q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"](), s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), pos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Euler"](), col = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
            let n = 0;
            while(n < count){
                const r = Math.sqrt(Math.random()) * (ISLAND_R - 0.3), a = Math.random() * Math.PI * 2;
                const x = Math.cos(a) * r, z = Math.sin(a) * r;
                if (Math.abs(x) < 2.05 && Math.abs(z) < 1.3) continue; // leave the plinth's footprint clear
                pos.set(x, FLOOR, z);
                q.setFromEuler(e.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4));
                const h = 0.22 + Math.random() * Math.random() * 0.55; // mostly short, a few taller tufts
                s.set(1, h, 1);
                ref.current.setMatrixAt(n, m.compose(pos, q, s));
                // per-blade colour: greens with the odd dry, sun-bleached blade
                col.setHSL(0.24 + (Math.random() - 0.5) * 0.06, 0.45 + Math.random() * 0.2, 0.32 + Math.random() * 0.12);
                if (Math.random() < 0.08) col.setHSL(0.13, 0.45, 0.55);
                ref.current.setColorAt(n++, col);
            }
            ref.current.instanceMatrix.needsUpdate = true;
            ref.current.instanceColor.needsUpdate = true;
        }
    }["Grass.useEffect"], [
        count
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Grass.useFrame": ({ clock })=>{
            uniforms.uTime.value = clock.elapsedTime;
        }
    }["Grass.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
        ref: ref,
        args: [
            geo,
            material,
            count
        ],
        receiveShadow: true
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 711,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s17(Grass, "TtUq1Vv+kVfL5kartiAAeTy9jHk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c19 = Grass;
// CC0 Poly Haven plants, fitted to a target height and placed on the island top.
const Plant = ({ name, height, position, rotation = 0 })=>{
    _s18();
    const { scene } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"])(`/models/${name}/${name}.gltf`);
    const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Plant.useMemo[model]": ()=>{
            const m = scene.clone(true);
            m.traverse({
                "Plant.useMemo[model]": (o)=>{
                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                    }
                }
            }["Plant.useMemo[model]"]);
            const box = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box3"]().setFromObject(m), size = box.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()), sc = height / size.y;
            m.scale.setScalar(sc);
            m.position.set(-(box.min.x + size.x / 2) * sc, -box.min.y * sc, -(box.min.z + size.z / 2) * sc);
            return m;
        }
    }["Plant.useMemo[model]"], [
        scene,
        height
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        position: [
            position[0],
            FLOOR,
            position[1]
        ],
        "rotation-y": rotation
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 725,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s18(Plant, "DEfcpHA4fBev/YTbRzcuz/WzfuY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"]
    ];
});
_c20 = Plant;
const Vegetation = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Plant, {
                name: "fern_02",
                height: 2.0,
                position: [
                    -3.4,
                    -2.3
                ],
                rotation: 0.8
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 731,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Plant, {
                name: "fern_02",
                height: 1.5,
                position: [
                    3.2,
                    -2.5
                ],
                rotation: 2.2
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 732,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 729,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c21 = Vegetation;
/* ---------------------------------------------------------------- rocks, foam, clouds */ // Seeded pseudo-random so the island looks the same on every load.
const rand = (seed)=>{
    const x = Math.sin(seed * 127.1) * 43758.5453;
    return x - Math.floor(x);
};
// Boulder: icosphere with layered sine displacement, squashed, wearing the CC0 coastal-rock texture.
const useBoulderGeo = (seed)=>{
    _s19();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBoulderGeo.useMemo": ()=>{
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](1, 4);
            const p = g.attributes.position, v = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            for(let i = 0; i < p.count; i++){
                v.fromBufferAttribute(p, i);
                const n = 1 + Math.sin(v.x * 3 + seed) * 0.12 + Math.sin(v.y * 5 + seed * 2) * 0.08 + Math.sin(v.z * 7 + seed * 3) * 0.05;
                v.multiplyScalar(n);
                v.y *= 0.62;
                p.setXYZ(i, v.x, v.y, v.z);
            }
            g.computeVertexNormals();
            return g;
        }
    }["useBoulderGeo.useMemo"], [
        seed
    ]);
};
_s19(useBoulderGeo, "nwk+m61qLgjDVUp4IGV/072DDN4=");
const Boulder = ({ seed, position, scale })=>{
    _s20();
    const geo = useBoulderGeo(seed);
    const [diff, nor, rough] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"])([
        "/textures/coast_land_rocks_01_diff_1k.jpg",
        "/textures/coast_land_rocks_01_nor_1k.jpg",
        "/textures/coast_land_rocks_01_rough_1k.jpg"
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        position: position,
        scale: scale,
        "rotation-y": seed,
        castShadow: true,
        receiveShadow: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
            map: diff,
            normalMap: nor,
            roughnessMap: rough,
            color: "#a39e96"
        }, void 0, false, {
            fileName: "[project]/src/lab/Machine3D.jsx",
            lineNumber: 761,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 760,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s20(Boulder, "haxj4bibrBcACp3fYP5+nvn0q+I=", false, function() {
    return [
        useBoulderGeo,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"]
    ];
});
_c22 = Boulder;
const Rocks = ()=>{
    _s21();
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Rocks.useMemo[list]": ()=>{
            const out = [];
            // three accent clusters on the rim (big + small), not a full ring
            [
                [
                    2.4,
                    0.9
                ],
                [
                    4.1,
                    0.4
                ],
                [
                    -0.5,
                    0.75
                ]
            ].forEach({
                "Rocks.useMemo[list]": ([a, sc], k)=>{
                    const r = ISLAND_R * 0.93;
                    out.push({
                        seed: k * 3 + 1,
                        position: [
                            Math.cos(a) * r,
                            FLOOR - 0.05 + sc * 0.2,
                            Math.sin(a) * r
                        ],
                        scale: sc
                    });
                    out.push({
                        seed: k * 3 + 2,
                        position: [
                            Math.cos(a + 0.18) * r,
                            FLOOR + 0.05,
                            Math.sin(a + 0.18) * r
                        ],
                        scale: sc * 0.45
                    });
                    out.push({
                        seed: k * 3 + 3,
                        position: [
                            Math.cos(a - 0.14) * (r - 0.4),
                            FLOOR + 0.02,
                            Math.sin(a - 0.14) * (r - 0.4)
                        ],
                        scale: sc * 0.3
                    });
                }
            }["Rocks.useMemo[list]"]);
            return out;
        }
    }["Rocks.useMemo[list]"], []);
    return list.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Boulder, {
            ...r
        }, i, false, {
            fileName: "[project]/src/lab/Machine3D.jsx",
            lineNumber: 778,
            columnNumber: 31
        }, ("TURBOPACK compile-time value", void 0)));
};
_s21(Rocks, "AnxbijpOTVnYvOBwk3ph58OR5Yk=");
_c23 = Rocks;
// Volumetric cloud banks along the horizon (drei Clouds with a locally generated sprite), warm-lit by the low sun.
const CloudBank = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clouds"], {
        material: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshLambertMaterial"],
        texture: "/textures/cloud.png",
        limit: 400,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cloud"], {
                seed: 1,
                segments: 40,
                bounds: [
                    40,
                    6,
                    6
                ],
                volume: 18,
                position: [
                    -30,
                    16,
                    -110
                ],
                color: "#ffd2b0",
                fade: 60,
                speed: 0.05
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 784,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cloud"], {
                seed: 2,
                segments: 40,
                bounds: [
                    50,
                    7,
                    6
                ],
                volume: 22,
                position: [
                    35,
                    20,
                    -130
                ],
                color: "#f7c9a8",
                fade: 60,
                speed: 0.04
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 785,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cloud"], {
                seed: 3,
                segments: 30,
                bounds: [
                    30,
                    4,
                    5
                ],
                volume: 14,
                position: [
                    5,
                    11,
                    -90
                ],
                color: "#ffe0c2",
                fade: 50,
                speed: 0.06
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 786,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cloud"], {
                seed: 4,
                segments: 24,
                bounds: [
                    24,
                    3,
                    4
                ],
                volume: 10,
                position: [
                    -55,
                    9,
                    -80
                ],
                color: "#e9b99c",
                fade: 40,
                speed: 0.05
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 787,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 783,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c24 = CloudBank;
// Dense ring of small flower heads between the plinth and the rim ("Enjoy the Edge" flower island).
const FLOWER_COLORS = [
    "#e8743a",
    "#efb56a",
    "#ece6da",
    "#d77aa3",
    "#8f7fd6",
    "#e9c95a"
];
const FlowerCarpet = ()=>{
    _s22();
    const petals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(), centres = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(), stems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const count = 700;
    const { headGeo, centreGeo, stemGeo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FlowerCarpet.useMemo": ()=>{
            const parts = Array.from({
                length: 5
            }, {
                "FlowerCarpet.useMemo.parts": (_, i)=>{
                    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](0.05, 10);
                    g.scale(1, 0.48, 1);
                    g.translate(0, 0.045, 0); // elongated petal pointing out
                    g.rotateX(-Math.PI / 2 + 0.35); // lie open, slightly cupped
                    g.rotateY(i / 5 * Math.PI * 2);
                    return g;
                }
            }["FlowerCarpet.useMemo.parts"]);
            const headGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeGeometries"])(parts);
            headGeo.translate(0, 0.26, 0);
            const centreGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.022, 10, 8);
            centreGeo.translate(0, 0.27, 0);
            const stemGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.004, 0.006, 0.26, 5);
            stemGeo.translate(0, 0.13, 0);
            return {
                headGeo,
                centreGeo,
                stemGeo
            };
        }
    }["FlowerCarpet.useMemo"], []);
    const mats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FlowerCarpet.useMemo[mats]": ()=>({
                petal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                    roughness: 0.6,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                }),
                centre: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                    color: "#e0a83a",
                    roughness: 0.7
                }),
                stem: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                    color: "#4d6b34",
                    roughness: 0.8
                })
            })
    }["FlowerCarpet.useMemo[mats]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlowerCarpet.useEffect": ()=>{
            const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix4"](), q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"](), sc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), pos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), col = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](), axis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            let n = 0, k = 0;
            while(n < count){
                k++;
                const r = 3.9 + rand(k) * (ISLAND_R - 4.2), a = rand(k + 1000) * Math.PI * 2;
                const x = Math.cos(a) * r, z = Math.sin(a) * r;
                if (Math.abs(x) < 2.2 && Math.abs(z) < 1.4) continue;
                const pick = Math.floor(a / (Math.PI * 2) * 9 + rand(k + 7) * 2.2) % FLOWER_COLORS.length;
                pos.set(x, FLOOR, z);
                q.setFromAxisAngle(axis.set(rand(k + 4) - 0.5, 4, rand(k + 5) - 0.5).normalize(), rand(k + 6) * 6);
                const size = 0.8 + rand(k + 8) * 0.9;
                sc.set(size, size * (0.8 + rand(k + 9) * 0.6), size);
                m.compose(pos, q, sc);
                [
                    petals,
                    centres,
                    stems
                ].forEach({
                    "FlowerCarpet.useEffect": (r)=>r.current.setMatrixAt(n, m)
                }["FlowerCarpet.useEffect"]);
                petals.current.setColorAt(n++, col.set(FLOWER_COLORS[pick]));
            }
            [
                petals,
                centres,
                stems
            ].forEach({
                "FlowerCarpet.useEffect": (r)=>r.current.instanceMatrix.needsUpdate = true
            }["FlowerCarpet.useEffect"]);
            petals.current.instanceColor.needsUpdate = true;
        }
    }["FlowerCarpet.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: petals,
                args: [
                    headGeo,
                    mats.petal,
                    count
                ],
                castShadow: true
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 836,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: centres,
                args: [
                    centreGeo,
                    mats.centre,
                    count
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 837,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: stems,
                args: [
                    stemGeo,
                    mats.stem,
                    count
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 838,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 835,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s22(FlowerCarpet, "SwgwGmXVazDJrqF7lYF4jcYpg3Q=");
_c25 = FlowerCarpet;
// One hero chrome cosmos beside the plinth: the island's single "designed" flower.
const usePetalGeometry = (len, width, cup)=>{
    _s23();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePetalGeometry.useMemo": ()=>{
            const sh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"]();
            sh.moveTo(0, 0);
            sh.bezierCurveTo(width, len * 0.25, width * 0.9, len * 0.85, 0, len);
            sh.bezierCurveTo(-width * 0.9, len * 0.85, -width, len * 0.25, 0, 0);
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrudeGeometry"](sh, {
                depth: 0.012,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.012,
                bevelSegments: 3,
                curveSegments: 24
            });
            const p = g.attributes.position;
            for(let i = 0; i < p.count; i++){
                const x = p.getX(i), y = p.getY(i), t = y / len;
                p.setZ(i, p.getZ(i) + cup * t * t + Math.abs(x) * cup * 0.8);
            }
            g.computeVertexNormals();
            return g;
        }
    }["usePetalGeometry.useMemo"], [
        len,
        width,
        cup
    ]);
};
_s23(usePetalGeometry, "nwk+m61qLgjDVUp4IGV/072DDN4=");
const HeroFlower = ()=>{
    _s24();
    const head = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const petal = usePetalGeometry(0.5, 0.16, 0.18);
    const curve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeroFlower.useMemo[curve]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-0.1, 1.2, 0.05),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-0.35, 2.3, 0.15)
            ])
    }["HeroFlower.useMemo[curve]"], []);
    const stem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeroFlower.useMemo[stem]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](curve, 48, 0.02, 10, false)
    }["HeroFlower.useMemo[stem]"], [
        curve
    ]);
    const leaf = usePetalGeometry(0.45, 0.12, 0.1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "HeroFlower.useFrame": ({ clock })=>{
            if (head.current) head.current.rotation.z = 0.25 + Math.sin(clock.elapsedTime * 0.7) * 0.04;
        }
    }["HeroFlower.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            -2.55,
            FLOOR,
            0.95
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: stem,
                material: mat.chrome,
                castShadow: true
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 868,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: leaf,
                material: mat.chrome,
                position: [
                    -0.06,
                    0.8,
                    0.02
                ],
                rotation: [
                    0.4,
                    0.3,
                    0.9
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 869,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: leaf,
                material: mat.chrome,
                position: [
                    -0.08,
                    1.25,
                    0.04
                ],
                rotation: [
                    0.3,
                    -0.4,
                    -0.8
                ],
                scale: 0.8
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 870,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: head,
                position: curve.getPoint(1),
                rotation: [
                    0.55,
                    0,
                    0.25
                ],
                children: [
                    Array.from({
                        length: 8
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            geometry: petal,
                            material: mat.chrome,
                            rotation: [
                                Math.PI / 2 - 0.25,
                                0,
                                i / 8 * Math.PI * 2
                            ],
                            castShadow: true
                        }, i, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 873,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    Array.from({
                        length: 8
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            geometry: petal,
                            material: mat.chrome,
                            scale: 0.6,
                            rotation: [
                                Math.PI / 2 - 0.85,
                                0,
                                (i + 0.5) / 8 * Math.PI * 2
                            ]
                        }, `in${i}`, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 876,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        material: mat.knob,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.075,
                                32,
                                16
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/lab/Machine3D.jsx",
                            lineNumber: 878,
                            columnNumber: 43
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 878,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 871,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 867,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s24(HeroFlower, "97XDEtFaLNsDsQi8r3ARNC80OyY=", false, function() {
    return [
        usePetalGeometry,
        usePetalGeometry,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c26 = HeroFlower;
// A loose flock crossing the low sun: two-plane silhouettes that flap and drift.
const Birds = ()=>{
    _s25();
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const birds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Birds.useMemo[birds]": ()=>Array.from({
                length: 7
            }, {
                "Birds.useMemo[birds]": (_, i)=>({
                        x: -48 + rand(i + 500) * 26,
                        y: 2.5 + rand(i + 510) * 3.5,
                        z: -85 - rand(i + 520) * 20,
                        s: 1.3 + rand(i + 530) * 0.7,
                        ph: rand(i + 540) * 6
                    })
            }["Birds.useMemo[birds]"])
    }["Birds.useMemo[birds]"], []);
    const wing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Birds.useMemo[wing]": ()=>{
            const sh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"]();
            sh.moveTo(0, -0.08);
            sh.quadraticCurveTo(0.6, 0.1, 1.25, -0.02);
            sh.quadraticCurveTo(0.6, -0.02, 0, 0.08);
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShapeGeometry"](sh);
        }
    }["Birds.useMemo[wing]"], []);
    const ink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Birds.useMemo[ink]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: "#3a2a26",
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
                fog: false
            })
    }["Birds.useMemo[ink]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Birds.useFrame": ({ clock })=>{
            const t = clock.elapsedTime;
            refs.current.forEach({
                "Birds.useFrame": (g, i)=>{
                    if (!g) return;
                    const b = birds[i];
                    g.position.set((b.x + t * 1.6 + 60) % 120 - 60, b.y + Math.sin(t * 0.7 + b.ph) * 0.6, b.z);
                    const flap = 0.25 + Math.sin(t * 6 + b.ph) * 0.45;
                    g.children[0].rotation.z = flap;
                    g.children[1].rotation.z = Math.PI - flap;
                }
            }["Birds.useFrame"]);
        }
    }["Birds.useFrame"]);
    return birds.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
            ref: (g)=>refs.current[i] = g,
            scale: b.s,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    geometry: wing,
                    material: ink
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 908,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    geometry: wing,
                    material: ink
                }, void 0, false, {
                    fileName: "[project]/src/lab/Machine3D.jsx",
                    lineNumber: 909,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, i, true, {
            fileName: "[project]/src/lab/Machine3D.jsx",
            lineNumber: 907,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)));
};
_s25(Birds, "R5MJLFYqE35o0KwTOrEl99TUXkY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c27 = Birds;
/* ---------------------------------------------------------------- ocean */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__e__as__extend$3e$__["extend"])({
    Water: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$objects$2f$Water$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Water"]
});
const Ocean = ()=>{
    _s26();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const normals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"])("/textures/waternormals.jpg");
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Ocean.useMemo[geo]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](600, 600)
    }["Ocean.useMemo[geo]"], []);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Ocean.useMemo[config]": ()=>{
            normals.wrapS = normals.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"];
            return {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: normals,
                sunDirection: SUN.clone(),
                sunColor: 0xffa860,
                waterColor: 0x0b2c38,
                distortionScale: 2.4,
                fog: true
            };
        }
    }["Ocean.useMemo[config]"], [
        normals
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Ocean.useFrame": (_, dt)=>{
            if (!ref.current) return;
            ref.current.material.uniforms.time.value += dt * 0.35;
            ref.current.material.uniforms.sunDirection.value.copy(sunDir);
        }
    }["Ocean.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("water", {
        ref: ref,
        args: [
            geo,
            config
        ],
        "rotation-x": -Math.PI / 2,
        position: [
            0,
            SEA,
            0
        ]
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 934,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s26(Ocean, "5N3BmK1EIpM2xEupOnV2X7LLFzc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTexture"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c28 = Ocean;
// Sky + key light track the animated sun.
const SunRig = ({ light })=>{
    _s27();
    const sky = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "SunRig.useFrame": ()=>{
            sky.current?.material.uniforms.sunPosition.value.copy(sunDir).multiplyScalar(100);
            light.current?.position.copy(sunDir).multiplyScalar(30);
        }
    }["SunRig.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Sky$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sky"], {
        ref: sky,
        sunPosition: SUN.clone().multiplyScalar(100),
        distance: 4000,
        turbidity: 2.6,
        rayleigh: 1.3,
        mieCoefficient: 0.0012,
        mieDirectionalG: 0.96
    }, void 0, false, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 944,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s27(SunRig, "9HqYZuecpxS6SVzu/XYqbX/jKug=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c29 = SunRig;
/* ---------------------------------------------------------------- camera */ // The intro camera: a curve, not a straight glide. Low over the water → arc around the island's side →
// rise past the rocky underside → push in to the machine. Held on the first frame until the visitor enters.
const PATH = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](7, -7.6, 44),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-14, -6.2, 30),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-13, -3.2, 17),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-4, 1.8, 15),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](1.5, 1.3, 12.8)
], false, "centripetal");
const LOOK = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -3.2, 0),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -4.4, 0),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -3.6, 0),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -1.4, 0),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-0.2, -0.95, 0)
], false, "centripetal");
const INTRO_SECONDS = 7;
const Rig = ({ entered, hold, dof, onBooted, onStart })=>{
    _s28();
    const t0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const done = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const pos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Rig.useMemo[pos]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()
    }["Rig.useMemo[pos]"], []);
    const look = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Rig.useMemo[look]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()
    }["Rig.useMemo[look]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "Rig.useFrame": ({ clock, camera, pointer })=>{
            if (t0.current === null) onStart?.(); // first rendered frame with everything loaded
            if (t0.current === null && entered && !hold) t0.current = clock.elapsedTime + 0.9; // a beat after Enter
            const t = t0.current === null ? 0 : Math.max(0, clock.elapsedTime - t0.current);
            const k = Math.min(t / INTRO_SECONDS, 1);
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // ease in-out cubic
            PATH.getPoint(e, pos);
            LOOK.getPoint(e, look);
            // handheld: a little drift while travelling, none on arrival
            const shake = Math.sin(Math.PI * e) * 0.06;
            pos.x += Math.sin(clock.elapsedTime * 0.9) * shake;
            pos.y += Math.sin(clock.elapsedTime * 1.3 + 1) * shake;
            pos.x += pointer.x * 0.8 * e;
            pos.y += pointer.y * 0.3 * e; // parallax once arrived
            camera.position.lerp(pos, 0.12);
            camera.lookAt(look);
            // portrait screens: widen the lens so the island fits
            const fov = camera.aspect < 0.9 ? 48 : 32;
            if (camera.fov !== fov) {
                camera.fov = fov;
                camera.updateProjectionMatrix();
            }
            setSunElevation(0.07 - 0.035 * e); // the sun sinks while we travel
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lab$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].swell(k > 0 && k < 1 ? k : 0);
            if (dof.current) dof.current.bokehScale = 2.2 * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(e, 0.85, 1); // focus pull on arrival
            if (k === 1 && !done.current) {
                done.current = true;
                onBooted();
            }
        }
    }["Rig.useFrame"]);
    return null;
};
_s28(Rig, "LKmTK/atN1OM8daGVs59qgNIuWw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c30 = Rig;
/* ---------------------------------------------------------------- scene */ // No repeats until every world has been seen this session, then start over.
const pickWorld = ()=>{
    const seen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSeen"])();
    let pool = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"].filter((w)=>!seen.includes(w.id));
    if (pool.length === 0) pool = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"];
    const w = pool[Math.floor(Math.random() * pool.length)];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSeen"])(pool === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"] ? [
        w.id
    ] : [
        ...seen,
        w.id
    ]);
    return w;
};
function Machine3D({ entered = false, hold = false, onSpin, onArrive, onReady, onLand }) {
    _s29();
    const [spin, setSpin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // { id, world: index, worldId }
    const [spinning, setSpinning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pulled, setPulled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [booted, setBooted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dof = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pull = ()=>{
        if (spinning || !booted) return;
        const w = pickWorld();
        setPulled(true);
        setSpinning(true);
        onSpin?.(true, w);
        setSpin((prev)=>({
                id: (prev?.id ?? 0) + 1,
                world: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"].indexOf(w),
                worldId: w.id
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lab$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].ratchet();
        setTimeout(()=>setPulled(false), 260);
        setTimeout(()=>{
            setSpinning(false);
            onSpin?.(false, w);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lab$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].chime();
            onLand?.(w.id);
        }, reelDuration(2) * 1000 + 150);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Machine3D.useEffect": ()=>{
            const onKey = {
                "Machine3D.useEffect.onKey": (e)=>{
                    if ((e.key === " " || e.key === "Enter") && !e.target.closest?.("button, a, input")) {
                        e.preventDefault();
                        pull();
                    }
                }
            }["Machine3D.useEffect.onKey"];
            window.addEventListener("keydown", onKey);
            window.addEventListener("pexe:pull", pull); // the page's "Pull the lever" button
            return ({
                "Machine3D.useEffect": ()=>{
                    window.removeEventListener("keydown", onKey);
                    window.removeEventListener("pexe:pull", pull);
                }
            })["Machine3D.useEffect"];
        }
    }["Machine3D.useEffect"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
        shadows: true,
        dpr: [
            1,
            LITE ? 1.25 : 2
        ],
        camera: {
            position: [
                7,
                -7.6,
                44
            ],
            fov: 32,
            far: 1000
        },
        gl: {
            antialias: true,
            toneMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"],
            toneMappingExposure: 0.36
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SunRig, {
                light: key
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1034,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fog", {
                attach: "fog",
                args: [
                    "#e7b493",
                    60,
                    340
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1035,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GlassSurface, {}, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1036,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: null,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Island, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1039,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Grass, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1040,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Vegetation, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1041,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Rocks, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1042,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Ocean, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1043,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Underside, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1044,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Roots, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1045,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FlowerCarpet, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1046,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroFlower, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1047,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Birds, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1048,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CloudBank, {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1049,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Rig, {
                        entered: entered,
                        hold: hold,
                        dof: dof,
                        onStart: onReady,
                        onBooted: ()=>{
                            setBooted(true);
                            onArrive?.();
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1051,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1038,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Plinth, {}, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1053,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Machine, {
                spinning: spinning,
                spin: spin,
                pulled: pulled,
                booted: booted,
                onPull: pull
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1054,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactShadows"], {
                position: [
                    0,
                    FLOOR + 0.01,
                    0
                ],
                opacity: 0.6,
                scale: 12,
                blur: 2.4,
                far: 4
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1055,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                ref: key,
                position: SUN.clone().multiplyScalar(30).toArray(),
                intensity: 3.4,
                color: "#ff9e5e",
                castShadow: true,
                "shadow-mapSize": [
                    2048,
                    2048
                ],
                "shadow-camera-left": -9,
                "shadow-camera-right": 9,
                "shadow-camera-top": 9,
                "shadow-camera-bottom": -9,
                "shadow-bias": -0.0003
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1058,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    4,
                    5,
                    10
                ],
                intensity: 1.4,
                color: "#a9bfdc"
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1061,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hemisphereLight", {
                args: [
                    "#ffd6b8",
                    "#24302c",
                    0.35
                ]
            }, void 0, false, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1062,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Environment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Environment"], {
                files: "/hdri/kiara_8_sunset_1k.hdr",
                environmentIntensity: 1.4,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Lightformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Lightformer"], {
                        form: "rect",
                        intensity: 2,
                        position: [
                            0,
                            6,
                            6
                        ],
                        "rotation-x": Math.PI / 2,
                        scale: [
                            10,
                            3,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1066,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Lightformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Lightformer"], {
                        form: "rect",
                        intensity: 1.5,
                        position: [
                            -6,
                            2,
                            4
                        ],
                        "rotation-y": Math.PI / 3,
                        scale: [
                            2,
                            6,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1067,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1065,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EffectComposer"], {
                multisampling: LITE ? 0 : 4,
                children: [
                    LITE ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {}, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1072,
                        columnNumber: 25
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DepthOfField"], {
                        ref: dof,
                        worldFocusDistance: 13,
                        worldFocusRange: 7,
                        bokehScale: 0
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1072,
                        columnNumber: 33
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bloom"], {
                        mipmapBlur: true,
                        luminanceThreshold: 7,
                        intensity: 0.45,
                        radius: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1073,
                        columnNumber: 17
                    }, this),
                    "  ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vignette"], {
                        offset: 0.3,
                        darkness: 0.55
                    }, void 0, false, {
                        fileName: "[project]/src/lab/Machine3D.jsx",
                        lineNumber: 1074,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/lab/Machine3D.jsx",
                lineNumber: 1070,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/lab/Machine3D.jsx",
        lineNumber: 1031,
        columnNumber: 9
    }, this);
}
_s29(Machine3D, "Rdod21D3Uz9qBN/ZMyqm1macP7A=");
_c31 = Machine3D;
[
    "fern_02"
].forEach((n)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"].preload(`/models/${n}/${n}.gltf`));
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22, _c23, _c24, _c25, _c26, _c27, _c28, _c29, _c30, _c31;
__turbopack_context__.k.register(_c, "Reel");
__turbopack_context__.k.register(_c1, "Tube");
__turbopack_context__.k.register(_c2, "Internals");
__turbopack_context__.k.register(_c3, "Gear");
__turbopack_context__.k.register(_c4, "Fan");
__turbopack_context__.k.register(_c5, "Spring");
__turbopack_context__.k.register(_c6, "Counter");
__turbopack_context__.k.register(_c7, "Mechanism");
__turbopack_context__.k.register(_c8, "Lever");
__turbopack_context__.k.register(_c9, "Leds");
__turbopack_context__.k.register(_c10, "Case");
__turbopack_context__.k.register(_c11, "GlintSweep");
__turbopack_context__.k.register(_c12, "Machine");
__turbopack_context__.k.register(_c13, "GlassSurface");
__turbopack_context__.k.register(_c14, "Plinth");
__turbopack_context__.k.register(_c15, "Underside");
__turbopack_context__.k.register(_c16, "HangingRock");
__turbopack_context__.k.register(_c17, "Roots");
__turbopack_context__.k.register(_c18, "Island");
__turbopack_context__.k.register(_c19, "Grass");
__turbopack_context__.k.register(_c20, "Plant");
__turbopack_context__.k.register(_c21, "Vegetation");
__turbopack_context__.k.register(_c22, "Boulder");
__turbopack_context__.k.register(_c23, "Rocks");
__turbopack_context__.k.register(_c24, "CloudBank");
__turbopack_context__.k.register(_c25, "FlowerCarpet");
__turbopack_context__.k.register(_c26, "HeroFlower");
__turbopack_context__.k.register(_c27, "Birds");
__turbopack_context__.k.register(_c28, "Ocean");
__turbopack_context__.k.register(_c29, "SunRig");
__turbopack_context__.k.register(_c30, "Rig");
__turbopack_context__.k.register(_c31, "Machine3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lab/Machine3D.jsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/lab/Machine3D.jsx [app-client] (ecmascript)"));
}),
"[project]/src/shell/storage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LAST_KEY",
    ()=>LAST_KEY,
    "SEEN_KEY",
    ()=>SEEN_KEY,
    "getLast",
    ()=>getLast,
    "getSeen",
    ()=>getSeen,
    "setLast",
    ()=>setLast,
    "setSeen",
    ()=>setSeen
]);
// Storage can throw (private mode, blocked site data). Failing = behave like a first visit.
const safe = (fn, fallback)=>{
    try {
        return fn();
    } catch  {
        return fallback;
    }
};
const LAST_KEY = "pexe:last";
const SEEN_KEY = "pexe:seen";
const getLast = ()=>safe(()=>localStorage.getItem(LAST_KEY), null);
const setLast = (id)=>safe(()=>localStorage.setItem(LAST_KEY, id));
const getSeen = ()=>safe(()=>JSON.parse(sessionStorage.getItem(SEEN_KEY)) ?? [], []);
const setSeen = (ids)=>safe(()=>sessionStorage.setItem(SEEN_KEY, JSON.stringify(ids)));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1uyhg_-guvuy6._.js.map