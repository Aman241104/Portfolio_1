import type { Metadata } from "next";
import WorldShell from "@shell/WorldShell";
import TerminalWorld from "@worlds/terminal/index.jsx";

export const metadata: Metadata = { title: "Terminal", description: "The portfolio as a shell. Type `help`." };

export default function Page() {
    return <WorldShell id="terminal"><TerminalWorld /></WorldShell>;
}
