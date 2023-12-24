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
    restore,
} from "@/lib";
import { RestoreDocument, type RestoreDocumentInput } from "./schema";

const handler: ActionHandler<RestoreDocumentInput, Modified<Document>> = async (
    data
) => {
    let result;

    try {
        const { clientId } = fetchClient();
        result = await restore(clientId, data.id);
        /** Activity Log */
        await createAuditLog(
            {
                title: result.item.title,
                entityId: data.id,
                type: "DOCUMENT",
            },
            "UPDATE"
        );
    } catch (error) {
        if (error instanceof UnauthorizedError)
            return { error: "Unauthorized" };
        console.log(`ERROR`, error);
        return { error: "Failed to restore document." };
    }

    revalidatePath(`/documents/${data.id}`);
    return { data: result };
};

export const restoreDocument = createSafeAction(RestoreDocument, handler);
