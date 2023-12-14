"use server";

import { revalidatePath } from "next/cache";
import { Document } from "@prisma/client";

import { Modified } from "@/components/tree";
import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    fetchClient,
    restore,
} from "@/lib";
import { RestoreDocument, type RestoreDocumentInput } from "./schema";

const handler: ActionHandler<RestoreDocumentInput, Modified<Document>> = async (
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
        result = await restore(client.clientId, data.id);
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
        console.log(`ERROR`, error);
        return { error: "Failed to restore document." };
    }

    revalidatePath(`/documents`);
    return { data: result };
};

export const restoreDocument = createSafeAction(RestoreDocument, handler);
