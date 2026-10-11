/**
 * Vertical packs, the naming rule, connectors, deployment postures and the
 * shipping record.
 *
 * These four sections are the "what you actually get" half of the page. The
 * reference site earns trust with an integrations wall and a deployment matrix;
 * ours does the same, in our language and with our restraint. No colour appears
 * anywhere here except the single live tag on a sealed deployment — that one is
 * live state, and it is the point of the row.
 *
 * Everything reads from lib/aios.ts. Nothing here is a server-side surprise:
 * no hooks, no handlers, no clock — so this file stays a server component. That
 * is also why the class conditionals are written out longhand rather than run
 * through cx(): cx lives in a "use client" module, and a server component may
 * render client components but may not call functions out of them.
 */

import { AnimatedDemo } from "@/components/animated-demo";
import { FEATURE_DEMOS } from "@/lib/demo-scenarios";

import { CONNECTOR_GROUPS, DEPLOYMENTS, PACKS, TIMELINE, deriveInstance } from "@/lib/aios";
import { Eyebrow, Reveal, SectionHead, Tag } from "@/components/ui";

/* ────────────────────────────────────────────────────────────────────────────
   Vertical packs
   ──────────────────────────────────────────────────────────────────────── */

/** Worked examples for the naming rule. Each instance is derived, never typed. */
const NAMING_EXAMPLES: { initials: string; org: string }[] = [
    { initials: "CBN", org: "Central Bank of Nigeria" },
    { initials: "SEEPCO", org: "Sterling Oil Exploration & Energy Production" },
    { initials: "MWH", org: "Ministry of Works & Housing" },
];

export function Packs() {
    return (
        <section id="packs" className="section">
            <div className="shell">
                <SectionHead
                    eyebrow="Vertical packs"
                    title="Install a pack, get a working product."
                    body="A pack ships the agents, connectors, taxonomy, compliance profile, KPI baseline and rollout plan for one industry — so what arrives is not a blank platform but a working product for that sector."
                />

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-14 md:gap-5">
                    {PACKS.map((p, i) => {
                        /* A federated pack carries its constituent services, and its card
                           has to name them. "Federates four uniformed services" tells a
                           reader nothing; NIS, NCoS, NSCDC and FFS with their remits tells
                           them what they are buying. It is also why this one card is wide. */
                        const services = p.services ?? [];
                        const federated = services.length > 0;
                        return (
                            <Reveal key={p.id} delay={i * 60} className={federated ? "h-full sm:col-span-2" : "h-full"}>
                                <article className="card flex h-full flex-col p-6 transition-colors hover:border-hairline-2 md:p-7">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="t-mono inline-flex items-center rounded-full border border-hairline bg-sunk px-3 py-0.5">
                                            {p.instance}
                                        </span>
                                        <span className="t-micro text-ink-3">{p.short}</span>
                                    </div>

                                    <h3 className="t-h3 mt-5">{p.name}</h3>
                                    <p className="t-card mt-2 max-w-[52ch] text-ink-2">{p.blurb}</p>

                                    {federated && (
                                        <div className="mt-5 rounded-tile bg-sunk px-4 py-4 md:px-5">
                                            <p className="t-small text-ink-2">
                                                Four uniformed services, one instance. Each keeps its own records and its own
                                                clearance inside {p.instance} — the parent ministry sees across them, the services
                                                do not see across each other.
                                            </p>
                                            {/* One row per service: the abbreviation its officers
                                                use, the name it is gazetted under, and what it
                                                actually does. Hairline gaps rather than borders,
                                                so four rows read as one register. */}
                                            <div className="mt-4 grid gap-px overflow-hidden rounded-tile bg-hairline sm:grid-cols-2">
                                                {services.map((s) => (
                                                    <div key={s.id} className="min-w-0 bg-surface px-4 py-3.5">
                                                        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                                            <span className="t-mono shrink-0 text-ink">{s.abbr}</span>
                                                            <span className="t-small min-w-0 text-ink-2">{s.name}</span>
                                                        </p>
                                                        <p className="t-small mt-1.5 text-ink-3">{s.remit}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fixed two-row shape. The widest posture cannot share a line with
                                        the counts at card width, and a strip that wraps on some cards and
                                        not others leaves the dividers ragged across a row. */}
                                    <div className="mt-auto border-t border-hairline pt-4 md:pt-5">
                                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <Spec value={p.agents} label="agents" />
                                            <Dot />
                                            <Spec value={p.connectors} label="connectors" />
                                        </p>
                                        <p className="t-small mt-1 text-ink-3">{p.deployment}</p>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>

                <NamingRule />
            </div>
        </section>
    );
}

function Dot() {
    return (
        <span className="text-ink-4" aria-hidden>
            ·
        </span>
    );
}

function Spec({ value, label }: { value: number; label: string }) {
    return (
        <span className="inline-flex items-baseline gap-1.5">
            <span className="t-mono text-ink">{value}</span>
            <span className="t-small text-ink-3">{label}</span>
        </span>
    );
}

/**
 * The naming rule. A generic platform arrives already wearing the customer's
 * name: take the organisation's initial, prefix it onto AIOS. Quiet panel,
 * memorable idea — the derived names are computed, not written.
 */
function NamingRule() {
    return (
        <Reveal delay={120}>
            {/* The split only earns its keep at lg — at tablet width the two
                columns would starve the worked examples to ~100px each. */}
            <div className="card mt-6 grid gap-8 p-6 md:mt-10 md:p-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
                <div>
                    <Eyebrow>The naming rule</Eyebrow>
                    <p className="t-h3 mt-4">Your initial, prefixed onto AIOS.</p>
                    <p className="t-small mt-2 text-ink-2">
                        The platform arrives already wearing the institution&rsquo;s name. Staff never learn a vendor
                        product — they learn their own system, and it is called what they are called.
                    </p>
                    <p className="t-mono mt-5 inline-block rounded-tile border border-hairline bg-sunk px-3 py-1.5 text-ink-2">
                        initials[0] + &ldquo;AIOS&rdquo;
                    </p>
                </div>

                <div className="grid gap-px overflow-hidden rounded-tile bg-hairline sm:grid-cols-3">
                    {NAMING_EXAMPLES.map((x) => {
                        const derived = deriveInstance(x.initials);
                        return (
                            <div key={x.initials} className="flex flex-col bg-surface p-5">
                                <p className="flex items-center gap-2">
                                    {/* Same bordered tile as a connector letter — the two
                                        "one letter stands for a thing" ideas should rhyme. */}
                                    <span className="t-mono grid h-10 w-10 place-items-center rounded-tile border border-hairline-2 text-ink">
                                        {x.initials[0]}
                                    </span>
                                    <span className="t-mono text-ink-3">{x.initials.slice(1)}</span>
                                </p>
                                <p className="t-small mb-4 mt-3 text-ink-2">{x.org}</p>
                                {/* mt-auto keeps the three derived names on one line together,
                                    however many lines the organisation's name takes. */}
                                <p className="mt-auto flex items-center gap-2 border-t border-hairline pt-4">
                                    <span className="t-mono text-ink-4">&rarr;</span>
                                    <span className="t-mono">
                                        <span className="text-ink">{derived[0]}</span>
                                        <span className="text-ink-3">{derived.slice(1)}</span>
                                    </span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Reveal>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   Connectors
   ──────────────────────────────────────────────────────────────────────── */

export function Connectors() {
    return (
        <section id="integrations" className="section">
            <div className="shell">
                <SectionHead
                    eyebrow="Integrations"
                    title="Connected once, used everywhere."
                    body="Each source system is connected once, through one connector layer, and then serves both search and every agent that needs it. Read-only by default, and never in the transaction path."
                />

                <div className="card mt-12 overflow-hidden md:mt-14">
                    {CONNECTOR_GROUPS.map((g, i) => (
                        <Reveal key={g.letter} delay={i * 60}>
                            <div
                                className={
                                    i > 0
                                        ? "flex items-start gap-4 border-t border-hairline px-5 py-5 sm:gap-5 sm:px-7 sm:py-6"
                                        : "flex items-start gap-4 px-5 py-5 sm:gap-5 sm:px-7 sm:py-6"
                                }
                            >
                                <span className="t-mono grid h-10 w-10 shrink-0 place-items-center rounded-tile border border-hairline-2 text-ink">
                                    {g.letter}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="t-h3">{g.name}</h3>
                                        <span className="shrink-0">
                                            <Tag>Phase {g.phase}</Tag>
                                        </span>
                                    </div>
                                    <p className="t-small mt-1.5 text-ink-2">{g.examples}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   Deployment postures
   ──────────────────────────────────────────────────────────────────────── */

export function Deployments() {
    return (
        <section id="deployment" className="section">
            <div className="shell">
                <SectionHead eyebrow="Deployment" title="It runs where your data lives." />

                <Reveal delay={80}>
                    <div className="card mt-12 grid gap-px overflow-hidden bg-hairline sm:grid-cols-2 xl:grid-cols-4 md:mt-14">
                        {DEPLOYMENTS.map((d, i) => (
                            <div key={d.name} className="flex flex-col bg-surface p-6 md:p-7">
                                <span className="t-mono text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                                <h3 className="t-h3 mt-4">{d.name}</h3>
                                <p className="mt-3">
                                    {d.sealed ? <Tag tone="live">{d.egress}</Tag> : <Tag>{d.egress}</Tag>}
                                </p>
                                <p className="t-small mt-4 text-ink-2">{d.note}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>

                {/* A deployment illustration, not evidence of provisioned infrastructure. */}
                <Reveal delay={140}>
                    <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[1fr_1.62fr] lg:items-center lg:gap-14">
                        <div>
                            <Eyebrow>Posture, made visible</Eyebrow>
                            <p className="t-h3 mt-4">A clear route through your boundary.</p>
                            <p className="t-small mt-3 text-ink-2">
                                See an example of source retrieval and model routing inside a private boundary.
                                The animation makes the intended route visible without connecting to infrastructure.
                            </p>
                            <p className="t-small mt-3 text-ink-2">
                                Identity, network isolation and model serving must be provisioned and verified in
                                your environment. This illustration is a deployment conversation, not proof of certification.
                            </p>
                        </div>

                        <div className="min-w-0">
                            <AnimatedDemo scenario={FEATURE_DEMOS.deployment} compact />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   Track record
   ──────────────────────────────────────────────────────────────────────── */

export function Timeline() {
    const last = TIMELINE.length - 1;

    return (
        <section id="track-record" className="section">
            <div className="shell">
                <SectionHead eyebrow="Track record" title="What shipped, and when." />

                {/* Desktop: a horizontal rail. The final node is filled — that is where we are.
                    Five columns need lg; below that the rail stands on end instead.
                    The hairline is drawn per node, one column plus one gap wide, so it
                    joins the nodes exactly and stops at the last one. */}
                <div className="mt-14 hidden lg:block">
                    <ol className="grid grid-cols-5 gap-6">
                        {TIMELINE.map((t, i) => (
                            <li key={t.date} className="relative">
                                <Reveal delay={i * 60}>
                                    {i < last && (
                                        <span
                                            className="absolute left-0 top-[5px] h-px w-[calc(100%_+_24px)] bg-hairline"
                                            aria-hidden
                                        />
                                    )}
                                    <span
                                        className={
                                            i === last
                                                ? "block h-[11px] w-[11px] rounded-full border border-ink bg-ink"
                                                : "block h-[11px] w-[11px] rounded-full border border-hairline-2 bg-surface"
                                        }
                                        aria-hidden
                                    />
                                    <p className="t-mono mt-5 text-ink-3">{t.date}</p>
                                    <h3 className="t-h3 mt-2">{t.title}</h3>
                                    <p className="t-small mt-1.5 text-ink-2">{t.note}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Mobile: the same rail, stood on end. */}
                <ol className="mt-10 lg:hidden">
                    {TIMELINE.map((t, i) => (
                        <li key={t.date} className="relative pb-8 pl-7 last:pb-0">
                            <span
                                className={
                                    i === last
                                        ? "absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full border border-ink bg-ink"
                                        : "absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full border border-hairline-2 bg-surface"
                                }
                                aria-hidden
                            />
                            {i < last && (
                                <span className="absolute -bottom-[5px] left-[5px] top-4 w-px bg-hairline" aria-hidden />
                            )}
                            <Reveal delay={i * 60}>
                                <p className="t-mono text-ink-3">{t.date}</p>
                                <h3 className="t-h3 mt-1">{t.title}</h3>
                                <p className="t-small mt-1 text-ink-2">{t.note}</p>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
