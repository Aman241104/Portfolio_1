# 3D QA Report (`2026-11-15`)

- **Build Verification:** `npm run build` passed in `8.75s` after `cinematography.js`, `Studio.jsx`, and `MachineModel.jsx` updates.
- **Visual & Interactive Checks (Verified on `http://localhost:5173/`):**
  - Dark & Light mode 1:1 match-cut framing on desktop (`1440×900`) and mobile (`390×844`) verified with zero collisions and zero console errors.
  - Lever pull (`PULL THE LEVER →`) verified end-to-end (`idle` → `transitioning` → `?style=editorial`).
  - `RIDE` (`?style=ride`) verified with `0` console errors and improved `.rd-top` sky contrast.
- **Note:** `src/three/cinematography.js` refactor was build-verified (`8.75s`); run `npm run dev` or `npm run preview` for interactive shot inspection on `/lab/machine.html` as desired.
