// Everything on the Work grid. Only projects Aman confirmed as his own work go here (2026-11-10: the résumé
// projects, his own products/concepts, client sites from ~/work/AGENTS.md, and the 14 sites he ticked by hand).
// Left out on purpose: astrology sites, the two wishes sites, yashhuuuu, DealLens, Docket, Prestine.
// Screenshots live on Cloudinary under portfolio/work/<slug> (captured from the live sites); `img` overrides that id.
export const KINDS = { product: "Products", client: "Client websites", concept: "Concepts & demos" };

export const work = [
    {
        slug: "job-search-os", kind: "product", year: 2026, title: "Job Search OS", img: "portfolio/projects/job-search-os",
        url: "https://job-search-zeta-ten.vercel.app", repo: "https://github.com/Aman241104/job-search",
        line: "AI job search platform: 19 sources scraped at once, two-stage LLM scoring, a tailored one-page CV and cover letter for every job.",
        stack: "Python · FastAPI · Next.js · Postgres · Cloud Run",
    },
    {
        slug: "whatsapp-ai", kind: "product", year: 2026, title: "Pulse AI: WhatsApp agent SaaS",
        url: "https://whatsapp-ai-agent-inky.vercel.app",
        line: "Multi-tenant SaaS where each business runs an LLM agent on its WhatsApp number, with row-level security, bookings and drip sequences.",
        stack: "Next.js · Supabase · Groq · Meta Cloud API",
    },
    {
        slug: "zing-bliss", kind: "client", year: 2026, title: "Zing Bliss Events",
        url: "https://www.zingblissevents.com",
        line: "Event agency platform: marketing site, client-preference quiz, client portal and an admin CMS.",
        stack: "Next.js · GSAP · Lenis",
    },
    {
        slug: "aayush-packaging", kind: "client", year: 2026, title: "Aayush Packaging",
        url: "https://aayush-packaging-coating-web.vercel.app",
        line: "11-page site for a flexible-packaging manufacturer in Ahmedabad: products, industries, infrastructure and enquiries.",
        stack: "Next.js · Tailwind · GSAP",
    },
    {
        slug: "ekam-by-seri", kind: "client", year: 2026, title: "Ekam by Seri",
        url: "https://ekam-by-seri-web.vercel.app",
        line: "Storefront for handcrafted Lippan art and mirror-work décor made by Kutch artisans.",
    },
    {
        slug: "advocate-jay-patel", kind: "client", year: 2026, title: "Advocate Jay Patel",
        url: "https://advocate-jay-patel-web.vercel.app",
        line: "Practice site for a criminal and civil lawyer, including the Bar Council disclaimer flow.",
    },
    {
        slug: "mehta-technologies", kind: "client", year: 2026, title: "Mehta Technologies",
        url: "https://company-web-59di.vercel.app",
        line: "Agency site for a web and e-commerce studio in Ahmedabad: services, work, ERP offering and lead capture.",
    },
    {
        slug: "bni-ares", kind: "client", year: 2026, title: "BNI Ares",
        url: "https://bni-ares-roster.vercel.app",
        line: "Site and member roster for Ahmedabad West's Platinum BNI chapter: members, visitor sign-up and chapter stats.",
    },
    {
        slug: "vitlead", kind: "client", year: 2026, title: "Vitlead",
        url: "https://vitlead-web.vercel.app",
        line: "Lead-generation site for Australian mortgage brokers running suburb-targeted Meta ads.",
    },
    {
        slug: "naam-transfer", kind: "client", year: 2026, title: "Naam Transfer",
        url: "https://namm-transfer.vercel.app",
        line: "Electricity, gas and municipal name-transfer service in Ahmedabad, handled end to end online.",
    },
    {
        slug: "cmj-events", kind: "client", year: 2026, title: "CMJ Events",
        url: "https://mj-events-web.vercel.app",
        line: "Luxury wedding and event planner: destination weddings, corporate events, portfolio and enquiries.",
    },
    {
        slug: "prihaan-spices", kind: "client", year: 2026, title: "Prihaan Spices",
        url: "https://prihaan-spices-web.vercel.app",
        line: "Storefront for spices, masalas and dry fruits, with WhatsApp ordering.",
    },
    {
        slug: "eye-hospital", kind: "client", year: 2026, title: "EyeCare Hospital",
        url: "https://eye-hospital-web.vercel.app",
        line: "Eye hospital site: LASIK, cataract and paediatric care, specialists and appointment booking.",
    },
    {
        slug: "luxekey", kind: "client", year: 2026, title: "LuxeKey Living",
        url: "https://luxeliving-web.vercel.app",
        line: "Luxury guest houses and short stays in Ahmedabad: properties, availability and booking.",
    },
    {
        slug: "akshar-travels", kind: "client", year: 2026, title: "Akshar Travels",
        url: "https://travel-july.vercel.app",
        line: "Outstation cab booking across 50+ cities: one-way, round-trip, local and airport fares.",
    },
    {
        slug: "jade-tours", kind: "client", year: 2026, title: "Jade Tours & Travel",
        url: "https://travel-web-april.vercel.app",
        line: "Travel agency for flights, holidays, passports and visas, with a trip enquiry form.",
    },
    {
        slug: "destination-anywhere", kind: "client", year: 2026, title: "Destination Anywhere & Co.",
        url: "https://trevelweb.vercel.app",
        line: "Travel agency in Ahmedabad: international and domestic tour packages.",
    },
    {
        slug: "hvac-prep", kind: "client", year: 2026, title: "HVAC Test Prep",
        url: "https://hvac-web.vercel.app",
        line: "Exam-prep tool for HVAC students: unlimited timed practice exams, flash cards and progress tracking.",
    },
    {
        slug: "elite-cloud-books", kind: "client", year: 2026, title: "Elite Cloud Books",
        url: "https://form-web-g3ka.vercel.app",
        line: "Offshore accounting, tax and fractional-CFO firm serving US businesses.",
    },
    {
        slug: "jjfilms", kind: "client", year: 2026, title: "JJ Films",
        url: "https://jjfilms.vercel.app",
        line: "Photography studio for real estate, events and wedding films.",
    },
    {
        slug: "lightning-kicks", kind: "concept", year: 2026, title: "Lightning Kicks redesign",
        url: "https://lightning-kicks-redesign.vercel.app",
        line: "Concept redesign of a sneaker and streetwear store: faster browsing, cleaner product pages.",
    },
    {
        slug: "northline", kind: "concept", year: 2026, title: "Northline",
        url: "https://dh-web-task.vercel.app",
        line: "Product site for an API observability and on-call tool, built as a design-and-build task.",
    },
    {
        slug: "awwwards", kind: "concept", year: 2025, title: "Awwwards clone", img: "portfolio/projects/awwwards",
        url: "https://github.com/Aman241104/awwards_clone",
        line: "A rebuild of the Awwwards voting platform, for the motion and layout practice.",
    },
    {
        slug: "macbook", kind: "concept", year: 2025, title: "3D MacBook scroll", img: "portfolio/projects/3d-macbook",
        url: "https://github.com/Aman241104/macbook_demo",
        line: "Scroll-driven 3D MacBook product animation in Three.js.",
    },
    {
        slug: "stock-app", kind: "concept", year: 2025, title: "Stock market app", img: "portfolio/projects/stock-market-app",
        url: "https://github.com/Aman241104/stock_app_demo",
        line: "Real-time stock tracking with live charts.",
    },
];
