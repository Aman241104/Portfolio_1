import { useMemo, useState } from "react";
import { WindowControls } from "#components";
import { Search, ShieldHalf, MoveRight } from "lucide-react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { blogPosts } from "#constants";
import { KINDS } from "../../content/work.js";

const FILTERS = { all: "All (26)", ...KINDS };

const Safari = () => {
    const [q, setQ] = useState("");
    const [kind, setKind] = useState("all");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return blogPosts.filter((p) => {
            const matchKind = kind === "all" || p.kind === KINDS[kind];
            const matchQ = !query || `${p.title} ${p.description} ${p.kind}`.toLowerCase().includes(query);
            return matchKind && matchQ;
        });
    }, [q, kind]);

    return (
        <>
            <div id="window-header" className="px-repo-head">
                <WindowControls target="safari" />
                <div className="px-repo-bar">
                    <ShieldHalf size={14} aria-hidden />
                    <div className="search px-repo-search">
                        <Search size={13} aria-hidden />
                        <input
                            type="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search 26 shipped projects, stack, or keywords…"
                            aria-label="Search shipped projects"
                        />
                    </div>
                </div>
                <span className="px-repo-count">{filtered.length}/{blogPosts.length}</span>
            </div>

            <div className="blog px-repo-body">
                <div className="px-repo-top">
                    <h2>Everything I&apos;ve shipped</h2>
                    <div className="px-repo-tabs" role="tablist" aria-label="Project categories">
                        {Object.entries(FILTERS).map(([k, label]) => (
                            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>{label}</button>
                        ))}
                    </div>
                </div>

                <div className="px-repo-list">
                    {filtered.map(({ id, title, image, date, link, kind: postKind, description }) => (
                        <article key={id} className="blog-post px-repo-card">
                            <div className="px-repo-thumb">
                                <img src={image} alt={title} loading="lazy" />
                            </div>
                            <div className="content">
                                <p className="px-repo-meta">{postKind} · {date}</p>
                                <h3>{title}</h3>
                                <p>{description}</p>
                                {link !== "#" && (
                                    <a href={link} target="_blank" rel="noreferrer">
                                        {link.includes("github.com") ? "View code on GitHub" : `Visit ${link.replace(/^https?:\/\/(www\.)?/, "")}`}
                                        <MoveRight size={14} aria-hidden />
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
};

const SafariWindow = WindowWrapper(Safari, "safari");
export default SafariWindow;
