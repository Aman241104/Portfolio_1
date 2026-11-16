# Lighting Specifications (`src/three/cinematography.js`)

Centralized in `LIGHTING_PRESETS`:
- **`darkExhibition`:** `keyIntensity: 340` (`#fff3e6`, `opacity: 0.32`), `frontFillIntensity: 0.35`, `hemiIntensity: 0.12`, `rimLeftIntensity: 2.6` (`#cfe0ff`), `rimRightIntensity: 1.8` (`#ffd6b0`), bottom-back red kicker (`1.3`, `#ff3a22`), `AgXToneMapping` (`exposure: 1.3`).
- **`whiteLaboratory`:** `keyIntensity: 440` (`#fffaf0`, `opacity: 0.14`), `frontFillIntensity: 1.25`, `hemiIntensity: 0.95` (`#e4e2dd` ground), `rimLeftIntensity: 3.2` (`#ffffff`), `rimRightIntensity: 2.4`.
- **Reflection Studio (`Studio.jsx`):** 5 `Lightformer` cards (overhead softbox, left/right chrome edge strips, lower fill, accent ring) baked once (`frames={1}`).
