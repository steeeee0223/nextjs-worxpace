"use server";

import { revalidatePath } from "next/cache";

import {
    ActionHandler,
    archive,
    createAuditLog,
    createSafeAction,
    fetchClient,
} from "@/lib";
import {
    DeleteDocument,
    type DeleteDocumentOutput,
    type DeleteDocumentInput,
} from "./schema";

const handler: ActionHandler<
    DeleteDocumentInput,
    DeleteDocumentOutput
> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    let document;
    let deletedIds;
    try {
        [document, deletedIds] = await archive(client.clientId, data.id);
        /** Activity Log */
        await createAuditLog(
            {
                title: document.title,
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
    return { data: { document, deletedIds } };
};

export const deleteDocument = createSafeAction(DeleteDocument, handler);
