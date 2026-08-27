/**
 * The six AIOS portals, as shown on the landing page.
 *
 * Every `shot` here is a real screenshot of the running product, captured from
 * the CAIOS instance — not an illustration. The whole point of this section is
 * that AIOS is a different product depending on who signs in, and the only
 * honest way to show that is with the actual screens.
 *
 * All six are the same kind of screen — that seat's landing page — so the frames
 * are comparable as you click across them. Swapping one for a different surface
 * makes the section read as six screenshots rather than one platform seen six
 * ways, which is the opposite of the point.
 */

export interface PortalCard {
    id: string;
    /** Portal name as it appears in the product. */
    name: string;
    /** The signed-in person in the screenshot. */
    persona: string;
    title: string;
    /** What this portal is for, in one line. */
    summary: string;
    /** The reach numbers visible in the screenshot — real, not rounded. */
    reach: { agents: string; classes: string; ceiling: string };
    /** The constraint that defines this portal. */
    constraint: string;
    shot: string;
}

export const PORTAL_CARDS: PortalCard[] = [
    {
        id: "directorate",
        name: "Directorate",
        persona: "Folake Abubakar",
        title: "Principal Bank Examiner",
        summary:
            "The everyday seat. An officer works inside one directorate, with the agents licensed to it and nothing else.",
        reach: { agents: "2 of 8", classes: "1 of 7", ceiling: "restricted" },
        constraint: "Cannot reach monetary policy, connectors or platform settings.",
        // The portal home, not the agent console: its left rail carries the exact
        // "what this portal reaches" panel this card reads out, and it keeps the
        // six frames comparable — every one of them is that seat's landing screen.
        shot: "/product/portal-examiner.png",
    },
    {
        id: "executive",
        name: "Executive",
        persona: "Sadiq Aliyu",
        title: "Deputy Governor, Financial System Stability",
        summary:
            "Cross-cutting sight of decisions awaiting sign-off, KPI movement and escalations — without touching the platform itself.",
        reach: { agents: "8 of 8", classes: "7 of 7", ceiling: "restricted" },
        constraint: "Reads everywhere. Configures nothing.",
        shot: "/product/portal-executive.png",
    },
    {
        id: "audit",
        name: "Audit",
        persona: "Obinna Eze",
        title: "Director, Internal Audit",
        summary:
            "Control testing across the whole estate: every run trace, every policy verdict, every document touched.",
        reach: { agents: "read-only", classes: "7 of 7", ceiling: "restricted" },
        constraint: "No agent holding a mutating tool. Cannot alter a record or a permission.",
        shot: "/product/portal-audit.png",
    },
    {
        id: "security",
        name: "Security",
        persona: "Ibrahim Uche",
        title: "Chief Information Security Officer",
        summary:
            "The anomaly queue, the verdict stream and SIEM health — assembled entirely from the log plane.",
        reach: { agents: "none", classes: "0 of 7", ceiling: "internal" },
        constraint:
            "Never sees document content. An operator who may not read a record cannot ask an agent to read it for them.",
        shot: "/product/portal-security.png",
    },
    {
        id: "admin",
        name: "Administration",
        persona: "Ifeoma Bello",
        title: "Head, Enterprise Systems",
        summary:
            "Connectors, agent configuration, seats, model routing and deployment posture — the operator's console.",
        reach: { agents: "none", classes: "0 of 7", ceiling: "internal" },
        constraint: "Runs the platform and has no path to content at all.",
        shot: "/product/portal-admin.png",
    },
    {
        id: "staff",
        name: "Staff",
        persona: "Hauwa Yakubu",
        title: "Officer I, Corporate Services",
        summary:
            "The widest, shallowest seat: leave, policy, payslips and procurement status. Most of an institution lives here.",
        reach: { agents: "1 of 8", classes: "1 of 7", ceiling: "internal" },
        constraint: "One agent. Internal tier. Nothing operational.",
        shot: "/product/portal-staff.png",
    },
];

/**
 * Real screens used elsewhere on the page. Same rule: these are captures of the
 * running product, so what a client sees here is what they get.
 */
export const SHOTS = {
    console: "/product/console.png",
    consoleInterior: "/product/interior.png",
    knowledge: "/product/knowledge.png",
    ingestion: "/product/ingestion.png",
    connectors: "/product/connectors.png",
    governance: "/product/governance.png",
    runs: "/product/runs.png",
    trace: "/product/trace.png",
    onboarding: "/product/onboarding.png",
    agents: "/product/agents.png",
    home: "/product/home.png",
    blocked: "/product/examiner-blocked.png",
} as const;

/**
 * The four service captures on the Ministry of Interior instance.
 *
 * A federated pack is only half-shown by its ministry-wide screen. IAIOS is one
 * instance, but an officer of the immigration service and an officer of the fire
 * service do not open the same product: the rail lists different agents, the
 * portal reaches a different information class, and the clearance ceiling is set
 * by the seat rather than by the ministry. These are captures of exactly that —
 * one per service — so switching scope on the page changes the software on
 * screen, not just the words beneath it.
 *
 * `reach` is read off the "what this portal reaches" panel in each capture and
 * is the seat's reach, which is narrower than the service's own holdings: the
 * immigration service owns two of the nine information classes, but a directorate
 * seat inside it works in one of them.
 */
export interface ServiceShot {
    src: string;
    /** The officer the capture is signed in as. */
    persona: string;
    title: string;
    /** The portal's own label for what it works in. */
    scope: string;
    reach: { agents: string; classes: string; ceiling: string };
    /** The agents in that seat's rail, in the order the capture lists them. */
    rail: string[];
    alt: string;
}

export const SERVICE_SHOTS: Record<string, ServiceShot> = {
    nis: {
        src: "/product/svc-nis.png",
        persona: "Chinelo Ogunleye",
        title: "Deputy Comptroller, Immigration",
        scope: "Passports, visas & residency",
        reach: { agents: "3 of 10", classes: "1 of 9", ceiling: "restricted" },
        rail: ["Ministry Knowledge Agent", "Immigration & Border Agent", "Policy & Migration Statistics Agent"],
        alt:
            "The IAIOS directorate portal of the Nigeria Immigration Service: signed in as Chinelo Ogunleye, Deputy Comptroller, Immigration, at restricted clearance, with the portal reaching 3 of 10 agents and 1 of 9 information classes — Ministry Knowledge, Immigration & Border and Policy & Migration Statistics in the dark rail, retrieval filtered to passports, visas and residency.",
    },
    ncos: {
        src: "/product/svc-ncos.png",
        persona: "Ifeoma Adeyemi",
        title: "Deputy Controller, Inmate Records",
        scope: "Inmate records & casework",
        reach: { agents: "2 of 10", classes: "1 of 9", ceiling: "restricted" },
        rail: ["Ministry Knowledge Agent", "Custodial Operations Agent"],
        alt:
            "The IAIOS directorate portal of the Nigerian Correctional Service: signed in as Ifeoma Adeyemi, Deputy Controller, Inmate Records, at restricted clearance, with the portal reaching 2 of 10 agents and 1 of 9 information classes — Ministry Knowledge and Custodial Operations in the dark rail, retrieval filtered to inmate records and custodial casework.",
    },
    nscdc: {
        src: "/product/svc-nscdc.png",
        persona: "Damilola Nwachukwu",
        title: "Deputy Commandant, Infrastructure Protection",
        scope: "Infrastructure protection",
        reach: { agents: "2 of 10", classes: "1 of 9", ceiling: "confidential" },
        rail: ["Ministry Knowledge Agent", "Infrastructure Protection Agent"],
        alt:
            "The IAIOS directorate portal of the Nigeria Security and Civil Defence Corps: signed in as Damilola Nwachukwu, Deputy Commandant, Infrastructure Protection, at confidential clearance, with the portal reaching 2 of 10 agents and 1 of 9 information classes — Ministry Knowledge and Infrastructure Protection in the dark rail, retrieval filtered to infrastructure protection and guard company licensing.",
    },
    ffs: {
        src: "/product/svc-ffs.png",
        persona: "Adaeze Abubakar",
        title: "Assistant Chief Fire Officer",
        scope: "Fire safety & enforcement",
        reach: { agents: "2 of 10", classes: "1 of 9", ceiling: "internal" },
        rail: ["Ministry Knowledge Agent", "Fire Safety & Response Agent"],
        alt:
            "The IAIOS directorate portal of the Federal Fire Service: signed in as Adaeze Abubakar, Assistant Chief Fire Officer, at internal clearance — the lowest ceiling of the four, with the two tiers above it locked — the portal reaching 2 of 10 agents and 1 of 9 information classes, Ministry Knowledge and Fire Safety & Response in the dark rail.",
    },
};

/** Which real screen illustrates each feature in lib/aios.ts. */
export const FEATURE_SHOT: Record<string, string> = {
    search: SHOTS.knowledge,
    ingest: SHOTS.ingestion,
    connectors: SHOTS.connectors,
    clearance: SHOTS.governance,
    console: SHOTS.console,
    catalogue: SHOTS.agents,
    trace: SHOTS.trace,
    install: SHOTS.onboarding,
};
