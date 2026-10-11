"use client";
import { AnimatedDemo } from "@/components/animated-demo";
import { PACKS, type Pack } from "@/lib/aios";
import { packScenario } from "@/lib/demo-scenarios";

/** Compatibility entry point; all illustrations share one animation engine. */
export function ConsoleDemo({ pack = PACKS[0] }: { pack?: Pack }) {
    return <AnimatedDemo scenario={packScenario(pack)} />;
}
