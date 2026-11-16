# 3D Performance Report (`2026-11-15`)

- **Adaptive Quality Tiers (`src/three/cinematography.js` → `detectQualityTier()`):**
  - `HIGH`: `dpr: [1, 1.5]`, `envResolution: 192`, `sparkles: 56`, `anisotropy: 8`
  - `BALANCED` (coarse pointer / `<= 4` cores or `<= 4 GB` RAM): `dpr: [1, 1.25]`, `envResolution: 128`, `sparkles: 32`, `anisotropy: 4`
  - `LOW` (`prefers-reduced-motion` / `<= 2` cores or `<= 2 GB` RAM): `dpr: [1, 1]`, `envResolution: 64`, `sparkles: 0`, `anisotropy: 2`
- **GPU Memory Hygiene:** Added `.dispose()` cleanup on `Ground` procedural textures (`poolDark`, `poolLight`, `shadowDark`, `shadowLight`), `AtelierRig` `orbMat`, `Reel` `sharp`/`blur` CanvasTextures, and `Counter` `CanvasTexture`.
- **Render Loop Discipline:** `frameloop={active ? "always" : "never"}` pauses 3D rendering when offscreen; `<Environment frames={1}>` avoids per-frame cubemap re-bakes.
- **Production Build (`npm run build`):** Succeeded in `8.75s`.
