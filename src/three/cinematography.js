import * as THREE from "three";

/**
 * PX-01 Shot-Based Production System, Quality Tiers & Lighting Presets
 * Centralizes cinematography, lighting, and adaptive rendering budgets.
 */

export const QUALITY_TIERS = {
    high: {
        name: "HIGH",
        dpr: [1, 1.5],
        envResolution: 192,
        sparkles: 56,
        anisotropy: 8,
    },
    balanced: {
        name: "BALANCED",
        dpr: [1, 1.25],
        envResolution: 128,
        sparkles: 32,
        anisotropy: 4,
    },
    low: {
        name: "LOW",
        dpr: [1, 1],
        envResolution: 64,
        sparkles: 0,
        anisotropy: 2,
    },
};

export function detectQualityTier() {
    if (typeof window === "undefined") return QUALITY_TIERS.balanced;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;

    if (reduced || cores <= 2 || mem <= 2) return QUALITY_TIERS.low;
    if (coarse || cores <= 4 || mem <= 4) return QUALITY_TIERS.balanced;
    return QUALITY_TIERS.high;
}

export const CAMERA_SHOTS = {
    THE_REVEAL: {
        id: "shot-01-reveal",
        name: "Shot 01 · The Reveal",
        fov: 30,
        startY: 9,
        endY: 0,
        target: [0, -0.45, 0],
        durationSec: 1.1,
    },
    HERO_ESTABLISHING: {
        id: "shot-02-establishing",
        name: "Shot 02 · Hero Establishing",
        fov: 30,
        position: [0, 0.2, 12.6],
        target: [0, -0.45, 0],
    },
    THE_ORBIT: {
        id: "shot-03-orbit",
        name: "Shot 03 · Interactive Orbit",
        polar: [-0.35, 0.35],
        azimuth: [-0.9, 0.9],
        damping: 0.25,
    },
    WORLD_TRANSITION: {
        id: "shot-04-world-transition",
        name: "Shot 04 · Dark Studio ↔ White Laboratory",
        durationSec: 1.15,
        flipAtMs: 420,
    },
    THE_DETAIL: {
        id: "shot-05-detail",
        name: "Shot 05 · Mechanical Detail",
        fov: 28,
        position: [1.6, 0.35, 4.8],
        target: [0.3, -0.1, 0],
    },
    REEL_MATCH_CUT: {
        id: "shot-06-reel-match-cut",
        name: "Shot 06 · Reel Window Dive",
        position: new THREE.Vector3(0, 0.42, 3.2),
        enterPosition: new THREE.Vector3(0, 0.42, 2.4),
        target: new THREE.Vector3(0, 0.42, 0),
    },
};

export const LIGHTING_PRESETS = {
    darkExhibition: {
        keyIntensity: 340,
        keyColor: "#fff3e6",
        keyOpacity: 0.32,
        frontFillIntensity: 0.35,
        hemiIntensity: 0.12,
        hemiGround: "#000000",
        rimLeftIntensity: 2.6,
        rimLeftColor: "#cfe0ff",
        rimRightIntensity: 1.8,
        shadowOpacity: 0.45,
        poolOpacity: 1.0,
        sparklesOpacity: 0.55,
        sparklesColor: "#fff1df",
    },
    whiteLaboratory: {
        keyIntensity: 440,
        keyColor: "#fffaf0",
        keyOpacity: 0.14,
        frontFillIntensity: 1.25,
        hemiIntensity: 0.95,
        hemiGround: "#e4e2dd",
        rimLeftIntensity: 3.2,
        rimLeftColor: "#ffffff",
        rimRightIntensity: 2.4,
        shadowOpacity: 0.34,
        poolOpacity: 0.32,
        sparklesOpacity: 0.22,
        sparklesColor: "#ff2e1f",
    },
};
