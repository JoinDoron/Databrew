import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./enterprise.css";
import "./solutions.css";
import "./demos.css";

const databrew = localFont({
    src: "../public/fonts/FamiljenGrotesk-Variable.ttf",
    variable: "--font-databrew",
    weight: "400 700",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Databrew | Enterprise AI, built around your knowledge",
    description:
        "Connect organisational knowledge, find sourced answers and put AI agents to work. Explore AIOS, integrations and deployment options from Databrew, a Brewling company.",
    icons: { icon: "/brand/mark.svg" },
    applicationName: "Databrew",
    publisher: "Brewling",
    openGraph: { title: "Databrew | Enterprise AI, built around your knowledge", description: "Your knowledge. Your people. One step ahead. Meet AIOS, from Databrew — a Brewling company." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" data-scroll-behavior="smooth" className={databrew.variable}>
            <body>{children}</body>
        </html>
    );
}
