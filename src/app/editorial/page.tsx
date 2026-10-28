import type { Metadata } from "next";
import WorldShell from "@shell/WorldShell";
import EditorialWorld from "@worlds/editorial/index.jsx";

export const metadata: Metadata = { title: "Work", description: "Selected work, toolkit and contact. The recruiter view." };

// Server-rendered: the recruiter view is real HTML for search engines and slow connections.
export default function Page() {
    return <WorldShell id="editorial"><EditorialWorld /></WorldShell>;
}
