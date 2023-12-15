import { auth } from "@clerk/nextjs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { UnauthorizedError } from "@/lib/errors";
import { Client } from "@/lib/types";

/**
 * Utility for tailwind classnames
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Utility for fetching url
 */
export function fetchUrl(url: string) {
    return fetch(url).then((res) => res.json());
}

/**
 * Utility for DND reordering
 */
export function reorder<T>(list: T[], start: number, end: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
}

/**
 * Utility for authorization
 */
export function fetchClient(): Client {
    const { userId, orgId } = auth();
    if (!userId && !orgId) throw new UnauthorizedError();
    return orgId
        ? { role: "ORG", clientId: orgId }
        : { role: "USER", clientId: userId };
}

/**
 * Url
 */
export function absoluteUrl(path: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

/**
 * Utility for parsing boolean params in url
 */
export function parseBool(x?: string | null): boolean | undefined {
    switch (true) {
        case x === null || x === undefined:
            return undefined;
        case x === "true":
            return true;
        case x === "false":
            return false;
        default:
            throw new Error(`Invalid argument: ${x}`);
    }
}
