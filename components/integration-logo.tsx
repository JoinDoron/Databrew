import Image from "next/image";
import { FolderOpen, Landmark, Network } from "lucide-react";
import { INTEGRATION_LOGOS } from "@/lib/integration-logos";

const CONNECTION_ICONS = { files: FolderOpen, government: Landmark, telecom: Network };

/** Shared by the catalogue, featured apps and homepage. Names are adjacent. */
export function IntegrationLogo({ id }: { id: string }) {
    const logo = INTEGRATION_LOGOS[id];
    if (!logo) return null;

    if (logo.kind === "symbol") {
        const Icon = CONNECTION_ICONS[logo.symbol];
        return <span className="integration-logo integration-logo-symbol" aria-hidden="true" title={logo.note}>
            <Icon size={27} strokeWidth={1.4} />
        </span>;
    }

    return <span className={`integration-logo${logo.wide ? " integration-logo-wide" : ""}`} aria-hidden="true">
        <Image src={logo.src} alt="" width={48} height={48} unoptimized className="integration-logo-image" />
    </span>;
}
