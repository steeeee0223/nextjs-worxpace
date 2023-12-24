"use client";

import { PropsWithChildren, useReducer } from "react";

import { TreeContext, TreeContextInterface } from "./tree-context";
import { treeReducer, type TreeReducer } from "./tree-actions";
import { TreeActionContext } from "./tree-action-context";
import type { TreeItem } from "./types";
import { useFetch } from "@/hooks";
import { ActionState } from "@/lib";
import { toast } from "sonner";

interface TreeProviderProps<T extends TreeItem> extends PropsWithChildren {
    fetchItems: () => Promise<ActionState<{}, T[]>>;
    isItemActive?: (id: string) => boolean;
    onClickItem?: (id: string) => void;
}

export function TreeProvider<T extends TreeItem>({
    children,
    fetchItems,
    isItemActive,
    onClickItem,
}: TreeProviderProps<T>) {
    const $initialItems = { ids: [], entities: {} };
    const [state, dispatch] = useReducer<TreeReducer<T>>(
        treeReducer,
        $initialItems
    );
    const { data, isLoading } = useFetch<T[]>(fetchItems, {
        onSuccess: (data) => dispatch({ type: "set", payload: data }),
        onError: (e) => toast.error(e),
    });

    const treeItems = Object.values(state.entities);
    const treeContextValues: TreeContextInterface<T> = {
        isLoading: isLoading || !data,
        treeItems,
        archivedItems: treeItems.filter(({ isArchived }) => isArchived),
        getChildren: ($isArchived, $parentId) =>
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
