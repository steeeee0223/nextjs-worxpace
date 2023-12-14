"use server";

import { Document } from "@prisma/client";

import { Modified } from "@/components/tree";
import { db } from "./config";

export const fetchAllDocuments = async (
    clientId: string,
    isArchived?: boolean
): Promise<Document[]> =>
    await db.document.findMany({ where: { clientId, isArchived } });

export const fetchDocuments = async (
    clientId: string,
    parentId: string | null
): Promise<Document[]> =>
    await db.document.findMany({
        where: { clientId, parentId, isArchived: false },
        orderBy: { createdAt: "desc" },
    });

type Action = "ARCHIVE" | "RESTORE";
const UPDATE: Record<Action, Partial<Document>> = {
    ARCHIVE: { isArchived: true },
    RESTORE: { isArchived: false },
};

export const updateChildrenState = async (
    action: Action,
    clientId: string,
    parentId: string | null,
    onSuccess?: (childrenIds: string[]) => void
): Promise<void> => {
    await db.document.updateMany({
        where: { clientId, parentId },
        data: UPDATE[action],
    });
    const children = await db.document.findMany({
        where: { clientId, parentId },
    });
    onSuccess?.(children.map(({ id }) => id));
    for (const { id } of children)
        await updateChildrenState(action, clientId, id, onSuccess);
};

export const archive = async (
    clientId: string,
    documentId: string
): Promise<Modified<Document>> => {
    let modifiedIds = [documentId];
    const item = await db.document.update({
        where: { clientId, id: documentId },
        data: UPDATE["ARCHIVE"],
    });
    await updateChildrenState("ARCHIVE", clientId, documentId, (ids) =>
        modifiedIds.push(...ids)
    );
    return { item, ids: modifiedIds };
};

export const restore = async (
    clientId: string,
    documentId: string
): Promise<Modified<Document>> => {
    let item;
    let modifiedIds = [documentId];
    /** Restore `documentId`
     * if it has a parent, set parent to `undefined`
     */
    item = await db.document.findUnique({
        where: { clientId, id: documentId },
        include: { parent: true },
    });
    if (!item) throw new Error("Document not found");
    item = await db.document.update({
        where: { clientId, id: documentId },
        data: item.parent?.isArchived
            ? {
                  parentId: null,
                  isArchived: false,
              }
            : UPDATE["RESTORE"],
    });
    /** Restore all its children */
    await updateChildrenState("RESTORE", clientId, documentId, (ids) =>
        modifiedIds.push(...ids)
    );
    return { item, ids: modifiedIds };
};

export const removeChildren = async (
    clientId: string,
    parentId: string | null,
    onSuccess?: (childrenIds: string[]) => void
) => {
    const children = await db.document.findMany({
        where: { clientId, parentId },
    });
    /** Delete children */
    let childrenIds = [];
    for (const { id } of children) {
        await removeChildren(clientId, id, onSuccess);
        childrenIds.push(id);
    }
    onSuccess?.(childrenIds);
    /** Delete parent */
    await db.document.deleteMany({ where: { clientId, parentId } });
};

export const remove = async (
    clientId: string,
    documentId: string
): Promise<Modified<Document>> => {
    let item;
    let modifiedIds = [documentId];
    /**
     * @todo
     * If the document has a parent, remove children form its parent
     */
    /** Delete all its children */
    await removeChildren(clientId, documentId, (ids) =>
        modifiedIds.push(...ids)
    );
    /** Delete the document */
    item = await db.document.delete({ where: { clientId, id: documentId } });
    return { item, ids: modifiedIds };
};
