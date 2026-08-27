"use client";

/**
 * The one live miniature on the page.
 *
 * Everything else that shows AIOS is a screenshot of the running product — that
 * is the rule, and it is the right one. The agent console is the single genuine
 * exception: its whole subject is a plan being authored and tool calls landing
 * one after another, and a still frame cannot carry that.
 *
 * Because it claims to be the product, it is drawn in the product's own visual
 * language rather than the page's: the AIOS accent (--color-product) marks live
 * state here, so the run below the console screenshot reads as the same software
 * and not as a diagram of it. Page chrome stays monochrome.
 *
 * Every animation is stepped off `useTick` (a counter), never wall-clock time,
 * so the server and the client always agree on the first frame, and it pauses
 * when it is off-screen.
 */

import { useEffect, useRef } from "react";
import { Check, FileText } from "lucide-react";
import { PACKS, type Pack } from "@/lib/aios";
import { LiveDot, useInView, useTick } from "@/components/ui";
import { cx } from "@/lib/cx";

/* ── shared ─────────────────────────────────────────────────────────────── */

type State = "idle" | "run" | "done";

/** The miniature holds one height so the page never reflows around it. */
const BOX = "flex h-[400px] w-full flex-col";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

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
                style={{ borderTopColor: "var(--color-product)" }}
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
            className="ml-[2px] inline-block h-[13px] w-[2px] translate-y-[2px] bg-product align-baseline"
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
                            <LiveDot tone="product" />
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
                                    <FileText className="h-3 w-3 shrink-0 text-product" strokeWidth={1.5} />
                                    <span className="t-mono text-[10px] text-product">{i + 1}</span>
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
                {t >= T_END ? <Check className="h-3.5 w-3.5 text-live" strokeWidth={2} /> : <LiveDot tone="product" />}
                <span className="truncate text-[12px] text-ink-2">{status}</span>
                <span className="t-mono ml-auto shrink-0 text-[11px] text-ink-3">
                    {n} steps · {s.tools.length} tools · {secs}s
                </span>
            </div>
        </div>
    );
}
