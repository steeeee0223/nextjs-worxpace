"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { ActionHandler, createAuditLog, createSafeAction, db } from "@/lib";
import { UpdateList, type UpdateListInput } from "./schema";

const handler: ActionHandler<UpdateListInput, any> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { title, id, boardId } = data;
    let list;

    try {
        list = await db.list.update({
            where: { id, boardId, board: { orgId } },
            data: { title },
        });

        await createAuditLog({ entityId: id, title, type: "CARD" }, "UPDATE");
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to update list." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
