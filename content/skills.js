// Skills, grouped. Only what the résumé or a shipped project shows (icons: simple-icons names, null = text only).
export const skillGroups = [
    { group: "Languages", note: "Daily drivers first", items: [["TypeScript", "Typescript"], ["JavaScript", "Javascript"], ["Python", "Python"], ["Kotlin", "Kotlin"], ["SQL", null], ["C++", "Cplusplus"], ["Java", "Openjdk"]] },
    { group: "Frontend", note: "Interfaces, motion and 3D", items: [["React", "React"], ["Next.js", "Nextdotjs"], ["Tailwind CSS", "Tailwindcss"], ["GSAP", "Gsap"], ["Framer Motion", "Framer"], ["Three.js / R3F", "Threedotjs"], ["React Query", "Reactquery"], ["Vite", "Vite"]] },
    { group: "Mobile", note: "Native Android and installable web apps", items: [["Android", "Android"], ["Jetpack Compose", "Jetpackcompose"], ["PWA", "Pwa"]] },
    { group: "Backend & APIs", note: "Services, auth and real-time", items: [["Node.js", "Nodedotjs"], ["Express", "Express"], ["FastAPI", "Fastapi"], ["REST APIs", null], ["Server-Sent Events", null], ["NextAuth", null]] },
    { group: "Data", note: "Relational first, isolation by default", items: [["PostgreSQL", "Postgresql"], ["Neon", "Neon"], ["Supabase", "Supabase"], ["Drizzle ORM", "Drizzle"], ["MongoDB", "Mongodb"], ["MySQL", "Mysql"], ["FAISS", null]] },
    { group: "AI", note: "LLM features with failover", items: [["Gemini", "Googlegemini"], ["Claude", "Claude"], ["NVIDIA NIM", "Nvidia"], ["Groq", null], ["RAG", null], ["Tool calling", null]] },
    { group: "Cloud & ops", note: "Ship, host, observe", items: [["Vercel", "Vercel"], ["Google Cloud Run", "Googlecloud"], ["Cloudflare Workers", "Cloudflareworkers"], ["Docker", "Docker"], ["GitHub", "Github"], ["Cloudinary", "Cloudinary"], ["Resend", "Resend"], ["PostHog", "Posthog"], ["n8n", "N8n"]] },
    { group: "Testing", note: "Tests that caught real bugs", items: [["Pytest", "Pytest"], ["Vitest", "Vitest"], ["Jest", "Jest"], ["Playwright", null]] },
];

// flat [group, "a, b, c"] pairs for SEO and the text-only worlds
export const skills = skillGroups.map((g) => [g.group, g.items.map(([n]) => n).join(", ")]);
