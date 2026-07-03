# Portfolio_1

A personal developer portfolio built as a macOS-desktop simulator — a dock, draggable windows, a Finder-style project browser, Terminal-style skills view, Safari-style project blog, Photos gallery, a Contact window, and (new) a Snake mini-game and an embedded Spotify player.

Live: https://portfolio-1-five-jet.vercel.app
Repo: https://github.com/Aman241104/Portfolio_1

## Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 7 |
| UI | React 19 |
| Styling | Tailwind CSS 4 (Rust engine, `@tailwindcss/vite` plugin) |
| Animation | GSAP 3 + `@gsap/react` (including `Draggable` for window dragging) |
| State | Zustand 5 + Immer middleware |
| PDF viewing | react-pdf (renders the resume inline) |
| Misc | react-snowfall (desktop snow effect), react-tooltip, dayjs, clsx |

No backend, no database, no TypeScript — this is a static single-page app. Content (projects, tech stack, socials, gallery) lives in `constants/index.js` as plain data, not fetched from anywhere.

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
