"use client";

/**
 * Nav + Hero.
 *
 * Modelled on the reference site's opening move: a near-invisible sticky bar, a
 * single quiet headline, and then the working product immediately beneath it.
 * There is no hero image here on purpose — the console demo below IS the visual.
 *
 * Everything the mega-menu lists comes from LAYERS; the strip under the headline
 * comes from STATS. No copy that belongs in lib/aios.ts is written here.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { LAYERS, STATS } from "@/lib/aios";
import { Eyebrow, Pill, Reveal,} from "@/components/ui";
import { cx } from "@/lib/cx";

const NAV = [
    { id: "platform", label: "Platform", href: "#platform" },
    { id: "packs", label: "Packs", href: "#packs" },
    { id: "security", label: "Security", href: "#security" },
    { id: "docs", label: "Docs", href: "#docs" },
];

/* ── Small drawn bits ─────────────────────────────────────── */

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className={cx("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
        >
            <path
                d="M2.5 4.5 6 8l3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** The 13Labs mark: a rounded square holding "13", beside the wordmark. */
function Wordmark() {
    return (
        <a href="#top" className="flex items-center gap-2.5" aria-label="13Labs — home">
            <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-ink text-surface">
                <span className="t-micro tracking-[0.01em]">13</span>
            </span>
            <span className="t-h3 tracking-[-0.1px]">13Labs</span>
        </a>
    );
}

/* ── Nav ──────────────────────────────────────────────────── */

export function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [mega, setMega] = useState(false);
    const [sheet, setSheet] = useState(false);
    const [acc, setAcc] = useState(false);

    const headerRef = useRef<HTMLElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const closeMega = useCallback(() => setMega(false), []);

    /* Escape returns focus to the trigger — which must not re-open the panel. */
    const escapedRef = useRef(false);

    /* Past 24px the bar earns a background and a hairline. */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Escape closes whatever is open; focus returns to the trigger. */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (mega) {
                escapedRef.current = true;
                setMega(false);
                triggerRef.current?.focus();
            }
            setSheet(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [mega]);

    /* Outside click closes the mega-menu. */
    useEffect(() => {
        if (!mega) return;
        const onDown = (e: PointerEvent) => {
            if (!headerRef.current?.contains(e.target as Node)) setMega(false);
        };
        document.addEventListener("pointerdown", onDown);
        return () => document.removeEventListener("pointerdown", onDown);
    }, [mega]);

    /* The sheet owns the viewport while it is open. */
    useEffect(() => {
        if (!sheet) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [sheet]);

    /* Crossing back to desktop must not leave the body locked. */
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const onChange = () => {
            if (mq.matches) setSheet(false);
            else setMega(false);
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    /* Pointer leaving the header closes the panel — unless the keyboard is in it. */
    const onHeaderLeave = () => {
        const active = document.activeElement;
        if (panelRef.current && active && panelRef.current.contains(active)) return;
        closeMega();
    };

    /* Focus moving out of the header entirely closes the panel. */
    const onHeaderBlur = (e: React.FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMega();
    };

    const onTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setMega(true);
            requestAnimationFrame(() => panelRef.current?.querySelector("a")?.focus());
        }
    };

    /* Any link inside the sheet dismisses it. */
    const onSheetClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("a")) setSheet(false);
    };

    return (
        <header
            ref={headerRef}
            onMouseLeave={onHeaderLeave}
            onBlur={onHeaderBlur}
            className="sticky top-0 z-50"
        >
            <div
                className={cx(
                    "relative z-50 border-b transition-colors duration-200",
                    mega
                        ? "border-transparent bg-surface"
                        : scrolled
                          ? "border-hairline bg-canvas/80 backdrop-blur-md"
                          : "border-transparent",
                )}
            >
                <div className="shell flex h-16 items-center gap-4">
                    <div className="flex flex-1 items-center">
                        <Wordmark />
                    </div>

                    {/* Centre */}
                    <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
                        {NAV.map((item) =>
                            item.id === "platform" ? (
                                <button
                                    key={item.id}
                                    ref={triggerRef}
                                    type="button"
                                    aria-expanded={mega}
                                    aria-controls="platform-menu"
                                    aria-haspopup="true"
                                    onMouseEnter={() => setMega(true)}
                                    onFocus={() => {
                                        if (escapedRef.current) {
                                            escapedRef.current = false;
                                            return;
                                        }
                                        setMega(true);
                                    }}
                                    onClick={() => setMega((v) => !v)}
                                    onKeyDown={onTriggerKey}
                                    className={cx(
                                        "t-small flex items-center gap-1.5 transition-colors",
                                        mega ? "text-ink" : "text-ink-2 hover:text-ink",
                                    )}
                                >
                                    {item.label}
                                    <Chevron open={mega} />
                                </button>
                            ) : (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    onMouseEnter={closeMega}
                                    className="t-small text-ink-2 transition-colors hover:text-ink"
                                >
                                    {item.label}
                                </a>
                            ),
                        )}
                    </nav>

                    {/* Right */}
                    <div className="flex flex-1 items-center justify-end gap-2">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Pill href="#contact" variant="secondary" size="sm">
                                Talk to us
                            </Pill>
                            <Pill href="#console" size="sm">
                                See it run
                            </Pill>
                        </div>

                        <button
                            type="button"
                            aria-label={sheet ? "Close menu" : "Open menu"}
                            aria-expanded={sheet}
                            aria-controls="nav-sheet"
                            onClick={() => setSheet((v) => !v)}
                            className="-mr-2 grid h-10 w-10 place-items-center lg:hidden"
                        >
                            <span className="relative block h-3 w-4">
                                <span
                                    className={cx(
                                        "absolute left-0 block h-px w-4 bg-ink transition-transform duration-200",
                                        sheet ? "top-1.5 rotate-45" : "top-0.5",
                                    )}
                                />
                                <span
                                    className={cx(
                                        "absolute left-0 block h-px w-4 bg-ink transition-transform duration-200",
                                        sheet ? "top-1.5 -rotate-45" : "top-2.5",
                                    )}
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mega-menu — one column per layer, straight from LAYERS. */}
            {mega && (
                <div
                    ref={panelRef}
                    id="platform-menu"
                    role="group"
                    aria-label="Platform"
                    className="a-fade absolute inset-x-0 top-full hidden border-b border-hairline bg-surface lg:block"
                >
                    <div className="shell grid grid-cols-2 gap-10 py-10">
                        {LAYERS.map((layer, i) => (
                            <div key={layer.id} className={cx(i === 1 && "border-l border-hairline pl-10")}>
                                <div className="flex items-baseline justify-between gap-4">
                                    <a href="#platform" className="t-h3 transition-opacity hover:opacity-60">
                                        {layer.name}
                                    </a>
                                    <span className="t-micro text-ink-4">{`0${i + 1}`}</span>
                                </div>
                                <p className="t-small mt-1.5 text-ink-3">{layer.tagline}</p>

                                <ul className="mt-6 grid gap-0.5">
                                    {layer.features.map((f) => (
                                        <li key={f.id}>
                                            <a
                                                href="#platform"
                                                className="-mx-3 block rounded-tile px-3 py-2.5 transition-colors hover:bg-sunk"
                                            >
                                                <span className="t-card block">{f.name}</span>
                                                <span className="t-small mt-0.5 line-clamp-2 text-ink-3">
                                                    {f.body}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-hairline bg-sunk/50">
                        <div className="shell flex items-center justify-between gap-6 py-4">
                            <p className="t-small text-ink-3">
                                Both layers install as one vertical pack, inside your own perimeter.
                            </p>
                            <a href="#console" className="t-small whitespace-nowrap transition-opacity hover:opacity-60">
                                See it run →
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile sheet */}
            {sheet && (
                <div
                    id="nav-sheet"
                    onClick={onSheetClick}
                    className="a-fade fixed inset-0 z-40 flex flex-col bg-canvas lg:hidden"
                >
                    <div className="h-16 shrink-0" />

                    <div className="scroll-slim min-h-0 flex-1 overflow-y-auto">
                        <div className="shell pb-10">
                            <button
                                type="button"
                                aria-expanded={acc}
                                onClick={() => setAcc((v) => !v)}
                                className="flex w-full items-center justify-between border-b border-hairline py-5 text-left"
                            >
                                <span className="t-h3">Platform</span>
                                <span className="text-ink-3">
                                    <Chevron open={acc} />
                                </span>
                            </button>

                            {acc && (
                                <div className="a-fade border-b border-hairline py-6">
                                    {LAYERS.map((layer) => (
                                        <div key={layer.id} className="mb-7 last:mb-0">
                                            <p className="t-micro text-ink-3">{layer.name}</p>
                                            <ul className="mt-4 grid gap-4">
                                                {layer.features.map((f) => (
                                                    <li key={f.id}>
                                                        <a href="#platform" className="block">
                                                            <span className="t-card block">{f.name}</span>
                                                            <span className="t-small mt-0.5 line-clamp-2 text-ink-3">
                                                                {f.body}
                                                            </span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {NAV.filter((item) => item.id !== "platform").map((item) => (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className="t-h3 flex items-center justify-between border-b border-hairline py-5"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-hairline bg-canvas">
                        <div className="shell grid gap-2.5 pt-4 pb-8">
                            <Pill href="#console" className="w-full">
                                See it run
                            </Pill>
                            <Pill href="#contact" variant="secondary" className="w-full">
                                Talk to us
                            </Pill>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

/* ── Hero ─────────────────────────────────────────────────── */

export function Hero() {
    return (
        <section id="hero" className="relative pt-32 pb-14 md:pt-44 md:pb-16">
            <div className="shell">
                <div className="mx-auto max-w-[900px] text-center">
                    <Reveal>
                        <Eyebrow>The AI operating system for institutions</Eyebrow>
                    </Reveal>

                    <Reveal delay={60}>
                        <h1 className="t-display mt-5">Your organisation already knows the answer.</h1>
                    </Reveal>

                    <Reveal delay={120}>
                        <p className="t-body mx-auto mt-6 max-w-[640px] text-ink-2">
                            AIOS indexes every document, message and record your institution already holds, then
                            puts specialised agents to work on top of it. All of it runs inside your own perimeter,
                            and every answer cites the source it came from.
                        </p>
                    </Reveal>

                    <Reveal delay={180}>
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                            <Pill href="#console">See it run</Pill>
                            <Pill href="#contact" variant="secondary">
                                Talk to us
                            </Pill>
                        </div>
                    </Reveal>

                    <Reveal delay={240}>
                        <div className="mx-auto mt-16 grid max-w-[640px] grid-cols-3 border-t border-hairline">
                            {STATS.map((s, i) => (
                                <div
                                    key={s.label}
                                    className={cx("px-2 py-6 sm:px-4", i > 0 && "border-l border-hairline")}
                                >
                                    <p className="t-h2">{s.value}</p>
                                    <p className="t-micro mt-2 text-ink-3">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
