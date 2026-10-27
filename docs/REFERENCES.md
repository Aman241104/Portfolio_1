# PORTFOLIO.exe — Reference Guide

What to learn from, per world in [PORTFOLIO_EXE_PLAN.md](./PORTFOLIO_EXE_PLAN.md).
Collected 2026-10-27 from Awwwards, Dribbble, Behance, Muzli, GitHub and WebGPU.com.

## How to use this guide

- **Study, don't clone.** Take *mechanics* (timing, structure, interaction ideas). Never take
  layouts, art, copy or assets wholesale. A world that looks like someone else's site loses
  awards and credibility.
- **License check before reusing code.** Repos marked **MIT** can be borrowed from with
  attribution. **No license / CC BY-NC = read only.** Copy nothing.
- For each world: pick **2–3 references max**, run them through `design-dna` (see Tooling) to
  pull out tokens and feel, then design your own version on top of your taste.

---

## 1. Tooling installed (Claude Code plugins, user scope)

| Plugin | Use it for | Invoke |
|---|---|---|
| **gsap-skills** (GreenSock official) | Reel spin timelines, ScrollTrigger, Draggable lever. Your "animate" skill | auto-activates on GSAP work |
| **genjutsu** | Motion, micro-interactions, design systems. Proposes an "interaction thesis" before writing code, so use it at the start of each world | `/genjutsu:cast`, `/genjutsu:paint`, `/genjutsu:bunshin` |
| **design-dna** | Turn a reference screenshot into measured tokens + verified rebuild. Use per world on 2–3 references | `/design-dna:*` |
| **motion-design-studio** (frankx) | Motion QA: GSAP / Motion / Lottie / Rive taste rules ("animate only to clarify state or narrative") | auto |
| **hyperframes** (HeyGen) | HTML-to-video: launch trailer, per-world preview loops for the World Gallery, OG videos, your showreel | `/hyperframes:hyperframes` |

Already on the machine and useful: `design-taste`, `avoid-ai-design`, `reference-driven-design`,
`hue`, `figma:figma-implement-motion`, `example-skills:frontend-design`, `egm` (plan reviews).

> Restart Claude Code to load the new plugins. HyperFrames reported 84 Git LFS pointer files
> (example media, not skills). Run `git -C ~/.claude/plugins/marketplaces/hyperframes lfs pull`
> only if a HyperFrames example needs them.

---

## 2. The Machine (entry slot machine)

| Reference | Where | Take from it |
|---|---|---|
| Futuristic Slot – Game UI · Bang Studio | https://dribbble.com/shots/27105051-Futuristic-Slot-Game-UI | Sci-fi cabinet framing; reel glow without casino kitsch |
| The Main UI for the Classic slot · Slotopaint | https://dribbble.com/shots/15100592-The-Main-UI-for-the-Classic-themed-slot-machine | Reel window proportions, payline/lever anatomy |
| 3D Slot Machine Hero · Vladimir Potapov | https://dribbble.com/shots/26391338--3D-Product-Visualization-Slot-Machine-Manufacturing-Hero | Lighting a physical cabinet as a hero object |
| Osyle fluid metal UI · Milkinside / Gleb Kuznetsov | https://dribbble.com/shots/27265958-Osyle-fluid-metal-collection-UI-by-Milkinside | Liquid chrome material for the cabinet (bridges into Y2K world) |
| F1 Start Light Loader · Audi F1 | https://www.awwwards.com/inspiration/f1-start-light-loader-audi-f1-feel-every-second | Power-on light chase; anticipation before release |
| Random Color Theme · Aaron McGuire | https://www.awwwards.com/inspiration/random-color-theme-aaron-mcguire-2023-portfolio | Prior art for "randomized identity" on an Awwwards portfolio. Shows the idea lands with juries |

**Avoid:** every iGaming/casino shot (crypto wheels, "Warzone Slot", etc.). Gold coins + red
felt reads as gambling ad. Your cabinet should read as *a machine for realities*, not a casino.

---

## 3. References per world

### 3.1 Desktop OS (existing world)
| Reference | Link | Note |
|---|---|---|
| playground-macos · **MIT** | https://github.com/Renovamen/playground-macos | Same stack as you (React+Vite+Tailwind). Compare window manager + dock |
| macos-web (PuruVJ) | https://github.com/puruvj/macos-web | Gold standard for macOS fidelity |
| awesome-web-desktops | https://github.com/syxanash/awesome-web-desktops | Index of ~dozens of OS-style sites (Poolsuite, 98.js, Henry Heffernan, PortfolioXP…) |
| awesome-os (personal-OS section) | https://github.com/zriyansh/awesome-os | More OS portfolios + react95 component kit |
| Windows 98 in three.js · Evan Poliquin | https://www.webgpu.com/showcase/windows-98-portfolio/ | OS desktop *inside* a 3D scene via CSS3D. Bridge idea for The Garage |

### 3.2 Terminal
| Reference | Link | Note |
|---|---|---|
| LiveTerm | https://github.com/cveinnt/liveterm | Whole site from one `config.json`, same as your `content/` idea. Themes |
| terminal_portfolio (sujayadkesar) | via https://github.com/duty9527/stars | Autocomplete + shortcut patterns in vanilla JS |
| xterm.js | https://github.com/xtermjs/xterm.js | Only if you want real terminal emulation. Probably overkill; a styled `<input>` is enough |
| vscode-portfolio · **MIT** | https://github.com/itsnitinr/vscode-portfolio | "Editor" sibling to Terminal if you add a Code world later |

### 3.3 Album Rollout (rap)
No direct portfolio precedent found, which is good: this world is the most original.
| Reference | Link | Take from it |
|---|---|---|
| A24 · Ravi Klaassens (SOTD 2026-10-26) | https://www.awwwards.com/sites/a24 | Culture-brand art direction; releases as editorial objects |
| Nicolás Zarcero — *Box Office* | https://www.awwwards.com/sites/nicolas-zarcero-box-office | Portfolio framed as an entertainment release |
| Suno brand & product (Behance) | https://www.behance.net/gallery/250116953/Suno-Brand-Product-Design | Music-product UI language: waveforms, track cards |
| Kinetic scroll interaction · RXK Studio | https://www.awwwards.com/inspiration/kinetic-animation-rxk-studio | Tracklist scroll with weight |
Study (don't copy) real rollouts: tracklist reveals, merch-drop pages, countdown pages. Use original type and graphics, no cover art.

### 3.4 Pit Wall (racing)
| Reference | Link | Take from it |
|---|---|---|
| Lando Norris (SOTD) | https://www.awwwards.com/sites/lando-norris | Speed through motion, helmet-livery graphics, bold type |
| Audi F1 – Feel Every Second (HM) | https://www.awwwards.com/sites/audi-f1-feel-every-second | 5-light start loader. Your intro reference |
| Forge Automotive (SOTD, WebGL) | https://www.awwwards.com/websites/webgl/ | Automotive WebGL product staging |
| bruno-simon folio-2025 | https://github.com/brunosimon/folio-2025 | Drive-a-vehicle portfolio; physics/game loop architecture to read (Bruno's folios are the canonical "drive through my work") |

### 3.5 Neo-Tokyo 2019 (Akira / anime / bikes)
| Reference | Link | Take from it |
|---|---|---|
| Cyberpunk website concept (Behance) | https://www.behance.net/gallery/75750581/Cyberpunk-website-Concept | Speed/tech typographic system |
| Dribbble "cyberpunk website" | https://dribbble.com/search/cyberpunk-website | Neon UI chrome; skip anything that looks like a CP2077 skin |
| Webflow cyberpunk gallery | https://webflow.com/made-in-webflow/cyberpunk | Live, inspectable builds |
| ANDROAKI.NET portfolio (Behance) | https://www.behance.net/gallery/254032231/ANDROAKINET-PORTFOLIO | Japanese-type-meets-web portfolio |
Rule: evoke the red/black/kanji/motion-blur language; no film frames, no recreated bike.

### 3.6 Channel Surf (sitcoms / film / editing)
| Reference | Link | Take from it |
|---|---|---|
| Working Stiff Films | https://stiff.madebybuzzworthy.com/ | Film-company texture, experimental transitions |
| Joseph Santamaria | https://joseph-san.com | Scroll treated like a short film: camera choreography |
| Joseph's Codrops source | https://github.com/JosephASG/JosephASG | Scroll-cinematic R3F + GSAP code |
| hyperframes (plugin) | — | Render your showreel + CRT "channel idents" as real video |

### 3.7 Y2K Chrome
| Reference | Link | Take from it |
|---|---|---|
| ALTERA · Y2K fashion web (Behance) | https://www.behance.net/gallery/257412971/ALTERA-Y2K-fashion-web-experience | Modern Y2K done with restraint |
| Orkut Zillennial UX/UI (Behance) | https://www.behance.net/gallery/217321107/Orkut-Zillennial-UXUI | Nostalgic early-social UI reimagined |
| Dopamine Website (Behance) | https://www.behance.net/gallery/253065077/Dopamine-Website-Playful-Landing-Page-Design | Playful color/blob language |
| Osyle fluid metal (Dribbble) | https://dribbble.com/shots/27265958-Osyle-fluid-metal-collection-UI-by-Milkinside | Chrome material reference |
| win95-media-player | listed in https://github.com/zriyansh/awesome-os | Skinned-media-player nostalgia for the music widget |

### 3.8 Editorial (classic / recruiter view)
| Reference | Link | Take from it |
|---|---|---|
| Stas Bondar (SOTD) | https://www.stabondar.com/ | Dev-portfolio typography + motion balance |
| Clément Grellier | https://clementgrellier.fr/ | Restraint + micro-interactions |
| Gianluca Gradogna | https://gianlucagradogna.com/ | Infinite scroll, subtle transitions |
| Obys Agency | https://des.obys.agency/ | Editorial type at its peak |
| Awwwards Freelance Portfolios collection | https://www.awwwards.com/awwwards/collections/freelance-portfolio/ | 100+ vetted single-person portfolios |
| Brandon Yasin (SOTD 2026-10-24) | https://www.awwwards.com/sites/brandon-yasin | Current-year SOTD bar for solo portfolios |

### 3.9 Save File (games)
| Reference | Link | Take from it |
|---|---|---|
| "I Made a Website That Feels Like a Game" | https://www.youtube.com/watch?v=FxvNINLpzb8 | World-building over section-building |
| poke95 (React95) | listed in https://github.com/zriyansh/awesome-os | Game UI inside retro chrome |
| folio-2025 game loop | https://github.com/brunosimon/folio-2025 | Achievement/progress architecture |

### 3.10 Moodboard (Pinterest / 3D art)
| Reference | Link | Take from it |
|---|---|---|
| Draggable 3D flying polaroids | https://www.awwwards.com/inspiration/3d-flying-polaroids-chevez | Drag-to-explore image board |
| Infinite Scroll · Thomas Monavon | https://www.awwwards.com/inspiration/infinite-scroll-thomas-monavon-portfolio-24 | Infinite canvas feel |
| Phantom Studios | https://www.phantom.land/ | Kinetic grids that evolve as you move |

### 3.11 The Garage (3D flagship)
| Reference | Link | Take from it |
|---|---|---|
| my-room-in-3d · Bruno Simon | https://github.com/brunosimon/my-room-in-3d | Baked-lighting room, live screens in 3D. Closest analogue |
| room_portfolio (R3F) | https://github.com/at010303/room_portfolio | R3F + drei + postprocessing + GSAP room: your exact stack |
| portfolio-itom | https://github.com/itompoland/portfolio-itom | **Read its perf notes**: async shader compile, baked tint, device tiering, SEO fallback |
| threejs-portfolio · Adrian Hajdin | https://github.com/adrianhajdin/threejs-portfolio | Simple R3F hacker-room starter to learn from |
| codeofsagar | https://github.com/codeofsagar/codeofsagar | On-demand rendering + avatar; GSAP camera timelines |
| Aimee's Papercraft World | https://www.webgpu.com/tag/react-three-fiber/ | Baking 2D art onto 3D, useful if your 3D art is stylized |
| Yusef Nsar timeline (WebGPU) | https://yusef-nsar.dev | Where the ceiling is in 2026 |

### 3.12 Credits Roll (films)
| Reference | Link | Take from it |
|---|---|---|
| A24 (SOTD) | https://www.awwwards.com/sites/a24 | Film-studio tone |
| Reveal page transition · Eva Sánchez | https://www.awwwards.com/inspiration/reveal-page-transition-eva-sanchez-portfolio-2024 | Title-card style transitions |
| Alche Studio | https://alche.studio/ | Cinematic worlds |

---

## 4. Award-level studios & devs to keep studying (all worlds)
From Muzli's 100 best 2026 + Awwwards: **Immersive Garden** (immersive-g.com), **Lusion**-tier
WebGL studios, **Utsubo** (utsubo.com, WebGPU), **Chipsa** (chipsa.design), **Cappen** (cappen.com),
**Jordan Delcros** (jordan-delcros.com, generative), **samsy.ninja** (3D/computational),
**Merouane Bali** (merodev.net), **Karim Saab** (karim-saab.com), **Orage** (orage.studio).

## 5. Open-source starters worth reading (licensed)
| Repo | License | Why |
|---|---|---|
| Renovamen/playground-macos | MIT | Your Desktop OS world's nearest relative |
| itsnitinr/vscode-portfolio | MIT | Editor world |
| ladunjexa/reactjs18-3d-portfolio | MIT | R3F sections |
| arifszn/gitprofile | MIT | Auto-pull GitHub repos into a "Repos" view |
| cveinnt/liveterm | see repo | Terminal world |
| Naresh-Khatri/3d-portfolio | **none: read only** | 3D keyboard interaction idea |
| once-ui-system/magic-portfolio | **CC BY-NC: read only** | Content model ideas |

## 6. Galleries to browse when stuck
- Awwwards: [Portfolio](https://www.awwwards.com/websites/portfolio/) · [Developer](https://www.awwwards.com/websites/developer/) · [WebGL](https://www.awwwards.com/websites/webgl/) · [Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/)
- Muzli: [100 best portfolios 2026](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- WebGPU.com showcases: https://www.webgpu.com/tag/react-three-fiber/
- GitHub lists: [portfolio-ideas](https://github.com/evavic44/portfolio-ideas) · [awesome-web-desktops](https://github.com/syxanash/awesome-web-desktops) · [awesome-motion-design-agent-skills](https://github.com/frankxai/awesome-motion-design-agent-skills)
- Dribbble / Behance search terms that worked: `slot machine ui`, `y2k website`, `cyberpunk website`

## 7. Gaps (still to collect)
- **Your Pinterest boards + YouTube Music history.** Needs the Chrome extension connected, or a Takeout export + profile URL (see plan §4).
- Sitcom-specific web references (none strong found; Channel Surf will mostly be original).
- A real "album rollout as website" precedent. None found, so Album Rollout is your most original world.
