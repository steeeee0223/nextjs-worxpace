"use server";

import { revalidatePath } from "next/cache";
import { Document } from "@prisma/client";

import { Modified } from "@/components/tree";
import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    fetchClient,
    remove,
} from "@/lib";
import { DeleteDocument, type DeleteDocumentInput } from "./schema";

const handler: ActionHandler<DeleteDocumentInput, Modified<Document>> = async (
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
        result = await remove(client.clientId, data.id);
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
        return { error: "Failed to delete document." };
    }

    revalidatePath(`/documents`);
    return { data: result };
};

export const deleteDocument = createSafeAction(DeleteDocument, handler);
