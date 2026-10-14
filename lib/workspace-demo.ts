import type { DemoScenario } from "./demo-scenarios";

/** Website-only examples, not customer records or a second product data store. */
export const WORKSPACE_VIEWS = [
    { id: "spaces", title: "Spaces", label: "Give knowledge a home", description: "Write decision briefs, meeting notes and playbooks. Link the original Knowledge sources, keep revision history, and request an independent review before publishing.", features: ["Pages & templates", "Linked sources", "Review & version history"] },
    { id: "projects", title: "Projects", label: "Keep the whole plan in view", description: "Bring project pages, people and tasks together. See progress from the actual linked tasks, with access scoped to the people who belong in the work.", features: ["Project overview", "Task-based progress", "Scoped team access"] },
    { id: "tasks", title: "Tasks", label: "Make the next step clear", description: "Give every task an owner, priority and due date. Switch between list, board and timeline, break work into subtasks, and keep comments and activity beside the task.", features: ["List, board & timeline", "Subtasks & comments", "Owners & due dates"] },
] as const;

export type WorkspaceView = typeof WORKSPACE_VIEWS[number]["id"];
export type DemoTaskStatus = "To do" | "In progress" | "Completed";
export type WorkspaceTask = { id: string; title: string; owner: string; initials: string; due: string; priority: "High" | "Medium"; status: DemoTaskStatus; start: number; duration: number; subtasks: string[] };
export const WORKSPACE_TASKS: WorkspaceTask[] = [
    { id: "sources", title: "Confirm the source inventory", owner: "Ada", initials: "AO", due: "14 Oct", priority: "High", status: "Completed", start: 0, duration: 2, subtasks: ["List the approved procedures", "Confirm a source owner"] },
    { id: "brief", title: "Prepare the pilot decision brief", owner: "Tunde", initials: "TA", due: "16 Oct", priority: "High", status: "In progress", start: 1, duration: 3, subtasks: ["Link the source inventory", "Draft the recommendation", "Request an independent review"] },
    { id: "review", title: "Review the team playbook", owner: "Zainab", initials: "ZM", due: "19 Oct", priority: "Medium", status: "To do", start: 4, duration: 2, subtasks: ["Check the operating steps", "Record review feedback"] },
    { id: "access", title: "Agree the pilot access scope", owner: "Ada", initials: "AO", due: "13 Oct", priority: "High", status: "Completed", start: 0, duration: 1, subtasks: ["Identify the pilot team", "Document the access scope"] },
    { id: "handover", title: "Plan the operations handover", owner: "Tunde", initials: "TA", due: "21 Oct", priority: "Medium", status: "To do", start: 6, duration: 2, subtasks: ["Name the handover owner", "Prepare the review agenda"] },
];

export const SPACE_ASSISTANT_DEMO: DemoScenario = {
    id: "spaces-brief", label: "Spaces · thinking partner", mode: "agents",
    question: "Help me draft the Lagos pilot decision brief. What still needs a decision?",
    sources: [
        { name: "Pilot scope · Knowledge", excerpt: "Fictional source: begin with the Lagos operations team. The source inventory is complete; the decision brief still needs an independent review." },
        { name: "Operating procedure · Knowledge", excerpt: "Fictional source: the project owner proposes the plan. A separate reviewer checks the saved revision before it is published to the Space." },
    ],
    tasks: ["Read the page’s draft context", "Check accessible project sources", "Propose a decision brief"],
    answer: "The pilot scope is ready for review. The next decision is whether the proposed operating procedure is suitable for the team. Suggested follow-ups: review the playbook and confirm the handover owner. These are proposals, not newly created tasks.",
    outcome: "Draft prepared. You choose what to insert.",
    boundary: "This is a scripted website illustration, not a live AI run. In the product, the Space assistant uses the configured model route and accessible project sources. It proposes text and follow-ups; it does not publish, approve or automatically create tasks.",
};
