import type { Metadata } from "next";
import { Nav } from "@/components/nav-hero";
import { ConsoleExplorer } from "@/components/console-explorer";
import { Fork, FoundationSection, AgentsSection } from "@/components/layers";
import { Portals, Refusal } from "@/components/portals";
import { Packs, Connectors, Deployments } from "@/components/packs-deploy";
import { Trust } from "@/components/trust-footer";
import { BrandFooter, PilotPlanner } from "@/components/home-sections";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Explore AIOS | Databrew", description: "Explore the AIOS workspace, agent activity, industry configurations and six role-based portals." };

export default async function Platform({ searchParams }: { searchParams: Promise<{ pack?: string }> }) {
    const { pack } = await searchParams;
    const workspaceUrl = process.env.NEXT_PUBLIC_AIOS_URL;
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main"><section className="platform-intro brand-shell" id="top"><p className="brand-kicker">Meet your AI operating system</p><h1>The intelligence<br /><span>inside your organisation.</span></h1><p>Explore the workspace. Switch industries. See how knowledge, agents and people work together.</p><div className="hero-actions"><a className="brand-button" href="#console">Explore the demo <ArrowDown size={18} /></a>{workspaceUrl && <a href={workspaceUrl} className="text-link">Open AIOS workspace <ArrowUpRight size={17} /></a>}</div><p className="platform-demo-note">Animated product illustrations with fictional records. No live systems are connected; deployment and integration requirements vary.</p></section><ConsoleExplorer initialPack={pack} /><Fork /><FoundationSection /><AgentsSection /><Portals /><Refusal /><Packs /><Connectors /><Deployments /><Trust /><PilotPlanner /></main><BrandFooter /></>;
}
