// Who I am, in one place. Every world reads from here.
export const profile = {
    name: "Aman Patel",
    role: "Creative full-stack developer",
    line: "I build AI products and interfaces that feel like something.",
    email: "patelaman0241@gmail.com",
    resume: "/files/resume.pdf",
    github: "https://github.com/Aman241104",
    phone: "+91 95580 09550",
    whatsapp: `https://wa.me/919558009550?text=${encodeURIComponent("Hi Aman, I saw your portfolio and would like to talk about a role.")}`,
};

// ponytail: projects/skills/socials still live in constants/index.js (plan Phase 0 moves them here).
export { blogPosts as projects, techStack as skills, socials } from "#constants";
