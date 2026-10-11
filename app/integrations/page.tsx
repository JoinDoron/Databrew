import type { Metadata } from "next";
import Link from "next/link";
import { IntegrationLogo } from "@/components/integration-logo";
import { ArrowDown, ArrowRight, ArrowUpRight, LockKeyhole, Network } from "lucide-react";
import { AnimatedDemo } from "@/components/animated-demo";
import { FEATURE_DEMOS } from "@/lib/demo-scenarios";
import { Nav } from "@/components/nav-hero";
import { BrandFooter, PilotPlanner } from "@/components/home-sections";
import { IntegrationDirectory } from "@/components/integration-directory";
import { INTEGRATIONS } from "@/lib/integrations";
import { DEPARTMENTS, INDUSTRIES } from "@/lib/solutions";
import "./integrations.css";

export const metadata: Metadata = { title: "Integrations | Databrew", description: "Explore researched integration recommendations across 20 industries: Microsoft 365, Google Workspace, SAP, Salesforce, Paystack, telecom systems and Hirebrew. Clear readiness and implementation details." };

export default function IntegrationsPage() {
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main">
        <section className="brand-shell connect-hero" id="top"><div className="connect-hero-copy"><p className="eyebrow">THE DATABREW ECOSYSTEM</p><h1>Your tools.<br /><span>A shared intelligence.</span></h1><p>The context is already in your business. Bring it together. Explore integration starting points for the systems your people work with every day.</p><div className="connect-hero-actions"><a href="#directory" className="brand-button">Find your integrations <ArrowDown size={16} /></a><a href="#contact" className="text-link">Plan your connection <ArrowUpRight size={16} /></a></div></div><div className="connect-hero-panel"><div className="connect-panel-caption"><Network size={16} /><span>FAMILIAR SYSTEMS. NEW POSSIBILITIES.</span></div><div className="connect-featured">{INTEGRATIONS.filter(item => item.featured).map(item => <a href={`#${item.id}`} key={item.id}><IntegrationLogo id={item.id} /><span>{item.name}</span></a>)}</div><p>Search. Prepare. Review.<span>One context layer, scoped to your people.</span></p></div></section>
        <div className="brand-shell connect-coverage"><span><strong>{INTEGRATIONS.length}</strong> systems & integration targets</span><span><strong>{INDUSTRIES.length}</strong> industry starting points</span><span><strong>{DEPARTMENTS.length}</strong> department pathways</span><span><LockKeyhole size={15} />Permissions first. Always.</span></div>
        <div className="brand-shell"><div className="connect-disclosure"><LockKeyhole size={17} /><p><strong>A clear view of what comes next.</strong> Connector foundations need configuration and acceptance testing. Recommended targets need adapter implementation. Discovery targets need an agreed API contract. Listings are not live connections or vendor partnerships.</p></div><IntegrationDirectory />
            <section className="connect-experience"><div className="enterprise-heading"><div><p className="eyebrow">FROM SOURCE TO USEFUL CONTEXT</p><h2>Connect the knowledge.<br /><span>Keep the boundaries.</span></h2></div><p>A conceptual walkthrough of source selection and access checks. Your pilot proves the connection in your environment.</p></div><AnimatedDemo scenario={FEATURE_DEMOS.connectors} /><Link href="/platform#integrations" className="text-link">Explore the connector workspace <ArrowUpRight size={16} /></Link></section>
            <div className="custom-integration connect-custom"><div><p className="eyebrow">YOUR STACK DOESN’T STOP HERE</p><h2>Something more specialised?</h2><p>Legacy platforms, ministry registries and sector-specific systems deserve an explicit plan. Start with the source owner, the API and the access boundary.</p></div><Link href="/#contact" className="brand-button">Scope your integration <ArrowRight size={17} /></Link></div>
        </div><PilotPlanner />
    </main><BrandFooter /></>;
}
