"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ConsoleDemo } from "@/components/demos";
import { DemoFrame, Pill, Reveal, SectionHead,} from "@/components/ui";
import { cx } from "@/lib/cx";
import { PACKS, type Pack, type ServiceSeed } from "@/lib/aios";
import { SERVICE_SHOTS, SHOTS } from "@/lib/portals";

/**
 * The signature section.
 *
 * The reference site puts a working widget above the fold and lets you change
 * what it is doing with a row of persona chips — you hear the product before
 * anyone asks you for an email address. This is our translation of that move:
 * the chips switch vertical pack, and the whole run re-seeds with that sector's
 * question, agents, documents and vocabulary.
 *
 * Two things are shown, because neither can prove what the other proves:
 *
 *   1. The real console — an actual screenshot of the running product, so the
 *      client sees the software they would be buying: the dark agent rail, the
 *      clearance selector, the ask bar.
 *   2. The same console mid-run — an animation, because a screenshot cannot
 *      show a plan being published, tool calls landing, or citations arriving.
 *
 * Both are seeded from the selected pack, so a chip swaps the screenshot and
 * restarts the run together. The demo is remounted on every change of run
 * (keyed on the run id) so it genuinely restarts rather than continuing with
 * new labels.
 *
 * A federated pack carries a second, quieter row beneath the first. The Ministry
 * of Interior is not one organisation but four uniformed services under one
 * instance, and a single run can only ever show one of them — a client watching
 * the fire service answer would never learn that immigration, corrections and
 * civil defence are in there too. The service row makes all four selectable, and
 * the ministry-wide run leads so the federation is the first thing seen. The
 * hierarchy is ministry → service, and the two rows are sized to say so.
 */

/**
 * Which capture the stage shows.
 *
 * Scope decides it, not just the pack. Selecting a service is not a relabelling
 * of one screen: each service has its own capture of IAIOS, because the product
 * genuinely differs by seat — a different rail of agents, a different information
 * class, a different clearance ceiling. Switching scope therefore changes the
 * software on screen, which is the whole claim the section is making.
 *
 * Only the Interior pack has captures of its own; the rest show CAIOS.
 */
function shotFor(packId: string, service: ServiceSeed | undefined) {
    if (service) {
        const s = SERVICE_SHOTS[service.id];
        if (s) return { src: s.src, alt: s.alt };
    }
    return packId === "ministry-interior"
        ? {
              src: SHOTS.consoleInterior,
              alt:
                  "The AIOS agent console on IAIOS, the Federal Ministry of Interior instance: all ten agents in the dark left rail — Ministry Knowledge, Immigration & Border, Custodial Operations, Infrastructure Protection, Fire Safety & Response, Policy & Migration Statistics, Correspondence & Approvals, Legal & Instruments, Audit & Compliance and Establishment & Finance — with the operator signed in at Confidential clearance on a private on-premise deployment.",
          }
        : {
              src: SHOTS.console,
              alt:
                  "The AIOS agent console on CAIOS, the Central Bank of Nigeria instance: eight agents in the dark left rail — Knowledge, Supervision, Policy & Research, Operations — with the examiner signed in at Confidential clearance on an air-gapped deployment.",
          };
}

/**
 * The page's own shorthand for a service, so the chip stays a chip: "NSCDC ·
 * Civil defence" rather than "NSCDC · Nigeria Security and Civil Defence Corps",
 * which would wrap the subordinate row onto two lines and cost it its
 * subordination. These are the same four words the pack blurb uses. Anything not
 * listed falls back to its full name, so a future federated pack still reads.
 */
const SERVICE_SHORT: Record<string, string> = {
    nis: "Immigration",
    ncos: "Corrections",
    nscdc: "Civil defence",
    ffs: "Fire",
};

/** Shared arrow-key behaviour for both chip rows. Returns -1 for other keys. */
function nextIndex(key: string, i: number, len: number) {
    const last = len - 1;
    if (key === "ArrowRight" || key === "ArrowDown") return i === last ? 0 : i + 1;
    if (key === "ArrowLeft" || key === "ArrowUp") return i === 0 ? last : i - 1;
    if (key === "Home") return 0;
    if (key === "End") return last;
    return -1;
}

export function ConsoleExplorer() {
    const [active, setActive] = useState(0);
    /** 0 is the whole ministry; 1..n scope the run to one service. */
    const [scope, setScope] = useState(0);
    const chips = useRef<(HTMLButtonElement | null)[]>([]);
    const subChips = useRef<(HTMLButtonElement | null)[]>([]);

    const pack = PACKS[active];
    const services = pack.services ?? [];
    const service = scope > 0 ? services[scope - 1] : undefined;
    const shot = shotFor(pack.id, service);
    const portal = service ? SERVICE_SHOTS[service.id] : undefined;

    /** Switching pack drops any service scope — the new pack's services differ. */
    function selectPack(i: number) {
        setActive(i);
        setScope(0);
    }

    function onPackKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
        const next = nextIndex(e.key, i, PACKS.length);
        if (next < 0) return;
        e.preventDefault();
        selectPack(next);
        chips.current[next]?.focus();
    }

    function onScopeKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
        const next = nextIndex(e.key, i, services.length + 1);
        if (next < 0) return;
        e.preventDefault();
        setScope(next);
        subChips.current[next]?.focus();
    }

    /**
     * One run id per selection, so the miniature remounts and replays from the
     * prompt rather than swapping labels under a run already in progress.
     */
    const runId = service ? `${pack.id}-${service.id}` : pack.id;
    const runPack: Pack = service ? { ...pack, id: runId, seed: service.seed } : pack;
    const activeTabId = service ? `service-tab-${service.id}` : `pack-tab-${pack.id}`;

    const spec: { label: string; value: string; mono?: boolean }[] = service
        ? [
              { label: "Leading agent", value: service.agent },
              { label: "Classes owned", value: service.classes },
              { label: "Deployment posture", value: pack.deployment },
              { label: "Instance name", value: pack.instance, mono: true },
          ]
        : [
              { label: "Agents installed", value: `${pack.agents}` },
              { label: "Connectors", value: `${pack.connectors}` },
              { label: "Deployment posture", value: pack.deployment },
              { label: "Instance name", value: pack.instance, mono: true },
          ];

    return (
        <section id="console" className="section">
            <div className="shell">
                <Reveal>
                    <SectionHead
                        eyebrow="See it run"
                        title="Watch it work before you talk to us."
                        body="This is a real agent run, not a recording. It publishes its plan before it starts, calls its tools against the connected systems, and cites every document it read."
                    />
                </Reveal>

                {/* Pack chips — selecting one re-seeds everything below. */}
                <Reveal delay={80}>
                    <div className="mt-10">
                        <p className="t-micro mb-3 text-ink-3">Vertical pack</p>
                        <div
                            role="tablist"
                            aria-label="Vertical pack"
                            aria-orientation="horizontal"
                            className="scroll-slim -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
                        >
                            {PACKS.map((p, i) => {
                                const on = i === active;
                                return (
                                    <button
                                        key={p.id}
                                        ref={(el) => {
                                            chips.current[i] = el;
                                        }}
                                        id={`pack-tab-${p.id}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={on}
                                        aria-controls="console-stage"
                                        tabIndex={on ? 0 : -1}
                                        onClick={() => selectPack(i)}
                                        onKeyDown={(e) => onPackKeyDown(e, i)}
                                        className={cx(
                                            "pill pill-sm shrink-0",
                                            on ? "bg-ink text-white" : "pill-secondary",
                                        )}
                                    >
                                        {p.short}
                                        {on && (
                                            <span className="t-mono text-[11px] opacity-55">{p.instance}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* The second row exists only where there is a federation to
                            show. Smaller, outlined rather than filled, and labelled
                            in the lightest ink on the page, so it reads as a scope
                            inside the pack above rather than a rival to it. */}
                        {services.length > 0 && (
                            <div className="mt-5">
                                <p id="service-scope-label" className="t-micro mb-2 text-ink-4">
                                    Scope
                                </p>
                                <div
                                    role="tablist"
                                    aria-labelledby="service-scope-label"
                                    aria-orientation="horizontal"
                                    className="scroll-slim -mx-6 flex gap-1.5 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
                                >
                                    {[null, ...services].map((sv, i) => {
                                        const on = i === scope;
                                        const id = sv ? `service-tab-${sv.id}` : "service-tab-all";
                                        return (
                                            <button
                                                key={id}
                                                ref={(el) => {
                                                    subChips.current[i] = el;
                                                }}
                                                id={id}
                                                type="button"
                                                role="tab"
                                                aria-selected={on}
                                                aria-controls="console-stage"
                                                tabIndex={on ? 0 : -1}
                                                onClick={() => setScope(i)}
                                                onKeyDown={(e) => onScopeKeyDown(e, i)}
                                                className={cx(
                                                    "inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] leading-none transition-colors",
                                                    on
                                                        ? "border-ink-4 bg-sunk text-ink"
                                                        : "border-hairline bg-surface text-ink-3 hover:border-hairline-2 hover:text-ink-2",
                                                )}
                                            >
                                                {sv ? (
                                                    <>
                                                        <span className="t-mono text-[11px]">{sv.abbr}</span>
                                                        <span className="text-ink-4" aria-hidden>
                                                            ·
                                                        </span>
                                                        <span>{SERVICE_SHORT[sv.id] ?? sv.name}</span>
                                                    </>
                                                ) : (
                                                    "All services"
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="t-small mt-3 text-ink-3">
                                    {service
                                        ? `The same instance — ${pack.instance} — scoped to the ${service.name}.`
                                        : `One instance — ${pack.instance} — answering across every service at once, naming the owner of each figure.`}
                                </p>
                            </div>
                        )}
                    </div>
                </Reveal>

                <Reveal delay={140}>
                    <div
                        id="console-stage"
                        role="tabpanel"
                        aria-labelledby={activeTabId}
                        tabIndex={0}
                        className="mt-6 outline-none focus-visible:ring-2 focus-visible:ring-hairline-2"
                    >
                        {/* The product itself, full width — the screenshot is wide. It
                            follows the scope as well as the pack, because on a federated
                            instance the two are different screens: the ministry-wide seat
                            carries all ten agents, a service seat carries the two or three
                            licensed to it and stops at that seat's ceiling. */}
                        <div key={runId} className="a-fade">
                            <DemoFrame
                                label={
                                    portal
                                        ? `${pack.instance.toLowerCase()}.internal — ${service?.abbr.toLowerCase()} directorate`
                                        : `${pack.instance.toLowerCase()}.internal`
                                }
                            >
                                <Image
                                    src={shot.src}
                                    alt={shot.alt}
                                    width={2880}
                                    height={1800}
                                    sizes="(min-width: 1248px) 1152px, 100vw"
                                    priority={active === 0}
                                    className="block h-auto w-full"
                                />
                            </DemoFrame>
                        </div>
                        {portal && service ? (
                            <div key={`cap-${runId}`} className="a-fade mt-4">
                                {/* Deliberately no class count here. The service owns two of
                                    the nine information classes; this one directorate seat
                                    works in one of them, and printing both numbers a hand's
                                    width apart reads as a contradiction rather than as the
                                    distinction it is. The agent count carries the same point
                                    and clashes with nothing. */}
                                <p className="t-small text-ink-3">
                                    One directorate seat inside {pack.instance}: {portal.title}, at{" "}
                                    {portal.reach.ceiling} clearance, working in {portal.scope.toLowerCase()}{" "}
                                    with {portal.reach.agents} agents licensed to it —{" "}
                                    {portal.rail.join(", ")}. Material above the ceiling is withheld, not
                                    summarised.
                                </p>
                                <p className="t-small mt-2 text-ink-3">
                                    Switch the scope above — the rail, the reach and the ceiling all change
                                    with it, because they are different seats in the same instance.
                                </p>
                            </div>
                        ) : (
                            <p className="t-small mt-4 text-ink-3">
                                Switch the pack above — the agents, the documents and the vocabulary all
                                change with it.
                            </p>
                        )}

                        <div className="mt-10 grid gap-8 lg:grid-cols-[1.62fr_1fr] lg:items-start lg:gap-12">
                            {/* The run. A screenshot cannot show a plan arriving. */}
                            <div className="min-w-0">
                                <div className="card overflow-hidden">
                                    <div className="flex items-center gap-3 border-b border-hairline bg-sunk/60 px-4 py-2.5">
                                        <p className="t-micro text-ink-3">What happens when you ask</p>
                                        <span className="t-mono ml-auto hidden shrink-0 text-[11px] text-ink-3 sm:inline">
                                            {pack.instance}
                                            {service ? ` · ${service.abbr}` : ""} · live run
                                        </span>
                                    </div>
                                    {/* Shorter than the standalone miniature — it plays under the
                                        screenshot, so it supports rather than competes. */}
                                    <div className="[&>div]:h-[360px] md:[&>div]:h-[300px]">
                                        <ConsoleDemo key={runId} pack={runPack} />
                                    </div>
                                </div>
                                <p className="t-small mt-3 text-ink-3">
                                    The same console, mid-run — plan, tool calls and citations as they
                                    arrive.
                                </p>
                            </div>

                            {/* The read-out. */}
                            <div className="min-w-0 border-t border-hairline pt-8 lg:border-t-0 lg:pt-1">
                                <div key={runId} className="a-fade">
                                    <h3 className="t-h3">{service ? service.name : pack.name}</h3>
                                    <p className="t-small mt-1 text-ink-3">
                                        {service
                                            ? `${service.abbr} · scoped inside ${pack.instance}, at ${pack.org}.`
                                            : `Installed at ${pack.org}.`}
                                    </p>
                                    <p className="t-card mt-4 text-ink-2">
                                        {service ? service.remit : pack.blurb}
                                    </p>

                                    <dl className="mt-7 border-t border-hairline">
                                        {spec.map((row) => (
                                            <div
                                                key={row.label}
                                                className="flex items-baseline justify-between gap-6 border-b border-hairline py-3"
                                            >
                                                <dt className="t-small shrink-0 text-ink-3">{row.label}</dt>
                                                <dd className={cx("min-w-0 text-right", row.mono ? "t-mono" : "t-small")}>
                                                    {row.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <p className="t-small mt-7 text-ink-2">
                                    All five configurations are the same platform — the same retrieval, the
                                    same clearance model, the same run trace. The pack decides which agents
                                    are installed, which systems they can reach, and what the words mean in
                                    your sector.
                                </p>

                                <div className="mt-6">
                                    <Pill href="#packs" variant="secondary" size="sm">
                                        Explore the packs →
                                    </Pill>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
