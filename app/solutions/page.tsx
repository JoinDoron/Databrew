import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Layers3, ShieldCheck, UsersRound } from "lucide-react";
import { Nav } from "@/components/nav-hero";
import { BrandFooter, PilotPlanner } from "@/components/home-sections";
import { SolutionDirectory } from "@/components/solution-directory";
import { PACKS } from "@/lib/aios";
import { DEPARTMENTS, INDUSTRIES } from "@/lib/solutions";

export const metadata: Metadata = { title: "AI for every department and industry | Databrew", description: `Explore Databrew AI solution blueprints across ${DEPARTMENTS.length} department paths and ${INDUSTRIES.length} industry paths, from engineering and marketing to government, banking and healthcare.` };

export default function SolutionsPage() {
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main"><section className="enterprise-page-intro brand-shell" id="top"><p className="eyebrow">DATABREW SOLUTIONS</p><h1>Different work.<br /><span>Shared intelligence.</span></h1><p>Start with your team. Shape it around your industry. Bring the right knowledge, agents and review points into one connected workspace.</p><div className="solutions-intro-notes"><span><UsersRound size={16} />{DEPARTMENTS.length} department paths</span><span><Layers3 size={16} />{INDUSTRIES.length} industry paths</span><span><ShieldCheck size={16} />People stay in control</span></div></section><SolutionDirectory /><section className="brand-shell solution-proof-section" id="demos"><div><p className="eyebrow">FROM BLUEPRINT TO PRODUCT</p><h2>Explore a working demonstration.</h2><p>The pages above describe solution starting points, not pre-installed industry packages. These existing demonstrations show the AIOS interface using illustrative data.</p></div><div className="solution-demo-links">{PACKS.map(pack => <Link href={`/platform?pack=${pack.id}#console`} key={pack.id}><span>{pack.name}</span><ArrowUpRight size={16} /></Link>)}</div></section><section className="brand-shell solution-readiness-note"><ShieldCheck size={20} /><p><strong>Fit is proven in your environment.</strong> Source connections, permissions, model routing and regulated uses require configuration and acceptance testing. Start with approved material and a named human reviewer.</p></section><PilotPlanner /></main><BrandFooter /></>;
}
