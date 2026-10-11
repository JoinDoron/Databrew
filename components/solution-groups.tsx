import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined, Code2, Factory, FlaskConical, GraduationCap, HardHat, Headset, HeartPulse, Landmark, Megaphone, Package, RadioTower, Scale, Settings, ShieldCheck, ShoppingCart, Truck, UserRound, UsersRound, Wallet, Zap } from "lucide-react";
import { solutionGroups, solutionHref, type SolutionKind } from "@/lib/solutions";

const ICONS = {
    teams: UsersRound, code: Code2, headset: Headset, chart: ChartNoAxesCombined,
    settings: Settings, megaphone: Megaphone, person: UserRound, wallet: Wallet,
    scale: Scale, cart: ShoppingCart, package: Package, factory: Factory,
    energy: Zap, truck: Truck, briefcase: BriefcaseBusiness, hardhat: HardHat,
    finance: Wallet, landmark: Landmark, shield: ShieldCheck, health: HeartPulse,
    flask: FlaskConical, graduation: GraduationCap, telecom: RadioTower,
};

export function SolutionIcon({ name, size = 17 }: { name: string; size?: number }) {
    const Icon = ICONS[name as keyof typeof ICONS] ?? UsersRound;
    return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}

export function SolutionGroups({ kind, query = "" }: { kind: SolutionKind; query?: string }) {
    const groups = solutionGroups(kind, query);
    const title = kind === "department" ? "Departments" : "Industries";
    return <section className="solution-link-group" aria-label={title}>
        <div className="solution-group-heading"><h2>{title}</h2><span>{groups.reduce((total, group) => total + 1 + group.children.length, 0)} paths</span></div>
        <div className="solution-link-columns">{([0, 1] as const).map(column => <ul key={column}>{groups.filter(group => group.parent.column === column).map(({ parent, children }) => <li key={parent.slug}>
            <Link href={solutionHref(parent)}><SolutionIcon name={parent.icon} /><span>{parent.name}</span><ArrowUpRight size={12} className="solution-link-arrow" aria-hidden="true" /></Link>
            {children.length > 0 && <ul>{children.map(child => <li key={child.slug}><Link href={solutionHref(child)}>{child.name}</Link></li>)}</ul>}
        </li>)}</ul>)}</div>
        {groups.length === 0 && <p className="solution-no-matches">No matching {title.toLowerCase()}.</p>}
    </section>;
}

export function SolutionsMenu() {
    return <div className="solutions-menu-content"><div className="solutions-menu-groups"><SolutionGroups kind="department" /><SolutionGroups kind="industry" /></div><div className="solutions-menu-footer"><span>One AI foundation. Different work, sources and responsibilities.</span><Link href="/solutions">Explore all solutions <ArrowUpRight size={15} /></Link><Link href="/platform?pack=ministry-interior#console">Interior demo: NIS · NCoS · NSCDC · FFS <ArrowUpRight size={15} /></Link></div></div>;
}

export function SolutionsCoverage() {
    return <section className="enterprise-section solutions-coverage" id="solutions"><div className="brand-shell"><div className="enterprise-heading"><div><p className="eyebrow">BUILT AROUND THE WORK</p><h2>Every team has a purpose.<br /><span>Find yours.</span></h2></div><div><p>Explore the people, knowledge and workflows that make AI useful in your organisation.</p><Link href="/solutions" className="text-link">Explore all solutions <ArrowUpRight size={16} /></Link></div></div><div className="solutions-menu-groups"><SolutionGroups kind="department" /><SolutionGroups kind="industry" /></div><p className="solutions-scope-note">Solution blueprints describe use cases to configure and validate. Explore the existing industry demonstrations below to see the product experience.</p></div></section>;
}
