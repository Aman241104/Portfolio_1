# Implementation Log (`2026-11-15`)

1. **Checkpoint:** Created `backup/pre-overhaul-2026-11-15` branch prior to edits.
2. **Skills Installed:** `web-design-guidelines`, `threejs-materials`, `threejs-lighting`, `threejs-shaders` in `.agents/skills/`.
3. **Hero & 3D Studio Fixes:**
   - `src/home/home.css`: Set `.hero { height: 100dvh; height: 100svh; }` to eliminate sliced marquee peeking below the `01 / 07` bar; moved `.home .creative-callout` to `top: 53.5%` to clear the floating metallic orb on desktop.
   - `src/home/Studio.jsx`: Refined `AtelierRig` orb (`y = 0.44`, `visible = aspect >= 0.85`, Light Mode `metalness: 0.94`, `roughness: 0.08`, `emissiveIntensity: 0.16`) for crisp silver-chrome reflections on desktop and clean framing on mobile.
   - `src/home/Keychains.jsx`: Centered `PHONE` keychains (`sx: -0.44, 0.0, 0.44`, `sy: 0.36, 0.39, 0.36`) below the `AMAN®` header so `AHMEDABAD, INDIA` no longer collides with `KEY-05 ENTER`.
4. **Case Study & RIDE Polish:**
   - `src/case/case.css`: Removed destructive `aspect-ratio: 16 / 10; object-fit: cover;` crop on `figure img` so full screenshots render uncropped.
   - `src/worlds/ride/ride.css`: Darkened `.rd-top` gradient (`rgba(22, 11, 4, .68)`) for crisp HUD text legibility over the golden-hour sky.
5. **Build & Lint Hygiene:**
   - `vite.config.js`: Added `manualChunks` (`three-core`, `r3f-vendor`, `gsap-vendor`, `react-vendor`).
   - `eslint.config.js`: Added `public`, `.playwright-mcp`, `scripts` to `globalIgnores` and exempted R3F 3D scene files from `react-hooks/immutability`.
