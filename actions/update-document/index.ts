"use server";

import { revalidatePath } from "next/cache";
import { Document } from "@prisma/client";

import {
    ActionHandler,
    UnauthorizedError,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
} from "@/lib";
import { UpdateDocument, type UpdateDocumentInput } from "./schema";

const handler: ActionHandler<UpdateDocumentInput, Document> = async (data) => {
    let document;
    const { log, id, ...updateData } = data;

    try {
        const { clientId } = fetchClient();
        document = await db.document.update({
            where: { clientId, id },
            data: updateData,
        });
        /** Activity Log */
        if (log)
            await createAuditLog(
                { type: "DOCUMENT", entityId: id, title: document.title },
                "UPDATE"
            );
    } catch (error) {
        if (error instanceof UnauthorizedError)
            return { error: "Unauthorized" };
        console.log(`ERROR`, error);
        return { error: "Failed to update document." };
    }

    revalidatePath(`/documents/${id}`);
    return { data: document };
};

export const updateDocument = createSafeAction(UpdateDocument, handler);
