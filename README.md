# Databrew

A Brewling company. AIOS is the product; Databrew is the company brand.

Marketing website and interactive product explorer built with Next.js, React,
TypeScript and Tailwind CSS. The working directory retains its existing name to
avoid breaking local project links; visible branding and package metadata use Databrew.

## Run locally

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3013
```

- `/`: monochrome enterprise introduction, replayable agent walkthrough, capability
  tabs, integration families, industry configurations, deployment selector, buyer
  resources, all four Interior service demos, FAQs and local pilot planner.
- `/platform`: detailed product explorer, architecture, role-based portals,
  connectors and deployment options. `?pack=ministry-interior#console` selects
  that configuration when the page loads.
- `/brand`: logo, palette, typography, patterns and visual-language guide.
- `/integrations`: searchable provider-family directory, category filters and
  implementation requirements. Not a list of connected production services.
- `/enterprise`: deployment comparison, buyer readiness and security review paths.
- `/resources`: substantive pilot, security and deployment planning guides.
- `/solutions`: searchable department/industry directory matching the supplied
  coverage reference plus Telecommunications (11 department paths and 20 industry paths).
- `/solutions/[slug]`: one shared, statically generated template for all 31
  solution blueprints, with tailored workflows, source suggestions, integration
  references, review boundaries and a preselected pilot planner.
- `/brand/databrew-brand-kit.zip`: SVG/PNG signatures, icons, pattern, tokens,
  font/licence and a six-page PDF guide. Wordmark exports contain outlined lettering.

Set `NEXT_PUBLIC_AIOS_URL` at build time to show a link to the actual hosted
AIOS workspace on the platform page. Do not use a developer-only localhost
address for a public deployment. The website does not provision an AIOS instance.

The pilot planner downloads a text brief locally. It does not collect email,
submit leads, send messages or create a deployment. All product demonstrations are
animated, explicitly fictional illustrations—not production evidence or live model calls.
Department and industry choices come from `lib/solutions.ts`, which is also the
single source for the Solutions menu, homepage coverage and solution routes.
This marketing catalogue does not create tenants, roles, adapters or installed
AIOS packs. Existing demo packs are reused and remain separate from the broader
use-case blueprints. Government retains the NIS, NCoS, NSCDC and FFS demo path.

## Visual direction

“Human ambition. Amplified.” is optimistic about what people can do with AI,
while the product presentation makes scope and limitations visible. The visual
direction is strictly monochrome: Ink, White, Silver, Fog and Graphite. Familjen Grotesk is the
single type family. The Confluence mark combines three horizontal streams into an
open D. Parallel paths and shared curves form the supporting brand pattern.

`public/brand/tokens.json` owns the mark geometry and kit values; the website's
shared `components/brand.tsx` reads the same geometry. `app/globals.css` owns CSS tokens
and existing responsive layouts; `app/enterprise.css` contains the enterprise site
layout. `lib/enterprise-site.ts` shares marketing navigation, integration descriptions,
deployment choices and buyer guides. It is not a second provider implementation.
The existing pack, service and solution catalogues are reused, not duplicated. The OFL-licensed variable font is bundled in `public/fonts`
and self-hosted through Next's local font loader. Builds do not fetch Google Fonts.
Run `npm run brand:build` to regenerate the kit from the shared identity. The export
pipeline uses dev-only dependencies and never runs in visitors' browsers.

## Research and customer journey

These are qualitative design observations, not evidence of conversion rates or
claims that a particular visual treatment caused a company's success.

| Reference | Useful observation | Databrew application |
| --- | --- | --- |
| [Onyx](https://onyx.app/) — primary reference | Product-first hierarchy, restrained monochrome, self-serve exploration alongside buyer conversion, connected sources and deployment choices. | Split hero, shared-knowledge illustration, early sourced-answer walkthrough, flat controls, deployment selector and distinct demo/pilot paths. |
| [Glean](https://www.glean.com/) | Search, assistant and agents are organised around enterprise context, roles and governance. | Product/solutions navigation; one knowledge foundation and scoped workspaces. |
| [Coveo](https://www.coveo.com/en) | Business outcomes lead; ecosystem and technical detail support evaluation. | Useful-work positioning, integrations page and buyer-readiness checklist. No borrowed ROI figures. |
| [GoSearch](https://www.gosearch.ai/) | Search, chat, agents and workflows create an understandable capability hierarchy. | Four-pillar capability strip, task examples and accessible source exploration. |
| [Elastic](https://www.elastic.co/) | Product architecture, deployment choices and technical resources serve different evaluation paths. | Dedicated Enterprise and Resources pages, concrete operating-boundary choices. |
| [Kore.ai](https://www.kore.ai/) | Business use cases and employee/customer needs provide entry points into a broad platform. | Industry configurations, role relevance and focused pilot planning. |

The buyer journey is orientation → inspectable product example → capability and
integration fit → sector relevance → deployment/control → buyer guides → a
concrete pilot brief. These are visitor choices, not a forced funnel. Competitor
copy, client logos, testimonials, claims and proprietary assets are not reused.
Original AIOS captures are retained on disk but no longer rendered by website pages.
The walkthroughs are labelled simulations, not live model calls.

For Nigerian and African buyers, the page explicitly addresses local workflows,
departmental permissions and deployment preferences without treating every
organisation as identical. Private deployment is a planning option, not a claim
that infrastructure is already provisioned. A public-sector buyer can inspect
all Interior services and then move into role/governance detail without submitting
contact information. An enterprise buyer can begin with one team and use case.

Before public launch, add approved legal/contact information and a real hosted
workspace URL. Do not fabricate customer logos, certifications, SLAs or ROI figures.
After launch, evaluate demo entry, sector selection, capability exploration and
pilot-brief completion with consent-appropriate measurement. No analytics SDK is
installed by this design change.

[Craftwork](https://craftwork.design/mcp) guidance informed the reference and
visual-consistency review. Its wizard installed the local skill. Familjen Grotesk
was selected through its public catalogue; licensed source files came from the
Google Fonts repository. Craftwork Grotesk and Unbounded were considered but not
used. No paid assets were purchased. The mark, pattern and monochrome product illustrations carry the identity. Trademark clearance is a separate pre-launch step.
The user's preferred Onyx-led black-and-white direction replaces the earlier
green/citron palette throughout the website and downloadable kit. Typography,
contrast, space and restrained motion provide expression. All interface icons
use the existing Lucide library.

## Animated illustrations

`components/animated-demo.tsx` owns one finite, replayable timeline for every example.
`lib/demo-scenarios.ts` holds fictional narrative data and derives its questions,
sources and role context from the existing catalogues. It covers all 31 solution
routes, five packs, all four Interior services, six portals and feature examples.
`app/demos.css` supplies responsive DOM illustrations: search, source processing,
agent activity, access boundaries, review traces and deployment planning.

Playback starts in view, pauses off-screen or in a background tab, and ends on the
review draft. Pause, replay, skip-to-result, expandable sources and reduced-motion
support are built in. The same scenario has unique disclosure IDs per instance.
Restricted example sources are visibly withheld and cannot be inspected. No
new animation package, telemetry, provider connection or backend data is added.

## Verification

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Browser review should cover mobile/tablet/desktop layout, keyboard navigation of
tabs, mega-menu dismissal, integration search/empty states, deployment comparison,
mobile-menu dismissal, sector-to-platform links, all four Interior services,
brand downloads and the local-only pilot planner. CSS honours reduced motion;
the timed demo also stops advancing when that preference is enabled.

Monochrome revision QA: lint, TypeScript and webpack production build passed.
Browser checks covered navigation and Escape dismissal, keyboard example tabs,
replay, citation expansion, Interior service selection, deployment switching,
integration search/category/empty/reset states, local pilot-brief download and
390px/768px/desktop layouts. All six PDF pages were rendered and visually reviewed;
the 33-file kit archive passed its integrity check. Local section links were
checked against rendered IDs. These checks are not a production deployment or
a full accessibility certification.

Solution coverage QA: the catalogue was checked against every label in the supplied
reference (11 department paths / 19 industry paths). All slugs are unique, every
child has a valid same-kind parent, and all suggested integrations reference the
existing integration catalogue. All 30 pages prerendered with unique titles and
visible review boundaries. Browser checks covered search/empty/reset states,
mobile navigation, 390px and 768px layouts, preselected pilot fields and an actual
download containing the chosen department and industry. The existing Government
and four-service Interior demo paths remain connected. No backend capability,
tenant or pack was duplicated or created by this website change.

Animated-demo QA: 55 unique scenario definitions passed completeness checks;
all 30 solution routes prerendered with their own labelled illustration. TypeScript
and the webpack production build passed. Browser checks covered pause/replay,
skip-to-result, inspectable citations, keyboard service switching, all four Interior
agencies and inaccessible restricted-source examples. Homepage, platform,
healthcare, integrations and enterprise had no horizontal overflow at 390px;
tablet and desktop examples were also inspected. No product screenshots are
rendered by these pages. The original capture files are preserved.

## Researched integration catalogue

`lib/integrations.ts` is the single website catalogue: 52 distinct systems and
integration targets, with proposed use cases, connection methods, setup limits
and official vendor/standards references. `lib/enterprise-site.ts` re-exports the
same array for compatibility; it does not maintain a second copy. Existing AIOS
provider-contract IDs and deep links are preserved. No backend adapter, account
connection or credential has been added by this website work.

The directory uses searchable cards and category navigation inspired by GoSearch,
with Databrew's own monochrome design and original copy. It adds filters for all
20 industries, 11 departments, readiness and selected Nigeria/Africa-focused
payment and healthcare targets. All 31 solution pages draw their recommendations
from the same provider IDs, and show the readiness beside each suggested system.

Readiness is deliberately explicit: the nine existing connector-contract families
are foundations requiring configuration and live acceptance; researched targets
still need adapter implementation; discovery targets need agreed interfaces and
commercial access. Hirebrew is the only People & HR platform listed. SAP, Oracle
and Odoo are scoped to non-HR business modules. Recommendations express editorial
fit, not a market-share ranking, vendor partnership or an installed connection.

Run `node scripts/check-integrations.mjs` to catch duplicate IDs/names, duplicate
recommendations, broken solution references, missing sources and accidental HR
catalogue expansion. Also run `npx tsc --noEmit` and `npm run build -- --webpack`.

Platform artwork is served locally from `public/integrations/` through one shared
`IntegrationLogo` component and `lib/integration-logos.ts`. Original brand shapes
are preserved; CSS applies monochrome rendering without reintroducing colour on
hover. The source manifests retain attribution and the Simple Icons licence.
Corporate marks identify suites where a standalone product mark is unavailable.
Generic file-share, government and telecom connections use neutral interface
icons, not invented vendor logos. Hirebrew uses the approved monochrome Lift
symbol from the owner's local brand kit. No third-party logo service is called by
visitors. The catalogue check also validates logo coverage and safe local assets.
