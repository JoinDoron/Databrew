"use client";

import Link from "next/link";
import { IntegrationLogo } from "@/components/integration-logo";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { DEPARTMENTS, INDUSTRIES, SOLUTIONS } from "@/lib/solutions";
import { INTEGRATIONS, INTEGRATION_CATEGORIES, INTEGRATION_STAGES, findIntegration, matchesIntegration, type Integration, type IntegrationStage } from "@/lib/integrations";

export function IntegrationDirectory() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [solutionId, setSolutionId] = useState("");
    const [stage, setStage] = useState<IntegrationStage | "">("");
    const [regional, setRegional] = useState(false);
    const solution = SOLUTIONS.find(item => item.slug === solutionId);
    const candidates = solution ? solution.integrations.map(findIntegration).filter((item): item is Integration => Boolean(item)) : INTEGRATIONS;
    const scoped = candidates.filter(item => (!stage || item.stage === stage) && (!regional || item.regional) && matchesIntegration(item, query));
    const matches = scoped.filter(item => !category || item.category === category);
    const filtered = Boolean(query || category || solutionId || stage || regional);
    const reset = () => { setQuery(""); setCategory(""); setSolutionId(""); setStage(""); setRegional(false); };
    const chooseSolution = (id: string) => { setSolutionId(id); setCategory(""); };

    // Featured/solution deep links must reveal their card even after filtering.
    useEffect(() => {
        let frame = 0;
        let settleFrame = 0;
        const reveal = (id: string) => {
            if (!findIntegration(id)) return;
            setQuery(""); setCategory(""); setSolutionId(""); setStage(""); setRegional(false);
            cancelAnimationFrame(frame); cancelAnimationFrame(settleFrame);
            frame = requestAnimationFrame(() => {
                settleFrame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }));
            });
        };
        const onHash = () => reveal(window.location.hash.slice(1));
        const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const anchor = event.target instanceof Element ? event.target.closest("a") : null;
            if (!anchor || anchor.target === "_blank") return;
            const target = new URL(anchor.href);
            if (target.origin === window.location.origin && target.pathname === window.location.pathname) reveal(target.hash.slice(1));
        };
        window.addEventListener("hashchange", onHash);
        document.addEventListener("click", onClick);
        return () => { window.removeEventListener("hashchange", onHash); document.removeEventListener("click", onClick); cancelAnimationFrame(frame); cancelAnimationFrame(settleFrame); };
    }, []);

    return <section className="connect-directory" id="directory" aria-labelledby="directory-title">
        <div className="connect-directory-heading"><div><p className="eyebrow">FIND YOUR STARTING POINT</p><h2 id="directory-title">Explore the ecosystem.</h2></div><p>Find the systems your team uses.<br />See what a Databrew connection would involve.</p></div>
        <div className="connect-layout">
            <aside className="connect-sidebar" aria-label="Integration filters">
                <div className="connect-sidebar-title"><SlidersHorizontal size={15} /><span>Refine your view</span>{filtered && <button type="button" onClick={reset}>Reset</button>}</div>
                <label className="connect-select-label">Industry or department<select value={solutionId} onChange={event => chooseSolution(event.target.value)}><option value="">All industries & teams</option><optgroup label="Industries">{INDUSTRIES.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</optgroup><optgroup label="Departments">{DEPARTMENTS.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</optgroup></select></label>
                <div className="connect-category-desktop"><p className="connect-filter-label" id="category-label">Category</p><div role="group" aria-labelledby="category-label">{["", ...INTEGRATION_CATEGORIES].map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}><span>{item || "All categories"}</span><span>{item ? scoped.filter(provider => provider.category === item).length : scoped.length}</span></button>)}</div></div>
                <label className="connect-select-label connect-category-mobile">Category<select value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{INTEGRATION_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>
                <label className="connect-select-label">Databrew readiness<select value={stage} onChange={event => setStage(event.target.value as IntegrationStage | "")}><option value="">All stages</option>{Object.entries(INTEGRATION_STAGES).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
                <label className="connect-regional"><input type="checkbox" checked={regional} onChange={event => setRegional(event.target.checked)} /><span>Nigeria & Africa focus<small>Regional payments & healthcare</small></span></label>
                <p className="connect-sidebar-note">Recommendations, not an installation list. Your actual systems, licences and security requirements determine the final scope.</p>
            </aside>
            <div className="connect-results">
                <div className="connect-search"><Search size={19} aria-hidden="true" /><label className="sr-only" htmlFor="integration-search">Search integrations</label><input id="integration-search" type="search" placeholder="Search apps, systems or use cases…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={17} /></button>}</div>
                <div className="connect-result-meta"><p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? "integration target" : "integration targets"}{solution ? ` for ${solution.name}` : " to explore"}</p>{filtered ? <button type="button" onClick={reset}>Clear all filters <X size={12} /></button> : <span>No connections activated</span>}</div>
                {solution && <div className="connect-sector-note"><span>CURATED FOR {solution.name.toUpperCase()}</span><p>Start with a source your team already owns, then add specialist context. These are alternatives to assess—not a requirement to buy every system.</p><Link href={`/solutions/${solution.slug}`}>See the {solution.name} workflow <ArrowUpRight size={14} /></Link></div>}
                <div className="connect-grid">{matches.map(item => <article className="connect-card" key={item.id} id={item.id}>
                    <div className="connect-card-top"><IntegrationLogo id={item.id} /><span className={`connect-stage connect-stage-${item.stage}`} title={INTEGRATION_STAGES[item.stage].explanation}><span />{INTEGRATION_STAGES[item.stage].label}</span></div>
                    <h3>{item.name}</h3><span className="connect-card-category">{item.category}</span><p>{item.detail}</p>
                    <details><summary>Explore connection <ChevronDown size={14} /><span className="sr-only"> for {item.name}</span></summary><div className="connect-card-details"><span className="connect-detail-label">PROPOSED CONNECTION</span><p>{item.protocol}</p><span className="connect-detail-label">BEFORE CONNECTING</span><p>{item.setup}</p><p className="connect-stage-note">{INTEGRATION_STAGES[item.stage].explanation}</p>{item.source ? <a href={item.source} target="_blank" rel="noopener noreferrer">{item.sourceLabel || "Official developer reference"}<ArrowUpRight size={13} /><span className="sr-only"> for {item.name} (opens in a new tab)</span></a> : <span className="connect-source-note">{item.id === "hirebrew" ? "Designated HR target. API contract awaiting confirmation." : "Client-owned system. The source contract is agreed during discovery."}</span>}<a href="#contact">Discuss this integration <ArrowRight size={13} /></a></div></details>
                </article>)}</div>
                {matches.length === 0 && <div className="connect-empty"><Search size={27} /><h3>No matches in this view.</h3><p>Try a different system, broaden your category or clear the filters.</p><button type="button" className="brand-button" onClick={reset}>Show all integration targets <ArrowRight size={16} /></button></div>}
                <div className="connect-methodology"><h3>Chosen for useful work. Backed by research.</h3><p>Our shortlist considers business relevance, documented interfaces and governance needs—not paid placement or a universal “best” ranking. Vendor references explain the source technology; they do not prove a working Databrew connection. Confirm editions, licensing, permissions and live-provider acceptance during your pilot.</p><p>Hirebrew is the only People & HR platform in this catalogue. Multi-product suites are listed for their non-HR capabilities.</p></div>
            </div>
        </div>
    </section>;
}
