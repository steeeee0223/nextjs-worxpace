"use server";

import { Document } from "@prisma/client";

import { db } from "./config";

export const fetchAllDocuments = async (
    clientId: string
): Promise<Document[]> => await db.document.findMany({ where: { clientId } });

export const fetchDocuments = async (
    clientId: string,
    parentId?: string
): Promise<Document[]> =>
    await db.document.findMany({
        where: { clientId, parentId, isArchived: false },
        orderBy: { createdAt: "desc" },
    });

export const archiveChildren = async (
    clientId: string,
    parentId?: string,
    onSuccess?: (childrenIds: string[]) => void
): Promise<void> => {
    await db.document.updateMany({
        where: { clientId, parentId },
        data: { isArchived: true },
    });
    const children = await fetchDocuments(clientId, parentId);
    onSuccess?.(children.map(({ id }) => id));
    for (const { id } of children) await archiveChildren(clientId, id);
};

export const archive = async (
    clientId: string,
    documentId: string
): Promise<readonly [Document, string[]]> => {
    let archivedIds = [documentId];
    const document = await db.document.update({
        where: { clientId, id: documentId },
        data: { isArchived: true },
    });
    await archiveChildren(clientId, documentId, (ids) =>
        archivedIds.push(...ids)
    );
    return [document, archivedIds] as const;
};
