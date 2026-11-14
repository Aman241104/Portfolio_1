# `RIDE` vs `bruno-simon.com` — Comparison Benchmark & Upgrade Margin

> **Purpose:** Reference benchmark comparing **Bruno Simon's 3D Vehicle Portfolio** (`https://bruno-simon.com/`, observed live running `three.js r187 webgpu`) against **Aman Patel's `RIDE` world** (`src/worlds/ride/`), establishing a concrete **Comparison Margin** and phased roadmap to elevate `RIDE` to the same S-tier craft.
> **Date:** 2026-11-14

---

## 1. Executive Scorecard (Comparison Margin)

| Dimension | `bruno-simon.com` (Target Benchmark) | `RIDE` Current (`src/worlds/ride/`) | Margin / Gap | Priority |
| :--- | :---: | :---: | :---: | :---: |
| **1. Opening Reveal & First Impression** | **98 / 100** — Glowing circular diorama island on an isometric blueprint grid, `"CLICK TO START"` + audio unlock, dynamic sky/color shift | **78 / 100** — Immediate highway spawn with HUD visible at `t=0` | **-20 pts** | **P0** |
| **2. Driving Physics & Vehicle Feel** | **97 / 100** — Full 3D rigid-body vehicle (`PhysicalVehicle`), suspension, boost, hydraulics/jump, wheel trails, `Unstuck` | **74 / 100** — Spline-rail `z` progression + lateral `x` dodge & lean angle | **-23 pts** | **P0** |
| **3. World Exploration & Interactivity** | **96 / 100** — Open 360° sandbox with smashable/pushable rigid-body props (benches, bricks, crates, fences, lanterns) | **76 / 100** — Linear highway (`route.js` stops) with non-collidable roadside scenery & orb/gate pickups | **-20 pts** | **P1** |
| **4. Foliage, Wind & Living Atmosphere** | **96 / 100** — Instanced wind-reactive grass/leaves, dynamic day/night & weather cycles, cohesive stylized cel/gradient shading | **80 / 100** — 3 strong lighting presets (`golden`, `fjord`, `sakura`), water shader, distance-culled GLBs (`[-90m, +520m]`) | **-16 pts** | **P1** |
| **5. Camera & Isometric/Chase Framing** | **95 / 100** — Elevated 3/4 isometric/chase rig with velocity look-ahead & smooth zoom | **82 / 100** — Chase camera behind bike with speed FOV/tilt | **-13 pts** | **P1** |
| **6. HUD Minimalism & Mobile Touch UX** | **95 / 100** — Minimal `menu-trigger`, `map-trigger`, contextual `Interact` / `Unstuck` touch buttons, zero HUD clutter | **84 / 100** — Telemetry `Speedo`, `StopCard`, `RouteMap`, biome pills (strong info density, slightly busy on mobile) | **-11 pts** | **P2** |
| **7. Rendering & Asset Pipeline** | **97 / 100** — `three.js r187 webgpu` + TSL shaders + `gltf-transform` / KTX2 compressed assets | **83 / 100** — Three.js `0.183` WebGL + R3F, `frames={1}` env map, clamped DPR, distance culling | **-14 pts** | **P2** |
| **8. Portfolio Clarity & Recruiter Speed** | **88 / 100** — 3D project stands + modal cards + minimap | **92 / 100** — `StopCard` + searchable/filterable `RouteMap` + direct GitHub/live/case-study links | **+4 pts (Strength)** | Preserve |
| **Overall Composite** | **95.3 / 100** | **81.1 / 100** | **-14.2 pts** | — |

---

## 2. What We Observed Live on `https://bruno-simon.com/`

1. **Preloader & Diorama Intro (`<canvas data-engine="three.js r187 webgpu">`)**:
   - Opens on a dark isometric crosshatch blueprint grid with a single glowing circular progress ring.
   - Once loaded, **only a tight circular diorama** around the red off-road truck (tree, bench, lamp post, grass tufts) is illuminated by a glowing ring on the grid, accompanied by handwritten `"CLICK TO START"` and a speaker icon.
   - Even before clicking, subtle **dynamic ambient color cycling** shifts the diorama from warm golden-peach to twilight violet.
   - Clicking unlocks Web Audio and expands the ring outward into the full 3D world — turning a loading screen into a theatrical reveal.
2. **Minimalist DOM HUD Overlay (`.game`)**:
   - Only **two persistent corner triggers**: `.menu-trigger` and `.map-trigger`.
   - Contextual **`.touch-buttons`** (`Interact`, `Unstuck`, `previous`, `next`, `open`, `close`) stay hidden on desktop and surface cleanly on touch devices or inside project zones.
   - Modals (`.modals`) and toast notifications (`.notifications`) are cleanly decoupled from the 3D canvas.
3. **Why It Feels So Good**:
   - **Cohesive stylized art direction:** Every asset shares the same warm/cool gradient palette, soft contact shadows, and custom shader lighting — zero mismatched PBR textures.
   - **Tactile feedback loop:** Tire trails on the ground, suspension squat on acceleration/braking, knockable props that react with physics impulses, and spatialized engine/impact audio.
   - **Zero wasted geometry:** Instanced foliage/grass with vertex wind + KTX2 textures keep frame times locked even with dense props.

---

## 3. Concrete Gap Analysis for `RIDE` (`src/worlds/ride/`)

### A. Opening Choreography & First Frame
- **Current:** `RIDE` drops the user directly onto the full highway with speedometer, biome switcher, and stop card immediately active.
- **Target:** Add a **Circular Diorama Intro** (or engine-ignition ring around the bike/car at `z = 0` on a blueprint/asphalt grid) with `"CLICK TO RIDE"` + Web Audio ignition unlock, expanding smoothly across the road in `~0.9s`.

### B. From "Rail Cruise" to True Tactile Driving
- **Current:** `RIDE` moves along a 1D `z` axis with smooth lateral `x` steering (`LANE_X`) and auto-cruise (`CRUISE = 13`, `MAX = 42`). Great for passive showcase, weaker for playful exploration.
- **Target (Dual Mode — Keep Recruiter Autopilot + Add Free-Drive Physics):**
  - Keep **Autopilot / Cruise** as an optional toggle (or default until user steers) so recruiters can still watch effortlessly.
  - Upgrade manual driving with **2D/3D arcade vehicle physics**: steering angle, drift slip + persistent **tire skid/dust trails**, suspension pitch/roll on throttle/brake, `Space` handbrake/drift or boost, and `R` / `Unstuck` reset.
  - Add **knockable roadside props** (traffic cones, wooden/paper lanterns, bamboo markers, crates) using lightweight client-side rigid-body impulses (e.g., `@dimforge/rapier3d-compat` or fast custom sphere/box impulse physics) so driving off-line feels alive.

### C. Stylized Lighting, Foliage & Biome Cohesion
- **Current:** `Scene.jsx` has 3 strong presets (`golden`, `fjord`, `sakura`) and `recolour` material overrides, plus distance-culled GLBs (`[-90m, +520m]`).
- **Target:**
  - Add **instanced wind-swaying grass/blossom clusters** along the road shoulder (`InstancedMesh` + vertex shader sway, single draw call).
  - Add **ground contact shadow / under-chassis AO blob** + **headlight / taillight volumetric cones** in `Kyoto Touge` night mode.
  - Add **speed-reactive particle wake** (golden dust in `Golden Hour`, mist in `Fjord`, swirling sakura petals in `Kyoto Touge`).

### D. Camera & HUD Polish
- **Current:** Tight behind-the-bike chase camera; `Speedo` + `StopCard` + preset bar can crowd `390x844` mobile viewports.
- **Target:**
  - Add a **camera angle toggle** (`Chase` ↔ `3/4 Isometric` inspired by Bruno Simon) with smooth velocity look-ahead.
  - On mobile (`<= 760px`), collapse telemetry into a compact pill + contextual `Interact` / `Map` / `Autopilot` touch buttons.

---

## 4. Phased Upgrade Roadmap (`RIDE` v2)

- **Phase R1 — Diorama Reveal & Camera Polish:**
  - Shader/ring reveal at `z = 0` (`"CLICK TO RIDE"` + Web Audio unlock).
  - Velocity-based camera look-ahead + `Chase / 3/4 Isometric` camera toggle.
- **Phase R2 — Tactile Vehicle Feel & Trails:**
  - Suspension pitch/roll, tire skid/dust ribbon trails, boost (`Shift`), and smooth handbrake drift.
  - Preserve 1-click `Autopilot` + `RouteMap` so all 26 projects remain effortless to browse.
- **Phase R3 — Interactive Props & Instanced Foliage:**
  - Single-draw-call `InstancedMesh` wind-animated roadside grass & sakura petals.
  - Lightweight physics-reactive cones, lanterns, and crates near stops.
- **Phase R4 — Asset Compression & WebGPU Readiness:**
  - Run `gltf-transform` (Draco + KTX2) on `public/models/bk/*.glb` to cut payload & GPU upload stalls.
  - Keep WebGL2 fallback rock-solid on mobile (`dpr={[1, 1.5]}`).
