import { Reducer } from "react";

import type { TreeItem } from "./types";

export type Entity<T extends TreeItem> = {
    ids: string[];
    entities: Record<string, T>;
};

export type Modified<T extends TreeItem> = {
    item: T;
    ids: string[];
};

export type TreeAction<T extends TreeItem> =
    | { type: "add" | "set"; payload: T[] }
    | { type: "archive" | "restore"; payload: Modified<T> }
    | { type: "rename"; payload: T }
    | { type: "delete"; payload: string[] };

export type TreeReducer<T extends TreeItem> = Reducer<Entity<T>, TreeAction<T>>;

export function treeReducer<T extends TreeItem>(
    { ids, entities }: Entity<T>,
    { type, payload }: TreeAction<T>
): Entity<T> {
    switch (type) {
        case "add":
            payload.forEach((item) => (entities[item.id] = item));
            return { ids: Object.keys(entities), entities };
        case "set":
            payload.forEach((item) => (entities[item.id] = item));
            return { ids: Object.keys(entities), entities };
        case "rename":
            entities[payload.id] = payload;
            return { ids, entities };
        case "archive":
            entities[payload.item.id] = payload.item;
            payload.ids.forEach((id) => (entities[id].isArchived = true));
            return { ids, entities };
        case "restore":
            entities[payload.item.id] = payload.item;
            payload.ids.forEach((id) => (entities[id].isArchived = false));
            return { ids, entities };
        case "delete":
            payload.forEach((id) => delete entities[id]);
            return { ids: Object.keys(entities), entities };
        default:
            throw Error(`Unknown action`);
    }
}
