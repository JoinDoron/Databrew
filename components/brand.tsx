import Link from "next/link";
import identity from "@/public/brand/tokens.json";

/** Three incoming channels and one shared curve form the Confluence mark. */
export function BrandMark({ className = "", decorative = true }: { className?: string; decorative?: boolean }) {
    return <svg viewBox={identity.mark.viewBox} className={className} aria-hidden={decorative || undefined} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : "Databrew Confluence mark"}>
        <path d={identity.mark.path} fill="currentColor" />
    </svg>;
}

export function Wordmark({ light = false }: { light?: boolean }) {
    return <Link href="/" className={`wordmark${light ? " wordmark-light" : ""}`} aria-label="Databrew home"><BrandMark /><span>databrew</span></Link>;
}

/** An oversized expression of the mark, sharing the exact export geometry. */
export function SignalSculpture({ className = "" }: { className?: string }) {
    return <div className={`signal-sculpture ${className}`} aria-hidden="true"><div className="confluence-stage"><span className="confluence-line" /><BrandMark /><span className="confluence-line" /></div></div>;
}

export function SignalPattern({ className = "" }: { className?: string }) {
    return <div className={`signal-pattern ${className}`} aria-hidden="true"><svg viewBox="0 0 640 400" fill="none">{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-60 ${35 + i * 55}H${300 - i * 18}Q${515 - i * 18} ${35 + i * 55} ${515 - i * 18} ${250 + i * 55}V650`} stroke="currentColor" strokeWidth="20" />)}</svg></div>;
}
