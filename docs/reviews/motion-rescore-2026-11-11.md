# Motion re-score, 2026-11-11 (after the first motion pass)

Blind animation-critic run on the production build. Site: **70/100** (Choreography 14, Feel 14, Feedback 14,
Creativity 16, Performance 6, Restraint & a11y 6). No surface at the 18/21 launch bar yet.

| Surface | /21 | Was |
|---|---|---|
| Home hero | 15 | 14 |
| Home sections | 16 | 9 |
| Liquid dock | 15 | 14 |
| Desktop + phone | 15 | 9 |
| Editorial | 17 | 17 |
| Terminal | 17 | 16 |
| Album | 16 | 15 |
| Departures | 16 | 12 |
| Reference Desk | 16 | 16 |
| The Drawing | 15 | 13 |
| SHIP·BREAKER | 17 | 15 |

## Ranked fixes
1. World-wipe overlaps each world's own arrival → delay arrivals by `--arrive` while the wipe runs.
2. The Drawing arrival animates clip-path on every sheet (38 fps) → transform-only outline draw.
3. Home boot counter restarts from 0 at each milestone; skip races the rAF (Home.jsx ~79/95).
4. Hero intro ~3.5 s after boot; fallback 9 s → land the CTA by ~1.2 s, fallback 5 s.
5. Flap riffle still swaps textContent on ~440 cells → translateY drum strips with steps().
6. Liquid dock bypasses tokens / reduced motion; drag stretch uses raw per-event velocity.
7. Window close doesn't mirror open (shrinks to centre; ghosty opacity on open).
8. 3D: env re-rendered every frame on desktop; frameloop "always" under reduced motion.
9. Remaining off-token curves (ask.css, home.css, album.css, GSAP power*/back).
10. Departures headline reflows on phone during font swap; canvas rubber band resistance should grow with distance.

## Keep
Tokens; home scroll story; canvas physics; grow-from-press windows/apps; edge-swipe back; arcade juice; terminal
type-on; flap rewrite; off-screen 3D pause; reduced-motion world-wipe; the hero's 3D drop and CRT boot collapse.

## Signature ideas
- Desktop "files go home": closing a window pours it back into its folder along a curve; the folder lid springs shut.
- The Drawing "revision cloud": selecting a sheet draws a red-pen revision cloud, a leader line extends to the
  inspector title block; zoom snaps to drafting scales with a detent.
- Liquid dock "surface tension": metaball puck that leaves a droplet behind; lag scales with scroll speed.
