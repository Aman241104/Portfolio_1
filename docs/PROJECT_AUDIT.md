# Project Audit (`Portfolio_1` / PX-01)

**Date:** 2026-11-15  
**Baseline Branch:** `backup/pre-overhaul-2026-11-15`

## 1. Repository & Route Inventory
- **Entrypoints (`vite.config.js`):**
  - `/` (`index.html` → `src/main.jsx` → `src/App.jsx`) — PX-01 Reality Selector & below-the-fold portfolio (`Home.jsx`), plus `?style=<worldId>` router for 12 interactive worlds (`ride`, `desktop`, `editorial` / `classic`, `terminal`, `album`, `mission`, `ask`, `canvas`, `arcade`, `y2001`, `longhorn`, `pocket`).
  - `/resume.html` (`src/resume/Resume.jsx`) — Single-source-of-truth résumé with `fullstack`, `frontend`, and `ai` variants (`?for=`) and A4 print-to-PDF.
  - `/case.html?p=<slug>` (`src/case/main.jsx`) — Case studies (`job-search-os`, etc.) with standard dark theme and `?skin=ed` broadsheet theme.
  - `/lab/machine.html` (`src/lab/LabPage.jsx`) — Standalone 3D machine inspection lab.

## 2. Baseline Findings (Observed via Code + Live Browser)
1. **Desktop Hero Sphere / Callout Collision (`/`):** At `1908×885` and `1440×900`, the floating metallic sphere in `Studio.jsx` (`AtelierRig`) overlapped/grazed `"Creative Developer"` (`.creative-callout` at `top: 41%`).
2. **Hero Bottom Marquee Peek (`/`):** `.hero { height: calc(100dvh - 46px); }` caused the below-the-fold marquee text to peek and get sliced underneath the `01 / 07` bottom editorial bar on both desktop and mobile.
3. **Mobile Header / Keychain Collision (`/` at `390×844`):** `PHONE` keychains (`sx: -0.62, -0.2, 0.22`) collided with `FULL-STACK ENGINEER / • AHMEDABAD, INDIA` in the top-left header, and the left floating sphere touched the PX-01 case.
4. **Light Mode Sphere Material (`Studio.jsx`):** High `emissive` + `metalness: 0.45` made the silver sphere look matte grey against `#ebe8e2` instead of polished chrome.
5. **Case Study Screenshot Crop (`case.css`):** `figure img` used `aspect-ratio: 16 / 10; object-fit: cover;`, cropping `"Good afternoon, Aman"` on `case.html?p=job-search-os`.
6. **RIDE HUD Contrast (`ride.css`):** `.rd-top` gradient (`rgba(40, 20, 8, .45)`) was light over the golden-hour sky.
7. **Build & Lint Tooling:** `vite.config.js` lacked `manualChunks` (producing a `932 kB` R3F/Three monolith); `eslint.config.js` didn't ignore `public/`, `.playwright-mcp/`, or `scripts/` and didn't exempt R3F 3D scene files from `react-hooks/immutability`.
