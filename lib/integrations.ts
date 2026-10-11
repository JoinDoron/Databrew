/**
 * One marketing catalogue, not a runtime adapter registry or availability claim.
 * Existing foundation IDs match AIOS lib/connectors/provider-catalog.ts.
 * Recommendations are editorial fit assessments from official vendor resources,
 * not measured market-share rankings, partnerships or customer installations.
 */
export type IntegrationStage = "foundation" | "recommended" | "discovery";
export type Integration = {
    id: string; name: string; category: string;
    protocol: string; detail: string; setup: string; stage: IntegrationStage;
    source?: string; sourceLabel?: string; regional?: boolean; featured?: boolean;
};

export const INTEGRATION_STAGES: Record<IntegrationStage, { label: string; explanation: string }> = {
    foundation: { label: "Connector foundation", explanation: "An existing AIOS contract family. Provider configuration, mapping and live acceptance are still required." },
    recommended: { label: "Recommended", explanation: "A researched integration target with vendor documentation. A Databrew adapter still needs implementation and validation." },
    discovery: { label: "Needs discovery", explanation: "A proposed connection. Confirm the vendor agreement, API access and data contract before committing to delivery." },
};

export const INTEGRATIONS: Integration[] = [
    { id: "microsoft-graph", name: "Microsoft 365", category: "Collaboration", stage: "foundation", featured: true,
        protocol: "Microsoft Graph", detail: "Bring permitted Outlook, Teams and OneDrive context into cited answers and meeting preparation.", setup: "Confirm tenant consent and per-resource permissions. Keep private mail separate from shared workspace content; test revocation and incremental sync.", source: "https://learn.microsoft.com/en-us/graph/overview" },
    { id: "google-workspace", name: "Google Workspace", category: "Collaboration", stage: "recommended", featured: true,
        protocol: "Drive, Gmail & Calendar APIs", detail: "Connect team documents, email context and calendar information for research and preparation.", setup: "Scope each Google API independently. Sensitive scopes can require verification; preserve shared-drive membership and individual mailbox consent.", source: "https://developers.google.com/workspace" },
    { id: "slack", name: "Slack", category: "Collaboration", stage: "recommended", featured: true,
        protocol: "Web API & Events API", detail: "Recover decisions and useful context from approved channels and discussion threads.", setup: "Agree channel access, app distribution and retention first. Respect private-channel membership, provider rate limits and message deletion.", source: "https://docs.slack.dev/apis/web-api/" },
    { id: "sharepoint-odata", name: "SharePoint", category: "Documents & knowledge", stage: "foundation", featured: true,
        protocol: "Graph / SharePoint REST", detail: "Make policies, document libraries and controlled versions easier to find and cite.", setup: "Select sites and libraries; validate item-level permissions, document extraction, version handling and access revocation.", source: "https://learn.microsoft.com/en-us/graph/sharepoint-concept-overview" },
    { id: "notion", name: "Notion", category: "Documents & knowledge", stage: "recommended",
        protocol: "Notion API", detail: "Use shared pages, project knowledge and team playbooks to ground AI answers.", setup: "Share only approved pages with the integration. Validate child-page access and the current data-source schema before indexing.", source: "https://developers.notion.com/guides/get-started/overview" },
    { id: "confluence", name: "Confluence", category: "Documents & knowledge", stage: "recommended",
        protocol: "Confluence Cloud REST API", detail: "Connect internal wikis, technical decisions and operational runbooks.", setup: "Map space and page restrictions; preserve versions and deleted content. Server or Data Center editions need a separate compatibility review.", source: "https://developer.atlassian.com/cloud/confluence/rest/v2/intro/" },
    { id: "box", name: "Box", category: "Documents & knowledge", stage: "recommended",
        protocol: "Box Content API", detail: "Search approved project folders, deal rooms and enterprise document collections.", setup: "Preserve collaboration roles, classification and retention constraints. Confirm whether content may be copied into an AI index.", source: "https://developer.box.com/reference" },
    { id: "smb-bridge", name: "File shares", category: "Documents & knowledge", stage: "foundation",
        protocol: "Private SMB bridge", detail: "Include the shared folders and institutional archives already inside your network.", setup: "Deploy a private bridge with a bounded service account. Mirror file ACLs, detect changes and test removal of deleted or newly restricted files.", source: "https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/" },
    { id: "github", name: "GitHub", category: "Engineering & projects", stage: "recommended",
        protocol: "GitHub REST API", detail: "Link repository documentation, issues and pull-request discussions to engineering answers.", setup: "Use a narrowly scoped GitHub App. Preserve repository access and exclude secrets; code execution and merging are separate approvals.", source: "https://docs.github.com/en/rest" },
    { id: "gitlab", name: "GitLab", category: "Engineering & projects", stage: "recommended",
        protocol: "GitLab REST API", detail: "Connect project knowledge, merge requests and issue context, including self-managed environments.", setup: "Confirm instance version, group inheritance and token scope. Keep CI secrets and protected repositories out of unapproved retrieval.", source: "https://docs.gitlab.com/api/rest/" },
    { id: "jira", name: "Jira", category: "Engineering & projects", stage: "recommended",
        protocol: "Jira Cloud REST API", detail: "Prepare delivery briefs from issues, dependencies and release discussions.", setup: "Carry project permissions and issue-security levels into retrieval. Validate Cloud versus Data Center differences and approval-gate issue changes.", source: "https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/" },
    { id: "asana", name: "Asana", category: "Engineering & projects", stage: "recommended",
        protocol: "Asana REST API", detail: "Connect project plans, task ownership and handovers for team briefings.", setup: "Agree workspace and project scopes. Preserve private task visibility and verify webhook events before enabling follow-up actions.", source: "https://developers.asana.com/docs/overview" },
    { id: "salesforce-rest", name: "Salesforce", category: "CRM & customer service", stage: "foundation", featured: true,
        protocol: "Salesforce REST", detail: "Prepare account briefs and service responses from permitted customer records.", setup: "Map object, record and field-level access. Confirm API entitlements and use a sandbox to validate any approval-gated writes.", source: "https://developer.salesforce.com/docs/platform/api-rest/guide/intro-rest.html" },
    { id: "dynamics-rest", name: "Dynamics 365", category: "CRM & customer service", stage: "foundation",
        protocol: "Dataverse / application APIs", detail: "Bring selected customer, service and operational records into reviewable workflows.", setup: "Dataverse supports selected apps, not every Dynamics module. Confirm the exact application, endpoint, licence, security roles and field mapping.", source: "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview" },
    { id: "hubspot", name: "HubSpot", category: "CRM & customer service", stage: "recommended",
        protocol: "HubSpot CRM APIs", detail: "Connect company, deal and engagement context for sales and marketing preparation.", setup: "Limit object and property access. Map sensitive CRM fields and verify account-specific API limits before collecting engagement history.", source: "https://developers.hubspot.com/docs/api-reference/latest/overview" },
    { id: "zoho-crm", name: "Zoho CRM", category: "CRM & customer service", stage: "recommended",
        protocol: "Zoho CRM API", detail: "Prepare customer and pipeline briefs from selected CRM modules.", setup: "Select the correct regional API domain and OAuth scopes. Reconcile organisation roles, custom modules and field-level restrictions.", source: "https://www.zoho.com/crm/developer/docs/api/v8/" },
    { id: "zendesk", name: "Zendesk", category: "CRM & customer service", stage: "recommended",
        protocol: "Ticketing API", detail: "Use approved ticket history and resolution notes to assist customer-service teams.", setup: "Keep private notes and requester details scoped. Review retention, redaction and the permissions needed for agent-facing answers.", source: "https://developer.zendesk.com/api-reference/ticketing/introduction/" },
    { id: "servicenow-rest", name: "ServiceNow", category: "IT & network operations", stage: "foundation",
        protocol: "ServiceNow Table API", detail: "Connect incidents, service records and change context to grounded triage briefs.", setup: "Allow-list the instance and tables, mirror ACLs and validate selected fields. Test writes against a disposable target with human approval.", source: "https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html" },
    { id: "mailchimp", name: "Mailchimp", category: "Marketing", stage: "recommended",
        protocol: "Marketing API", detail: "Prepare campaign reviews from authorised campaign and report data.", setup: "Prefer aggregate campaign reporting. Respect audience consent and suppression lists; sending or changing a campaign requires explicit approval.", source: "https://mailchimp.com/developer/marketing/api/" },
    { id: "shopify", name: "Shopify", category: "Commerce", stage: "recommended",
        protocol: "GraphQL Admin API", detail: "Connect product, order and inventory context for retail operations and customer-service reviews.", setup: "Confirm store scopes and protected customer-data approval. Start with operational reads; refunds, fulfilment changes and customer messages require separate controls.", source: "https://shopify.dev/docs/api/admin-graphql/latest" },
    { id: "sap-odata", name: "SAP S/4HANA", category: "ERP & finance", stage: "foundation", featured: true,
        protocol: "SAP OData / published APIs", detail: "Connect selected procurement, inventory and finance records for operational reviews.", setup: "Scope to ERP modules, not HR. Confirm edition, communication arrangements, available entity sets and business authorisations; no autonomous postings.", source: "https://api.sap.com/products/SAPS4HANACloud/apis/all" },
    { id: "oracle-rest", name: "Oracle Fusion ERP", category: "ERP & finance", stage: "foundation",
        protocol: "Oracle Fusion REST", detail: "Prepare finance and procurement commentary from selected business records.", setup: "Confirm the exact Fusion application and release. Preserve business-unit and role boundaries, reconcile source totals and keep posting rights separate.", source: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/index.html" },
    { id: "odoo", name: "Odoo", category: "ERP & finance", stage: "recommended",
        protocol: "JSON-2 / version-specific API", detail: "Connect approved sales, inventory and accounting context for growing businesses.", setup: "Scope to business modules, excluding HR. Confirm the installed version and API plan: Odoo 19 external API access requires a Custom plan.", source: "https://www.odoo.com/documentation/19.0/developer/reference/external_api.html" },
    { id: "sage-intacct", name: "Sage Intacct", category: "ERP & finance", stage: "recommended",
        protocol: "Sage Intacct APIs", detail: "Bring authorised accounting and entity reporting into finance-review preparation.", setup: "Confirm API subscription and application authorisation. Scope entities and dimensions, reconcile results and retain a finance sign-off step.", source: "https://developer.sage.com/intacct" },
    { id: "paystack", name: "Paystack", category: "Payments", stage: "recommended", regional: true, featured: true,
        protocol: "Transaction REST API", detail: "Review transactions and collection exceptions for businesses taking digital payments.", setup: "Start with read-only transaction reconciliation. Mask customer details and exclude card data; payment initiation and refunds are outside the first pilot.", source: "https://paystack.com/docs/api/transaction/" },
    { id: "flutterwave", name: "Flutterwave", category: "Payments", stage: "recommended", regional: true,
        protocol: "Transactions API", detail: "Help finance teams review payment exceptions across supported African markets.", setup: "Confirm the merchant region, currency and API version. Reconcile amounts and fees against provider records; do not expose secret keys or payment credentials.", source: "https://developer.flutterwave.com/reference/get-all-transactions" },
    { id: "remita", name: "Remita", category: "Payments", stage: "recommended", regional: true,
        protocol: "Remita APIs", detail: "Scope collection-status and revenue-reconciliation assistance for institutions and businesses.", setup: "Agree the specific Remita service and API generation with the merchant. Production service approval is required; this does not grant access to government accounts.", source: "https://api.remita.net/" },
    { id: "interswitch", name: "Interswitch", category: "Payments", stage: "discovery", regional: true,
        protocol: "Product-specific payment APIs", detail: "Explore a bounded payments-reporting connection where your organisation uses Interswitch.", setup: "Confirm the contracted product, reporting endpoints and commercial access with Interswitch. A public developer portal is not proof of settlement-data access.", source: "https://developer.interswitchng.com/" },
    { id: "temenos", name: "Temenos", category: "Banking & investment", stage: "recommended",
        protocol: "Temenos Core Banking APIs", detail: "Scope read-only operational context for banking-service and control reviews.", setup: "Use bank-approved interfaces and test data first. Map installed products, entitlements and customer-data controls; stay outside the transaction path.", source: "https://developer.temenos.com/transact-apis" },
    { id: "finacle", name: "Finacle", category: "Banking & investment", stage: "discovery",
        protocol: "Finacle API Connect", detail: "Plan a bank-controlled bridge to selected core-banking records and operational reports.", setup: "Confirm the bank’s Finacle release, licensed APIs and vendor-approved contract. No direct database scraping, posting or unrestricted account access.", source: "https://www.edgeverve.com/finacle/wp-content/uploads/2022/10/Finacle_Architecture_Brochure.pdf", sourceLabel: "Vendor architecture brief" },
    { id: "dealcloud", name: "Intapp DealCloud", category: "Banking & investment", stage: "recommended",
        protocol: "DealCloud API", detail: "Prepare investment-pipeline and relationship briefs from permitted deal records.", setup: "Map the firm’s custom schema and deal-team permissions. Keep confidential diligence and material non-public information behind the source access boundary.", source: "https://api.docs.dealcloud.com/" },
    { id: "lseg", name: "LSEG Research", category: "Banking & investment", stage: "recommended",
        protocol: "Research API", detail: "Scope licensed research context for investment teams and portfolio-review preparation.", setup: "Confirm content entitlements and explicit rights for indexing, AI processing and redistribution. API access alone is not a licence to reuse research.", source: "https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/research-API" },
    { id: "guidewire", name: "Guidewire", category: "Insurance", stage: "recommended",
        protocol: "InsuranceSuite Cloud APIs", detail: "Assist policy, claims and service reviews using authorised insurance records.", setup: "Validate the installed product, caller identity and resource-access strategy. Minimise claimant data; underwriting and claims decisions remain with authorised people.", source: "https://docs.guidewire.com/cloud/bc/202511/cloudapibf/" },
    { id: "maximo", name: "IBM Maximo", category: "Industrial & construction", stage: "recommended",
        protocol: "Maximo REST / object structures", detail: "Prepare maintenance briefs from asset history, work orders and approved service records.", setup: "Scope object structures and site access. Use an operational reporting boundary; isolate safety-critical control and write actions from AI retrieval.", source: "https://www.ibm.com/docs/en/masv-and-l/maximo-manage/cd?topic=framework-integration-components" },
    { id: "aveva-pi", name: "AVEVA PI System", category: "Industrial & construction", stage: "recommended",
        protocol: "PI Web API", detail: "Combine approved historian trends and asset context with maintenance evidence.", setup: "Use read-only, bounded time ranges through an approved historian endpoint. Never send control commands or expose operational technology directly to the public web.", source: "https://www.aveva.com/en/products/aveva-pi-system-developer-technologies/" },
    { id: "netbox", name: "NetBox", category: "IT & network operations", stage: "recommended",
        protocol: "NetBox REST API", detail: "Connect network inventory, sites and circuit context to telecom and IT incident reviews.", setup: "Use a read-only token and permitted object scopes. Keep sensitive topology, credentials and precise infrastructure locations tightly controlled.", source: "https://netbox.readthedocs.io/en/stable/integrations/rest-api/" },
    { id: "telecom-oss-bss", name: "Telecom OSS / BSS", category: "IT & network operations", stage: "discovery",
        protocol: "TM Forum-aligned bridge", detail: "Scope service, inventory and trouble-ticket context from an operator’s existing systems.", setup: "TM Forum is a standards family, not a ready-made vendor connector. Confirm which APIs the operator implements and exclude subscriber profiling and network changes.", source: "https://www.tmforum.org/open-digital-architecture/open-apis", sourceLabel: "Standards reference" },
    { id: "laserfiche", name: "Laserfiche", category: "Documents & knowledge", stage: "recommended",
        protocol: "Laserfiche Repository API", detail: "Bring authorised records, metadata and document collections into institutional search.", setup: "Confirm cloud or self-hosted API support, repository access and retention. Preserve record permissions and version history when extracting documents.", source: "https://developer.laserfiche.com/" },
    { id: "kobotoolbox", name: "KoboToolbox", category: "Public sector & field data", stage: "recommended",
        protocol: "KoboToolbox API", detail: "Prepare field-programme summaries from approved forms and survey submissions.", setup: "Agree consent, project ownership and export scope. Prefer de-identified data; restrict beneficiary identities and exact field locations.", source: "https://support.kobotoolbox.org/api.html" },
    { id: "government-rest", name: "Government & custom systems", category: "Public sector & field data", stage: "foundation",
        protocol: "Explicit REST bridge", detail: "Scope ministry registries, case systems and institutional records through a controlled contract.", setup: "Agree APIs, credentials, data ownership and record-level permissions with the system owner. NIS, NCoS, NSCDC and FFS systems need separate approvals; no government access is implied." },
    { id: "helium-health", name: "Helium Health", category: "Healthcare & life sciences", stage: "discovery", regional: true,
        protocol: "Vendor-approved interface", detail: "Explore operational knowledge and reporting use cases around a facility’s Helium EMR.", setup: "A public integration API has not been verified. Agree a vendor-approved interface, data-processing terms and de-identification before scoping any patient-record access.", source: "https://support.heliumhealth.com/support/home", sourceLabel: "Vendor product support" },
    { id: "openmrs", name: "OpenMRS", category: "Healthcare & life sciences", stage: "recommended",
        protocol: "OpenMRS REST API", detail: "Scope approved clinical-operations and service-reporting context for health institutions.", setup: "Start with de-identified operational records. Map facility roles, consent and retention; no diagnosis or autonomous treatment decision is proposed.", source: "https://rest.openmrs.org/" },
    { id: "dhis2", name: "DHIS2", category: "Healthcare & life sciences", stage: "recommended",
        protocol: "DHIS2 Web API", detail: "Prepare public-health programme briefs from authorised indicators and aggregate reports.", setup: "Confirm organisation-unit access and dataset permissions. Begin with aggregate indicators; individual-level tracker data needs separate approval.", source: "https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/introduction.html" },
    { id: "veeva-vault", name: "Veeva Vault", category: "Healthcare & life sciences", stage: "recommended",
        protocol: "Vault REST API", detail: "Find controlled quality documents and prepare evidence for life-sciences review.", setup: "Map document versions, lifecycle states and role restrictions. Agree regulated-use validation; AI summaries do not replace approved records or quality sign-off.", source: "https://general.veevavault.dev/" },
    { id: "moodle", name: "Moodle", category: "Education", stage: "recommended",
        protocol: "Moodle external services", detail: "Connect approved course guidance and learning resources for university staff support.", setup: "Enable only the required external functions and service roles. Separate public resources from grades, private submissions and student records.", source: "https://moodledev.io/docs/5.1/apis/subsystems/external" },
    { id: "canvas", name: "Canvas LMS", category: "Education", stage: "recommended",
        protocol: "Canvas REST API", detail: "Bring permitted course pages and academic-service information into a university knowledge workspace.", setup: "Use scoped developer keys and institutional approval. Preserve course enrolment and role boundaries; no automated grading or admissions decisions.", source: "https://developerdocs.instructure.com/services/canvas" },
    { id: "autodesk", name: "Autodesk Construction Cloud", category: "Industrial & construction", stage: "recommended",
        protocol: "Autodesk Platform Services", detail: "Prepare project reviews from permitted construction documents and issue records.", setup: "Confirm current ACC / Forma product naming, API coverage and project access. Preserve revisions and review responsibility; drawings are not engineering sign-off.", source: "https://aps.autodesk.com/developer/documentation/" },
    { id: "imanage", name: "iManage", category: "Legal & agreements", stage: "recommended",
        protocol: "iManage Work API", detail: "Find permitted matter documents and precedents for professional legal review.", setup: "Confirm application registration and API access with the firm. Preserve ethical walls, matter permissions, privilege and client confidentiality.", source: "https://docs.imanage.com/cc-help/10.5.0/en-US/Applications.html" },
    { id: "docusign", name: "Docusign", category: "Legal & agreements", stage: "recommended",
        protocol: "eSignature REST API", detail: "Bring agreement status and permitted signed-document context into contract reviews.", setup: "Limit the initial scope to authorised document and envelope reads. Sending, signing or changing agreements remains an explicitly approved human action.", source: "https://developers.docusign.com/docs/esign-rest-api/" },
    { id: "power-bi", name: "Power BI", category: "Data & analytics", stage: "recommended",
        protocol: "Power BI REST APIs", detail: "Connect report context and approved analytics assets to management briefings.", setup: "Confirm workspace roles, licences and dataset permissions. Report access is not unrestricted row access; preserve row-level security and reconcile any exported results.", source: "https://learn.microsoft.com/en-us/rest/api/power-bi/" },
    { id: "snowflake", name: "Snowflake", category: "Data & analytics", stage: "recommended",
        protocol: "Snowflake SQL API", detail: "Ground analysis in approved warehouse views and governed business metrics.", setup: "Use read-only roles, approved views, masking policies and query budgets. Never grant unrestricted SQL or treat generated analysis as a reconciled financial result.", source: "https://docs.snowflake.com/en/developer-guide/sql-api/index" },
    { id: "hirebrew", name: "Hirebrew", category: "People & HR", stage: "discovery", featured: true,
        protocol: "Integration contract to confirm", detail: "The designated People & HR integration target for Databrew’s ecosystem.", setup: "Agree supported records, API availability, consent and access rules with the Hirebrew team. No public API or live connection is claimed; personnel records remain separately restricted." },
];

export const INTEGRATION_CATEGORIES = [...new Set(INTEGRATIONS.map(item => item.category))];
export const findIntegration = (id: string) => INTEGRATIONS.find(item => item.id === id);
export const integrationHref = (id: string) => `/integrations#${id}`;

export function matchesIntegration(item: Integration, query: string) {
    const text = `${item.name} ${item.category} ${item.protocol} ${item.detail} ${item.setup}`.toLowerCase();
    return query.trim().toLowerCase().split(/\s+/).every(term => text.includes(term));
}
