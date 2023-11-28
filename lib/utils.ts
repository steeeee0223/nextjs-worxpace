import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for tailwind classnames
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Utility for fetching url
 */
export const fetchUrl = (url: string) => fetch(url).then((res) => res.json());

/**
 * Utility for DND reordering
 */
export function reorder<T>(list: T[], start: number, end: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
}
