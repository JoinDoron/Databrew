"use client";

/**
 * The live miniatures.
 *
 * These stand in for screenshots everywhere on the page. The rule they all obey:
 * you should feel like you are watching AIOS run, not looking at a diagram of it.
 *
 * One visual family — hairline borders, mono numerics, accent reserved for live
 * state. Every animation is stepped off `useTick` (a counter), never wall-clock
 * time, so the server and the client always agree on the first frame. Each demo
 * pauses when it is off-screen.
 */

import { useEffect, useMemo, useRef, type ComponentType } from "react";
import { ArrowRight, Ban, Check, FileText, Lock, ScanLine, Search, ShieldCheck } from "lucide-react";
import {
    CONNECTOR_GROUPS,
    DEPLOYMENTS,
    PACKS,
    deriveInstance,
    type Feature,
    type Pack,
} from "@/lib/aios";
import { LiveDot, Tag, useInView, useTick } from "@/components/ui";
import { cx } from "@/lib/cx";

/* ── shared ─────────────────────────────────────────────────────────────── */

type State = "idle" | "run" | "done";

/** Every miniature is the same height so the page never reflows between them. */
const BOX = "flex h-[400px] w-full flex-col";
const PANE = "scroll-slim flex h-[400px] w-full flex-col gap-2.5 overflow-y-auto p-4 md:p-5";
/** Row-dense miniatures own their spacing rather than inheriting the pane gap. */
const LIST = "scroll-slim flex h-[400px] w-full flex-col overflow-y-auto p-4 md:p-5";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Thousands separators without `toLocaleString` — locale-stable across render. */
function fmt(n: number) {
    const s = String(Math.round(n));
    let out = "";
    for (let i = 0; i < s.length; i++) {
        if (i > 0 && (s.length - i) % 3 === 0) out += ",";
        out += s[i];
    }
    return out;
}

/** Deterministic short digest — stands in for a run hash. */
function hash8(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
}

function Head({ title, right }: { title: string; right?: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <p className="t-micro text-ink-3">{title}</p>
            {right != null && <span className="t-mono ml-auto text-[11px] text-ink-3">{right}</span>}
        </div>
    );
}

function Status({ s }: { s: State }) {
    if (s === "done")
        return (
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-live-soft">
                <Check className="h-2.5 w-2.5 text-live" strokeWidth={2.5} />
            </span>
        );
    if (s === "run")
        return (
            <span
                className="a-spin h-4 w-4 shrink-0 rounded-full border-[1.5px] border-hairline-2"
                style={{ borderTopColor: "var(--color-accent)" }}
            />
        );
    return <span className="h-4 w-4 shrink-0 rounded-full border border-hairline-2" />;
}

/** The "thinking" line — a sweep across the text, not a spinner. */
function Shimmer({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="t-small"
            style={{
                backgroundImage:
                    "linear-gradient(90deg, var(--color-ink-3) 30%, var(--color-ink) 50%, var(--color-ink-3) 70%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "sweep 2s linear infinite",
            }}
        >
            {children}
        </span>
    );
}

function Caret() {
    return (
        <span
            className="ml-[2px] inline-block h-[13px] w-[2px] translate-y-[2px] bg-accent align-baseline"
            style={{ animation: "fade 640ms ease-in-out infinite alternate" }}
        />
    );
}

/* ── 1. Console — the hero. You watch the agent work. ───────────────────── */

export function ConsoleDemo({ pack = PACKS[0] }: { pack?: Pack }) {
    // Re-keyed so switching vertical pack restarts the run from the prompt.
    return <ConsoleRun key={pack.id} pack={pack} />;
}

function ConsoleRun({ pack }: { pack: Pack }) {
    const { ref, inView } = useInView<HTMLDivElement>();
    const s = pack.seed;
    const n = Math.max(s.plan.length, s.tools.length);
    const T_PLAN = 3;
    const T_RUN = 4;
    const T_CITE = T_RUN + n * 2;
    const T_ANS = T_CITE + 1;
    const T_END = T_ANS + 3;
    const t = useTick(620, T_END + 4, inView);

    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        for (const r of [leftRef, rightRef]) if (r.current) r.current.scrollTop = r.current.scrollHeight;
    }, [t]);

    const step = (i: number): State =>
        t >= T_RUN + i * 2 + 1 ? "done" : t >= T_RUN + i * 2 ? "run" : "idle";
    const done = s.plan.reduce((a, _, i) => a + (step(i) === "done" ? 1 : 0), 0);
    const typed = s.answer.slice(0, Math.ceil(s.answer.length * clamp01((t - T_ANS + 1) / 3)));
    const secs = (s.tools.reduce((a, x) => a + x.ms, 0) / 1000).toFixed(2);
    const status =
        t < 1 ? "awaiting prompt"
        : t < T_PLAN ? "authoring plan"
        : t < T_CITE ? `step ${Math.min(done + 1, n)} of ${n}`
        : t < T_END ? "composing answer"
        : "run complete";

    return (
        <div ref={ref} className={BOX}>
            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-2 md:grid-cols-[1.05fr_0.95fr] md:grid-rows-1">
                {/* conversation */}
                <div
                    ref={leftRef}
                    className="scroll-slim flex min-h-0 flex-col gap-3 overflow-y-auto border-b border-hairline p-4 md:border-r md:border-b-0 md:p-5"
                >
                    {t >= 1 && (
                        <div className="a-rise flex gap-2.5">
                            <span className="t-mono mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full border border-hairline text-[10px] text-ink-3">
                                Q
                            </span>
                            <p className="t-card">{s.prompt}</p>
                        </div>
                    )}

                    {t >= 2 && t < T_PLAN && (
                        <div className="a-fade flex items-center gap-2 pl-[30px]">
                            <LiveDot tone="accent" />
                            <Shimmer>Thinking</Shimmer>
                        </div>
                    )}

                    {t >= T_PLAN && (
                        <div className="a-rise rounded-tile border border-hairline bg-sunk/50 p-2.5">
                            <p className="t-micro mb-2 text-ink-3">Plan · published before it starts</p>
                            <div className="flex flex-col gap-1.5">
                                {s.plan.map((p, i) => (
                                    <div key={p} className="flex items-start gap-2">
                                        <span className="mt-[1px]">
                                            <Status s={step(i)} />
                                        </span>
                                        <span
                                            className={cx(
                                                "text-[13px] leading-[18px]",
                                                step(i) === "idle" ? "text-ink-3" : "text-ink",
                                            )}
                                        >
                                            {p}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {t >= T_CITE && (
                        <div className="a-rise flex flex-wrap gap-1.5">
                            {s.citations.map((c, i) => (
                                <span
                                    key={c}
                                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-hairline bg-surface py-1 pr-2.5 pl-2"
                                >
                                    <FileText className="h-3 w-3 shrink-0 text-accent" strokeWidth={1.5} />
                                    <span className="t-mono text-[10px] text-accent">{i + 1}</span>
                                    <span className="truncate text-[12px] text-ink-2">{c}</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {t >= T_ANS && (
                        <div className="a-rise">
                            <p className="t-micro mb-1.5 text-ink-3">Answer</p>
                            <p className="t-card">
                                {typed}
                                {t < T_ANS + 2 && <Caret />}
                            </p>
                        </div>
                    )}
                </div>

                {/* activity stream */}
                <div ref={rightRef} className="scroll-slim flex min-h-0 flex-col overflow-y-auto p-4 md:p-5">
                    <Head title="Activity" right={`${Math.min(Math.max(0, Math.ceil((t - T_RUN + 1) / 2)), s.tools.length)}/${s.tools.length}`} />
                    <div className="mt-2 flex flex-col">
                        {s.tools.map((tool, i) => {
                            const st = step(i);
                            if (st === "idle") return null;
                            return (
                                <div key={tool.label + tool.target} className="a-rise border-t border-hairline py-2.5 first:border-t-0 first:pt-0">
                                    <div className="flex items-center gap-2">
                                        <Status s={st} />
                                        <span className="truncate text-[13px] leading-[18px]">{tool.label}</span>
                                        <span className="t-mono ml-auto shrink-0 text-[11px] text-ink-3">
                                            {st === "done" ? `${tool.ms}ms` : "···"}
                                        </span>
                                    </div>
                                    <p className="t-mono mt-1 truncate pl-6 text-[11px] text-ink-3">{tool.target}</p>
                                    {st === "done" && (
                                        <p
                                            className={cx(
                                                "mt-0.5 truncate pl-6 text-[12px]",
                                                tool.result.startsWith("Allowed") ? "text-live" : "text-ink-2",
                                            )}
                                        >
                                            {tool.result}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                        {t < T_RUN && <p className="text-[12px] text-ink-4">Waiting for the first tool call…</p>}
                    </div>
                </div>
            </div>

            {/* run summary */}
            <div className="flex items-center gap-2 border-t border-hairline bg-sunk/40 px-4 py-2.5 md:px-5">
                {t >= T_END ? <Check className="h-3.5 w-3.5 text-live" strokeWidth={2} /> : <LiveDot tone="accent" />}
                <span className="truncate text-[12px] text-ink-2">{status}</span>
                <span className="t-mono ml-auto shrink-0 text-[11px] text-ink-3">
                    {n} steps · {s.tools.length} tools · {secs}s
                </span>
            </div>
        </div>
    );
}

/* ── 2. Search — hybrid retrieval, glossary expansion, clearance ────────── */

const QUERY = "forbearance";
const HITS = [
    {
        score: "0.94",
        title: "Circular — Regulatory Relief Measures",
        ref: "FPRD/CIR/2026/014",
        pre: "Institutions may apply for ",
        hit: "regulatory relief",
        post: " on exposures classified before the review date.",
        glossary: true,
    },
    {
        score: "0.91",
        title: "Prudential Guidelines — Restructuring",
        ref: "PRU/GL/2025 §3.4",
        pre: "Where ",
        hit: "forbearance",
        post: " is granted the facility retains its classification for two reporting cycles.",
        glossary: false,
    },
    {
        score: "0.76",
        title: "Examination Manual — Asset Quality",
        ref: "EXM/AQ §7",
        pre: "Examiners test the treatment of ",
        hit: "forbearance",
        post: " cases against the guideline threshold.",
        glossary: false,
    },
];

export function SearchDemo() {
    const { ref, inView } = useInView<HTMLDivElement>();
    const t = useTick(700, 10, inView);
    const typed = QUERY.slice(0, Math.ceil(QUERY.length * clamp01((t + 1) / 2)));

    return (
        <div ref={ref} className={PANE}>
            <div className="flex items-center gap-2.5 rounded-chip border border-hairline bg-surface px-3.5 py-2">
                <Search className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.5} />
                <span className="t-card truncate">
                    {typed}
                    {t < 2 && <Caret />}
                </span>
                <span className="t-mono ml-auto shrink-0 text-[11px] text-ink-3">hybrid</span>
            </div>

            {t >= 2 && (
                <div className="a-rise flex items-center gap-2 pl-1">
                    <span className="t-micro text-ink-3">Glossary</span>
                    <span className="t-mono truncate text-[11px] text-ink-2">forbearance</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-ink-3" strokeWidth={1.5} />
                    <span className="t-mono truncate text-[11px] text-live">regulatory relief</span>
                </div>
            )}

            <div className="flex flex-col">
                {HITS.map((r, i) =>
                    t >= 3 + i ? (
                        <div key={r.ref} className="a-rise border-t border-hairline py-2 first:border-t-0 first:pt-0">
                            <div className="flex items-center gap-2">
                                <span className="t-mono shrink-0 text-[11px] text-accent">{r.score}</span>
                                <span className="truncate text-[13px] leading-[18px]">{r.title}</span>
                                <span className="t-mono ml-auto hidden shrink-0 text-[11px] text-ink-3 sm:inline">
                                    {r.ref}
                                </span>
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-[12px] leading-[18px] text-ink-2">
                                {r.pre}
                                <mark
                                    className={cx(
                                        "rounded px-1",
                                        r.glossary ? "bg-live-soft text-live" : "bg-accent-soft text-accent",
                                    )}
                                >
                                    {r.hit}
                                </mark>
                                {r.post}
                            </p>
                        </div>
                    ) : null,
                )}
            </div>

            {t >= 6 && (
                <div className="a-rise rounded-tile border border-dashed border-hairline-2 bg-sunk/40 p-2.5">
                    <div className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.5} />
                        <span className="truncate text-[13px] text-ink-2">1 document withheld by your clearance</span>
                        <span className="ml-auto shrink-0">
                            <Tag tone="warn">Above your tier</Tag>
                        </span>
                    </div>
                    <p className="mt-1 text-[12px] leading-[18px] text-ink-3">
                        Removed before ranking. No title, snippet or metadata is returned.
                    </p>
                </div>
            )}

            <div className="mt-auto flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
                    <span className="h-2 w-2 rounded-[3px] bg-accent-soft ring-1 ring-accent/40" /> direct match
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
                    <span className="h-2 w-2 rounded-[3px] bg-live-soft ring-1 ring-live/40" /> glossary
                </span>
                <span className="t-mono ml-auto text-[11px] text-ink-3">3 shown · 1 withheld</span>
            </div>
        </div>
    );
}

/* ── 3. Connectors — one layer, six groups, incremental sync ────────────── */

const RECORDS = [128_400, 46_210, 9_840, 21_560, 63_120, 4_290];

export function ConnectorsDemo() {
    const { ref, inView } = useInView<HTMLDivElement>();
    const t = useTick(560, 18, inView);

    return (
        <div ref={ref} className={LIST}>
            <Head title="Connector layer" right={`${CONNECTOR_GROUPS.length} groups · read-only`} />
            <div className="mt-1 flex flex-col">
                {CONNECTOR_GROUPS.map((g, i) => {
                    const p = clamp01((t - i * 1.2) / 4);
                    const complete = p >= 1;
                    return (
                        <div
                            key={g.letter}
                            className="relative flex items-center gap-3 border-t border-hairline py-1.5 first:border-t-0"
                        >
                            <span className="t-mono grid h-7 w-7 shrink-0 place-items-center rounded-[8px] border border-hairline text-[11px] text-ink-2">
                                {g.letter}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-[13px] leading-[18px]">{g.name}</span>
                                    <span
                                        className={cx(
                                            "ml-auto shrink-0 rounded-full px-1.5 py-px text-[10px] leading-4",
                                            g.phase === 2 ? "bg-live-soft text-live" : "bg-sunk text-ink-3",
                                        )}
                                    >
                                        Phase {g.phase}
                                    </span>
                                    <span className="t-mono w-[58px] shrink-0 text-right text-[11px] text-ink-3">
                                        {fmt(RECORDS[i] * p)}
                                    </span>
                                </div>
                                <p className="truncate text-[11px] leading-4 text-ink-3">{g.examples}</p>
                            </div>
                            {/* the sync bar rides the row divider rather than taking a line of its own */}
                            <span
                                className={cx(
                                    "absolute bottom-0 left-10 h-[2px] rounded-full transition-[width] duration-500 ease-out",
                                    complete ? "bg-live" : "bg-accent",
                                )}
                                style={{ width: `calc(${p * 100}% - ${p * 40}px)` }}
                            />
                        </div>
                    );
                })}
            </div>
            <p className="mt-auto pt-3 text-[11px] leading-4 text-ink-3">
                Connected once, then served to search and to every agent. Phase 2 ships with the foundation; phase 4
                wires the line-of-business estate.
            </p>
        </div>
    );
}

/* ── 4. Governance — check_policy, then the audit line ──────────────────── */

const GATES = [
    {
        action: "search.retrieve",
        target: "Examination Report — Tier 1 institution",
        tier: "Internal",
        posture: DEPLOYMENTS[2],
        allowed: true,
        reason: "Requester is cleared to Internal and the material never leaves the perimeter.",
        at: "09:41:18",
        log: "policy.check · search.retrieve · ALLOW · internal",
    },
    {
        action: "egress.export",
        target: "Prudential Returns Summary — Q3 2026",
        tier: "Restricted",
        posture: DEPLOYMENTS[3],
        allowed: false,
        reason: "Restricted material has no egress path on an air-gapped deployment.",
        at: "09:41:26",
        log: "policy.check · egress.export · DENY · restricted",
    },
];
const PRIOR_LOG = [
    "09:40:52  policy.check · tool.invoke · ALLOW · internal",
    "09:41:04  policy.check · search.retrieve · ALLOW · public",
];

export function GovernanceDemo() {
    const { ref, inView } = useInView<HTMLDivElement>();
    const t = useTick(660, 14, inView);
    const g = GATES[t < 7 ? 0 : 1];
    const p = t % 7;

    const checks: [string, string, State][] = [
        ["Clearance tier", g.tier, p >= 2 ? "done" : p >= 1 ? "run" : "idle"],
        ["Deployment posture", `${g.posture.name} · ${g.posture.egress}`, p >= 3 ? "done" : p >= 2 ? "run" : "idle"],
        ["Egress rule", g.allowed ? "in-perimeter" : "blocked at the boundary", p >= 4 ? "done" : p >= 3 ? "run" : "idle"],
    ];

    return (
        <div ref={ref} className={PANE}>
            <Head title="check_policy" right="gate · every action" />

            {p < 1 && (
                <div className="rounded-tile border border-dashed border-hairline-2 p-3">
                    <div className="flex items-center gap-2">
                        <LiveDot tone="accent" />
                        <Shimmer>Awaiting the next action</Shimmer>
                    </div>
                    <p className="mt-1.5 text-[12px] text-ink-3">Nothing runs until the gate has cleared it.</p>
                </div>
            )}

            {p >= 1 && (
                <div className="a-rise rounded-tile border border-hairline p-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.5} />
                        <span className="t-mono truncate text-[12px]">{g.action}</span>
                        <span className="ml-auto shrink-0">
                            <Tag tone={g.tier === "Restricted" ? "warn" : "neutral"}>{g.tier}</Tag>
                        </span>
                    </div>
                    <p className="mt-1.5 truncate text-[12px] text-ink-2">{g.target}</p>
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                {checks.map(([label, value, st]) =>
                    st === "idle" ? null : (
                        <div key={label} className="a-fade flex items-center gap-2">
                            <Status s={st} />
                            <span className="shrink-0 text-[12px] text-ink-2">{label}</span>
                            <span className="t-mono ml-auto truncate text-[11px] text-ink-3">{value}</span>
                        </div>
                    ),
                )}
            </div>

            {p >= 5 && (
                <div
                    className={cx(
                        "a-rise rounded-tile p-3",
                        g.allowed ? "bg-live-soft" : "bg-warn-soft",
                    )}
                >
                    <div className="flex items-center gap-2">
                        {g.allowed ? (
                            <Check className={"h-4 w-4 shrink-0 text-live"} strokeWidth={2} />
                        ) : (
                            <Ban className="h-4 w-4 shrink-0 text-warn" strokeWidth={1.75} />
                        )}
                        <span className={cx("t-h3", g.allowed ? "text-live" : "text-warn")}>
                            {g.allowed ? "Allowed" : "Denied"}
                        </span>
                    </div>
                    <p className={cx("mt-1 text-[12px] leading-[18px]", g.allowed ? "text-live" : "text-warn")}>
                        {g.reason}
                    </p>
                </div>
            )}

            <div className="mt-auto border-t border-hairline pt-2.5">
                <p className="t-micro mb-1.5 text-ink-3">Immutable audit log</p>
                <div className="flex flex-col gap-0.5">
                    {PRIOR_LOG.map((l) => (
                        <p key={l} className="t-mono truncate text-[11px] text-ink-4">
                            {l}
                        </p>
                    ))}
                    {p >= 6 && (
                        <p className={cx("t-mono a-rise truncate text-[11px]", g.allowed ? "text-live" : "text-warn")}>
                            {g.at}  {g.log}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── 5. Install — a pack becomes a named instance ───────────────────────── */

const ORG = "Interior Ministry";
const STAGES: [string, string, number][] = [
    ["Provision cluster", "namespace · storage · secrets", 420],
    ["Build index", "taxonomy · glossary · embeddings", 1180],
    ["Wire connectors", "26 connectors · read-only", 860],
    ["Install agents", "10 agents · role bindings", 540],
    ["Run evaluation", "golden set · 240 queries", 1320],
];

export function InstallDemo() {
    const { ref, inView } = useInView<HTMLDivElement>();
    const t = useTick(620, 12, inView);
    const typed = ORG.slice(0, Math.ceil(ORG.length * clamp01(t)));
    const st = (i: number): State => (t >= 3 + i ? "done" : t >= 2 + i ? "run" : "idle");
    const complete = STAGES.reduce((a, _, i) => a + (st(i) === "done" ? 1 : 0), 0);
    const ready = t >= 3 + STAGES.length;

    return (
        <div ref={ref} className={PANE}>
            <Head title="Install vertical pack" right={`${complete} / ${STAGES.length}`} />

            <div className="flex items-center gap-2 rounded-tile border border-hairline px-3 py-1">
                <span className="t-micro shrink-0 text-ink-3">Organisation</span>
                <span className="t-mono ml-auto truncate text-[12px]">
                    {typed}
                    {t < 1 && <Caret />}
                </span>
            </div>

            <div className="flex flex-col">
                {STAGES.map(([name, note, ms], i) => (
                    <div key={name} className="flex items-center gap-2.5 border-t border-hairline py-2 first:border-t-0">
                        <Status s={st(i)} />
                        <span className={cx("shrink-0 text-[13px] leading-[18px]", st(i) === "idle" && "text-ink-3")}>
                            {name}
                        </span>
                        <span className="ml-auto hidden truncate text-[11px] leading-4 text-ink-3 sm:inline">
                            {note}
                        </span>
                        <span className="t-mono w-[54px] shrink-0 text-right text-[11px] text-ink-3">
                            {st(i) === "done" ? `${ms}ms` : st(i) === "run" ? "···" : ""}
                        </span>
                    </div>
                ))}
            </div>

            <div
                className={cx(
                    "mt-auto rounded-tile border p-2 text-center transition-colors",
                    ready ? "border-hairline bg-sunk/60" : "border-dashed border-hairline-2",
                )}
            >
                <p className="t-micro text-ink-3">Instance</p>
                <p className={cx("t-h2 mt-0.5", ready ? "a-rise text-ink" : "text-ink-4")}>
                    {ready ? deriveInstance(ORG) : "·AIOS"}
                </p>
                <p className="mt-1 truncate text-[11px] text-ink-3">
                    {ready ? `${ORG} · 10 agents · 26 connectors · private on-premise` : "Derived from the organisation name"}
                </p>
            </div>
        </div>
    );
}

/* ── 6. Trace — the waterfall, written once ─────────────────────────────── */

type Span = { label: string; ms: number; start: number; kind: "model" | "tool" | "policy" };

function buildTrace(pack: Pack): Span[] {
    const raw: Omit<Span, "start">[] = [
        { label: "Plan authored", ms: 640, kind: "model" },
        ...pack.seed.tools.map((x) => ({
            label: x.label,
            ms: x.ms,
            kind: (x.label.startsWith("Checked policy") ? "policy" : "tool") as Span["kind"],
        })),
        { label: "Answer composed", ms: 880, kind: "model" as const },
    ];
    let cursor = 0;
    return raw.map((r, i) => {
        const prev = raw[i - 1];
        // Consecutive retrieval calls overlap — this is a waterfall, not a queue.
        const start = i === 0 ? 0 : prev.kind === "tool" && r.kind === "tool" ? cursor - prev.ms * 0.4 : cursor;
        cursor = start + r.ms + 40;
        return { ...r, start };
    });
}

export function TraceDemo({ pack = PACKS[0] }: { pack?: Pack }) {
    const { ref, inView } = useInView<HTMLDivElement>();
    const spans = useMemo(() => buildTrace(pack), [pack]);
    const total = spans.reduce((a, s) => Math.max(a, s.start + s.ms), 0);
    const t = useTick(520, spans.length + 5, inView);
    const tone = { model: "bg-ink", tool: "bg-accent", policy: "bg-live" } as const;

    return (
        <div ref={ref} className={PANE}>
            <Head title="Run trace" right={`run_${hash8(pack.id)}`} />
            <p className="t-mono -mt-1 text-[11px] text-ink-3">
                {spans.length} steps · {pack.seed.tools.length} tool calls · {pack.seed.citations.length} documents ·{" "}
                {(total / 1000).toFixed(2)}s
            </p>

            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-0 flex justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} className="w-px bg-hairline" />
                    ))}
                </div>
                <div className="relative flex flex-col gap-1.5">
                    {spans.map((s, i) => (
                        <div key={s.label + i} className="flex items-center gap-2.5">
                            <span className="w-[104px] shrink-0 truncate text-[12px] text-ink-2 md:w-[150px]">
                                {s.label}
                            </span>
                            <span className="relative h-4 min-w-0 flex-1 rounded-full bg-sunk/70">
                                {t > i && (
                                    <span
                                        className="a-fade absolute inset-y-0 rounded-full"
                                        style={{
                                            left: `${(s.start / total) * 100}%`,
                                            width: `${Math.max((s.ms / total) * 100, 1.5)}%`,
                                        }}
                                    >
                                        <span className={cx("block h-full w-full rounded-full", tone[s.kind])} />
                                    </span>
                                )}
                            </span>
                            <span className="t-mono w-[50px] shrink-0 text-right text-[11px] text-ink-3">
                                {t > i ? `${Math.round(s.ms)}ms` : ""}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-1 pl-[104px] md:pl-[150px]">
                <span className="t-mono text-[10px] text-ink-3">0ms</span>
                <span className="t-mono mx-auto text-[10px] text-ink-3">{Math.round(total / 2)}ms</span>
                <span className="t-mono text-[10px] text-ink-3">{Math.round(total)}ms</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-hairline pt-2.5">
                {(["model", "tool", "policy"] as const).map((k) => (
                    <span key={k} className="flex items-center gap-1.5 text-[11px] text-ink-3">
                        <span className={cx("h-2 w-2 rounded-full", tone[k])} />
                        {k === "model" ? "model" : k === "tool" ? "retrieval & tools" : "policy check"}
                    </span>
                ))}
                <span className="t-mono ml-auto text-[11px] text-ink-3">sha256 {hash8(pack.instance)}</span>
            </div>
        </div>
    );
}

/* ── 7. Catalogue — an agent per function, tuned to the pack ────────────── */

const ROSTERS: Record<string, [string, string][]> = {
    "central-bank": [
        ["Supervision", "Reads prudential returns and flags institutions near the capital floor"],
        ["Monetary Policy", "Assembles the pre-MPC evidence pack from statistics and market feeds"],
        ["Payments Oversight", "Watches settlement exceptions against the oversight framework"],
        ["Knowledge", "Answers over the archive with citations back to source"],
        ["Enforcement", "Drafts findings letters from examination reports and prior precedent"],
        ["Audit", "Replays any run and reconciles it against the retention schedule"],
    ],
    "oil-gas": [
        ["Asset Integrity", "Tracks inspection findings and reprices the repair backlog"],
        ["HSE & Permits", "Screens permits to work against live risk assessments"],
        ["Production", "Reconciles allocation across wells, terminals and partners"],
        ["Knowledge", "Answers over standards, drilling programmes and vendor manuals"],
        ["Joint Venture", "Prepares partner reports and cash-call packs"],
        ["Audit", "Replays every run against the management-of-change record"],
    ],
    government: [
        ["Registry", "Files correspondence to the official file and keeps the index true"],
        ["Freedom of Information", "Runs the statutory clock and drafts exemption analyses"],
        ["Procurement", "Checks tenders against the procurement act and prior awards"],
        ["Knowledge", "Answers over circulars, gazettes and ministerial directives"],
        ["Policy", "Assembles briefing notes from the ministry's own record"],
        ["Audit", "Reconstructs any decision trail for the auditor-general"],
    ],
    manufacturing: [
        ["Plant Performance", "Explains OEE loss down to the shift, line and loss category"],
        ["Quality", "Traces batch records and keeps deviations moving to closure"],
        ["Supply Chain", "Watches supplier lead times against the production plan"],
        ["Knowledge", "Answers over SOPs, engineering drawings and maintenance history"],
        ["Group Reporting", "Consolidates every operating company into one board pack"],
        ["Audit", "Replays every run against the change-control record"],
    ],
    "ministry-interior": [
        ["Immigration", "Works the passport, visa and border record end to end"],
        ["Corrections", "Tracks custody, welfare and parole documentation"],
        ["Fire Service", "Summarises enforcement notices and the inspection backlog"],
        ["Civil Defence", "Assembles incident and deployment reporting"],
        ["Knowledge", "Answers across four services, each behind its own clearance"],
        ["Audit", "Proves who saw what, across every service"],
    ],
};

export function CatalogueDemo({ pack = PACKS[0] }: { pack?: Pack }) {
    const { ref, inView } = useInView<HTMLDivElement>();
    const roster = ROSTERS[pack.id] ?? ROSTERS["central-bank"];
    const t = useTick(1500, roster.length, inView);

    return (
        <div ref={ref} className={PANE}>
            <Head title="Agent catalogue" right={`${pack.agents} agents · ${pack.connectors} connectors`} />
            <div className="grid flex-1 grid-cols-2 gap-2">
                {roster.map(([name, cap], i) => {
                    const active = i === t;
                    return (
                        <div
                            key={name}
                            className={cx(
                                "rounded-tile border p-2.5 transition-colors duration-500",
                                active ? "border-accent bg-accent-soft" : "border-hairline",
                            )}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="truncate text-[13px] leading-[18px]">{name}</span>
                                {active && (
                                    <span className="ml-auto flex shrink-0 items-center gap-1.5">
                                        <LiveDot tone="accent" />
                                        <span className="t-mono text-[10px] text-accent">running</span>
                                    </span>
                                )}
                            </div>
                            <p
                                className={cx(
                                    "mt-1 line-clamp-3 text-[11px] leading-[15px]",
                                    active ? "text-ink-2" : "text-ink-3",
                                )}
                            >
                                {cap}
                            </p>
                        </div>
                    );
                })}
            </div>
            <p className="text-[11px] leading-4 text-ink-3">
                +{Math.max(pack.agents - roster.length, 0)} more tuned to {pack.org}, plus a builder for the ones we did
                not think of.
            </p>
        </div>
    );
}

/* ── 8. Ingest — parse · OCR · chunk · embed · index ────────────────────── */

const PHASES = ["parse", "OCR", "chunk", "embed", "index"];
const DOCS: { name: string; meta: string; ocr: boolean; off: number }[] = [
    { name: "Prudential Returns Summary Q3.pdf", meta: "18 pp · digital", ocr: false, off: 4 },
    { name: "Examination Report — Tier 1.docx", meta: "42 pp · digital", ocr: false, off: 2 },
    { name: "Circular FPRD-2026-014.tif", meta: "6 pp · scanned", ocr: true, off: 0 },
    { name: "Board Minutes 1998 — bound volume.pdf", meta: "212 pp · scanned", ocr: true, off: 3 },
];

export function IngestDemo() {
    const { ref, inView } = useInView<HTMLDivElement>();
    // A long counter rather than a short loop: the phase cycles on modulo 6 while
    // the totals keep climbing instead of snapping back every twelve ticks.
    const t = useTick(640, 9_999_996, inView);

    const stats: [string, number][] = [
        ["documents", 84_120 + t * 3],
        ["chunks", 6_402_118 + t * 271],
        ["pages OCR'd", 1_940_332 + t * 57],
    ];

    return (
        <div ref={ref} className={PANE}>
            <Head title="Ingestion" right="incremental · continuous" />

            <div className="grid grid-cols-3 gap-2">
                {stats.map(([label, value]) => (
                    <div key={label} className="rounded-tile border border-hairline p-2.5">
                        <p className="t-mono truncate text-[15px] text-ink">{fmt(value)}</p>
                        <p className="t-micro mt-0.5 truncate text-ink-3">{label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col">
                {DOCS.map((d) => {
                    const stage = (t + d.off) % 6; // 5 = indexed
                    const indexed = stage === 5;
                    return (
                        <div key={d.name} className="border-t border-hairline py-2 first:border-t-0 first:pt-0">
                            <div className="flex items-center gap-2">
                                {d.ocr ? (
                                    <ScanLine className="h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.5} />
                                ) : (
                                    <FileText className="h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.5} />
                                )}
                                <span className="truncate text-[13px] leading-[18px]">{d.name}</span>
                                <span className="t-mono ml-auto hidden shrink-0 text-[11px] text-ink-3 sm:inline">
                                    {d.meta}
                                </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                                <span className="flex min-w-0 flex-1 gap-1">
                                    {PHASES.map((p, k) => {
                                        const skipped = k === 1 && !d.ocr;
                                        const filled = indexed || k < stage;
                                        const now = !indexed && k === stage;
                                        return (
                                            <span
                                                key={p}
                                                className={cx(
                                                    "h-[3px] flex-1 rounded-full transition-colors duration-300",
                                                    skipped ? "bg-hairline"
                                                    : filled ? "bg-live"
                                                    : now ? "bg-accent"
                                                    : "bg-sunk",
                                                )}
                                            />
                                        );
                                    })}
                                </span>
                                <span
                                    className={cx(
                                        "t-mono w-[74px] shrink-0 text-right text-[11px]",
                                        indexed ? "text-live" : "text-accent",
                                    )}
                                >
                                    {indexed ? "indexed" : !d.ocr && stage === 1 ? "skipped" : PHASES[stage]}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="mt-auto truncate pt-1 text-[11px] leading-4 text-ink-3">
                Incremental — only what changed is re-embedded. Scanned archives pass through OCR first.
            </p>
        </div>
    );
}

/* ── registry ───────────────────────────────────────────────────────────── */

export const DEMOS: Record<Feature["demo"], ComponentType<{ pack?: Pack }>> = {
    console: ConsoleDemo,
    search: SearchDemo,
    connectors: ConnectorsDemo,
    governance: GovernanceDemo,
    install: InstallDemo,
    trace: TraceDemo,
    catalogue: CatalogueDemo,
    ingest: IngestDemo,
};
