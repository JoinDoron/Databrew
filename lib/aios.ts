/**
 * 13Labs landing page — content model.
 *
 * The page exists to make a prospective client understand what AIOS does.
 * Everything on the page reads from this file.
 *
 * The information architecture is modelled on elevenlabs.io. Their page forks
 * into two platforms built on one research foundation; AIOS genuinely has two
 * layers on one shared substrate, so the fork is real rather than borrowed:
 *
 *   Knowledge Foundation  — makes everything the organisation knows findable
 *   Agent Layer           — puts agents to work on top of it
 */

export type LayerId = "foundation" | "agents";

export interface Layer {
    id: LayerId;
    name: string;
    tagline: string;
    blurb: string;
    features: Feature[];
}

export interface Feature {
    id: string;
    name: string;
    body: string;
    /** Which live miniature illustrates it. */
    demo: "console" | "search" | "connectors" | "governance" | "install" | "trace" | "catalogue" | "ingest";
}

export const LAYERS: Layer[] = [
    {
        id: "foundation",
        name: "Knowledge Foundation",
        tagline: "Make everything your organisation knows findable and explainable",
        blurb:
            "Continuously indexes documents, email, file shares, records archives and line-of-business systems. Answers questions with citations back to source, and never returns a document the person asking is not cleared to read.",
        features: [
            {
                id: "search",
                name: "Hybrid search",
                body: "Keyword and semantic retrieval together, expanded by your own glossary — a search for \"forbearance\" still finds the circular that says \"regulatory relief\".",
                demo: "search",
            },
            {
                id: "ingest",
                name: "Unified ingestion",
                body: "Incremental sync across email, SharePoint, file shares and registry systems, with OCR that makes scanned and legacy archives machine-readable.",
                demo: "ingest",
            },
            {
                id: "connectors",
                name: "One connector layer",
                body: "Each source system is connected once and serves both search and every agent that needs it. Read-only by default, never in the transaction path.",
                demo: "connectors",
            },
            {
                id: "clearance",
                name: "Clearance is enforced",
                body: "Existing directory and repository permissions are mirrored. Material above your tier is removed before ranking — not excerpted, not summarised.",
                demo: "governance",
            },
        ],
    },
    {
        id: "agents",
        name: "Intelligence & Agent Layer",
        tagline: "Agents that reason over that knowledge and act on it",
        blurb:
            "Eight to ten specialised agents per organisation, each tuned to a function and each drawing on the same foundation and the same integrations. They analyse, draft, route and flag — and show you every step as they go.",
        features: [
            {
                id: "console",
                name: "You watch it work",
                body: "The agent publishes its plan before it starts, then keeps it truthful as it goes. Every tool call appears in a live activity stream with its target, result and timing.",
                demo: "console",
            },
            {
                id: "catalogue",
                name: "An agent per function",
                body: "Knowledge, oversight, research, operations, workflow, legal, audit and corporate services — named and tuned to your sector, with a builder for the ones we did not think of.",
                demo: "catalogue",
            },
            {
                id: "trace",
                name: "Every run is auditable",
                body: "A run is written once and never edited. Replay the whole trace — the plan, the parameters, the results, the policy verdicts and every document touched.",
                demo: "trace",
            },
            {
                id: "install",
                name: "Install a pack, get a product",
                body: "A vertical pack ships the agents, connectors, taxonomy, compliance profile and rollout plan for your industry. An empty tenant becomes a working system in an afternoon.",
                demo: "install",
            },
        ],
    },
];

/**
 * Vertical packs. These are the landing page's equivalent of the reference
 * site's voice-persona chips: selecting one re-seeds the live demo with that
 * sector's agents, documents and vocabulary.
 */
export interface Pack {
    id: string;
    name: string;
    short: string;
    /** The instance name a client of this type would get. */
    instance: string;
    org: string;
    blurb: string;
    agents: number;
    connectors: number;
    deployment: string;
    /** Seeds the console demo. */
    seed: {
        prompt: string;
        plan: string[];
        tools: { label: string; target: string; result: string; ms: number }[];
        answer: string;
        citations: string[];
    };
}

export const PACKS: Pack[] = [
    {
        id: "central-bank",
        name: "Central Bank & Financial Regulator",
        short: "Central bank",
        instance: "CAIOS",
        org: "a federal central bank",
        blurb: "Supervision, monetary policy and payments oversight, with statutory confidentiality enforced in the retrieval layer.",
        agents: 8,
        connectors: 19,
        deployment: "Air-gapped",
        seed: {
            prompt: "Which institutions are within 100 basis points of the capital floor this quarter?",
            plan: [
                "Locate the Q3 prudential returns",
                "Extract capital adequacy ratios",
                "Compare against the regulatory floor",
                "Draft the supervisory summary",
            ],
            tools: [
                { label: "Searched knowledge base", target: "capital adequacy Q3", result: "14 results · 4 withheld", ms: 312 },
                { label: "Read document", target: "Prudential Returns Summary Q3", result: "18 pp · 3 sections", ms: 1140 },
                { label: "Queried metrics", target: "car", result: "5 points · latest 15.8%", ms: 88 },
                { label: "Checked policy", target: "egress → restricted", result: "Allowed · in-perimeter", ms: 8 },
            ],
            answer:
                "Four institutions sit inside the supervisory watch band this quarter, all between 15.0% and 16.0% against a 15.0% floor. Industry aggregate capital adequacy fell 40 basis points to 15.8%.",
            citations: ["Prudential Returns Summary — Q3 2026", "Examination Report — Tier 1 institution"],
        },
    },
    {
        id: "oil-gas",
        name: "Oil & Gas / Energy",
        short: "Energy",
        instance: "SAIOS",
        org: "an upstream operator",
        blurb: "Asset integrity, HSE and permits, production allocation and joint-venture reporting — with the control-system estate strictly read-only.",
        agents: 8,
        connectors: 26,
        deployment: "Private on-premise",
        seed: {
            prompt: "What did the last in-line inspection change about our corrosion rates?",
            plan: [
                "Find the most recent inspection report",
                "Extract the revised corrosion rates",
                "Check the repair backlog against them",
            ],
            tools: [
                { label: "Searched knowledge base", target: "in-line inspection corrosion", result: "9 results", ms: 268 },
                { label: "Read document", target: "MFL In-Line Inspection Report", result: "42 pp · 3 sections", ms: 980 },
                { label: "Queried source system", target: "maximo · repair backlog", result: "connected · 14,200 records", ms: 410 },
            ],
            answer:
                "The MFL run revised the peak corrosion rate upward and reset the repair factors on two segments. Eleven anomalies now fall inside the intervention window that previously sat outside it.",
            citations: ["MFL In-Line Inspection Report", "Pipeline Integrity Management Plan"],
        },
    },
    {
        id: "government",
        name: "Government Ministry",
        short: "Government",
        instance: "MAIOS",
        org: "a federal ministry",
        blurb: "The official file, correspondence and registry, procurement oversight and freedom-of-information deadlines that actually get met.",
        agents: 8,
        connectors: 22,
        deployment: "Private on-premise",
        seed: {
            prompt: "Which FOI requests are approaching their statutory deadline?",
            plan: ["List open FOI requests", "Check each against the statutory clock", "Flag the ones at risk"],
            tools: [
                { label: "Queried source system", target: "foi case management", result: "connected · 318 open", ms: 340 },
                { label: "Searched knowledge base", target: "FOI exemption analysis", result: "6 results", ms: 224 },
                { label: "Created task", target: "Escalate 3 at-risk requests", result: "TSK-4820", ms: 96 },
            ],
            answer:
                "Three requests fall due within five working days and none has a draft response attached. One involves a part-disclosure with an exemption analysis that has not yet been reviewed by legal.",
            citations: ["FOI Part-Disclosure Determination", "Records Retention Schedule"],
        },
    },
    {
        id: "manufacturing",
        name: "Manufacturing / Conglomerate",
        short: "Manufacturing",
        instance: "DAIOS",
        org: "an industrial group",
        blurb: "Plant performance, quality and batch records, supply chain and group-wide reporting across every operating company.",
        agents: 8,
        connectors: 22,
        deployment: "Dedicated VPC",
        seed: {
            prompt: "What is driving the OEE loss at the northern plant?",
            plan: ["Pull the OEE loss breakdown", "Identify the largest loss category", "Trace it to a root cause"],
            tools: [
                { label: "Queried metrics", target: "oee-northern", result: "12 points · latest 71.4%", ms: 104 },
                { label: "Read document", target: "Group Operations Review", result: "28 pp · 3 sections", ms: 870 },
                { label: "Searched knowledge base", target: "checkweigher drift deviation", result: "7 results", ms: 256 },
            ],
            answer:
                "Availability is the dominant loss, and changeover accounts for most of it. A checkweigher drift deviation raised in the last quality review is still open and is forcing manual re-verification on two lines.",
            citations: ["Group Operations Review", "Checkweigher Drift Deviation & CAPA"],
        },
    },
    {
        id: "ministry-interior",
        name: "Ministry of Interior",
        short: "Interior",
        instance: "IAIOS",
        org: "a federal ministry of interior",
        blurb: "A parent ministry federating four uniformed services — immigration, corrections, civil defence and fire — each with its own records and its own clearance.",
        agents: 10,
        connectors: 26,
        deployment: "Private on-premise",
        seed: {
            prompt: "Summarise the open fire safety enforcement notices in Lagos.",
            plan: [
                "Scope the query to the fire service",
                "Retrieve open enforcement notices",
                "Summarise the contraventions and deadlines",
            ],
            tools: [
                { label: "Listed available sources", target: "9 classes · 26 connectors", result: "4 services indexed", ms: 62 },
                { label: "Searched knowledge base", target: "fire safety enforcement Lagos", result: "5 results · 1 withheld", ms: 298 },
                { label: "Read document", target: "Fire Safety Enforcement Notice", result: "11 pp · 3 sections", ms: 760 },
            ],
            answer:
                "One notice is open against a 21-storey commercial building, requiring eight contraventions to be remedied within 28 days — obstructed escape stairwells, a dry riser out of service above the 14th floor, and an alarm panel in fault for over 90 days.",
            citations: ["Fire Safety Enforcement Notice FFS/LG/EN/2026/0341"],
        },
    },
];

/** Connector groups — the reference site's API section, in our language. */
export const CONNECTOR_GROUPS: { letter: string; name: string; examples: string; phase: 2 | 4 }[] = [
    { letter: "A", name: "Documents, email & collaboration", examples: "Microsoft Graph · SharePoint · OneDrive · SMB file shares · OCR pipeline", phase: 2 },
    { letter: "B", name: "Line-of-business systems", examples: "Regulatory returns · case management · licensing registers · examination repositories", phase: 4 },
    { letter: "C", name: "Operational infrastructure", examples: "Settlement oversight · historians · SCADA extracts — read-only, never in the transaction path", phase: 4 },
    { letter: "D", name: "Data & statistics", examples: "Warehouses · statistical databases · external and multilateral feeds", phase: 4 },
    { letter: "E", name: "ERP, HR & finance", examples: "SAP · Oracle · IFMIS · SuccessFactors · Workday", phase: 4 },
    { letter: "F", name: "Identity, security & governance", examples: "Entra ID · Okta · SAML/OIDC · SCIM · SIEM forwarding", phase: 2 },
];

export const DEPLOYMENTS: { name: string; egress: string; note: string; sealed: boolean }[] = [
    { name: "Shared cloud", egress: "Egress permitted", note: "Fastest to stand up. Multi-tenant, isolated per organisation.", sealed: false },
    { name: "Dedicated VPC", egress: "Egress to approved endpoints", note: "Your own cloud account, your own network boundary.", sealed: false },
    { name: "Private on-premise", egress: "No outbound path", note: "Runs on your hardware, inside your perimeter.", sealed: true },
    { name: "Air-gapped", egress: "No outbound path", note: "No connection to any external network. Self-hosted models only.", sealed: true },
];

export const TRUST: { title: string; body: string }[] = [
    {
        title: "It runs where your data lives",
        body: "Shared cloud, your own VPC, your own hardware, or fully air-gapped. The deployment posture is a setting, not a rewrite.",
    },
    {
        title: "Nothing leaves the perimeter",
        body: "On private deployments there is no outbound path. Retrieval, inference and logging all happen inside your network.",
    },
    {
        title: "Clearance is enforced, not suggested",
        body: "Material above a user's tier is removed before ranking. The system does not excerpt or summarise what you cannot read.",
    },
    {
        title: "Every answer is auditable",
        body: "Each query, tool call, policy verdict and document touched is written to an immutable log and forwarded to your SIEM.",
    },
];

/** Proof the platform ships. */
export const TIMELINE: { date: string; title: string; note: string }[] = [
    { date: "Apr 2026", title: "Knowledge Foundation", note: "Hybrid retrieval, permission mirroring, OCR pipeline" },
    { date: "May 2026", title: "Agent Layer", note: "Model-authored plans, live activity streams, citations" },
    { date: "Jun 2026", title: "Governance", note: "Clearance tiers, policy gating, immutable run traces" },
    { date: "Jul 2026", title: "Vertical packs", note: "Central bank, energy, government and manufacturing" },
    { date: "Aug 2026", title: "Federated packs", note: "Ministry of Interior — four services under one instance" },
];

export const STATS: { value: string; label: string }[] = [
    { value: "5", label: "vertical packs" },
    { value: "26", label: "connectors" },
    { value: "4", label: "deployment postures" },
];

/**
 * The naming rule — a small, memorable idea worth its own moment on the page.
 * An organisation's initial is prefixed onto AIOS, so a generic platform
 * arrives already wearing the customer's name.
 */
export function deriveInstance(initials: string): string {
    const first = (initials.trim()[0] ?? "A").toUpperCase();
    return `${first}AIOS`;
}
