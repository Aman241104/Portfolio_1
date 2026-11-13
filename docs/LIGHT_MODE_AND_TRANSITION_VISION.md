# Light Mode & Transition Vision — 1:1 Cinema Match-Cut (`PX-01 / PX-02`)

## 1. Core Principle: The 1:1 Cinema Match-Cut (`Dark Studio ↔ Light Gallery Atelier`)
When the user clicks `Light` / `Dark` (or presses `T`), the **SVG Fractal Ink-Bleed wave** sweeps across the screen and reveals the opposite mode as a **1:1 Cinema Match-Cut**:
- **Zero Layout Shift:** Not a single DOM element, button, keychain, or ridge line changes position, size, or count.
- **What Changes Across the Match-Cut:** Only **color palette, studio lighting, 3D surface materials, and typography treatment (`"Geist"` sans-serif in Dark Mode ↔ `"Playfair Display"` Didone serif in Light Mode)** transform.

## 2. Shared Element-by-Element Match-Cut Map

| Element | Shared Coordinates & Geometry | Dark Studio (`default`) | Light Gallery Atelier (`data-light`) |
| :--- | :--- | :--- | :--- |
| **Top-Left Brand** | `padding: 26px var(--gutter)`, stacked `AMAN®` (`22px`) + `FULL-STACK ENGINEER / ● AHMEDABAD, INDIA` (`10px`) | Bone white (`#edeae3`) + smoke (`#8a8780`) + vermilion dot (`#ff2e1f`) | Deep carbon (`#141416`) + warm graphite (`#3a3835`) + vermilion dot (`#e62117`) |
| **Top-Center Pill** | Rounded pill `✦ PX-01 -- REALITY SELECTOR` (`padding: 9px 22px`, `border-radius: 999px`) | Smoked obsidian glass (`rgba(18,18,22,.56)`) + bone text + red `✦` | Frosted white glass (`rgba(255,255,255,.52)`) + carbon text + black `✦` |
| **Top-Right Controls** | `ThemeToggle` + `Clock` + `36px` circular waveform `SoundToggle` | Smoked obsidian circle + bone waveform bars + red dot | Frosted white circle + carbon waveform bars + red dot |
| **4 Hanging Keychains** | `UI-01 / REACT`, `LANG-02 / TYPESCRIPT`, `RUNTIME-03 / NODE.JS`, `ENGINE-04 / THREE.JS` at `{ sx: ±0.76, sy: 0.66 }` & `{ sx: ±0.47, sy: 0.57 }`, `scale = 0.84` | Polished chrome rim + black enamel face + glowing brand logos | Brushed silver rim + frosted optical glass face + carbon ink logos |
| **Floating 3D Sphere** | `[-5.15, -1.12, -1.2]`, `r = 0.25`, gentle vertical sine float | **Glowing Crimson-Red Anodized Metal (`#ff2214`)** | **Bright Polished Silver-Chrome (`#f4f2ee`)** |
| **Mid-Left Callout** | `left: 6.2vw; top: 53.5%` — `"Creative Developer"` script + `[ EXPERIMENTAL PORTFOLIO ]` | Bone white script (`#edeae3`) + smoke mono tag | Deep carbon script (`#161618`) + graphite mono tag |
| **Mid-Right CTA** | `right: 6.2vw; top: 47%` — Outline pill `PULL THE LEVER →` + `JUST SHOW ME THE WORK` | Smoked obsidian pill (`rgba(18,18,22,.68)`) + bone border/text | Frosted white pill (`rgba(255,255,255,.66)`) + carbon border/text |
| **`"Portfolio"` Wordmark** | `--word-size: clamp(104px, 21.4vw, 410px)`, `--word-bottom: clamp(54px, 6.8vh, 80px)`, `z-index: 1` | **`"Geist"` 800** (`#f3f0e8 → #d8d4cb`) | **`"Playfair Display"` 800 Didone Serif** (`#121214 → rgba(28,28,31,0.36)`) |
| **Sculpted Floor Ridge** | `<svg className="hero-ridge">` (`z-index: 0`) | Dark obsidian ridge (`#111114 → #050506`) + basalt corner rock + `.dark-floor-fog` | Alabaster limestone ridge (`#faf9f6 → #e2dfd8`) + stone corner rock |
| **Bottom Editorial Bar** | `bottom: 20px` — `01 / 07 | One developer... | Projects · About · Skills · Experience · Contact · All Worlds | Scroll ︾` | Bone white & smoke on dark obsidian floor | Deep carbon & graphite on alabaster floor |
