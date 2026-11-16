# Performance Report

**Date:** 2026-11-15  
**Build Tool:** Vite 7.2.4 (`npm run build`)

## Bundle Splitting Improvements (`vite.config.js`)
- **Before:** Monolithic `react-three-fiber.esm` chunk at `932.26 kB` (`251.65 kB` gzip); build time `10.25s`.
- **After (`manualChunks`):**
  - `three-core`: `783.10 kB` (`204.09 kB` gzip)
  - `r3f-vendor`: `594.69 kB` (`189.09 kB` gzip)
  - `react-vendor`: `192.43 kB` (`60.34 kB` gzip)
  - `gsap-vendor`: `105.15 kB` (`40.17 kB` gzip)
  - `Studio`: `19.12 kB` (`7.43 kB` gzip)
  - `MachineModel`: `29.14 kB` (`9.69 kB` gzip)
  - `DotField`: `7.68 kB` (`3.59 kB` gzip)
  - Total build time: `8.74s` (verified).

## Runtime Notes
- `Studio.jsx` uses clamped DPR (`[1, 1.25]` coarse / `[1, 1.5]` fine), `frames={1}` on `<Environment>` (no per-frame cubemap re-bake), and `frameloop={active ? "always" : "never"}`.

## Phase D Update (`2026-11-15` — Font Splitting & Sub-500kB App Chunks)
- **Google Font Critical-Path Split (`index.html`, `src/worlds/*/index.jsx`, `src/case/main.jsx`):**
  - Removed 7 world-only Google Font families (`Russo One`, `Archivo`, `Space Mono`, `VT323`, `IBM Plex Mono`, `Schibsted Grotesk`, `Newsreader`) from `index.html` and removed the duplicate `Playfair Display` `@import` from `src/home/home.css`.
  - Lazy-loaded per world via `useFonts(...)` (`editorial`, `album`, `terminal`) and dynamically in `src/case/main.jsx` when `?skin=ed` is active.
- **Refined `vite.config.js` `manualChunks` (`npm run build`, `11.47s`):**
  - `index` (`desktop` world app code): reduced from `530.98 kB` (`162.70 kB` gzip) to **`108.85 kB`** (`37.85 kB` gzip) by splitting `pdf-vendor` (`422.03 kB` / `124.85 kB` gzip).
  - `r3f-vendor`: reduced from `594.69 kB` (`189.09 kB` gzip) to **`277.61 kB`** (`82.44 kB` gzip) by splitting `drei-vendor` (**`315.58 kB`** / `107.19 kB` gzip).
  - `three-addons`: **`35.66 kB`** (`12.14 kB` gzip) split out from `three-core` (**`746.81 kB`** / `192.28 kB` gzip).
  - Every application and wrapper chunk is now `< 500 kB`.
- **Not yet measured:** Standalone Lighthouse CLI audit (Chrome DevTools MCP `lighthouse_audit` can be run during Phase E.2).
