import { useState } from "react";
import { locations } from "#constants";
import { work } from "../content/work.js";
import { certifications } from "../content/certifications.js";
import { profile, socials } from "../content/profile.js";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";
import { Folder, FileText, Copy, Check, ArrowUpRight, Award, Search } from "lucide-react";

const projects = locations.work?.children ?? [];
const linkedin = socials.find((s) => s.text === "LinkedIn")?.link;

const Home = ({ onSpotlight }) => {
    const { setActiveLocation } = useLocationStore();
    const { openWindow } = useWindowStore();
    const [copied, setCopied] = useState(false);

    const handleOpenProjectFinder = (project) => {
        setActiveLocation(project);
        openWindow("finder");
    };

    const copyEmail = () => {
        navigator.clipboard?.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

    useGSAP(() => {
        Draggable.create(".folder");
    }, []);

    return (
        <section id="home">
            <ul>
                {projects.map((project, i) => (
                    <li key={project.id ?? project.name ?? i} style={{ "--i": i }} className={clsx("group folder px-folder", project.windowPosition)}>
                        <button type="button" onDoubleClick={() => handleOpenProjectFinder(project)} onClick={() => handleOpenProjectFinder(project)} aria-label={`Open ${project.name}`}>
                            <Folder strokeWidth={1.25} aria-hidden />
                            <b>{project.children.length}</b>
                            <p>{project.name}</p>
                        </button>
                    </li>
                ))}
            </ul>
            <p className="px-note" aria-hidden>← start here</p>

            <aside className="px-dossier" aria-label="Recruiter Dossier">
                <div className="px-dos-head">
                    <span>DOSSIER · LDCE &apos;26 (8.67)</span>
                    <b>{work.length} SHIPPED</b>
                </div>
                <div className="px-dos-actions">
                    <button type="button" className="px-dos-primary" onClick={() => openWindow("resume")}><FileText size={13} /> Résumé</button>
                    <button type="button" onClick={copyEmail}>{copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Email</>}</button>
                    <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a>
                    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={12} /></a>}
                </div>
                <div className="px-dos-certs">
                    <p><Award size={12} aria-hidden /> Verified AI Credentials ({certifications.length})</p>
                    <ul>
                        {certifications.map((c, idx) => (
                            <li key={c.id || c.title || idx}>
                                <a href={c.url} target="_blank" rel="noreferrer" title={c.title}>
                                    <b>{c.issuer}</b>
                                    <span>{c.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="button" className="px-dos-spot" onClick={onSpotlight}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Search size={12} aria-hidden /> Quick-find anything</span>
                    <kbd>⌘K</kbd>
                </button>
            </aside>
        </section>
    );
};
export default Home;
