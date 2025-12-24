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
];

const blogPosts = [
    {
        id: 1,
        date: "Dec 2025", // You can use this for project completion date or tech stack
        title: "Awwwards Clone",
        description: "A modern web experience replicating the Awwwards voting platform.",
        image: "/images/awwwards.png", // specific placeholder
        link: "https://github.com/Aman241104/awwards_clone",
    },
    {
        id: 2,
        date: "Nov 2025",
        title: "Stock Market App",
        description: "Real-time stock tracking application with dynamic data visualization.",
        image: "/images/stock-market-app.png",
        link: "https://github.com/Aman241104/stock_app_demo",
    },
    {
        id: 3,
        date: "Oct 2025",
        title: "3D Macbook Scroll Demo",
        description: "An interactive 3D experience featuring a scrolling Macbook animation.",
        image: "/images/3D-macbook.png",
        link: "https://github.com/Aman241104/macbook_demo",
    },
];

const techStack = [
    {
        category: "Frontend",
        items: ["React.js", "Next.js", "TypeScript"],
    },
    {
        category: "Mobile",
        items: ["React Native"],
    },
    {
        category: "Styling",
        items: ["Tailwind CSS", "Sass", "CSS"],
    },
    {
        category: "Backend",
        items: ["Node.js", "Express"],
    },
    {
        category: "Database",
        items: ["MongoDB", "PostgreSQL"],
    },
    {
        category: "Dev Tools",
        items: ["Git", "GitHub", "Docker"],
    },
];

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
        link: "https://www.linkedin.com/in/aman-patel-88847a265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
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
];

export {
    navLinks,
    navIcons,
    dockApps,
    blogPosts,
    techStack,
    socials,
    photosLinks,
    gallery,
};

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

        // ▶ Project 1: Awwwards Clone
        {
            id: 2,
            name: "Awwwards Clone",
            icon: "/images/folder.png",
            kind: "folder",
            // Desktop Icon: Row 1, Col 1
            position: "top-5 left-5",
            // Window opens at:
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
                        "A full-stack clone of the Awwwards platform.",
                        "Features a voting system, media-rich galleries, and smooth transitions.",
                        "Replicates the premium feel of the original site."
                    ],
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/awwards_clone",
                    position: "top-10 right-10",
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://awwardswebp2.netlify.app/",
                    position: "bottom-10 left-1/2 -translate-x-1/2",
                },
            ],
        },

        // ▶ Project 2: Stock Market App
        {
            id: 3,
            name: "Stock Market App",
            icon: "/images/folder.png",
            kind: "folder",
            // Desktop Icon: Row 2, Col 1
            position: "top-32 left-5",
            // Window opens at:
            windowPosition: "top-35 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-1/2 -translate-x-1/2", // Centered top
                    description: [
                        "Real-time stock market tracking application.",
                        "Includes interactive charts and data visualization.",
                        "Clean dashboard interface for financial data."
                    ],
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/stock_app_demo",
                    position: "bottom-10 left-10",
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://stock-app-demo.vercel.app/",
                    position: "bottom-10 right-10",
                },
            ],
        },

        // ▶ Project 3: 3D Macbook Demo
        {
            id: 4,
            name: "3D Macbook Scroll",
            icon: "/images/folder.png",
            kind: "folder",
            // Desktop Icon: Row 3, Col 1
            position: "top-60 left-5",
            // Window opens at:
            windowPosition: "top-63 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-1/2 -translate-y-1/2 left-10", // Left Middle
                    description: [
                        "Immersive 3D web experience with a Macbook model.",
                        "Uses Three.js and React Three Fiber.",
                        "Features camera movements and scroll-triggered animations."
                    ],
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/macbook_demo",
                    position: "top-10 right-10",
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://macbook-demo.netlify.app/",
                    position: "bottom-10 right-10",
                },
            ],
        },

        // ===============================================
        // COLUMN 2 (Next to Column 1)
        // ===============================================

        // ▶ Project 4: SaaS Landing Page
        {
            id: 5,
            name: "SaaS Landing Page",
            icon: "/images/folder.png",
            kind: "folder",
            // Desktop Icon: Row 1, Col 2
            position: "top-5 left-50",
            // Window opens at:
            windowPosition: "top-91 left-3",
            children: [
                {
                    id: 1,
                    name: "About Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "bottom-5 right-15", // Bottom right corner
                    description: [
                        "High-converting landing page for SaaS products.",
                        "Responsive layout with hero sections and feature grids.",
                        "Focuses on UI/UX best practices."
                    ],
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/saas_landing_page",
                    position: "top-5 left-5",
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    // 👇 REPLACE THIS STRING WITH YOUR DEPLOYED URL
                    href: "https://saaslandpage2411.netlify.app/",
                    position: "top-5 right-5",
                },
            ],
        },

        // ▶ Project 5: Next.js Demo
        {
            id: 6,
            name: "Next.js Demo",
            icon: "/images/folder.png",
            kind: "folder",
            // Desktop Icon: Row 2, Col 2
            position: "top-32 left-50",
            // Window opens at:
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
                        "Comprehensive Next.js capabilities demo.",
                        "Explores SSR, SSG, and App Router.",
                        "Reference for performant React apps."
                    ],
                },
                {
                    id: 2,
                    name: "GitHub Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Aman241104/next_js_demo",
                    position: "bottom-20 left-10",
                },
                {
                    id: 3,
                    name: "Live Demo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://deveventsbyaman.vercel.app/",
                    position: "top-20 right-20",
                },
            ],
        },
    ],
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
            image: "/images/adrian.jpg",
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
};

export const locations = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
    finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };