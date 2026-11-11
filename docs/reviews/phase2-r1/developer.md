# Developer review, round 1 (2026-11-11): Departures 62 · Reference Desk 72 · The Drawing 56 · SHIP·BREAKER 60
World JS 4–5 KB each, but every world page ships ~341 KB: PostHog 124 KB + 62 KB add-ons, GSAP 29 KB via the static
Machine import, home bundle 44 KB.

Ranked:
1. Arcade crash: `) : {board}}` renders an object (React #31) on the won/save screen.
2. Lazy-load Machine/Home; PostHog on first interaction, surveys/exception add-ons off (~215 KB).
3. Real error/timeout states (status/GitHub, scores offline as an error, ask client timeout ~12 s).
4. Canvas keyboard: sheets as buttons, inspector focus + Escape, keyboard pan.
5. Canvas phone: readable default, jump bar not clipped, inspector as bottom sheet clear of the nav.
6. Font CLS 0.176 on Ask (size-adjusted fallback / preload).
7. Flap cells: stable accessible names; reduced-motion marquee padding hides Remarks.
8. Ask: live region announces only the final answer; focus ring on input; tab semantics.
9. Client/server score formula drift (combo multiplier vs server cap).
10. 44 px tap targets (footer socials, canvas toolbar, ask tabs, checkbox, bottom nav).
