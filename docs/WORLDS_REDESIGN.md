# Worlds redesign (critic + research pass, 2026-11-10)

Four parallel critique/research agents, one per world. Directions chosen so the four are totally different:

| World | Concept | Palette / type | Signature moment |
|---|---|---|---|
| **Desktop → PX-OS** | The OS the slot machine runs. Fictional, not a macOS clone: project *files* you pick up and drag | Void black + bone + red (home brand), Geist / Geist Mono, square bone windows with `[×][–][□]` | **Exposé recruiter mode** (F3/Space): everything tiles into a one-page CV, red ink circles "Available" |
| **Editorial → The Index** | One-ink broadsheet: newspaper front page, then a Swiss project index | Paper #F2F0EA, ink #0A0A0A, IKB #002FA7; Schibsted Grotesk + Newsreader italic + Geist Mono | Cursor-following duotone preview over a tabular index; masthead built from real counts |
| **Terminal → tty1 · AHMEDABAD** | Amber-phosphor workstation in a dark room | P3 amber #ffb000 on #120c02; VT323 + mono body | POST boot from real counts → ASCII अमन; every output row clickable |
| **Album → SHIP IT (Deluxe)** | A record you play, not a page you scroll | Ink + paper + era accents (lime / pink / blue); Archivo variable + Space Mono | Generated cover (one ring per project); later a spinning R3F disc with drag-to-scratch WebAudio beat |

Global (all four reports): the floating Spin/Worlds pill covers content on phones; the SEO fallback flashes
unstyled before React mounts (fixed in index.html); worlds need bottom safe-area padding.

## Priority list
**Desktop** P0: windows below the dock (z), lazy-mount windows + clamp to viewport + dialog role/Esc, remove snowfall
+ PNG wallpaper (CSS dot grid), Safari copy ("eneter", per-project link labels), remove console.log, brand tokens on
window chrome. P1: all 26 projects as file icons by kind, original icons (lucide) instead of Apple PNGs, red-ink desktop
note instead of the "portfolio" hover title, menubar clock + View menu, GSAP Flip open/close, phone card switcher.
P2: Exposé recruiter mode, right-click menu, drag-to-open, sounds.

**Editorial** P0: map `work` directly, case-study links, IKB palette + contrast, masthead + front page (lead = Job Search
OS, secondaries = Pulse AI, Mindcore), dock padding. P1: kind filter tabs, `shotFx()` duotone, cursor preview, fonts.
P2: mobile accordion rows, ScrollTrigger rules + SplitText, editorial skin for case.html.

**Terminal** P0: log font bug, output as JSX (clickable rows/links/commands), role=log aria-live, no emoji, guard `go`,
sticky phone chip dock, hanging indents. P1: crt.css (scanlines, vignette, bloom, flicker, amber), POST boot, ASCII
अमन + VT323, aliases (ls/cat/man/cd ../exit/theme), featured auto-run. P2: `cat n` phosphor preview, easter eggs,
screensaver, sound, `theme plain`.

**Album** P0 (done 2026-11-10): accessible skippable intro once per session, countdown overlap fix, mobile padding/CTA,
generated cover, Archivo instead of Instrument Serif. P1: WebAudio beat (opt-in), expandable track rows with scrubbable
waveform, R3F disc with scratch, era crossfade. P2: merch-drop hire card, booklet case pages, beat-synced type.

## Roadmap (2026-11-11, after the mobile + liquid-glass pass)

Done this pass: mobile Résumé buttons were invisible (SEO fallback CSS leak), keychains clear the machine on every
phone, Mindcore liquid glass + liquid tab dock, numbers strip + tape, gentle "Hiring?" card (Neon/Resend/PostHog
identify), footer dots morph `</>` `{ }` `AP` `>_` and scatter under cursor/finger, Desktop world → PX-OS.

Next, in order (mobile first: recruiters judge on phones):
1. Mobile audit of every world at 360/390/430 (overlaps, tap targets ≥44px, safe areas, no horizontal scroll).
2. Desktop world, phone version: restyle the iOS springboard as PX-OS (line icons, glass dock, no Apple PNGs).
3. Editorial: letter-by-letter headline reveal; case.html in the same broadsheet skin.
4. Album: scratchable record, merch-style "hire me" card (see Album ideas below).
5. Terminal: screensaver after idle, key sounds, an idle reaction.

### Album ideas (deeper pass)
- Real songs: yes, through official embeds only (a visible YouTube or Spotify player; YouTube's terms need it on
  screen, ≥200×200). The ids in content/taste.js are YouTube already. Hosting MP3s of other artists = copyright, no.
  Plan: a "B-sides: what I code to" side with a small visible player that slides out of the sleeve.
- The record is the nav: drag/scratch the disc (R3F or CSS conic) to scrub through tracks = projects; letting go
  snaps to the nearest track with a needle-drop sound.
- Liner notes = case studies: each track expands into credits (stack as "personnel", role, year, label = client).
- Tracklist runtime = real numbers ("26 tracks · 11 still charting" = live sites).
- Merch table hire card: "Tour dates" = availability, "Merch" = résumé PDF / tailored variants as a tee, poster, vinyl.
- Era switch (data-era) gets a sleeve-flip transition; a "Deluxe" bonus disc for concepts & demos.
- Mobile: the sleeve is a full-width swipe carousel; the disc spins under the thumb; haptics via navigator.vibrate.
