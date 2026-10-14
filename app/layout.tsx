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
    title: "Databrew | Knowledge, AI and teamwork, connected",
    description:
        "Connect knowledge and AI with Databrew Spaces. Write shared pages, organise projects and manage tasks, with sources, reviews and people in the loop. A Brewling company.",
    icons: { icon: "/brand/mark.svg" },
    applicationName: "Databrew",
    publisher: "Brewling",
    openGraph: { title: "Databrew | Knowledge, AI and teamwork, connected", description: "Your knowledge. Your people. One step ahead. Explore Databrew Spaces, AI agents, projects and tasks — from a Brewling company." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" data-scroll-behavior="smooth" className={databrew.variable}>
            <body>{children}</body>
        </html>
    );
}
