(()=>{"use strict";module.exports = [
"[project]/constants/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/constants/index.js [app-ssr] (ecmascript) <export blogPosts as projects>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "projects",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blogPosts"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-ssr] (ecmascript)");
}),
"[project]/constants/index.js [app-ssr] (ecmascript) <export techStack as skills>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "skills",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["techStack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-ssr] (ecmascript)");
}),
"[project]/content/profile.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Who I am, in one place. Every world reads from here.
__turbopack_context__.s([
    "profile",
    ()=>profile
]);
// ponytail: projects/skills/socials still live in constants/index.js (plan Phase 0 moves them here).
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-ssr] (ecmascript)");
const profile = {
    name: "Aman Patel",
    role: "Creative full-stack developer",
    line: "I build AI products and interfaces that feel like something.",
    email: "patelaman0241@gmail.com",
    resume: "/files/resume.pdf",
    github: "https://github.com/Aman241104"
};
;
}),
"[project]/content/taste.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/shell/CoinSlot.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dices.js [app-ssr] (ecmascript) <export default as Dices>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-ssr] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldPicker$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/WorldPicker.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/content/profile.js [app-ssr] (ecmascript) <locals>");
"use client";
;
;
;
;
;
// The persistent escape hatch, same place in every world. Sits above any world's own stacking.
const CoinSlot = ({ current, onSpin, onSelect })=>{
    const [picking, setPicking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const copyLink = async ()=>{
        try {
            await navigator.clipboard.writeText(`${location.origin}/${current}`);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        } catch  {}
    };
    const btn = "flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-xs";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Portfolio worlds",
                className: "fixed z-[10000] right-3 bottom-3 max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-[6.5rem] flex items-center gap-0.5 p-1 rounded-full bg-black/75 text-white backdrop-blur border border-white/15 font-georama shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: btn,
                        onClick: onSpin,
                        title: "Back to the machine",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__["Dices"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: btn,
                        onClick: ()=>setPicking(true),
                        title: "All worlds",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `${btn} max-sm:hidden`,
                        onClick: copyLink,
                        title: "Copy link to this world",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: btn,
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].resume,
                        target: "_blank",
                        rel: "noreferrer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
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
            picking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$WorldPicker$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
const __TURBOPACK__default__export__ = CoinSlot;
}),
"[project]/src/shell/WorldPicker.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/worlds/registry.js [app-ssr] (ecmascript)");
"use client";
;
;
;
// Gallery of every world. Used by the machine ("Pick a world") and the coin slot ("Worlds").
const WorldPicker = ({ onSelect, onClose, current })=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKey = (e)=>e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return ()=>window.removeEventListener("keydown", onKey);
    }, [
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Pick a world",
        className: "fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-georama",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-2xl rounded-2xl bg-neutral-900 text-white border border-white/10 p-5",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold",
                            children: "Pick a world"
                        }, void 0, false, {
                            fileName: "[project]/src/shell/WorldPicker.jsx",
                            lineNumber: 21,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "grid sm:grid-cols-2 gap-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["worlds"].map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-sm text-neutral-400",
                                        children: w.tagline
                                    }, void 0, false, {
                                        fileName: "[project]/src/shell/WorldPicker.jsx",
                                        lineNumber: 31,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
const __TURBOPACK__default__export__ = WorldPicker;
}),
"[project]/src/shell/WorldShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorldShell,
    "useShell",
    ()=>useShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$CoinSlot$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/CoinSlot.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/worlds/registry.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shell/storage.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ShellContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    go: ()=>{},
    spin: ()=>{}
});
const useShell = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ShellContext);
function WorldShell({ id, children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$storage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLast"])(id);
    }, [
        id
    ]);
    const shell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            go: (to)=>router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$worlds$2f$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["worldHref"])(to)),
            spin: ()=>router.push("/")
        }), [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ShellContext.Provider, {
        value: shell,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shell$2f$CoinSlot$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/src/shell/storage.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/worlds/editorial/index.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$gsap$2f$react$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@gsap/react/src/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/content/profile.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__blogPosts__as__projects$3e$__ = __turbopack_context__.i("[project]/constants/index.js [app-ssr] (ecmascript) <export blogPosts as projects>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__techStack__as__skills$3e$__ = __turbopack_context__.i("[project]/constants/index.js [app-ssr] (ecmascript) <export techStack as skills>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/taste.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// World 2: the recruiter view. Klein blue on white, big type, everything one scroll away.
const Section = ({ n, title, children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "ed-reveal grid md:grid-cols-[180px_1fr] gap-4 md:gap-10 py-14 border-t border-black/15",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-sm uppercase tracking-[0.25em] text-[#1d4ed8]",
                children: [
                    n,
                    " — ",
                    title
                ]
            }, void 0, true, {
                fileName: "[project]/src/worlds/editorial/index.jsx",
                lineNumber: 12,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/worlds/editorial/index.jsx",
                lineNumber: 13,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/worlds/editorial/index.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
const EditorialWorld = ()=>{
    const root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$gsap$2f$react$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGSAP"])(()=>{
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].from(".ed-hero > *", {
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out"
        });
    }, {
        scope: root
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: root,
        className: "min-h-dvh bg-[#f6f5f1] text-neutral-950 font-georama",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto px-4 sm:px-8 pb-28",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "ed-hero pt-20 sm:pt-28 pb-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm uppercase tracking-[0.3em] text-neutral-500",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].role
                        }, void 0, false, {
                            fileName: "[project]/src/worlds/editorial/index.jsx",
                            lineNumber: 29,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "mt-4 text-[18vw] md:text-[11rem] leading-[0.85] font-black tracking-tighter",
                            children: [
                                "Aman",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                    lineNumber: 31,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#1d4ed8] italic",
                                    children: "Patel."
                                }, void 0, false, {
                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                    lineNumber: 31,
                                    columnNumber: 35
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/worlds/editorial/index.jsx",
                            lineNumber: 30,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-8 max-w-xl text-xl sm:text-2xl leading-snug",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].line
                        }, void 0, false, {
                            fileName: "[project]/src/worlds/editorial/index.jsx",
                            lineNumber: 33,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex flex-wrap gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `mailto:${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].email}`,
                                    className: "px-5 py-3 rounded-full bg-[#1d4ed8] text-white font-semibold hover:bg-[#1e40af]",
                                    children: "Email me"
                                }, void 0, false, {
                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                    lineNumber: 35,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].resume,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "px-5 py-3 rounded-full border border-black/30 hover:bg-black hover:text-white",
                                    children: "Résumé (PDF)"
                                }, void 0, false, {
                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                    lineNumber: 36,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/worlds/editorial/index.jsx",
                            lineNumber: 34,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/worlds/editorial/index.jsx",
                    lineNumber: 28,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    n: "01",
                    title: "Selected work",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "divide-y divide-black/10",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__blogPosts__as__projects$3e$__["projects"].map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: p.link,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "group grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr_220px] gap-4 items-center py-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-neutral-400 tabular-nums",
                                            children: String(i + 1).padStart(2, "0")
                                        }, void 0, false, {
                                            fileName: "[project]/src/worlds/editorial/index.jsx",
                                            lineNumber: 46,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-2xl sm:text-4xl font-bold tracking-tight group-hover:text-[#1d4ed8] transition-colors",
                                                    children: p.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                                    lineNumber: 48,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block mt-1 text-neutral-600 max-w-xl",
                                                    children: p.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                                    lineNumber: 49,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block mt-1 text-xs uppercase tracking-widest text-neutral-400",
                                                    children: p.date
                                                }, void 0, false, {
                                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                                    lineNumber: 50,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/worlds/editorial/index.jsx",
                                            lineNumber: 47,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: p.image,
                                            alt: "",
                                            loading: "lazy",
                                            className: "max-sm:hidden w-full aspect-[4/3] object-cover rounded-lg grayscale group-hover:grayscale-0 transition"
                                        }, void 0, false, {
                                            fileName: "[project]/src/worlds/editorial/index.jsx",
                                            lineNumber: 52,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                    lineNumber: 44,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            }, p.id, false, {
                                fileName: "[project]/src/worlds/editorial/index.jsx",
                                lineNumber: 43,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/worlds/editorial/index.jsx",
                        lineNumber: 41,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/worlds/editorial/index.jsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    n: "02",
                    title: "Toolkit",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        className: "grid sm:grid-cols-2 gap-x-10 gap-y-5",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__techStack__as__skills$3e$__["skills"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "font-semibold",
                                        children: s.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/worlds/editorial/index.jsx",
                                        lineNumber: 64,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "text-neutral-600",
                                        children: s.items.join(", ")
                                    }, void 0, false, {
                                        fileName: "[project]/src/worlds/editorial/index.jsx",
                                        lineNumber: 65,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, s.category, true, {
                                fileName: "[project]/src/worlds/editorial/index.jsx",
                                lineNumber: 63,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/worlds/editorial/index.jsx",
                        lineNumber: 61,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/worlds/editorial/index.jsx",
                    lineNumber: 60,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    n: "03",
                    title: "Off the clock",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl sm:text-3xl leading-snug max-w-3xl",
                        children: [
                            "On repeat: ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onRepeat"].slice(0, 5).map((t)=>`${t.artist}`).join(", "),
                            ". Rewatching ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["watching"].sitcoms.slice(0, 3).join(", "),
                            ". Forever thinking about ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$taste$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["watching"].films[1]
                            }, void 0, false, {
                                fileName: "[project]/src/worlds/editorial/index.jsx",
                                lineNumber: 75,
                                columnNumber: 48
                            }, ("TURBOPACK compile-time value", void 0)),
                            ". Bikes, racing, 3D and a lot of video editing."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/worlds/editorial/index.jsx",
                        lineNumber: 72,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/worlds/editorial/index.jsx",
                    lineNumber: 71,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    n: "04",
                    title: "Contact",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `mailto:${__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].email}`,
                            className: "text-3xl sm:text-5xl font-bold tracking-tight underline decoration-[#1d4ed8] underline-offset-8 break-all",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$profile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["profile"].email
                        }, void 0, false, {
                            fileName: "[project]/src/worlds/editorial/index.jsx",
                            lineNumber: 80,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "mt-6 flex flex-wrap gap-4 text-sm",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["socials"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: s.link,
                                        target: "_blank",
                                        rel: "noreferrer",
                                        className: "hover:text-[#1d4ed8]",
                                        children: [
                                            s.text,
                                            " ↗"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/worlds/editorial/index.jsx",
                                        lineNumber: 85,
                                        columnNumber: 44
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, s.id, false, {
                                    fileName: "[project]/src/worlds/editorial/index.jsx",
                                    lineNumber: 85,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/worlds/editorial/index.jsx",
                            lineNumber: 83,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/worlds/editorial/index.jsx",
                    lineNumber: 79,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/worlds/editorial/index.jsx",
            lineNumber: 27,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/worlds/editorial/index.jsx",
        lineNumber: 26,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = EditorialWorld;
}),
"[project]/src/worlds/registry.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
];})()

//# sourceMappingURL=_15qfsdrsuqihw._.js.map