# Worlds Upgrade Plan (`2026-11-17`)

Source: agy CLI (read-only design audit of src/worlds/* against docs/REFERENCE_IDEAS.md and the polish rules in docs/AWWWARDS_PHILOSOPHY.md §3b). Claims are to be verified against the code when each world is built — this is the plan, not a changelog.

### 1. World-by-World Audit

#### 1. `ride` — `src/worlds/ride/index.jsx`, `Scene.jsx`, `ride.css`, `route.js`
- **Verdict:** Closest to a signature 3D piece, but arcade bloat dilutes the golden-hour film. **7.6 / 10**
- **Full-fledged idea:** A meditative golden-hour coastal ride out of Ahmedabad where each project is a monumental roadside billboard you cruise past (`bruno-simon.com` minimal HUD + `Joseph Santamaria` camera choreography). Zero arcade points—just speed, horizon, and the work.
- **Top 3 upgrades:**
  1. Replace `Speedo` + `rd-quest` + `rd-toast` in `index.jsx` with a single 2-trigger HUD (`Map` + `Cruise/Throttle`), matching `bruno-simon.com`.
  2. Bake directional road/cliff lighting and throttle `CoastalOcean` (`96×96` plane in `Scene.jsx`) to `48×48` on `BALANCED` tier.
  3. Add smooth camera-to-billboard focus easing in `Scene.jsx` (`Rider`) when slowing at a stop, then pull back on throttle.
- **Top 2 cuts:**
  1. Cut `CERT_ORBS`, `APEX_GATES`, `KnockableProps` (`+100 PTS · Prop Smash`), and `rd-quest` from `index.jsx`/`Scene.jsx`.
  2. Cut extra `BIOMES` (`fjord`, `sakura`) and `SakuraHighwayAtmosphere`—commit 100% to Ahmedabad golden hour.
- **Mobile/perf risks:** `RideWorld` runs an R3F `useFrame` loop alongside a separate `requestAnimationFrame` + `120ms` `setInterval` calling `setHud`/`setQuest`; `FjordCliffs` loads three `1k` textures unconditionally; `EffectComposer` + `Bloom` runs on `HIGH` while `CoastalOcean` displaces `96×96` vertices every frame.

#### 2. `desktop` — `src/worlds/desktop/index.jsx`, `desktop.css`
- **Verdict:** Still reads as a macOS clone with a dark wallpaper rather than PX-01's native OS. **5.8 / 10**
- **Full-fledged idea:** `PX-OS`—the actual operating system running inside the slot machine (`adamperlis.com` liquid-glass shell + `Teenage Engineering` industrial chrome). Square bone/void windows, hairline rules, and `F3` Exposé that snaps everything into a single-page CV.
- **Top 3 upgrades:**
  1. Lazy-mount windows in `src/worlds/desktop/index.jsx` only when opened, clamping drag bounds to viewport (`Draggable`).
  2. Restyle `desktop.css` (`#window-header`, `#window-controls`, `#dock`) from macOS traffic lights (`#ff6157`, `#ffc030`, `#2acb42`) and `bg-white/50` to PX-01's void/bone/signal-red tokens.
  3. Build an `Exposé` (`F3` / top-bar button) view that tiles open projects + Résumé into a scannable recruiter sheet.
- **Top 2 cuts:**
  1. Cut eager mounting of all 10 windows (`Photos`, `Game`, `Music`, `Image`, `Text`) on initial render.
  2. Cut macOS-specific window chrome (`#safari`, `#terminal` hardcoded `left-2/12`, `top-40` offsets).
- **Mobile/perf risks:** Desktop mounts 10 window trees + `backdrop-blur-3xl` + `Draggable` instances simultaneously; hardcoded `w-4xl`/`top-96` positions clip on `1280×720` viewports.

#### 3. `editorial` — `src/worlds/editorial/index.jsx`, `editorial.css`
- **Verdict:** Highest craft and recruiter clarity; only minor clutter holds it back from SOTD. **8.2 / 10**
- **Full-fledged idea:** A one-ink International Klein Blue (`#002fa7`) broadsheet on warm paper (`Obys` kinetic editorial type + `errormade.tech` vertical-tick index). Front page for flagship proof, tabular index with cursor duotone peek below.
- **Top 3 upgrades:**
  1. Replace the `window.scroll` listener updating `folio` state on every scroll tick in `index.jsx` with a lightweight `IntersectionObserver` sentinel.
  2. Tighten `.ed-mast h1` letterpress timing and unify `.ed-certs`/`.ed-tools` to one 12-column grid with `ed-front`.
  3. Add keyboard `j`/`k` + `Enter` row navigation on `.ed-table` that updates `ed-peek` for keyboard users.
- **Top 2 cuts:**
  1. Cut `.ed-folio` fixed top bar—it duplicates the masthead links and collides with `CoinSlot` on short screens.
  2. Cut the `List | Gallery` toggle (`ed-gallery`) or `#ed-search` if the tabular index + hover preview is the core gesture.
- **Mobile/perf risks:** `onScroll` triggers `setFolio` React re-renders continuously during scroll; `ed-ch` per-letter `will-change: transform` on `h1` stays promoted after entrance.

#### 4. `terminal` — `src/worlds/terminal/index.jsx`, `crt.css`
- **Verdict:** Functional split-pane `tmux` workstation, but novelty commands and constant flicker weaken authority. **7.4 / 10**
- **Full-fledged idea:** `tty1 · AHMEDABAD`—an amber-phosphor engineering console (`adamperlis.com` shell + `Poolsuite` CRT texture) where every project is an inspectable dossier (`cat <slug>`) with instant tab-completion and 1-click recruiter commands.
- **Top 3 upgrades:**
  1. Add `ssh <slug>` or `diff` view inside `.tty-inspector` showing architecture notes from `content/cases.js`, not just a pixelated thumbnail.
  2. Make the bottom `.tty-dock` a clean command bar (`about`, `projects --live`, `cv`, `contact`) that mirrors `tmux` status panes.
  3. Replace the `1s` `setInterval` clock re-rendering the entire `TerminalWorld` tree with a self-contained `<Clock />` leaf component.
- **Top 2 cuts:**
  1. Cut `tty-flicker` 6s infinite opacity animation on `.tty-glass` in `crt.css`—it causes continuous layer compositing and eye strain.
  2. Cut filler novelty commands (`coffee`, `music`, `watching`, `rm`) from `COMMAND_NAMES` in `index.jsx`.
- **Mobile/perf risks:** `setInterval` every `1000ms` re-renders all 545 lines of `TerminalWorld` (including the full `log` JSX array); `.tty-scan` fixed `mix-blend-mode: multiply` over scrollable `.tty-main` triggers full-screen blend passes on mobile.

#### 5. `album` — `src/worlds/album/index.jsx`, `album.css`, `Deck.jsx`
- **Verdict:** Strongest metaphor, sabotaged by a blocking entry gate and heavy per-row DOM waves. **7.5 / 10**
- **Full-fledged idea:** A physical deluxe LP (`mindofakira.com` voice + `a24.raviklaassens.com` disc credits) where the scratchable record *is* the navigation and each project expands into studio liner notes.
- **Top 3 upgrades:**
  1. Replace the blocking `VinylGate` modal in `index.jsx` with an inline needle-drop hero toggle (`Play with sound` / `Browse silent`) so recruiters land directly on `SHIP IT`.
  2. Swap the 40-`<i>` `Wave` component (`1,700+` DOM nodes across 44 projects) for a single `<svg>` or CSS `linear-gradient` mask.
  3. Add a merch-table hire card at the foot (`Tour dates` = availability, `Press kit` = tailored résumés) matching `WORLDS_REDESIGN.md`.
- **Top 2 cuts:**
  1. Cut `VinylGate` (`akira-gate` full-screen dialog) blocking first paint.
  2. Cut `.album-bar` sticky top pill's continuous `scroll` state listener (use `IntersectionObserver` on `.cover`).
- **Mobile/perf risks:** `Wave` renders `40` `<i>` elements per track (~1,720 nodes) with `animation: pump` on `[data-playing]`; `backdrop-filter: blur(16px)` on `.album-bar` + `box-shadow` animations hurt mobile GPU budgets.

#### 6. `mission` — `src/worlds/mission/index.jsx`, `mission.css`, `Flap.jsx`
- **Verdict:** Authentic split-flap telemetry concept, overloaded by 250+ simultaneous flap instances and a marquee ticker. **7.1 / 10**
- **Full-fledged idea:** An airport departures board for live production systems (`errormade.tech` tabular precision + `Teenage Engineering` instrument readout), where only live status, latency, and clock mechanically flip.
- **Top 3 upgrades:**
  1. Restrict `<Flap />` in `index.jsx` to dynamic columns (`Status`, `Latency`, `Clock`), rendering `Title` and `Year` as crisp static `Barlow Condensed` text.
  2. Persist the last `/api/status` probe in `sessionStorage` so switching filters doesn't re-trigger `no-cors` fetches across 20+ domains.
  3. Move `clock` (`5s` `setInterval`) into its own component so `Departures` doesn't re-render the 44-row table every 5 seconds.
- **Top 2 cuts:**
  1. Cut `.dp-remark` `.dp-marquee` scrolling ticker in `index.jsx`/`mission.css`—pure visual noise.
  2. Cut `key={t-${scanId}}` remounting on static columns, which causes layout/animation storms on filter changes.
- **Mobile/perf risks:** ~250+ `<Flap />` instances mount simultaneously with staggered timers; `no-cors` `fetch` fires to every `w.live` URL in parallel on load if `/api/status` fails; `dp-marquee` runs an infinite `translateX` animation.

#### 7. `ask` — `src/worlds/ask/index.jsx`, `ask.css`
- **Verdict:** The ruled index-card desk is inspired, but the borrowed pixel-avatar hero breaks the spell. **6.9 / 10**
- **Full-fledged idea:** A 1970s library reference desk (`aaabadcode` chat-as-nav + `abdulmateenzwl` physical form) where every question pulls a ruled card from the card catalogue, typed in `Courier Prime` with clickable red footnotes.
- **Top 3 upgrades:**
  1. Replace `jld-hero` (`PixelAvatar` + `"Turning Code into Memorable Digital Experiences."`) in `index.jsx` with a library desk blotter / call-slip intro matching `.rd-card`.
  2. Animate card reveal via CSS `clip-path`/opacity line-by-line instead of `setN` `setTimeout` re-rendering `Typed` + regex `split()` 100+ times per answer.
  3. Upgrade `localAsk` in `index.jsx` with weighted TF-IDF/synonym matching over `work.js` + `cases.js` so offline answers feel sharp.
- **Top 2 cuts:**
  1. Cut `PixelAvatar` and `.jld-hero` (`ask.jsx` lines 21–49, 284–300) and their neon-lime `#d9ff2e` styling in `ask.css`.
  2. Cut the inline SVG `feTurbulence` `mask-image` on `.rd-stamp` (use a clean CSS double-border stamp).
- **Mobile/perf risks:** `Card` runs a `10–65ms` `setTimeout` loop calling `setN`, re-running regex parsing (`Typed`) on the growing string every frame; `feTurbulence` SVG data-URI mask on `.rd-stamp` forces software rasterization on mobile.

#### 8. `canvas` — `src/worlds/canvas/index.jsx`, `canvas.css`
- **Verdict:** Tactile cyanotype drafting board, dragged down by pointer-move state thrash and fake multiplayer. **7.3 / 10**
- **Full-fledged idea:** A Prussian-blue architectural blueprint (`madebyhart.com` precision) where every project is a dimensioned sheet, skills are a Bill of Materials, and clicking a sheet snaps the camera with a drafter's revision cloud.
- **Top 3 upgrades:**
  1. Replace `setCoords` React state on `onPointerMove` (`index.jsx` line 227) with a direct `ref.textContent` DOM update so panning/hovering causes zero React re-renders.
  2. Virtualize or skip `.bp-sheet::before/::after` arrival animations for sheets outside the initial viewport.
  3. Add a `Space + Drag` and `1`/`2`/`3` zone-jump shortcut hint directly on the `.cv-bar` rail.
- **Top 2 cuts:**
  1. Cut `cv-mate` (the fake drifting `"A.P."` pencil cursor on a `2.6s` `setInterval`).
  2. Cut `bp-sheet` pseudo-element border-draw animations on all 44 sheets—keep the draw-on effect only for the selected `CLOUD` SVG.
- **Mobile/perf risks:** `onPointerMove` calls `setCoords(...)`, triggering a full 44-sheet `CanvasWorld` re-render on every mouse/pointer pixel; `44` `bp-print` images with `mix-blend-mode: screen` + `::after` `multiply` inside a scaled CSS `transform` layer strain mobile GPUs.

#### 9. `pocket` — `src/worlds/pocket/index.jsx`, `pocket.css`, `art.js`, `town.js`
- **Verdict:** Delightful code-drawn LCD homage with a real React listener bug and an out-of-place link bar. **7.4 / 10**
- **Full-fledged idea:** A custom-engineered 4-shade handheld (`sadok.mx` hardware object + `bruno-simon.com` playable world) set in pixel Ahmedabad, where tall grass launches project battles and `START` is the recruiter menu.
- **Top 3 upgrades:**
  1. Fix the `keydown` `useEffect` in `src/worlds/pocket/index.jsx` (line 269–293) by adding a dependency array / `ref` for `battle`/`sel` so it stops re-binding `window` listeners on every state tick.
  2. Move `.pk-fast` links into a crisp hardware cartridge label / `START` menu shortcut so the console floats alone on the dark desk.
  3. Render battle HP/stack bars and `Dex` entries with direct `case.html` links from `cases.js`.
- **Top 2 cuts:**
  1. Cut the `.pk-fast` underlined text bar above `.pk-device`.
  2. Cut `.pk-screen::after` multi-layer `cqw` repeating-gradient grid if `image-rendering: pixelated` on the `160×144` canvas already reads crisp.
- **Mobile/perf risks:** Missing dependency array on `keydown` `useEffect` re-attaches listeners on every `setPrompt`/`setTyped` render; `requestAnimationFrame` runs continuously even when `mode` is `"dex"` or `"card"`.

#### 10. `longhorn` — `src/worlds/longhorn/index.jsx`, `longhorn.css`
- **Verdict:** Authentic Aero lens craft, but heavy aurora layers and auto-popup Welcome weaken first impression. **7.0 / 10**
- **Full-fledged idea:** An Aero glass aquarium (`crystallize.prism-on.tokyo` refractive glass + `library.jjangik.kr` 3D stack) where `Flip 3D` (`F`) is the hero stage and `src/liquid.js` refracts the ocean light through window rims.
- **Top 3 upgrades:**
  1. Open directly into `Explorer` or `Flip 3D` preview on desktop instead of a `1.5s` delayed `Welcome` modal (`index.jsx` line 289).
  2. Share `/api/status` probing via a single cached helper instead of duplicating `no-cors` `fetch` loops from `mission`.
  3. Clamp `Win` drag coordinates to viewport bounds on resize/drag so windows can't be lost off-screen.
- **Top 2 cuts:**
  1. Cut 3 of the 4 `140vmax` `mix-blend-mode: screen` `.lh-aurora i` layers in `longhorn.css`—use one subtle CSS gradient drift.
  2. Cut `backdrop-filter`/per-window `liquid()` re-calculation on inactive background windows.
- **Mobile/perf risks:** Four `140vmax` `mix-blend-mode: screen` elements with infinite `will-change: transform` animations consume huge fill-rate on mobile; `Win` mounts `liquid(ref.current)` SVG filters on every open window; `ClockGadget` re-renders every `1000ms`.

#### 11. `y2001` — `src/worlds/y2001/index.jsx`, `y2001.css`
- **Verdict:** Sincere, funny, and fast underneath, though DOM sparkles and infinite background-position loops hurt smoothness. **6.8 / 10**
- **Full-fledged idea:** A 1999–2001 GeoCities personal homepage (`Poolsuite` sincere nostalgia + `a24.raviklaassens.com` real client quotes) with a real Neon hit counter/guestbook, progressive 56k image loading, and semantic HTML underneath.
- **Top 3 upgrades:**
  1. Replace `useSparkles` DOM-node creation (`document.createElement("i")` on `pointermove` in `index.jsx`) with a pooled fixed array or remove it entirely.
  2. Virtualize or paginate the 44-row `.y-proj` table (default to `Live` or `12` rows + `"Show all 44"` button) so mobile isn't a 6,000px table.
  3. Add a classic `"View Source"` / `"Accessibility Report"` 88×31 badge modal proving the semantic/a11y joke.
- **Top 2 cuts:**
  1. Cut `useSparkles` (`index.jsx` lines 62–83)—DOM thrashing on every mouse move.
  2. Cut `.y2k` `y-drift` infinite `background-position` animation and `.y-word > span` per-letter infinite `y-wave` in `y2001.css`.
- **Mobile/perf risks:** `y-drift` animates `background-position` on `min-height: 100dvh` continuously (non-composited paint); `useSparkles` mutates DOM on `pointermove`; 44 `Pic` components each mount two `<img>` tags (`88` images).

#### 12. `arcade` — `src/worlds/arcade/index.jsx`, `arcade.css`
- **Verdict:** Tight Breakout cabinet, held back by fixed-res canvas, mobile-hidden default, and 120Hz attract-mode spinning. **6.6 / 10**
- **Full-fledged idea:** `SHIP·BREAKER`—an 80s upright cabinet (`bruno-simon.com` playable portfolio + `Audi F1` start-light anticipation) where breaking project bricks feeds live project cards into the cabinet's marquee inspector.
- **Top 3 upgrades:**
  1. Scale the canvas buffer by `Math.min(2, window.devicePixelRatio)` while keeping logical `640×480` coordinates in `index.jsx` so text/bricks stay razor-sharp on Retina screens.
  2. Make mobile default to a playable touch-paddle cabinet with a compact `"Unlock List"` drawer below, rather than hiding the game behind `setAll(true)`.
  3. Throttle `attract` mode in `loop` to 30fps and pause `rAF` when the tab is hidden (`document.hidden`) or scrolled off-screen.
- **Top 2 cuts:**
  1. Cut `sb-demo-tag` + `sb-toast` overlapping the playable field during attract mode.
  2. Cut `backdrop-filter: blur(2px)` on `.sb-over` in `arcade.css` (plain `rgba(5,5,5,0.82)` matches 80s CRT glass better and costs zero GPU).
- **Mobile/perf risks:** Runs a `120Hz` physics sub-step loop (`while (acc >= 1000 / 120)`) continuously even in `attract` mode; `ctx.fillText` + `ctx.shadow`/alpha trails redraw `640×480` every frame without visibility pausing.

---

### 2. Ranked Build Order (Impact ÷ Effort)

1. **`editorial`** *(Highest impact / lowest effort)* — Remove `onScroll` state thrash, cut `.ed-folio`, unify 12-col grid. Instant SOTD-caliber recruiter flagship.
2. **`album`** — Remove `VinylGate` blocker, replace 1,720-node `Wave` with SVG/CSS. Huge mobile perf + UX win.
3. **`pocket`** — Fix `keydown` `useEffect` dependency bug + move `.pk-fast` inside cartridge/START. Low effort, huge polish jump.
4. **`canvas`** — Move `coords` off React state (`ref.textContent`), cut `cv-mate` + off-screen border animations.
5. **`ask`** — Replace `jld-hero` with library-desk blotter + CSS reveal instead of `setN` typing loop.
6. **`terminal`** — Isolate `Clock`, cut `tty-flicker` + novelty commands, deepen `cat <slug>` inspector.
7. **`mission`** — Isolate `Clock`, limit `<Flap />` to dynamic columns, cut marquee.
8. **`y2001`** — Cut `useSparkles` + `y-drift`, default project table to `Live` + expand.
9. **`arcade`** — Add DPR scaling, pause `rAF` off-screen/hidden, cut attract-mode 120Hz loop.
10. **`longhorn`** — Remove 1.5s `Welcome` popup, flatten 4 aurora layers to 1, bound window drag.
11. **`ride`** — Strip arcade orbs/gates/biomes, optimize `CoastalOcean` + `rAF` loop, polish camera-to-billboard focus.
12. **`desktop`** *(Highest effort)* — Lazy-mount windows and re-skin macOS chrome to PX-01 industrial tokens.

---

### 3. Five Cross-World System Ideas

1. **Unified World Shell & Telemetry (`src/shell/`):** Replace per-world `Clock` (`terminal`, `mission`, `longhorn`, `editorial`) and duplicate `/api/status` + `no-cors` probe loops (`mission`, `longhorn`) with one shared `useLiveStatus()` hook (cached in `sessionStorage` for 60s) and a `<WorldHeader />` contract so every world gets IST time, live prod count, and 1-tap `Résumé` without duplicating state.
2. **Ticket-Feed Portal Transition (`src/App.jsx`):** Upgrade `world-portal` from a plain color wipe to PX-01's "Machine Prints It" language—a thermal paper ticket feeding up with the world's `name`, `symbols`, and a `prefers-reduced-motion` instant cut, while `worlds[i].load()` prewarms the chunk during the 320ms shutter-in.
3. **Shared Quality-Tier & `rAF` Visibility Gate (`src/three/cinematography.js`):** Extend `detectQualityTier()` beyond `ride` into a universal `useWorldPerf()` hook consumed by `ride`, `pocket`, `arcade`, `longhorn`, and `canvas`—exposing `dprCap`, `enablePostFX`, `reducedMotion`, and automatic `document.visibilityState === "hidden"` loop pausing.
4. **Canonical Project Selector & Deep-Linking (`content/work.js`):** Standardize `shot(w, size)` responsive `srcSet`, `host(u)`, and `cases[w.slug]` URLs across all 12 worlds (removing 7 duplicate `host()` helpers), and support `?style=<id>&p=<slug>` so any world can open directly onto a specific project dossier.
5. **Recruiter Fast-Path Contract (`?recruiter=1`):** Add a single global shortcut (`R` or `?recruiter=1` in `src/App.jsx`) that skips intros/gates (`album` `VinylGate`, `y2001` 56k loader, `terminal` `POST` boot, `longhorn` `Welcome` delay) and surfaces the world's Résumé + Live Projects immediately.

---

## Pass 1 status (2026-11-17) — verified against the code, then fixed
| World | Shipped | agy claims that did NOT hold |
|---|---|---|
| Editorial | folio bar on a ref (no re-render per scroll), inProduction count, tidy phone masthead, no permanent will-change | — |
| Album | waveforms = 1 SVG-masked element/track (was 1,760 animated nodes), Recruiter skips gate, counts, bar pill | scroll listener only re-renders twice (boolean) |
| Pocket | key listeners bound once via ref | rAF already pauses in hidden tabs |
| Canvas | coords via DOM, fake collaborator cursor removed | sheet draw-on is one-shot, kept |
| Ask | call-slip hero replaces pixel avatar + template headline; counts | — |
| Terminal | Clock isolated; no full-screen multiply; no flicker on phones | novelty commands kept (Aman's personality) |
| Mission | statuses/probes via inProduction (Job Search OS/Pulse AI were "ARCHIVED"), honest PREVIEW/BUILT/PRIVATE | flaps share one self-stopping rAF; clock bails out |
| 2001 | starfield drift via transform (was full-page repaint/frame) | sparkles are throttled + mouse-only, kept |
| Arcade | DPR canvas buffer (sharp), loop idles off-screen/hidden, overlapping demo tag removed | mobile list-first default is the recruiter fast path, kept |
| Longhorn | aurora without screen blend, still on phones; Recruiter opens Projects | Welcome Center auto-open is period-true, kept for visitors |
| RIDE | Scene memoised (HUD tick re-rendered the 3D tree ~8×/s) | — (design cuts pending Aman) |
| Desktop | folders frozen at 40% (Draggable mid-animation) fixed; phone dock overlap | windows already lazy-mount; it is already PX-OS, not a macOS clone |
Pending Aman's call: RIDE cuts (points/orbs/gates/props; Fjord + Sakura biomes), any Desktop re-skin.

## Cross-world systems (2026-11-18)
- `host()` lives once in `content/work.js` (was 12 copies across home, worlds, mobile, résumé).
- `src/status.js` `liveStatus(fresh?)`: one /api/status check with browser-ping fallback, cached 60 s; used by home Maintained, Mission (60 s poll + R re-scan = fresh), Longhorn. Replaced 3 hand-rolled probes.
- Ticket-feed portal (2026-11-18): the world shutter is a thermal strip with torn zig-zag edges; centre prints `PX-01 · Ticket № NN · Now entering`, poster name, symbols, id-seeded barcode; the world's chunk is prefetched (`next.load()`) as it feeds in.
- Deep links (2026-11-18): `?style=<id>&p=<slug>` via src/shell/deepLink.js (`linkedProject`, `useShareProject`). Works in Mission, Terminal (boots into `cat <slug>`), Canvas (flies to the sheet), Album, Longhorn (opens the window), Arcade (inspector), RIDE (parks beside the ticket, skips the gate). Opening a project writes ?p= back; App drops ?p= on world change. Not wired (no project view): Editorial, Desktop, 2001, Ask, Pocket.
- useWorldPerf: dropped (2026-11-18) — only RIDE + home are WebGL; Arcade already pauses off-screen, other loops are rAF (paused in hidden tabs by the browser). RIDE's own low-power check now reuses detectQualityTier.

## RIDE v2 — PX-01 test track (2026-11-18, Aman chose: classic car / abstract PX-01 track / miniature tilt-shift)
Replaces the on-rails golden-hour bike ride. Free driving with Rapier raycast-vehicle physics (`@react-three/rapier`):
a classic coupe built from code (black enamel, vermilion stripes, chrome), on a kerbed circuit on a floating plinth,
giant PX-01 in the infield, ramps + knockable cones/crates. Projects = 44 double-sided printed tickets in 4 sectors;
pulling up beside one opens its card. Fixed high camera + fov 30 + TiltShift2 = miniature look. Old points/orbs/gates/
biomes/props and public/ride assets removed.
Gotchas: vehicle forward = chassis +X needs axle (0,0,+1) — with (0,0,-1) engine force drives backwards. Chassis mass
150 with ENGINE 620/rear wheel (Rapier scales suspension by chassis mass).
RIDE v2.1 (same day): synthesised engine + tyre squeal (src/worlds/ride/engine.js, follows the site sound switch),
skid marks + dust (instanced ring buffers), fastback coupe with arches/ducktail/grille, lap timer + best lap
(localStorage `ride-best-lap`, anti-cheat halfway checkpoint) with a "Like how it handles?" contact card per lap,
tickets printed to one canvas texture each (was ~440 troika text meshes), BALANCED tier drops bloom + MSAA.
Rapier adds ~855 KB gz to the RIDE chunk only (lazy). Night mode shipped 2026-11-18 (follows the visitor's clock, N toggles): moonlight, two headlight spots, lightbox tickets (emissive = printed face), glowing pylon caps, dim grid. Ideas left: ghost car of your best lap, gamepad support, photo mode.

## QA pass (2026-11-18) — 13 pages × 8 viewports + Lighthouse (GPU on, production build)
Sweep script: Playwright, clicks past the boot gate, flags sideways scroll / spill outside scrollers / console errors /
phone hero overlap. Fixed: Mission scrolled sideways on phones + 1024 (plain `1fr` tracks → `minmax(0,1fr)`), Flap
threw when a cell unmounted mid-frame, Editorial long domains at 320px, phone charms climbing into the header, and the
mobile hero key (now the lever). Perf: Home is its own chunk (worlds no longer download three + the studio); worlds get
a `<main>` (registry `main: true` for worlds with their own); name-glyph font CSS no longer render-blocking; RIDE's 3D
(Stage3D → Scene, ~0.9 MB gz with rapier) is lazy and mounts after the slip paints; RIDE shell imports three-free
`tickets.js` + `three/quality.js` (shell chunk ~6 KB gz).
Lighthouse after (perf/a11y/bp/seo): Editorial phone 70/100/100/100 (was 51/99), desktop 97; Home 64–68/97/100/100;
RIDE phone 40, desktop 56 — observed LCP ~1.8–2.2 s; the rest is WebGL main-thread work under 4× CPU simulation.
Home 3D intro (same day): drei <Preload all> (sync gl.compile + 6-face cube render in one frame) → AsyncPreload
(renderer.compileAsync, KHR_parallel_shader_compile; scene hidden until programs are ready; FirstFrame waits for the
visible scene). Desktop TBT 1630 → 670 ms (longest task 1269 → 362 ms), perf 68 → 73; phone (simulated) TBT 10.2 s → 3.7 s.
Left: first visible frame (env PMREM, shadow map, uploads) ~380 ms real, and React mounting the whole printout at once.

## Home hero critic pass (agy, 2026-11-18) — desktop 7.2, phone 5.0; claims verified
Fixed: phone signature derived from the wordmark (was fixed bottom: 266px → hit the machine on short phones; overlapping
the word hid "Aman" behind it), phones show the same 2 charms as desktop (the red ENTER key competed with the lever
knob), idle start-lights hidden on phones, secondary links one row of 40px targets ("The work ↓" on phones), key copy
"Spins one of 7 · 12 in all" (was a 7-vs-12 contradiction), light-mode key rim, 320px top-bar spacing, desktop 761–1200px
key anchored to the gutter (sat on the lever housing at 1024).
Rejected: "74px phone bottom padding is dead space" (it clears the global Worlds dock); "remove Creative Developer"
(Aman asked for it back); signature halo text-shadow (effect, not polish).
