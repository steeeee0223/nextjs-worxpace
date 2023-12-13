import { Reducer } from "react";

import type { TreeItem } from "./types";

export type Entity<T extends TreeItem> = {
    ids: string[];
    entities: Record<string, T>;
};

export type TreeAction<T extends TreeItem> =
    | { type: "add"; payload: T[] }
    | { type: "set"; payload: T[] }
    | { type: "archive"; payload: string[] };

export type TreeReducer<T extends TreeItem> = Reducer<Entity<T>, TreeAction<T>>;

export function treeReducer<T extends TreeItem>(
    { ids, entities }: Entity<T>,
    { type, payload }: TreeAction<T>
): Entity<T> {
    switch (type) {
        case "add":
            return {
                ids: [...ids, ...payload.map(({ id }) => id)],
                entities: {
                    ...entities,
                    ...Object.fromEntries(
                        payload.map((item) => [item.id, item])
                    ),
                },
            };
        case "set":
            return {
                ids: payload.map(({ id }) => id),
                entities: Object.fromEntries(
                    payload.map((item) => [item.id, item])
                ),
            };
        case "archive":
            payload.forEach((id) => (entities[id].isArchived = true));
            return { ids, entities: { ...entities } };
        default:
            throw Error(`Unknown action`);
    }
}
