# Motion audit: www.aman-patel.me (2026-11-11)

**Method**
- Rubric: motion-design-studio *motion quality rubric*. Seven categories, each scored 0–3, total out of 21.
  The bar is 15 for a public demo, 18 for a launch, 20 for premium.
- Evidence comes from the code, from reading the animated states, and from frame timing.
- Frame timing setup: phone viewport (390×844), CPU throttled 4×, `requestAnimationFrame` deltas captured during
  each surface's main interaction.

**Caveat:** headless Chrome renders WebGL on the CPU (SwiftShader), so the 3D home scores are pessimistic. They
need a real mid-range Android check.

## Frame timing (4× CPU, 390 px)

| Surface | fps | frames over 25 ms | worst frame | Note |
|---|---|---|---|---|
| Departures: flap board updating | **6** | **100%** | 222 ms | **P0.** Every flap tick is a React state update for each cell (~440 cells, every 55 ms) |
| Home: idle (3D machine) | 16 | 94% | 236 ms | Software GL in the test; verify on a device |
| Home: scrolling | 42 | 22% | 292 ms | The 3D canvas keeps rendering while scrolled past the hero |
| Album: record scratch | 84 | 7% | 153 ms | OK |
| Editorial: scroll | 95 | 8% | 90 ms | OK |
| Canvas: pan | 99 | 6% | 56 ms | OK |
| Arcade: play | 102 | 2% | 76 ms | OK |
| Terminal / Desktop | 117 / 132 | 0% / 1% | — | OK |

## Scores per surface (Purpose · Timing · Hierarchy · Brand fit · Accessibility · Performance · Implementation = /21)

| Surface | P | T | H | B | A | Perf | I | Total | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Home hero (machine, keychains, intro) | 3 | 2 | 2 | 3 | 2 | 1 | 1 | **14** | Ownable, but heavy and not orchestrated with the page below |
| Home sections (stats, work, live, xp, skills, footer) | 1 | 1 | 1 | 1 | 2 | 2 | 1 | **9** | Mostly static; reveals are generic fades or none; no scroll story |
| Liquid dock + glass | 2 | 2 | 2 | 3 | 1 | 2 | 2 | **14** | Good press physics; no reduced-motion path for the puck; no transition between sections |
| Desktop (PX-OS) | 1 | 1 | 1 | 1 | 1 | 3 | 1 | **9** | Windows pop in and out with no motion; the phone springboard has none either |
| Editorial | 2 | 3 | 3 | 2 | 2 | 3 | 2 | **17** | Letterpress and IO reveals are good; the index hover could carry more |
| Terminal | 2 | 2 | 2 | 3 | 2 | 3 | 2 | **16** | Boot, screensaver and flicker fit; command output just appears (no type-on) |
| Album | 3 | 2 | 2 | 3 | 2 | 2 | 1 | **15** | Deck is great; track expand jumps; beat pump is CSS-only; no era transition |
| Departures | 3 | 1 | 2 | 3 | 2 | 0 | 1 | **12** | The right idea, but the flap engine janks; no arrival choreography |
| Reference Desk | 2 | 2 | 2 | 3 | 2 | 3 | 2 | **16** | Card drop and stamp are good; drawer pull has no physicality; typing has no rhythm |
| The Drawing | 2 | 2 | 1 | 2 | 2 | 3 | 1 | **13** | Pan/zoom is linear and instant; no pinch momentum; the blueprint never "draws" itself |
| SHIP·BREAKER | 2 | 2 | 2 | 3 | 1 | 3 | 2 | **15** | Game feel is decent; no screen shake, hit-stop or CRT power-on; reduced motion is ignored in the canvas |

**Site-wide total:** 150 / 231 (65%), which is below the 15/21 public bar on 6 of the 11 surfaces.

## What the site lacks (the pattern behind the scores)

1. **No motion system.**
   - Every world invents its own curves and durations: 9 different cubic-beziers, plus `linear` and default ease.
   - There are no shared tokens, so nothing feels like one hand made it.
   - The principle at stake is consistent motion language: same family of easings, a duration scale, one personality.
2. **Arrivals are cut, not choreographed.**
   - Entering a world means a black curtain, then the world simply appears.
   - Award-level sites treat the route change as the hero moment.
   - The principle is continuity: the thing you clicked becomes the thing you see.
3. **Interaction feedback is uneven, and touch is mostly unaddressed.**
   - Hover states exist; press, drag-release, momentum and touch states mostly don't.
   - The principle is that every input gets an answer within 100 ms, and touch deserves its own answer, not a
     missing hover.
4. **No physics where physics is the point.**
   - Canvas pan has no momentum or rubber-banding.
   - The Desktop windows don't open from their icons.
   - The Album track expand jumps instead of animating its height.
5. **Reduced motion means "off", not "designed".**
   - Most worlds simply remove animations.
   - The principle: replace movement with cross-fades and instant states that still explain change.
6. **Performance debt in exactly the showcase pieces.**
   - The flap board, and the 3D canvas rendering while off-screen.

## Fixes, ranked by impact

| # | Fix | Where | Impact |
|---|---|---|---|
| 1 | **Rewrite the flap engine.** Each cell animates itself with CSS/WAAPI and a pre-built strip of characters; React renders a row once per change, not per flip. Target 60 fps at 4× throttle | `src/worlds/mission/Flap.jsx` | P0 perf |
| 2 | **Motion tokens.** `--ease-out` (expo), `--ease-in-out`, `--ease-spring` (overshoot), `--ease-snap`; durations `--t-1` 120 ms, `--t-2` 240 ms, `--t-3` 480 ms, `--t-4` 900 ms. A matching JS `motion.js` for GSAP and WAAPI. Every world uses them | `src/index.css`, `src/motion.js` | System |
| 3 | **Signature arrivals, one per world**, all running on the tokens. Each honours reduced motion with a 200 ms cross-fade (listed below) | each world's root | Hero moment |
| 4 | **Home sections:** a scroll story | `src/home/*` | Biggest surface |
| 5 | **Canvas physics:** momentum pan (velocity decay), rubber-band edges, eased zoom-to-cursor, pinch momentum | `src/worlds/canvas` | Feel |
| 6 | **Desktop windows** open from the clicked icon (FLIP), minimise into the dock, and use a spring on maximise; the phone springboard gets icon press, launch zoom and back-swipe | `components/`, `src/hoc/WindowWrapper.jsx`, `src/mobile` | Feel |
| 7 | **Arcade juice:** hit-stop (40 ms), screen shake on life lost, brick crack flash, combo counter pop, CRT power-on/off, a canvas branch for reduced motion | `src/worlds/arcade` | Delight |
| 8 | **Terminal:** type-on output (fast, skippable with any key), cursor-follow highlight on chips | `src/worlds/terminal` | Fit |
| 9 | **Album:** track expand animates height (grid-rows 0fr→1fr), era colour crossfade, needle-drop micro-motion when "Open track" fires | `src/worlds/album` | Polish |
| 10 | **Off-screen 3D pause:** stop the R3F frameloop (and footer dots) when off-screen; the home "active" flag exists, so wire it to frameloop="demand" | `src/home/Studio.jsx`, `DotField.jsx` | Perf |

Signature arrivals for fix 3:

| World | Arrival |
|---|---|
| Departures | Rows flip in top to bottom |
| Reference Desk | The drawer slides out, then the first card is pulled |
| The Drawing | Linework strokes itself (dashed outlines draw), then the prints develop |
| SHIP·BREAKER | CRT power-on: a horizontal line expands, then a phosphor bloom |
| Editorial | (Already has the letterpress) |
| Terminal | (Already has the boot) |
| Album | The sleeve drops onto the table, then the record slides out |
| Desktop | The wallpaper fades up, the menubar slides down, icons pop in a stagger |

Scroll story for fix 4:
- The stats tape slides in from its tilt.
- Numbers roll on an odometer, not a plain count.
- Work cards rise with a mask reveal and a slight 3D tilt-follow on hover.
- Each live-site row's status light turns on in sequence.
- Experience draws a timeline line as you scroll.
- Skill chips cascade.
- The footer dunes swell as you arrive.

**Re-audit target:** every surface at 18+/21 (the launch bar), with the flap board at 60 fps under 4× throttle.
