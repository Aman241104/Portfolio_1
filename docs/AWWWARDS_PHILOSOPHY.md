# The Machine Prints It — Design Philosophy (`2026-11-17`)

Chosen by Aman on 2026-11-17 over "Exhibition catalogue" and "Reality collapse".

## 1. Why the site felt mediocre
The hero promised a strange, specific object (PX-01, a reality-selecting slot machine). Everything below the fold
then fell back to a generic dark dev-portfolio template: stats grid, `Work (26)`, `Experience`, `Certifications (04)`,
`Skills (50)`, contact cards, all built the same way (big grotesk header + superscript count). **The idea died
after one screen.** Award juries score Design 40 · Usability 30 · Creativity 20 · Content 10, and "Design" means
*a point of view executed consistently*. We had a point of view for 900px and a template for 9,000px.

## 2. The one sentence
> **PX-01 is a machine. You pull it to fall into a world, or you scroll and it prints the work for you.**

Every decision below the hero must be answerable with: *"what would this machine physically print here?"*

## 3. The system

| Layer | Rule |
|---|---|
| **Object** | One strip of thermal paper, fed from an *Output tray* under the hero, read through a **print head pinned to the bottom of the screen**. Scrolling = feeding paper. That is the signature gesture; nothing else competes with it. |
| **Two papers** | **Dark Studio → black thermal film** (`#18181b` carbon stock lifted off the `#050506` void, bone ink, `#ff3b2b` red, lit rim). **Light Atelier → white receipt stock** (`#fdfcf9` on `#ebe8e2`, carbon ink, `#d81f12` red, real cast shadow). Never a white sheet in a dark room. |
| **Jobs, not sections** | Each section is a print job: `Output 0X · <job>`. 01 Readout · 02 Tickets · 03 Live telemetry · 04 Service log · 05 Calibration · 06 Parts list → torn off → *Insert coin* (contact). |
| **Perforation** | Jobs are separated by a dashed tear line with half-moon notches cut into both paper edges. No label. |
| **Tickets** | Every project is a ticket: `No. 001-2026`, a barcode derived from its slug (same bars every visit), and a plain state (`Live` with a green dot / `Shipped` / `Private`). |
| **Job titles** | Archivo at 62% width, 800, uppercase, line-height .84 — poster type from Aman's moodboard. Same in both papers. |
| **Type** | Machine voice = Geist Mono 11px, +0.06em, uppercase, graphite — one size only. Figures always tabular Geist. Human voice = Geist (dark) / Playfair Display (light) for titles only. Never medium-everything. |
| **Colour** | 4 tokens + one accent, per paper. Red only for the print-head LED/carriage and hover/focus. Green only means "live". Kickers are graphite. |
| **Motion** | One curve (`--px-ease`, decelerating, no overshoot), three durations (180 / 480 / 820ms). Headers rise 14px and fade in. The carriage runs only while paper feeds. Buttons scale to .97 on press. Static under `prefers-reduced-motion`. |
| **Sound** | Optional (S). A new job reaching the head plays `sfx.print`. |
| **Copy** | The machine speaks in labels (`Printing`, `Line 0412`, `Tear here ✂`); Aman speaks in sentences. No "creative dimensions" filler. |

## 3b. Polish rules (Aman, 2026-11-17: "looks AI-generated… polish like Apple, not more effects")
- Subtract before adding. No decorative glyphs (✂ ▮ ▸ ✶ ✺), no superscript counts, no marquees/tapes, no stamps, no joke copy.
- One hairline (`--px-rule`); dashed only for perforations, ticket stubs and receipts.
- One rhythm (`--px-sec`, `--px-head`) and one left edge for every job.
- Related controls sit with what they act on and share one box model.

## 4. Non-negotiables kept from PX-01
- Hero = **one object, lit** (Aman, 2026-11-17, after comparing with his references): machine, 2 charms (React, Three.js) beside it, "Portfolio" wordmark + red signature, one CTA pair, 5-link bar. Sphere, "Creative Developer" callout and centre pill removed. 1:1 match-cut and ink-bleed kept.
- Recruiter fast path ≤ 2 taps (résumé is in the hero bar, readout job, dock, and contact).
- Only the 26 projects in `content/work.js`.
- Mobile first: the strip runs 8px from the screen edge; the print head hides on phones (the liquid dock owns the bottom).

## 5. Implementation map
- `src/home/printout.css`: paper tokens per mode, strip, mouth, perforation, tickets, stamp, print head.
- `src/home/Printer.jsx`: `PrintHead` (job label, line counter, header print-in observer), `Perf`, `Barcode`.
- `src/home/Home.jsx`: wraps Stats→Skills in `.printout` with `data-out` / `data-label` per job.
- `src/home/home.css`: bone colour tokenised as `rgb(var(--bone-rgb) / a)` so the paper re-inks every section.

## 6. Next waves (in priority order)
1. **Service log** (Experience) as a timestamped machine log; **Parts list** (Skills) as a BOM with qty = projects using it; **Calibration** (certs) as certificate slips.
2. **Insert coin** contact: the torn ticket lands on the dunes; sending the form prints a receipt with its ticket number.
3. Scroll-linked 3D: the hero camera tracks down into the print head as the strip starts (shot `REEL_MATCH_CUT` → new `PRINT_HEAD`).
4. Carry the print language into world entry/exit (Reality Shutter → a ticket feeding through).
5. Lighthouse + 8-viewport QA pass, then agy critic re-score; loop until the critic gives ≥ 8.5 overall.

Working model (Aman, 2026-11-17): **Claude builds, the `agy` CLI critiques** (`agy -p "…" --mode plan --sandbox --dangerously-skip-permissions`, read-only brief).
