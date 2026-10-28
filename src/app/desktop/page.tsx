import type { Metadata } from "next";
import DesktopClient from "./DesktopClient";

export const metadata: Metadata = { title: "Desktop OS", description: "The portfolio as a desktop: windows, dock, Finder." };

export default function Page() {
    return <DesktopClient />;
}
