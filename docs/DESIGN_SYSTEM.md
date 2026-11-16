# Design System (`PX-01`)

- **Color Tokens:**
  - Dark Studio: `--void: #050506`, `--bone: #edeae3`, `--smoke: #8a8780`, `--signal: #ff2e1f`.
  - Light Atelier: `--void: #ebe8e2`, `--bone: #141416`, `--smoke: #64615b`, `--signal: #e62117`.
- **Typography Scale:**
  - Display: `"Geist"` (800, Dark) / `"Playfair Display"` (800, Light) via `clamp(88px, 19vw, 360px)`.
  - Signature/Annotations: `"Homemade Apple"` cursive.
  - Technical Labels: `"Geist Mono"` (`10px–11.5px`, uppercase, `letter-spacing: 0.12em–0.2em`).
  - Body: `"Geist"` (`14px–17px`).
- **Motion & Interaction:**
  - `prefers-reduced-motion: reduce` disables float, sparkles, marquee/tape animations, and skips shutter animation.
  - `:focus-visible` uses `2px solid var(--signal)` with `3px` offset.
