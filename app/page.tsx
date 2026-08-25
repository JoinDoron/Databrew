import { Nav, Hero } from "@/components/nav-hero";
import { ConsoleExplorer } from "@/components/console-explorer";
import { Fork, FoundationSection, AgentsSection } from "@/components/layers";
import { Packs, Connectors, Deployments, Timeline } from "@/components/packs-deploy";
import { Trust, CtaBand, Footer } from "@/components/trust-footer";

/**
 * 13Labs — the AIOS landing page.
 *
 * Section order follows the flow studied from elevenlabs.io: the product runs
 * above the fold, then the page forks into its two layers, proves each with a
 * live miniature, and closes on trust.
 */
export default function Page() {
    return (
        <>
            <a
                href="#main"
                className="pill pill-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
            >
                Skip to content
            </a>

            <Nav />

            <main id="main">
                <Hero />
                <ConsoleExplorer />
                <Fork />
                <FoundationSection />
                <AgentsSection />
                <Packs />
                <Connectors />
                <Deployments />
                <Timeline />
                <Trust />
                <CtaBand />
            </main>

            <Footer />
        </>
    );
}
