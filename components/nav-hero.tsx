"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { NAV_GROUPS } from "@/lib/enterprise-site";
import { SolutionsMenu } from "@/components/solution-groups";

export function Nav() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const header = useRef<HTMLElement>(null);
    const mobileTrigger = useRef<HTMLButtonElement>(null);
    const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
    const group = NAV_GROUPS.find(item => item.label === active);
    useEffect(() => {
        if (!open && !active) return;
        const dismiss = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            if (active) triggers.current[active]?.focus();
            else mobileTrigger.current?.focus();
            setOpen(false); setActive(null);
        };
        const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setActive(null); setOpen(false); } };
        document.addEventListener("keydown", dismiss); document.addEventListener("pointerdown", outside);
        return () => { document.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", outside); };
    }, [open, active]);
    return <header className="site-nav enterprise-nav" ref={header} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setActive(null); }}>
        <div className="brand-shell nav-inner">
            <Wordmark />
            <nav aria-label="Main navigation" className="desktop-nav">
                {NAV_GROUPS.slice(0, 2).map(item => <button key={item.label} ref={el => { triggers.current[item.label] = el; }} aria-expanded={active === item.label} aria-controls="nav-panel" onClick={() => setActive(active === item.label ? null : item.label)}>{item.label}<ChevronDown size={12} /></button>)}
                <Link href="/integrations">Integrations</Link><Link href="/enterprise">Enterprise</Link>
                <button ref={el => { triggers.current.Resources = el; }} aria-expanded={active === "Resources"} aria-controls="nav-panel" onClick={() => setActive(active === "Resources" ? null : "Resources")}>Resources<ChevronDown size={12} /></button>
            </nav>
            <div className="nav-actions"><Link href="/platform#console" className="nav-demo">Explore demo</Link><Link className="nav-cta" href="/#contact">Plan a pilot <ArrowUpRight size={15} /></Link></div>
            <button ref={mobileTrigger} type="button" className="mobile-menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { setOpen(!open); setActive(null); }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        {group && <div id="nav-panel" className={`mega-nav brand-shell${group.label === "Solutions" ? " solutions-mega-panel" : ""}`} onClick={event => { if ((event.target as HTMLElement).closest("a")) setActive(null); }}>{group.label === "Solutions" ? <SolutionsMenu /> : <><div><span className="eyebrow">{group.label}</span><h2>{group.intro}</h2><Link href="/platform#console">Explore the product <ArrowRight size={16} /></Link></div><nav aria-label={`${group.label} links`}>{group.items.map(item => <Link href={item.href} key={item.label}><span>{item.label}<ArrowUpRight size={15} /></span><small>{item.note}</small></Link>)}</nav></>}</div>}
        {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation" onClick={event => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
            {NAV_GROUPS.map(item => <details key={item.label}><summary>{item.label}<ChevronDown size={16} /></summary>{item.label === "Solutions" ? <SolutionsMenu /> : item.items.map(link => <Link href={link.href} key={link.label}>{link.label}<ArrowUpRight size={14} /></Link>)}</details>)}
            <Link href="/integrations">Integrations<ArrowUpRight size={16} /></Link><Link href="/enterprise">Enterprise<ArrowUpRight size={16} /></Link><Link href="/platform#console">Explore demo<ArrowRight size={16} /></Link>
        </nav>}
    </header>;
}
