# Transition Library

1. **1:1 Cinema Match-Cut (`Home.jsx` + `home.css`):** Fullscreen `<svg className="ink-bleed-overlay">` with `<feTurbulence>` + `<feDisplacementMap scale="135">` expanding from pointer coordinates (`1.15s`, flipping theme at `420ms`) with zero layout shift.
2. **PX-01 Reality Shutter (`App.jsx` + `index.css`):** Directional world-tinted shutter (`world-portal--in` → `world-portal--out`) with two-frame settle (`requestAnimationFrame`) before reveal.
3. **Scroll Reel Dive (`Studio.jsx` `Rig`):** Smoothstep camera push-in toward `REEL_WINDOW` synced with DOM `--dive` CSS variable.
4. **Circular Diorama Reveal (`src/worlds/ride/Scene.jsx`):** Radial reveal ring on `RIDE` entry.
