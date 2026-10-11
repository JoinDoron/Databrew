import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav-hero";
import { BrandFooter, PilotPlanner } from "@/components/home-sections";
import { BuyerReadiness } from "@/components/enterprise-home";
import { DeploymentExplorer } from "@/components/enterprise-interactions";

export const metadata: Metadata = { title: "Enterprise AI, on your terms | Databrew", description: "Evaluate AIOS deployment, identity, source permissions, model routing, human review and operational readiness for your organisation." };

export default function EnterprisePage() {
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main"><section className="enterprise-page-intro brand-shell" id="top"><p className="eyebrow">DATABREW FOR ENTERPRISE</p><h1>Ambitious about AI.<br /><span>Serious about control.</span></h1><p>Your people need useful intelligence. Your organisation needs clear boundaries. AIOS brings both into the same operating model.</p><div className="hero-actions"><Link href="/platform#security" className="brand-button">Explore governance <ArrowUpRight size={17} /></Link><Link href="/resources#security" className="text-link">Read the security checklist <ArrowUpRight size={17} /></Link></div></section><DeploymentExplorer standalone /><BuyerReadiness /><section className="brand-shell enterprise-contract"><p className="eyebrow">WHAT TO VERIFY</p><h2>From identity to action,<br />keep the chain accountable.</h2><div>{[
        ["01", "Identity & membership", "Resolve people through the configured identity provider and membership boundary. Validate group mapping, session policy and MFA with your provider."],
        ["02", "Knowledge & permissions", "Scope retrieval to permitted records. Verify source ACL mapping, restricted-document rejection, freshness and citation quality."],
        ["03", "Models & data movement", "Choose the model route by data classification and deployment posture. Validate allowed endpoints and refusal of hosted fallback in isolated environments."],
        ["04", "Actions & evidence", "Review external writes, record outcomes and exercise failure paths. Verify audit integrity, retention, backups and restore procedures in the deployed environment."],
    ].map(([n, title, body]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><PilotPlanner /></main><BrandFooter /></>;
}
