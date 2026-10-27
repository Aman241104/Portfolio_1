# Goldfish Review Report

**Target:** `docs/PORTFOLIO_EXE_PLAN.md` (L1-247)
**Reviewers:** design, zoom-out, implementation-readiness, codebase-details, comprehension, structural, style (one instance each)
**Date:** 2026-10-27

**Severity breakdown (after dedupe):** 5 Blocker · 18 Major · 10 Nit

**Overall verdict:** The direction is sound: stay on Vite, use a registry of lazy worlds, keep one content source, and turn the existing desktop into World #1. But the plan is not ready to build from yet, for four reasons:

1. **Scope.** It schedules 12 worlds while warning against exactly that.
2. **Phase 0 assumptions.** Phase 0 assumes things about the repo that are false: content is not centralised, CSS is not scoped, and the projects data is already forked.
3. **Routing rules.** The precedence between `?style=`, `classic`, the localStorage keys and the no-repeat rule is undefined.
4. **Machine and jackpot logic.** The reel and jackpot rules contradict each other.

The orchestrator spot-checked these codebase claims against the repo:
- `src/index.css:8,10`: `overflow: hidden` and the wallpaper background are set on html/body.
- `src/windows/Game.jsx:64,67`: a global keydown listener calls `preventDefault`.
- `src/hoc/WindowWrapper.jsx:44`: `if (!isOpen) return null` is commented out, so every window is always mounted.
- `package.json`: has no `three`, no `@vercel/analytics` and no `imports` field.

---

## Blockers

### B1. The scope does not fit the estimate or the plan's own warning - Severity: Blocker
* **Reviewer Lens:** `zoom-out` (also `design`, `structural`)
* **Affected Scope:** §0 L21, §2 table L77-90, §5 L196-224
* **Discrepancy:** The plan says "16 half-finished worlds is worse than 4 great ones" and then schedules 12 worlds plus jackpot, achievements, a hidden world, sound, a Takeout script and per-world OG images. Each world has to be a full renderer: profile, projects, experience, skills, taste, contact and résumé, plus a phone layout, reduced motion and keyboard navigation. Phase 3 puts 5 worlds, one of them an R3F scene with a fallback, into 3-5 part-time weeks, which is under a week each. The plan never states the real objective (getting hired), so nothing guides what to cut.
* **Recommendation:**
  - Add a one-line objective, e.g. "Get interviews; delight is secondary", plus one recruiter metric, e.g. "flagship case study reachable in ≤ 2 interactions, < 10 s, from a cold link".
  - Make v1 four worlds: Desktop OS, Editorial, Terminal, Album Rollout. Pit Wall is next.
  - Move worlds 6-12 to "Later candidates", gated on "v1 has been used in real applications".

### B2. Global CSS will leak into every world and break scrolling - Severity: Blocker
* **Reviewer Lens:** `codebase-details`, `design`
* **Affected Scope:** §3 L131, L142-143; Phase 0 L202; worlds 8 and 10
* **Discrepancy:** The code does not match the plan's assumption that each world owns its own look:
  - `src/index.css:5-14` sets `html, body { overflow: hidden; height: 100dvh; background-image: wallpaper.png }`.
  - `:34-62` styles the bare `main` and `nav` elements.
  - `:64-395` styles global ids (`#terminal`, `#contact`, `#resume`...) that `WindowWrapper` puts on the DOM.
  - The Google Fonts `@import` at `:1` blocks rendering for every world.
  - Vite never unloads a lazy chunk's CSS, so desktop styles stay in the page after "Spin again".

  Editorial ("scroll-scrubbed") and Moodboard cannot scroll, and they render on the macOS wallpaper.
* **Recommendation:**
  - Add a Phase 0 step: scope all desktop CSS under a `.world-desktop` root, and move the html/body rules onto it.
  - Reduce global `index.css` to `@import "tailwindcss"` + `@theme` + a neutral reset.
  - Make it a rule that every world scopes its own CSS.
  - Add a Phase 0 done-criterion: "a blank test world scrolls normally and shows no wallpaper".

### B3. Content is not in `constants/index.js`, and project facts are already forked - Severity: Blocker
* **Reviewer Lens:** `codebase-details` (also `implementation-readiness`, `design`)
* **Affected Scope:** §3 L118-123, Phase 0 L199-203, §6 L234
* **Discrepancy:**
  - **(a) Copy is hardcoded outside constants:**
    - `Contact.jsx:145-158`: avatar, email, "Let's Connect"
    - `Welcome.jsx:76`, `Navbar.jsx:12-13`, `Safari.jsx:47`
    - `Terminal.jsx:45`: "8 of 8 stacks loaded", which goes stale
    - `Music.jsx:8`: playlist URL
    - `useJobStats.js:5`: `STATS_URL`
    - `index.html:7`: `<title>`
    - Résumé path in 4 places
  - **(b) Constants mix content with desktop UI config:** `navLinks`, `navIcons`, `dockApps`, `mobileApps`, `MOBILE_DOCK_IDS`, `WINDOW_CONFIG`, `INITIAL_Z_INDEX`. Project records also carry Finder layout: Tailwind `position` classes and `kind`/`children` trees.
  - **(c) There is no `projects` export, and projects exist twice under different names:**
    - `blogPosts` (`constants/index.js:107-148`) uses "Job Search Automation Platform".
    - `locations.work.children` (`:285-742`) uses "Job Search Platform".
    - "Stock Market App" and "Stock Trading Demo" both point to the same repo.

  The "facts never fork" rule is already broken.
* **Recommendation:**
  - Add a Phase 0 mapping table: each export goes either to `content/<file>` or "stays in `src/worlds/desktop/config.js`".
  - Define the `projects.js` schema: id, canonical title, dates, image, links, description, case-study fields, and the numeric/date fields later worlds need (see M6).
  - Derive `blogPosts` and the Finder tree from it with a small adapter, and merge the duplicate stock-app entries.
  - List the hardcoded locations as move targets.
  - Change "Done when" to "all *facts* import from `content/`".

### B4. The routing and persistence state machine is undefined - Severity: Blocker
* **Reviewer Lens:** `implementation-readiness`, `comprehension`, `design`, `structural`, `style`
* **Affected Scope:** §0 L33, §1.1 L43, §1.3 L62-64, §2 row 8 L86, §3 L138, L155-156, Phase 1 L207-209
* **Discrepancy:**
  - "First visit" is never defined.
  - "No-repeat **per session**" (L33) conflicts with a persistent localStorage "seen" list (L62). Nothing says what happens once every world has been seen, which takes 3 spins with 3 worlds.
  - Unknown, empty, uppercase or unshipped `?style=` values have no defined behaviour. With `React.lazy(undefined)` the page crashes.
  - `classic` is used as an id (L64), as a description of Editorial (L86), as an alias (L208) and as a Lighthouse target (L161). Editorial's real id is never given.
  - "Just show me the work" has no destination.
  - Also unspecified:
    - whether `?style=` or a gallery pick writes `last`;
    - whether a removed stored world is handled;
    - push vs replace history, and what Back does;
    - how to return to the machine.
* **Recommendation:** Replace L155-156 with an ordered rule list and a storage contract:
  1. A valid `?style=` (lowercased, aliases resolved via `aliases = { classic: "editorial" }`) loads that world.
  2. An invalid one strips the parameter and falls through, or goes to Editorial with a toast.
  3. If stored `last` is still in the registry, load it and pulse the chip.
  4. Otherwise show the machine.

  Then:
  - Storage key `pexe:v1 = { last, seen[] }`. Spin picks from worlds that are neither seen nor current. When none are left, reset `seen` to `[current]`.
  - Every world entry writes `last`, adds to `seen`, and calls `pushState(?style=id)` with a `popstate` listener.
  - If localStorage throws, keep state in memory only.
  - "Just show me the work" goes to `?style=classic`.

### B5. The reel symbols, the registry and the jackpot rules contradict each other - Severity: Blocker
* **Reviewer Lens:** `implementation-readiness`, `comprehension`, `design`, `structural`, `style`
* **Affected Scope:** §1.1 L45-49, §1.4 L66-68, §3 L127, L145-152, Phase 2 L213, §6 L238
* **Discrepancy:**
  - Album uses era `"2016"`, which is not on Reel 1. Medium `"World"` matches no world, and the trailing "…" leaves `reels.js` undefined.
  - The registry example includes `album` (Phase 2) and leaves out `editorial` (Phase 1). That breaks its own rule, "only shipped worlds".
  - "Three matching symbols" is impossible, because each reel draws from a different category.
  - The jackpot lands on the "flagship world" (the Garage, Phase 3), but the jackpot itself ships in Phase 2.
  - Jackpot work in Phase 2 and the Phase 4 sound/transition pass both break "no machine work after Phase 1" (L238).
* **Recommendation:**
  - Derive the reel strips from `registry.symbols` plus named decoys, and add a dev assert that every triple is unique and present on the reels.
  - Make the registry example exactly the Phase 1 set.
  - Rename the Medium value "World".
  - Either cut the jackpot (see M7), or define it as a pre-picked outcome: a `★` symbol on all three reels landing on `registry.flagship` (`album` until the Garage ships), skipped on mobile and under reduced motion.
  - Reword L238 as "machine *core* frozen after Phase 1".

---

## Major

### M1. Calling `React.lazy(world.load)` during render is a bug, and failed chunk loads are not handled - Severity: Major
* **Lens:** `design`, `codebase-details` · **Scope:** §3 L155-156
* **Problem:** Calling `lazy()` during render creates a new component type every render, so the world remounts or Suspense loops. After a Vercel redeploy, open tabs request old hashed chunks and get 404s.
* **Fix:** Create `component: lazy(load)` once per registry entry at module scope. Wrap worlds in an ErrorBoundary that falls back to Editorial or reloads. Call `world.load()` the moment the result is picked, so the fetch overlaps the spin.

### M2. "Move desktop into `src/worlds/desktop/` with zero behaviour change" is under-specified - Severity: Major
* **Lens:** `codebase-details`, `design`, `implementation-readiness` · **Scope:** §3 L118, L131; Phase 0 L199, L202
* **Problem:**
  - **Aliases:** they exist only in `vite.config.js:11-19` (there is no package.json `imports`). `jsconfig.json:5` maps `#*` to `src/*`, which is already wrong for the root-level `#components`/`#constants`. `content/` sits at the root with no alias, and `Navbar.jsx:2` bypasses the alias with `../constants`.
  - **Scattered code:** the desktop spans `/components`, `src/windows`, `src/mobile`, `src/store`, `src/hooks` and App.jsx (Snowfall, `gsap.registerPlugin(Draggable)`).
  - **Stale state:** the three zustand stores are module singletons, so window state and a climbing `nextZIndex` survive world switches.
  - **StrictMode:** it double-runs effects, so a machine timeline built outside `useGSAP` will double-fire.
* **Fix:**
  - Move the App.jsx body to `src/worlds/desktop/index.jsx`, along with the Draggable registration and the Snowfall import.
  - Leave the other folders in place, or move them and re-point the aliases. State which.
  - Add a `#content` alias to vite.config.js and make jsconfig mirror the vite aliases one by one.
  - Keep `constants/index.js` as an `export * from "../content/..."` shim. Keep the file name, because Dock imports `#constants/index.js` by path.
  - Say whether the desktop stores reset on re-entry.
  - Build all GSAP work inside `useGSAP`.

### M3. The shell-world contract ("receives nothing") cannot deliver the planned features, and the CoinSlot has no stacking contract - Severity: Major
* **Lens:** `design`, `implementation-readiness` · **Scope:** §1.1 L50, §1.2 L54, §1.3 L64, §3 L136, L142-143
* **Problem:**
  - The plan wants a chip "styled per world", world-owned intros, a pulse, mute and reduced-motion reactions, and an exit on "Spin again". None of these works with zero inputs.
  - Desktop window z-indexes climb from 1000 with no upper bound.
  - The navbar, dock, iOS status bar and home indicator occupy the screen edges, so "same position everywhere" will collide with something.
* **Fix:**
  - Keep worlds prop-less, but document the real contract:
    - static registry fields `{ chipTheme, chipCorner }`;
    - one small zustand `useShell` store (`muted`, `reducedMotion`, `phase: intro|live|exiting`, `spin()`) that worlds may read;
    - worlds never import other worlds' stores.
  - Render the chip in the top layer (`popover`) or in a reserved z-index layer, and respect `env(safe-area-inset-*)`.

### M4. The machine sits between recruiters and the work - Severity: Major
* **Lens:** `zoom-out`, `design`, `comprehension` · **Scope:** §1.1 L39-51, §3 L155, Phase 1
* **Problem:**
  - A recruiter is always a first-time visitor. They get a 1.2 s power-on, a spin, and then possibly Terminal, which is type-only and hard to skim.
  - With 3-4 worlds, the reels are decoration over a result that is already picked, yet they cost the power-on, lever, ticks, SFX and a reduced-motion fallback.
  - Phase 1 packs the machine, the whole shell and 2 new worlds into 1-1.5 weeks.
* **Fix:**
  - Put `?style=classic` on every link you hand out (résumé, LinkedIn, applications), and say so in the plan.
  - Make "Just show me the work" the default-focused, visually primary button, and cut or shorten the power-on.
  - Limit random results to worlds tagged `legible: true`.
  - Consider shipping v1 with a CoinSlot "shuffle" instead, and build the full lever machine once 5 or more worlds exist.

### M5. Per-world OG share cards contradict "static SPA, no SSR" - Severity: Major
* **Lens:** `design`, `zoom-out`, `codebase-details`, `implementation-readiness` · **Scope:** §0 L28 vs Phase 4 L222
* **Problem:** Crawlers don't run JS. `index.html` has one static `<title>` and no OG tags, and the repo has no vercel.json or edge function. So every `?style=` link would preview the same.
* **Fix:** Ship one site-wide OG card. If per-world cards are wanted, record an explicit exception in the Decision table: a Vercel Edge Middleware/OG function that rewrites meta tags by `style`.

### M6. Every world re-implements all content, and the world-specific data has no schema - Severity: Major
* **Lens:** `zoom-out`, `design` · **Scope:** §2 L81-90, §2.1 L95-104, §3 L142-143, §6 L234
* **Problem:**
  - N full renderers is the main cost driver behind B1.
  - Several worlds need data that doesn't exist yet: track length = build time, skills as sector times, quests, achievements = milestones, deluxe = side projects. Each world will invent its own values, which forks the facts.
* **Fix:**
  - Make Editorial the only complete renderer, including full case studies. Taste worlds render the hero, the project list and the taste block, and "Read the case study" opens the shared Editorial view or an overlay.
  - Add to the Phase 0 schema the derived-from fields worlds will need: `startedAt`/`shippedAt`, `tier`, `isSide`, dated milestones.
  - Worlds may only derive values from content, never author them.

### M7. Jackpot, achievements and the hidden world are YAGNI and don't fit the registry - Severity: Major
* **Lens:** `zoom-out`, `comprehension`, `structural` · **Scope:** §1.4 L66-68, §2 row 9 L87, Phase 3 L218
* **Problem:**
  - The jackpot is mostly seen by the owner.
  - The achievement system needs persistent tracking and one more world to build.
  - "Unlocks a hidden world" contradicts "never gates content".
  - A hidden world either shows up in spins and the gallery, or breaks the "registry is the only contract" rule.
* **Fix:** Delete §1.4 and the achievement bullet. If Save File ships, it can fake achievements inside its own UI. If a hidden world is ever kept, give it a `hidden: true` registry flag that excludes it from spin and gallery.

### M8. The sound rules contradict each other, and sound reaches almost nobody - Severity: Major
* **Lens:** `comprehension`, `zoom-out`, `design`, `implementation-readiness` · **Scope:** §1.1 L40, §1.2 L59, §3 L139, L169, Phase 4 L222
* **Problem:**
  - L169 says "off by default". L139 says "muted by default on mobile", which implies it is on for desktop.
  - The CRT hum at L40 can't play before a user gesture, because browsers block autoplay.
  - No sound utility exists in the repo.
* **Fix:** Cut sound from v1. If it stays, use one rule: off everywhere until toggled, with the AudioContext created on the first gesture and synthesised SFX (no asset files).

### M9. Acceptance criteria and the performance budget can't be measured, and there is no verification section - Severity: Major
* **Lens:** `style`, `structural`, `implementation-readiness`, `design` · **Scope:** §3 L158-162, Phase 0 L203, Phase 1 L209, Phase 2 L214, Phase 3 L219, Phase 4 L221-224
* **Problem:**
  - "Mid-range Android/laptop" names no device.
  - "3D chunk can be big" sets no cap.
  - "A stranger can name your top artists" and "site looks identical" can't be checked.
  - "Enforced per phase" has no mechanism.
  - Phase 4 has no "Done when".
  - No test runner is installed.
  - App.jsx eagerly loads react-pdf/pdf.js, react-tooltip and react-snowfall. Fonts are a render-blocking `@import`. The 120 KB figure only holds once all of that sits in the desktop chunk.
* **Fix:** Add a §Verification section:
  - **Bundle budget:** a `scripts/check-budget.mjs` that sums the gzip size of the initial modulepreload graph (React included) and fails the build when over.
  - **Lighthouse:** Performance ≥ 85, mobile preset, median of 3 runs on the Vercel preview, for `/` with cleared storage and for `/?style=classic`.
  - **Unit checks:** `node --test` for `pickWorld`, `resolveStyle`, and storage that throws. No new dependency.
  - **Manual QA script:** clear storage → machine; reload → last world; open `?style=x` in a private window.
  - **Phase 0 visual check:** before/after screenshots at 1440×900 and 390×844.
  - **Taste check (replaces the "stranger" test):** "taste block renders all 5 categories, reachable in ≤ 1 interaction from each world's landing view".
  - **Devices:** name a device matrix.
  - **Phase 4:** add a "Done when".

### M10. Phase 0 is blocked by external inputs, and §4 is over-engineered and in the wrong place - Severity: Major
* **Lens:** `implementation-readiness`, `zoom-out`, `structural`, `codebase-details` · **Scope:** §4 L173-190, Phase 0 L200-201, §7
* **Problem:**
  - Phase 0 waits on a Google Takeout export, Pinterest URLs and case-study copy from Aman, all of which are §7 open questions.
  - The Takeout script produces JSON that is then hand-edited anyway.
  - §4 is Phase 0 work but sits between Architecture and Phases.
  - L175 is session narrative, not plan content.
  - `scripts/data/` is not in `.gitignore`.
* **Fix:**
  - Hand-write `content/taste.js` from the seed list, and drop the Takeout script.
  - Move intake to a non-blocking "content track" and fold it into Phase 0 as a sub-list.
  - Leave Pinterest only in §7, and delete L175.
  - If the script stays, add `scripts/data/` to `.gitignore` in Phase 0.
  - Let the UI tolerate empty case-study fields.

### M11. The "Taste block in every world" rule conflicts with the zero-change Desktop move and with reduced motion - Severity: Major
* **Lens:** `comprehension`, `codebase-details` · **Scope:** §2.1 L96, §3 L162, Phase 0 L202, §6 L237
* **Problem:**
  - No phase adds the Taste block to Desktop OS or to Editorial.
  - The desktop has no reduced-motion handling anywhere (WindowWrapper, Welcome and Dock all animate unconditionally), so it fails L162.
  - L237 says taste is "not a section", but §2.1 specifies a section.
* **Fix:** Add Phase 1 tasks "Taste block + reduced motion for Desktop OS and Editorial", or exempt Desktop explicitly. Reword L237.

### M12. The existing Snake game hijacks the keyboard while the desktop is mounted - Severity: Major
* **Lens:** `codebase-details` (verified) · **Scope:** §3 L168 a11y, Phase 0 "zero behaviour change"
* **Problem:**
  - `Game.jsx:50-69` adds a `window` keydown listener that calls `preventDefault` on the arrow keys and w/a/s/d.
  - `WindowWrapper.jsx:44` has `if (!isOpen) return null` commented out, so the listener stays active even when Snake is closed.
  - As a result, Contact and Safari inputs (and any shell overlay input) probably can't receive those keys.
* **Fix:** Attach the listener only while the game is open or running, and ignore events whose target is an input or textarea. Note this as a Phase 0 exception to "zero behaviour change".

### M13. The plan lacks a per-world Definition of Done, Non-goals, Alternatives and rollback - Severity: Major
* **Lens:** `structural`, `design` · **Scope:** whole doc; §0 L26-33, §3, §5
* **Problem:**
  - A world's obligations are spread across 7+ places: the taste block, copyright rules, the registry contract, reduced motion, phone layout, a11y, the intro and the signature moment.
  - Non-goals are buried in other sections.
  - The Decision table states choices without the alternatives that were rejected.
  - Phase 0 moves the live site and Phase 1 replaces App.jsx, but neither has a rollback.
* **Fix:**
  - Add "§3.x World contract / DoD" as a checklist, and have Phases 2 and 3 cite it.
  - Add "Non-goals": no CMS, no SSR (except a scoped OG exception), no hosted audio, no more than N worlds.
  - Add "Alternatives": gallery-first landing, a theme layer instead of whole-world renderers, path routes.
  - **Rollback:** promote Vercel deployments per phase, keep the machine behind a flag that defaults to `desktop` until Phase 1 passes, and use "remove from `registry.js`" as the kill-switch for a broken world.

### M14. Several worlds depend on media that may not exist - Severity: Major
* **Lens:** `zoom-out` · **Scope:** §2 rows 6, 10, 11, 12; §7 Q2 L244
* **Problem:** Channel Surf, Moodboard, The Garage and Credits Roll all need a showreel, renders or footage. If those assets have to be made, that is a second, unscheduled project.
* **Fix:** Make "the assets exist" an entry condition for those worlds.

### M15. Pit Wall's "live telemetry" is three static counts that may be null - Severity: Major
* **Lens:** `codebase-details` · **Scope:** §2 row 5 L83
* **Problem:** `src/hooks/useJobStats.js` makes one GET to a Cloud Run endpoint (9 s timeout, module-level cache) and returns `{ total, applied, high_match }` or `null`. Its only consumer, Contact, hides itself on failure.
* **Fix:** Reuse the hook as it is. Specify the Pit Wall design for null data (a placeholder or last-known value), and drop the word "live".

### M16. The Terminal world is new work, and its id collides with the desktop - Severity: Major
* **Lens:** `codebase-details`, `zoom-out`, `implementation-readiness` · **Scope:** §2 row 2, Phase 1
* **Problem:**
  - `src/windows/Terminal.jsx` is a static tech-stack table labelled "Skills", with no command parser to reuse.
  - The id `terminal` collides with the desktop's `#terminal` CSS and the `windows.terminal` store key.
* **Fix:** Budget the Terminal world as built from scratch. Namespace world DOM ids and folders (e.g. `world-terminal`).

### M17. Résumé, contact and the "≤ 2" rule are inconsistent - Severity: Major
* **Lens:** `implementation-readiness`, `codebase-details`, `comprehension`, `style` · **Scope:** §1.2 L55-59, §3 L119, L168, Phase 1 L209, §6 L232
* **Problem:**
  - The PDF lives at `/files/resume.pdf` and is hardcoded in `Resume.jsx:22,30` and `MobileResume.jsx:28,37`.
  - The rule is stated as "one click" (L58), "≤ 2 interactions" (L168) and "≤ 2 clicks" (L209, L232).
  - Contact must be reachable in ≤ 2, but the CoinSlot has no contact entry.
  - The machine screen isn't covered by the rule.
* **Fix:**
  - Add `resumeUrl: "/files/resume.pdf"` to `content/profile.js` and replace all 4 references.
  - CoinSlot renders `<a href target="_blank" rel="noopener">`.
  - Use "≤ 2 interactions (click, tap or key)" everywhere.
  - Add Contact to the CoinSlot and the machine screen, and reuse `Contact` with its `embedded` prop.

### M18. Vercel Analytics is not installed - Severity: Major
* **Lens:** `codebase-details` (verified) · **Scope:** Phase 4 L223
* **Problem:** "Already free" suggests it is already set up. In fact `@vercel/analytics` is not in package.json and nothing imports it.
* **Fix:** List it as a new dependency (`<Analytics/>` in main.jsx, plus enabling it in the dashboard). Check whether per-world tracking needs custom events on a paid plan; the reviewer did not verify this. If so, encode the world in the pageview path instead.

---

## Nits

1. **Existing code the plan should reuse** (§2.1, §2, §3; `codebase-details`, `zoom-out`):
   - `Music` with `embedded` for "On repeat" and Terminal `play music`. Note that `PLAYLIST_EMBED_URL` is a Spotify editorial playlist (`37i9dQZF1DX5trt9i14X7j`), not Aman's, which contradicts §2.2; move it into `taste.js`.
   - `Game` with `embedded` for Save File. Its localStorage calls at `:28,:127` lack try/catch.
   - `Contact` with `embedded`.
   - `useIsMobile` (1023px breakpoint) as the shared phone-layout check.
   - GSAP Draggable for the lever.
2. **Dependencies** (L30-32): `three`, `@react-three/fiber` and `@react-three/drei` are new Phase 3 dependencies, so list them there. `snowfall` ^2.1.0 is installed but unused; App imports `react-snowfall/src`.
3. **Premature file split** (§3 L125-128): don't split `machine/` into three files before the machine exists. Use one file. Mark each tree entry as Create, Move or Modify.
4. **README** (`README.md:20,42,58`) says constants hold "All content" and that no env vars are needed, but Contact needs `VITE_FORMSPREE_FORM_ID`. Update it in Phase 0.
5. **Emoji** used as UI labels (L55-59). Name `lucide-react` icons instead; it is already installed.
6. **Tone and point of view** (L3-21, L246): the doc shifts between "his", "you" and "Aman", and uses marketing phrasing. Rename §0 to "Rationale and decisions" and pick one point of view.
7. **Wrong count and early term:** "16 half-finished worlds" (L21) matches no count in the plan, so use 12. "Taste layer" (L13) is used before §2 defines it.
8. **Ids and table:** the §2 table has no `id` or `Phase` column, so share links for most worlds can't be built. Add both, and move the long prose cells to per-world subsections.
9. **Duplication** (§0, §6): the §6 Risks table restates numbers from §3 and §5. Cite the sections instead, and split the pitch from the Decision table.
10. **Domain and vercel.json:** `portfolio-1-five-jet.vercel.app` appears only in `README.md:5`. No vercel.json is needed for `/?style=`. Add one only if path routes are adopted.

---

## Suggested smaller v1 (zoom-out lens, ~3-4 weeks part-time)
- **Phase 0:** as written, plus the fixes for B2 and B3, minus taste intake.
- **Shell:** `useWorld` per B4, plus a CoinSlot with All worlds, Copy link, Résumé and Contact. No sound, no jackpot.
- **Worlds:**
  - Desktop OS (existing)
  - Editorial: recruiter default and the full case studies
  - Terminal
  - Album Rollout
- **Then:** ship it and use it in applications. Pit Wall comes next. Build the lever machine once 5 or more worlds exist.
