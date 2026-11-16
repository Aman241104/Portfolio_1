# PX-01 / PX-02 Future Implementation Plan

**Created:** 2026-11-15  
**Scope:** Full roadmap for completing the remaining creative, 3D cinematography, match-cut motion, performance, and QA engineering work across `Portfolio_1`.

---

## 0. Current Verified Baseline
- **Completed:** 1:1 Cinema Match-Cut Home (`Dark Studio ↔ Light Gallery Atelier`), hero collision & framing fixes (desktop & mobile), uncropped `case.html` screenshots, `RIDE` HUD contrast, Vite `manualChunks`, ESLint ignores/R3F overrides, `src/three/cinematography.js` (`QUALITY_TIERS`, `CAMERA_SHOTS`, `LIGHTING_PRESETS`), and GPU `.dispose()` cleanup in `Studio.jsx` & `MachineModel.jsx`.
- **Verified:** `npm run build` (`8.75s`), live browser checks on `/`, `/case.html?p=job-search-os`, `/resume.html`, `/?style=ride`, and lever pull → `/?style=editorial`.

---

## Phase A — Signature 3D Machine & Shot-Based Cinematography
**Goal:** Elevate `PX-01` from a great procedural model to a macro-inspectable manufactured instrument with directed camera shots.

1. **Micro-Detail & Surface Realism (`src/machine/MachineModel.jsx`):**
   - Add subtle procedural roughness/smudge variation map to `mat.shell` (acrylic enclosure) and brushed anisotropy grain to `mat.brushed`.
   - Add small machined corner fasteners / hex screw heads on the chassis rails and bezel plate so `Shot 05 · The Detail` rewards close-up inspection.
   - Refine reel drum edge bevels and indicator LED diffuser caps.
2. **Interactive Shot Director (`src/three/cinematography.js`, `src/home/Studio.jsx`, `src/lab/LabPage.jsx`):**
   - Wire `CAMERA_SHOTS.THE_DETAIL` and `CAMERA_SHOTS.THE_ORBIT` into `/lab/machine.html` as selectable camera presets (`Shot 01`–`Shot 06`) with smooth `THREE.MathUtils.damp` transitions.
   - Add `Shot 01 · The Reveal` macro-to-establishing dolly option on initial Studio boot (respecting `prefers-reduced-motion`).
3. **Three.js r186 `THREE.Timer` Migration:**
   - Audit `Studio.jsx` / `ride/Scene.jsx` / R3F clock usage to eliminate `THREE.Clock: This module has been deprecated` console warnings where controlled directly.

**Acceptance Gate:** Zero console warnings on `/` and `/lab/machine.html`; macro shots show clean specular edges and no z-fighting.

---

## Phase B — Match-Cut & Shared-Element Transitions
**Goal:** Make DOM, 3D, and route transitions feel like one continuous film.

1. **Shot 06 · Project Card → Case Study (`src/home/Work.jsx`, `src/case/main.jsx`):**
   - Implement View Transitions API (`document.startViewTransition`) with a GSAP Flip / clip-path fallback so clicking a project card expands its screenshot seamlessly into the `case.html` hero frame.
2. **Shot 02 · Reel Window Dive (`src/home/Studio.jsx`, `src/App.jsx`):**
   - Synchronize `REEL_MATCH_CUT` camera push-in (`z: 2.4`) with `App.jsx`'s Reality Shutter (`world-portal--in`) so entering a world feels like passing directly through the reel glass.
3. **Motion Telemetry (`src/motion.js`):**
   - Add a dev-only `?motion=debug` overlay to inspect active `data-phase` state (`idle → armed → spinning → locking → revealed → transitioning`) and transition timings.

**Acceptance Gate:** Smooth 60fps transitions with zero layout jump and full `prefers-reduced-motion` instant fallback.

---

## Phase C — World-by-World 3D & Responsive Upgrade Pass
**Goal:** Bring `QUALITY_TIERS` and responsive/a11y polish to every world.

1. **`RIDE` (`src/worlds/ride/Scene.jsx`, `src/worlds/ride/index.jsx`):**
   - Connect `detectQualityTier()` to `RIDE` DPR, shadow/fog density, and foliage instance count (`WindFoliage`).
   - Run `gltf-transform` (Draco/Meshopt + KTX2) audit on `public/models/bk/*.glb` to shrink initial 3D asset payload while keeping geometry crisp.
2. **Worlds 02–12 (`desktop`, `editorial`, `terminal`, `album`, `mission`, `ask`, `canvas`, `pocket`, `longhorn`, `y2001`, `arcade`):**
   - Verify keyboard navigation, `:focus-visible`, `prefers-reduced-motion`, and zero horizontal overflow across all 8 target viewports (`1920×1080`, `1440×900`, `1366×768`, `1024×768`, `768×1024`, `430×932`, `390×844`, `360×800`).

**Acceptance Gate:** Zero horizontal overflow and zero broken controls across all 12 worlds on desktop and mobile.

---

## Phase D — Performance, Font Waterfall & SEO Optimization
**Goal:** Hit Core Web Vitals (`LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1`) on production builds.

1. **Critical-Path Font Splitting (`index.html`, `src/worlds/fonts.js`):**
   - Keep only Home-critical fonts (`Geist`, `Geist Mono`, `Playfair Display`, `Homemade Apple`, `Instrument Serif`, and `MultiverseName` subsets) in `index.html`.
   - Lazy-load world-specific fonts (`VT323`, `Russo One`, `Space Mono`, `IBM Plex Mono`, `Newsreader`, `Schibsted Grotesk`, `Archivo`) inside `src/worlds/fonts.js` only when that world mounts.
2. **Bundle Splitting (`vite.config.js`):**
   - Inspect `index-CLA5RRdX.js` (`530.92 kB`) and lazy-load any remaining heavy non-hero utilities so every route chunk stays `< 500 kB`.
3. **Lighthouse CI Verification:**
   - Run Lighthouse against `npm run preview` (`dist/`) on `/` (desktop & mobile) and log real LCP, INP/TBT, CLS, Performance, Accessibility, and SEO scores in `docs/PERFORMANCE_REPORT.md`.

---

## Phase E — Lint Zero & Automated Multi-Viewport QA
**Goal:** Repeatable, automated regression safety.

1. **ESLint Zero-Error Clean (`src/worlds/terminal/index.jsx`, `src/worlds/ride/Scene.jsx`):**
   - Refactor `getCompletions` in `src/worlds/terminal/index.jsx` to use a static command-name list (resolving `react-hooks/refs`).
   - Clean `useMemo` dependency arrays in `src/worlds/ride/Scene.jsx` (`react-hooks/exhaustive-deps` / `preserve-manual-memoization`).
   - Verify `npm run lint` exits `0` with `0` errors.
2. **Automated Playwright QA Suite:**
   - Script automated checks across all routes (`/`, `/resume.html`, `/case.html?p=job-search-os`, `/lab/machine.html`, and all 12 `?style=<id>` worlds) at `1920×1080`, `1440×900`, `768×1024`, and `390×844`, asserting zero console errors, zero failed network requests, and zero horizontal overflow.

---

## Execution Order
1. **Phase E.1** (ESLint zero-error clean) → **Phase D.1–D.2** (Font waterfall + chunking) → **Phase A** (Machine micro-details & Shot Director) → **Phase B** (Match-cut transitions) → **Phase C** (`RIDE` quality tiers & `.glb` compression + world sweep) → **Phase D.3 & E.2** (Lighthouse + Playwright 8-viewport verification).
