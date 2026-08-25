"use client";

import { useEffect, useRef, useState } from "react";

import { cx } from "@/lib/cx";
export { cx };

/**
 * Reveal-on-scroll. Fires once, then stops observing — the page should settle,
 * not keep animating as you scroll back up.
 */
export function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || seen) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setSeen(true);
                    io.disconnect();
                }
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [seen]);

    return (
        <div
            ref={ref}
            className={cx("reveal", seen && "in", className)}
            style={seen && delay ? { animationDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/** Small caps eyebrow above a section head. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
    return <p className="t-micro text-ink-3">{children}</p>;
}

export function SectionHead({
    eyebrow,
    title,
    body,
    align = "left",
}: {
    eyebrow?: string;
    title: string;
    body?: string;
    align?: "left" | "center";
}) {
    return (
        <div className={cx("max-w-[680px]", align === "center" && "mx-auto text-center")}>
            {eyebrow && (
                <div className="mb-4">
                    <Eyebrow>{eyebrow}</Eyebrow>
                </div>
            )}
            <h2 className="t-h2">{title}</h2>
            {body && <p className="t-body mt-4 text-ink-2">{body}</p>}
        </div>
    );
}

/**
 * The only button in the system. Pills, monochrome — no colour, no shadow, no
 * gradient. Carried over from the reference study as a hard rule.
 */
export function Pill({
    children,
    variant = "primary",
    size = "md",
    href,
    onClick,
    className,
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "md" | "sm";
    href?: string;
    onClick?: () => void;
    className?: string;
}) {
    const cls = cx("pill", `pill-${variant}`, size === "sm" && "pill-sm", className);
    if (href) {
        return (
            <a href={href} className={cls}>
                {children}
            </a>
        );
    }
    return (
        <button type="button" onClick={onClick} className={cls}>
            {children}
        </button>
    );
}

/** Live-state dot. The only place the accent/live colours are allowed. */
export function LiveDot({ tone = "live" }: { tone?: "live" | "accent" | "warn" }) {
    const bg = tone === "live" ? "bg-live" : tone === "accent" ? "bg-accent" : "bg-warn";
    return (
        <span className="relative inline-grid h-2 w-2 place-items-center">
            <span className={cx("a-ping absolute h-2 w-2 rounded-full", bg)} />
            <span className={cx("h-1.5 w-1.5 rounded-full", bg)} />
        </span>
    );
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" | "live" | "warn" }) {
    const map = {
        neutral: "bg-sunk text-ink-2",
        accent: "bg-accent-soft text-accent",
        live: "bg-live-soft text-live",
        warn: "bg-warn-soft text-warn",
    } as const;
    return (
        <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium", map[tone])}>
            {children}
        </span>
    );
}

/**
 * Chrome for every product miniature: a browser-ish frame so the demo reads as
 * "this is the real product" rather than "this is a diagram".
 */
export function DemoFrame({
    label,
    children,
    className,
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cx("card overflow-hidden", className)}>
            <div className="flex items-center gap-2 border-b border-hairline bg-sunk/60 px-4 py-2.5">
                <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                    <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                    <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                </span>
                <span className="t-mono ml-2 truncate text-ink-3">{label}</span>
                <span className="ml-auto flex items-center gap-1.5">
                    <LiveDot />
                    <span className="text-[11px] text-ink-3">live</span>
                </span>
            </div>
            <div className="relative">{children}</div>
        </div>
    );
}

/** Drives the stepped animations inside the miniatures. */
export function useTick(ms = 1400, max = 8, run = true) {
    const [t, setT] = useState(0);
    useEffect(() => {
        if (!run) return;
        const id = setInterval(() => setT((v) => (v + 1) % max), ms);
        return () => clearInterval(id);
    }, [ms, max, run]);
    return t;
}

/** True once the element has been scrolled into view — pauses off-screen demos. */
export function useInView<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return { ref, inView };
}
