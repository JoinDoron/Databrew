"use client";

/** Feature-specific illustrations share one accessible animation timeline. */

import { AnimatedDemo } from "@/components/animated-demo";
import { FEATURE_DEMOS } from "@/lib/demo-scenarios";
import { Eyebrow, Pill, Reveal, SectionHead,} from "@/components/ui";
import { cx } from "@/lib/cx";
import { LAYERS, type Layer } from "@/lib/aios";


function two(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

/* ── Motifs ────────────────────────────────────────────────────────────────
 * Hairline only. No fill, no colour — the accent belongs to the demos.
 */

function StackMotif() {
    // Four indexed strata, drawn as isometric plates, fainter as they go down.
    const plates = [0, 1, 2, 3];
    return (
        <svg viewBox="0 0 260 132" fill="none" aria-hidden="true" className="h-auto w-full text-hairline-2">
            <line x1="130" y1="26" x2="130" y2="100" stroke="currentColor" strokeDasharray="2 5" />
            {plates.map((i) => (
                <path
                    key={i}
                    d="M130 4 L226 30 L130 56 L34 30 Z"
                    transform={`translate(0 ${i * 22})`}
                    stroke="currentColor"
                    strokeLinejoin="round"
                    opacity={1 - i * 0.18}
                />
            ))}
            <circle cx="130" cy="30" r="3" className="fill-surface" stroke="currentColor" />
        </svg>
    );
}

function GraphMotif() {
    // One coordinating node, six specialised ones, drawn as a flat graph.
    const nodes: [number, number][] = [
        [40, 30],
        [40, 102],
        [130, 14],
        [130, 118],
        [220, 30],
        [220, 102],
    ];
    return (
        <svg viewBox="0 0 260 132" fill="none" aria-hidden="true" className="h-auto w-full text-hairline-2">
            {nodes.map(([x, y], i) => (
                <line key={`s${i}`} x1="130" y1="66" x2={x} y2={y} stroke="currentColor" opacity={0.9} />
            ))}
            <line x1="40" y1="30" x2="130" y2="14" stroke="currentColor" strokeDasharray="2 5" opacity={0.7} />
            <line x1="220" y1="30" x2="130" y2="14" stroke="currentColor" strokeDasharray="2 5" opacity={0.7} />
            <line x1="40" y1="102" x2="220" y2="102" stroke="currentColor" strokeDasharray="2 5" opacity={0.5} />
            {nodes.map(([x, y], i) => (
                <circle key={`n${i}`} cx={x} cy={y} r="6" className="fill-surface" stroke="currentColor" />
            ))}
            <circle cx="130" cy="66" r="13" className="fill-surface" stroke="currentColor" />
            <circle cx="130" cy="66" r="4" className="fill-hairline-2" />
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── The fork ──────────────────────────────────────────────────────────── */

export function Fork() {
    return (
        <section id="architecture" className="section">
            <div className="shell">
                <Reveal>
                    <SectionHead
                        align="center"
                        eyebrow="The architecture"
                        title="Two layers. One foundation."
                        body="Search and agents are not two products stitched together. Both run on one model-serving layer, one index, one connector layer, one security model and one audit trail — so anything the foundation can find, an agent can reason over, under the same clearance and the same log."
                    />
                </Reveal>

                <div className="mt-14 grid gap-6 md:grid-cols-2">
                    {LAYERS.map((layer, i) => (
                        <Reveal key={layer.id} delay={i * 90}>
                            <article className="card flex h-full flex-col p-7 md:p-10">
                                <div className="rounded-tile border border-hairline bg-sunk/60 px-6 py-7">
                                    {layer.id === "foundation" ? <StackMotif /> : <GraphMotif />}
                                </div>

                                <div className="mt-8">
                                    <Eyebrow>Layer {two(i + 1)}</Eyebrow>
                                </div>
                                <h3 className="t-h2 mt-4">{layer.name}</h3>
                                <p className="t-body mt-3">{layer.tagline}</p>
                                <p className="t-card mt-4 text-ink-2">{layer.blurb}</p>

                                <a
                                    href={`#${layer.id}`}
                                    className="t-small mt-auto inline-flex items-center gap-2 pt-8 text-ink underline-offset-4 transition-colors hover:text-ink-2 hover:underline"
                                >
                                    Learn more
                                    <ArrowRight />
                                </a>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── The deep-dives ────────────────────────────────────────────────────────
 * Both sections are the same component so they stay visually identical; only
 * the layer changes.
 */

function LayerDetail({ layer }: { layer: Layer }) {
    return (
        <section id={layer.id} className="section">
            <div className="shell">
                <Reveal>
                    <SectionHead eyebrow={layer.name} title={layer.tagline} />
                </Reveal>

                <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
                    {layer.features.map((feature, i) => {
                        const flipped = i % 2 === 1;

                        return (
                            <Reveal key={feature.id}>
                                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                                    <div className={cx("md:pr-2", flipped && "md:order-2 md:pl-2 md:pr-0")}>
                                        <Eyebrow>{two(i + 1)}</Eyebrow>
                                        <h3 className="t-h3 mt-4">{feature.name}</h3>
                                        <p className="t-body mt-3 text-ink-2">{feature.body}</p>
                                    </div>

                                    <div className={cx("min-w-0", flipped && "md:order-1")}>
                                        <AnimatedDemo scenario={FEATURE_DEMOS[feature.id]} compact />
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                <Reveal className="mt-14 md:mt-20">
                    <div className="flex justify-center">
                        <Pill variant="secondary" href="#contact">
                            Talk to us about {layer.name}
                        </Pill>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

export function FoundationSection() {
    return <LayerDetail layer={LAYERS[0]} />;
}

export function AgentsSection() {
    return <LayerDetail layer={LAYERS[1]} />;
}
