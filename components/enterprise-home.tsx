import Link from "next/link";
import { IntegrationLogo } from "@/components/integration-logo";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Database, FileText, GitBranch, Layers3, LockKeyhole, Mail, Search, ShieldCheck, Workflow } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { BUYER_GUIDES } from "@/lib/enterprise-site";
import { INTEGRATIONS, INTEGRATION_STAGES } from "@/lib/integrations";

export function EnterpriseHero() {
    return <section className="enterprise-hero" id="top"><div className="brand-shell">
        <div className="hero-announcement"><span>Meet AIOS</span><p>Knowledge. Agents. A clearer way to work.</p><Link href="/platform">Explore the platform <ArrowUpRight size={13} /></Link></div>
        <div className="enterprise-hero-grid"><div className="enterprise-hero-copy"><p className="eyebrow"><span className="square-dot" />THE AI WORKSPACE FOR YOUR ORGANISATION</p><h1>Your knowledge.<br />Your people.<br /><span>One step ahead.</span></h1><p className="enterprise-lede">Connect what your organisation knows to what your people need to do. Search, reason and move work forward with AI built around your context.</p><div className="enterprise-hero-actions"><Link href="/platform#console" className="brand-button">Explore the demo <ArrowUpRight size={17} /></Link><Link href="/#contact" className="outline-button">Plan your pilot <ArrowRight size={17} /></Link></div><p className="hero-reassurance">Explore without an account. Start with a real use case.</p></div>
            <div className="context-scene" role="img" aria-label="Databrew connects documents, business systems and conversations to a shared knowledge foundation, then to search, agents and reviewed actions.">
                <div className="scene-top"><span>YOUR ORGANISATION, CONNECTED</span><span>01 — 03</span></div>
                <div className="scene-sources"><div><FileText size={22} /><span>Documents</span><small>Policies · records</small></div><div><Database size={22} /><span>Systems</span><small>Business context</small></div><div><Mail size={22} /><span>Conversations</span><small>Team knowledge</small></div></div>
                <div className="scene-connectors"><span /><span /><span /></div>
                <div className="scene-foundation"><span className="scene-floor floor-back" /><span className="scene-floor floor-front" /><div className="scene-core"><BrandMark /></div><div className="scene-caption"><strong>One knowledge foundation</strong><span>Connected context. Scoped access.</span></div></div>
                <div className="scene-outcomes"><div><Search size={17} /><span>Find answers</span></div><div><Workflow size={17} /><span>Put agents to work</span></div><div><ShieldCheck size={17} /><span>Review actions</span></div></div>
                <div className="scene-bottom"><LockKeyhole size={12} /><span>Your permissions travel with the work.</span><ArrowRight size={14} /></div>
            </div>
        </div>
        <div className="hero-capabilities"><span>ONE CONNECTED PLATFORM</span><div><Search size={17} />Enterprise search</div><div><Layers3 size={17} />AI assistance</div><div><GitBranch size={17} />Agents & workflows</div><div><ShieldCheck size={17} />Governance</div><a href="#experience" aria-label="Explore the walkthrough"><ArrowDown size={19} /></a></div>
    </div></section>;
}

export function IntegrationPreview() {
    return <section className="enterprise-section ecosystem-section" id="integrations"><div className="brand-shell ecosystem-layout"><div><p className="eyebrow">CONTEXT, NOT ANOTHER SILO</p><h2>Your systems.<br />Working <span>together.</span></h2><p>Build on the knowledge and systems you already use. One connector foundation serves search and agents, with implementation scoped to your environment.</p><Link className="text-link" href="/integrations">Explore the integration catalogue <ArrowUpRight size={17} /></Link><small>Foundations and researched targets. Implementation and validation required.</small></div><div className="ecosystem-wall">{INTEGRATIONS.filter(item => item.featured).map(item => <Link href={`/integrations#${item.id}`} key={item.id}><IntegrationLogo id={item.id} /><strong>{item.name}</strong><small>{INTEGRATION_STAGES[item.stage].label}</small></Link>)}<div className="ecosystem-custom"><Database size={21} /><strong>Your custom systems</strong><span>One explicit integration contract.</span><ArrowUpRight size={16} /></div></div></div></section>;
}

export function EnterprisePrinciples() {
    return <section className="principle-strip" id="approach"><div className="brand-shell"><div><span className="eyebrow">THE DATABREW APPROACH</span><h2>Useful to your people.<br />Accountable to your business.</h2></div><div className="principle-strip-items">{[
        ["Context before output", "Start with the organisation’s knowledge, its vocabulary and the task at hand."],
        ["People before autonomy", "Give agents a clear scope. Keep review and approval in the path of consequential work."],
        ["Evidence before expansion", "Begin with one team. Validate quality, permissions and operating costs before scaling."],
    ].map(([title, body]) => <article key={title}><Check size={17} /><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></div></section>;
}

export function ResourcePreview() {
    return <section className="enterprise-section resource-preview" id="resources"><div className="brand-shell"><div className="enterprise-heading"><div><p className="eyebrow">FOR THE PEOPLE MAKING THE DECISION</p><h2>Make the next move<br /><span>an informed one.</span></h2></div><Link href="/resources" className="text-link">Explore buyer resources <ArrowUpRight size={17} /></Link></div><div className="resource-cards">{BUYER_GUIDES.map((guide, i) => <Link href={`/resources#${guide.id}`} key={guide.id}><div className={`resource-art resource-art-${i}`} aria-hidden="true">{i === 0 ? <><span /><span /><span /><ArrowUpRight /></> : i === 1 ? <><div /><ShieldCheck /></> : <><div /><div /><div /><Layers3 /></>}</div><div className="resource-card-copy"><span className="eyebrow">{guide.tag}</span><h3>{guide.title}</h3><p>{guide.intro}</p><span className="text-link">Read the guide <ArrowRight size={16} /></span></div></Link>)}</div></div></section>;
}

export function BuyerReadiness() {
    return <section className="enterprise-section readiness-section"><div className="brand-shell"><div className="enterprise-heading"><div><p className="eyebrow">ENTERPRISE EVALUATION</p><h2>Bring the right people.<br /><span>Ask the hard questions.</span></h2></div><p>Business value, technical fit and governance should be evaluated together. Here is what to put on the table.</p></div><div className="readiness-grid">{[
        { icon: BookOpen, role: "Business leaders", question: "Will it improve the work?", checks: ["Representative tasks and source material", "Answer quality and citation accuracy", "A baseline for time and review effort"] },
        { icon: Database, role: "Technology teams", question: "Will it fit the environment?", checks: ["Provider endpoints and integration mappings", "Infrastructure and model capacity", "Recovery, monitoring and upgrade ownership"] },
        { icon: ShieldCheck, role: "Security & governance", question: "Can we verify the boundaries?", checks: ["Identity, roles and source permissions", "Model routing and data movement", "Audit retention and denied-action tests"] },
    ].map(item => <article key={item.role}><item.icon size={24} /><span className="eyebrow">{item.role}</span><h3>{item.question}</h3><ul>{item.checks.map(check => <li key={check}><Check size={14} />{check}</li>)}</ul></article>)}</div><div className="readiness-disclosure"><ShieldCheck size={20} /><p><strong>Proof comes from your deployment.</strong> The product includes implementation and validation paths. Production readiness still depends on provisioning, live-provider acceptance and operational evidence. No third-party certification is claimed here.</p></div></div></section>;
}
