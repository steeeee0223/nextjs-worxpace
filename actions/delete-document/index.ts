"use server";

import { revalidatePath } from "next/cache";
import { Document } from "@prisma/client";

import { Modified } from "@/components/tree";
import {
    ActionHandler,
    UnauthorizedError,
    createAuditLog,
    createSafeAction,
    fetchClient,
    remove,
} from "@/lib";
import { DeleteDocument, type DeleteDocumentInput } from "./schema";

const handler: ActionHandler<DeleteDocumentInput, Modified<Document>> = async (
    data
) => {
    let result;

    try {
        const { clientId } = fetchClient();
        result = await remove(clientId, data.id);
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
        if (error instanceof UnauthorizedError)
            return { error: "Unauthorized" };
        console.log(`ERROR`, error);
        return { error: "Failed to delete document." };
    }

    revalidatePath(`/documents`);
    return { data: result };
};

export const deleteDocument = createSafeAction(DeleteDocument, handler);
