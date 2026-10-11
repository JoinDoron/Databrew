"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { AnimatedDemo } from "@/components/animated-demo";
import { FEATURE_DEMOS, packScenario } from "@/lib/demo-scenarios";
import { PACKS } from "@/lib/aios";
import { DEPLOYMENT_CHOICES } from "@/lib/enterprise-site";

function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number, length: number, select: (next: number) => void, refs: (HTMLButtonElement | null)[]) {
    const next = event.key === "ArrowRight" ? (index + 1) % length : event.key === "ArrowLeft" ? (index + length - 1) % length : event.key === "Home" ? 0 : event.key === "End" ? length - 1 : null;
    if (next !== null) { event.preventDefault(); select(next); refs[next]?.focus(); }
}

export function QuestionDemo() {
    const examples = [PACKS[0], PACKS[1], PACKS[4]];
    const [selected, setSelected] = useState(0);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const pack = examples[selected];
    const choose = (index: number) => setSelected(index);
    return <section className="enterprise-section question-section" id="experience"><div className="brand-shell">
        <div className="enterprise-heading"><div><p className="eyebrow">FROM QUESTION TO CLARITY</p><h2>Don’t just get an answer.<br /><span>See what’s behind it.</span></h2></div><p>Follow the plan. Inspect the sources. See where a person stays in control. This is AI you can work with.</p></div>
        <div className="question-demo">
            <div className="example-tabs" role="tablist" aria-label="Choose an example question">{examples.map((item, i) => <button key={item.id} role="tab" id={`example-${i}`} aria-selected={selected === i} aria-controls="example-answer" tabIndex={selected === i ? 0 : -1} ref={el => { refs.current[i] = el; }} onKeyDown={event => moveTab(event, i, examples.length, choose, refs.current)} onClick={() => choose(i)}>{item.short}<ArrowUpRight size={14} /></button>)}</div>
            <div id="example-answer" role="tabpanel" aria-labelledby={`example-${selected}`} tabIndex={0}><AnimatedDemo scenario={packScenario(pack)} /></div>
        </div>
        <div className="section-footnote"><span>Want the complete picture?</span><Link href="/platform#console">Explore the product, portals and industry packs <ArrowRight size={16} /></Link></div>
    </div></section>;
}

export function DeploymentExplorer({ standalone = false }: { standalone?: boolean }) {
    const [active, setActive] = useState(0);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const choice = DEPLOYMENT_CHOICES[active];
    return <section className={`boundary-section${standalone ? " boundary-standalone" : ""}`} id="deployment"><div className="brand-shell">
        <div className="enterprise-heading"><div><p className="eyebrow">YOUR DATA. YOUR OPERATING BOUNDARY.</p><h2>More intelligence.<br /><span>No less control.</span></h2></div><p>Choose the environment around your organisation—not the other way around. Model routing, identity and source access belong in the same conversation.</p></div>
        <div className="boundary-layout"><div className="boundary-copy"><div role="tablist" aria-label="Deployment options" className="boundary-tabs">{DEPLOYMENT_CHOICES.map((item, i) => <button role="tab" id={`deployment-${item.id}`} aria-controls="deployment-panel" aria-selected={active === i} tabIndex={active === i ? 0 : -1} key={item.id} ref={el => { refs.current[i] = el; }} onKeyDown={event => moveTab(event, i, DEPLOYMENT_CHOICES.length, setActive, refs.current)} onClick={() => setActive(i)}>{item.name}</button>)}</div><div role="tabpanel" id="deployment-panel" aria-labelledby={`deployment-${choice.id}`} tabIndex={0}><h3>{choice.boundary}</h3><p>{choice.summary}</p><ul>{choice.requirements.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><Link href={standalone ? "/resources#deployment" : "/enterprise"} className="text-link">{standalone ? "Read the deployment guide" : "Explore enterprise readiness"}<ArrowUpRight size={17} /></Link></div></div>
            <div className="boundary-illustration"><AnimatedDemo compact scenario={{ ...FEATURE_DEMOS.deployment, id: `deployment-${choice.id}`, label: choice.name, question: `Prepare a ${choice.name.toLowerCase()} deployment plan.`, sources: [{ name: "Your sources", excerpt: choice.summary }, { name: "Model route", excerpt: choice.model }, { name: "Network boundary", excerpt: choice.network }], answer: `${choice.summary} Model: ${choice.model}. Operations: ${choice.owner}.`, boundary: "Illustrative plan only. Provisioning, security controls and acceptance testing are required." }} /></div>
        </div><p className="boundary-note">Deployment options require provisioning and acceptance testing. This website does not represent a provisioned or certified environment.</p>
    </div></section>;
}
