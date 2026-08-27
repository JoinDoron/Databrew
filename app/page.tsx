import { Nav, Hero } from "@/components/nav-hero";
import { ConsoleExplorer } from "@/components/console-explorer";
import { Fork, FoundationSection, AgentsSection } from "@/components/layers";
import { Portals, Refusal } from "@/components/portals";
import { Packs, Connectors, Deployments, Timeline } from "@/components/packs-deploy";
import { Trust, CtaBand, Footer } from "@/components/trust-footer";

/**
 * 13Labs — the AIOS landing page.
 *
 * Order follows the flow studied from elevenlabs.io: the product runs above the
 * fold, then the page forks into its two layers, proves each with the real
 * screens, and closes on trust.
 *
 * Portals sit immediately after the agent layer, because "who can actually use
 * this?" is the question a serious buyer asks the moment they understand what
 * the agents do.
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
                <Portals />
                <Refusal />
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
