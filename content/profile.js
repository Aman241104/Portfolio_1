// Who I am, in one place. Every world reads from here.
export const profile = {
    name: "Aman Patel",
    role: "Creative full-stack developer",
    line: "I build AI products and interfaces that feel like something.",
    // Aman's own picks (2026-11-17), from his brief: "a curious kid… whatever sparks my curiosity I do that".
    identity: "Curious. Builds. Ships.",
    poster: ["Curiosity is", "the whole job."],
    posterNote: "Designer first, then web, then full-stack, now AI and ML. Whatever sparks it, I learn it and ship it.",
    // Real client words only (Aman shared the WhatsApp messages 2026-11-17). Exact wording, original order, trimmed at the
    // ends only; first names only; no phone numbers or other chat details. Never invent or reword a quote.
    quotes: [
        { text: "Made the website live and booked our first video call today!", name: "Harsh", role: "Client", org: "Aangan Boutique, Ahmedabad", date: "Aug 2026" },
        { text: "Thank you so much for your support and efforts. Such a good & very interesting, informative and very wonderful website.", name: "Jay", role: "Client", org: "Amee Patel portfolio website", date: "Oct 2026" },
    ],
    email: "patelaman0241@gmail.com",
    resume: "/files/resume.pdf",
    github: "https://github.com/Aman241104",
    phone: "+91 95580 09550",
    whatsapp: `https://wa.me/919558009550?text=${encodeURIComponent("Hi Aman, I saw your portfolio and would like to talk about a role.")}`,
};

// ponytail: projects/skills/socials still live in constants/index.js (plan Phase 0 moves them here).
export { blogPosts as projects, techStack as skills, socials } from "#constants";
