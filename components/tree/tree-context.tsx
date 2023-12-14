"use client";

import { createContext, useContext } from "react";
import type { TreeItem } from "./types";

export interface TreeContextInterface<T extends TreeItem> {
    treeItems: T[];
    archivedItems: T[];
    getChildren: (isArchived: boolean, parentId: string | null) => T[];
    isItemActive: (id: string) => boolean;
    onClickItem: (id: string) => void;
}

export const TreeContext = createContext<TreeContextInterface<any> | null>(
    null
);

export function useTree<T extends TreeItem>(): TreeContextInterface<T> {
    const object = useContext(TreeContext);
    if (!object) throw new Error("useTree must be used within TreeProvider");
    return object;
}
