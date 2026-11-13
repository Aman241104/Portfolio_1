import { useMemo, useState } from "react";
import { WindowControls } from "#components";
import { Search, Folder, FileText, Link2, Image, FileType, LayoutGrid, List, ArrowUpRight } from "lucide-react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { locations } from "#constants";
import useLocationStore from "#store/location.js";
import clsx from "clsx";
import useWindowStore from "#store/window.js";

const ICON = { txt: FileText, url: Link2, img: Image, pdf: FileType };
const ItemIcon = ({ item, size }) => {
    const I = item.kind === "folder" ? Folder : ICON[item.fileType] || FileText;
    return <I size={size} strokeWidth={1.35} aria-hidden />;
};

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();
    const [q, setQ] = useState("");
    const [view, setView] = useState("grid");
    const [selected, setSelected] = useState(null);

    const openItem = (item) => {
        if (item.fileType === "pdf") return openWindow("resume");
        if (item.kind === "folder") { setSelected(null); return setActiveLocation(item); }
        if (["fig", "url"].includes(item.fileType) && item.href) return window.open(item.href, "_blank", "noreferrer");
        openWindow(`${item.fileType}${item.kind}`, item);
    };

    const items = useMemo(() => {
        const raw = activeLocation?.children || [];
        const query = q.trim().toLowerCase();
        if (!query) return raw;
        return raw.filter((it) => `${it.name} ${it.meta || ""} ${it.subtitle || ""}`.toLowerCase().includes(query));
    }, [activeLocation, q]);

    const preview = useMemo(() => {
        if (!selected) return null;
        if (selected.kind === "folder") {
            const img = selected.children?.find((c) => c.imageUrl)?.imageUrl;
            const txt = selected.children?.find((c) => c.description)?.description?.[0];
            const url = selected.children?.find((c) => c.href)?.href;
            return { title: selected.name, sub: `${selected.children?.length || 0} items`, img, txt, url };
        }
        return {
            title: selected.name,
            sub: selected.meta || selected.subtitle || selected.fileType?.toUpperCase() || "File",
            img: selected.imageUrl || selected.image,
            txt: Array.isArray(selected.description) ? selected.description[0] : null,
            url: selected.href,
        };
    }, [selected]);

    const renderList = (list) => list.map((item) => (
        <li key={item.id} onClick={() => { setSelected(null); setActiveLocation(item); }}
            className={clsx(item.id === activeLocation?.id ? "active" : "not-active")}>
            <ItemIcon item={item} size={15} />
            <p className="text-sm font-medium truncate">{item.name}</p>
        </li>
    ));

    return (
        <>
            <div id="window-header" className="px-finder-head">
                <WindowControls target="finder" />
                <div className="px-finder-crumb">
                    <button type="button" onClick={() => { setSelected(null); setActiveLocation(locations.work); }}>PX-OS</button>
                    <span>/</span>
                    <b>{activeLocation?.name || "Work"}</b>
                </div>
                <div className="px-finder-tools">
                    <label className="px-finder-search">
                        <Search size={13} aria-hidden />
                        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" aria-label="Filter items" />
                    </label>
                    <button type="button" className={view === "grid" ? "is-on" : ""} onClick={() => setView("grid")} aria-label="Grid view"><LayoutGrid size={14} /></button>
                    <button type="button" className={view === "list" ? "is-on" : ""} onClick={() => setView("list")} aria-label="List view"><List size={14} /></button>
                </div>
            </div>

            <div className="bg-white flex h-full min-h-0">
                <div className="sidebar">
                    <div>
                        <h3>Favorites</h3>
                        <ul>{renderList(Object.values(locations))}</ul>
                    </div>
                    <div>
                        <h3>My Projects</h3>
                        <ul>{renderList(locations.work.children)}</ul>
                    </div>
                </div>

                <ul className={`content px-finder-content is-${view}`}>
                    {items.length === 0 && <li className="px-finder-empty">No matching files.</li>}
                    {items.map((item) => (
                        <li key={item.id}
                            data-selected={selected?.id === item.id || undefined}
                            onClick={() => setSelected(item)}
                            onDoubleClick={() => openItem(item)}>
                            <ItemIcon item={item} size={view === "grid" ? 42 : 18} />
                            <div className="px-finder-meta">
                                <p>{item.name}</p>
                                {item.meta && <small>{item.meta}</small>}
                            </div>
                        </li>
                    ))}
                </ul>

                {preview && (
                    <aside className="px-inspector" aria-label="Quick Look">
                        {preview.img && <img src={preview.img} alt="" />}
                        <small>{preview.sub}</small>
                        <h4>{preview.title}</h4>
                        {preview.txt && <p>{preview.txt}</p>}
                        <button type="button" onClick={() => openItem(selected)}>
                            {selected.kind === "folder" ? "Open folder" : preview.url ? <>Open link <ArrowUpRight size={13} /></> : "Open file"}
                        </button>
                    </aside>
                )}
            </div>
        </>
    );
};

const FinderWindow = WindowWrapper(Finder, "finder");
export default FinderWindow;
