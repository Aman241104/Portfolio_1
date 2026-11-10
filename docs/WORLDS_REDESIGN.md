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
