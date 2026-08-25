"use client";

import { useRef, useState } from "react";
import { ConsoleDemo } from "@/components/demos";
import { DemoFrame, Pill, Reveal, SectionHead,} from "@/components/ui";
import { cx } from "@/lib/cx";
import { PACKS } from "@/lib/aios";

/**
 * The signature section.
 *
 * The reference site puts a working widget above the fold and lets you change
 * what it is doing with a row of persona chips — you hear the product before
 * anyone asks you for an email address. This is our translation of that move:
 * the chips switch vertical pack, and the whole run re-seeds with that sector's
 * question, agents, documents and vocabulary.
 *
 * The demo is remounted on every pack change (keyed on pack.id) so the run
 * genuinely restarts rather than continuing with new labels.
 */
export function ConsoleExplorer() {
    const [active, setActive] = useState(0);
    const chips = useRef<(HTMLButtonElement | null)[]>([]);
    const pack = PACKS[active];

    function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
        const last = PACKS.length - 1;
        let next = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = last;
        if (next < 0) return;
        e.preventDefault();
        setActive(next);
        chips.current[next]?.focus();
    }

    const spec: { label: string; value: string; mono?: boolean }[] = [
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
                                        onClick={() => setActive(i)}
                                        onKeyDown={(e) => onKeyDown(e, i)}
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
                    </div>
                </Reveal>

                <Reveal delay={140}>
                    <div className="mt-6 grid gap-8 lg:grid-cols-[1.62fr_1fr] lg:items-start lg:gap-12">
                        {/* The stage. */}
                        <div
                            id="console-stage"
                            role="tabpanel"
                            aria-labelledby={`pack-tab-${pack.id}`}
                            tabIndex={0}
                            className="outline-none focus-visible:ring-2 focus-visible:ring-hairline-2"
                        >
                            <DemoFrame label={`${pack.instance.toLowerCase()}.internal`}>
                                <ConsoleDemo key={pack.id} pack={pack} />
                            </DemoFrame>
                            <p className="t-small mt-4 text-ink-3">
                                Switch the pack above — the agents, the documents and the vocabulary all
                                change with it.
                            </p>
                        </div>

                        {/* The read-out. */}
                        <div className="border-t border-hairline pt-8 lg:border-t-0 lg:pt-1">
                            <div key={pack.id} className="a-fade">
                                <h3 className="t-h3">{pack.name}</h3>
                                <p className="t-small mt-1 text-ink-3">Installed at {pack.org}.</p>
                                <p className="t-card mt-4 text-ink-2">{pack.blurb}</p>

                                <dl className="mt-7 border-t border-hairline">
                                    {spec.map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex items-baseline justify-between gap-6 border-b border-hairline py-3"
                                        >
                                            <dt className="t-small text-ink-3">{row.label}</dt>
                                            <dd className={cx("text-right", row.mono ? "t-mono" : "t-small")}>
                                                {row.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <p className="t-small mt-7 text-ink-2">
                                All five configurations are the same platform — the same retrieval, the same
                                clearance model, the same run trace. The pack decides which agents are
                                installed, which systems they can reach, and what the words mean in your
                                sector.
                            </p>

                            <div className="mt-6">
                                <Pill href="#packs" variant="secondary" size="sm">
                                    Explore the packs →
                                </Pill>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
