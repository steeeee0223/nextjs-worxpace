"use client";

import { Dispatch, createContext, useContext } from "react";

import type { TreeItem } from "./types";
import type { TreeAction } from "./tree-actions";

interface TreeActionContextInterface<T extends TreeItem> {
    dispatch: Dispatch<TreeAction<T>>;
}

export const TreeActionContext =
    createContext<TreeActionContextInterface<any> | null>(null);

export function useTreeAction<
    T extends TreeItem
>(): TreeActionContextInterface<T> {
    const object = useContext(TreeActionContext);
    if (!object)
        throw new Error("useTreeAction must be used within TreeProvider");
    return object;
}
