# AGENTS.md — Unified Antigravity + Claude Code Co-Working System (`Portfolio_1`)

> **Single Source of Truth for Both Agents (updated `2026-11-17`):**
> This file (`AGENTS.md`, symlinked as `CLAUDE.md` and `GEMINI.md`) is loaded automatically by **Google Antigravity** and **Anthropic Claude Code** whenever either agent opens `/home/whoever/personal-project/Portfolio_1`.
> Whenever you complete a task, phase, or architectural decision, **update both**:
> 1. [`docs/AWWWARDS_PHILOSOPHY.md`](docs/AWWWARDS_PHILOSOPHY.md) (**the governing design philosophy**), [`docs/PX02_PRODUCTION_PLAN.md`](docs/PX02_PRODUCTION_PLAN.md) & [`docs/LIGHT_MODE_AND_TRANSITION_VISION.md`](docs/LIGHT_MODE_AND_TRANSITION_VISION.md)
> 2. Claude's persistent memory files in `/home/whoever/.claude/projects/-home-whoever-personal-project/memory/` AND `/home/whoever/.claude/projects/-home-whoever-personal-project-Portfolio-1/memory/`

---

## 1. Project Identity & Architecture

- **Owner:** Aman Patel (Full-Stack & 3D Web Engineer, Ahmedabad, India — `amanpatel2512006@gmail.com`)
- **Live Production URL:** `https://www.aman-patel.me` (auto-deploys from `main` on Vercel)
- **Active Era:** `PX-01 / PX-02` — Elevating the `PX-01` "Multiverse Portfolio Machine" to an **Awwwards Site of the Day / Site of the Month** standard by preserving 100% of its industrial hardware focus ("One Object, Lit" + "4 Tokens, One Accent").
- **Core Stack:** Vite 7 + React 19 + Three.js (`0.186`) + `@react-three/fiber` + `@react-three/drei` + `gsap`.

### Key Repository Map
- `src/App.jsx` — Root URL controller (`?style=<id>`), lazy-loads all 12 worlds, mounts persistent `<CoinSlot />` & `<WorldBoundary />`.
- `src/home/Printer.jsx` + `src/home/printout.css` — **"The Machine Prints It"** below-the-fold system: one thermal-paper strip (`.printout`, black film in Dark / white stock in Light), fixed `PrintHead`, `Perf` tear lines, project tickets with `Barcode` + stamp.
- `src/home/Home.jsx` + `src/home/home.css` — Flagship hero & below-the-fold catalogue (`<Studio />`, `<ThemeToggle />`, `<SoundToggle />`, `<Marquee />`, `<Stats />`, `<Work />`, `<Maintained />`, `<Experience />`, `<Skills />`, `<Tape />`, `<DotField />`, `<SignOff />`).
- `src/home/Studio.jsx` — R3F 3D Canvas, weighted `Entrance` drop (`y = 9`, `1.5π` spin), `KeyLight`, `AtelierRig` (with the cohesive floating metallic sphere at `[-5.15, -1.12, -1.2]`), `Ground` with procedural Sidi Saiyyed *jali* floor light/shadow (`jaliTexture`), and `Keychains`.
- `src/machine/MachineModel.jsx` — 3D physical clear-case slot machine (`mat.shell`, `mat.chrome`, `mat.black`, `mat.pcb`, 3 spinning drums, pull lever, printed ticket).
- `src/home/Keychains.jsx` — 4 exhibition square charms (`UI-01 / REACT`, `LANG-02 / TYPESCRIPT`, `RUNTIME-03 / NODE.JS`, `ENGINE-04 / THREE.JS`) hanging at identical coordinates across both modes.
- `src/home/DotField.jsx` — 70k-point interactive WebGL dust dunes + morphing code glyphs (`</>`, `{ }`, `AP`, `>_`).
- `src/worlds/registry.js` — Registry of all 12 portfolio worlds (`ride` featured first, `desktop`, `editorial`, `terminal`, `album`, `mission`, `ask`, `canvas`, `pocket`, `longhorn`, `y2001`, `arcade`).
- `content/profile.js` & `content/work.js` — Single source of truth for bio, socials, stats, and all **26 real shipped projects**.

---

## 2. Locked Visual Direction & Non-Negotiable Taste Rules (`docs/LIGHT_MODE_AND_TRANSITION_VISION.md`)

### Rule 1: 1:1 Cinema Match-Cut Architecture (`Dark Studio ↔ Light Gallery Atelier`)
- **Zero Layout Shift Between Modes:** Every single element in the Hero (`AMAN® / FULL-STACK ENGINEER / ● AHMEDABAD, INDIA`, center pill `✦ PX-01 -- REALITY SELECTOR`, circular waveform `SoundToggle`, the 4 hanging `Keychains`, the floating metallic sphere at `[-5.15, -1.12, -1.2]`, the `"Creative Developer"` + `[ EXPERIMENTAL PORTFOLIO ]` callout at `left: 6.2vw; top: 53.5%`, the outline pill `PULL THE LEVER →` + `JUST SHOW ME THE WORK` at `right: 6.2vw; top: 47%`, the monumental `"Portfolio"` wordmark + red `"Aman Patel"` signature, the sculpted `<svg className="hero-ridge">`, and the bottom editorial bar `01 / 07 | One developer...`) occupies the **exact same pixel coordinates, sizes, and DOM tree** in both Dark Mode and Light Mode.
- When toggling `Dark ↔ Light`, **only** the colors, lighting, surface materials, and font-family (`"Geist"` in Dark Mode ↔ `"Playfair Display"` Didone serif in Light Mode) transform across the match-cut.

### Rule 2: Cohesive 3D Materials Across Both Modes
- **Dark Mode ("Dark Studio" — Default):**
  - `--void: #050506` | `--bone: #edeae3` | `--smoke: #8a8780` | `--signal: #ff2e1f`
  - Sculpted dark obsidian ridge (`#111114 → #050506`) + subtle atmospheric `.dark-floor-fog`.
  - 4 black-enamel charms with glowing brand logos (`Keychains.jsx`).
  - Floating sphere on the left in **Glowing Crimson-Red Anodized Metal (`#ff2214`)** (`Studio.jsx`).
- **Light Mode ("Gallery Atelier" — `.home[data-light]`):**
  - `--void: #ebe8e2` | `--bone: #141416` | `--smoke: #64615b` | `--signal: #e62117`
  - Sculpted alabaster/limestone ridge (`#faf9f6 → #e2dfd8`) + monumental `"Portfolio"` wordmark and section headers in **`Playfair Display` (weight 800)**.
  - 4 frosted silver/optical-glass charms with deep carbon ink logos (`Keychains.jsx`).
  - Floating sphere on the left in **Bright Polished Silver-Chrome (`#f4f2ee`)** (`Studio.jsx`).
  - In `DotField.jsx`, the 70k particle dunes shift to **deep carbon iron-filings (`#141417`)** with **`#ff2e1f` vermilion code glyphs** on warm paper.

### Rule 3: Guaranteed 60fps SVG Fractal Ink-Bleed Overlay (`Dark ↔ Light`)
- Triggered from the minimal `11px Geist Mono` text link (`Light` / `Dark` with a `6px` status dot, or pressing `T`) right beside the clock in the top bar.
- Uses an explicit fullscreen `<svg className="ink-bleed-overlay">` with `<filter id="px01-ink-filter">` (`<feTurbulence type="fractalNoise" baseFrequency="0.014 0.018" numOctaves="4">` + `<feDisplacementMap scale="135">`) and two expanding concentric `<circle>` waves (`ink-bleed-red` in `#ff2e1f` + `ink-bleed-body` in `#ebe8e2` / `#050506`) that expand organically from the click coordinates `(x, y)` over `1.15s`, flipping `light` at `420ms` when the screen is covered.

### Rule 4: Content & Glass Integrity
- **Zero Random Floating Ruins on Home:** External 3D environment assets (`public/models/bk/`) belong **exclusively** inside terrain-grounded worlds like **`RIDE` (`?style=ride`)**.
- **No Unshipped Claims:** Only list the 26 confirmed projects in `content/work.js`.
- **Recruiter Fast Path:** Résumé (`Aman_Patel_Resume.pdf`), Email, GitHub, and All 26 Projects must always be reachable within **1–2 clicks**.

---

## 3. Shared Skills & Next Priorities

### Active Skills (`.agents/skills/<name>/SKILL.md`)
- `modern-web-guidance`, `avoid-ai-design`, `design-taste`, `reference-driven-design`, `high-end-visual-design`, `site-motion-excellence-director`, `web-motion-auditor`, `genjutsu-cast`, `genjutsu-paint`, `chrome-devtools`.

### Governing Philosophy — "The Machine Prints It" (`2026-11-17`, chosen by Aman)
Below the hero, everything is ONE strip of thermal paper fed out of PX-01 through a print head pinned to the screen bottom. Sections are print jobs (`Output 0X · Readout / Tickets / Live telemetry / Service log / Calibration / Parts list`), separated by perforations, ending torn off above the *Insert coin* contact. Full rules: `docs/AWWWARDS_PHILOSOPHY.md`. Hero: keep every element (Aman, 2026-11-17); only the bottom bar was slimmed to 5 links.

### Working Model
Claude Code builds. The `agy` CLI is the critic (`agy -p "<read-only brief>" --mode plan --sandbox --dangerously-skip-permissions`). Motion skills installed: `/motion` (+ `motion` MCP at mcp.motion.dev), Emil Kowalski's `animate`, `choreograph`, `review-animations`, `improve-animations`, `animation-performance`, plus existing `gsap-*`, `hyperframes`, `motion-design-studio`.

### Next Build Queue
1. Printout wave 2: Service log (Experience), Parts list BOM (Skills), Calibration slips (Certs), Insert-coin contact receipt.
2. Scroll-linked 3D camera into the print head; ticket-feed world transitions.
3. World-by-World Upgrade Pass (`src/worlds/*`) — all 12 passed the 90+ gate on 2026-11-14; next pass brings each into the print language where it fits.
4. Lighthouse + 8-viewport QA; agy re-score loop until ≥ 8.5.
