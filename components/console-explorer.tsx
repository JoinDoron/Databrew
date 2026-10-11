"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatedDemo } from "@/components/animated-demo";
import { Pill, Reveal, SectionHead } from "@/components/ui";
import { cx } from "@/lib/cx";
import { PACKS } from "@/lib/aios";
import { packScenario } from "@/lib/demo-scenarios";

const SERVICE_SHORT: Record<string, string> = { nis: "Immigration", ncos: "Corrections", nscdc: "Civil defence", ffs: "Fire" };
function nextIndex(key: string, i: number, len: number) {
    if (key === "ArrowRight" || key === "ArrowDown") return (i + 1) % len;
    if (key === "ArrowLeft" || key === "ArrowUp") return (i + len - 1) % len;
    if (key === "Home") return 0;
    if (key === "End") return len - 1;
    return -1;
}

export function ConsoleExplorer({ initialPack }: { initialPack?: string }) {
    const [active, setActive] = useState(() => Math.max(0, PACKS.findIndex(pack => pack.id === initialPack)));
    const [scope, setScope] = useState(0);
    const chips = useRef<(HTMLButtonElement | null)[]>([]);
    const subChips = useRef<(HTMLButtonElement | null)[]>([]);
    const pack = PACKS[active];
    const services = pack.services ?? [];
    const service = scope > 0 ? services[scope - 1] : undefined;
    const selectPack = (index: number) => { setActive(index); setScope(0); };
    function move(event: KeyboardEvent<HTMLButtonElement>, index: number, isService = false) {
        const next = nextIndex(event.key, index, isService ? services.length + 1 : PACKS.length);
        if (next < 0) return;
        event.preventDefault();
        if (isService) { setScope(next); subChips.current[next]?.focus(); }
        else { selectPack(next); chips.current[next]?.focus(); }
    }
    const spec = service ? [
        ["Leading agent", service.agent], ["Information classes", service.classes], ["Deployment posture", pack.deployment], ["Example instance", pack.instance],
    ] : [
        ["Configured agents", String(pack.agents)], ["Connector definitions", String(pack.connectors)], ["Deployment posture", pack.deployment], ["Example instance", pack.instance],
    ];
    return <section id="console" className="section"><div className="shell">
        <Reveal><SectionHead eyebrow="See it come together" title="Your world. A clearer way to work." body="Choose an industry. Watch a fictional question become a source-backed review draft. These animated illustrations use sample content—not live institutional systems." /></Reveal>
        <div className="mt-10"><p className="t-micro mb-3 text-ink-3">Vertical pack</p><div role="tablist" aria-label="Vertical pack" className="scroll-slim flex flex-wrap gap-2">
            {PACKS.map((item, i) => <button key={item.id} ref={el => { chips.current[i] = el; }} id={"pack-tab-" + item.id} type="button" role="tab" aria-selected={active === i} aria-controls="console-stage" tabIndex={active === i ? 0 : -1} onClick={() => selectPack(i)} onKeyDown={event => move(event, i)} className={cx("pill pill-sm", active === i ? "bg-ink text-white" : "pill-secondary")}>{item.short}</button>)}
        </div></div>
        {services.length > 0 && <div className="mt-5"><p id="service-scope-label" className="t-micro mb-3 text-ink-3">Explore each service</p><div role="tablist" aria-labelledby="service-scope-label" className="flex flex-wrap gap-2">{[null, ...services].map((item, i) => <button key={item?.id ?? "all"} ref={el => { subChips.current[i] = el; }} type="button" role="tab" id={"service-tab-" + (item?.id ?? "all")} aria-selected={scope === i} aria-controls="console-stage" tabIndex={scope === i ? 0 : -1} onClick={() => setScope(i)} onKeyDown={event => move(event, i, true)} className={cx("pill pill-sm", scope === i ? "pill-primary" : "pill-secondary")}>{item ? item.abbr + " · " + (SERVICE_SHORT[item.id] ?? item.name) : "Ministry-wide"}</button>)}</div></div>}
        <div role="tabpanel" id="console-stage" aria-labelledby={services.length ? "service-tab-" + (service?.id ?? "all") : "pack-tab-" + pack.id} tabIndex={0} className="mt-7 outline-none focus-visible:ring-2 focus-visible:ring-hairline-2">
            <AnimatedDemo scenario={packScenario(pack, service)} />
            <div className="mt-9 grid gap-8 lg:grid-cols-2 lg:gap-16"><div><p className="t-micro text-ink-3">The context behind this example</p><h3 className="t-h3 mt-3">{service?.name ?? pack.name}</h3><p className="t-body mt-3 text-ink-2">{service?.remit ?? pack.blurb}</p><p className="t-small mt-4 text-ink-3">Switch the selection above to change the question, sources and review draft. Each service keeps its own responsibilities and scope.</p><div className="mt-6"><Pill href="#packs" variant="secondary" size="sm">Explore the packs →</Pill></div></div><dl className="border-t border-hairline">{spec.map(([label, value]) => <div key={label} className="flex items-baseline justify-between gap-6 border-b border-hairline py-3"><dt className="t-small text-ink-3">{label}</dt><dd className="t-small text-right">{value}</dd></div>)}</dl></div>
        </div>
    </div></section>;
}
