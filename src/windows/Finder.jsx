import React from 'react'
import { WindowControls } from "#components";
import { Search, Folder, FileText, Link2, Image, FileType } from "lucide-react";

// PX-OS line icons instead of macOS PNGs
const ICON = { txt: FileText, url: Link2, img: Image, pdf: FileType };
const ItemIcon = ({ item, size }) => { const I = item.kind === "folder" ? Folder : ICON[item.fileType] || FileText; return <I size={size} strokeWidth={1.25} aria-hidden />; };
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { locations } from "#constants";
import useLocationStore from "#store/location.js";
import clsx from "clsx";
import useWindowStore from "#store/window.js";

const Finder = () => {

    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

    const openItem = (item) => {
        if (item.fileType === "pdf") return openWindow("resume");

        if(item.kind === "folder") return setActiveLocation(item);

        if(['fig','url'].includes(item.fileType) && item.href) return window.open(item.href, "_blank");

        openWindow(`${item.fileType}${item.kind}`, item);
    };

    const renderList = (items) => items.map((item) => (
            <li
                key={item.id}
                onClick={() => setActiveLocation(item)}
                className={clsx(
                    item.id === activeLocation?.id
                        ? "active"
                        : "not-active"
                )}
            >
                <ItemIcon item={item} size={16} />
                <p className="text-sm font-medium truncate">
                    {item.name}
                </p>
            </li>
        ));

    return (
        <>
            <div id="window-header">
                <WindowControls target="finder" />
                <Search className="icon" />
            </div>

            <div className="bg-white flex h-full">
                <div className="sidebar">
                    <div>
                        <h3>Favorites</h3>
                        <ul>
                            {renderList(Object.values(locations))}
                        </ul>
                    </div>
                    <div>
                        <h3>My Projects</h3>
                        <ul>
                            {renderList(locations.work.children)}
                        </ul>
                    </div>
                </div>

                <ul className="content">
                    {activeLocation?.children.map((item) => (
                        <li key={item.id} className={item.position} onClick={() => openItem(item)}>
                            <ItemIcon item={item} size={52} />
                            <p>{item.name}</p>
                        </li>
                    ))}
                </ul>

            </div>
        </>
    );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
