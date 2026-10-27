# PORTFOLIO.exe — Design Direction

Status: **direction locked 2026-10-27 → next gate is D1 (style tile).**
Decisions: **A + B "Hardware, chrome"** · machine built from **open-source parts in code** (no hand modelling) ·
**"अमन" mark + multiverse name animation** (§4b).
Inputs: 30 live award-site captures (`references/sites/`), your Pinterest boards (`references/pinterest/`),
your taste data (`content/taste.js`), 5 generated concept renders (`references/concepts/`).

---

## 0. Honest audit of what exists now

The machine and the three worlds **work**, but they **look like a competent template**:

| Piece | Verdict | Why it reads "school project" |
|---|---|---|
| Machine | 4/10 | CSS-drawn cabinet, default Tailwind gradients, emoji-tier bulbs, no object, no light, no sound, no material. It's a *diagram* of a slot machine. |
| Editorial | 6/10 | Good bones (big type, one accent) but no imagery system, default sans, no case studies, generic section rhythm. |
| Terminal | 5/10 | Functional, but flat green-on-black with no CRT, no boot sequence and no identity. |
| Desktop | 6/10 | Polished clone of macOS. Craft, but not *yours*. |
| Shell chip | 5/10 | Generic pill nav. |

Nothing here is wrong; it's just **unauthored**. Awwwards juries score Design 40% · Usability 30% · Creativity 20% · Content 10%.
"Design" there means *a point of view executed consistently*. That's the gap.

---

## 1. What the research says (30 captures, synthesized)

What separates award sites from good sites, observed directly:

1. **One object, lit.** Teenage Engineering, Opal, Anime.js and Igloo each build the hero around *a single physical/instrument object*
   in dramatic light, surrounded by tiny, precise type. → Our machine must be **an object**, not a layout.
   (`te-1.jpg`, `animejs-1.jpg`, `opal-1.jpg`)
2. **One loud colour, everything else disciplined.** Lando: acid lime + olive black. Rauno: one yellow disc. A24: no colour, all photography.
   (`lando-1.jpg`, `rauno-1.jpg`, `a24-1.jpg`)
3. **Type does the heavy lifting.** Either *enormous* (Lando's "4", A24's headline) or *tiny and technical* (TE labels, Cappen's edge labels).
   Never medium-everything. (`cappen-1.jpg`)
4. **The loader is a brand moment.** Messenger's envelope, Zentry's Z, Igloo's dotted bar. Nobody shows a spinner. (`sheet-a-soty.jpg`)
5. **A signature gesture.** Lando's signature draws itself. Bruno's car drives. One unforgettable move per site, not ten.
6. **Copy is crafted everywhere,** even the 404: Lando's "PAGE NOT FOUND / VEERED OFF TRACK". (`lando2-1.jpg`)
7. **Restraint in UI chrome.** Navigation is tiny, edge-aligned, often monospace. The content is the interface.
8. **Real texture.** Topographic lines (Lando), CRT static (Poolsuite), photographed objects (Opal). Flat vector = template.

And from your Pinterest boards (`references/pinterest/README.md`):
oversized editorial type + one accent; chrome/inflated 3D lettering; **Devanagari display type**; matte black helmets with red or gold;
Spider-Verse red/black; "Hi, I'm …" hero patterns.

---

## 2. The idea in one line

> **PORTFOLIO.exe is a piece of hardware.** A machined object, lit like a product launch, that you pull to fall into one of Aman's worlds.

Every decision below serves that sentence.

---

## 3. Three directions (pick one)

All three concept renders are in `references/concepts/`.

### A. "HARDWARE": Teenage-Engineering-grade instrument  ← *structure*
`c1_te.jpg`. Brushed aluminium, matte black grille, engraved technical labels, single red ball lever, overhead spotlight on pure black.
Tiny mono type, part numbers, model name ("PX-01 REALITY SELECTOR"). Clicks and detents.
- ✅ Most premium, timeless, and on-concept (a machine *is* hardware). Shows design maturity.
- ⚠️ Can feel cold unless the worlds bring the warmth.

### B. "LIQUID CHROME": Y2K melt
`c2_chrome.jpg`. Inflated chrome cabinet, glowing reels, iridescent.
- ✅ Loud, fun, very on-trend with your prompt board.
- ❌ Dates fast. Chrome blobs are 2024's AI-slop default. Hard to make *yours*.

### C. "PIT LANE": helmet-finish machine  ← *material*
`c4_red.jpg`. The cabinet *is* a matte black helmet shell with red racing pinstripes and a visor-glass reel window.
- ✅ Unmistakably you: helmet wraps, racing, Spider-Verse red/black. Nobody else could make this.
- ⚠️ Must be executed as industrial design, not as a gimmick.

### ✅ Chosen: **A + B, "Hardware, chrome"**
Teenage-Engineering structure and typography (A), finished in **polished chrome** (B), not melted chrome:
**brushed-aluminium body · polished chrome trim, lever shaft and wordmark · matte black grille and reel bezels ·
one signal-red ball knob · bone-white engraved labels · spotlight on black.**
B's *liquid* chrome is held back for exactly one moment: the landing (§5). Chrome blobs everywhere = 2024 slop.
C (helmet) is not dropped from the portfolio. It becomes the material language of the **Pit Wall** world later.

---

## 4. Brand system (A + B)

### Colour (4 tokens, no gradients-as-decoration)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0B0C` | everything dark (matte black, not pure #000) |
| `--bone` | `#EDEAE3` | type on dark, light surfaces (warm, not white) |
| `--signal` | `#FF2E1F` | **one** accent: lever, pinstripe, focus ring, active state |
| `--smoke` | `#8A8780` | secondary type, hairlines at 20% |
Each world may *replace* `--signal` with its own (Editorial = Klein `#1D3BFF`, Terminal = phosphor `#9EF0A8`) but never add a second accent.

### Type (all free, Google Fonts / Vercel)
| Role | Face | Why |
|---|---|---|
| Display | **Geist** 600–800, tight tracking | Neutral industrial grotesk; not Inter, not Space Grotesk |
| Technical labels | **Geist Mono** 10–12px, uppercase, +0.12em | The TE "engraved label" voice |
| Editorial accent | **Instrument Serif** italic | One word per heading max (*Patel.*) |
| Signature mark | **Rozha One** (Devanagari) "अमन" | From your type board. Your monogram, used like a maker's stamp |
Scale: 11 / 13 / 16 / 22 / 40 / 88 / 180+. Nothing between 22 and 40 on the machine screen: tiny or huge, never medium.

### Grid and detail language
- 12-col, 24px gutters, labels aligned to edges (Cappen-style corner labels: `PX-01`, `REALITY SELECTOR`, `IN/ OUT`, live clock IST).
- Hairlines at 1px `--smoke`/20%. Radii: 2px (hardware) or full pill. Nothing at `rounded-2xl`.
- Texture: subtle film grain (2–3% noise) over everything; no glassmorphism.

Chrome is a **material**, not a colour token: it only appears on 3D surfaces (lever, trim) and on the wordmark
(rendered chrome, from an environment-mapped 3D text or a pre-rendered image). Never a CSS silver gradient.

### Voice
Short, dry, hardware-manual tone. "PULL TO SELECT REALITY." · "REEL 2 OF 3 — MEDIUM." · 404: "SIGNAL LOST / WRONG REALITY."

---

## 4b. Multiverse name: "Aman" across scripts (Spider-Verse-style)

Your name is the thread that ties the worlds together: **every world is a universe, and your name is a variant in each.**
Spider-Verse is an *aesthetic* reference only. No Sony/Marvel assets, logos or characters.

| Universe | Script | Glyphs | Font (Google, verified) | Treatment |
|---|---|---|---|---|
| Prime | Latin | AMAN | Geist 800 | clean, bone on ink |
| Home | Devanagari (Hindi) | अमन | Rozha One | signature mark, red ink |
| Roots | Gujarati | અમન | Baloo Bhai 2 | screen-print misregistration |
| Punjab | Gurmukhi | ਅਮਨ | Baloo Paaji 2 | — |
| Bengal | Bengali | আমন | Baloo Da 2 | — |
| South | Tamil | அமன் | Baloo Thambi 2 | — |
| Telugu | Telugu | అమన్ | Baloo Tammudu 2 | — |
| Tokyo | Katakana | アマン | Dela Gothic One | manga speed lines (Neo-Tokyo tie-in) |
| Seoul | Hangul | 아만 | Black Han Sans | — |
| Gulf | Arabic | أمان | Lalezar | RTL, right-aligned entry |
| East | Cyrillic | АМАН | Russo One | constructivist red/black |
(अमन confirmed by you; the rest are standard transliterations. Have a native speaker check each one before launch.)

**Animation spec (one component, `<MultiverseName />`):**
- **Animated "on twos"**: swaps step at 12 fps (`SteppedEase`), not smooth tweens. That's the Spider-Verse feel.
- **Each swap = 3 frames of glitch:** RGB split (red/cyan duplicate layers offset 2–6px), 3–5 horizontal slices displaced
  with `clip-path`, a halftone dot overlay flash, then a hard cut to the next script.
- **Hold** ~900ms per universe in the idle loop. **Hover/tap** scrambles rapidly through all of them, landing back on AMAN.
- **Per-world default:** each world shows the name in its own universe first (Terminal → Latin mono, Pit Wall → Katakana, etc.).
- **Machine tie-in:** during the spin the title scrambles through scripts; it locks to the landed world's universe.
- **A11y:** one `aria-label="Aman Patel"`, every visual layer `aria-hidden`. Reduced motion: static "AMAN · अमन".
- **Fonts:** load only the glyphs needed via Google Fonts `&text=` subsetting (≈1–3 KB per script, not whole families).
- **Technique refs:** Codrops CSS Glitch Effect (clip-path slices), LogRocket "5 ways to style text inspired by Spider-Verse".

---

## 5. Design budget (the guardrail)

```
1 primary visual idea     → the machine as a lit, physical object
1 signature interaction   → the landed reel window expands into the chosen world
                            (camera pushes through the reel glass; a liquid-chrome wipe
                            is the ONLY melted-chrome moment; one continuous move)
1 signature identity      → the multiverse name (§4b)
1 motion language         → mechanical: detents, weight, slight overshoot, stepped counters
everything else           → quiet: tiny mono labels, hairlines, no extra effects
```
Not allowed: particle backgrounds, gradient orbs, hover-glow cards, magnetic buttons everywhere, fade-up on every section.

### Motion spec
- Easing family: `power4.out` for arrivals, `back.out(1.2)` only for detents (reel stop, lever return).
- Reels: motion blur via vertical `filter: blur()` that scales with velocity; each reel stops with a 2-step detent (overshoot 6px, settle).
- Lever: drag-to-pull with resistance (GSAP Draggable + inertia), clicks at 3 detents; tap/Space still work.
- Power-on (= the loader): grille LEDs scan left→right, labels type in, spotlight fades up. **≤ 1.2s**, and it **preloads the world chunks** behind it.
- Spin duration hides lazy-loading: start `import()` of the target world the moment the lever is pulled.
- Reduced motion: no spin, instant cross-fade, same layout.

### Sound (opt-in, off by default, one toggle)
4 samples only: lever ratchet, reel tick (pitched by speed), detent thunk, landing chime. WebAudio, < 60 KB total.

---

## 6. Per-world upgrade direction

| World | Premium move | References |
|---|---|---|
| **Machine** | Rebuild per §3–5 around a real rendered object | `te-1`, `animejs-1`, `opal-1` |
| **Editorial** | A24-grade: full-bleed art-directed project covers, Geist + Instrument Serif, case-study pages (problem → decisions → outcome), corner meta labels | `a24-1`, `rauno-1`, `cappen-1` |
| **Terminal** | Real CRT: subtle scanlines + phosphor bloom + barrel curve (one CSS/SVG filter), boot sequence with POST checks, ASCII "अमन", typed command hints | Poolsuite static, `poolsuite-2` |
| **Desktop** | Keep; restyle only the chrome (Geist, bone/ink) so it belongs to the system | — |
| **Album Rollout** (next) | Lando-style: one acid colour per "album era", signature-style handwritten title draw, tracklist as projects | `lando-1`, `lando-2` |

---

## 7. Asset pipeline

| Source | Role | Rule |
|---|---|---|
| Pinterest / Behance / Dribbble / Awwwards | **Reference only** | Never shipped. Study, extract, discard. (Copyright + it would look borrowed.) |
| **freellmapi → FLUX.1-schnell** | Fast ideation (≈10s/image, free, Apache-2.0) | Tested and working. Use for moodboards, material studies, cover drafts. Text renders garbled, so keep type live. |
| **Kaggle GPU** (CLI is authenticated) | Final-quality assets: higher-step FLUX/SDXL + Real-ESRGAN upscale; image→3D (TRELLIS / Hunyuan3D-2) for a `.glb` machine | Notebook per job, outputs to `public/media/`. Check each model's licence before shipping. |
| **You, in Blender** | **The hero machine** (best option) | You do 3D art. A machine you modelled is worth more to a jury (and a recruiter) than any generated one. Generated renders = blueprint. |
| Your photos / edits / renders | Editorial covers, Channel Surf, Moodboard | The point of the whole portfolio. |

### Machine: built from open-source parts (decided)
Researched free models and components (2026-10-27):

| Candidate | Licence | Verdict |
|---|---|---|
| Sketchfab "Retro Slot Machine" (ARTEL_3D), "A slot machine" (Balsamic_Vin) | CC-BY, needs your Sketchfab login to download, 200k–500k faces | ❌ casino styling, far too heavy for web |
| Sketchfab "Low Poly Slot Machine" (Bar0nline) | **CC-BY-NC** | ❌ non-commercial |
| `michaelkolesidis/cherry-charm` (R3F slot game) | **AGPL-3.0** | ❌ read only. Copying code would force the portfolio open under AGPL |
| `BluShooz/premium-slots-3d` (R3F) | no licence | ❌ read only (motion-blur shader idea is worth studying) |
| `nuxy/slot-machine-gen` | **MIT** | ✅ CSS 3D-cylinder reels, no canvas. Use as the **mobile / no-WebGL fallback** technique |
| **Poly Haven** studio HDRIs (96) + metal textures | **CC0** | ✅ the lighting that makes chrome look real |
| **three · @react-three/fiber · @react-three/drei** | **MIT** | ✅ the build kit |

**Approach: model the machine in code.** Pure-hardware forms are geometric, so a procedural model beats any download:
- Body: drei `RoundedBox` with brushed-aluminium `MeshPhysicalMaterial` (anisotropy) and a Poly Haven metal texture.
- Trim, lever shaft, wordmark: polished chrome (`metalness 1, roughness 0.05–0.15, clearcoat`) lit by a **Poly Haven studio HDRI**
  plus drei `Lightformer` strips. That's how the TE/product-shot look happens.
- **Reels are real 3D cylinders** with canvas-texture labels, so they physically rotate and show their own motion blur.
- Lever: separate node, GSAP Draggable on a hit-area, real rotation and detents.
- Grille LEDs: instanced emissive dots (the power-on scan).
- **First paint:** a pre-rendered still of the same scene (poster image) shows instantly; the canvas fades in over it when ready.
  The machine never shows a spinner.
- **Fallback** (no WebGL / low power / reduced data): poster still + MIT CSS-cylinder reels composited in the windows.
- FLUX (freellmapi) is used only for concept boards and textures (grille, engraved-label plates), never for the hero itself.

---

## 8. Plan: design first, then code (gates are hard stops)

| # | Phase | Output | Gate (you approve) |
|---|---|---|---|
| D0 | **Direction lock** | This doc → pick A×C (or other) | ✅ choice made |
| D1 | **Style tile** | One static page: colours, type scale, labels, grain, buttons, "अमन" mark, voice samples | Feels premium at a glance, side by side with `te-1` and `lando-1` |
| D2 | **Hero object** | Procedural R3F machine (§7): body, chrome trim, real cylinder reels, lever node, HDRI lighting, poster still | Object holds up full-screen at 1440p; ≥ 50 fps on a mid laptop |
| D3 | **Machine still** | Pixel-final static composition of the machine screen (desktop + phone) | Passes the 3-second test: "that's a product launch" |
| D4 | **Motion prototype** | Isolated page: power-on, lever drag, reel physics, signature push-through transition | Recorded with hyperframes; compared against references; top-3 mismatches fixed |
| D5 | **Integrate** | Replace current machine; preload-on-pull; sound toggle | Lighthouse mobile ≥ 85; reduced-motion verified |
| D6 | **Editorial → A24-grade** | Covers (generated + your media), case-study template | avoid-ai-design audit clean |
| D7 | **Terminal → CRT** | Boot sequence, shader, ASCII mark | — |
| D8 | **Album Rollout** | Designed through D1–D4 loop, not straight to code | — |

Tools at each step: `design-dna` to measure references → tokens (D1), `genjutsu:cast` for the interaction thesis (D4),
`gsap-skills` for reel/lever physics, `hyperframes` to record the prototype and the launch film, `avoid-ai-design` as the final audit,
and `egm` to review this doc before D1.

### Quality bar (self-score before every gate, Awwwards-style)
- **Design /10**: one idea, one accent, type tiny-or-huge, real texture, no default radii or shadows.
- **Usability /10**: résumé ≤ 2 clicks from anywhere, keyboard complete, reduced-motion real, phone layout *derived*, not shrunk.
- **Creativity /10**: would this exist if Aman didn't? (helmet finish, अमन mark, rap/racing worlds)
- **Content /10**: real case studies, real media, crafted copy down to the 404.
Ship a gate only at **≥ 8 average**.

---

### The set (lab, 2026-10-27): `/lab/machine.html`, render in `references/concepts/poc-scene-plinth-plants.jpg`
- Machine rests on a **chrome plate on an optical-glass plinth** (drei `MeshTransmissionMaterial`: refraction + chromatic aberration).
- **Still-life of CC0 photo-scanned plants** (Poly Haven: anthurium, fern, calathea) framing from behind/sides, never in front of the machine.
- Giant "AMAN" in Geist 800 deep behind the set (layered poster type); overlay UI = edge mono labels, IST clock,
  Geist + Instrument Serif headline, live multiverse name, 5% film grain.
- Motion: camera dolly-in while the spotlight fades up (power-on), LED boot scan, LED chase while spinning, reel detents,
  plant sway, pointer parallax.
- Tried and cut: gazania ground clumps (read as weeds), ceramic vase (read as a white block), plants in front (hid the hero).

### Direction update: "CLEAR HARDWARE" (from Aman's 22-image moodboard, `references/moodboard-aman/`)
What the refs share: transparent hardware (clear Game Boy, glass N8 camera, glass speakers, clear drum, CD jewel case,
acrylic neon box), chrome/glass flowers (chrome cosmos on blue glass stems, liquid-chrome rose, glass lily, glowing glass tulip),
light through glass (shattered-butterfly prism rainbow, the car streak bending type, star flares on a taillight),
and editorial poster type with edge labels.

Applied in the lab (render: `references/concepts/poc-clear-hardware.jpg`):
- Machine shell is **clear acrylic** (low distortion) with the mechanism visible: chrome chassis rails, reel drums with chrome caps,
  logic board + chips + gold contacts, power cell, speaker driver, orange wiring. Labels are printed on the glass.
- **Sea-glass plinth** (thick, high dispersion, teal attenuation), back-lit by strip lights so the edges glow on black.
- Green photo-scanned plants replaced by **chrome cosmos flowers on blue glass stems** (petals bent in code) and one
  **glowing glass tulip** with a light inside. The plant models were removed.
- **Prism beam:** white ray in, soft dispersed rainbow haze out (kept faint; a loud rainbow read as a cartoon).
- **Star-flare sparkles** that twinkle on chrome highlights, bloom on emissives only (LEDs, payline, tulip), vignette.
- **Black water floor** with rippled reflections.
- Not yet: the rose/butterfly, frosted-glass UI panels (nexo ref) for the world picker, type refracted *through* the plinth up close.

### Moodboard set 2: web layout language (`references/moodboard-aman/ref-25…33`)
These define the *pages around* the machine, not the machine:

| Ref | Pattern | Where it goes |
|---|---|---|
| "Studio" (ref-25) | Liquid-chrome serif italic word over a clean editorial grid + outline pill tags | ✅ **Applied:** extruded chrome "Aman" (Instrument Serif Italic, bevelled) behind the set; outline pills for worlds. Also the Editorial world's hero |
| every:second (ref-26) | Isometric stacks of image cards, one pulled forward | Editorial "Selected work": projects as a 3D card stack; hover pulls one out |
| MUSIC2D (ref-27) | Monochrome UI, pixel display type, chrome turntable | **Music / Album Rollout world**: 3D chrome turntable playing your real tracks, pixel mono type |
| Ship Globally / Exploring (ref-31, ref-32) | Ultra-condensed type at full width, red script laid across it, frosted blur orbs | Section headers in Editorial / Pit Wall (condensed + script accent in `--signal`) |
| Qorry (ref-30) | Bento grid, pill tags, one blue block | About / résumé section layout |
| Yardwork / blume (ref-28, ref-29) | Photo-led pages, bold type on imagery, playful mascot | A future garden world, not the machine set |
| Enjoy the Edge (ref-33) | Flower island floating on water, script + grotesk mix, pill labels, a cursor as a graphic | **Machine-landing option:** the set becomes an island of chrome flowers on black water (fits the current water floor) |

Type system after both moodboards: **Geist** (UI) · **Geist Mono** (labels) · **Instrument Serif Italic** (accents + 3D chrome wordmark) ·
one **ultra-condensed grotesk** for section headers (candidate: Big Shoulders Display or Anton, both Google/OFL) · script
accents only as an *overlay*, never as body. The 11 multiverse scripts stay as specified in §4b.

### Composition reset (2026-10-27): feedback "looks random, chaotic, not visible"
Diagnosis: the design budget (§5) was broken. Rainbow beam, sparkles, glowing tulip, chrome wordmark, ripple water,
pills and grain were all stacked on near-black, where glass and chrome can't be read.

Rules now enforced in the lab (render: `references/concepts/poc-studio-composed.jpg`):
1. **Light grey studio sweep** (`#c9cacd`), floor = backdrop colour + fog, so there's no horizon. Glass and chrome need light around them.
2. **One hero** (the machine) + **one prop** (three chrome cosmos in a clear vase). Nothing else in the set.
3. **Set in the top ~70% of the frame; type owns the bottom.** No type overlaps the object.
4. **Product-launch layout:** big serif model name "PX‑01" bottom-left, two short spec columns, one CTA, a 12-column grid.
5. **Glow only on real light sources** (LEDs, payline). No bloom on chrome.
6. Cut and parked for later worlds: prism rainbow, sparkles, glowing tulip, chrome "Aman" wordmark (→ Editorial hero), water (→ "Enjoy the Edge" island world).

### The island set (2026-10-27): render `references/concepts/poc-island.jpg`
Feedback: "too light, glass doesn't look like glass, add darker tones, vegetation, ground, ocean, clouds, more machine detail,
text on the machine unreadable." The light studio was replaced. Glass needs a contrasty world to reflect.
- **World:** a small floating island (procedural eroded rock drum + CC0 coastal-rock and grass-rock textures) on a **three.js
  Water ocean** under a CC0 Poly Haven sea-sunrise sky, with **drei volumetric clouds** (locally generated sprite) and a foam ring.
- **Ground:** about 22k instanced, wind-swayed grass blades with per-blade colour and dry tips, 20 procedural boulders,
  and CC0 plants (fern, gazania, dandelion).
- **Glass:** hand-made smudge and scratch roughness maps on the case and plinth; the plinth is thick green-edged optical glass.
- **Machine readability:** the case is rebuilt from panels with a **real reel window** (thin flat glass, a chrome frame,
  red payline arrows); white print sits on **smoked bands**; reel type is 700-weight mono at almost twice the size.
- **Mechanism detail** (clear-Game-Boy ref): a gear train that turns on spin, a cooling fan, a finned heatsink, capacitors,
  resistors, a striped ribbon cable, a coin slot with a glass coin chute and brass coins, a payout tray, a lever return spring,
  a `000427` play counter and corner screws.
- Overlay type flipped to bone-on-dusk, with a soft shade under the spec sheet.

### Golden-hour pass (2026-10-27): render `references/concepts/poc-golden-hour.jpg`
Critique of the island v1 against the award bar: flat overcast light, no depth, an oversized plinth, noisy foreground,
unfinished case edges. References: "OCEAN" golden-hour sea (low sun in frame, peach haze, glint path), "Enjoy the Edge"
(island as a designed object with a flower carpet), the acrylic neon box (bright glass edges). Contact sheet in the scratch notes.
Applied:
- **One sun drives everything:** a physical sky (drei `Sky`) with the sun ~2° above the horizon behind-left, the ocean's sun glint,
  and a warm backlight for the rim, plus a cool front fill so faces never go black. CC0 `kiara_8_sunset` HDRI for reflections only.
  Warm horizon haze (fog) melts the far sea into the sky.
- **Depth of field** focused by world distance on the machine; bloom threshold above the sky, so only LEDs and true highlights glow.
- **Island cleaned up:** the boulder ring became three accent clusters; a band of ~950 small flower heads near the rim in a muted
  six-colour palette; the plinth slimmed to 3.9 × 0.8 × 2.3 so the machine is the hero.
- **Case finish:** polished chrome cap and base plus four chrome edge rods.
Lessons (keep): an HDR sky needs exposure ≈ 0.4 with ACES; bloom on a bright sky bleaches everything; DOF must use
`worldFocusDistance`, not `target`; backlit double-sided grass needs its brightness capped.

### Next improvements (ranked by visual payoff)
1. **Lever drag with physics** (Draggable + detents) and **reel motion blur** (velocity-scaled blur on the drum material).
2. **Island underside:** stalactite rocks and hanging roots below the waterline cut, so it reads as floating (low-poly island ref).
3. **Real flowers instead of blobs:** instanced 5-petal geometry plus stems; one hero chrome cosmos beside the plinth.
4. **Water interaction:** soft ripples and foam where the island meets the sea; a few birds crossing the sun.
5. **Glass caustics** on the plinth top (a projected caustic texture) and a refraction highlight sweep when the reels stop.
6. **Sound:** lever ratchet, reel ticks, a soft wave bed (opt-in).
7. **Performance:** draco/meshopt models, KTX2 textures, grass LOD, an adaptive DPR tier for laptops and phones.
8. **Landing transition:** the camera pushes through the reel window into the chosen world.

### Cinematic pass (2026-10-27): renders `poc-intro-wide.jpg` (opening frame) + `poc-arrival.jpg` (after the glide)
Critique vs references (contact sheet: TE, Lando, Bruno, Enjoy the Edge, OCEAN, floating island, neon box): the refs each have one idea,
strong values and clean negative space; we were busy edge to edge, and the island never read as an object.
**Vision:** one sunset diorama, shot like a film. Open low and wide on the floating island against the sun, then glide up into the machine.
Applied:
- **Camera:** opening frame held under a title card, then a 5 s ease-in-out rise into the close-up; parallax only after arrival.
  `?shot=wide` freezes the opening frame for art direction.
- **Choreography:** fade from black → "Aman Patel presents / PORTFOLIO.exe" over the sea (with a scrim) → title out as the camera moves →
  header, spec sheet and index rail fade in on arrival. Timed from the first rendered frame, so slow loads never desync it.
- **Floating island:** sea well below; underside = a dark core + tiers of textured boulders (varied sizes, darker with depth) + hanging roots.
- **Detail:** real 5-petal instanced flowers (petals/centres/stems), a hero chrome cosmos, V-wing birds crossing the sun,
  reel motion blur at speed, a glint sweep across the reel glass on stop, a draggable lever with resistance (fires past 70%).
- **Glow discipline:** tighter physical sun halo, exposure 0.36, bloom threshold 7 so only LEDs/payline glow.
- **Editorial text system:** intro corner labels + chapter strip (01 Arrival / 02 Select / 03 Enter); after arrival an index rail of
  worlds and a mini spec table (Reels / Worlds / Plays).
- Removed: foam ring (the island no longer touches water), gazania/dandelion patch models (they overhung the rim).

## 9. Decisions (resolved 2026-10-27)
1. Direction → **A + B, Hardware, chrome.**
2. Machine → **open-source parts, modelled in code** (R3F + drei + Poly Haven CC0). No Blender, no paid models.
3. Mark → **"अमन" yes**, plus the multiverse name across 11 scripts (§4b).

D1 (style tile) will include the multiverse name as its first live prototype, since it's the identity piece everything else hangs on.
