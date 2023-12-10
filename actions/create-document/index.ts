"use server";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
} from "@/lib";
import { CreateDocument, type CreateDocumentInput } from "./schema";
import { revalidatePath } from "next/cache";
import { Document } from "@prisma/client";

const handler: ActionHandler<CreateDocumentInput, Document> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }
    const { clientId } = client;
    const { title, parentId } = data;

    let document;
    try {
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
        console.log(`ERROR`, error);
        return { error: "Failed to create document." };
    }

    revalidatePath(`documents/`);
    return { data: document };
};

export const createDocument = createSafeAction(CreateDocument, handler);
