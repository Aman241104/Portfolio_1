import { work, KINDS, shot } from "../content/work.js";
import { skillGroups } from "../content/skills.js";
const navLinks = [
    {
        id: 1,
        name: "Projects",
        type: "finder",
    },
    {
        id: 3,
        name: "Contact",
        type: "contact",
    },
    {
        id: 4,
        name: "Resume",
        type: "resume",
    },
];

const navIcons = [
    {
        id: 1,
        img: "/icons/wifi.svg",
    },
    {
        id: 2,
        img: "/icons/search.svg",
    },
    {
        id: 3,
        img: "/icons/user.svg",
    },
    {
        id: 4,
        img: "/icons/mode.svg",
    },
];

const dockApps = [
    {
        id: "finder",
        name: "Portfolio", // was "Finder"
        icon: "finder.png",
        canOpen: true,
    },
    {
        id: "safari",
        name: "Repo", // was "Safari"
        icon: "safari.png",
        canOpen: true,
    },
    {
        id: "photos",
        name: "Gallery", // was "Photos"
        icon: "photos.png",
        canOpen: true,
    },
    {
        id: "contact",
        name: "Contact", // or "Get in touch"
        icon: "contact.png",
        canOpen: true,
    },
    {
        id: "terminal",
        name: "Skills", // was "Terminal"
        icon: "terminal.png",
        canOpen: true,
    },
    {
        id: "trash",
        name: "Archive", // was "Trash"
        icon: "trash.png",
        canOpen: false,
    },
    {
        id: "game",
        name: "Game",
        icon: "game.svg",
        canOpen: true,
    },
    {
        id: "music",
        name: "Music",
        icon: "music.svg",
        canOpen: true,
    },
];

// Separate from dockApps so the desktop Dock (which maps over dockApps
// directly) is unaffected — mobile has a "Resume" app that desktop reaches
// via the Navbar instead of the dock, so it has no dockApps entry to reuse.
const mobileApps = [
    ...dockApps.filter((app) => app.canOpen),
    {
        id: "resume",
        name: "Resume",
        icon: "pdf.png",
        canOpen: true,
    },
];

// iOS-style: 4 pinned dock icons, rest in the scrollable springboard grid.
const MOBILE_DOCK_IDS = ["finder", "contact", "resume", "terminal"];
const mobileDockApps = mobileApps.filter((app) => MOBILE_DOCK_IDS.includes(app.id));
const mobileGridApps = mobileApps.filter((app) => !MOBILE_DOCK_IDS.includes(app.id));

// Projects and skills come from content/ (one source for every world: home, Desktop OS, Editorial, Terminal).
const blogPosts = work.map((w, i) => ({
    id: i + 1, date: String(w.year), title: w.title, description: w.line, kind: KINDS[w.kind],
    image: shot(w, 900), link: w.url || w.repo || "#",
}));

const techStack = skillGroups.map((g) => ({ category: g.group, items: g.items.map(([name]) => name) }));

const socials = [
    {
        id: 1,
        text: "Github",
        icon: "/icons/github.svg",
        bg: "#f4656b",
        link: "https://github.com/Aman241104",
    },
    {
        id: 2,
        text: "Instagram",
        icon: "/icons/instagram.png",
        bg: "#4bcb63",
        link: "https://www.instagram.com/aman_.2411?igsh=dm10YXNlYmtwOGIz",
    },
    {
        id: 3,
        text: "Twitter/X",
        icon: "/icons/twitter.svg",
        bg: "#ff866b",
        link: "https://x.com/Aman60734818",
    },
    {
        id: 4,
        text: "LinkedIn",
        icon: "/icons/linkedin.svg",
        bg: "#05b6f6",
        link: "https://www.linkedin.com/in/aman-patel-fullstack",
    },
];

const photosLinks = [
    {
        id: 1,
        icon: "/icons/gicon1.svg",
        title: "Library",
    },
    {
        id: 2,
        icon: "/icons/gicon2.svg",
        title: "Memories",
    },
    {
        id: 3,
        icon: "/icons/file.svg",
        title: "Places",
    },
    {
        id: 4,
        icon: "/icons/gicon4.svg",
        title: "People",
    },
    {
        id: 5,
        icon: "/icons/gicon5.svg",
        title: "Favorites",
    },
];

const gallery = [
    {
        id: 1,
        img: "/images/stock-market-app.png",
    },
    {
        id: 2,
        img: "/images/awwwards.png",
    },
    {
        id: 3,
        img: "/images/aman-2.jpeg",
    },
    {
        id: 4,
        img: "/images/3D-macbook.png",
    },
    {
        id: 5,
        img: "/images/projects/job-serach.png",
    },
    {
        id: 6,
        img: "/images/projects/whatsapp-ai.png",
    },
];

export {
    navLinks,
    navIcons,
    dockApps,
    mobileApps,
    mobileDockApps,
    mobileGridApps,
    blogPosts,
    techStack,
    socials,
    photosLinks,
    gallery,
};

// Desktop OS "Work": generated from content/work.js. Four category folders sit on the desktop; each opens a grid of
// project folders holding an About note, the screenshot, the live site and the code. Position classes are written out
// literally so Tailwind generates them.
const DESK_SLOTS = ["top-7 left-3", "top-35 left-3", "top-63 left-3", "top-91 left-3"];
const GRID_SLOTS = [
    "top-5 left-5", "top-5 left-35", "top-5 left-65",
    "top-32 left-5", "top-32 left-35", "top-32 left-65",
    "top-60 left-5", "top-60 left-35", "top-60 left-65",
    "top-88 left-5", "top-88 left-35", "top-88 left-65",
    "top-116 left-5", "top-116 left-35", "top-116 left-65",
    "top-144 left-5", "top-144 left-35", "top-144 left-65",
    "top-172 left-5", "top-172 left-35", "top-172 left-65",
];
const FILE_SLOTS = ["top-10 left-10", "top-10 left-50", "top-40 left-10", "top-40 left-50"];
const hostOf = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
let fileId = 1000;
const projectFolder = (w, i) => ({
    id: fileId++, name: w.title, icon: "/images/folder.png", kind: "folder", position: GRID_SLOTS[i % GRID_SLOTS.length],
    children: [
        { name: "About Project.txt", icon: "/images/txt.png", fileType: "txt",
          description: [w.line, w.stack && `Stack: ${w.stack}`, w.live && `Live in production at ${hostOf(w.url)}.`, w.note, `${KINDS[w.kind]} · ${w.year}`].filter(Boolean) },
        { name: "Screenshot.png", icon: "/images/image.png", fileType: "img", imageUrl: shot(w, 1200) },
        w.url && !w.url.includes("github.com") && { name: w.live ? "Live Site" : "Live Demo", icon: "/images/safari.png", fileType: "url", href: w.url },
        (w.repo || (w.url || "").includes("github.com")) && { name: "GitHub Repo", icon: "/images/safari.png", fileType: "url", href: w.repo || w.url },
    ].filter(Boolean).map((f, j) => ({ id: fileId++, kind: "file", position: FILE_SLOTS[j], ...f })),
});
const WORK_LOCATION = {
    id: 1, type: "work", name: "Work", icon: "/icons/work.svg", kind: "folder",
    children: Object.entries(KINDS).map(([k, label], i) => ({
        id: 200 + i, name: label, icon: "/images/folder.png", kind: "folder", position: GRID_SLOTS[i], windowPosition: DESK_SLOTS[i],
        children: work.filter((w) => w.kind === k).map(projectFolder),
    })),
};

const ABOUT_LOCATION = {
    id: 2,
    type: "about",
    name: "About me",
    icon: "/icons/info.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-10 left-5",
            imageUrl: "/images/aman-1.jpeg",
        },
        {
            id: 2,
            name: "casual-me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-28 right-72",
            imageUrl: "/images/aman-2.jpeg",
        },
        {
            id: 3,
            name: "group-me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-52 left-80",
            imageUrl: "/images/aman-3.jpeg",
        },
        {
            id: 4,
            name: "about-me.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-60 left-5",
            subtitle: "Meet the Developer Behind the Code",
            image: "/images/aman-1.jpeg",
            description: [
                "👋 Hi, I’m Aman Patel",

                "💻 Currently working on full-stack and frontend projects using JavaScript, React, and modern web tools",
                "🤝 Open to collaborating on web development, React apps, and practical software projects",
                "🛠️ Looking for help with system design, backend integration, and scalable architectures'",
                "📚 Currently learning advanced React patterns, backend development, and data handling",
                "💬 Ask me about JavaScript, CSS, React, Python, or project setup",
                "⚡ Fun fact: I enjoy turning half-finished ideas into working projects (and occasionally over-engineering them)",
            ],
        },
    ],
};

const RESUME_LOCATION = {
    id: 3,
    type: "resume",
    name: "Resume",
    icon: "/icons/file.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "Resume.pdf",
            icon: "/images/pdf.png",
            kind: "file",
            fileType: "pdf",
            // you can add `href` if you want to open a hosted resume
            // href: "/your/resume/path.pdf",
        },
    ],
};

const TRASH_LOCATION = {
    id: 4,
    type: "trash",
    name: "Archive",
    icon: "/icons/trash.svg",
    kind: "folder",
    children: [],
};

export const locations = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 10;   // windows live in 10–900; the dock sits at 950 so it is never covered

const WINDOW_CONFIG = {
    finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    game: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    music: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };