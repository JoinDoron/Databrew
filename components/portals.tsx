"use client";

import { AnimatedDemo } from "@/components/animated-demo";
import { FEATURE_DEMOS, portalScenario } from "@/lib/demo-scenarios";
import { useRef, useState } from "react";
import { PORTAL_CARDS } from "@/lib/portals";
import { Reveal, SectionHead, Pill, Tag } from "@/components/ui";
import { cx } from "@/lib/cx";

/** Six role-specific illustrative workspaces, all based on the existing portal catalogue. */
export function Portals() {
    const [active, setActive] = useState(PORTAL_CARDS[0].id);
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const card = PORTAL_CARDS.find((p) => p.id === active) ?? PORTAL_CARDS[0];

    return (
        <section id="portals" className="section border-t border-hairline">
            <div className="shell">
                <SectionHead
                    eyebrow="Who sees what"
                    title="One platform. Six portals."
                    body="AIOS is a different product depending on who signs in. The nav, the agents, the searchable corpus and the clearance ceiling all change with the seat — and the two strictest portals cannot reach document content at all."
                />

                {/* Portal selector */}
                <div
                    role="tablist"
                    aria-label="Portals"
                    className="scroll-slim mt-10 flex gap-2 overflow-x-auto pb-1"
                >
                    {PORTAL_CARDS.map((p, index) => {
                        const on = p.id === active;
                        return (
                            <button
                                key={p.id}
                                role="tab"
                                id={`portal-tab-${p.id}`}
                                aria-controls="portal-example"
                                tabIndex={on ? 0 : -1}
                                ref={element => { tabs.current[index] = element; }}
                                aria-selected={on}
                                onClick={() => setActive(p.id)}
                                onKeyDown={event => {
                                    const next = event.key === "ArrowRight" ? (index + 1) % PORTAL_CARDS.length : event.key === "ArrowLeft" ? (index + PORTAL_CARDS.length - 1) % PORTAL_CARDS.length : event.key === "Home" ? 0 : event.key === "End" ? PORTAL_CARDS.length - 1 : null;
                                    if (next === null) return;
                                    event.preventDefault(); setActive(PORTAL_CARDS[next].id); tabs.current[next]?.focus();
                                }}
                                className={cx(
                                    "pill pill-sm shrink-0",
                                    on ? "pill-primary" : "pill-secondary",
                                )}
                            >
                                {p.name}
                            </button>
                        );
                    })}
                </div>

                {/* min-w-0 on both tracks: a grid item defaults to min-width:auto, so
                    without it the frame's mono route label sets a min-content width
                    wider than the phone and the whole page scrolls sideways. */}
                <div id="portal-example" role="tabpanel" aria-labelledby={`portal-tab-${card.id}`} tabIndex={0} className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
                    {/* Role-specific illustration */}
                    <Reveal key={card.id} className="min-w-0">
                        <AnimatedDemo scenario={portalScenario(card)} compact />
                    </Reveal>

                    {/* What the seat can reach */}
                    <div className="min-w-0 lg:pt-2">
                        <p className="t-micro text-ink-3">{card.name} portal</p>
                        <h3 className="t-h2 mt-3">{card.persona}</h3>
                        <p className="t-body mt-1 text-ink-2">{card.title}</p>
                        <p className="t-body mt-5 text-ink-2">{card.summary}</p>

                        <dl className="mt-7 border-t border-hairline">
                            {[
                                ["Agents in scope", card.reach.agents],
                                ["Information classes", card.reach.classes],
                                ["Clearance ceiling", card.reach.ceiling],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-baseline justify-between border-b border-hairline py-3">
                                    <dt className="t-small text-ink-2">{k}</dt>
                                    <dd className="t-mono text-ink">{v}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6 rounded-tile border border-hairline bg-sunk p-4">
                            <p className="t-micro text-ink-3">The constraint</p>
                            <p className="t-card mt-2 text-ink">{card.constraint}</p>
                        </div>

                        <div className="mt-7">
                            <Pill variant="secondary" href="#contact">
                                Walk through the portals →
                            </Pill>
                        </div>
                    </div>
                </div>

                <p className="t-small mt-6 text-ink-3">
                    Animated examples use fictional content. Role configuration and live enforcement require deployment validation.
                </p>
            </div>
        </section>
    );
}

/**
 * The refusal state. Worth its own moment: a permission system that explains
 * itself reads as designed, where a 404 reads as broken.
 */
export function Refusal() {
    return (
        <section className="section border-t border-hairline">
            <div className="shell grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <div className="min-w-0">
                    <SectionHead
                        eyebrow="When a seat cannot reach something"
                        title="It explains itself."
                    />
                    <p className="t-body mt-4 text-ink-2">
                        An examiner opening connector administration does not get a dead end. AIOS names
                        the surface, names the portals that own it, states what the current seat can
                        reach instead, and explains the authorised access path.
                    </p>
                    <p className="t-body mt-4 text-ink-2">
                        In a live deployment the same refusal is a 403 and a denied verdict written to
                        the audit trail — so a blocked attempt is evidence, not silence.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2">
                        <Tag>403 to the caller</Tag>
                        <Tag tone="live">Denied verdict logged</Tag>
                        <Tag>Forwarded to SIEM</Tag>
                    </div>
                </div>

                <Reveal className="min-w-0">
                    <AnimatedDemo scenario={FEATURE_DEMOS.refusal} compact />
                </Reveal>
            </div>
        </section>
    );
}
