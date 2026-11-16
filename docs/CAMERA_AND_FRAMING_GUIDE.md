# Camera & Framing Guide (`src/three/cinematography.js`)

Named shot presets in `CAMERA_SHOTS`:
1. **`Shot 01 · The Reveal` (`THE_REVEAL`):** `fov: 30`, drops from `y = 9` with `1.5π` spin over `1.1s` into `target: [0, -0.45, 0]`.
2. **`Shot 02 · Hero Establishing` (`HERO_ESTABLISHING`):** Adaptive distance via `framing(aspect)` (`11.6`–`12.6+` on narrow screens so machine + lever never clip).
3. **`Shot 03 · Interactive Orbit` (`THE_ORBIT`):** `PresentationControls` (`polar: [-0.35, 0.35]`, `azimuth: [-0.9, 0.9]`, `damping: 0.25`) + subtle cursor `Lean`.
4. **`Shot 04 · World Transition` (`WORLD_TRANSITION`):** 1:1 Cinema Match-Cut (`1.15s`, theme flip at `420ms`) preserving identical 3D coordinates.
5. **`Shot 05 · Mechanical Detail` (`THE_DETAIL`):** `fov: 28`, `[1.6, 0.35, 4.8]` → `[0.3, -0.1, 0]` for close-up inspection.
6. **`Shot 06 · Reel Window Dive` (`REEL_MATCH_CUT`):** Scroll/enter push-in toward `[0, 0.42, 0]` (`z: 3.2` on scroll, `z: 2.4` on enter).
