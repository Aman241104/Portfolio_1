// Everything on the Work grid. Only projects Aman confirmed as his own work go here (2026-11-10: the résumé
// projects, his own products/concepts, client sites from ~/work/AGENTS.md, and the 14 sites he ticked by hand).
// Left out on purpose: astrology sites, the two wishes sites, yashhuuuu, DealLens, Docket, Prestine, Destination Anywhere.
// `live: true` = the client's own production domain (checked 2026-11-10; jadetravels.co.in serves a blank WordPress,
// akshartravels.in isn't theirs, so those stay on vercel.app). Screenshots live on Cloudinary under portfolio/work/<slug> (captured from the live sites); `img` overrides that id.
export const KINDS = { product: "Products", mobile: "Mobile apps", client: "Client websites", concept: "Concepts & demos" };

// Card image on Cloudinary (also used by the other worlds and SEO).
export const shot = (item, w = 900) => `https://res.cloudinary.com/dhrcarq8g/image/upload/f_auto,q_auto,w_${w}/${item.img || `portfolio/work/${item.slug}`}`;

export const work = [
    {
        slug: "job-search-os", kind: "product", year: 2026, maintained: true, title: "Job Search OS", img: "portfolio/projects/job-search-os",
        url: "https://job-search-zeta-ten.vercel.app/demo", repo: "https://github.com/Aman241104/job-search",
        line: "AI job search platform: 19 sources scraped concurrently, NIM/Gemini failover, sub-second API latency, pytest tenant-isolation guards, and tailored CV/cover-letter generation.",
        stack: "Python · FastAPI · Next.js · Postgres · Cloud Run",
    },
    {
        slug: "whatsapp-ai", kind: "product", year: 2026, maintained: true, title: "Pulse AI: WhatsApp agent SaaS",
        url: "https://whatsapp-ai-agent-inky.vercel.app/demo",
        line: "Multi-tenant SaaS where each business runs an LLM agent on its WhatsApp number, with Postgres RLS tenant isolation, booking state machine and drip sequences.",
        stack: "Next.js · Supabase · Groq · Meta Cloud API",
    },
    {
        slug: "mindcore", kind: "mobile", year: 2026, title: "Mindcore",
        url: "https://github.com/Aman241104/mind-core", repo: "https://github.com/Aman241104/mind-core",
        line: "Android app: share a reel, post, link or screenshot and AI pulls out the repos, tools, certs and jobs in it, checks each one online, and answers questions about your library with sources.",
        stack: "Kotlin · Jetpack Compose · AI extraction · v0.9.5",
    },
    {
        slug: "huggsy", kind: "mobile", year: 2026, title: "Huggsy habit tracker",
        line: "Cosy habit tracker for routines, water, sleep, journal and a little garden: a Next.js PWA plus a native Android app on one Supabase backend.",
        stack: "Next.js · Jetpack Compose · Supabase", note: "Private repo · walkthrough on request",
    },
    {
        slug: "zing-bliss", kind: "client", year: 2026, maintained: true, title: "Zing Bliss Events",
        url: "https://www.zingblissevents.com", live: true,
        line: "Event agency platform: marketing site, client-preference quiz, client portal and an admin CMS.",
        stack: "Next.js · GSAP · Lenis",
    },
    {
        slug: "bni-ares", kind: "client", year: 2026, maintained: true, title: "BNI Ares",
        url: "https://www.bniares.com", live: true,
        line: "Site and member roster for Ahmedabad West's Platinum BNI chapter: members, visitor sign-up and chapter stats.",
        stack: "Next.js · React · Tailwind CSS",
    },
    {
        slug: "vitlead", kind: "client", year: 2026, maintained: true, title: "Vitlead",
        url: "https://www.vitlead.com", live: true,
        line: "Lead-generation site for Australian mortgage brokers running suburb-targeted Meta ads.",
        stack: "Next.js · Tailwind CSS · Lead Funnels",
    },
    {
        slug: "naam-transfer", kind: "client", year: 2026, maintained: true, title: "Naam Transfer",
        url: "https://www.naamtransfer.com", live: true,
        line: "Electricity, gas and municipal name-transfer service in Ahmedabad, handled end to end online.",
        stack: "Next.js · Tailwind CSS · Document Workflows",
    },
    {
        slug: "cmj-events", kind: "client", year: 2026, maintained: true, title: "CMJ Events",
        url: "https://www.clubmjevents.com", live: true,
        line: "Luxury wedding and event planner: destination weddings, corporate events, portfolio and enquiries.",
        stack: "Next.js · GSAP · Tailwind CSS",
    },
    {
        slug: "prihaan-spices", kind: "client", year: 2026, maintained: true, title: "Prihaan Spices",
        url: "https://www.prihaanspices.in", live: true,
        line: "Storefront for spices, masalas and dry fruits, with WhatsApp ordering.",
        stack: "Next.js · Tailwind CSS · WhatsApp Commerce",
    },
    {
        slug: "aayush-packaging", kind: "client", year: 2026, live: true, maintained: true, title: "Aayush Packaging",
        url: "https://www.aayushpackaging.in",
        line: "11-page site for a flexible-packaging manufacturer in Ahmedabad: products, industries, infrastructure and enquiries.",
        stack: "Next.js · Tailwind · GSAP",
    },
    {
        slug: "ekam-by-seri", kind: "client", year: 2026, live: true, maintained: true, title: "Ekam by Seri",
        url: "https://www.ekambyseri.com",
        line: "Storefront for handcrafted Lippan art and mirror-work décor made by Kutch artisans.",
        stack: "Next.js · Tailwind CSS · E-Commerce",
    },
    {
        slug: "advocate-jay-patel", kind: "client", year: 2026, maintained: true, title: "Advocate Jay Patel",
        url: "https://advocate-jay-patel-web.vercel.app",
        line: "Practice site for a criminal and civil lawyer, including the Bar Council disclaimer flow.",
        stack: "Next.js · Tailwind CSS · Legal Compliance",
    },
    {
        slug: "mehta-technologies", kind: "client", year: 2026, demo: true, title: "Mehta Technologies",
        url: "https://company-web-59di.vercel.app",
        line: "Agency site for a web and e-commerce studio in Ahmedabad: services, work, ERP offering and lead capture.",
        stack: "Next.js · Tailwind CSS · React",
    },
    {
        slug: "eye-hospital", kind: "client", year: 2026, demo: true, title: "EyeCare Hospital",
        url: "https://eye-hospital-web.vercel.app",
        line: "Eye hospital site: LASIK, cataract and paediatric care, specialists and appointment booking.",
        stack: "Next.js · Tailwind CSS · Booking UI",
    },
    {
        slug: "luxekey", kind: "client", year: 2026, demo: true, title: "LuxeKey Living",
        url: "https://luxeliving-web.vercel.app",
        line: "Luxury guest houses and short stays in Ahmedabad: properties, availability and booking.",
        stack: "Next.js · Tailwind CSS · Hospitality",
    },
    {
        slug: "akshar-travels", kind: "client", year: 2026, demo: true, title: "Akshar Travels",
        url: "https://travel-july.vercel.app",
        line: "Outstation cab booking across 50+ cities: one-way, round-trip, local and airport fares.",
        stack: "Next.js · Tailwind CSS · Fare Calculator",
    },
    {
        slug: "jade-tours", kind: "client", year: 2026, demo: true, title: "Jade Tours & Travel",
        url: "https://travel-web-april.vercel.app",
        line: "Travel agency for flights, holidays, passports and visas, with a trip enquiry form.",
        stack: "Next.js · Tailwind CSS · React",
    },
    {
        slug: "hvac-prep", kind: "client", year: 2026, demo: true, title: "HVAC Test Prep",
        url: "https://hvac-web.vercel.app",
        line: "Exam-prep tool for HVAC students: unlimited timed practice exams, flash cards and progress tracking.",
        stack: "Next.js · TypeScript · LocalStorage State",
    },
    {
        slug: "elite-cloud-books", kind: "client", year: 2026, demo: true, title: "Elite Cloud Books",
        url: "https://form-web-g3ka.vercel.app",
        line: "Offshore accounting, tax and fractional-CFO firm serving US businesses.",
        stack: "Next.js · Tailwind CSS · Lead Forms",
    },
    {
        slug: "jjfilms", kind: "client", year: 2026, demo: true, title: "JJ Films",
        url: "https://jjfilms.vercel.app",
        line: "Photography studio for real estate, events and wedding films.",
        stack: "Next.js · Gallery Grid · GSAP",
    },
    // Added 2026-11-17 from Aman's two Vercel accounts (personal + mehtatechteam): every live, polished client build.
    {
        slug: "aangan-boutique", kind: "client", year: 2026, live: true, title: "Aangan Boutique",
        url: "https://www.aanganboutique.in",
        line: "Designer boutique in Ahmedabad: bridal and festive collections, in-house tailoring and video consultations for clients abroad.",
        stack: "React · Vite",
    },
    {
        slug: "fgp", kind: "client", year: 2026, live: true, title: "Fibre Glass Processors",
        url: "https://fgpind.com",
        line: "ISO-certified maker of FRP tanks, scrubbers and process equipment since 2003: product catalogue, equipment finder and quote requests.",
        stack: "Next.js",
    },
    {
        slug: "rising", kind: "client", year: 2026, live: true, title: "Rising Rechargeable",
        url: "https://www.risingrechargeable.com",
        line: "Industrial lighting and appliance manufacturer: product catalogue and a homepage best-seller lineup the client runs from an admin panel.",
        stack: "Next.js · Admin panel",
    },
    {
        slug: "nexsphere", kind: "client", year: 2026, live: true, title: "NexSphere Global Advisors",
        url: "https://www.thenexsphereglobal.com",
        line: "Outsourced accounting, payroll and US tax advisory for CPA firms and businesses across the US and India.",
        stack: "Next.js",
    },
    {
        slug: "styluxe-interior", kind: "client", year: 2026, live: true, title: "Styluxe Interior Decor",
        url: "https://www.sidecor.in",
        line: "Turnkey interior design studio in Ahmedabad, delivered under 90 days: projects, awards and a cost estimator.",
        stack: "Next.js",
    },
    {
        slug: "sv-space", kind: "client", year: 2026, live: true, title: "SV Space Designs",
        url: "https://www.svspacedesigns.in",
        line: "Interior design and turnkey execution studio in Ahmedabad for homes, offices and cafés.",
        stack: "Next.js",
    },
    {
        slug: "chahana-dental", kind: "client", year: 2026, live: true, title: "Chahana Dental Studio",
        url: "https://chahanadentalstudio.com",
        line: "Luxury dental clinic in Ahmedabad: treatments, digital smile design and online booking.",
        stack: "Next.js",
    },
    {
        slug: "classic-organic", kind: "client", year: 2026, live: true, title: "Classic Organic Chemicals",
        url: "https://www.classicorganicchemicals.com",
        line: "Industrial and agro-chemical supplier since 2011: product range, industries served and bulk quote requests.",
        stack: "Next.js",
    },
    {
        slug: "silver-spoon", kind: "client", year: 2026, live: true, title: "Silver Spoon by ACJ",
        url: "https://www.silverspoonbyacj.com",
        line: "Premium silver jewellery, idols and corporate gifting from Ahmedabad.",
        stack: "Next.js",
    },
    {
        slug: "prihaan-fin", kind: "client", year: 2026, live: true, title: "Prihaan Financial Services",
        url: "https://prihaanfin.com",
        line: "Foreign exchange and remittance services, including student fee payments through Flywire and Convera.",
        stack: "Next.js",
    },
    {
        slug: "ares-league", kind: "client", year: 2026, live: true, title: "ARES Business League",
        url: "https://www.aresbusinessleague.com",
        line: "A one-month tournament of 30 BNI business owners in 4 teams: teams, leaderboard and schedule.",
        stack: "Next.js",
    },
    {
        slug: "amee-patel", kind: "client", year: 2026, live: true, title: "Amee Patel, graphic designer",
        url: "https://www.ameepatel.co.in",
        line: "Portfolio for a packaging and print designer with 10+ years in pharma and food packaging.",
        stack: "Next.js",
    },
    {
        slug: "jukebox-media", kind: "client", year: 2026, live: true, title: "Jukebox Media",
        url: "https://www.jukeboxmedia.in",
        line: "Brand strategy and performance marketing agency: leadership, brands, the Jukebox method and client reviews.",
        stack: "Next.js · WebGL gradient",
    },
    {
        slug: "decor-story", kind: "client", year: 2026, demo: true, title: "The Décor Story",
        url: "https://the-decor-story-web.vercel.app",
        line: "Wedding and event décor studio: galleries, packages and a check-your-date enquiry.",
        stack: "Next.js",
    },
    {
        slug: "krishna-ceramic", kind: "client", year: 2026, demo: true, title: "Krishna Ceramic",
        url: "https://krishna-ceramic-web.vercel.app",
        line: "Tiles, marble and bath-fitting showroom since 1990: collections, catalogues and a room visualizer.",
        stack: "Next.js",
    },
    {
        slug: "norwood", kind: "client", year: 2026, demo: true, title: "Norwood Modular",
        url: "https://norwood-modular-web.vercel.app",
        line: "Modular switches, home automation and lighting, with a working dimmer in the hero.",
        stack: "React · Vite",
    },
    {
        slug: "kartik-pathak", kind: "client", year: 2026, demo: true, title: "Kartik Pathak",
        url: "https://kartik-web-sigma.vercel.app",
        line: "Indian Idol singer and live performer: performances, coaching and event bookings.",
        stack: "Next.js",
    },
    {
        slug: "preetam-aluglaze", kind: "client", year: 2026, demo: true, title: "Preetam Aluglaze",
        url: "https://preetam-aluglaze.vercel.app",
        line: "Premium aluminium doors and windows: products, projects and quotes.",
        stack: "Next.js",
    },
    {
        slug: "lightning-kicks", kind: "concept", year: 2026, title: "Lightning Kicks redesign",
        url: "https://lightning-kicks-redesign.vercel.app",
        line: "Concept redesign of a sneaker and streetwear store: faster browsing, cleaner product pages.",
        stack: "React · Vite · CSS Motion",
    },
    {
        slug: "northline", kind: "concept", year: 2026, title: "Northline",
        url: "https://dh-web-task.vercel.app",
        line: "Product site for an API observability and on-call tool, built as a design-and-build task.",
        stack: "Next.js · TypeScript · Tailwind CSS",
    },
    {
        slug: "awwwards", kind: "concept", year: 2025, title: "Awwwards clone", img: "portfolio/projects/awwwards",
        url: "https://github.com/Aman241104/awwards_clone",
        line: "A rebuild of the Awwwards voting platform, for the motion and layout practice.",
        stack: "React · GSAP · Tailwind CSS",
    },
    {
        slug: "macbook", kind: "concept", year: 2025, title: "3D MacBook scroll", img: "portfolio/projects/3d-macbook",
        url: "https://github.com/Aman241104/macbook_demo",
        line: "Scroll-driven 3D MacBook product animation in Three.js.",
        stack: "React · Three.js · GSAP ScrollTrigger",
    },
    {
        slug: "stock-app", kind: "concept", year: 2025, title: "Stock market app", img: "portfolio/projects/stock-market-app",
        url: "https://github.com/Aman241104/stock_app_demo",
        line: "Real-time stock tracking with live charts.",
        stack: "React · REST APIs · Live Charts",
    },
];

// Client builds that live on preview URLs are shown honestly as prototypes / demo builds, everywhere their line is read.
work.forEach((w) => { if (w.demo) w.line = `Prototype · ${w.line}`; });

// Everything in production today: sites Aman maintains + every client build on its own live domain.
// Shared by the home "Live" list and api/status.js so the list and the uptime check never drift apart.
export const inProduction = (w) => !!(w.maintained || w.live);

// One status word for a project, for worlds that show one (Live / Prototype / Built / Private).
export const status = (w) => (w.live ? "Live" : w.demo ? "Prototype" : w.url ? "Built" : "Private");
