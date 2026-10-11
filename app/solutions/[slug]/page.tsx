import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, FileText, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/nav-hero";
import { AnimatedDemo } from "@/components/animated-demo";
import { solutionScenario } from "@/lib/demo-scenarios";
import { BrandFooter, PilotPlanner } from "@/components/home-sections";
import { SolutionIcon } from "@/components/solution-groups";
import { SOLUTIONS, findSolution, solutionHref } from "@/lib/solutions";
import { findIntegration, INTEGRATION_STAGES, type Integration } from "@/lib/integrations";
import { PACKS } from "@/lib/aios";

export const dynamicParams = false;
export function generateStaticParams() { return SOLUTIONS.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const solution = findSolution((await params).slug);
    if (!solution) return { title: "Solution not found | Databrew" };
    return { title: `AI for ${solution.name} | Databrew`, description: solution.summary };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
    const solution = findSolution((await params).slug);
    if (!solution) notFound();
    const parent = solution.parent ? findSolution(solution.parent) : undefined;
    const children = SOLUTIONS.filter(item => item.parent === solution.slug);
    const connections = solution.integrations.map(findIntegration).filter((item): item is Integration => Boolean(item));
    const pack = PACKS.find(item => item.id === solution.demoPack);
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main">
        <section className="brand-shell solution-detail-hero" id="top"><nav aria-label="Breadcrumb"><Link href="/solutions">Solutions</Link><span>/</span>{parent && <><Link href={solutionHref(parent)}>{parent.name}</Link><span>/</span></>}<span aria-current="page">{solution.name}</span></nav><div className="solution-hero-grid"><div><p className="eyebrow"><SolutionIcon name={solution.icon} />AI FOR {solution.name.toUpperCase()}</p><h1>{solution.headline}</h1><p>{solution.summary}</p><div className="hero-actions"><a href="#contact" className="brand-button">Plan a {solution.kind === "department" ? "team" : "sector"} pilot <ArrowUpRight size={17} /></a><Link href={pack ? `/platform?pack=${pack.id}#console` : "/platform#console"} className="text-link">Explore {pack ? `${pack.short.toLowerCase()} example` : "the AIOS demo"}<ArrowRight size={16} /></Link></div><span className="solution-blueprint-label">Solution blueprint · configure and validate with your team</span></div><div className="solution-hero-demo"><AnimatedDemo scenario={solutionScenario(solution)} compact /></div></div></section>
        <section className="solution-work-section"><div className="brand-shell"><div className="enterprise-heading"><div><p className="eyebrow">A PRACTICAL STARTING POINT</p><h2>Put context to work.</h2></div><p>Three workflows to scope in your pilot. The people and evidence matter as much as the output.</p></div><div className="solution-workflows">{solution.workflows.map((workflow, index) => <article key={workflow}><span>0{index + 1}</span><h3>{["Find the knowledge", "Prepare the work", "Coordinate the next step"][index]}</h3><p>{workflow}</p></article>)}</div></div></section>
        <section className="brand-shell solution-evidence"><div><p className="eyebrow">THE KNOWLEDGE BEHIND THE WORK</p><h2>Start with sources<br />your team can trust.</h2><ul>{solution.sources.map(source => <li key={source}><FileText size={18} />{source}</li>)}</ul><p className="solution-smallprint">Agree ownership, access rules, document versions and freshness before connecting a source.</p></div><div><p className="eyebrow">INTEGRATION STARTING POINTS</p><div className="solution-connection-links">{connections.map(connection => <Link key={connection.id} href={`/integrations#${connection.id}`}><span>{connection.name}<small>{connection.protocol} · {INTEGRATION_STAGES[connection.stage].label}</small></span><ArrowUpRight size={17} /></Link>)}</div><p className="solution-smallprint">Recommended systems to assess—not active connections. Check each listing for its readiness, source documentation and implementation requirements.</p></div></section>
        <section className="brand-shell solution-review"><ShieldCheck size={27} /><div><p className="eyebrow">THE HUMAN REVIEW BOUNDARY</p><h2>Useful assistance.<br />Accountable decisions.</h2><p>{solution.review}</p><Link href="/enterprise" className="text-link">Explore security and deployment <ArrowUpRight size={16} /></Link></div></section>
        {children.length > 0 && <section className="brand-shell solution-specialisms"><p className="eyebrow">GO DEEPER IN {solution.name.toUpperCase()}</p><div>{children.map(child => <Link href={solutionHref(child)} key={child.slug}><span>{child.name}</span><ArrowUpRight size={18} /></Link>)}</div></section>}
        {solution.slug === "government" && <section className="brand-shell solution-government"><p className="eyebrow">MINISTRY OF INTERIOR DEMONSTRATION</p><h2>Four services. Clearly represented.</h2><ul>{[
            ["NIS", "Nigeria Immigration Service", "Passports, visas, border control and expatriate residency."],
            ["NCoS", "Nigerian Correctional Service", "Custodial operations, casework records and institutional reporting."],
            ["NSCDC", "Nigeria Security and Civil Defence Corps", "Critical infrastructure protection and private guard regulation."],
            ["FFS", "Federal Fire Service", "Fire prevention, inspections and response reporting."],
        ].map(([abbr, name, detail]) => <li key={abbr}><span>{abbr}</span><div><h3>{name}</h3><p>{detail}</p></div><Check size={17} /></li>)}</ul><Link href="/platform?pack=ministry-interior#console" className="brand-button">Explore all four service demos <ArrowUpRight size={17} /></Link></section>}
        <PilotPlanner key={solution.slug} solutionId={solution.slug} />
    </main><BrandFooter /></>;
}
