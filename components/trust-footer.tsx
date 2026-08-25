/**
 * The closing third of the page: sovereignty, the ask, and the map.
 *
 *   Trust    — the sharpest wedge AIOS has. Four guarantees, plus a live policy
 *              verdict, because showing the gate refuse something is worth more
 *              than a paragraph promising that it would.
 *   CtaBand  — one inverse band, one sentence, two pills.
 *   Footer   — the whole platform in four columns. AIOS only.
 *
 * No hooks and no handlers here, so this stays a server component; every
 * interactive piece it renders (Reveal, Pill, DemoFrame, GovernanceDemo) is a
 * client component in its own right.
 */

import { GovernanceDemo } from "@/components/demos";
import { DemoFrame, Eyebrow, Pill, Reveal, SectionHead,} from "@/components/ui";
import { cx } from "@/lib/cx";
import { DEPLOYMENTS, PACKS, TRUST } from "@/lib/aios";

/* ── Icons ─────────────────────────────────────────────────────────────────
 * Hairline strokes only — 1px, currentColor, no fills. They sit at ink-3 so
 * they read as annotation rather than decoration.
 */

type IconProps = { className?: string };

const svg = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

/** A perimeter with the estate sitting inside it. */
function IconPerimeter({ className }: IconProps) {
    return (
        <svg {...svg} className={className}>
            <rect x="2.5" y="4.5" width="27" height="23" rx="3" strokeDasharray="2.5 3.5" opacity="0.6" />
            <rect x="9.5" y="11.5" width="13" height="9" rx="1.5" />
            <path d="M12.5 15h7M12.5 17.5h4" opacity="0.55" />
        </svg>
    );
}

/** No outbound path. */
function IconLock({ className }: IconProps) {
    return (
        <svg {...svg} className={className}>
            <rect x="7.5" y="14.5" width="17" height="12" rx="2.5" />
            <path d="M11.5 14.5V11a4.5 4.5 0 0 1 9 0v3.5" />
            <circle cx="16" cy="19.5" r="1.5" />
            <path d="M16 21v2.5" />
        </svg>
    );
}

/** Clearance tiers — the top one dashed, because it was removed before ranking. */
function IconTiers({ className }: IconProps) {
    return (
        <svg {...svg} className={className}>
            <path d="M6.5 25.5h19" />
            <path d="M9 20.5h14" />
            <path d="M11.5 15.5h9" />
            <path d="M14 10.5h4" strokeDasharray="2 2.5" opacity="0.5" />
        </svg>
    );
}

/** An append-only log line. */
function IconLog({ className }: IconProps) {
    return (
        <svg {...svg} className={className}>
            <path d="M6.5 7v18" opacity="0.45" />
            <circle cx="6.5" cy="10.5" r="1.4" />
            <circle cx="6.5" cy="16.5" r="1.4" />
            <circle cx="6.5" cy="22.5" r="1.4" />
            <path d="M11 10.5h15M11 16.5h10M11 22.5h13.5" />
        </svg>
    );
}

const TRUST_ICONS = [IconPerimeter, IconLock, IconTiers, IconLog];

/* ── Trust ─────────────────────────────────────────────────────────────── */

export function Trust() {
    return (
        <section id="security" className="section scroll-mt-24">
            <div className="shell">
                <Reveal>
                    <SectionHead
                        eyebrow="Sovereignty"
                        title="Your data does not leave your building."
                        body="Most of what an institution knows is exactly the material it cannot let out of the building. AIOS is built for that constraint first — the deployment posture, the clearance model and the audit trail are part of the platform, not an enterprise add-on."
                    />
                </Reveal>

                <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* The four guarantees, as one quadrant object rather than four cards. */}
                    <Reveal delay={60} className="lg:col-span-7">
                        <div className="card overflow-hidden">
                            <div className="grid sm:grid-cols-2">
                                {TRUST.map((t, i) => {
                                    const Icon = TRUST_ICONS[i] ?? IconPerimeter;
                                    return (
                                        <div
                                            key={t.title}
                                            className={cx(
                                                "p-7 sm:p-8",
                                                i > 0 && "border-t border-hairline",
                                                i === 1 && "sm:border-t-0",
                                                i % 2 === 1 && "sm:border-l sm:border-hairline",
                                            )}
                                        >
                                            <Icon className="h-8 w-8 text-ink-3" />
                                            <h3 className="t-h3 mt-6">{t.title}</h3>
                                            <p className="t-card mt-2.5 text-ink-2">{t.body}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline bg-sunk/50 px-7 py-4 sm:px-8">
                                <span className="t-micro text-ink-3">Postures</span>
                                {DEPLOYMENTS.map((d, i) => (
                                    <span key={d.name} className="t-mono text-ink-2">
                                        {i > 0 && <span className="mr-3 text-ink-4">·</span>}
                                        {d.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    {/* The gate itself. A verdict beats a promise. */}
                    <Reveal delay={140} className="lg:col-span-5">
                        <div className="mb-4 flex items-baseline justify-between gap-4">
                            <Eyebrow>The gate</Eyebrow>
                            <span className="t-mono text-ink-3">pre-retrieval · pre-tool</span>
                        </div>

                        <DemoFrame label="policy gate">
                            <GovernanceDemo />
                        </DemoFrame>

                        <p className="t-small mt-4 text-ink-2">
                            The same gate runs before every retrieval and before every tool call. Material above the
                            caller&rsquo;s tier is removed before ranking — and the verdict is written to the run trace
                            either way, whether it allowed the step or refused it.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ── CTA band ──────────────────────────────────────────────────────────── */

export function CtaBand() {
    return (
        <section id="contact" className="on-dark scroll-mt-24 bg-inverse">
            <div className="shell py-28 md:py-36">
                <Reveal>
                    <h2 className="t-display max-w-[15ch] text-surface">
                        Tell us what your institution is trying to do.
                    </h2>
                    <p className="t-body mt-7 max-w-[54ch] text-surface/55">
                        Bring us a function, the systems around it and the clearance it has to respect. We will come
                        back with the pack that fits, the connectors it needs, and where it can run.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-3">
                        <Pill href="#contact">Talk to us</Pill>
                        <Pill href="#console" variant="secondary">
                            See it run
                        </Pill>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ── Footer ────────────────────────────────────────────────────────────── */

type FootLink = { label: string; href: string };

const COLUMNS: { title: string; links: FootLink[] }[] = [
    {
        title: "Platform",
        links: [
            { label: "Knowledge Foundation", href: "#foundation" },
            { label: "Agent Layer", href: "#agents" },
            { label: "Connectors", href: "#connectors" },
            { label: "Governance", href: "#security" },
            { label: "Deployment", href: "#deploy" },
        ],
    },
    {
        title: "Packs",
        links: PACKS.map((p) => ({ label: p.short, href: "#packs" })),
    },
    {
        title: "Company",
        links: [
            { label: "About 13Labs", href: "#about" },
            { label: "Careers", href: "#careers" },
            { label: "Contact", href: "#contact" },
            { label: "Security", href: "#security" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "#privacy" },
            { label: "Terms", href: "#terms" },
            { label: "Data processing", href: "#data-processing" },
            { label: "Trust centre", href: "#trust-centre" },
        ],
    },
];

const SOCIAL: FootLink[] = [
    { label: "LinkedIn", href: "#linkedin" },
    { label: "X", href: "#x" },
    { label: "GitHub", href: "#github" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="t-small text-ink-2 transition-colors hover:text-ink">
            {children}
        </a>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-hairline">
            <div className="shell pt-20 pb-10 md:pt-24">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    {/* What the product is, in one paragraph. */}
                    <div className="lg:col-span-4">
                        <p className="t-h3">AIOS</p>
                        <p className="t-small mt-3 max-w-[38ch] text-ink-2">
                            A private AI platform for institutions. A knowledge foundation and an agent layer on one
                            substrate — installed as a vertical pack, deployed inside your perimeter.
                        </p>
                        <p className="t-mono mt-6 text-ink-3">
                            {PACKS.length} packs · {DEPLOYMENTS.length} deployment postures
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:col-span-8 lg:gap-x-6">
                        {COLUMNS.map((col) => (
                            <div key={col.title}>
                                <p className="t-micro text-ink-3">{col.title}</p>
                                <ul className="mt-5 flex flex-col gap-3">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <FooterLink href={l.href}>{l.label}</FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <a href="#" className="t-h3 tracking-[-0.2px] text-ink">
                            13Labs
                        </a>
                        <p className="t-small text-ink-3">© 2026 13Labs. A Unrealabs company.</p>
                    </div>

                    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {SOCIAL.map((s) => (
                            <FooterLink key={s.label} href={s.href}>
                                {s.label}
                            </FooterLink>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
