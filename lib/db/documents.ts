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
