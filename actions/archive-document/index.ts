"use server";

import { revalidatePath } from "next/cache";
import { Document } from "@prisma/client";

import { Modified } from "@/components/tree";
import {
    ActionHandler,
    archive,
    createAuditLog,
    createSafeAction,
    fetchClient,
} from "@/lib";
import { ArchiveDocument, type ArchiveDocumentInput } from "./schema";

const handler: ActionHandler<ArchiveDocumentInput, Modified<Document>> = async (
    data
) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    let result;
    try {
        result = await archive(client.clientId, data.id);
        /** Activity Log */
        await createAuditLog(
            {
                title: result.item.title,
                entityId: data.id,
                type: "DOCUMENT",
            },
            "DELETE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to archive document." };
    }

    revalidatePath(`/documents/${data.id}`);
    return { data: result };
};

export const archiveDocument = createSafeAction(ArchiveDocument, handler);
