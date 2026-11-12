# The four new worlds: committed directions (Aman, 2026-11-12)

Every world: its own URL (`?style=<id>`), recruiter fast path (résumé + contact within 2 taps), all real content from
`content/`, original assets only (homage in feel; no Nintendo/Microsoft/GeoCities artwork, fonts, sounds), mobile
first (360/390/430 + 1366/1440), motion tokens from `src/index.css` / `src/motion.js`, reduced motion designed, not off.
Build order: 2001 → LONGHORN → POCKET → RIDE. Each goes through the 5-reviewer loop after it lands.

## 1. 2001 — "Under construction, forever" (id `y2001`)
- **Feel:** maximal, sincere 1999–2001 personal homepage, made with love by a teenager. Loud and joyful; the joke is that
  it is fast, semantic and fully accessible underneath.
- **Type:** system Times New Roman for body (era-true), Comic Neue (OFL) for shouty headings, Courier for the counter.
- **Palette:** a starfield tile on navy (`#000033`), default link blue `#0000EE` / visited `#551A8B`, yellow `#FFFF00`
  headings, red `#FF0000` NEW! badges, lime `#00FF00` accents. Beveled `outset`/`inset` borders, rainbow HRs (drawn here).
- **Layout:** one centered 760 px "table" page; sections stacked like a real homepage: welcome, about me, my projects
  (all 26 in a bordered table with thumbnails), cool links (live sites), my résumé, guestbook, webring, footer.
- **Motion:** arrival = the page "downloads over 56k": sections arrive top to bottom with a status-bar progress, images
  resolve from chunky pixels to sharp (progressive-JPEG feel), the hit counter's odometer rolls up to the real count;
  blinking NEW! (steps), CSS marquee, spinning original 88x31 buttons, a cursor sparkle trail (mouse only).
  Reduced motion: everything present at once, no blink/marquee/trail.
- **Signature:** the hit counter and the guestbook are real (Neon: `px01_hits`, `px01_guestbook`, moderated: new
  entries wait for approval).
- **Fast path:** a "plain version" link at the very top (→ Editorial) + résumé/email/WhatsApp in the welcome box.

## 2. LONGHORN — "Aero aquarium" (id `longhorn`)
- Liquid-glass title bars (src/liquid.js lens, never frosted) over a slowly moving original aurora wallpaper; a Start orb;
  sidebar gadgets: live site status (/api/status), Ahmedabad clock, a small weather/clock gadget.
- Projects are files and Explorer windows; the résumé opens in a document viewer window.
- Signature: a 3D "flip" stack of glass windows you scroll/drag through to browse projects.
- Motion: glossy zoom-and-fade window open, wallpaper drift, gadget hover glints; Start menu fast path
  (Résumé, Contact, All projects).

## 3. POCKET — "Monochrome pocket" (id `pocket`)
- Four-shade LCD palette with pixel ghosting; top-down Ahmedabad town (pol gates, Sabarmati riverfront, tea stall).
- Projects are original creatures in the tall grass; a battle is the case study (moves = features, stats = stack).
- Signature: stripe-wipe battle transitions + in-voice Dex entries with real facts. Gym = experience, trainer card = hire card.
- Phones: D-pad + A/B; START menu = Dex, Résumé, Contact. Original chiptune via WebAudio.

## 4. RIDE — "Golden hour highway" (id `ride`)
- A low-poly motorbike ride on an Indian highway at golden hour (R3F, instancing/LOD, 450 KB budget).
- Projects are landmarks with green highway signboards ("Job Search OS 12 km"); a Map button lists every place.
- Signature: a speedometer that counts projects visited; milestones flip past. 2D map fallback on low-power phones.
