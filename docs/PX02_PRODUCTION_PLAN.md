# PX-02: from prototype to production (direction draft, 2026-11-12)

**For Aman to read and mark up.** This is the *direction*, not yet the implementation plan. Write your thoughts inline
(agree / change / no), especially in the **Decisions** section at the end. Once it's settled, it becomes the step-by-step
implementation plan.

---

## 0. In one paragraph

The site has too many good ideas competing at the same time. It reads as a prototype because nothing has been
*finished to one standard*: the home shows about 15 things at once, the page loads 15 font families, every world uses
its own visual rules, and the 3D looks generated rather than art-directed. PX-02 is a production pass:
- **One clear home** with two complete environments: a sunlit Roman villa in light mode and a night vault in dark mode.
- **A real asset pipeline:** Blender, baked lighting, scanned textures from CC0 libraries, compressed glTF.
- **A mobile home designed from scratch** for thumbs, not shrunk from desktop.
- **One shared production layer** (type, motion, loading, sound, transitions) that every world sits on.

Keep the soul: the machine, the worlds, the red signature, the keychains, the giant "Portfolio" word. Change the craft.

---

## 1. Honest diagnosis: why it feels like a prototype

Screenshots taken today, 1440 and 390, live site.

### 1.1 The home hero: about 15 elements fighting for attention
On one desktop screen right now:
1. the giant "Portfolio" word;
2. the red "Aman Patel" signature, overlapping it;
3. "Ahmedabad, IN" handwritten;
4. "fullstack dev" handwritten;
5. the "pull me" note and arrow doodle;
6. six keychains, each with a caption;
7. the 3D machine;
8. a top bar (मन logo, PX-01 label, Sound toggle, live clock);
9. a "[2026]" tag;
10. a right-hand panel: "Optional · a style picker", a 1-2-3 "how it works" list, "Drag the lever · Space", "28 pulls so far", the Pull button and "Skip the machine · View my work";
11. a row of 9 world links plus Résumé;
12. the "Or just scroll · it's all below" box;
13. the custom cursor;
14. the marquee below the fold;
15. the nudge popup, later.

**The pattern:** every element is individually nice, but there is no hierarchy. The eye has nowhere to land first.

**The copy apologises for the concept.** "Optional · a style picker", a 3-step tutorial, "Or just scroll" all explain the
machine instead of letting it be obvious. Award-level sites don't explain; the design makes the action obvious.

### 1.2 Navigation: four systems for one job
These all do overlapping things:
- the hero world links;
- the side panel's "Skip / View my work";
- "Or just scroll";
- the phone's liquid dock, plus "All worlds" and "Résumé" buttons on phones.

A first-time visitor can't tell which one is *the* way in.

### 1.3 Type: 15 font families on the home
index.html loads: Geist, Geist Mono, Homemade Apple, Instrument Serif, Russo One, Archivo, Space Mono, VT323,
IBM Plex Mono, Schibsted Grotesk, Newsreader, plus four "Aman" script subsets. Many belong to worlds but are loaded on
the home. That is a performance cost, and it's why the home has no consistent voice. **Production sites use 2–3 faces.**

### 1.4 The 3D looks generated, not art-directed
- Lighting is real-time only: no baked bounce light, no soft contact shadows, no ambient occlusion.
- There's no surface story: real brass, enamel and glass have texture, wear and roughness variation. Ours are flat
  colours with gloss.
- The environment is a void plus dots. Award sites put the object *somewhere*: a room, a light, a ground it sits on.

### 1.5 Worlds: twelve sites, twelve standards
Each world is a decent idea, but there's no shared production layer:
- loading screens differ;
- transitions differ;
- focus styles differ;
- some have sound, some don't;
- button styles and bottom spacing differ.

RIDE is low-poly while the home aims at realism; POCKET is pixel. That variety is the point, but the *finish* must be
equal.

### 1.6 Mobile: desktop, stacked
- The hero on 390 px stacks the keychains, signature, word, machine, panel and links into one long, crowded column.
- The machine is small, and the controls overlap the scene.
- Below the fold, the stats strip and tape compete with the dock.

Nothing was designed *for* a thumb.

---

## 2. What "production / Awwwards level" means here (the bar we hold every screen to)

Measurable, so we can review against it:

| Area | The bar |
|---|---|
| Hierarchy | One focal point per screen. Max 1 primary + 1 secondary action above the fold. |
| Type | 2 faces site-wide for the shell (one display, one text) + 1 mono for data. Worlds may add one face each, loaded only in that world. |
| Colour | Each theme has 1 surface, 1 ink, 1 accent. No ad-hoc colours. |
| 3D | Art-directed: baked lighting/AO, real material textures, contact shadows, colour grading. No "default PBR in a void". |
| Motion | Shared tokens (done in PX-01), one signature transition, everything interruptible, reduced-motion designed. |
| Performance | LCP < 2.5 s on a mid phone, 60 fps desktop / 45+ mid phone, home JS < 250 KB gz excluding 3D assets, 3D assets < 3 MB, quality tiers. |
| Craft details | Custom focus states, loading as an experience (never a blank screen), sound design (opt-in), hover/press on every control, no layout shift. |
| Copy | Confident and short. No tutorials, no "optional". |
| Proof | Every claim on the site links to something real (live site, case study, repo). Already true; keep it. |

References to calibrate against (all Awwwards SOTD/SOTM-level, for *finish*, not to copy):
- Bruno Simon's folio (play is navigation);
- Lusion (lighting and materials);
- Active Theory work (scene transitions);
- Igloo Inc (one object, perfectly lit);
- Lynn Fisher's yearly redesigns (one idea, fully committed).

---

## 3. The new home: "The Machine, exhibited"

**Concept:** the machine is no longer floating in a dark void with stickers around it. It's an **exhibit**: a single
sculptural object, placed somewhere, lit beautifully, with the rest of the interface stripped back to museum-label
restraint. Light and dark mode are **two different places**, not two colour palettes.

### 3.1 Light mode: "The Villa" (your idea, developed)
- **Place:** a sunlit room in a Roman/Italian villa:
  - floor: white Carrara marble with grey veins, slightly reflective;
  - walls: painted a deep, slightly chalky *blue* (fresco blue / Pompeian blue, not tech blue), with a shallow
    arched niche the machine stands in front of;
  - one tall window off-frame, whose light falls across the floor as a soft, warm *window-frame shadow* (baked, so
    it's cheap);
  - optional details: a fluted column edge, a terracotta pot with an olive branch.
- **The machine:** stands on a **marble plinth** like a museum piece. Its finish shifts for daylight: ivory enamel body,
  polished brass trim, a red lever knob (the one accent).
- **Signature detail:** the plinth face is engraved like a Roman inscription:
  `AMAN · PATEL · MMXXVI` in carved capitals (cut-in shading, not printed on). The giant "Portfolio" becomes a
  **carved frieze** across the wall behind, very large and pale, part of the architecture rather than an overlay.
  The red handwritten "Aman Patel" stays as *the artist's signature*: brushed in red paint on the plinth corner or
  on a gallery label, the way a painter signs a canvas.
- **Keychains (your favourite):** fewer, bigger, physical. They hang from a brass hook on the plinth as one cluster
  that sways when you touch it. They stay real logos and become 3D objects in the scene, not DOM stickers.
- **Light:** warm morning sun, soft blue bounce from the walls, gentle dust in the sun beam.
- **Type for light mode:** a refined high-contrast serif for display (inscription feel) + a clean grotesk for text.

### 3.2 Dark mode: "The Vault" (a totally different place, as you asked)
- **Place:** a private night vault / after-hours gallery:
  - board-formed concrete walls and a polished black terrazzo floor;
  - one tight overhead spotlight cone on the machine, with dust drifting in it;
  - deep shadows everywhere else.
- **The machine:** dark gunmetal body, brass trim catching the spotlight, the reels glowing softly from inside.
- **The giant "Portfolio":** cut **brass letters mounted on the concrete wall**, lit edge-on by the spotlight spill.
- **The signature:** red neon *line* script; one thin line, warm red, never purple.
- **Keychains:** the same cluster, catching single glints in the dark.
- **Mood:** quiet and cinematic. The room is almost black; the object is the only story.

### 3.3 Switching between them
- The **theme toggle is a physical light switch** on the wall (and a small toggle in the bar for accessibility).
- Flipping it is the signature transition: the camera stays still while the light changes. The window sun fades, the
  spotlight clicks on with a soft *thunk*, and the room cross-dissolves from Villa to Vault (about 1.2 s; reduced motion
  gets an instant swap).
- The default follows the visitor's system setting (`prefers-color-scheme`). The choice is remembered.
- Under the hood: two baked lighting sets and two material sets for the same machine, with the environment meshes
  swapped behind the cross-fade. Both scenes are loaded on demand: the other theme's assets load only when you switch.

### 3.4 The new hero layout (desktop)
Above the fold, only:
- **the exhibit** (machine + room), taking the whole frame;
- a museum-label block, bottom-left:

  ```
  AMAN PATEL
  Full-stack engineer · Ahmedabad
  Builds AI products, client sites and Android apps.
  ```

- **one primary action:** "Pull the lever" (or drag the real lever);
- **one secondary action:** "See the work" (straight to the recruiter path);
- top bar, minimal: the मन mark (left); Worlds · Work · Résumé · Contact and the theme switch (right).

**Removed from the hero:**
- the 1-2-3 tutorial;
- "Optional · a style picker";
- "Drag the lever · Space" (that becomes a cursor hint on hover);
- the pull counter (it moves to the reel display, inside the machine);
- the 9-link row (it moves to a Worlds menu);
- "Or just scroll";
- the "[2026]" tag;
- the "fullstack dev" and "Ahmedabad" doodles (the info is in the label).

**After a pull:** the camera pushes into the reel window as now, and the result appears as a *museum ticket* on the
plinth: world name, one line and an Enter button. Same idea as today, executed cleaner.

### 3.5 Below the fold: one calm exhibition
The sections stay (Work, Live & maintained, Experience, Skills, Contact) but are re-set as an exhibition catalogue:
- the same 2-face type system and generous whitespace;
- one accent;
- the scroll story from PX-01, kept and simplified.

The marquee and the "tape" strips go: they're the loudest prototype tells. Contact stays a real form.

---

## 4. Mobile: designed for a thumb, not shrunk

**Principle:** on a phone the home is a *sequence*, one idea per screen, controlled from the bottom of the screen where
the thumb lives.

| Screen | Content |
|---|---|
| 1. Exhibit | The machine fills the upper ~65% (camera re-framed for portrait, closer and slightly from below so it feels monumental). Museum label (name, role, city). |
| 2. Choose | "Pick a world": a horizontal, swipeable card rail. Each card shows a 3-second looping preview video of that world plus its name and one line. RIDE is first. |
| 3. Work | Featured projects as full-width cards (screenshot, name, one line, live link). |
| 4. Proof + contact | Live sites (real status lights), experience, skills (collapsed), contact form, résumé. |

- **The sticky bottom bar** is the only persistent navigation on mobile: **Pull · Worlds · Résumé · Contact**. It replaces
  the liquid dock + inline buttons + "All worlds" + "Résumé" duplicates, while keeping the liquid-glass look you like.
- **Pull on a phone:** swipe down on the machine (the lever follows your thumb), or tap Pull in the bar. Haptic tick on
  each reel stop where supported.
- **Performance tier for phones:** baked lighting only (no real-time shadows), lower DPR, compressed textures. The
  other theme's room isn't loaded until requested. Weak devices get a high-quality *still render* of the exhibit with
  the same UI.
- **Rules:** nothing overlaps the machine. 44 px targets. No horizontal scroll. Text never sits on a busy background.

---

## 5. The production pipeline: Blender + better shaders + free assets

### 5.1 Is Blender worth it? Yes, for these specific reasons
1. **Baked lighting.** Blender (Cycles) renders bounce light, soft shadows and ambient occlusion into textures
   (lightmaps). The browser then shows render-quality light for almost no GPU cost. This is the biggest single quality
   jump available, and how most award-winning 3D sites get their look.
2. **Proper modelling:**
   - the machine rebuilt with real bevels (edges that catch light);
   - correct proportions;
   - clean UVs for textures;
   - the villa and vault rooms built as real spaces.
3. **One export pipeline:** glTF with Draco/Meshopt geometry compression and KTX2 textures, for small files and fast
   loads.
4. **Scriptable:** Blender has a full Python API. I can generate, light, bake and export scenes from scripts in
   headless mode, repeatably. You can also open the same .blend files and adjust anything by hand.

**What it needs:**
- Blender installed on this machine. It isn't installed today, and installing software is your call. The machine
  can run it (16 cores, 13 GB RAM). Baking is slow but runs in the background.
- Your eye on renders: I propose, you art-direct, we iterate.

### 5.2 Better shaders (what changes in code)
- **Materials:**
  - real PBR textures: roughness and normal variation on brass, enamel, marble, concrete;
  - clearcoat for enamel;
  - marble with a subtle subsurface-style tint;
  - glass with real transmission for the reel window (already partly there).
- **Light:** baked lightmaps + one real-time key light for the machine's moving parts; environment reflections from an
  HDRI matched to each room.
- **Post:**
  - AgX/ACES tone mapping and colour grading per theme;
  - restrained bloom (sun beam, spotlight, reel glow);
  - N8AO ambient occlusion on desktop only;
  - film grain at a very low level;
  - all tier-gated for phones.
- **Effects:** volumetric-looking dust in light beams (cheap particle sprites + a cone mesh, not true volumetrics);
  cloth-free keychain physics (spring sway).

### 5.3 Free asset sources (license-checked; all usable on a commercial portfolio)

| Need | Source | License |
|---|---|---|
| Marble, plaster, concrete, terrazzo, brass, enamel textures | **ambientCG**, **Poly Haven** | CC0 |
| HDRIs for reflections (sunlit interior, night) | **Poly Haven** HDRIs | CC0 |
| Roman details (busts, column capitals, mouldings) | **Smithsonian 3D Open Access** (CC0 scans), **Scan The World** (museum scans, mostly CC-BY), **Sketchfab** filtered to CC0 / CC-BY | CC0 / CC-BY (credited) |
| Props (olive branch, pots, plants) | **Poly Haven** models, **Quaternius** | CC0 |
| Stylised packs for worlds | **Kenney**, **Quaternius**, **Poly Pizza** | CC0 / CC-BY |

**Rule:** every asset gets a line in a `CREDITS` file, and CC-BY assets are credited on screen (as RIDE does now).
Nothing from games, brands or paid packs. The machine itself stays original, modelled for us.

---

## 6. Whole-site production layer (so every world finishes to the same standard)

One shared shell every world plugs into:
1. **Loading:** a branded, consistent loader. The machine's reel spins in miniature with real progress. Never a blank
   page, never a plain "Loading…" line.
2. **Transitions:** PX-01's colour-sheet dissolve becomes the one signature transition (light: a sun-wash; dark: a
   spotlight iris).
3. **The world bar (CoinSlot):** redesigned once, used everywhere. It shows Back to the machine, Worlds, Résumé, Contact,
   and sits in each world's safe area (no more covering content).
4. **Type diet:** the shell loads 2 faces. Each world lazy-loads its own (1–2) only when opened.
5. **Focus, hover, press:** shared tokens; every interactive element gets all three.
6. **Sound (opt-in, off by default):** one sound palette for the shell (lever, reel ticks, ticket print, switch). Worlds
   keep their own.
7. **Per-world finish pass:** each world gets a "finish list" (spacing, states, loading, mobile, one art upgrade), e.g.:
   - RIDE: scanned asphalt and rock textures, baked light, dust in the low sun, a sunset that progresses as you ride;
   - LONGHORN: a sharper aurora;
   - POCKET: a CRT-free LCD polish;
   - …

---

## 7. How we keep the quality honest

- **Reference board first:** 6–8 Awwwards references per surface (home light, home dark, mobile, loader) agreed with you
  before building.
- **Look-dev renders before code:** for the Villa and the Vault, I produce still renders (from Blender) for you to
  approve. Only an approved still gets built into the live site.
- **The 5-reviewer loop** (developer, recruiter, critic, designer, motion) on the new home. Gate: 85+ from all five
  (your motion target stays 75–80 if you prefer).
- **Device matrix:**
  - phones: a mid Android, an iPhone (Safari) and a low-end Android (still-image tier);
  - desktop: 1366 and 1440.
- **Performance budgets checked on every deploy.** Regressions block the push.

---

## 8. Proposed order (rough phases, to refine in the implementation plan)

| Phase | What | Why this order |
|---|---|---|
| A. Foundations | Type diet (2 faces), shared shell tokens, new world bar, consistent loader | Cheap, site-wide, removes many prototype tells immediately |
| B. Look-dev | Install Blender (your OK), reference boards, Villa + Vault still renders, machine remodel | Agree the look before spending effort on code |
| C. New home, desktop | Exhibit layout, museum label, one primary/secondary action, theme switch + cross-fade, baked scenes | The biggest visible change |
| D. New home, mobile | Sequence screens, bottom bar, portrait framing, world preview rail, still-image tier | Recruiters judge on phones |
| E. Below the fold | Catalogue-style sections, remove marquee/tapes, keep scroll story | Calm proof after the wow |
| F. World finish passes | Each world's finish list, RIDE upgrade first | Equal finish everywhere |
| G. Review + launch | 5-reviewer loop, device matrix, performance gates, then routing (PLAN_NEXT phase 3) | Ship with evidence |

---

## 9. Decisions for you (please answer inline)

1. **Villa (light) details:** wall colour deep Pompeian blue, or a lighter powder/Wedgwood blue? Window light from the
   left or the right? Olive branch + terracotta pot: yes or no?
2. **Vault (dark):** concrete + brass + one spotlight, as described? Or would you rather dark mode be "the same villa at
   night" (moonlight through the window)?
3. **Your favourites, new form:**
   - Giant "Portfolio" as a carved frieze (light) / brass wall letters (dark)?
   - Red signature as the painter's signature on the plinth?
   - Keychains as a 3D cluster on a hook?
   OK, or do you want any of them kept exactly as they are now?
4. **Copy:** OK to remove the tutorial text, the "optional" labels and the pull counter from the hero?
5. **Mobile:** OK to replace the liquid dock with one sticky bottom bar (Pull · Worlds · Résumé · Contact), still in
   liquid glass?
6. **Blender:** OK to install Blender on this machine (system package or Flatpak)?
7. **Display font for light mode:** a refined serif with an inscription feel. Do you have a font you love, or should I
   bring 3 options?
8. **Scope:** do all of A–G, or the home first (A–E) and then decide on world passes?
9. **Anything that must not change?** (e.g. the boot sequence, the lever feel, the multilingual name)
