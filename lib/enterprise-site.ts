// Compatibility export: the provider catalogue has a single source of truth.
export { INTEGRATIONS } from "./integrations";

export const DEPLOYMENT_CHOICES = [
    { id: "cloud", name: "Private cloud", icon: "cloud", boundary: "Your cloud boundary", summary: "A dedicated environment, with your network policy and a model route chosen for your data.", model: "Approved provider or private model endpoint", network: "Explicitly allowed endpoints", owner: "Your cloud team + deployment partner", requirements: ["Provision storage, secrets and identity", "Validate tenant and source permissions", "Agree model routing and data residency"] },
    { id: "premise", name: "On-premise", icon: "server", boundary: "Your infrastructure", summary: "Bring the workspace to your infrastructure and keep the deployment aligned with local operating requirements.", model: "Private model serving where required", network: "Configured internal perimeter", owner: "Your infrastructure and security teams", requirements: ["Size compute, storage and model capacity", "Connect the enterprise identity provider", "Test backup, restore and operational telemetry"] },
    { id: "airgap", name: "Air-gapped", icon: "lock", boundary: "Isolated environment", summary: "For environments that cannot depend on an external service. Local models and offline release procedures become part of the plan.", model: "Self-hosted models; no hosted fallback", network: "No external network path", owner: "Your sovereign deployment team", requirements: ["Provision local model and extraction runtimes", "Validate network isolation with evidence", "Verify signed releases and recovery procedures"] },
] as const;

export const BUYER_GUIDES = [
    { id: "pilot", tag: "Pilot playbook", title: "Start with one valuable question.", intro: "A focused pilot should prove useful work, not just produce an impressive answer.", steps: [
        { title: "Choose the work", body: "Select one team and one repeatable task: a policy answer, an operational briefing or a document review. Name the person who will judge whether the output is useful." },
        { title: "Choose the evidence", body: "Identify the source documents, their owners and the permissions the pilot must preserve. Include deliberately inaccessible material to test the boundary." },
        { title: "Agree success before starting", body: "Measure answer correctness, citation quality, task completion and human review effort against a baseline. Record failures as carefully as successes." },
        { title: "Decide whether to expand", body: "Review the evidence with users, IT and security. Expand the scope only after provider connections, operating costs and failure handling are understood." },
    ] },
    { id: "security", tag: "Security checklist", title: "The questions your CISO should ask.", intro: "A convincing security review follows the full path from identity to retrieval, model use and the resulting action.", steps: [
        { title: "Who is asking?", body: "Verify the production identity provider, membership and group mapping. Demonstration persona switching is not evidence of production authentication." },
        { title: "What can they reach?", body: "Test allowed and denied documents, cross-department access and connector permissions. Check that restricted content cannot leak through excerpts or tool results." },
        { title: "Where does the data go?", body: "Inspect model routes, endpoint allowlists, secrets custody and network egress. Private and air-gapped claims need verification in the actual deployment." },
        { title: "What happens when it fails?", body: "Exercise a rejected action, a provider outage and a restore. Verify audit records, retention and operational evidence before relying on them." },
    ] },
    { id: "deployment", tag: "Deployment guide", title: "Choose your operating boundary.", intro: "Cloud, on-premise and air-gapped deployments are operating decisions, not interchangeable marketing labels.", steps: [
        { title: "Classify the information", body: "List which records may use an approved external model, which require private inference and which must remain in an isolated environment." },
        { title: "Account for the dependencies", body: "Plan database, object storage, secrets, identity, queues and telemetry. Add isolated analysis or desktop brokers only when those capabilities are in scope." },
        { title: "Plan ownership", body: "Assign owners for infrastructure, models, connectors, incident response and upgrades. Agree recovery objectives and the evidence needed to accept the release." },
        { title: "Validate before rollout", body: "Complete dependency readiness, live-provider acceptance and recovery checks. An application build or a demonstration is not a production sign-off." },
    ] },
] as const;

export const NAV_GROUPS = [
    { label: "Product", intro: "Knowledge, people and work. Connected.", items: [
        { label: "AIOS overview", note: "Meet your organisation’s AI workspace", href: "/platform" },
        { label: "Spaces, projects & tasks", note: "Shared pages. Clear plans. Accountable next steps.", href: "/#spaces" },
        { label: "Enterprise search", note: "Find knowledge. Follow the source.", href: "/platform#foundation" },
        { label: "Agents & workflows", note: "Research, prepare and coordinate work", href: "/platform#agents" },
        { label: "Role-based workspaces", note: "The right tools for each responsibility", href: "/platform#portals" },
    ] },
    { label: "Solutions", intro: "Built around your world.", items: [
        { label: "All solutions", note: "Departments, industries and their specialisms", href: "/solutions" },
    ] },
    { label: "Resources", intro: "Make a more informed decision.", items: [
        ...BUYER_GUIDES.map(guide => ({ label: guide.tag, note: guide.title, href: `/resources#${guide.id}` })),
        { label: "Brand kit", note: "The Databrew visual identity", href: "/brand" },
    ] },
] as const;
