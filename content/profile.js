// Who I am, in one place. Every world reads from here.
export const profile = {
    name: "Aman Patel",
    role: "Creative full-stack developer",
    line: "I build AI products and interfaces that feel like something.",
    // DRAFTS by Claude (2026-11-17) from Aman's real record — replace with his own words:
    identity: "Builds. Ships. Maintains.",                      // three-word identity (aanandmadhav ref) — 11 live sites he still maintains
    poster: ["I ship it,", "then I stay."],                     // the one poster statement in the printout
    posterNote: "Eleven sites I built are still live and still mine to fix.",
    // Real client words only (Aman shared the WhatsApp message 2026-11-17). Exact wording, original order, trimmed at the end;
    // first name only, no phone numbers or other chat details. Never invent or reword a quote.
    quote: { text: "Thank you so much for your support and efforts. Such a good & very interesting, informative and very wonderful website.",
        name: "Jay", role: "Client", org: "Amee Patel portfolio website", date: "Oct 2026" },
    email: "patelaman0241@gmail.com",
    resume: "/files/resume.pdf",
    github: "https://github.com/Aman241104",
    phone: "+91 95580 09550",
    whatsapp: `https://wa.me/919558009550?text=${encodeURIComponent("Hi Aman, I saw your portfolio and would like to talk about a role.")}`,
};

// ponytail: projects/skills/socials still live in constants/index.js (plan Phase 0 moves them here).
export { blogPosts as projects, techStack as skills, socials } from "#constants";
