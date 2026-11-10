import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile, projects, skills, socials } from "#content/profile.js";
import { onRepeat, watching } from "#content/taste.js";
import { work } from "../../../content/work.js";
import { experience } from "../../../content/experience.js";

const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// World 2: the recruiter view. Klein blue on white, big type, everything one scroll away.
const Section = ({ n, title, children }) => (
    <section className="ed-reveal grid md:grid-cols-[180px_1fr] gap-4 md:gap-10 py-14 border-t border-black/15">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[#1d4ed8]">{n} — {title}</h2>
        <div>{children}</div>
    </section>
);

const EditorialWorld = () => {
    const root = useRef(null);

    useGSAP(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        gsap.from(".ed-hero > *", { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power4.out" });
    }, { scope: root });

    return (
        <div ref={root} className="min-h-dvh bg-[#f6f5f1] text-neutral-950 font-georama">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-28">
                <header className="ed-hero pt-20 sm:pt-28 pb-16">
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">{profile.role}</p>
                    <h1 className="mt-4 text-[18vw] md:text-[11rem] leading-[0.85] font-black tracking-tighter">
                        Aman<br /><span className="text-[#1d4ed8] italic">Patel.</span>
                    </h1>
                    <p className="mt-8 max-w-xl text-xl sm:text-2xl leading-snug">{profile.line}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href={`mailto:${profile.email}`} className="px-5 py-3 rounded-full bg-[#1d4ed8] text-white font-semibold hover:bg-[#1e40af]">Email me</a>
                        <a href={profile.resume} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-black/30 hover:bg-black hover:text-white">Résumé (PDF)</a>
                    </div>
                    <p className="mt-4 text-sm text-neutral-500">Tailored résumé: {[["fullstack", "Full-stack"], ["frontend", "Frontend"], ["ai", "AI products"]].map(([k, l], i) => (
                        <span key={k}>{i ? " · " : ""}<a href={`/resume.html?for=${k}`} className="underline underline-offset-4 hover:text-[#1d4ed8]">{l}</a></span>
                    ))}</p>
                </header>

                <Section n="01" title="Selected work">
                    <ol className="divide-y divide-black/10">
                        {projects.map((p, i) => (
                            <li key={p.id}>
                                <a href={p.link} target="_blank" rel="noreferrer"
                                    className="group grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr_220px] gap-4 items-center py-6">
                                    <span className="text-sm text-neutral-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                    <span>
                                        <span className="block text-2xl sm:text-4xl font-bold tracking-tight group-hover:text-[#1d4ed8] transition-colors">{p.title}</span>
                                        <span className="block mt-1 text-neutral-600 max-w-xl">{p.description}</span>
                                        <span className="block mt-1 text-xs uppercase tracking-widest text-neutral-400">{p.kind} · {p.date}{work[i]?.live && <span className="ml-2 text-emerald-700 normal-case tracking-normal">● live at {host(work[i].url)}</span>}</span>
                                    </span>
                                    <img src={p.image} alt="" loading="lazy"
                                        className="max-sm:hidden w-full aspect-[4/3] object-cover rounded-lg grayscale group-hover:grayscale-0 transition" />
                                </a>
                            </li>
                        ))}
                    </ol>
                </Section>

                <Section n="02" title="Experience">
                    <ol className="space-y-8">
                        {experience.map((x) => (
                            <li key={x.role} className="grid sm:grid-cols-[160px_1fr] gap-2 sm:gap-6">
                                <span className="text-sm uppercase tracking-widest text-neutral-400 pt-1">{x.when}</span>
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight">{x.role} <span className="font-normal text-neutral-500">· {x.org}</span></h3>
                                    <ul className="mt-3 space-y-1 text-neutral-700 list-disc pl-5 marker:text-[#1d4ed8]">{x.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Section>

                <Section n="03" title="Live & maintained">
                    <p className="text-neutral-600 mb-4">In production today; I still ship fixes, content and features on them.</p>
                    <ul className="grid sm:grid-cols-2 gap-x-10">
                        {work.filter((w) => w.maintained).map((w) => (
                            <li key={w.slug} className="border-b border-black/10">
                                <a href={w.url} target="_blank" rel="noreferrer" className="flex justify-between gap-4 py-3 hover:text-[#1d4ed8]">
                                    <span className="font-semibold">{w.title}</span><span className="text-sm text-neutral-500">{host(w.url)} ↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section n="04" title="Toolkit">
                    <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                        {skills.map((s) => (
                            <div key={s.category}>
                                <dt className="font-semibold">{s.category}</dt>
                                <dd className="text-neutral-600">{s.items.join(", ")}</dd>
                            </div>
                        ))}
                    </dl>
                </Section>

                <Section n="05" title="Off the clock">
                    <p className="text-2xl sm:text-3xl leading-snug max-w-3xl">
                        On repeat: {onRepeat.slice(0, 5).map((t) => `${t.artist}`).join(", ")}.
                        Rewatching {watching.sitcoms.slice(0, 3).join(", ")}.
                        Forever thinking about <em>{watching.films[1]}</em>. Bikes, racing, 3D and a lot of video editing.
                    </p>
                </Section>

                <Section n="06" title="Contact">
                    <a href={`mailto:${profile.email}`} className="text-3xl sm:text-5xl font-bold tracking-tight underline decoration-[#1d4ed8] underline-offset-8 break-all">
                        {profile.email}
                    </a>
                    <ul className="mt-6 flex flex-wrap gap-4 text-sm">
                        {socials.map((s) => (
                            <li key={s.id}><a href={s.link} target="_blank" rel="noreferrer" className="hover:text-[#1d4ed8]">{s.text} ↗</a></li>
                        ))}
                    </ul>
                </Section>
            </div>
        </div>
    );
};

export default EditorialWorld;
