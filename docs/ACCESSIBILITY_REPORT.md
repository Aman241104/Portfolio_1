# Accessibility Report

**Date:** 2026-11-15

## Verified Implementations
- **WebGL Fallback:** `App.jsx` checks `webgl2` support and falls back to `<Machine />` (CSS 3D) when WebGL 2 is unavailable.
- **Reduced Motion:** `Studio.jsx`, `Keychains.jsx`, `Home.jsx`, `App.jsx`, `home.css`, and `ride.css` respect `prefers-reduced-motion: reduce` (disabling float, sparkles, marquee/tape animations, and shutter transitions).
- **Focus & Keyboard:** `.home :focus-visible` and `.rd :focus-visible` provide high-contrast `2px` `--signal` / `--amber` focus rings; `PULL THE LEVER →` button provides keyboard/click alternative to 3D lever dragging; theme toggle supports keyboard (`T`).
- **Contrast Improvements Made:**
  - Darkened `.rd-top` sky gradient in `src/worlds/ride/ride.css` (`rgba(22, 11, 4, .68)`) for readable top-bar text over bright sky.
  - Resolved text/3D overlaps on desktop (`Creative Developer` vs orb) and mobile (`AHMEDABAD, INDIA` vs `KEY-05 ENTER`).
