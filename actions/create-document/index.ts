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
import { CreateDocument, type CreateDocumentInput } from "./schema";

const handler: ActionHandler<CreateDocumentInput, Document> = async (data) => {
    let document;
    const { title, parentId } = data;

    try {
        const { clientId } = fetchClient();
        document = await db.document.create({
            data: {
                clientId,
                title,
                parentId,
                isArchived: false,
                isPublished: false,
            },
        });
        /** Activity Log */
        await createAuditLog(
            { title, entityId: document.id, type: "DOCUMENT" },
            "CREATE"
        );
    } catch (error) {
        if (error instanceof UnauthorizedError)
            return { error: "Unauthorized" };
        console.log(`ERROR`, error);
        return { error: "Failed to create document." };
    }

    revalidatePath(`/documents`);
    return { data: document };
};

export const createDocument = createSafeAction(CreateDocument, handler);
