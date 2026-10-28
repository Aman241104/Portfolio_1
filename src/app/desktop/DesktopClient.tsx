"use client";

import dynamic from "next/dynamic";
import WorldShell from "@shell/WorldShell";

// The desktop world reads the window size and drives GSAP Draggable on mount: client-only.
const DesktopWorld = dynamic(() => import("@worlds/desktop/index.jsx"), { ssr: false });

export default function DesktopClient() {
    return <WorldShell id="desktop"><DesktopWorld /></WorldShell>;
}
