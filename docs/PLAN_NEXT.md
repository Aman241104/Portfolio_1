# PX-01: the next plan (written 2026-11-11)

Goal: every world is a portfolio Aman could send on its own and impress with, each one scored **85+ by all
five reviewers**, and the slot machine sends visitors to the strongest worlds more often, without starving any.

Three phases, in order:

1. Build four new worlds to the same bar as the last four.
2. Review and improve every world with five reviewer agents (developer, recruiter, critic, designer, animation)
   until each scores 85+ from all of them.
3. Rank the worlds and route traffic by evidence, not by gut feel.

---

## Phase 1: four new worlds

Each world follows the same build recipe as Departures, Reference Desk, The Drawing and SHIP·BREAKER:

1. One committed direction: type pairing, palette, layout, motion and one signature detail.
2. Checked against the avoid-ai-design catalogue.
3. Built.
4. Screenshot-verified at 1440, 1366, 390 and 360 wide.
5. Shipped.

### Every world must have (the "standalone" bar)

- **Its own URL** that works without the machine: `aman-patel.me/<world>`. Give it its own `<title>`, description
  and preview image (Open Graph), so a link pasted into WhatsApp or LinkedIn shows that world.
- **A recruiter fast path.** Résumé, email and the project list are reachable within 2 taps from the first screen.
  Nobody is ever forced to play, scroll a gimmick or wait.
- **All real content.** The 26 projects, experience, skills, the live sites and contact, all read from
  `content/`. Never a subset, and never invented numbers.
- **Budgets.**
  - Speed: first content visible under 2.5 s on a mid-range phone, interaction under 200 ms, no layout shift
    (under 0.1).
  - Size: the world's own JavaScript under 150 KB gzipped, except the 3D world, which gets 450 KB.
- **Accessibility.** Keyboard reachable, visible focus, respects reduced motion, 44 px tap targets, readable
  contrast.
- **Original assets only.** These four are homages to a feel, never copies. No Nintendo, Game Freak, Sony or
  Microsoft characters, logos, fonts, sounds or UI artwork.

### The four

**1. POCKET (handheld adventure)**

- *Feel:* the late-90s handheld creature RPG and PSP-era menus, without a copyrighted asset in sight.
- *What it is:* a top-down pixel town (Ahmedabad-inspired). Aman's projects are original "creatures" you meet
  in tall grass. Battle = a case study: moves are features, stats are the stack.
- *Other pieces:* a Dex of all 26 projects, a gym that holds the experience, and a trainer card that is the hire
  card.
- *Look:* a four-tone palette, a D-pad and A/B on phones, original chiptune by the WebAudio synth.
- *Fast path:* START opens a menu with Dex, Résumé and Contact.
- *Signature:* the Dex entry for each project, written in that voice, with real facts.

**2. RIDE (open-world low-poly)**

- *Feel:* Aman's bikes and travel. A low-poly world (R3F) you ride through.
- *What it is:* each project is a landmark along the road, with a signpost that opens it. A map view jumps
  anywhere.
- *Tech:* instancing, LOD, the 450 KB budget, and a 2D map fallback on low-power phones.
- *Fast path:* a "Map" button with a plain list of every place.
- *Signature:* golden-hour lighting and a speedometer that counts projects visited.

**3. 2001 (old-school homepage)**

- *Feel:* a GeoCities-era personal homepage.
- *Pieces:* tiled background, marquee, hit counter and webring, all drawn originally. A guestbook stored in Neon
  and moderated. 88×31 buttons. "Best viewed at 800×600."
- *Tech under the hood:* modern and accessible, which is the joke.
- *Fast path:* a "plain version" link at the top.
- *Signature:* the hit counter and the guestbook are real.
- *Difference from Album:* that is Y2K music-industry gloss; this is amateur-web sincerity.

**4. LONGHORN (a 2000s desktop homage)**

- *Feel:* the glossy XP / Vista era: glass title bars, a start orb, a sidebar gadget with live site status.
- *Assets:* original wallpaper, icons and sounds made for this, "in the spirit of", not Microsoft's.
- *What it is:* projects are files and Explorer windows, and the résumé opens in a fake document viewer.
- *Difference from PX-OS:* PX-OS is today's minimal desktop; this one is warm, glossy nostalgia.
- *Fast path:* the Start menu shows Résumé, Contact and All projects.

Build order: 2001, then LONGHORN, then POCKET, then RIDE. The cheapest and safest come first; the 3D world is
last because it needs the most performance work.

---

## Phase 2: the review cycle (five reviewers, scored /100)

### The reviewers

Each reviewer is a separate agent with a fresh context and a fixed rubric. Rubric weights sum to 100.

**Developer**

| Criterion | Weight |
|---|---|
| Speed (Core Web Vitals measured on the live URL) | 25 |
| Code quality and structure | 20 |
| Accessibility | 15 |
| Mobile | 15 |
| Robustness: errors, edge cases, APIs failing gracefully | 15 |
| Craft details | 10 |

Fetches references online: the code and performance write-ups behind Awwwards and FWA-winning sites.

**Recruiter**

| Criterion | Weight |
|---|---|
| Who, what and level, within 10 seconds | 20 |
| Path to the résumé and contact | 20 |
| Credibility: real, verifiable work and live sites | 20 |
| Relevance to full-stack hiring | 15 |
| Mobile skim | 15 |
| "Would I forward this to the hiring manager?" | 10 |

Has no design vocabulary on purpose. Judges as a busy recruiter on a phone.

**Critic**

| Criterion | Weight |
|---|---|
| Originality: is the idea his own, or a template? | 30 |
| Concept depth: does the metaphor carry all the content? | 25 |
| Storytelling | 20 |
| Memorability | 15 |
| Restraint | 10 |

Fetches references online: Awwwards SOTD and SOTM, Codrops, comparable creative-developer portfolios.

**Designer**

| Criterion | Weight |
|---|---|
| Typography | 20 |
| Layout and grid | 20 |
| Colour | 15 |
| Interaction and motion | 20 |
| UX flows and states (empty, loading, error) | 15 |
| Consistency | 10 |

Runs the avoid-ai-design catalogue. Fetches references online.

**Animation critic** (added 2026-11-11: Aman: "we lack a lot in that department")

| Criterion | Weight |
|---|---|
| Choreography: entrances, transitions and hierarchy in time, not one shared fade-up | 20 |
| Feel: easing, springs, follow-through, nothing linear or robotic | 20 |
| Interaction feedback: hover, press, drag, scroll, and the touch equivalents | 20 |
| Creativity: motion that belongs to this world's idea and nowhere else | 20 |
| Performance: 60 fps on a mid phone, transform/opacity only, no jank or layout thrash | 10 |
| Restraint and accessibility: purposeful, honours reduced motion | 10 |

- Records each world as video or frame sequences (Playwright), not only stills.
- Measures frame timing.
- Fetches references online: Awwwards motion honorees, Codrops, GSAP showcase.
- Uses the motion-design skills (web-motion-auditor, site-motion-excellence-director, gsap-*) as its checklist.

### What every reviewer gets

- Screenshots at 1440×900, 1366×768, 390×844 and 360×740, plus a scroll capture.
- The live URL (a Playwright session).
- Measured numbers: real-visitor Core Web Vitals from PostHog, Lighthouse where it runs, page weight, layout
  shift, tap-target audit.
- The world's source files.
- The world's own PostHog numbers once traffic exists: entries, time spent, résumé opens, contacts.

### Report format (identical for every reviewer)

1. Score /100, with the score for each criterion.
2. **Evidence for every point.** A screenshot reference, a measurement or a line of code. A claim without evidence
   doesn't count.
3. Top 5 problems, ranked. For each: what, why it matters, the principle it breaks, and a concrete fix.
4. What works and must be kept, so improvements don't sand off the good parts.
5. Conversion: how this world turns a visitor into a recruiter contact, and how to do it better.
6. Three ideas from the references, each with its link.

### Keeping the scores honest (LLMs grade their own work too kindly)

- **Blind framing.** Reviewers are told "review this portfolio site", never "Claude built this".
- **Calibration anchors.** In every run, each reviewer first scores two known references: an Awwwards SOTD
  (should land around 90) and a plain template portfolio (around 50). If the anchors drift, the run is thrown out.
- **No anchoring between reviewers.** In round 1, no reviewer sees another's score.
- **A hard floor.** Any P0 AI-tell, any broken mobile layout, or a résumé path longer than 2 taps caps the score
  at 70.
- **A human check.** Aman (or Harsh) spot-checks one world per batch. If a human would score it more than 10 points
  below the agents, the rubric gets tightened.

### The loop, one world at a time

1. Run the four reviews.
2. Merge them into one fix list ranked by how many reviewers flagged each item and by severity.
3. Implement the fixes.
4. Verify on desktop and phone.
5. Ship.
6. Re-review.

Stop when all five reviewers score 85+. **Cap: 4 rounds per world.** If a world is still under 85 after round 4,
it is either rethought (new direction) or marked *beta* (see Phase 3). It isn't polished forever.

Order: the four newest worlds first (the freshest code), then the original four, then the four from Phase 1 as
each lands.

### Cost note

- Each review round for one world is 5 agent runs with browsing. 12 worlds × up to 4 rounds can mean around 240
  runs, but most worlds should pass in 2–3 rounds.
- Reviews are judgment work, so they run on Claude, not on the free delegated models (see CLAUDE.md).
- Screenshots, measurements and report merging are mechanical and can be delegated.

---

## Phase 3: ranking and routing traffic

### The problem

- The machine picks a world at random. A recruiter can land on the weakest world and leave with a bad impression.
- But if traffic only ever goes to the current top 3, the others never get enough visitors to prove themselves,
  which is the "only 3 to 4 get reach" worry.

### The answer: quality gate, then a learning router with a floor

**1. Quality gate.**

- A world enters the machine's random pool only after all five reviewers score it 85+.
- Below that, it's *beta*: reachable from "All worlds" and its own URL, never served by surprise.

**2. Measure each world properly.** Every PostHog event already fires; it also needs a `world` property, so
each action is credited to the world it happened in. Per-world success is a weighted score per visit:

| Event | Points |
|---|---|
| Résumé opened | 5 |
| Contact sent or "Hiring?" email left | 8 |
| Case study read | 3 |
| Live site visited | 2 |
| Spent 30 s or more | 1 |
| Bounced in under 5 s | −2 |

**3. A learning router (Thompson sampling).** Each world keeps a running estimate of how well it converts. On
every pull, the machine samples from those estimates and picks the highest, so:

- Strong worlds get more traffic.
- Every world keeps a **floor of at least 5%** of pulls, so nothing starves and a world that improves can climb
  back.
- **New worlds get a fair start**: an optimistic prior for their first 50 visits, so a young world isn't buried by
  older worlds' history.

This is the standard, well-understood way to balance "use what works" against "keep learning". It's unbiased
because it decides from outcomes, not opinions.

**4. Recruiters always get a safe world.** When a visit looks like a recruiter, the machine's result comes from
the top 3 by score instead of the full pool. Signals:

- arrived from LinkedIn, Naukri, Indeed or a job board;
- arrived on `?ref=cv` (the link on the résumé PDF);
- clicked "Skip the machine" or "Résumé" first.

Everyone else gets the full exploring router.

**5. Guard rails.**

- A world needs 100+ visits before the router fully trusts its numbers.
- Routing weights are recomputed nightly from PostHog, not live, so one odd visitor can't swing it.
- A tiny public "Worlds, ranked by visitors" panel in the footer turns the ranking into a feature rather than a
  hidden rule.

### Fairness caveats (stated plainly)

- Recruiters are a small share of visitors at first, so recruiter-specific numbers will be noisy for weeks. The
  floor and the optimistic start matter more than the ranking until traffic grows.
- Some worlds suit some people better: a game world won't win on "résumé opens" but may win on memorability and
  shares. Shares (copy-link clicks) count as a positive signal.

---

## Order of work

1. Add `world` to every analytics event, set up the scoring query, and ship the quality gate. A small job;
   unlocks Phase 3 data collection while everything else is built.
2. A whole-site motion pass first (home + all 8 worlds), then the Phase 2 review cycle on the 4 newest worlds,
   then the original 4.
3. Phase 1 builds, each going straight through the review loop: 2001, LONGHORN, POCKET, RIDE.
4. Turn on the learning router once the gated worlds have about 100 visits each.
