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
    /**
     * Which screen illustrates it. Every one of these resolves to a real capture
     * through FEATURE_SHOT in lib/portals.ts — except "console", which is the one
     * subject a still frame cannot carry and is played as a live miniature.
     */
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
 * A federated pack runs several semi-autonomous services under one instance.
 * Each keeps its own records, its own lead agent and its own operational
 * language, so each carries a complete run of its own rather than a label on
 * somebody else's — otherwise a client watching the demo meets one service and
 * never learns the others exist.
 */
export interface ServiceSeed {
    id: string;
    /** How the service is referred to in operational writing. */
    abbr: string;
    name: string;
    /** One line: what this service actually does. */
    remit: string;
    /** The AIOS agent that leads it. */
    agent: string;
    /** The information classes it owns, of the pack's total — e.g. "2 of 9". */
    classes: string;
    /** A complete run in this service's own vocabulary. */
    seed: Pack["seed"];
}

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
    /** Seeds the console demo. On a federated pack this is the cross-service run. */
    seed: {
        prompt: string;
        plan: string[];
        tools: { label: string; target: string; result: string; ms: number }[];
        answer: string;
        citations: string[];
    };
    /** Federated packs only — one complete run per constituent service. */
    services?: ServiceSeed[];
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
        connectors: 23,
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
        blurb:
            "A parent ministry federating the Nigeria Immigration Service, the Nigerian Correctional Service, the Nigeria Security and Civil Defence Corps and the Federal Fire Service — each with its own records, its own casework systems and its own clearance.",
        agents: 10,
        connectors: 27,
        deployment: "Private on-premise",
        /**
         * The default run is deliberately the ministry-wide one: the Knowledge
         * Agent reaching across all four services at once and naming the owner
         * of every figure. Each service's own run lives in `services` below.
         */
        seed: {
            prompt: "Give me the position across all four services this month, naming the service behind every figure.",
            plan: [
                "List the sources available across the federation",
                "Retrieve the current position from each service",
                "Attribute every figure to the service that owns it",
                "Synthesise the ministry-wide view",
            ],
            tools: [
                { label: "Listed available sources", target: "9 classes · 27 connectors", result: "4 services indexed", ms: 62 },
                { label: "Searched knowledge base", target: "current position by service", result: "18 results · 3 withheld", ms: 341 },
                { label: "Queried metrics", target: "custodial-occupancy · pgc-licences · fire-response", result: "3 series · 15 points", ms: 118 },
                { label: "Checked policy", target: "cross-service scope → confidential", result: "Allowed · attribution required", ms: 9 },
            ],
            answer:
                "Answered per service, then synthesised. NIS: 148,300 crossings at the western corridor post in July, 82% of them ECOWAS-protocol movements. NCoS: occupancy at 141% of certified capacity, awaiting-trial share 66%. NSCDC: 741 of 872 guard company renewals cleared on first review. FFS: median urban response 15.7 minutes, from 21.4 in March.",
            citations: [
                "Border Post Operational Report — Western Corridor Land Border Post, July 2026",
                "Memorandum to the Honourable Minister — Custodial Decongestion Programme, Phase II",
                "Private Guard Company Licensing Compliance Review — 2026 Renewal Cycle",
            ],
        },
        services: [
            {
                id: "nis",
                abbr: "NIS",
                name: "Nigeria Immigration Service",
                remit:
                    "Passports and travel documents, the e-visa regime, border posts, CERPAC residency and expatriate quota, and ECOWAS free movement.",
                agent: "Immigration & Border Agent",
                classes: "2 of 9",
                seed: {
                    prompt: "What has the expanded e-visa regime done to throughput at the western corridor land border post?",
                    plan: [
                        "Find the circular that expanded the e-visa regime",
                        "Pull July throughput from the border post report",
                        "Separate ECOWAS protocol movements from third-country",
                        "Check BMIS availability against the standard",
                    ],
                    tools: [
                        { label: "Searched knowledge base", target: "e-visa regime expansion", result: "7 results", ms: 284 },
                        { label: "Read document", target: "Circular NIS/HQ/VIS/2026/07", result: "9 pp · 3 sections", ms: 726 },
                        { label: "Queried source system", target: "border mis · western corridor", result: "connected · 148,300 crossings", ms: 412 },
                        { label: "Read document", target: "Border Post Operational Report · July", result: "16 pp · 3 sections", ms: 840 },
                    ],
                    answer:
                        "The post processed 148,300 crossings in July — 82% of them ECOWAS-protocol movements, which sit outside the visa regime entirely. E-visa verifications numbered 1,860 in the first month of the expanded regime, with 43 failures, all resolved as connectivity events rather than invalid authorisations. BMIS uptime was 91.4% against a 99% standard, degraded by two weekend generator failures totalling 61 hours. Refusals of entry were 212 and removal escorts 34, reported as counts against named case files.",
                    citations: [
                        "Circular NIS/HQ/VIS/2026/07 — Expansion of the e-Visa Regime",
                        "Border Post Operational Report — Western Corridor Land Border Post, July 2026",
                    ],
                },
            },
            {
                id: "ncos",
                abbr: "NCoS",
                name: "Nigerian Correctional Service",
                remit:
                    "Custodial and non-custodial corrections — custody records, congestion and welfare, rehabilitation programmes, escort and court production.",
                agent: "Custodial Operations Agent",
                classes: "2 of 9",
                seed: {
                    prompt: "How congested is the northern zone custodial centre, and against what certified capacity?",
                    plan: [
                        "Retrieve the latest inspection report for the centre",
                        "State the lock-up count against certified capacity",
                        "Break out the awaiting-trial population",
                        "Place it against the national decongestion position",
                    ],
                    tools: [
                        { label: "Searched knowledge base", target: "custodial congestion awaiting trial", result: "6 results · 2 withheld", ms: 306 },
                        { label: "Read document", target: "Custodial Facility Inspection Report", result: "27 pp · 3 sections", ms: 1180 },
                        { label: "Queried metrics", target: "custodial-occupancy", result: "5 points · latest 138%", ms: 96 },
                        { label: "Checked policy", target: "custodial records → restricted", result: "Aggregates only · named files gated", ms: 11 },
                    ],
                    answer:
                        "The centre held 1,882 persons against a certified capacity of 864 on the inspection date — 218% occupancy. Awaiting-trial persons numbered 1,336, or 71% of the lock-up, of whom 412 had been on remand for more than a year and 118 for more than three. Nationally, occupancy stands at 141% of certified capacity with the awaiting-trial share at 66%, down from 72% at the launch of Phase I.",
                    citations: [
                        "Custodial Facility Inspection Report — Northern Zone Medium-Security Custodial Centre",
                        "Memorandum to the Honourable Minister — Custodial Decongestion Programme, Phase II",
                    ],
                },
            },
            {
                id: "nscdc",
                abbr: "NSCDC",
                name: "Nigeria Security and Civil Defence Corps",
                remit:
                    "Critical national infrastructure protection, anti-vandalism operations, disaster response support and the private guard company licensing register.",
                agent: "Infrastructure Protection Agent",
                classes: "1 of 9",
                seed: {
                    prompt: "How did private guard companies come out of the 2026 licence renewal cycle?",
                    plan: [
                        "Open the compliance review for the renewal cycle",
                        "Compare applications received against the register",
                        "Rank the grounds of non-compliance",
                    ],
                    tools: [
                        { label: "Searched knowledge base", target: "guard company renewal compliance", result: "4 results", ms: 262 },
                        { label: "Read document", target: "PGC Licensing Compliance Review", result: "22 pp · 3 sections", ms: 940 },
                        { label: "Queried source system", target: "guard licensing register · 2026 cycle", result: "connected · 1,046 companies", ms: 368 },
                        { label: "Queried metrics", target: "pgc-licences", result: "5 points · latest 1,057", ms: 84 },
                    ],
                    answer:
                        "Of 1,046 companies on the register at the opening of the cycle, 872 applied by the deadline and 741 were renewed on first review; 131 were queried. Three grounds account for 84% of those queries — incomplete guard registration returns (61), unapproved uniform variants (38) and branch offices operating without endorsement (27). Median renewal turnaround was 34 days against a 21-day standard, the delay sitting in state-command verification visits rather than headquarters review.",
                    citations: ["Private Guard Company Licensing Compliance Review — 2026 Renewal Cycle"],
                },
            },
            {
                id: "ffs",
                abbr: "FFS",
                name: "Federal Fire Service",
                remit:
                    "Fire safety certification and inspection, enforcement and prohibition notices, incident response, investigation and hydrant infrastructure.",
                agent: "Fire Safety & Response Agent",
                classes: "1 of 9",
                seed: {
                    prompt: "Summarise the open fire safety enforcement notices in Lagos.",
                    plan: [
                        "Scope the query to the fire service",
                        "Retrieve open enforcement notices",
                        "Summarise the contraventions and deadlines",
                    ],
                    tools: [
                        { label: "Searched knowledge base", target: "fire safety enforcement Lagos", result: "5 results · 1 withheld", ms: 298 },
                        { label: "Read document", target: "Fire Safety Enforcement Notice", result: "11 pp · 3 sections", ms: 760 },
                        { label: "Queried source system", target: "fire certification · re-inspection diary", result: "connected · day 30 scheduled", ms: 354 },
                    ],
                    answer:
                        "One notice is open against a 21-storey commercial building, requiring eight contraventions to be remedied within 28 days — escape stairwells obstructed between floors 9 and 12, a dry riser holding no pressure on floors 14 to 21, and an alarm panel in zone fault for over 90 days. The stairwell obstruction is an immediate-danger item on a 48-hour clock; failure there grounds a prohibition notice on floors 9 and above.",
                    citations: ["Fire Safety Enforcement Notice FFS/LG/EN/2026/0341"],
                },
            },
        ],
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
    { value: "27", label: "connectors" },
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
