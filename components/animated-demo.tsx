"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, ChevronDown, FileText, LockKeyhole, Pause, Play, RotateCcw, ShieldCheck, X } from "lucide-react";
import { BrandMark } from "@/components/brand";
import type { DemoScenario } from "@/lib/demo-scenarios";

const LAST_FRAME = 10;
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
    const media = window.matchMedia(motionQuery);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}
const reducedMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => false;

/** One finite timeline, shared by every website illustration. No provider calls. */
export function AnimatedDemo({ scenario, compact = false }: { scenario: DemoScenario; compact?: boolean }) {
    // Identity changes reset animation and citation selection atomically.
    return <DemoRun key={scenario.id} scenario={scenario} compact={compact} />;
}

function DemoRun({ scenario: s, compact }: { scenario: DemoScenario; compact: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const detailId = useId();
    const [frame, setFrame] = useState(0);
    const [paused, setPaused] = useState(false);
    const [visible, setVisible] = useState(false);
    const [foreground, setForeground] = useState(true);
    const [source, setSource] = useState<number | null>(null);
    const reduce = useSyncExternalStore(subscribeMotion, reducedMotion, serverMotion);
    const t = reduce ? LAST_FRAME : frame;
    const done = t === LAST_FRAME;
    const running = visible && foreground && !paused && !reduce && !done;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
        observer.observe(element);
        const onVisibility = () => setForeground(!document.hidden);
        onVisibility();
        document.addEventListener("visibilitychange", onVisibility);
        return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
    }, []);

    useEffect(() => {
        if (!running) return;
        const timer = window.setInterval(() => setFrame(value => Math.min(LAST_FRAME, value + 1)), 850);
        return () => window.clearInterval(timer);
    }, [running]);

    const completedTasks = t < 3 ? 0 : t < 5 ? 1 : t < 7 ? 2 : 3;
    const sourcesChecked = t >= s.sources.length + 1;
    const status = done ? "Ready for review" : paused ? "Demo paused" : t < 2 ? "Reading the question" : t < 4 ? "Checking the sources" : t < 7 ? "Connecting the context" : "Preparing the brief";
    const words = s.answer.split(" ");
    const answer = words.slice(0, Math.ceil(words.length * Math.max(0, Math.min(1, (t - 6) / 4)))).join(" ");
    const rowsMode = s.mode === "pipeline" || s.mode === "policy" || s.mode === "audit" || s.mode === "deployment";
    const denied = (index: number) => s.mode === "policy" && (s.id === "refusal" ? index === 1 : index === s.sources.length - 1);
    const sourceVisible = source !== null && !denied(source);

    return <div ref={ref} className={`brew-demo${compact ? " brew-demo-compact" : ""}`} data-demo={s.id} data-mode={s.mode} data-frame={t} data-running={running} aria-label={`${s.label} illustrative demo`}>
        <div className="brew-demo-heading"><span className="brew-demo-brand"><BrandMark /><span>Databrew <span className="brew-demo-scope">/ {s.label}</span></span></span><span className="brew-demo-kind">Illustrative demo</span></div>
        <div className="brew-demo-canvas">
            <div className="brew-demo-layout">
                <div className="brew-demo-conversation">
                    <div className="brew-demo-question"><span>YOU ASK</span><p>{s.question}</p></div>
                    <div className="brew-demo-source-area"><div className="brew-demo-eyebrow"><span>{rowsMode ? { pipeline: "CONNECTING THE FOUNDATION", policy: "CHECKING THE BOUNDARY", audit: "FOLLOWING THE RECORD", deployment: "TRACING THE PRIVATE ROUTE" }[s.mode as "pipeline" | "policy" | "audit" | "deployment"] : "FINDING THE CONTEXT"}</span><span>{sourcesChecked ? "Checked" : "In progress"}</span></div>
                        <div className={rowsMode ? "brew-demo-records" : "brew-demo-sources"}>
                            {s.sources.map((item, i) => {
                                const checked = t >= i + 2;
                                const blocked = checked && denied(i);
                                return <button key={item.name} type="button" className={`${checked ? "is-checked" : ""}${blocked ? " is-withheld" : ""}`} disabled={!checked || blocked} onClick={() => { setSource(source === i ? null : i); setPaused(true); }} aria-expanded={source === i} aria-controls={detailId} title={blocked ? `${item.name} — not accessible in this example` : `Inspect fictional source: ${item.name}`}>
                                    <span className="brew-source-icon">{s.mode === "deployment" ? <LockKeyhole size={14} /> : <FileText size={14} />}</span><span className="brew-source-name">{item.name}</span>
                                    {blocked ? <span className="brew-source-verdict"><LockKeyhole size={12} />Withheld</span> : checked ? <span className="brew-source-verdict"><Check size={12} />{rowsMode && "Checked"}</span> : <span className="brew-source-pending" aria-label="Pending" />}
                                </button>;
                            })}
                        </div>
                        <p className="brew-demo-permissions"><ShieldCheck size={12} />{sourcesChecked ? "Sample scope checked · source references retained" : "Working with fictional, permission-scoped sources"}</p>
                    </div>
                    <div className={`brew-demo-response${t >= 7 ? " is-revealed" : ""}`}>
                        <div className="brew-answer-author"><BrandMark /><span>Databrew</span><span>REVIEW DRAFT</span></div>
                        <div className="brew-answer-text">
                            {/* Reserve the full answer's height; no layout jump as words arrive. */}
                            <p className="brew-answer-measure" aria-hidden="true">{s.answer}</p>
                            {t >= 7 ? <p className="brew-answer-written">{answer}{!done && <span className="brew-demo-caret" aria-hidden="true" />}</p> : <div className="brew-answer-skeleton" aria-hidden="true"><span /><span /><span /></div>}
                        </div>
                        <div className="brew-answer-citations">{s.sources.filter((_, i) => !denied(i)).map(item => {
                            const i = s.sources.indexOf(item);
                            return <button key={item.name} type="button" disabled={t < 7} onClick={() => { setSource(source === i ? null : i); setPaused(true); }} aria-expanded={source === i} aria-controls={detailId}><span>{String(i + 1).padStart(2, "0")}</span><span>{item.name}</span><ChevronDown size={11} /></button>;
                        })}</div>
                    </div>
                </div>
                <aside className="brew-demo-activity" aria-label="Illustrative agent activity"><div className="brew-demo-eyebrow"><span>VISIBLE WORK</span><span>{String(completedTasks).padStart(2, "0")} / 03</span></div><h4>A little less busywork.<br />A lot more context.</h4><ol>{s.tasks.map((task, i) => <li key={task} data-state={i < completedTasks ? "done" : i === completedTasks && t > 0 ? "active" : "pending"}><span className="brew-task-status">{i < completedTasks ? <Check size={13} /> : String(i + 1).padStart(2, "0")}</span><div><span>{task}</span><small>{i < completedTasks ? "Checked in this example" : i === completedTasks && t > 0 ? "Working through the example" : "Up next"}</small></div></li>)}</ol><div className="brew-demo-human"><ShieldCheck size={18} /><p>Prepared by AI.<br /><span>Decided by people.</span></p></div></aside>
            </div>
            <div className="brew-demo-source-detail" id={detailId} hidden={!sourceVisible}>{sourceVisible && <><div><span className="brew-demo-eyebrow">FICTIONAL SOURCE EXCERPT</span><button type="button" aria-label="Close source excerpt" onClick={() => setSource(null)}><X size={16} /></button></div><h4>{s.sources[source!].name}</h4><p>{s.sources[source!].excerpt}</p></>}</div>
            <div className={`brew-demo-outcome${done ? " is-complete" : ""}`}><span>{done ? <Check size={16} /> : <span className="brew-progress-dot" />}</span><p>{done ? s.outcome : status}</p><span className="brew-outcome-tag">{done ? "YOUR NEXT MOVE" : `${String(t + 1).padStart(2, "0")} / 11`}</span></div>
        </div>
        <div className="brew-demo-controls"><span className="brew-demo-disclosure">Simulated workflow. No live data.</span><div>{!done && <button type="button" aria-label={paused ? "Play demo" : "Pause demo"} onClick={() => setPaused(value => !value)}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? "Play" : "Pause"}</button>}<button type="button" onClick={() => { setFrame(0); setPaused(false); setSource(null); }} disabled={reduce} title={reduce ? "Reduced motion enabled: showing the complete example" : "Replay the illustrative workflow"}><RotateCcw size={12} />Replay</button>{!done && <button type="button" aria-label="Show completed demo" onClick={() => setFrame(LAST_FRAME)}><ArrowRight size={13} /><span className="sr-only">Show completed demo</span></button>}</div></div>
        <p className="sr-only" role="status">{done ? "Illustrative workflow complete. The draft is ready for human review. No real action was taken." : paused ? "Illustrative workflow paused." : "Illustrative workflow playing."}</p>
        <details className="brew-demo-boundary"><summary>About this example <ChevronDown size={12} /></summary><p>{s.boundary}</p></details>
    </div>;
}
