# QA Report

**Date:** 2026-11-15  
**Browser:** Chrome DevTools MCP (`http://localhost:5173/`)

## Verified Routes & Viewports
1. **Home `/` — Desktop Dark Mode (`1908×885`):** Inspected screenshot; `overflowX: false`, `hasWebGL2: true`, `0` console errors.
2. **Home `/` — Desktop Light Mode (`1440×900`):** Inspected screenshot after fixes; `01 / 07` bar sits flush at bottom (`0px` marquee peek), polished silver orb clears `"Creative Developer"`, `Portfolio` Didone serif + `Aman Patel` signature crisp.
3. **Home `/` — Mobile (`390×844`, `2x`, touch):** Inspected screenshot after fixes; `overflowX: false`, `3` keychains centered cleanly below `AMAN®` header with zero overlap, no orb collision, no marquee peek.
4. **Lever Pull Flow (`/` → `?style=editorial`):** Clicked `.pull`, verified `data-phase="transitioning"` and clean navigation to `http://localhost:5173/?style=editorial`.
5. **Case Study (`/case.html?p=job-search-os`, `1440×900`):** Inspected screenshot after fix; full dashboard screenshot renders uncropped.
6. **Résumé (`/resume.html`, `1440×900`):** Inspected screenshot; variant tabs (`Full-stack`, `Frontend / creative`, `AI products`) and `Download PDF` button render cleanly.
7. **RIDE (`/?style=ride`, `1440×900`):** Inspected screenshot; `0` console errors.

## Known Non-Blocking Console Observations
- `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` warning from Three.js `0.186.1` (used internally by R3F/drei).
