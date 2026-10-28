# Portfolio_1

A personal developer portfolio built as a macOS-desktop simulator — a dock, draggable windows, a Finder-style project browser, Terminal-style skills view, Safari-style project blog, Photos gallery, a Contact window, and (new) a Snake mini-game and an embedded Spotify player.

Live: https://portfolio-1-five-jet.vercel.app
Repo: https://github.com/Aman241104/Portfolio_1

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), static routes |
| UI | React 19, TypeScript for new code (existing JS allowed) |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| 3D | three.js, React Three Fiber, drei, postprocessing |
| Animation | GSAP 3 + `@gsap/react` (SplitText, Draggable) |
| Sound | Procedural WebAudio (no audio files), opt-in |
| Fonts | `next/font` (Geist, Geist Mono, Instrument Serif, Georama, Roboto Mono) + tiny Google subsets for the 11 multiverse scripts |
| State | Zustand 5 + Immer (desktop world) |

## Routes

| Route | What |
|---|---|
| `/` | PORTFOLIO.exe: gate → cinematic intro over a floating island → pull the lever → land in a world |
| `/editorial` | Recruiter view (alias: old `/?style=classic` links redirect here) |
| `/terminal` | The portfolio as a shell |
| `/desktop` | The original macOS-style desktop |

`/?shot=wide` holds the intro's opening frame (art direction).

## Architecture

```
src/
├── App.jsx              # Mounts every window + the desktop shell
├── main.jsx              # Vite/React entry point
├── hoc/
│   └── WindowWrapper.jsx # Wraps a window component: open/close animation, dragging, z-index via zustand
├── store/
│   ├── window.js         # zustand store: which windows are open, their z-index/data
│   └── location.js       # zustand store: current Finder folder
└── windows/               # One file per "app": Finder, Terminal, Safari, Resume,
                            # Photos, Contact, Text, Image, Game, Music

components/
├── Dock.jsx     # Bottom dock, macOS-style hover magnification via GSAP
├── Navbar.jsx   # Top menu bar
├── Home.jsx     # Desktop icons (one per project folder)
└── Welcome.jsx  # Intro/landing overlay

constants/index.js  # All content: dockApps, techStack, WORK_LOCATION (projects),
                     # ABOUT_LOCATION, socials, gallery, blogPosts, WINDOW_CONFIG
```

Adding a new "app": create a component in `src/windows/`, wrap it with `WindowWrapper(Component, "somekey")`, add `somekey` to `WINDOW_CONFIG` in `constants/index.js`, add an entry to `dockApps` with a matching `id`, and render `<YourWindow />` in `App.jsx`.

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # eslint
```

No environment variables or external services required to run locally.
