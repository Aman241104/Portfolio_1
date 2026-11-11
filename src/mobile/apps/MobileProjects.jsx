import { useState } from "react";
import { ChevronLeft, Github, ExternalLink, BookOpen } from "lucide-react";
import { work, KINDS, shot } from "../../../content/work.js";
import { cases } from "../../../content/cases.js";

// Phone "Projects" app: every project as a screenshot card, filter chips by kind, detail with live/code/case links.
const host = (u = "") => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const Detail = ({ w, onBack }) => (
    <div className="pb-28">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-blue-300 text-sm px-5 pt-5 pb-3"><ChevronLeft size={16} /> Projects</button>
        <img src={shot(w, 900)} alt={`${w.title} screenshot`} className="w-full aspect-[16/10] object-cover object-top" />
        <div className="p-5">
            <p className="text-white/50 text-[11px] uppercase tracking-widest">{KINDS[w.kind]} · {w.year}{w.live ? " · live" : ""}</p>
            <h2 className="text-white text-2xl font-semibold mt-1 mb-3 leading-tight">{w.title}</h2>
            <p className="text-white/80 text-[15px] leading-relaxed">{w.line}</p>
            {w.stack && <p className="text-white/50 text-xs mt-3">{w.stack}</p>}
            {w.note && <p className="text-amber-300/90 text-xs mt-2">{w.note}</p>}
            <div className="space-y-2 mt-5">
                {cases[w.slug] && <a href={`/case.html?p=${w.slug}`} className="flex items-center gap-2 bg-white text-black rounded-xl px-4 py-3 text-sm font-semibold active:scale-[.98] transition"><BookOpen size={16} /> Read the case study</a>}
                {w.url && <a href={w.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 text-white text-sm active:bg-white/20">
                    {w.url.includes("github.com") ? <Github size={16} /> : <ExternalLink size={16} />} {w.url.includes("github.com") ? "View the code" : `Open ${host(w.url)}`}</a>}
                {w.repo && w.repo !== w.url && <a href={w.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 text-white text-sm active:bg-white/20"><Github size={16} /> View the code</a>}
            </div>
        </div>
    </div>
);

const MobileProjects = () => {
    const [selected, setSelected] = useState(null);
    const [kind, setKind] = useState("all");
    if (selected) return <Detail w={selected} onBack={() => setSelected(null)} />;
    const list = work.filter((w) => kind === "all" || w.kind === kind);

    return (
        <div className="p-4 pb-28">
            <h2 className="text-white text-2xl font-semibold px-1 mb-3">Projects <span className="text-white/40 text-base">{work.length}</span></h2>
            <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
                {Object.entries({ all: "All", ...KINDS }).map(([k, l]) => (
                    <button key={k} type="button" onClick={() => setKind(k)}
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${kind === k ? "bg-white text-black" : "bg-white/10 text-white"}`}>{l}</button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
                {list.map((w) => (
                    <button key={w.slug} type="button" onClick={() => setSelected(w)} className="text-left rounded-2xl overflow-hidden bg-white/10 active:scale-[.97] transition">
                        <img src={shot(w, 420)} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover object-top" />
                        <div className="p-2.5">
                            <p className="text-white text-[13px] font-semibold leading-tight line-clamp-2">{w.title}</p>
                            <p className="text-white/50 text-[10px] mt-1 uppercase tracking-wider">{w.live ? "● live" : KINDS[w.kind].replace(/s$/, "")}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileProjects;
