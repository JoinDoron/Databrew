"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { SolutionGroups } from "@/components/solution-groups";
import { solutionGroups } from "@/lib/solutions";

export function SolutionDirectory() {
    const [query, setQuery] = useState("");
    const groups = [...solutionGroups("department", query), ...solutionGroups("industry", query)];
    const count = groups.reduce((total, group) => total + 1 + group.children.length, 0);
    return <section className="brand-shell solutions-directory" aria-label="Browse solutions"><div className="solution-search-row"><label><Search size={18} aria-hidden="true" /><span className="sr-only">Find a department or industry</span><input type="search" placeholder="Find a department or industry…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="Clear solution search" onClick={() => setQuery("")}><X size={16} /></button>}</label><p role="status">{count} solution paths{query && " shown, including parent categories"}</p></div><div className="solutions-menu-groups"><SolutionGroups kind="department" query={query} /><SolutionGroups kind="industry" query={query} /></div>{count === 0 && <div className="solution-empty"><p>Try a team, sector or another name—for example, Finance, Banking or Healthcare.</p><button className="outline-button" onClick={() => setQuery("")}>Show all solutions</button></div>}</section>;
}
