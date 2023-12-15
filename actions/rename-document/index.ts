"use server";

import { Document } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    fetchClient,
    renameDocument as rename,
} from "@/lib";
import { RenameDocument, type RenameDocumentInput } from "./schema";
import { revalidatePath } from "next/cache";

const handler: ActionHandler<RenameDocumentInput, Document> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    let document;
    const { id, title } = data;
    try {
        document = await rename(client.clientId, id, title);
        /** Activity Log */
        await createAuditLog(
            { type: "DOCUMENT", entityId: id, title },
            "UPDATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to rename document." };
    }

    revalidatePath(`/documents`);
    return { data: document };
};

export const renameDocument = createSafeAction(RenameDocument, handler);
