(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
(()=>{"use strict";return[
"[project]/constants/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INITIAL_Z_INDEX",
    ()=>INITIAL_Z_INDEX,
    "WINDOW_CONFIG",
    ()=>WINDOW_CONFIG,
    "blogPosts",
    ()=>blogPosts,
    "dockApps",
    ()=>dockApps,
    "gallery",
    ()=>gallery,
    "locations",
    ()=>locations,
    "mobileApps",
    ()=>mobileApps,
    "mobileDockApps",
    ()=>mobileDockApps,
    "mobileGridApps",
    ()=>mobileGridApps,
    "navIcons",
    ()=>navIcons,
    "navLinks",
    ()=>navLinks,
    "photosLinks",
    ()=>photosLinks,
    "socials",
    ()=>socials,
    "techStack",
    ()=>techStack
]);
const navLinks = [
    {
        id: 1,
        name: "Projects",
        type: "finder"
    },
    {
        id: 3,
        name: "Contact",
        type: "contact"
    },
    {
        id: 4,
        name: "Resume",
        type: "resume"
    }
];
const navIcons = [
    {
        id: 1,
        img: "/icons/wifi.svg"
    },
    {
        id: 2,
        img: "/icons/search.svg"
    },
    {
        id: 3,
        img: "/icons/user.svg"
    },
    {
        id: 4,
        img: "/icons/mode.svg"
    }
];
const dockApps = [
    {
        id: "finder",
        name: "Portfolio",
        icon: "finder.png",
        canOpen: true
    },
    {
        id: "safari",
        name: "Repo",
        icon: "safari.png",
        canOpen: true
    },
    {
        id: "photos",
        name: "Gallery",
        icon: "photos.png",
        canOpen: true
    },
    {
        id: "contact",
        name: "Contact",
        icon: "contact.png",
        canOpen: true
    },
    {
        id: "terminal",
        name: "Skills",
        icon: "terminal.png",
        canOpen: true
    },
    {
        id: "trash",
        name: "Archive",
        icon: "trash.png",
        canOpen: false
    },
    {
        id: "game",
        name: "Game",
        icon: "game.svg",
        canOpen: true
    },
    {
        id: "music",
        name: "Music",
        icon: "music.svg",
        canOpen: true
    }
];
// Separate from dockApps so the desktop Dock (which maps over dockApps
// directly) is unaffected — mobile has a "Resume" app that desktop reaches
// via the Navbar instead of the dock, so it has no dockApps entry to reuse.
const mobileApps = [
    ...dockApps.filter((app)=>app.canOpen),
    {
        id: "resume",
        name: "Resume",
        icon: "pdf.png",
        canOpen: true
    }
];
// iOS-style: 4 pinned dock icons, rest in the scrollable springboard grid.
const MOBILE_DOCK_IDS = [
    "finder",
    "contact",
    "resume",
    "terminal"
];
const mobileDockApps = mobileApps.filter((app)=>MOBILE_DOCK_IDS.includes(app.id));
const mobileGridApps = mobileApps.filter((app)=>!MOBILE_DOCK_IDS.includes(app.id));
const blogPosts = [
    {
        id: 1,
        date: "Jul 2026",
        title: "Job Search Automation Platform",
        description: "AI job search platform: 19-source scraper, experience-aware LLM scoring, validated one-page CVs, interview prep.",
        image: "/images/projects/job-search-os.jpg",
        link: "https://github.com/Aman241104/job-search"
    },
    {
        id: 2,
        date: "Jun 2026",
        title: "WhatsApp AI Agent — Multi-Tenant SaaS",
        description: "Multi-tenant WhatsApp Business AI SaaS with LLM agents, RLS tenant isolation, and a booking state machine.",
        image: "/images/projects/whatsapp-ai.png",
        link: "https://whatsapp-ai-agent-inky.vercel.app"
    },
    {
        id: 3,
        date: "Dec 2025",
        title: "Awwwards Clone",
        description: "A modern web experience replicating the Awwwards voting platform.",
        image: "/images/awwwards.png",
        link: "https://github.com/Aman241104/awwards_clone"
    },
    {
        id: 4,
        date: "Nov 2025",
        title: "Stock Market App",
        description: "Real-time stock tracking application with dynamic data visualization.",
        image: "/images/stock-market-app.png",
        link: "https://github.com/Aman241104/stock_app_demo"
    },
    {
        id: 5,
        date: "Oct 2025",
        title: "3D Macbook Scroll Demo",
        description: "An interactive 3D experience featuring a scrolling Macbook animation.",
        image: "/images/3D-macbook.png",
        link: "https://github.com/Aman241104/macbook_demo"
    }
];
const techStack = [
    {
        category: "Frontend",
        items: [
            "React",
            "Next.js",
            "TypeScript",
            "GSAP",
            "Framer Motion"
        ]
    },
    {
        category: "Mobile",
        items: [
            "React Native"
        ]
    },
    {
        category: "Styling",
        items: [
            "Tailwind CSS",
            "Sass",
            "CSS"
        ]
    },
    {
        category: "Backend",
        items: [
            "Node.js",
            "Express",
            "FastAPI",
            "REST APIs",
            "Server-Sent Events"
        ]
    },
    {
        category: "Database",
        items: [
            "PostgreSQL",
            "Supabase",
            "MongoDB"
        ]
    },
    {
        category: "AI / LLM",
        items: [
            "Gemini API",
            "Groq API",
            "Claude API",
            "LLM Tool-Calling",
            "Multi-Agent Systems"
        ]
    },
    {
        category: "Automation",
        items: [
            "n8n",
            "Playwright",
            "Web Scraping"
        ]
    },
    {
        category: "Dev Tools",
        items: [
            "Git",
            "GitHub",
            "Docker",
            "Vercel",
            "Render",
            "CI/CD"
        ]
    }
];
const socials = [
    {
        id: 1,
        text: "Github",
        icon: "/icons/github.svg",
        bg: "#f4656b",
        link: "https://github.com/Aman241104"
    },
    {
        id: 2,
        text: "Instagram",
        icon: "/icons/instagram.png",
        bg: "#4bcb63",
        link: "https://www.instagram.com/aman_.2411?igsh=dm10YXNlYmtwOGIz"
    },
    {
        id: 3,
        text: "Twitter/X",
        icon: "/icons/twitter.svg",
        bg: "#ff866b",
        link: "https://x.com/Aman60734818"
    },
    {
        id: 4,
        text: "LinkedIn",
        icon: "/icons/linkedin.svg",
        bg: "#05b6f6",
        link: "https://www.linkedin.com/in/aman-patel-88847a265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    }
];
const photosLinks = [
    {
        id: 1,
        icon: "/icons/gicon1.svg",
        title: "Library"
    },
    {
        id: 2,
        icon: "/icons/gicon2.svg",
        title: "Memories"
    },
    {
        id: 3,
        icon: "/icons/file.svg",
        title: "Places"
    },
    {
        id: 4,
        icon: "/icons/gicon4.svg",
        title: "People"
    },
    {
        id: 5,
        icon: "/icons/gicon5.svg",
        title: "Favorites"
    }
];
const gallery = [
    {
        id: 1,
        img: "/images/stock-market-app.png"
    },
    {
        id: 2,
        img: "/images/awwwards.png"
    },
    {
        id: 3,
        img: "/images/aman-2.jpeg"
    },
    {
        id: 4,
        img: "/images/3D-macbook.png"
    },
    {
        id: 5,
        img: "/images/projects/job-serach.png"
    },
    {
        id: 6,
        img: "/images/projects/whatsapp-ai.png"
    }
];
;
const WORK_LOCATION = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: [
        // ===============================================
        // COLUMN 1 (Left Edge)
        // ===============================================
        // ▶ Project 1: WhatsApp AI Agent — Multi-Tenant SaaS
        {
            id: 102,
            name: "WhatsApp AI Agent",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-5 left-5",
            windowPosition: "top-7 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-10 left-10",
                    description: [
                        "Multi-tenant WhatsApp Business AI SaaS: an admin dashboard lets each business",
                        "workspace configure an LLM-powered agent handling real WhatsApp Business Cloud API conversations.",
                        "Row-Level-Security tenant isolation, a booking state machine, and a drip-sequence follow-up engine.",
                        "Found and fixed a real cross-tenant data-leak bug via a live RLS audit."
                    ]
                },
                {
                    id: 2,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://whatsapp-ai-agent-inky.vercel.app",
                    position: "bottom-10 left-1/2 -translate-x-1/2"
                }
            ]
        },
        // ▶ Project 2: Job Search Automation Platform (this very app)
        {
            id: 103,
            name: "Job Search Platform",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-32 left-5",
            windowPosition: "top-35 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-1/2 -translate-x-1/2",
                    description: [
                        "Multi-user AI job search platform, built and used daily for my own search.",
                        "Scrapes 19 job sources concurrently, scores each listing on skills, real experience required and salary,",
                        "re-checks top listings daily, and writes a validated one-page CV and cover letter per job.",
                        "Also: copy-ready application answers, interview prep packs, analytics, and an Obsidian vault viewer.",
                        "FastAPI on Google Cloud Run, Next.js dashboard, Supabase Postgres with per-user isolation, 27 tests."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/job-search",
                    position: "bottom-10 left-10"
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://job-search-zeta-ten.vercel.app",
                    position: "bottom-10 right-10"
                }
            ]
        },
        // ▶ Project 3: Stock Trading Demo App
        {
            id: 104,
            name: "Stock Trading Demo",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-60 left-5",
            windowPosition: "top-63 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-1/2 -translate-y-1/2 left-10",
                    description: [
                        "Stock/trading demo app with authenticated and public route groups.",
                        "Background job processing via Inngest for scheduled/async tasks.",
                        "better-auth for authentication, Radix UI + react-hook-form for accessible forms."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/stock_app_demo",
                    position: "top-10 right-10"
                }
            ]
        },
        // ===============================================
        // COLUMN 2 (Next to Column 1)
        // ===============================================
        // ▶ Project 4: Zing Bliss Events — Luxury Event Agency Platform
        {
            id: 105,
            name: "Zing Bliss Events",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-5 left-50",
            windowPosition: "top-91 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "bottom-5 right-15",
                    description: [
                        "High-end event-management agency platform, not just a marketing site.",
                        "Public routes plus an interactive client-preference quiz, a private authenticated",
                        "client portal with live event itineraries, and an admin CMS for event management.",
                        "GSAP + Lenis smooth-scroll cinematic animation system across every route."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/event-management",
                    position: "top-5 left-5"
                },
                {
                    id: 3,
                    name: "Live Site",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://www.zingblissevents.com",
                    position: "bottom-10 left-10"
                }
            ]
        },
        // ▶ Project 5: Gym Tracker
        {
            id: 106,
            name: "Gym Tracker",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-32 left-50",
            windowPosition: "top-120 left-7",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-10 left-20",
                    description: [
                        "Full-stack fitness tracker: workout logging, routine builder, and a per-exercise",
                        "analytics view charting historical performance via Recharts.",
                        "An algorithmic (non-LLM) progressive-overload coach suggests next-session weights/reps.",
                        "Multi-user auth via NextAuth + MongoDB adapter, GitHub OAuth."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/gym-app",
                    position: "bottom-20 left-10"
                }
            ]
        },
        // ▶ Project 6: Inventory Manager
        {
            id: 107,
            name: "Inventory Manager",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-60 left-50",
            windowPosition: "top-148 left-7",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-10 left-20",
                    description: [
                        "Batch/lot-based inventory management system for a produce/fruit-stock use case.",
                        "Products, vendors, and customers CRUD with buy/sell transaction ledgers.",
                        "Weighted-average cost calculation across lots, plus a soft-delete trash pattern",
                        "instead of hard deletes."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/inventory-manager",
                    position: "bottom-20 left-10"
                }
            ]
        },
        // ===============================================
        // COLUMN 3 — earlier projects, kept (not removed)
        // ===============================================
        // ▶ Project 7: Awwwards Clone
        {
            id: 108,
            name: "Awwwards Clone",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-5 left-95",
            windowPosition: "top-176 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-10 left-10",
                    description: [
                        "A full-stack clone of the Awwwards platform.",
                        "Features a voting system, media-rich galleries, and smooth transitions.",
                        "Replicates the premium feel of the original site."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/awwards_clone",
                    position: "top-10 right-10"
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://awwardswebp2.netlify.app/",
                    position: "bottom-10 left-1/2 -translate-x-1/2"
                }
            ]
        },
        // ▶ Project 8: Stock Market App (earlier, separate from the Stock Trading Demo above)
        {
            id: 109,
            name: "Stock Market App",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-32 left-95",
            windowPosition: "top-204 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-1/2 -translate-x-1/2",
                    description: [
                        "Real-time stock market tracking application.",
                        "Includes interactive charts and data visualization.",
                        "Clean dashboard interface for financial data."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/stock_app_demo",
                    position: "bottom-10 left-10"
                }
            ]
        },
        // ▶ Project 9: 3D Macbook Demo
        {
            id: 110,
            name: "3D Macbook Scroll",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-60 left-95",
            windowPosition: "top-232 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-1/2 -translate-y-1/2 left-10",
                    description: [
                        "Immersive 3D web experience with a Macbook model.",
                        "Uses Three.js and React Three Fiber.",
                        "Features camera movements and scroll-triggered animations."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/macbook_demo",
                    position: "top-10 right-10"
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://macbook-demo.netlify.app/",
                    position: "bottom-10 right-10"
                }
            ]
        },
        // ===============================================
        // COLUMN 4 — earlier projects, kept (not removed)
        // ===============================================
        // ▶ Project 10: SaaS Landing Page
        {
            id: 111,
            name: "SaaS Landing Page",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-5 left-140",
            windowPosition: "top-260 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "bottom-5 right-15",
                    description: [
                        "High-converting landing page for SaaS products.",
                        "Responsive layout with hero sections and feature grids.",
                        "Focuses on UI/UX best practices."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/saas_landing_page",
                    position: "top-5 left-5"
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://saaslandpage2411.netlify.app/",
                    position: "top-5 right-5"
                }
            ]
        },
        // ▶ Project 11: Next.js Demo
        {
            id: 112,
            name: "Next.js Demo",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-32 left-140",
            windowPosition: "top-288 left-7",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-10 left-20",
                    description: [
                        "Comprehensive Next.js capabilities demo.",
                        "Explores SSR, SSG, and App Router.",
                        "Reference for performant React apps."
                    ]
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/next_js_demo",
                    position: "bottom-20 left-10"
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://deveventsbyaman.vercel.app/",
                    position: "top-20 right-20"
                }
            ]
        }
    ]
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
            imageUrl: "/images/aman-1.jpeg"
        },
        {
            id: 2,
            name: "casual-me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-28 right-72",
            imageUrl: "/images/aman-2.jpeg"
        },
        {
            id: 3,
            name: "group-me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-52 left-80",
            imageUrl: "/images/aman-3.jpeg"
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
                "⚡ Fun fact: I enjoy turning half-finished ideas into working projects (and occasionally over-engineering them)"
            ]
        }
    ]
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
            fileType: "pdf"
        }
    ]
};
const TRASH_LOCATION = {
    id: 4,
    type: "trash",
    name: "Archive",
    icon: "/icons/trash.svg",
    kind: "folder",
    children: []
};
const locations = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION
};
const INITIAL_Z_INDEX = 1000;
const WINDOW_CONFIG = {
    finder: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    contact: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    resume: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    safari: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    photos: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    terminal: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    txtfile: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    imgfile: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    game: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    },
    music: {
        isOpen: false,
        zIndex: INITIAL_Z_INDEX,
        data: null
    }
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/constants/index.js [app-client] (ecmascript) <export blogPosts as projects>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "projects",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blogPosts"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-client] (ecmascript)");
}),
"[project]/constants/index.js [app-client] (ecmascript) <export techStack as skills>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "skills",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["techStack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-client] (ecmascript)");
}),
"[project]/content/profile.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Who I am, in one place. Every world reads from here.
__turbopack_context__.s([
    "profile",
    ()=>profile
]);
// ponytail: projects/skills/socials still live in constants/index.js (plan Phase 0 moves them here).
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-client] (ecmascript)");
const profile = {
    name: "Aman Patel",
    role: "Creative full-stack developer",
    line: "I build AI products and interfaces that feel like something.",
    email: "patelaman0241@gmail.com",
    resume: "/files/resume.pdf",
    github: "https://github.com/Aman241104"
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/content/taste.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Aman's taste, shared by every portfolio world (see docs/PORTFOLIO_EXE_PLAN.md §2.1).
// Music pulled from BitChord (YouTube Music client) history + a 300-track sample of 4,709 liked songs, 2026-10-27.
// Visuals pulled from pinterest.com/patelaman0241 boards (portfolio, web, into-font-style, prompt, helmet-wrap, wallpaper).
// `id` is the YouTube video id: playable through youtube-nocookie embeds and music.youtube.com links.
__turbopack_context__.s([
    "alsoListening",
    ()=>alsoListening,
    "onRepeat",
    ()=>onRepeat,
    "playing",
    ()=>playing,
    "riding",
    ()=>riding,
    "topArtists",
    ()=>topArtists,
    "visualDna",
    ()=>visualDna,
    "watching",
    ()=>watching
]);
const onRepeat = [
    {
        id: "7YkWRP1zn2E",
        title: "Virginia Beach",
        artist: "Drake",
        note: "most-played right now"
    },
    {
        id: "hqvcww4ydh8",
        title: "Can't Tell Me Nothing",
        artist: "Kanye West"
    },
    {
        id: "eaW_G4ytXrY",
        title: "Man On The Moon",
        artist: "Kid Cudi"
    },
    {
        id: "ZeKuGrD2fl8",
        title: "Fire Squad",
        artist: "J. Cole"
    },
    {
        id: "NPqDIwWMtxg",
        title: "euphoria",
        artist: "Kendrick Lamar"
    },
    {
        id: "YY2ng9SjCTo",
        title: "Often",
        artist: "The Weeknd"
    },
    {
        id: "Re-rt1a5bKg",
        title: "Survival Tactics",
        artist: "Joey Bada$$"
    },
    {
        id: "tN2Xwis-Qao",
        title: "It Ain't Hard to Tell",
        artist: "Nas"
    },
    {
        id: "cYKAr38pZcY",
        title: "Photosynthesis",
        artist: "Saba"
    },
    {
        id: "r6_KV5gZNHI",
        title: "Smile",
        artist: "Juice WRLD"
    },
    {
        id: "VI3av8rzXY8",
        title: "HOME",
        artist: "Jokhay"
    },
    {
        id: "Q29iibXXiOs",
        title: "In Limbo",
        artist: "Radiohead"
    }
];
const topArtists = [
    "Drake",
    "Kanye West",
    "Kid Cudi",
    "J. Cole",
    "The Weeknd",
    "Kendrick Lamar",
    "Travis Scott",
    "Juice WRLD",
    "Joey Bada$$",
    "Nas",
    "Logic",
    "Saba",
    "Don Toliver",
    "Westside Gunn",
    "Tyler, The Creator",
    "Vince Staples",
    "Brent Faiyaz",
    "Jokhay",
    "Raftaar",
    "KING"
];
const alsoListening = [
    "Radiohead",
    "Pink Floyd",
    "Beach House",
    "Daniel Caesar",
    "Joji"
];
const watching = {
    films: [
        "One Battle After Another",
        "Akira"
    ],
    anime: [],
    sitcoms: [
        "Friends",
        "Community",
        "30 Rock",
        "Curb Your Enthusiasm",
        "Malcolm in the Middle",
        "It's Always Sunny in Philadelphia",
        "black-ish",
        "BoJack Horseman",
        "South Park"
    ],
    shows: [
        "Mirzapur",
        "The Rookie",
        "Cobra Kai",
        "Running Point"
    ]
};
const playing = [];
const riding = [
    "Bikes",
    "Racing",
    "Custom helmet wraps"
];
const visualDna = {
    palettes: [
        "black + red (Spider-Verse, helmet flames)",
        "Klein blue + white",
        "black + acid green",
        "black + gold filigree"
    ],
    type: [
        "oversized editorial grotesk",
        "liquid chrome lettering",
        "Devanagari display type",
        "retro serif",
        "grunge streetwear posters"
    ],
    materials: [
        "chrome",
        "inflated / puffy 3D",
        "fur",
        "leather patch",
        "embroidery",
        "liquid glass"
    ],
    motifs: [
        "Spider-Man / Miles Morales",
        "matte black helmets",
        "3D character portraits",
        "pixel / wireframe type"
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]));
;
}),
"[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)");
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/dices.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Dices
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "12",
            height: "12",
            x: "2",
            y: "10",
            rx: "2",
            ry: "2",
            key: "6agr2n"
        }
    ],
    [
        "path",
        {
            d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",
            key: "1o487t"
        }
    ],
    [
        "path",
        {
            d: "M6 18h.01",
            key: "uhywen"
        }
    ],
    [
        "path",
        {
            d: "M10 14h.01",
            key: "ssrbsk"
        }
    ],
    [
        "path",
        {
            d: "M15 6h.01",
            key: "cblpky"
        }
    ],
    [
        "path",
        {
            d: "M18 9h.01",
            key: "2061c0"
        }
    ]
];
const Dices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("dices", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/dices.js [app-client] (ecmascript) <export default as Dices>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dices.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>FileText
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }
    ],
    [
        "path",
        {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }
    ],
    [
        "path",
        {
            d: "M10 9H8",
            key: "b1mrlr"
        }
    ],
    [
        "path",
        {
            d: "M16 13H8",
            key: "t4e002"
        }
    ],
    [
        "path",
        {
            d: "M16 17H8",
            key: "z1uh3a"
        }
    ]
];
const FileText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("file-text", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileText",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LayoutGrid
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "3",
            y: "3",
            rx: "1",
            key: "1g98yp"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "14",
            y: "3",
            rx: "1",
            key: "6d4xhi"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "14",
            y: "14",
            rx: "1",
            key: "nxv5o0"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "3",
            y: "14",
            rx: "1",
            key: "1bb6yr"
        }
    ]
];
const LayoutGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("layout-grid", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayoutGrid",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Link2
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9 17H7A5 5 0 0 1 7 7h2",
            key: "8i5ue5"
        }
    ],
    [
        "path",
        {
            d: "M15 7h2a5 5 0 1 1 0 10h-2",
            key: "1b9ql8"
        }
    ],
    [
        "line",
        {
            x1: "8",
            x2: "16",
            y1: "12",
            y2: "12",
            key: "1jonct"
        }
    ]
];
const Link2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("link-2", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp,
    "mergeClasses",
    ()=>mergeClasses,
    "toCamelCase",
    ()=>toCamelCase,
    "toKebabCase",
    ()=>toKebabCase,
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
const toPascalCase = (string)=>{
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
};
;
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/src/shell/CoinSlot.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dices.js [app-client] (ecmascript) <export default as Dices>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldPicker$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/WorldPicker.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/content/profile.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// The persistent escape hatch, same place in every world. Sits above any world's own stacking.
const CoinSlot = ({ current, onSpin, onSelect })=>{
    _s();
    const [picking, setPicking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const copyLink = async ()=>{
        try {
            await navigator.clipboard.writeText(`${location.origin}/${current}`);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        } catch  {}
    };
    const btn = "flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-xs";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Portfolio worlds",
                className: "fixed z-[10000] right-3 bottom-3 max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-[6.5rem] flex items-center gap-0.5 p-1 rounded-full bg-black/75 text-white backdrop-blur border border-white/15 font-georama shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: btn,
                        onClick: onSpin,
                        title: "Back to the machine",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__["Dices"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/shell/CoinSlot.jsx",
                                lineNumber: 27,
                                columnNumber: 100
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Spin"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/shell/CoinSlot.jsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: btn,
                        onClick: ()=>setPicking(true),
                        title: "All worlds",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/shell/CoinSlot.jsx",
                                lineNumber: 28,
                                columnNumber: 107
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Worlds"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/shell/CoinSlot.jsx",
                        lineNumber: 28,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `${btn} max-sm:hidden`,
                        onClick: copyLink,
                        title: "Copy link to this world",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/shell/CoinSlot.jsx",
                                lineNumber: 29,
                                columnNumber: 125
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            copied ? "Copied" : "Link"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/shell/CoinSlot.jsx",
                        lineNumber: 29,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: btn,
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].resume,
                        target: "_blank",
                        rel: "noreferrer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/shell/CoinSlot.jsx",
                                lineNumber: 30,
                                columnNumber: 91
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Résumé"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/shell/CoinSlot.jsx",
                        lineNumber: 30,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/shell/CoinSlot.jsx",
                lineNumber: 25,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            picking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldPicker$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                current: current,
                onSelect: onSelect,
                onClose: ()=>setPicking(false)
            }, void 0, false, {
                fileName: "[project]/src/shell/CoinSlot.jsx",
                lineNumber: 32,
                columnNumber: 25
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/shell/CoinSlot.jsx",
        lineNumber: 24,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CoinSlot, "JUsf15mmWaaSB/sUfHU9hbmbNGc=");
_c = CoinSlot;
const __TURBOPACK__default__export__ = CoinSlot;
var _c;
__turbopack_context__.k.register(_c, "CoinSlot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shell/WorldPicker.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/worlds/registry.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Gallery of every world. Used by the machine ("Pick a world") and the coin slot ("Worlds").
const WorldPicker = ({ onSelect, onClose, current })=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPicker.useEffect": ()=>{
            const onKey = {
                "WorldPicker.useEffect.onKey": (e)=>e.key === "Escape" && onClose()
            }["WorldPicker.useEffect.onKey"];
            window.addEventListener("keydown", onKey);
            return ({
                "WorldPicker.useEffect": ()=>window.removeEventListener("keydown", onKey)
            })["WorldPicker.useEffect"];
        }
    }["WorldPicker.useEffect"], [
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Pick a world",
        className: "fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-georama",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-2xl rounded-2xl bg-neutral-900 text-white border border-white/10 p-5",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold",
                            children: "Pick a world"
                        }, void 0, false, {
                            fileName: "[project]/src/shell/WorldPicker.jsx",
                            lineNumber: 21,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: "text-sm text-neutral-400 hover:text-white",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/src/shell/WorldPicker.jsx",
                            lineNumber: 22,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/shell/WorldPicker.jsx",
                    lineNumber: 20,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "grid sm:grid-cols-2 gap-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"].map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    onClose();
                                    onSelect(w.id);
                                },
                                className: "w-full text-left rounded-xl p-4 bg-white/5 hover:bg-white/10 border border-white/10",
                                style: current === w.id ? {
                                    borderColor: w.accent
                                } : undefined,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block font-semibold",
                                        style: {
                                            color: w.accent
                                        },
                                        children: w.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/shell/WorldPicker.jsx",
                                        lineNumber: 30,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-sm text-neutral-400",
                                        children: w.tagline
                                    }, void 0, false, {
                                        fileName: "[project]/src/shell/WorldPicker.jsx",
                                        lineNumber: 31,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block mt-2 text-[10px] uppercase tracking-widest text-neutral-500",
                                        children: w.symbols.join(" · ")
                                    }, void 0, false, {
                                        fileName: "[project]/src/shell/WorldPicker.jsx",
                                        lineNumber: 32,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/shell/WorldPicker.jsx",
                                lineNumber: 27,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        }, w.id, false, {
                            fileName: "[project]/src/shell/WorldPicker.jsx",
                            lineNumber: 26,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/shell/WorldPicker.jsx",
                    lineNumber: 24,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/shell/WorldPicker.jsx",
            lineNumber: 18,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/shell/WorldPicker.jsx",
        lineNumber: 15,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(WorldPicker, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = WorldPicker;
const __TURBOPACK__default__export__ = WorldPicker;
var _c;
__turbopack_context__.k.register(_c, "WorldPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shell/WorldShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorldShell,
    "useShell",
    ()=>useShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$CoinSlot$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/CoinSlot.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/worlds/registry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/storage.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const ShellContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    go: ()=>{},
    spin: ()=>{}
});
const useShell = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ShellContext);
};
_s(useShell, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function WorldShell({ id, children }) {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldShell.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLast"])(id);
        }
    }["WorldShell.useEffect"], [
        id
    ]);
    const shell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorldShell.useMemo[shell]": ()=>({
                go: ({
                    "WorldShell.useMemo[shell]": (to)=>router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldHref"])(to))
                })["WorldShell.useMemo[shell]"],
                spin: ({
                    "WorldShell.useMemo[shell]": ()=>router.push("/")
                })["WorldShell.useMemo[shell]"]
            })
    }["WorldShell.useMemo[shell]"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShellContext.Provider, {
        value: shell,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$CoinSlot$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                current: id,
                onSpin: shell.spin,
                onSelect: shell.go
            }, void 0, false, {
                fileName: "[project]/src/shell/WorldShell.tsx",
                lineNumber: 23,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/shell/WorldShell.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
}
_s1(WorldShell, "gTAY3ybtUZ8vbQ5sb0DPEg2pRM0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = WorldShell;
var _c;
__turbopack_context__.k.register(_c, "WorldShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shell/storage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LAST_KEY",
    ()=>LAST_KEY,
    "SEEN_KEY",
    ()=>SEEN_KEY,
    "getLast",
    ()=>getLast,
    "getSeen",
    ()=>getSeen,
    "setLast",
    ()=>setLast,
    "setSeen",
    ()=>setSeen
]);
// Storage can throw (private mode, blocked site data). Failing = behave like a first visit.
const safe = (fn, fallback)=>{
    try {
        return fn();
    } catch  {
        return fallback;
    }
};
const LAST_KEY = "pexe:last";
const SEEN_KEY = "pexe:seen";
const getLast = ()=>safe(()=>localStorage.getItem(LAST_KEY), null);
const setLast = (id)=>safe(()=>localStorage.setItem(LAST_KEY, id));
const getSeen = ()=>safe(()=>JSON.parse(sessionStorage.getItem(SEEN_KEY)) ?? [], []);
const setSeen = (ids)=>safe(()=>sessionStorage.setItem(SEEN_KEY, JSON.stringify(ids)));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/worlds/registry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Every finished world: its id (= its route, /<id>), how it shows up on the reels, and its accent.
// Only finished worlds go in here. That is what keeps the machine honest.
__turbopack_context__.s([
    "ALIASES",
    ()=>ALIASES,
    "RECRUITER_WORLD",
    ()=>RECRUITER_WORLD,
    "findWorld",
    ()=>findWorld,
    "worldHref",
    ()=>worldHref,
    "worlds",
    ()=>worlds
]);
const worlds = [
    {
        id: "desktop",
        name: "Desktop OS",
        tagline: "The one you know. Windows, dock, Finder.",
        symbols: [
            "2026",
            "Desktop",
            "Calm"
        ],
        accent: "#3b82f6"
    },
    {
        id: "editorial",
        name: "Editorial",
        tagline: "Just the work, set like a magazine.",
        symbols: [
            "Now",
            "Magazine",
            "Clean"
        ],
        accent: "#1d4ed8"
    },
    {
        id: "terminal",
        name: "Terminal",
        tagline: "Type your way in.",
        symbols: [
            "1988",
            "Terminal",
            "Nerdy"
        ],
        accent: "#22c55e"
    }
];
const ALIASES = {
    classic: "editorial"
};
const RECRUITER_WORLD = "editorial";
const findWorld = (id)=>worlds.find((w)=>w.id === (ALIASES[id] ?? id));
const worldHref = (id)=>`/${findWorld(id)?.id ?? RECRUITER_WORLD}`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/worlds/terminal/index.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/content/profile.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__blogPosts__as__projects$3e$__ = __turbopack_context__.i("[project]/constants/index.js [app-client] (ecmascript) <export blogPosts as projects>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__techStack__as__skills$3e$__ = __turbopack_context__.i("[project]/constants/index.js [app-client] (ecmascript) <export techStack as skills>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/taste.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/worlds/registry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/WorldShell.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// World 3: a shell. Everything is a command; `help` lists them.
const BANNER = [
    "PORTFOLIO.exe — aman@portfolio (tty1)",
    `${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].name}: ${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].role}.`,
    "Type `help` to see what you can do. Tab completes.",
    ""
];
const commands = ({ go, spin })=>({
        help: ()=>[
                "about           who I am",
                "projects        what I've built   (open <n> to visit one)",
                "skills          toolkit",
                "music           what's on repeat",
                "watching        films + sitcoms",
                "contact         email + socials",
                "resume          open my résumé",
                "worlds          list portfolio worlds   (go <world> to switch)",
                "spin            back to the machine",
                "clear           clear the screen"
            ],
        about: ()=>[
                __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].line,
                "",
                "Currently: AI products, multi-agent systems, interfaces with motion."
            ],
        whoami: ()=>[
                "a visitor with good taste, apparently."
            ],
        projects: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__blogPosts__as__projects$3e$__["projects"].map((p, i)=>`[${i + 1}] ${p.title.padEnd(42)} ${p.date}`),
        open: (n)=>{
            const p = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__blogPosts__as__projects$3e$__["projects"][Number(n) - 1];
            if (!p) return [
                `open: no project ${n ?? ""}. Try \`projects\`.`
            ];
            window.open(p.link, "_blank", "noopener");
            return [
                `opening ${p.title} → ${p.link}`
            ];
        },
        skills: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__techStack__as__skills$3e$__["skills"].map((s)=>`${s.category.padEnd(12)} ${s.items.join(", ")}`),
        music: ()=>[
                ...__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onRepeat"].slice(0, 8).map((t)=>`♪ ${t.title} — ${t.artist}`),
                "",
                `rotation: ${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["topArtists"].slice(0, 10).join(", ")}`
            ],
        watching: ()=>[
                `films:   ${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["watching"].films.join(", ")}`,
                `sitcoms: ${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["watching"].sitcoms.join(", ")}`
            ],
        contact: ()=>[
                `email    ${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].email}`,
                ...__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socials"].map((s)=>`${s.text.padEnd(8)} ${s.link.split("?")[0]}`)
            ],
        resume: ()=>{
            window.open(__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].resume, "_blank", "noopener");
            return [
                "opening résumé…"
            ];
        },
        worlds: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worlds"].map((w)=>`${w.id.padEnd(10)} ${w.tagline}`),
        go: (id)=>{
            setTimeout(()=>go(id), 250);
            return [
                `switching to ${id}…`
            ];
        },
        spin: ()=>{
            setTimeout(spin, 250);
            return [
                "pulling the lever…"
            ];
        },
        sudo: (...args)=>args.join(" ") === "hire aman" ? [
                "[sudo] permission granted.",
                `send the offer to ${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].email} 🫡`
            ] : [
                "nice try."
            ]
    });
const TerminalWorld = ()=>{
    _s();
    const shell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShell"])();
    const [lines, setLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(BANNER);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cursor, setCursor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cmds = commands(shell);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalWorld.useEffect": ()=>endRef.current?.scrollIntoView({
                block: "end"
            })
    }["TerminalWorld.useEffect"], [
        lines
    ]);
    const run = (raw)=>{
        const [name, ...args] = raw.trim().split(/\s+/);
        const echo = `aman@portfolio:~$ ${raw}`;
        if (!name) return setLines((l)=>[
                ...l,
                echo
            ]);
        if (name === "clear") return setLines([]);
        const fn = cmds[name.toLowerCase()];
        const out = fn ? fn(...args) : [
            `${name}: command not found. Try \`help\`.`
        ];
        setLines((l)=>[
                ...l,
                echo,
                ...out,
                ""
            ]);
        setHistory((h)=>[
                raw,
                ...h
            ]);
    };
    const onKeyDown = (e)=>{
        if (e.key === "Enter") {
            run(input);
            setInput("");
            setCursor(-1);
        } else if (e.key === "ArrowUp" && history.length) {
            e.preventDefault();
            const next = Math.min(cursor + 1, history.length - 1);
            setCursor(next);
            setInput(history[next]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = cursor - 1;
            setCursor(next);
            setInput(next < 0 ? "" : history[next]);
        } else if (e.key === "Tab") {
            e.preventDefault();
            const match = Object.keys(cmds).filter((c)=>c.startsWith(input.trim()));
            if (match.length === 1) setInput(match[0] + " ");
            else if (match.length > 1) setLines((l)=>[
                    ...l,
                    match.join("  ")
                ]);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-dvh bg-[#0b0f0b] text-[#9ef0a8] font-roboto text-sm sm:text-[15px] p-4 sm:p-8 pb-24 cursor-text",
        onClick: ()=>inputRef.current?.focus(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                className: "whitespace-pre-wrap break-words leading-relaxed",
                children: lines.join("\n")
            }, void 0, false, {
                fileName: "[project]/src/worlds/terminal/index.jsx",
                lineNumber: 96,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[#5eead4] shrink-0",
                        children: "aman@portfolio:~$"
                    }, void 0, false, {
                        fileName: "[project]/src/worlds/terminal/index.jsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        autoFocus: true,
                        value: input,
                        onChange: (e)=>setInput(e.target.value),
                        onKeyDown: onKeyDown,
                        "aria-label": "Terminal command",
                        autoCapitalize: "off",
                        autoCorrect: "off",
                        spellCheck: false,
                        className: "flex-1 bg-transparent outline-none caret-[#9ef0a8]"
                    }, void 0, false, {
                        fileName: "[project]/src/worlds/terminal/index.jsx",
                        lineNumber: 99,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/worlds/terminal/index.jsx",
                lineNumber: 97,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: endRef
            }, void 0, false, {
                fileName: "[project]/src/worlds/terminal/index.jsx",
                lineNumber: 110,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/worlds/terminal/index.jsx",
        lineNumber: 94,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TerminalWorld, "FQ9lqW5ijgSTCj3VC0jd3cPKTFo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShell"]
    ];
});
_c = TerminalWorld;
const __TURBOPACK__default__export__ = TerminalWorld;
var _c;
__turbopack_context__.k.register(_c, "TerminalWorld");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]})(),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_186f47r38jlmb._.js.map