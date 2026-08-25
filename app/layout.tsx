import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
    title: "13Labs — AIOS, the AI operating system for institutions",
    description:
        "AIOS makes everything your organisation knows findable and citable, then puts intelligent agents to work on top of it. Install a vertical pack and deploy in your cloud, on your hardware, or fully air-gapped.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={inter.variable}>
            <body>{children}</body>
        </html>
    );
}
