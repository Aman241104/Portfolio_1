// JS mirror of the CSS motion tokens in index.css, for WAAPI / GSAP. Same curves, same scale.
export const ease = {
    out: "cubic-bezier(.16, 1, .3, 1)",
    inOut: "cubic-bezier(.65, 0, .35, 1)",
    spring: "cubic-bezier(.34, 1.56, .64, 1)",
    snap: "cubic-bezier(.55, 0, 1, .45)",
};
export const t = { 1: 120, 2: 240, 3: 480, 4: 900 };
export const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
