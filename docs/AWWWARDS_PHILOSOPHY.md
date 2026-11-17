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
| **Perforation** | Jobs are separated by a dashed tear line with half-moon notches cut into both paper edges and a `✂ Output 0X` label. |
| **Tickets** | Every project is a ticket: `No. 001-2026`, a barcode derived from its slug (same bars every visit), and a rubber stamp (`LIVE` / `SHIPPED` / `PRIVATE`) that thumps down when it prints. |
| **Type** | Machine voice = Geist Mono, uppercase, wide tracking, tiny (9.5–11px). Human voice = Geist (dark) / Playfair Display (light) for titles only. Never medium-everything. |
| **Colour** | 4 tokens + one accent, per paper. Red is *ink*, not decoration: kickers, stamps, the print-head LED, line counter. |
| **Motion** | Mechanical, never floaty. Headers print in with `steps(10)` clip (the head laying lines), then the ink darkens. Stamps land with overshoot. LED blinks in `steps`. All of it collapses to static under `prefers-reduced-motion`. |
| **Sound** | Optional (S). A new job reaching the head plays `sfx.print`. |
| **Copy** | The machine speaks in labels (`Printing`, `Line 0412`, `Tear here ✂`); Aman speaks in sentences. No "creative dimensions" filler. |

## 4. Non-negotiables kept from PX-01
- The hero stays: machine, 4 keychains, sphere, "Creative Developer" callout, "Portfolio" wordmark, red signature, 1:1 match-cut, ink-bleed (Aman, 2026-11-17: keep everything; only the 9-link bar was slimmed to 5).
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
