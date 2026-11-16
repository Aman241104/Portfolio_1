# Motion Design System (`src/motion.js` + `src/three/cinematography.js`)

- **Shared Curves (`src/motion.js`):**
  - `ease.out`: `cubic-bezier(.16, 1, .3, 1)`
  - `ease.inOut`: `cubic-bezier(.65, 0, .35, 1)`
  - `ease.spring`: `cubic-bezier(.34, 1.56, .64, 1)`
  - `ease.snap`: `cubic-bezier(.55, 0, 1, .45)`
- **Scale:** `120ms` (micro), `240ms` (UI), `480ms` (panels/shutter), `900ms` (hero/boot).
- **Mechanical Sequence:** `idle` → `armed` → `spinning` (sequential reel locks + `sfx.tick` / `sfx.lock` + near-miss tease) → `revealed` → `transitioning` → world mount.
- **Reduced Motion:** `prefers-reduced-motion: reduce` bypasses drop/float/sparkles/shutter animations while keeping full functionality.
