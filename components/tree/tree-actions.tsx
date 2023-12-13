import { Reducer } from "react";

import type { TreeItem } from "./types";

export type TreeAction<T extends TreeItem> =
    | { type: "add"; payload: T[] }
    | { type: "set"; payload: T[] };

export type TreeReducer<T extends TreeItem> = Reducer<T[], TreeAction<T>>;

export function treeReducer<T extends TreeItem>(
    treeItems: T[],
    action: TreeAction<T>
): T[] {
    switch (action.type) {
        case "add":
            return [...treeItems, ...action.payload];
        case "set":
            return action.payload;
        default:
            throw Error(`Unknown action`);
    }
}
