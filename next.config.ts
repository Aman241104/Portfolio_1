import type { NextConfig } from "next";

// old shared links (/?style=editorial, /?style=classic) → the world's route
const LEGACY_STYLES: Record<string, string> = { desktop: "desktop", editorial: "editorial", terminal: "terminal", classic: "editorial" };

const nextConfig: NextConfig = {
    devIndicators: false,
    async redirects() {
        return Object.entries(LEGACY_STYLES).map(([style, id]) => ({
            source: "/", has: [{ type: "query" as const, key: "style", value: style }], destination: `/${id}`, permanent: false,
        }));
    },
    // keeps the live contact form working whether Vercel has the old VITE_ name or the new NEXT_PUBLIC_ name
    env: {
        NEXT_PUBLIC_FORMSPREE_FORM_ID: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? process.env.VITE_FORMSPREE_FORM_ID ?? "",
    },
};

export default nextConfig;
