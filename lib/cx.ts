/**
 * Class-name joiner.
 *
 * Deliberately lives OUTSIDE components/ui.tsx: that file is "use client", and a
 * plain function exported from a client module cannot be called by a server
 * component — Next treats it as a client reference. Several sections render on
 * the server, so this has to be importable from both sides.
 */
export function cx(...parts: (string | false | null | undefined)[]): string {
    return parts.filter(Boolean).join(" ");
}
