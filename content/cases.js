// Case studies. Facts only from the résumé and the projects' own notes; no invented metrics.
export const cases = {
    "job-search-os": {
        title: "Job Search OS",
        tagline: "An AI job-search platform I built for my own search, then made multi-user.",
        facts: [["Role", "Solo: design, backend, frontend, infra"], ["Year", "2026"], ["Stack", "Python · FastAPI · Next.js · Postgres (Supabase) · Google Cloud Run"], ["Links", "Live app · GitHub"]],
        links: [["Live demo, no sign-in", "https://job-search-zeta-ten.vercel.app/demo"], ["Full app (sign-in)", "https://job-search-zeta-ten.vercel.app"], ["GitHub", "https://github.com/Aman241104/job-search"]],
        sections: [
            ["The problem", ["Job hunting as a fresher means checking many boards every day, filtering out listings that quietly want years of experience, and rewriting a CV and cover letter for each application.", "I wanted one place that finds the jobs, ranks them honestly against my real experience, and prepares the application, so my time goes into interviews instead of tabs."]],
            ["What it does", ["Scrapes 19 job sources concurrently and scores every listing on skills, the experience it really requires, and salary.", "Re-checks top listings daily so closed or stale jobs drop out.", "Writes a tailored one-page CV and cover letter per job, plus copy-ready application answers and interview prep packs.", "Shows live progress in the dashboard over Server-Sent Events while a run is working."]],
            ["How it's built", ["FastAPI service on Google Cloud Run does the scraping, scoring and document generation; a Next.js dashboard is the front end.", "Postgres on Supabase stores jobs and applications with per-user isolation, so each user only ever sees their own data.", "Scoring runs in two LLM stages: a cheap first pass filters, a second pass scores the survivors in detail."]],
            ["Decisions that mattered", ["LLM provider failover: calls move between NVIDIA NIM and Gemini, so one provider's outage or rate limit doesn't stop a run.", "Validation before rendering: every generated CV and cover letter is checked against the real résumé before it's shown, so the model can't invent experience.", "Streaming over polling: Server-Sent Events keep the dashboard live without hammering the API."]],
            ["What broke, and the fix", ["Test coverage with pytest exposed a cross-tenant leak: one user's personal data could reach another's results. I traced it to the data-access layer, fixed the scoping, and kept the test as a guard.", "API calls that took tens of seconds now return in under a second."]],
            ["What I'd do next", ["More sources behind the same scoring contract, and interview outcomes fed back into the ranking."]],
        ],
    },
    "whatsapp-ai": {
        title: "Pulse AI: WhatsApp agent SaaS",
        tagline: "Multi-tenant SaaS where every business runs its own LLM agent on its WhatsApp number.",
        facts: [["Role", "Solo: product, backend, dashboard"], ["Year", "2026"], ["Stack", "Next.js · Supabase (Postgres + RLS) · Groq · Meta WhatsApp Cloud API"], ["Links", "Live app"]],
        links: [["Live demo, no sign-in", "https://whatsapp-ai-agent-inky.vercel.app/demo"], ["Full app (sign-in)", "https://whatsapp-ai-agent-inky.vercel.app"]],
        sections: [
            ["The problem", ["Small businesses answer the same WhatsApp questions all day, and bookings get lost in chat threads.", "The goal: let each business plug an AI agent into its own WhatsApp Business number and manage it from one dashboard."]],
            ["What it does", ["An admin dashboard where each business workspace configures its LLM-powered agent.", "The agent handles real conversations through the WhatsApp Business Cloud API.", "A booking state machine turns chat into confirmed appointments, and a drip-sequence engine follows up automatically.", "Broadcasts and support automation from the same place."]],
            ["How it's built", ["Next.js app with Supabase Postgres; every tenant's data is separated with Postgres row-level security (RLS), enforced in the database rather than in app code.", "LLM inference on Groq for fast replies inside a chat."]],
            ["Decisions that mattered", ["Isolation in the database: RLS policies mean a bug in an API route still can't read another tenant's rows.", "Explicit states for bookings instead of free-form parsing, so a conversation can't end in an ambiguous half-booking."]],
            ["What broke, and the fix", ["Integration tests run against the live database caught an RLS misconfiguration that would have let data cross tenants. Fixed the policy, and the test stays in the suite."]],
        ],
    },
};
