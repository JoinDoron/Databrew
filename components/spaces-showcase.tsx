"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, CheckCheck, ChevronRight, Circle, Columns3, FileText, Flag, FolderKanban, History, List, ListTodo, LockKeyhole, MessageSquare, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { BrandMark } from "./brand";
import { AnimatedDemo } from "./animated-demo";
import { SPACE_ASSISTANT_DEMO, WORKSPACE_TASKS, WORKSPACE_VIEWS, type WorkspaceTask, type WorkspaceView } from "@/lib/workspace-demo";
import s from "./spaces-showcase.module.css";

const ICONS = { spaces: BookOpen, projects: FolderKanban, tasks: ListTodo };
const MODES = [{ id: "list", label: "List", icon: List }, { id: "board", label: "Board", icon: Columns3 }, { id: "timeline", label: "Timeline", icon: CalendarDays }] as const;

function nextTab(event: KeyboardEvent<HTMLButtonElement>, index: number, length: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % length : event.key === "ArrowLeft" ? (index + length - 1) % length : event.key === "Home" ? 0 : event.key === "End" ? length - 1 : null;
    if (next !== null) event.preventDefault();
    return next;
}

export function SpacesShowcase() {
    const id = useId();
    const [active, setActive] = useState<WorkspaceView>("spaces");
    const [assistant, setAssistant] = useState(false);
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const view = WORKSPACE_VIEWS.find(item => item.id === active)!;
    const showTasks = () => { setActive("tasks"); tabs.current[2]?.focus(); };
    return <section className={`enterprise-section ${s.section}`} id="spaces" aria-labelledby={`${id}-heading`}>
        <div className="brand-shell">
            <div className="enterprise-heading"><div><p className="eyebrow">INTRODUCING DATABREW SPACES</p><h2 id={`${id}-heading`}>A place for the thinking.<br /><span>A plan for the doing.</span></h2></div><p>Your team’s knowledge, project plans and next steps belong together. Give them a shared home—with AI close at hand.</p></div>
            <div className={s.tabs} role="tablist" aria-label="Explore Spaces, projects and tasks">
                {WORKSPACE_VIEWS.map((item, index) => { const Icon = ICONS[item.id]; return <button key={item.id} ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`${id}-${item.id}`} aria-selected={active === item.id} aria-controls={`${id}-panel`} tabIndex={active === item.id ? 0 : -1} onClick={() => setActive(item.id)} onKeyDown={event => { const next = nextTab(event, index, WORKSPACE_VIEWS.length); if (next !== null) { setActive(WORKSPACE_VIEWS[next].id); tabs.current[next]?.focus(); } }}><Icon size={21} strokeWidth={1.5} /><span><strong>{item.title}</strong><small>{item.label}</small></span><ArrowUpRight size={17} /></button>; })}
            </div>
            <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${active}`} tabIndex={0} className={s.panel}>
                <div className={s.story}><p>{view.description}</p><ul>{view.features.map(feature => <li key={feature}><Check size={13} />{feature}</li>)}</ul></div>
                <div className={s.frame}>
                    <header className={s.frameHeader}><span><BrandMark />Databrew <span className={s.breadcrumb}>/ Lagos operations pilot</span></span><span className={s.demoLabel}>Interactive illustration</span></header>
                    <div className={s.workspace}>
                        <aside className={s.sidebar} aria-label="Example project context"><span className={s.projectMark}><FolderKanban size={22} /></span><strong>Lagos operations</strong><p>One team. One shared plan.</p><span className={s.access}><LockKeyhole size={12} />Internal · project members</span><div className={s.sidebarPages}><span>IN THIS SPACE</span>{["Pilot decision brief", "Team playbook", "Review notes"].map((page, i) => <div key={page} data-current={i === 0}><FileText size={13} />{page}</div>)}</div><div className={s.members}><span>AO</span><span>TA</span><span>ZM</span><small>Sample team</small></div></aside>
                        <div className={s.canvas} key={active}>
                            {active === "spaces" ? <SpacePreview onTasks={showTasks} /> : active === "projects" ? <ProjectPreview onTasks={showTasks} /> : <TaskPreview />}
                        </div>
                    </div>
                    <footer className={s.frameFooter}><ShieldCheck size={13} /><span>Same project. Linked pages. One task register.</span><small>Fictional records · changes stay in this demo</small></footer>
                </div>
            </div>
            <div className={s.assistantStrip}><div className={s.assistantIcon}><Sparkles size={23} /></div><div><h3>A thinking partner, inside the work.</h3><p>Ask Databrew to draft a brief, find gaps or suggest next steps using accessible project sources. You choose what to insert; a person reviews what gets published.</p></div><button type="button" className="text-link" aria-expanded={assistant} aria-controls={`${id}-assistant`} onClick={() => setAssistant(value => !value)}>{assistant ? "Close AI walkthrough" : "See the AI walkthrough"}<ArrowRight size={17} /></button></div>
            <div id={`${id}-assistant`} hidden={!assistant}>{assistant && <AnimatedDemo scenario={SPACE_ASSISTANT_DEMO} />}</div>
            <div className={s.bottom}><span>From the first idea to the next accountable step.</span><Link href="/#contact" className="text-link">Plan a workspace pilot <ArrowUpRight size={17} /></Link></div>
        </div>
    </section>;
}

function SpacePreview({ onTasks }: { onTasks: () => void }) {
    return <div className={s.pagePreview}>
        <div className={s.documentMeta}><span><FileText size={13} /> Decision brief</span><span><History size={13} />Version 3 · Draft</span></div>
        <h3>A clearer start for<br />the Lagos pilot.</h3><p className={s.pageLede}>One place to agree the scope, record the decision and keep the next steps connected.</p>
        <div className={s.pageBody}><div><h4>The plan</h4><p>Start with the operations team. Bring the current procedures into view, agree the review owner, and prepare a shared playbook.</p><h4>Evidence, not another copy</h4><div className={s.sourceChips}><span><FileText size={12} />Pilot scope</span><span><FileText size={12} />Operating procedure</span></div><small>References to existing Knowledge documents</small></div><aside className={s.reviewCard}><ShieldCheck size={22} /><strong>Ready when reviewed.</strong><p>A separate reviewer checks the saved revision before it is published to the Space.</p><span>Draft <ChevronRight size={11} /> Review <ChevronRight size={11} /> Publish</span></aside></div>
        <button type="button" className={s.linkedTasks} onClick={onTasks}><ListTodo size={17} /><span>Keep the follow-ups connected<small>5 linked tasks · named owners · clear due dates</small></span><ArrowRight size={17} /></button>
    </div>;
}

function ProjectPreview({ onTasks }: { onTasks: () => void }) {
    const complete = WORKSPACE_TASKS.filter(task => task.status === "Completed").length;
    return <div className={s.projectPreview}><div className={s.documentMeta}><span><FolderKanban size={13} />Project overview</span><span><Users size={13} />Team workspace</span></div><h3>The plan, in perspective.</h3><p className={s.pageLede}>See the pages, owners and progress behind the project.</p><div className={s.metrics}><div><strong>03</strong><span>Shared pages</span></div><div><strong>05</strong><span>Linked tasks</span></div><div><strong>02</strong><span>Tasks complete</span></div></div><div className={s.projectSummary}><div><FolderKanban size={23} /><div><h4>Lagos operations pilot</h4><p>Turn an agreed scope into a reviewed team playbook.</p></div><span className={s.badge}>In progress</span></div><div className={s.progressLabel}><span>Progress from linked tasks</span><strong>{complete} of {WORKSPACE_TASKS.length} complete</strong></div><div className={s.progress} role="progressbar" aria-label="Sample project task completion" aria-valuemin={0} aria-valuemax={WORKSPACE_TASKS.length} aria-valuenow={complete}><span style={{ width: `${complete / WORKSPACE_TASKS.length * 100}%` }} /></div><div className={s.projectSummaryFooter}><span><LockKeyhole size={13} />Internal access</span><button type="button" onClick={onTasks}>Explore the project’s tasks <ArrowUpRight size={14} /></button></div></div><div className={s.projectPrinciples}><span><BookOpen size={16} />The brief gives context.</span><span><Users size={16} />Owners keep it moving.</span><span><CheckCheck size={16} />Tasks show the progress.</span></div></div>;
}

function TaskPreview() {
    const id = useId();
    const [mode, setMode] = useState<typeof MODES[number]["id"]>("board");
    const [selected, setSelected] = useState<WorkspaceTask | null>(null);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const opener = useRef<HTMLButtonElement | null>(null);
    function open(task: WorkspaceTask, button: HTMLButtonElement) { opener.current = button; setSelected(task); }
    return <div className={s.taskPreview}>
        <div className={s.taskHeading}><div><span className={s.eyebrow}>LAGOS OPERATIONS PILOT</span><h3>Good plans become clear tasks.</h3></div><span className={s.badge}>5 tasks</span></div>
        <div className={s.taskToolbar}><span><ListTodo size={14} />Choose a view. Open a task.</span><div role="tablist" aria-label="Sample task views" className={s.modeTabs}>{MODES.map((item, index) => <button key={item.id} ref={el => { refs.current[index] = el; }} type="button" role="tab" id={`${id}-${item.id}`} aria-controls={`${id}-view`} aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} onClick={() => { setMode(item.id); setSelected(null); }} onKeyDown={event => { const next = nextTab(event, index, MODES.length); if (next !== null) { setMode(MODES[next].id); setSelected(null); refs.current[next]?.focus(); } }}><item.icon size={13} />{item.label}</button>)}</div></div>
        <div role="tabpanel" id={`${id}-view`} aria-labelledby={`${id}-${mode}`} tabIndex={0} className={s.taskView}>
            {mode === "board" ? <div className={s.board}>{(["To do", "In progress", "Completed"] as const).map(status => <section key={status}><h4><Circle size={9} />{status}<span>{WORKSPACE_TASKS.filter(task => task.status === status).length}</span></h4>{WORKSPACE_TASKS.filter(task => task.status === status).map(task => <button type="button" className={s.taskCard} key={task.id} aria-expanded={selected?.id === task.id} aria-controls={`${id}-detail`} onClick={event => open(task, event.currentTarget)}><span className={s.priority}><Flag size={10} />{task.priority}</span><strong>{task.title}</strong><span className={s.cardMeta}><span className={s.avatar}>{task.initials}</span><span>{task.owner}</span><small>{task.due}</small></span></button>)}</section>)}</div> : mode === "list" ? <div className={s.list}>{WORKSPACE_TASKS.map(task => <button type="button" key={task.id} onClick={event => open(task, event.currentTarget)} aria-expanded={selected?.id === task.id} aria-controls={`${id}-detail`}><span>{task.status === "Completed" ? <Check size={15} /> : <Circle size={15} />}</span><strong>{task.title}</strong><span className={s.listOwner}>{task.owner}</span><span>{task.due}</span><ArrowUpRight size={13} /></button>)}</div> : <div className={s.timeline}><div className={s.timelineKey}><span>October · sample schedule</span><span>12 — 21</span></div>{WORKSPACE_TASKS.map(task => <button type="button" key={task.id} onClick={event => open(task, event.currentTarget)} aria-expanded={selected?.id === task.id} aria-controls={`${id}-detail`}><strong>{task.title}</strong><span className={s.track}><span style={{ marginLeft: `${task.start * 10}%`, width: `${task.duration * 10}%` }}>{task.due}</span></span></button>)}</div>}
        </div>
        <div id={`${id}-detail`} hidden={!selected}>{selected && <div className={s.detail} key={selected.id}><div className={s.detailTop}><span><ListTodo size={14} />Task detail · example</span><button type="button" aria-label="Close sample task" onClick={() => { setSelected(null); opener.current?.focus(); }}><X size={17} /></button></div><h4 ref={node => { node?.focus(); }} tabIndex={-1}>{selected.title}</h4><div className={s.detailFacts}><span><Users size={13} />{selected.owner}</span><span><CalendarDays size={13} />{selected.due}</span><span><Flag size={13} />{selected.priority}</span><span>{selected.status}</span></div><TaskDetail task={selected} /></div>}</div>
        <p className={s.taskHint}>Same tasks in every view. This illustration doesn’t create or change product records.</p>
    </div>;
}

function TaskDetail({ task }: { task: WorkspaceTask }) {
    const id = useId();
    const [tab, setTab] = useState(0);
    const [checked, setChecked] = useState<number[]>(task.status === "Completed" ? task.subtasks.map((_, i) => i) : [0]);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const items = [{ label: "Subtasks", icon: ListTodo }, { label: "Comments", icon: MessageSquare }, { label: "Activity", icon: History }];
    return <><div role="tablist" aria-label="Sample task details" className={s.detailTabs}>{items.map((item, index) => <button type="button" key={item.label} ref={el => { refs.current[index] = el; }} role="tab" id={`${id}-${index}`} aria-selected={tab === index} aria-controls={`${id}-content`} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={event => { const next = nextTab(event, index, items.length); if (next !== null) { setTab(next); refs.current[next]?.focus(); } }}><item.icon size={13} />{item.label}</button>)}</div><div className={s.detailContent} id={`${id}-content`} role="tabpanel" aria-labelledby={`${id}-${tab}`} tabIndex={0}>
        {tab === 0 ? <><p>{checked.length} of {task.subtasks.length} steps complete · try the checklist</p>{task.subtasks.map((item, i) => <label className={s.subtask} key={item}><input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked(current => current.includes(i) ? current.filter(value => value !== i) : [...current, i])} /><span>{item}</span></label>)}</> : tab === 1 ? <div className={s.comment}><span className={s.avatar}>ZM</span><div><strong>Zainab <small>· sample comment</small></strong><p>Please keep the source links with the brief so the reviewer can check the evidence.</p><div className={s.reply}><strong>{task.owner} <small>· sample reply</small></strong><p>Noted. I’ll keep the context attached to the task.</p></div></div></div> : <ol className={s.activity}><li><span />Task created and linked to Lagos operations pilot.<small>12 Oct · 09:00 WAT</small></li><li><span />Assigned to {task.owner}; due date set to {task.due}.<small>12 Oct · 09:15 WAT</small></li><li><span />Status set to {task.status.toLowerCase()}.<small>13 Oct · 10:30 WAT</small></li></ol>}
    </div></>;
}
