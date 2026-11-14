# Cross-Portfolio Polish Benchmark & Overhaul Plan

> **Reference Sites Inspected Live (`2026-11-14`):**
> - `https://sadok.mx/` → **Target for `Pocket` (`src/worlds/pocket/`)**
> - `https://jld2nd.dev/` → **Target for `Ask Aman` (`src/worlds/ask/`)**
> - `https://mindofakira.com/` → **Target for `Album Rollout` (`src/worlds/album/`)**
> - `https://adamperlis.com/` → **Target for Glass & Chrome Movement (`Home` / `MachineModel`)**
> - `https://douglus.co/` → **Target for Motion Smoothness & Shader Restraint (`Home` / Transitions)**
> - Supporting references: `skhiladze.com`, `errormade.tech/?view=gallery`, `preymaker.com`, `get-daffed.com`, `arshawnarbabi.com`, `wallofportfolios.in` (`rezwanul-choudhury`, `jon-willington`).

---

## 1. Core Diagnosis: Why Those Sites Feel Polished vs Cluttered
1. **One Focal Anchor Per Screen:** Each viewport commits to a single unmistakable centerpiece (a spinning vinyl, a 3D Game Boy Color on a dithered rainbow ribbon, a pixel portrait + headline, a morphing liquid-chrome terminal, or a silhouette + watercolor cloud) surrounded by **60%+ intentional negative space**.
2. **Micro-Typography Discipline:** Corners carry only `10px–11px` tracked metadata (`MOA-001`, `SIDE A / SIDE B`, `© 2026`, `Archive vol.2`), never competing boxes or redundant badges.
3. **Cohesive Materiality & Audio Ritual:** Entering an experience has a tactile ritual (`ENTER WITH SOUND ›` / `ENTER WITHOUT SOUND`, `Click to power on`, `Run ↵`, `Developer Mode / Creative Mode`).

---

## 2. World-by-World Action Plan

| Target | Reference | Concrete Changes |
| :--- | :--- | :--- |
| **`Album Rollout`** (`src/worlds/album/`) | `mindofakira.com` | Replace the `"3, 2, 1"` countdown with a **`mindofakira.com`-inspired Vinyl Needle-Drop Gate**: `#08080a` void, micro-header (`AP-001` / `SIDE A / SIDE B` / `© 2026`), spinning SVG/CSS vinyl disc with cobalt/accent label, tight-tracked display title, `ENTER WITH SOUND ›` + `ENTER WITHOUT SOUND`, `"RECORD CUED. NEEDLE'S DOWN WHEN YOU ARE."`, and calmer editorial spacing across Side A / Side B / Deluxe. |
| **`Ask Aman`** (`src/worlds/ask/`) | `jld2nd.dev` | Overhaul from beige ruled-paper clutter to a **`#141414` dark editorial studio**: pixel-art Aman portrait on the left with `"Hey!"` speech bubble, bold headline + `Developer Mode` / `Recruiter JD Match` selector on the right, vertical dot navigation, and crisp dark/parchment answer cards below. |
| **`Pocket`** (`src/worlds/pocket/`) | `sadok.mx` | Add `sadok.mx`-style **dithered pixel-rainbow ribbon + starfield** backdrop, 3D-angled perspective handheld silhouette with subtle glass sheen, and a clean **"1. Turn on sound / 2. Click power or press any key"** callout before/beside the full-color 16-bit RPG cart. |
| **`Home` Glass & Chrome** (`src/home/MachineModel.jsx`, `Studio.jsx`) | `adamperlis.com` & `douglus.co` | Boost clearcoat/iridescent chrome movement & pointer-damped spring fluidity on the PX-01 case & floating sphere. |
