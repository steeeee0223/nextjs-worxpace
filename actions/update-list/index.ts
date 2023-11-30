"use server";

import { revalidatePath } from "next/cache";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
} from "@/lib";
import { UpdateList, type UpdateListInput } from "./schema";

const handler: ActionHandler<UpdateListInput, any> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId } = client;
    const { title, id, boardId } = data;
    let list;

    try {
        list = await db.list.update({
            where: { id, boardId, board: { clientId } },
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
