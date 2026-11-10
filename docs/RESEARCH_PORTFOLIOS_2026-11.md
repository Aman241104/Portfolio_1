# Portfolio research — 17 live sites + 4 GitHub lists (2026-11-10)

Captures: `references/portfolios/` — per site `<id>-d.jpg` (1440×900 at 7 s), `<id>-d-intro.jpg` (1.5 s),
`<id>-d-scroll.jpg`, `<id>-m.jpg` / `<id>-m-intro.jpg` (390×844). Extracted data: `references/portfolios/probe.json`.
Captured headless (software WebGL), so 3D-heavy sites may look slower/emptier than on a real GPU.

## 1. The 17 sites, one line each

| Site | First screen | Steal | Avoid |
|---|---|---|---|
| redoyanulhaque.me | Giant name marquee + "LOADING 55%" pill; three + GSAP + Lenis, video | Loader inside the hero type, not a separate screen | Still loading at 7 s |
| aaabadcode.com | White, memoji, **"Ask me anything" chat** + chip nav (Me/Projects/Skills/Fun/Contact) | Chat-as-navigation is the 2026 trend → a later world, not the hero | Template ("Build your AI portfolio" badge) |
| majd-portfolio.framer.website | "SOFTWARE ENGINEER" giant on paper, sparkle/bolt doodles, ©2026 | Doodle marks around heavy type (same move as ours) | Framer template, seen everywhere |
| aahanabobade.com | VS Code IDE metaphor, stat tiles | — | Metaphor-as-layout ages fast |
| aahana-surya.github.io | Starfield, rocket, Instrument Serif name | Scroll-driven object (the rocket) | Space theme is generic |
| yashahire.info | Awwwards nominee. Glowing isometric 3D keyboard grid, **script "I build things" over bold name**, testimonial card, "Ask anything" | Script-over-grotesk (validates our type move); social proof in the hero | Busy: 4 competing blocks |
| aakarsh-devhq.vercel.app | Starfield, purple glitch "DEVELOPER", floating icon badges | — | Gamer font, "Woah! You landed…" copy |
| tajmirul.site | Neon green condensed "FULL-STACK DEVELOPER", stat counters (4+ / 7+ / 10K) | Numbers as proof | Stat inflation reads junior |
| aadarshrai.vercel.app | Portrait with name marquee sliding behind the head, "Located in Dubai" badge | **Subject in front of moving giant type** (= machine in front of "Portfolio") | — |
| aadi.is-a.dev | Docs-style sidebar, ⌘K search, live clock | ⌘K command menu for power users | Reads like documentation |
| aaftab.is-a.dev | Dark, dot grid, orange-red accent, "Now: …" status pill, tech ticker. **Also Ahmedabad.** | Status pill ("Now: …") | **Same city + same dark/red palette: we must not look like this.** Our difference is the object + script |
| aanandmadhav.com | Cream editorial, "Builder. Brewer. Wanderer.", pencil portrait, IST clock, ⌘K | Three-word identity line; hand-drawn portrait = personal | — |
| aathifzahir.vercel.app | Full-bleed "AATHIF", local time, 3 meta columns (Based in / Available / Role) | Meta columns under the name | — |
| abbasraza.dev | Loader "pulling focus…" (still loading at 7 s), then green "Hi, I'm Abbas Raza" + stats | Loader copy with personality | **Loader too long** |
| aelradi.engineer | Black screen "click anywhere to skip" for >7 s | **"Skip" affordance** | Making people wait for an intro |
| mannan.io | **Pixel font + pixel-art desk under cherry blossom + Faisal Mosque** (Islamabad) | **Culture as identity**: the strongest "only this person" site in the set | Pixel text hard to read at length |
| abdulmateenzwl.com | Retro form/ledger UI ("FORM WK-01"), lime tags | Document metaphor, crafted copy | — |

## 2. What the data says (probe.json, 17 sites)
- **Type:** Geist / Geist Mono / Instrument Serif appear on 6 of 17. That is *our* stack, so it no longer reads as distinctive.
  Our differentiators are the Homemade Apple script, the multiverse name and the object, not the grotesk.
- **Custom cursor:** 12/17. Table stakes, not a feature. **Lenis smooth scroll:** 8/17. **three.js:** 7/17, but all are particles,
  starfields or grids. **None has a lit, physical object you operate.** The machine is the one thing nobody else has.
- **Dark background:** 11/17. Dark alone won't stand out; light + texture is what makes a dark site feel premium.
- **Loaders:** 4/17 have one; 2 were still on it at 7 s. Rule: ≤ 2.5 s typical, skippable, tied to real progress.
- **Mobile:** every good phone hero states **name + role in the first screen, large**. Weak ones (aelradi, abbas) show a loader or a slogan.

## 3. GitHub lists
- **Evavic44/portfolio-ideas** (6.4k★, 421 portfolios). Tech: TypeScript 126, Next.js ~157, React ~123, Tailwind ~150, **GSAP 56, Framer Motion 33, three.js 18**.
  So about 4% use 3D at all. Standouts worth a look: bruno-simon.com (drivable 3D world), olaolu.dev, adeolaadeoti.site, seyi.dev (GSAP craft).
- **emmabostian/developer-portfolios** (2,101 links, A–Z, no screenshots). Volume, not curation: use it for searching names, not taste.
- **topic:portfolio**: dominated by templates (simplefolio 14k★, developerFolio, vcard, devportfolio/Astro). A template look is the thing to avoid.
- **topic:portfolio-ideas / design-inspiration**: mostly meta-lists; useful ones are `mejed-alkoutaini/designer-portfolios` and
  `noahelhadedy/347-design-inspiration-sites` for galleries (Awwwards, Godly, Siteinspire, Minimal.gallery).

## 4. Conclusions for PX-01
1. Keep the machine as the hero. It's the rarest thing in the whole sample (0 of 17, ~4% of 421 even use 3D).
2. Name + role must be readable in the first second on every size → visible h1 identity line (done 2026-11-10).
3. Loader = brand moment but short and skippable (done: real-progress counter + skip after 2.5 s).
4. Culture as identity (mannan) → push the अमन / Ahmedabad layer: a Sidi Saiyyed *jali* (tree lattice) motif is the strongest local symbol.
5. Distance from aaftab.is-a.dev (same city, dark + orange-red): our red is used only as *ink* (script, doodles, knob), never as UI buttons.
6. Social proof is missing from our hero (yashahire's testimonial card): one line or a quote in the footer is enough.
