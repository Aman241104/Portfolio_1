# PX-01 / PX-02 Production Plan (`2026-11-13`)

## Phase 1: 1:1 Cinema Match-Cut Home Studio (`Dark Studio ↔ Light Gallery Atelier`) — COMPLETED
- **Unified 1:1 Match-Cut Geometry ([`src/home/Home.jsx`](../src/home/Home.jsx), [`src/home/home.css`](../src/home/home.css), [`src/home/Keychains.jsx`](../src/home/Keychains.jsx), [`src/home/Studio.jsx`](../src/home/Studio.jsx)):**
  - Every element in the Hero shares **100% identical DOM structure, 3D coordinates, pixel positions, and sizes** across Dark Mode and Light Mode so toggling themes produces **zero layout shift**:
    - **Top Bar:** Stacked `AMAN® / FULL-STACK ENGINEER / ● AHMEDABAD, INDIA` (left), rounded glass pill `✦ PX-01 -- REALITY SELECTOR` (center), `Light/Dark` toggle + `Clock` + `36px` circular waveform `SoundToggle` (right).
    - **4 Hanging Exhibition Charms:** `UI-01 / REACT`, `LANG-02 / TYPESCRIPT`, `RUNTIME-03 / NODE.JS`, `ENGINE-04 / THREE.JS` at identical 3D positions (`scale = 0.84`). Dark Mode renders black enamel + brand logos; Light Mode renders frosted silver/optical-glass + carbon ink logos.
    - **Cohesive Floating Sphere:** Positioned at `[-5.15, -1.12, -1.2]` in both modes — **Glowing Crimson-Red Anodized Metal (`#ff2214`)** in Dark Mode ↔ **Bright Polished Silver-Chrome (`#f4f2ee`)** in Light Mode.
    - **Mid-Left Callout:** `"Creative Developer"` script + `[ EXPERIMENTAL PORTFOLIO ]` at `left: 6.2vw; top: 53.5%` in clean open space below the left keychains.
    - **Mid-Right CTA:** Outline pill `PULL THE LEVER →` + `JUST SHOW ME THE WORK` at `right: 6.2vw; top: 47%`.
    - **Monumental `"Portfolio"` Wordmark & Red `"Aman Patel"` Signature:** Positioned at `z-index: 1` (above `.hero-ridge` at `z-index: 0`, behind `.studio` at `z-index: 2`) with identical `--word-size` and `--word-bottom`. Toggling modes shifts `"Portfolio"` between `"Geist"` (`#f3f0e8 → #d8d4cb`) in Dark Mode and `"Playfair Display"` Didone serif (`#121214 → rgba(28,28,31,0.36)`) in Light Mode.
    - **Sculpted Architectural Floor Ridge & Bottom Editorial Bar:** Driven by CSS variables (`--ridge-0/1/2`, `--rock-1/2`) so the exact same SVG ridge morphs between dark obsidian (`#111114 → #050506`) + `.dark-floor-fog` and warm alabaster (`#faf9f6 → #e2dfd8`).
- **60fps SVG Fractal Ink-Bleed Overlay:**
  - `<svg className="ink-bleed-overlay">` with `<feTurbulence>` + `<feDisplacementMap scale="135">` expands from click coordinates `(x, y)` with a `#ff2e1f` vermilion leading edge and theme body, flipping `light` at `420ms` for a seamless match-cut.

## Phase 2: World-by-World Upgrade Queue (`src/worlds/*`) — NEXT
1. **World 01 — `RIDE` (`?style=ride`):** Coastal highway & **Sakura Touge** mountain pass (`bk-sakura-blooming.glb`, `bk-torii-gate.glb`, `bk-silk-lantern.glb`).
2. **World 02 — `Desktop OS` (`?style=desktop`)**
3. **World 03 — `Editorial` (`?style=editorial`)**
4. **World 04 — `Terminal` (`?style=terminal`)**
5. **World 05 — `Album Rollout` (`?style=album`)**
6. **Worlds 06–12 (`mission`, `ask`, `canvas`, `pocket`, `longhorn`, `y2001`, `arcade`)**


---

## PX-02 Strict 90+ Gate Completion Log (`2026-11-14`)

- **All 12 Portfolio Worlds Passed `>= 90 / 100` with `0` Console Errors & `0` 404s:**
  - `ride` (`92/100`), `desktop` (`93/100`), `editorial` (`94/100`), `terminal` (`94/100`), `album` (`93/100`), `mission` (`94/100`), `ask` (`94/100`), `canvas` (`94/100`), `arcade` (`96/100`), `y2001` (`94/100`), `longhorn` (`96/100`), `pocket` (`97/100`).
- **Featured Worlds:** `ride`, `desktop`, and `terminal` marked `featured: true` in `src/worlds/registry.js`.
- **Shell, Dock & Transitions:** Upgraded `CoinSlot.jsx` dock, `WorldPicker.jsx` (searchable, filterable, scrollable across desktop & mobile), and `App.jsx` / `index.css` **PX-01 Reality Shutter** transition.
- **60fps & Distance Culling:** Removed per-frame `Environment` cubemap re-baking in `src/home/Studio.jsx`, clamped DPR, removed 26 dynamic `<pointLight>`s in `src/worlds/ride/Scene.jsx`, added distance-based visibility culling for Torii/Sakura/Lantern/Sign/Billboard clusters, and disabled heavy mobile Bloom post-processing.
- **Branding & SEO:** Custom `AP®` favicon (`public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`), `1200x630` `public/og.jpg`, and upgraded OpenGraph/Twitter/JSON-LD metadata in `index.html`.
- **`RIDE` v2 (`src/worlds/ride/`):** Added `bruno-simon.com`-inspired **Circular Diorama Reveal** (`DioramaReveal`), **`Chase` ↔ `3/4 Iso` Camera Toggle** (`C` key + HUD button), **Suspension Pitch & Under-Chassis Contact Shadow**, **Persistent Rear-Tire Ribbon Trails** (`TireTrails` single `InstancedMesh`), **Knockable Roadside Cones/Lanterns** with arcade rigid-body impulses (`KnockableProps`), and **Single-Draw-Call GPU Wind-Swaying Foliage** (`WindFoliage`).
- **`Editorial` (`src/worlds/editorial/`):** Added `errormade.tech`-inspired **`List | Gallery` View Switch**, 3-column Swiss **Gallery Grid** with hairline vertical-tick metadata (`01 | 2026 | Kind`) and Klein Blue duotone-to-color hover cards, plus live **Ahmedabad IST** clock in the masthead.

---

## PX-01 Overhaul & Visual QA Pass (`2026-11-15`)
- **Hero Framing & Collision Fixes:** Fixed `100svh` hero height (no sliced marquee peek), separated desktop orb from `"Creative Developer"` (`top: 53.5%`, `orbY: 0.44`), centered mobile `PHONE` keychains below `AMAN®` header, hid orb on narrow portrait viewports, and upgraded Light Mode silver-chrome orb material.
- **Case Study & RIDE Polish:** Removed `case.css` screenshot crop and strengthened `ride.css` `.rd-top` gradient contrast.
- **Build & Lint:** Added Vite `manualChunks` (`three-core`, `r3f-vendor`, `gsap-vendor`, `react-vendor`) and updated `eslint.config.js` ignores/R3F overrides.
- **Documentation:** Added `PROJECT_AUDIT.md`, `DESIGN_DIRECTION.md`, `RESEARCH_AND_REFERENCES.md`, `SKILLS_AND_MCP_REVIEW.md`, `DESIGN_SYSTEM.md`, `IMPLEMENTATION_LOG.md`, `PERFORMANCE_REPORT.md`, `ACCESSIBILITY_REPORT.md`, `QA_REPORT.md`, and `FINAL_COMPLETION_REPORT.md` in `docs/`.

---

## Phase 3: 3D Art Direction & Cinematic Motion Director (`2026-11-15` — COMPLETED)
1. **Shot-Based Production System & Quality Tiers ([`src/three/cinematography.js`](../src/three/cinematography.js)):** Added `QUALITY_TIERS` (`HIGH`, `BALANCED`, `LOW`) via `detectQualityTier()`, named `CAMERA_SHOTS` (`Shot 01–06`), and `LIGHTING_PRESETS` (`darkExhibition`, `whiteLaboratory`).
2. **Studio & Machine Integration ([`src/home/Studio.jsx`](../src/home/Studio.jsx), [`src/machine/MachineModel.jsx`](../src/machine/MachineModel.jsx)):** Wired quality tiers, lighting presets, and explicit GPU `.dispose()` cleanup for procedural `CanvasTexture`s and `MeshPhysicalMaterial`s.
3. **Deliverables:** `3D_ART_DIRECTION.md`, `3D_REFERENCE_LIBRARY.md`, `3D_ASSET_CATALOG.md`, `MODEL_REFINEMENT_PIPELINE.md`, `LIGHTING_SPECIFICATIONS.md`, `CAMERA_AND_FRAMING_GUIDE.md`, `MOTION_DESIGN_SYSTEM.md`, `TRANSITION_LIBRARY.md`, `3D_PERFORMANCE_REPORT.md`, `3D_QA_REPORT.md`.
4. **Next Roadmap:** See [`docs/FUTURE_IMPLEMENTATION_PLAN.md`](FUTURE_IMPLEMENTATION_PLAN.md) for Phases A–E (machine micro-details, Shot Director, View Transitions/Flip match cuts, font waterfall split, `gltf-transform` compression, ESLint zero-error clean, and Lighthouse/Playwright QA).

---

## Phase E.1 & D.1 Execution Log (`2026-11-15`)
- **Phase E.1 (ESLint Zero-Error Clean — COMPLETED):** `npm run lint` passes with `0` errors (`6` `react-refresh/only-export-components` warnings).
- **Phase D.1 (Critical-Path Google Font Splitting — COMPLETED):** Removed 7 world-only font families from `index.html` and the duplicate `@import` in `src/home/home.css`; lazy-loaded them per world (`editorial`, `album`, `terminal`, and `case.html?skin=ed`) via `useFonts` / dynamic `<link>`. Browser-verified font loading (`Newsreader`, `Schibsted Grotesk`, `Archivo`, `Russo One`, `Space Mono`, `VT323`, `IBM Plex Mono`) across all 4 routes.
- **Phase D.2 & D.3 (Chunk Splitting — COMPLETED):** Split `pdf-vendor` (`422.03 kB`), `drei-vendor` (`315.58 kB`), and `three-addons` (`35.66 kB`) in `vite.config.js`, reducing `desktop` `index` chunk from `530.98 kB` to `108.85 kB` and `r3f-vendor` from `594.69 kB` to `277.61 kB`. Every app/wrapper chunk is `< 500 kB`.
- **Phase A (Machine Micro-Details & Shot Director — COMPLETED):** Added 8 machined hex corner fasteners, a brushed-metal serial plate (`S/N 00427`), and GPU `.dispose()` cleanup on `OledReadout`/`Spring`/`Gear` in `src/machine/MachineModel.jsx`. Wired `CAMERA_SHOTS` into `src/lab/Machine3D.jsx` and added the `00 Auto`–`04 Reel` Shot Director bar in `src/lab/LabPage.jsx` (`?shot=` support).
- **Phase B (Match-Cut Transitions & Motion Debug — COMPLETED):** Added spatial match-cut expansion for `Work.jsx` → `case.html` (`openCase`), fixed `fetchPriority="high"` in `src/case/main.jsx`, and added the `?motion=debug` telemetry HUD (`src/home/MotionDebug.jsx`).
- **Phase C (RIDE Quality Tier & GLB Asset Audit — COMPLETED):** Wired `detectQualityTier()` into `src/worlds/ride/index.jsx` and `src/worlds/ride/Scene.jsx` (adaptive `dpr`, `shadows`, `antialias`, and `HIGH`-only `Bloom`). Audited `public/models/bk/*.glb`: 3 active in `RIDE` (`bk-sakura-blooming.glb` 2.2M, `bk-silk-lantern.glb` 1.6M, `bk-torii-gate.glb` 1.4M) and 3 unused (`bk-corinthian-column.glb` 1.9M, `bk-ionic-pedestal.glb` 2.1M, `bk-marble-column.glb` 856K).
- **Phase E.2 (Final Build, Lint & Browser QA — COMPLETED):** `npm run lint` (`0` errors, `6` warnings), `npm run build` (`16.80s`, all app/wrapper chunks `< 500 kB`), and Chrome DevTools MCP verification across `/`, `/?motion=debug`, `/?style=editorial`, `/?style=album`, `/?style=terminal`, `/?style=ride`, `/case.html?p=job-search-os`, `/case.html?p=job-search-os&skin=ed`, `/resume.html`, and `/lab/machine.html?shot=detail` (`0` console errors, `0` horizontal overflow).
