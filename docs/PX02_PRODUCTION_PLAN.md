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
