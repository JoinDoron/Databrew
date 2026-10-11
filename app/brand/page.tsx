import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BrandMark, SignalPattern, Wordmark } from "@/components/brand";
import { Nav } from "@/components/nav-hero";
import { BrandFooter } from "@/components/home-sections";
import identity from "@/public/brand/tokens.json";

export const metadata: Metadata = {
    title: "Brand kit | Databrew",
    description: "The Databrew identity. The Confluence mark, Familjen Grotesk typography, colours, patterns and downloadable brand guidelines. A Brewling company.",
};

const PALETTE = [
    { name: "Ink", hex: identity.colour.ink, use: "Our voice. Primary text and dark surfaces.", light: true },
    { name: "Silver", hex: identity.colour.silver, use: "Our contrast. Layers, emphasis and structure.", light: false },
    { name: "White", hex: identity.colour.white, use: "Our canvas. Generous space to think.", light: false },
    { name: "Fog", hex: identity.colour.fog, use: "Our structure. Quiet, supporting surfaces.", light: false },
    { name: "Graphite", hex: identity.colour.graphite, use: "Our detail. Supporting copy and captions.", light: true },
];

export default function Brand() {
    return <>
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main" className="brand-guide">
            <section className="brand-shell guide-intro" id="top">
                <p className="brand-kicker">Databrew / Identity 03</p>
                <h1>Many inputs.<br /><span>One way forward.</span></h1>
                <div>
                    <p>A distinctive mark. An unmistakable voice. An identity for bringing people, knowledge and AI together. Databrew is a Brewling company.</p>
                    <div className="guide-downloads">
                        <a href="/brand/databrew-brand-kit.zip" className="brand-button" download>Download the brand kit <ArrowDown size={18} /></a>
                        <a href="/brand/databrew-brand-guidelines.pdf" className="text-link" download>Brand guidelines PDF <ArrowDown size={16} /></a>
                    </div>
                </div>
            </section>
            <section className="brand-shell guide-section" id="logo">
                <div className="guide-heading"><h2>Meet Confluence.</h2><p>Three incoming streams form an open D. Straight lines bring clarity; one shared curve brings connection. The mark is compact enough for an app icon and confident enough to lead a page.</p></div>
                <div className="logo-board">
                    <div className="logo-board-primary"><div className="endorsed-signature"><Wordmark light /><p>A Brewling company</p></div><span>The endorsed signature</span></div>
                    <div className="logo-board-mark"><BrandMark decorative={false} /><span>The Confluence mark</span></div>
                    <div className="logo-board-paper"><BrandMark /><span>Recognisable at 24px</span></div>
                </div>
                <div className="guide-rule-row"><p>Ink on White. White or Silver on Ink. No gradients inside the logo.</p><a href="/brand/logo.svg" download>Primary SVG <ArrowDown size={14} /></a><a href="/brand/logo-light.svg" download>Reversed SVG <ArrowDown size={14} /></a></div>
                <div className="identity-rules">
                    <article><div className="clearspace-example"><div><BrandMark /></div><span>x</span></div><h3>Give it room.</h3><p>Keep a clear space of 12 units around the 64-unit mark. Use the same spacing unit around the full signature. No text or artwork enters this area.</p></article>
                    <article><div className="scale-example"><BrandMark /><BrandMark /><BrandMark /></div><h3>Keep it legible.</h3><p>Mark: 24px digital or 8mm print minimum. Full logo: 140px or 40mm. Below that, use the mark alone. Keep the supplied proportions and letter spacing.</p></article>
                    <article><div className="mono-example"><BrandMark /><BrandMark /></div><h3>Make it work everywhere.</h3><p>Single-colour versions are included for stamps, reports and one-ink printing. Don’t stretch, outline, rotate or add shadows. Keep the Brewling endorsement readable.</p></article>
                </div>
            </section>
            <section className="brand-shell guide-section" id="colour">
                <div className="guide-heading"><h2>Clarity through<br />contrast.</h2><p>Black and white, with a precise range of greys. Ink carries the message. White makes space. Typography, proportion and contrast provide the expression — no accent colour needed.</p></div>
                <div className="colour-board">{PALETTE.map(colour => <div key={colour.name} style={{ backgroundColor: colour.hex, color: colour.light ? identity.colour.white : identity.colour.ink }}><h3>{colour.name}</h3><code>{colour.hex}</code><p>{colour.use}</p></div>)}</div>
                <div className="guide-rule-row"><p>Use Ink on White and Silver. Use White on Ink. Never use Silver text on White.</p><p>Make states clear with text, shape and contrast, not colour alone.</p></div>
            </section>
            <section className="brand-shell guide-section" id="typography">
                <div className="guide-heading"><h2>A little character.<br />A lot of clarity.</h2><p>Familjen Grotesk gives us expressive details without sacrificing everyday readability. One family carries the whole website: distinctive headlines, open body text and precise numbers.</p></div>
                <div className="type-board">
                    <div><span className="micro-label">Familjen Grotesk / 600</span><p className="type-specimen">Aa</p><p className="type-alphabet">Ideas into<br />possibilities.</p><p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789</p></div>
                    <div><span className="micro-label">Familjen Grotesk / 400–600</span><p className="number-specimen">₦ 012345</p><p className="type-body-example">Bring your organisation’s knowledge together. Ask better questions. Give your people more room to do meaningful work.</p><p>Display 48–96px / 600<br />Headings 28–54px / 600<br />Body 14–18px / 400<br />Controls 12–14px / 600</p></div>
                </div>
                <div className="guide-rule-row"><p>Self-hosted. SIL Open Font License 1.1. Font and licence included in the kit.</p><a href="https://craftwork.design/product/familjen-grotesk" target="_blank" rel="noreferrer">Selected through Craftwork <ArrowUpRight size={14} /></a></div>
            </section>
            <section className="brand-shell guide-section" id="pattern">
                <div className="guide-heading"><h2>From mark to language.</h2><p>Parallel paths, generous curves and a shared direction. The pattern extends the logo into covers, presentations and campaign moments. Keep it away from body text and product controls.</p></div>
                <div className="pattern-board"><SignalPattern /><div><BrandMark /><p>Human ambition.<br /><span>Amplified.</span></p></div></div>
                <div className="guide-rule-row"><p>One expressive gesture per composition. Let everything else breathe.</p><a href="/brand/signal-pattern.svg" download>Pattern SVG <ArrowDown size={14} /></a></div>
                <div className="brand-applications">
                    <article className="brand-social"><Wordmark /><h3>Good questions.<br />Greater possibilities.</h3><BrandMark /><p>AI for the way your organisation works.</p></article>
                    <article className="brand-document"><span className="micro-label">Illustrative document cover</span><BrandMark /><h3>Your knowledge.<br />A shared advantage.</h3><p>AIOS / An introduction</p><span>A Brewling company</span></article>
                </div>
            </section>
            <section className="brand-shell guide-section" id="language">
                <div className="guide-heading"><h2>Optimism with substance.</h2><p>Speak to the person doing the work. Be specific about what AI can help with. Make the next step clear, and the limits equally clear.</p></div>
                <div className="voice-rules"><article><h3>Human, not hyped.</h3><p>Say “Find the policy you need.” Not “Unlock revolutionary intelligence.” Show the task, the source and the person in control.</p></article><article><h3>Local, not narrow.</h3><p>Respect Nigerian and African business realities: diverse teams, deployment constraints and public-sector responsibilities. Build for a global standard of clarity.</p></article><article><h3>Evidence, not theatre.</h3><p>Use clearly labelled product illustrations. Keep fictional examples distinct from operational evidence. Never invent customer logos, certifications or performance claims. Motion should explain a change, not demand attention.</p></article></div>
            </section>
            <section className="guide-research"><div className="brand-shell">
                <h2>Deliberately selected.<br />Built to be our own.</h2>
                <p>The Craftwork wizard guided the typography and resource review. We chose an open-source typeface and created a new mark and pattern for Databrew. No marketplace logo template is used.</p>
                <div className="reference-grid">
                    <a href="https://craftwork.design/product/familjen-grotesk" target="_blank" rel="noreferrer"><h3>Familjen Grotesk <ArrowUpRight size={16} /></h3><p>Selected. Distinctive letterforms, a generous x-height and a variable family that works across headlines and everyday reading.</p></a>
                    <a href="https://github.com/google/fonts/tree/main/ofl/familjengrotesk" target="_blank" rel="noreferrer"><h3>Licensed font source <ArrowUpRight size={16} /></h3><p>Source files obtained from Google Fonts. The SIL Open Font License travels with the kit. No account or third-party font request is needed to view this website.</p></a>
                    <a href="https://craftwork.design/product/craftwork-grotesk" target="_blank" rel="noreferrer"><h3>Craftwork Grotesk <ArrowUpRight size={16} /></h3><p>Considered, not used. A polished alternative; Familjen offered more character for this direction with straightforward open-source distribution.</p></a>
                    <a href="https://craftwork.design/product/unbounded" target="_blank" rel="noreferrer"><h3>Unbounded <ArrowUpRight size={16} /></h3><p>Considered, not used. Expressive as display type, but its wide proportions were less suitable for the navigation and compact product explanations.</p></a>
                </div>
                <p className="guide-credit">The kit includes outlined SVGs, transparent PNGs, app icons, an endorsed lockup, a pattern, design tokens, the font and a printable guide. Trademark clearance is a separate pre-launch step.</p>
                <Link href="/" className="brand-button">See the identity in use <ArrowUpRight size={17} /></Link>
            </div></section>
        </main>
        <BrandFooter />
    </>;
}
