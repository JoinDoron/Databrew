"use client";

import Link from "next/link";

import { AnimatedDemo } from "@/components/animated-demo";
import { FEATURE_DEMOS, packScenario } from "@/lib/demo-scenarios";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, FileText, Fingerprint, Globe2, Landmark, Layers3, LockKeyhole, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { BrandMark, SignalPattern, Wordmark } from "@/components/brand";
import { PACKS } from "@/lib/aios";
import { DEPARTMENTS, INDUSTRIES, findSolution } from "@/lib/solutions";

const PRODUCT_VIEWS = [
    { title: "Ask your organisation", short: "Find clarity", demo: "search", headline: "Answers with a source.\nDecisions with context.", body: "Bring scattered documents, conversations and records into one place. Ask a question and follow the answer back to the source.", icon: FileText, route: "/platform#foundation" },
    { title: "Put agents to work", short: "Move work forward", demo: "console", headline: "A team of agents.\nA clear view of the work.", body: "Let specialised agents research, prepare and coordinate. Follow their plan, see the tools they use, and review the work as it happens.", icon: Workflow, route: "/platform#agents" },
    { title: "Stay in control", short: "Keep your boundaries", demo: "clearance", headline: "Your organisation.\nYour rules.", body: "Define who can access what, where information lives, and which actions need a person’s approval. Make oversight part of the way you work.", icon: ShieldCheck, route: "/platform#security" },
];

function tabIndexFor(key: string, index: number, length: number) {
    if (key === "ArrowRight") return (index + 1) % length;
    if (key === "ArrowLeft") return (index + length - 1) % length;
    if (key === "Home") return 0;
    if (key === "End") return length - 1;
    return null;
}

export function ProductExperience() {
    const [active, setActive] = useState(0);
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const view = PRODUCT_VIEWS[active];
    function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const next = tabIndexFor(event.key, index, PRODUCT_VIEWS.length);
        if (next === null) return;
        event.preventDefault(); setActive(next); buttons.current[next]?.focus();
    }
    return <section className="product-section brand-section" id="product"><div className="brand-shell">
        <div className="section-heading"><h2>Everything you know.<br /><span>More you can do.</span></h2><p>One connected platform for your knowledge,<br className="desktop-break" /> your people, and the work ahead.</p></div>
        <div className="product-tabs" role="tablist" aria-label="Explore AIOS capabilities">{PRODUCT_VIEWS.map((item, index) => <button key={item.title} ref={el => { buttons.current[index] = el; }} role="tab" id={`product-tab-${index}`} aria-controls="product-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKey(event, index)}><item.icon size={18} strokeWidth={1.6} />{item.title}<ArrowUpRight size={15} /></button>)}</div>
        <div className="product-stage" role="tabpanel" id="product-panel" aria-labelledby={`product-tab-${active}`} tabIndex={0}>
            <div className="product-story" key={`story-${active}`}><span className="micro-label">{view.short}</span><h3>{view.headline.split("\n").map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h3><p>{view.body}</p><Link href={view.route} className="text-link">Explore this capability <ArrowRight size={17} /></Link><span className="product-demo-label">Animated illustrations. Fictional examples.</span></div>
            <div className="product-illustration"><AnimatedDemo scenario={FEATURE_DEMOS[view.demo]} compact /></div>
        </div>
        <Link href="/platform#console" className="product-bottom-link">Go deeper. Explore the complete AIOS demo <ArrowUpRight size={16} /></Link>
    </div></section>;
}

export function Possibility() {
    return <section className="possibility-section" id="approach"><div className="brand-shell possibility-layout">
        <div><span className="brand-kicker">A better way to work</span><h2>Less searching.<br />More <span>possibility.</span></h2><p>Your organisation already has remarkable people and valuable knowledge. We build the connection between them.</p><Link href="/platform#architecture" className="text-link">Meet the platform <ArrowUpRight size={17} /></Link></div>
        <div className="principles">{[{ icon: Network, title: "Connect what you already have.", body: "Start with the documents and systems your teams use. Build on your knowledge, with a shared foundation for every agent." }, { icon: Sparkles, title: "Make room for meaningful work.", body: "Turn research, routine questions and first drafts into a starting point. Give people more time for judgement, ideas and each other." }, { icon: Fingerprint, title: "Keep people at the centre.", body: "Show the work behind an answer. Keep permissions visible, make decisions reviewable, and let people guide what happens next." }].map(item => <article key={item.title}><item.icon size={25} strokeWidth={1.4} /><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
    </div></section>;
}

const SECTOR_NOTES: Record<string, { headline: string; detail: string; tags: string[] }> = {
    "central-bank": { headline: "Clarity for the institutions\nthat shape economies.", detail: "Bring policy research, supervisory knowledge and operational insight into a workspace designed around the people who need it.", tags: ["Policy & research", "Supervision", "Payments oversight"] },
    "oil-gas": { headline: "Intelligence where\noperations happen.", detail: "Connect field reports, asset knowledge and operational procedures. Help teams prepare maintenance reviews and make sense of complex records.", tags: ["Asset integrity", "HSE", "Operational knowledge"] },
    government: { headline: "Public knowledge.\nGreater public value.", detail: "Make institutional memory useful across registries, departments and leadership, with a clearer path from information to action.", tags: ["Correspondence", "Procurement", "Policy delivery"] },
    manufacturing: { headline: "Keep knowledge moving.\nKeep business moving.", detail: "Give operations, quality and leadership a shared source of context across processes, records and teams.", tags: ["Production", "Quality", "Supply chain"] },
    "ministry-interior": { headline: "Four services.\nOne connected ambition.", detail: "A Ministry of Interior configuration that respects each service’s responsibilities while bringing ministry-wide knowledge together.", tags: ["NIS", "NCoS", "NSCDC", "FFS"] },
};

export function IndustryDemos() {
    const [active, setActive] = useState(PACKS[0].id);
    const [service, setService] = useState<string | null>(null);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const pack = PACKS.find(p => p.id === active) ?? PACKS[0];
    const notes = SECTOR_NOTES[pack.id] ?? SECTOR_NOTES.manufacturing;
    const selectedService = pack.services?.find(s => s.id === service);
    return <section id="industry-demos" className="solutions-section brand-section"><div className="brand-shell">
        <div className="section-heading"><h2>See it<br /><span>in context.</span></h2><p>Five existing industry demonstrations.<br className="desktop-break" /> One shared platform. Illustrative data.</p></div>
        <div className="sector-tabs" role="tablist" aria-label="Industry configurations">{PACKS.map((p, i) => <button key={p.id} ref={el => { refs.current[i] = el; }} role="tab" id={`sector-${p.id}`} aria-controls="sector-panel" aria-selected={active === p.id} tabIndex={active === p.id ? 0 : -1} onClick={() => { setActive(p.id); setService(null); }} onKeyDown={event => { const next = tabIndexFor(event.key, i, PACKS.length); if (next !== null) { event.preventDefault(); setActive(PACKS[next].id); setService(null); refs.current[next]?.focus(); } }}>{p.short}</button>)}</div>
        <div id="sector-panel" className="sector-panel" role="tabpanel" aria-labelledby={`sector-${pack.id}`} tabIndex={0}>
            <div className="sector-copy"><Landmark size={28} strokeWidth={1.3} /><h3>{notes.headline.split("\n").map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h3><p>{notes.detail}</p><div className="sector-tags">{notes.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link className="text-link" href={`/platform?pack=${pack.id}#console`}>Explore {pack.short.toLowerCase()} <ArrowUpRight size={17} /></Link></div>
            <div className="sector-visual"><AnimatedDemo scenario={packScenario(pack, selectedService)} compact />{selectedService && <p className="screenshot-caption">{selectedService.name} · fictional review example</p>}</div>
        </div>
        {pack.services && <div className="service-selector"><p>Explore each service</p><div>{pack.services.map(s => <button key={s.id} onClick={() => setService(service === s.id ? null : s.id)} aria-pressed={service === s.id}><span>{s.abbr}</span><span>{s.name}</span><ArrowUpRight size={16} /></button>)}</div></div>}
    </div></section>;
}

export function TrustPerspective() {
    return <section className="trust-perspective" id="trust"><div className="brand-shell trust-layout">
        <div className="trust-title"><BrandMark /><h2>Big possibilities.<br /><span>Clear boundaries.</span></h2><p>Built for organisations where trust is part of the job. From growing businesses to the institutions serving millions.</p><Link href="/platform#security" className="text-link">Explore governance <ArrowUpRight size={17} /></Link></div>
        <div className="trust-items"><article><LockKeyhole size={22} /><h3>Your data has a home.</h3><p>Choose a deployment approach around your organisation’s residency, connectivity and infrastructure requirements.</p></article><article><ShieldCheck size={22} /><h3>Access has a purpose.</h3><p>Give each role a workspace with the knowledge and tools it needs. Keep sensitive information within its intended scope.</p></article><article><Globe2 size={22} /><h3>Built for our realities.</h3><p>Designed with Nigerian and African organisations in mind. Local context, public-sector workflows and flexible deployment choices.</p></article><article><Layers3 size={22} /><h3>Start focused. Grow together.</h3><p>Begin with one team and a clear use case. Expand across departments with the same shared foundation.</p></article></div>
    </div><SignalPattern /></section>;
}

const QUESTIONS = [
    ["What is Databrew, and what is AIOS?", "Databrew, a Brewling company, is the brand behind AIOS, an AI operating system that brings organisational knowledge, specialised agents, shared Spaces, projects and tasks into one workspace. The website introduces the platform through interactive illustrations and sample workflows."],
    ["What can my team do in Databrew Spaces?", "Write decision briefs, meeting notes and operating procedures. Link existing Knowledge sources, keep page revisions, and request an independent review before publication. Spaces use the existing project and task records, so a follow-up stays connected rather than becoming a duplicate tracker."],
    ["How do projects and tasks work together?", "Project progress comes from linked tasks. Tasks support owners, due dates and time windows, priorities, descriptions, subtasks, threaded comments and recorded activity. Explore the same tasks in list, board and timeline views, with access based on your workspace role."],
    ["Can AI help with the work inside a Space?", "Yes. Ask the existing Databrew agents to draft a brief, find gaps or suggest follow-ups using accessible project sources. You choose which text to insert into the page. The assistant does not automatically publish, approve or create tasks. Live AI requires a configured, deployment-approved model endpoint; website demos are scripted illustrations."],
    ["Which teams and industries does Databrew cover?", `Explore ${DEPARTMENTS.length} department paths and ${INDUSTRIES.length} industry paths in Solutions, including marketing specialisms, telecommunications, financial services, government, healthcare and higher education. These are use-case blueprints to configure and validate, not ${DEPARTMENTS.length + INDUSTRIES.length} installed software packages. The five existing industry demos show the shared AIOS experience.`],
    ["Can I see the product before speaking to anyone?", "Yes. Select Explore AIOS to explore animated product illustrations, interactive demonstrations, role-based portals and industry configurations. The demonstrations use illustrative data."],
    ["Does the Ministry of Interior demo cover all four services?", "Yes. It includes Nigeria Immigration Service (passports, visas, border control and expatriate residency), Nigerian Correctional Service, Nigeria Security and Civil Defence Corps (infrastructure protection and private guard regulation), and Federal Fire Service."],
    ["How would we get started?", "Start by exploring the configuration closest to your organisation. Use the pilot planner below to outline your first team, use case and deployment preference. Infrastructure, provider connections and production validation are agreed during implementation."],
];

export function Questions() {
    return <section className="faq-section brand-section"><div className="brand-shell faq-layout"><h2>A little more<br /><span>clarity.</span></h2><div>{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={19} /></summary><p>{answer}</p></details>)}</div></div></section>;
}

export function PilotPlanner({ solutionId }: { solutionId?: string }) {
    const solution = solutionId ? findSolution(solutionId) : undefined;
    const [open, setOpen] = useState(false);
    const [industry, setIndustry] = useState(solution?.kind === "industry" ? solution.slug : "general");
    const [department, setDepartment] = useState(solution?.kind === "department" ? solution.slug : "all-teams");
    const [need, setNeed] = useState(solution?.workflows[0] ?? "Find and cite organisational knowledge");
    const [deployment, setDeployment] = useState("Help us choose");
    const [saved, setSaved] = useState(false);
    const needs = [...new Set([solution?.workflows[0] ?? "Find and cite organisational knowledge", "Find and cite organisational knowledge", "Prepare research and decision briefs", "Create a shared team Space", "Manage project delivery and tasks", "Coordinate tasks and approvals", "Explore a cross-department workflow"])];
    function download() {
        const industryName = findSolution(industry)?.name ?? "Business / cross-industry";
        const departmentName = findSolution(department)?.name ?? "All Teams";
        const brief = `DATABREW | AIOS PILOT BRIEF\nA Brewling company\n\nDepartment: ${departmentName}\nIndustry: ${industryName}\nFirst use case: ${need}\nDeployment preference: ${deployment}\n\nWorkshop agenda\n1. Identify the pilot team and its source documents.\n2. Agree the roles, permissions and review points.\n3. Verify required system connections and infrastructure.\n4. Define success measures and validate the pilot.\n\nThis is a solution planning brief, not an installed package or deployment confirmation.\nPrepared with the Databrew website pilot planner.\n`;
        const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
        const a = document.createElement("a"); a.href = url; a.download = "databrew-pilot-brief.txt"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); setSaved(true);
    }
    return <section className="closing-section" id="contact"><div className="brand-shell"><div className="closing-top"><BrandMark /><p>The next chapter is yours.</p></div><div className="closing-main"><h2>What could your<br />people do <span>next?</span></h2><div><p>Start with one question.<br />Discover what becomes possible.</p><button className="brand-button" aria-expanded={open} aria-controls="pilot-planner" onClick={() => setOpen(!open)}>Plan your pilot <span><ArrowUpRight size={19} /></span></button><Link href="/platform" className="text-link">Or explore AIOS <ArrowRight size={16} /></Link></div></div>
        {open && <div id="pilot-planner" className="pilot-planner"><div><h3>Make your first move.</h3><p>Build a brief to share with your team. Your selections stay in this browser.</p></div><form onSubmit={event => { event.preventDefault(); download(); }}>
            <label>Department<select value={department} onChange={e => { setDepartment(e.target.value); setSaved(false); }}>{DEPARTMENTS.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
            <label>Industry<select value={industry} onChange={e => { setIndustry(e.target.value); setSaved(false); }}><option value="general">Business / cross-industry</option>{INDUSTRIES.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
            <label>First use case<select value={need} onChange={e => { setNeed(e.target.value); setSaved(false); }}>{needs.map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Deployment preference<select value={deployment} onChange={e => { setDeployment(e.target.value); setSaved(false); }}><option>Help us choose</option><option>Managed cloud</option><option>Private cloud</option><option>Private on-premise</option><option>Air-gapped</option></select></label>
            <button type="submit" className="brand-button">Download pilot brief <ArrowDown size={17} /></button><p role="status" className="planner-status">{saved ? "Your pilot brief is ready. Check your downloads." : "No account or email address required."}</p>
        </form></div>}
    </div></section>;
}

export function BrandFooter() {
    return <footer className="brand-footer"><div className="brand-shell"><div className="footer-top"><div><Wordmark /><p>Rooted in Africa.<br />Built for possibility.</p></div><nav aria-label="Footer platform"><span>Product</span><Link href="/platform">AIOS platform</Link><Link href="/#spaces">Spaces, projects & tasks</Link><Link href="/platform#console">Agent demo</Link><Link href="/integrations">Integrations</Link><Link href="/solutions">Solutions</Link></nav><nav aria-label="Footer enterprise"><span>Enterprise</span><Link href="/enterprise">Security & control</Link><Link href="/enterprise#deployment">Deployment options</Link><Link href="/resources#pilot">Pilot guide</Link><Link href="/resources#security">Security checklist</Link></nav><nav aria-label="Footer company"><span>Databrew</span><Link href="/resources">Resources</Link><Link href="/brand">Visual identity</Link><Link href="/#contact">Plan your pilot</Link></nav></div><div className="footer-bottom"><span>© 2026 Databrew. A Brewling company.</span><Link href="#top">Back to top <ArrowUpRight size={14} /></Link></div></div></footer>;
}
