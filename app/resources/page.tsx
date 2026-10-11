import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav-hero";
import { BrandFooter, PilotPlanner } from "@/components/home-sections";
import { BUYER_GUIDES } from "@/lib/enterprise-site";

export const metadata: Metadata = { title: "Enterprise AI buyer resources | Databrew", description: "Practical guides for evaluating an AIOS pilot, enterprise security and deployment requirements." };

export default function ResourcesPage() {
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main"><section className="enterprise-page-intro brand-shell" id="top"><p className="eyebrow">THE ENTERPRISE AI FIELD GUIDE</p><h1>Better questions.<br /><span>Better decisions.</span></h1><p>Practical material for the business, technology and governance teams bringing AI into their organisation.</p><nav className="guide-jump-links" aria-label="Buyer guides">{BUYER_GUIDES.map(guide => <a key={guide.id} href={`#${guide.id}`}>{guide.tag}<ArrowDown size={14} /></a>)}</nav></section><div className="brand-shell buyer-guides">{BUYER_GUIDES.map((guide, i) => <article id={guide.id} key={guide.id}><header><span className="eyebrow">0{i + 1} / {guide.tag}</span><h2>{guide.title}</h2><p>{guide.intro}</p></header><div>{guide.steps.map((step, n) => <section key={step.title}><span>{String(n + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></section>)}<Link className="text-link" href={guide.id === "pilot" ? "/#contact" : guide.id === "security" ? "/platform#security" : "/enterprise#deployment"}>{guide.id === "pilot" ? "Build your pilot brief" : guide.id === "security" ? "Explore the governance demonstration" : "Compare deployment options"}<ArrowUpRight size={16} /></Link></div></article>)}</div><PilotPlanner /></main><BrandFooter /></>;
}
