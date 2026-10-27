# PORTFOLIO.exe — Build Plan

> A lever-pull machine that spins you into one of Aman's worlds. Every world is a
> different design language; every world shows the same real work. And every world
> is unmistakably *his* — rap, anime, film, racing, 3D, Y2K — not a template.

Status: plan (rev 2, after EGM review: see PORTFOLIO_EXE_PLAN.review.md) · Owner: Aman · Created: 2026-10-27

**Objective:** get hired / get clients. Everything else serves that.
**Recruiter metric:** from any shared link, a recruiter reaches projects + résumé in ≤ 5 seconds and ≤ 2 clicks.

**v1 = 4 worlds:** Desktop OS (exists), Editorial, Terminal, Album Rollout. Everything else in §2 is *later*,
built one at a time only after v1 is live and shared.

**Non-goals for v1:** jackpot, achievements, hidden worlds, per-world OG images, 3D, sound design pass.

---

## 0. Honest verdict

**Good idea, with one condition: the taste layer is what makes it great, not the slot machine.**

- A style-randomizer alone is a clever theme switcher. People have seen terminal
  portfolios, macOS portfolios, Y2K portfolios. Ten of them in a trench coat is still
  ten things people have seen.
- What nobody else can copy is *you*: a portfolio that feels like a Travis rollout, a
  neo-Tokyo bike chase, a pit-wall telemetry screen, a sitcom channel guide. The worlds
  should be built **out of your taste**, not out of generic aesthetics.
- The risk is real: 16 half-finished worlds is worse than 4 great ones. Every phase
  below ships something complete and deployable.

**Decisions made in this plan (not up for re-litigation unless something breaks):**

| Decision | Choice | Why |
|---|---|---|
| Framework | **Stay on Vite + React 19** (no Next.js migration) | Static SPA, no SSR need. Migrating costs a week and buys nothing. `?style=` works fine client-side. |
| Existing macOS desktop | **Becomes World #1** ("Desktop OS"), not thrown away | It's already built and polished. The iOS mobile mode becomes its phone layout. |
| Content | **One source of truth** in `content/` | Worlds are renderers. Facts never fork. |
| 3D | `three` + `@react-three/fiber`, **lazy-loaded**, only in phase 3 | Only the 3D world pays the bundle cost. |
| Animation | GSAP (already installed) for everything | No second animation library. |
| Randomness | Random among **shipped** worlds only, no-repeat per session | Never lands on a "coming soon". |

---

## 1. The experience

### 1.1 First visit
1. Black screen → machine powers on (lights chase, CRT hum, ~1.2s).
2. Machine: **PORTFOLIO.exe — "a machine for alternate realities"**. Three reels, a lever.
3. Under the machine, always visible: `[ Spin ]  [ Pick a world ]  [ Just show me the work ]`.
4. Pull lever (drag, click, tap, `Space`/`Enter`) → reels spin at different speeds,
   stop left→right with mechanical ticks.
   - Reel 1 — **Era**: `2001` · `1988` · `2026` · `2049` · `Y2K` …
   - Reel 2 — **Medium**: `Terminal` · `Desktop` · `Album` · `Pit Wall` · `Magazine` · `World` …
   - Reel 3 — **Mood**: `Loud` · `Clean` · `Cinematic` · `Unhinged` · `Calm` …
   - The *result* is picked first; reels are animated to land on that world's 3 symbols.
     The combinations are a costume — only real, art-directed worlds can come up.
5. Land → one-beat "jackpot" flash → transition into the world (each world owns its
   intro transition: terminal boots, album "drops", pit lane lights go out…).

### 1.2 Inside any world — the persistent "coin slot"
A small fixed control (corner chip, styled per world but same position everywhere):
- 🎰 **Spin again** (short spin, no intro)
- 🗂 **All worlds** (gallery grid of every world with a one-line description)
- 🔗 **Copy link** to this world (`/?style=album`)
- 📄 **Résumé** (direct PDF, one click, every world)
- 🔇 Sound on/off · reduced motion respected automatically

### 1.3 Routing & persistence (exact rules)
On load, first match wins:
1. `?style=<id>` and `<id>` (after aliases) is in the registry → render that world, no machine.
   Unknown id → fall through (never crash).
2. `localStorage["pexe:last"]` holds a valid id → render it, no machine, chip pulses once.
3. Otherwise → machine.

- Aliases: `{ classic: "editorial" }`. "Classic" means Editorial, nothing else.
- **"Just show me the work"** = go to `editorial` (Editorial is the recruiter view).
- Spin picks uniformly from registry minus `sessionStorage["pexe:seen"]`; when all are seen, clear the list.
- Every link you hand to a recruiter is `?style=classic`. The machine is for curious visitors, not for applications.
- All storage access wrapped in try/catch; failure = behave like a first visit.

### 1.4 Rare "jackpot": later, not v1
Reels are derived from the registry (each world declares its 3 symbols), so "three matching" isn't possible as written.
Re-design once ≥ 7 worlds exist: e.g. a rare golden symbol set that lands on the flagship world.

---

## 2. Your taste → worlds (the core of this plan)

Generic styles from the original brainstorm are **merged into taste-driven worlds**. Each
row is one world. "Signature" is the one moment people screenshot.

| # | World | Built from your taste | How the portfolio is presented | Signature moment |
|---|---|---|---|---|
| 1 | **Desktop OS** *(exists)* | macOS/iOS, design polish | Current site: windows, dock, Finder | Already live — the "home" world |
| 2 | **Terminal** | dev identity | `ls projects`, `cat about.md`, `play music`, `open resume`; tab-complete, history | Hidden commands: `drive`, `spin`, `vinyl`, `sudo hire aman` |
| 3 | **Album Rollout** | Kanye / Trav / Drake / Cole / Kendrick, rollout culture | Portfolio = an album. Projects = tracklist (length = build time), features = tech stack, liner notes = case study, "deluxe edition" = side projects | Track hover plays a short beat-synced waveform; "album drops" countdown intro |
| 4 | **Neo-Tokyo 2019** | Akira, anime, bikes | Red/black cyberpunk city at night; projects are neon signs; nav by bike slide | The bike-slide transition between sections (original art, *inspired by*, no film assets) |
| 5 | **Pit Wall** | racing, bikes, telemetry | F1/MotoGP-style timing screen: projects as drivers on a leaderboard, skills as sector times, experience as race laps | "Lights out" 5-red-light intro; live-looking telemetry from your real job-search stats hook |
| 6 | **Channel Surf** | sitcoms, films, video editing | CRT TV with a remote. Channels: 01 About (sitcom cold-open style), 02 Projects, 03 Showreel (your edits), 04 Contact | Static between channels; "previously on Aman…" recap |
| 7 | **Y2K Chrome** | Y2K | Liquid chrome, iridescent buttons, early-web futurism, Windows-Media-Player-skin vibes | Chrome blob that follows cursor and reflects page content |
| 8 | **Editorial** | "proper award design" | Huge type, strict grid, case studies like a magazine feature. This is the **classic/recruiter** view. | Scroll-scrubbed type reveals, page-turn transitions |
| 9 | **Save File** | games | Game title screen → "Continue / New Game / Options". Projects = quests, skills = stats, experience = levels, achievements = real milestones | Pixel-perfect menu SFX; "Achievement unlocked: viewed all worlds" |
| 10 | **Moodboard** | Pinterest, 3D art, design | Infinite masonry board of your 3D renders, edits, references; projects are pinned cards | Drag-to-pan infinite canvas |
| 11 | **The Garage (3D)** | 3D art, bikes, racing | R3F scene: a garage at night. Bike on stand = flagship project, wall monitors = projects, vinyl player = music, poster wall = films/anime | Walk-up camera moves; flagship showcase world |
| 12 | **Credits Roll** | films (One Battle After Another, Akira…) | Portfolio as a film: opening title card, "starring", end credits = skills/thanks | Letterboxed cold open with your own footage |

Later candidates (only after 1–12 hold up): Vaporwave, Webcore chaos, Brutalist, Mission
Control, Generative particles, Holographic lab.

### 2.1 The "Taste" content block (shows up in every world)
Every world must render a **"What I'm into"** section, in its own visual language:
- **On repeat** — artists + current tracks (from `content/taste.js`, later fed by YT Music export)
- **Watching** — films, anime, sitcoms
- **Playing** — games
- **Riding / racing** — bikes, series you follow
- **Making** — 3D renders, edits, concepts (your own work — this one doubles as portfolio)

Album Rollout renders it as "samples & influences"; Pit Wall as "team radio"; Terminal as
`cat ~/.taste`; Save File as an inventory screen. Same data, different costume.

### 2.2 Copyright & taste guardrails
- **No album covers, film stills, logos, or anime frames** as assets. Evoke the vibe
  with original type, color, and layout; name the works in text.
- Music: embed your **own** playlists (Spotify/YT Music embeds) — never host audio files of tracks.
- Your own 3D renders, edits, and photos are the hero imagery. That's the point.
- Fonts: Google Fonts or self-hosted open licenses only.

---

## 3. Architecture

```
content/                    # single source of truth (moved from constants/index.js)
  profile.js                # name, role, positioning line, socials, resume path
  projects.js               # projects + case study fields (problem/approach/outcome/links)
  experience.js
  skills.js
  taste.js                  # music, films, anime, shows, games, racing, making
src/
  machine/
    Machine.jsx             # reels, lever, buttons; GSAP timeline
    reels.js                # symbol lists per reel
    useSpin.js              # pick world (no-repeat), drive reel animation
  worlds/
    registry.js             # [{ id, name, tagline, symbols:[era,medium,mood], load: () => import(...) }]
    desktop/                # existing App desktop + mobile moved here, unchanged behaviour
    terminal/
    album/
    ...
  shell/
    CoinSlot.jsx            # persistent chip: spin / all worlds / link / resume / sound
    WorldGallery.jsx
    useWorld.js             # ?style= <-> state <-> localStorage
  sound/sfx.js              # tiny WebAudio wrapper, muted by default on mobile
```

**Registry is the only contract a world needs:** export a default component that receives
nothing and imports what it needs from `content/`. No world-specific props, no plugin system.

```js
// src/worlds/registry.js
export const worlds = [
  { id: "desktop",  name: "Desktop OS",    tagline: "The one you know.",       symbols: ["2026","Desktop","Clean"],     load: () => import("./desktop") },
  { id: "terminal", name: "Terminal",      tagline: "Type your way in.",       symbols: ["1988","Terminal","Calm"],     load: () => import("./terminal") },
  { id: "editorial",name: "Editorial",     tagline: "Just the work, beautifully.", symbols: ["2026","Magazine","Clean"], load: () => import("./editorial") },
  { id: "album",    name: "Album Rollout", tagline: "The portfolio, deluxe.",   symbols: ["Y2K","Album","Loud"],         load: () => import("./album") },
  // reel symbol lists are built from these `symbols` arrays, so reels and registry can't drift
  // only shipped worlds go in this array — that is what keeps the machine honest
];
```

`App.jsx` becomes: resolve world per §1.3 → `<Machine/>` or the world's lazy component inside
`<ErrorBoundary>` + `<Suspense>` + `<CoinSlot/>`.
- Create each `React.lazy(load)` **once at module level** in the registry (never during render).
- ErrorBoundary catches chunk 404s after a redeploy → reload once, then fall back to Editorial.
- CoinSlot sits in its own top layer (`z-index` above anything a world uses; desktop windows climb from 1000,
  so cap them or put CoinSlot in a separate stacking context).
- Worlds receive one prop, `shell = { muted, reducedMotion }`, so they can respect sound and motion settings.

**Performance budget (enforced per phase):**
- Machine + shell initial JS ≤ **120 KB gz**. Worlds are separate chunks.
- 3D world chunk can be big but only loads when chosen; show a styled loader.
- LCP < 2.5s on mid-range Android (Lighthouse mobile ≥ 85 for machine + classic).
- `prefers-reduced-motion`: machine shows a static picker; worlds disable heavy motion.

**Mobile:** machine fits the viewport, lever = big tap target. Desktop OS world keeps the
existing iOS Springboard on phones. Each new world must have a phone layout before it
enters the registry — no exceptions.

**Accessibility minimums:** every world keyboard-navigable; résumé + contact reachable in
≤ 2 interactions from anywhere; machine buttons are real `<button>`s; sound off by default.

---

## 4. Taste intake (gathering the real data)

Browser access to your logged-in accounts wasn't available, so taste data comes in through
files you control:

1. **YouTube Music** → Google Takeout → select *YouTube and YouTube Music* → history in JSON.
   Drop `watch-history.json` into `scripts/data/` (gitignored). A ~30-line
   `scripts/taste-from-takeout.mjs` tallies top artists/tracks for the last 12 months
   and writes `content/taste.generated.json`. You hand-edit the final `taste.js`.
2. **Pinterest** → send your public profile/board URLs. Boards get reviewed for
   palette, type, and recurring motifs → becomes a per-world moodboard in `docs/moodboards/`.
3. **Manual list** (5 min): top 10 films, top 5 anime, top 3 sitcoms, top 5 games,
   bikes/teams/riders you follow, 3 edits you're proudest of.
4. **Your own media**: 3D renders, edit reels, photos → `public/media/` (compressed: AVIF/WebP, MP4 H.264 ≤ 8 MB each).

Already known (seed for `taste.js`): Kanye West, Travis Scott, Drake, J. Cole, Kendrick
Lamar · One Battle After Another, Akira · anime, sitcoms, games · 3D art, video editing,
Y2K, award-level design · racing, bikes.

---

## 5. Phases

Each phase ends deployed on Vercel and usable. Estimates assume part-time solo work.

### Phase 0 — Groundwork (3–5 days)
Pre-existing problems the review found in the current code (fix here, before any new world):
- `src/index.css` sets `overflow:hidden` + wallpaper on html/body and styles bare `main`/`nav`/`#terminal`/`#contact`.
  Scope all of it under `.world-desktop`; global stylesheet = neutral reset only. (Vite never unloads a lazy chunk's CSS.)
- `src/windows/Game.jsx` adds a global keydown listener with `preventDefault` that is always mounted
  (`WindowWrapper.jsx` has `if (!isOpen) return null` commented out). It blocks arrows/WASD site-wide, including
  the Contact form. Attach only while the game window is open.
- Content is not only in `constants/index.js`: copy is hardcoded in Contact, Welcome, Navbar, Safari, Terminal,
  Music (playlist URL), `useJobStats`, `index.html`, and 4 résumé-path references. Projects exist twice
  (`blogPosts` vs `locations.work.children`).
  → Create `content/projects.js` as the one list; derive the Finder tree and `blogPosts` from it.
- Add `#content` alias to `vite.config.js` (and fix `jsconfig.json` to match).
- `Draggable` registration and zustand stores move inside the desktop world.

Then:
- Move `constants/index.js` content into `content/*` (keep `#constants` re-exporting for now).
- Add case-study fields to the top 3 projects (Job Search Automation, WhatsApp AI Agent SaaS, 3D Macbook Scroll).
- Create `content/taste.js` from the seed list; run taste intake (§4).
- Move current desktop + mobile into `src/worlds/desktop/` with zero behaviour change.
- **Done when:** site looks identical, all content imports from `content/`.

### Phase 1 — The Machine + 3 worlds (1–1.5 weeks)
- Machine, reels, lever, spin logic, SFX, reduced-motion fallback.
- Shell: `useWorld` (`?style=`, localStorage, no-repeat), CoinSlot, WorldGallery.
- Worlds: **Desktop OS** (existing), **Terminal**, **Editorial** (doubles as `classic`).
- **Done when:** first visit spins, return visit skips, links share a world, résumé ≤ 2 clicks everywhere, Lighthouse mobile ≥ 85.

**v1 ships after Phase 1 + Album Rollout** (≈ 3–4 part-time weeks total). Phases 2–4 below are the
*later* roadmap; re-plan them after v1 has been shared with real recruiters.

### Phase 2 — The taste worlds (2–3 weeks)
- **Album Rollout**, **Pit Wall**, **Y2K Chrome**, **Channel Surf**. One at a time, each fully finished (desktop + phone + reduced motion) before the next starts.
- Jackpot animation.
- **Done when:** 7 worlds in registry; a stranger can name your top artists, that you ride, and one film you love after 60 seconds on the site.

### Phase 3 — Flagship 3D + the rest (3–5 weeks)
- **The Garage** (R3F, lazy), then **Neo-Tokyo 2019**, **Save File**, **Moodboard**, **Credits Roll**.
- Achievement system ("visited 5 worlds" → unlocks a hidden world/easter egg).
- **Done when:** 12 worlds, 3D world ≥ 45 fps on a mid-range laptop and has a non-3D fallback.

### Phase 4 — Polish & submit (1 week)
- Sound design pass, transition pass, copy pass, OG images per world (`?style=` share cards).
- Analytics: which worlds people land on / stay in (Vercel Analytics, already free).
- Submit to Awwwards / CSS Design Awards / godly / Hoverstat.es only after real-device testing.

---

## 6. Risks & how this plan handles them

| Risk | Mitigation in plan |
|---|---|
| Gimmick buries the work | "Just show me the work" button on the machine; return visits skip; résumé ≤ 2 clicks |
| 12 mediocre worlds | Registry only holds finished worlds; one world at a time in phase 2–3 |
| Content drift across worlds | All facts from `content/`; worlds hold zero copy about projects |
| Bundle bloat | Per-world lazy chunks; 120 KB budget for machine + shell |
| Copyright | §2.2 — evoke, don't copy; your own media as hero imagery |
| Taste feels like a list of names | Taste is *the design language* of worlds, not a "Hobbies" section |
| Time sink on the intro | Machine capped at Phase 1; no machine work after that except bug fixes |

---

## 7. Open questions for Aman
1. Pinterest profile URL + which boards matter most?
2. Do you have edit reels / 3D renders ready, or is making them part of this project?
3. Domain — keep `portfolio-1-five-jet.vercel.app` or buy one (e.g. `amanpatel.dev`)?
4. Which ONE taste world do you want first in phase 2? (Recommendation: **Album Rollout** — most "you", lowest technical risk.)
