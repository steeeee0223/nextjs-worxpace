"use client";

import { PropsWithChildren, useReducer } from "react";

import { TreeContext, TreeContextInterface } from "./tree-context";
import { treeReducer, type TreeReducer } from "./tree-actions";
import { TreeActionContext } from "./tree-action-context";
import type { TreeItem } from "./types";

interface TreeProviderProps<T extends TreeItem> extends PropsWithChildren {
    initialItems: T[];
    isItemActive: (id: string) => boolean;
    onClickItem: (id: string) => void;
}

export function TreeProvider<T extends TreeItem>({
    children,
    initialItems,
    isItemActive,
    onClickItem,
}: TreeProviderProps<T>) {
    const $initialItems = {
        ids: initialItems.map(({ id }) => id),
        entities: Object.fromEntries(
            initialItems.map((item) => [item.id, item])
        ),
    };
    const [state, dispatch] = useReducer<TreeReducer<T>>(
        treeReducer,
        $initialItems
    );

    const treeItems = Object.values(state.entities);
    const treeContextValues: TreeContextInterface<T> = {
        treeItems,
        getChildren: ($isArchived, $parentId?) =>
            treeItems.filter(
                ({ parentId, isArchived }) =>
                    $parentId === parentId && isArchived === $isArchived
            ),
        isItemActive,
        onClickItem,
    };

    return (
        <TreeContext.Provider value={treeContextValues}>
            <TreeActionContext.Provider value={{ dispatch }}>
                {children}
            </TreeActionContext.Provider>
        </TreeContext.Provider>
    );
}
