import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Georama, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted, preloaded Latin faces (next/font). The 11 multiverse scripts are tiny `&text=` subsets loaded in <head>.
const geist = Geist({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-geist-mono", display: "swap" });
// the desktop/editorial/terminal worlds' original faces
const georama = Georama({ subsets: ["latin"], weight: ["100", "300", "400", "600", "700", "900"], style: ["normal", "italic"], variable: "--font-georama-nf", display: "swap" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-nf", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
    metadataBase: new URL("https://portfolio-1byaman.vercel.app"),
    title: { default: "Aman Patel — PORTFOLIO.exe", template: "%s — Aman Patel" },
    description: "Creative full-stack developer. A clear-case machine on a floating island decides which of my portfolio worlds you land in.",
    openGraph: { title: "Aman Patel — PORTFOLIO.exe", description: "A machine for alternate realities.", images: ["/poster-intro.jpg"], type: "website" },
    icons: { icon: "/macbook.png" },
};

export const viewport: Viewport = { themeColor: "#0b0b0c" };

// Only the glyphs of "Aman" in each script (≈1–3 KB per font).
const SCRIPT_FONTS = [
    "Rozha+One&text=%E0%A4%85%E0%A4%AE%E0%A4%A8",
    "Baloo+Bhai+2:wght@800&text=%E0%AA%85%E0%AA%AE%E0%AA%A8",
    "Baloo+Paaji+2:wght@800&text=%E0%A8%85%E0%A8%AE%E0%A8%A8",
    "Baloo+Da+2:wght@800&text=%E0%A6%86%E0%A6%AE%E0%A6%A8",
    "Baloo+Thambi+2:wght@800&text=%E0%AE%85%E0%AE%AE%E0%AE%A9%E0%AF%8D",
    "Baloo+Tammudu+2:wght@800&text=%E0%B0%85%E0%B0%AE%E0%B0%A8%E0%B1%8D",
    "Dela+Gothic+One&text=%E3%82%A2%E3%83%9E%E3%83%B3",
    "Black+Han+Sans&text=%EC%95%84%EB%A7%8C",
    "Lalezar&text=%D8%A3%D9%85%D8%A7%D9%86",
    "Russo+One&text=%D0%90%D0%9C%D0%90%D0%9D",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${geist.variable} ${geistMono.variable} ${serif.variable} ${georama.variable} ${robotoMono.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                {SCRIPT_FONTS.map((f) => (
                    // eslint-disable-next-line @next/next/no-page-custom-font
                    <link key={f} rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${f}&display=swap`} />
                ))}
            </head>
            <body>{children}</body>
        </html>
    );
}
