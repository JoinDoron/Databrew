import type { Pack, ServiceSeed } from "@/lib/aios";
import type { PortalCard } from "@/lib/portals";
import type { Solution } from "@/lib/solutions";

/** Website-only fiction. Never queried, persisted, or presented as customer evidence. */
export type DemoMode = "answer" | "pipeline" | "agents" | "policy" | "audit" | "deployment";
export interface DemoScenario {
    id: string;
    label: string;
    mode: DemoMode;
    question: string;
    sources: { name: string; excerpt: string }[];
    tasks: [string, string, string];
    answer: string;
    outcome: string;
    boundary: string;
}

const EXAMPLES: Record<string, string> = {
    "all-teams": "The pilot scope is agreed. Data access is still open. Ada owns the source inventory; Tunde owns the review checklist. Prepare both for the next project meeting.",
    engineering: "The design record keeps billing separate from identity. Before release, review the retry policy, migration rollback and missing contract test. No deployment has been triggered.",
    "customer-service": "The case records a delivery delay, not a product fault. A draft reply explains the current dispatch position. A refund request is flagged for the authorised service lead.",
    sales: "The account asked for private hosting and a phased pilot. The brief links the deployment guide and previous meeting notes. Commercial terms remain an open question for the account owner.",
    it: "The incident matches the identity-service recovery runbook. The change draft includes dependency checks and a rollback checkpoint. Privileged commands remain blocked pending approval.",
    marketing: "The brief brings the approved positioning and audience research together. Two proposed claims lack supporting evidence; they are marked for review before any content is published.",
    "b2b-marketing": "The enterprise brief leads with source-backed answers and reviewable agent work. Security evidence and a named pilot sponsor are still needed. No customer logos or unapproved claims are included.",
    "b2c-marketing": "The Nigerian campaign draft uses the approved product facts and brand tone. Offer wording and local-language adaptations are marked for review. Nothing has been published or sent.",
    people: "The onboarding brief links the leave policy, IT setup guide and team handbook. Access requests go to the line manager. Private personnel files are excluded from this example.",
    finance: "The month-end brief links the ledger extract and reconciliation notes. One variance explanation still lacks an invoice. It is flagged for the finance reviewer; no posting or payment is made.",
    legal: "The draft departs from the playbook on liability wording and renewal notice. Both clauses are linked for counsel’s review. The comparison is a working draft, not legal advice.",
    retail: "The weekly brief highlights the revised returns procedure and an unresolved branch stock query. The regional manager can inspect both source records before deciding the next action.",
    "consumer-goods": "The distribution review links a delayed shipment to an unresolved packaging check. The quality owner still needs the batch release record. No recall or commercial change is initiated.",
    industrials: "The shift brief links the latest asset report, an open work order and the approved procedure. A missing inspection sign-off is highlighted for the operator. Equipment remains untouched.",
    "energy-utilities": "The field report flags recurring vibration on Pump P-204. The maintenance procedure calls for an engineering review; the work order has no inspection sign-off. Prepare the evidence pack for the asset engineer.",
    manufacturing: "Line B has an unresolved dimensional check. The quality record names the shift lead; the follow-up awaits a calibration certificate. The brief is ready for review, not production release.",
    "supply-chain": "The delivery exception links to a supplier acknowledgement and a pending receiving check. Procurement needs the revised dispatch date before proposing a change. No purchase order is updated.",
    "professional-services": "The approved methodology and anonymised research are available for this engagement. Another client’s confidential report is excluded. The engagement lead reviews the proposed reuse.",
    consulting: "The engagement draft separates documented process gaps from working assumptions. Two claims need client validation. Every included finding links back to approved research.",
    construction: "The approved revision differs from the site note on the requested change. The project lead should reconcile the drawing register and change log. No design or safety approval is implied.",
    "it-services": "The service brief links the incident review and support obligations. A recovery-test follow-up has no named owner. It is flagged for the service manager; client credentials stay out of the brief.",
    "financial-services": "The review pack links the current policy and permitted reports. A missing reconciliation note is explicitly marked. The next step is specialist review, not an investment or eligibility decision.",
    banking: "The operations query maps to the approved exception-handling policy. The reviewer still needs the reconciliation reference. No customer eligibility, payment or account decision has been made.",
    "pe-vc": "The diligence brief separates reported revenue from forecasts. The customer-concentration claim needs a supporting schedule. Open questions are prepared for the deal team, not an investment recommendation.",
    "asset-management": "The mandate brief links the supplied limits and committee notes. One exposure figure lacks a current reference date. It is flagged for verification; no trade or recommendation is generated.",
    insurance: "The case summary links the supplied wording and correspondence. A missing incident document is flagged for the reviewer. Coverage and claims outcomes are left to the authorised professional.",
    telecommunications: "The sample Lagos incident records an excavation-related fibre break. Field restoration confirmation is still missing. The handover links the recovery runbook and service-impact notes for network operations and customer care. No network change or customer message is sent.",
    government: "NIS has a procedure query; NCoS has an inspection follow-up; NSCDC has a licensing evidence gap; FFS has a fire-safety reinspection due. Each item keeps its agency owner. No official action is issued.",
    healthcare: "The service issue maps to the administrative escalation procedure. The operations lead owns the next review. No patient records, diagnosis or treatment recommendation are part of this example.",
    "life-sciences": "The document review finds a superseded procedure reference and a missing approval record. Both are flagged for the quality team. No clinical or regulatory validation is claimed.",
    "higher-education": "The committee brief links approved minutes and department submissions. Two follow-ups await a faculty response. Student-level records and admissions or grading decisions are excluded.",
};

export function solutionScenario(solution: Solution): DemoScenario {
    return {
        id: `solution-${solution.slug}`, label: solution.name, mode: "answer",
        question: solution.question,
        sources: solution.sources.map((name, index) => ({ name, excerpt: [
            `Sample finding: ${EXAMPLES[solution.slug]}`,
            `Sample reference: ${name}. In this fictional workflow, the source is available to the reviewer and its approval status is checked before use.`,
            `Sample follow-up: ${solution.review}`,
        ][index] })),
        tasks: ["Find approved context", "Cross-check the evidence", "Prepare a review brief"],
        answer: EXAMPLES[solution.slug], outcome: "Brief ready for human review", boundary: solution.review,
    };
}

const PACK_ANSWERS: Record<string, string> = {
    "central-bank": "In this fictional example, Institution A at 15.4% and Institution B at 15.8% sit within 100 basis points of the sample 15% floor. The returns and examination notes are linked for review. No real institution is identified.",
    "oil-gas": "The inspection report flags revised corrosion findings. Two sample repair records need an engineering review. The brief links the integrity plan and leaves intervention decisions with the asset team.",
    government: "The registry brief links the current memo, procurement record and open approval. One supporting attachment is missing. The responsible department receives a review draft, not an issued instruction.",
    manufacturing: "The shift report and quality log point to an unresolved line exception. The draft names the follow-up owner and missing evidence. Production release remains with the quality team.",
    "ministry-interior": EXAMPLES.government,
    nis: "The sample border report separates e-visa processing from other movements. A connectivity issue needs operational review. The brief links the procedure and post report; it makes no decision on an individual traveller.",
    ncos: "The sample inspection flags a capacity concern and outstanding welfare follow-ups. The briefing uses aggregate records only. Named case files and decisions about custody remain outside this demonstration.",
    nscdc: "The sample licensing review finds incomplete supporting returns and an outstanding site verification. Each query has an owner. Infrastructure and licensing records stay scoped; no licence is issued or refused.",
    ffs: "The sample Lagos notice register has an open reinspection and a missing completion report. The follow-up draft links each notice to its responsible officer. It does not issue a safety certificate or enforcement decision.",
};

export function packScenario(pack: Pack, service?: ServiceSeed): DemoScenario {
    const seed = service?.seed ?? pack.seed;
    const answer = PACK_ANSWERS[service?.id ?? pack.id] ?? seed.answer;
    const fireReference = !service && pack.id === "ministry-interior" ? pack.services?.find(item => item.id === "ffs")?.seed.citations[0] : undefined;
    const citations = [...seed.citations, ...(fireReference ? [fireReference] : [])];
    return {
        id: `pack-${pack.id}-${service?.id ?? "all"}`, label: service?.abbr ?? pack.short, mode: "answer",
        question: seed.prompt,
        sources: citations.slice(0, 4).map((name, i) => ({ name, excerpt: i === 0 ? `Fictional source summary: ${answer}` : "Fictional supporting record. The review example links this reference to its finding, checks scope and leaves the final decision with an authorised person." })),
        tasks: [seed.plan[0], seed.plan[1], service ? `Prepare ${service.abbr} review` : "Prepare the review brief"],
        answer, outcome: "Evidence assembled · decision stays with you",
        boundary: "Illustrative, read-only workflow. No institutional records are queried and no external action is taken.",
    };
}

function example(id: string, label: string, mode: DemoMode, question: string, names: string[], tasks: [string, string, string], answer: string, outcome: string): DemoScenario {
    return { id, label, mode, question, sources: names.map(name => ({ name, excerpt: `Fictional example from ${name}. ${answer}` })), tasks, answer, outcome, boundary: "Sample records only. These animated steps do not provision services, enforce live policy or perform real operations." };
}

export const FEATURE_DEMOS: Record<string, DemoScenario> = {
    search: example("search", "Connected search", "answer", "What did we agree for the Lagos pilot, and what is still open?", ["Project notes", "Team conversations", "Pilot checklist"], ["Find permitted sources", "Reconcile the open questions", "Link each finding to evidence"], "The pilot scope is agreed. Data access and a named reviewer are still open. Ada owns the source inventory; Tunde owns the review checklist. Bring both to the next planning meeting.", "One question. A connected answer."),
    ingest: example("ingest", "Knowledge intake", "pipeline", "Make the approved operations handbook searchable.", ["Operations handbook.pdf", "Source permissions", "Document register"], ["Extract and recognise text", "Check duplicate and version", "Carry source access into the index"], "The sample handbook is now represented as searchable sections. An older duplicate is held aside and the source access rules stay attached.", "Ready to find · access rules retained"),
    connectors: example("connectors", "Connected systems", "pipeline", "Bring our shared documents and service records into one search.", ["SharePoint", "ServiceNow", "File shares"], ["Check scoped connection", "Map the approved records", "Verify read-only retrieval"], "Three example sources feed the same knowledge layer. Their source references and access boundaries remain separate. No records have been changed in the original systems.", "Connect once. Reuse the context."),
    clearance: example("clearance", "Permission-aware answers", "policy", "Find the approved project brief, including any restricted material.", ["Approved project brief", "Team working notes", "Restricted personnel file"], ["Resolve the example role", "Filter before retrieval", "Return only permitted context"], "The project brief and team notes can inform this answer. Restricted personnel content is excluded before retrieval—not quoted or summarised.", "Allowed context only · restricted source withheld"),
    console: example("console", "Agents at work", "agents", "Prepare the pilot brief, list the open questions and draft the next steps.", ["Pilot scope", "Meeting notes", "Approval checklist"], ["Research agent · gather context", "Review agent · identify gaps", "Drafting agent · prepare brief"], "The agents have assembled the scope, outstanding access questions and a proposed owner for each follow-up. The draft is ready for your review. Nothing has been sent.", "Draft prepared. You choose what happens next."),
    catalogue: example("catalogue", "Your agent team", "agents", "Choose a team to prepare an operations review.", ["Knowledge Agent", "Operations Agent", "Review Agent"], ["Match the task to approved agents", "Check each agent’s scope", "Assemble a review-only workflow"], "Knowledge gathers the source context. Operations prepares the review draft. The reviewer checks the evidence. None of these example agents can issue a production change.", "Specialised agents. A shared foundation."),
    trace: example("trace", "A visible record", "audit", "Show how this draft was prepared.", ["Search event", "Source reference", "Approval checkpoint"], ["Inspect retrieval event", "Follow the source reference", "Find the human review boundary"], "The sample trace connects the question, permitted source and resulting draft. The external action is waiting for review. This is a fictional trace, not production audit evidence.", "Question → evidence → review"),
    install: example("install", "Workspace setup", "deployment", "Prepare a private workspace for the operations team.", ["Identity", "Knowledge sources", "Private model route"], ["Choose the deployment boundary", "Configure scoped source access", "Prepare acceptance checks"], "The example plan brings identity, sources and model routing inside the chosen boundary. Provisioning and acceptance testing are still required before a live deployment.", "Configuration prepared · not provisioned"),
    refusal: example("refusal", "A clear boundary", "policy", "Open connector administration from a department seat.", ["Department role", "Connector administration", "Permitted knowledge"], ["Resolve the current seat", "Check ownership of the surface", "Explain the permitted next step"], "Connector administration belongs to an authorised administrator. This department seat can return to its knowledge workspace or request the right access. It cannot inherit another person’s identity.", "Request blocked · a safe next step explained"),
    deployment: example("deployment", "Inside your boundary", "deployment", "Keep retrieval and model inference inside our private environment.", ["Internal sources", "Knowledge index", "Private model"], ["Read internal source", "Retrieve permitted context", "Route to the private model"], "The example route keeps source retrieval and inference inside the same private boundary. An external model route is not selected. Infrastructure and network controls need deployment validation.", "Private route illustrated · validation required"),
};

export function portalScenario(portal: PortalCard): DemoScenario {
    const noContent = portal.id === "security" || portal.id === "admin";
    return example(`portal-${portal.id}`, `${portal.name} workspace`, noContent ? "policy" : "agents",
        noContent ? `Show the ${portal.name.toLowerCase()} workspace without exposing document content.` : `Prepare a source-backed briefing for the ${portal.name.toLowerCase()} role.`,
        noContent ? ["Role permissions", "Operational metadata", "Document content"] : ["Role permissions", "Permitted sources", "Review queue"],
        ["Resolve the example role", noContent ? "Keep document content unavailable" : "Scope the permitted sources", "Prepare the role’s workspace"],
        `${portal.summary} ${portal.constraint}`, noContent ? "Platform visibility. No document content." : "Your role. Your permitted context.");
}
