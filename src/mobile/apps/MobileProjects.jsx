import { useState } from "react";
import { ChevronRight, ChevronLeft, Github, ExternalLink } from "lucide-react";
import { locations } from "#constants";

const projects = locations.work.children;

const ProjectDetail = ({ project, onBack }) => {
    const about = project.children.find((c) => c.name === "About Project.txt");
    const links = project.children.filter((c) => c.fileType === "url");

    return (
        <div className="p-5">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 text-blue-300 text-sm mb-4"
            >
                <ChevronLeft size={16} /> Projects
            </button>

            <h2 className="text-white text-xl font-semibold mb-3">{project.name}</h2>

            {about && (
                <div className="space-y-2 mb-5">
                    {about.description.map((line, i) => (
                        <p key={i} className="text-white/80 text-sm leading-relaxed">
                            {line}
                        </p>
                    ))}
                </div>
            )}

            <div className="space-y-2">
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 text-white text-sm"
                    >
                        <span className="flex items-center gap-2">
                            {link.name === "GitHub Repo" ? <Github size={16} /> : <ExternalLink size={16} />}
                            {link.name}
                        </span>
                        <ChevronRight size={16} className="text-white/40" />
                    </a>
                ))}
            </div>
        </div>
    );
};

const MobileProjects = () => {
    const [selected, setSelected] = useState(null);

    if (selected) {
        return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;
    }

    return (
        <div className="p-5">
            <h2 className="text-white text-xl font-semibold mb-4">Projects</h2>
            <div className="space-y-2">
                {projects.map((project) => (
                    <button
                        key={project.id}
                        type="button"
                        onClick={() => setSelected(project)}
                        className="w-full flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 text-left"
                    >
                        <span className="flex items-center gap-3">
                            <img src="/images/folder.png" alt="" className="size-6" />
                            <span className="text-white text-sm font-medium">{project.name}</span>
                        </span>
                        <ChevronRight size={16} className="text-white/40" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileProjects;
