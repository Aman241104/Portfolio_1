import React from 'react'
import { WindowControls } from "#components";
import { Mail, Search } from "lucide-react";
import useWindowStore from "#store/window.js";
import { photosLinks, gallery } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper.jsx";

const Photos = () => {
    const { openWindow } = useWindowStore();

    return (
        <div className="flex flex-col h-full w-full bg-white">
            {/* Header */}
            <div id="window-header" className="flex-shrink-0">
                <WindowControls target="photos" />
                <div className="w-full flex justify-end items-center gap-3 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <Search className="w-4 h-4" />
                </div>
            </div>

            {/* Main Content Area - Forces layout to stay inside window */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar - Fixed width */}
                <div className="w-48 flex-shrink-0 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    <h2 className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Photos
                    </h2>
                    <ul className="space-y-1">
                        {photosLinks.map(({ id, icon, title }) => (
                            <li key={id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 cursor-pointer transition-colors">
                                <img src={icon} alt={title} className="w-4 h-4 opacity-70" />
                                <span className="text-sm text-gray-700">{title}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gallery Grid - Scrollable area */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                    <ul className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {gallery.map(({ id, img }) => (
                            <li
                                key={id}
                                className="relative cursor-pointer group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                onClick={() =>
                                    openWindow("imgfile", {
                                        id,
                                        name: "Gallery image",
                                        icon: "/images/image.png",
                                        kind: "file",
                                        fileType: "img",
                                        imageUrl: img,
                                    })
                                }
                                // INLINE STYLES TO FORCE SIZE (Nuclear fix)
                                style={{ height: '120px' }}
                            >
                                <img
                                    src={img}
                                    alt={`Gallery ${id}`}
                                    // FORCE OBJECT FIT
                                    className="w-full h-full object-cover block"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const PhotosWindow = WindowWrapper(Photos, "photos");
export default PhotosWindow;