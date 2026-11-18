// Adaptive rendering budgets. Kept free of three.js so HTML shells (RIDE's start slip) can read the tier without
// pulling the 3D core into their critical path; cinematography.js re-exports these.
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
