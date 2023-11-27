"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { List } from "@prisma/client";

import { ActionHandler, createAuditLog, createSafeAction, db } from "@/lib";
import { DeleteList, type DeleteListInput } from "./schema";

const handler: ActionHandler<DeleteListInput, List> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { id, boardId } = data;
    let list;

    try {
        list = await db.list.delete({ where: { ...data, board: { orgId } } });

        await createAuditLog(
            { entityId: id, title: list.title, type: "LIST" },
            "DELETE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to delete list." };
    }

    revalidatePath(`/baord/${boardId}`);
    return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
