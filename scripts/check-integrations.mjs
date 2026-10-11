// Run with: node scripts/check-integrations.mjs
// Catalogue integrity checks; no provider connections or network access.
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

function load(relativePath) {
    const code = ts.transpileModule(fs.readFileSync(new URL(relativePath, import.meta.url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    new Function("exports", code)(exports);
    return exports;
}

const { INTEGRATIONS, INTEGRATION_STAGES, matchesIntegration } = load("../lib/integrations.ts");
const { SOLUTIONS, INDUSTRIES, DEPARTMENTS } = load("../lib/solutions.ts");
const { INTEGRATION_LOGOS } = load("../lib/integration-logos.ts");
const logoSources = {};
for (const group of ["platform", "regional", "enterprise"]) {
    const sources = JSON.parse(fs.readFileSync(new URL(`../public/integrations/${group}-sources.json`, import.meta.url), "utf8"));
    for (const [id, source] of Object.entries(sources)) {
        assert(!logoSources[id], `Duplicate logo provenance: ${id}`);
        logoSources[id] = source;
    }
}
const ids = new Set(INTEGRATIONS.map(item => item.id));
assert.equal(ids.size, INTEGRATIONS.length, "Duplicate integration IDs");
assert.equal(new Set(INTEGRATIONS.map(item => item.name.toLowerCase())).size, INTEGRATIONS.length, "Duplicate provider names");
assert.equal(new Set(SOLUTIONS.map(item => item.slug)).size, SOLUTIONS.length, "Duplicate solutions");
for (const solution of SOLUTIONS) {
    assert(solution.integrations.length >= 4, `Missing coverage: ${solution.slug}`);
    assert.equal(new Set(solution.integrations).size, solution.integrations.length, `Duplicate recommendations: ${solution.slug}`);
    for (const id of solution.integrations) assert(ids.has(id), `Unknown integration ${id} in ${solution.slug}`);
}
for (const item of INTEGRATIONS) {
    assert(!("monogram" in item), `Initials must not replace the logo: ${item.id}`);
    const logo = INTEGRATION_LOGOS[item.id];
    assert(logo, `Missing logo treatment: ${item.id}`);
    if (logo.kind === "brand") {
        assert.equal(logoSources[item.id]?.src, logo.src, `Missing or stale logo provenance: ${item.id}`);
        assert(logoSources[item.id]?.source, `Missing original logo source: ${item.id}`);
        assert(logo.src.startsWith("/integrations/"), `Logo must be local: ${item.id}`);
        const asset = new URL(`../public${logo.src}`, import.meta.url);
        assert(fs.existsSync(asset), `Missing logo file: ${item.id}`);
        assert(fs.statSync(asset).size > 100, `Empty logo: ${item.id}`);
        if (logo.src.endsWith(".svg")) {
            const svg = fs.readFileSync(asset, "utf8");
            assert(svg.includes("<svg"), `Invalid SVG: ${item.id}`);
            assert(!/<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["']https?:|@import/i.test(svg), `Active or remote SVG content: ${item.id}`);
        }
    } else {
        assert(["smb-bridge", "government-rest", "telecom-oss-bss"].includes(item.id), `Branded platforms require real logos: ${item.id}`);
    }
    assert(INTEGRATION_STAGES[item.stage], `Invalid stage: ${item.id}`);
    assert(item.setup && item.detail && item.protocol, `Incomplete entry: ${item.id}`);
    assert(SOLUTIONS.some(solution => solution.integrations.includes(item.id)), `Unmapped recommendation: ${item.id}`);
    if (item.stage === "recommended") assert(item.source?.startsWith("https://"), `Missing research source: ${item.id}`);
    if (item.source) assert.equal(new URL(item.source).protocol, "https:");
}
assert.deepEqual(Object.keys(INTEGRATION_LOGOS).sort(), [...ids].sort(), "Logo registry must match the catalogue exactly");
assert.equal(Object.values(INTEGRATION_LOGOS).filter(logo => logo.kind === "brand").length, 49, "Every branded platform has a sourced logo");
assert.deepEqual(INTEGRATIONS.filter(item => item.category === "People & HR").map(item => item.id), ["hirebrew"]);
assert.equal(INTEGRATIONS.filter(item => item.stage === "foundation").length, 9, "Changing foundation claims requires a product capability review");
assert(matchesIntegration(INTEGRATIONS.find(item => item.id === "paystack"), " PAYSTACK transactions "));
assert(!matchesIntegration(INTEGRATIONS[0], "not-a-real-provider"));
console.log(`PASS: ${INTEGRATIONS.length} unique entries, ${INDUSTRIES.length} industries, ${DEPARTMENTS.length} departments; all references resolve; Hirebrew is the only HR platform.`);
