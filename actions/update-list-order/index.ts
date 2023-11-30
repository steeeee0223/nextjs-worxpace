"use server";

import { revalidatePath } from "next/cache";
import { List } from "@prisma/client";

import { ActionHandler, createSafeAction, db, fetchClient } from "@/lib";
import { UpdateListOrder, type UpdateListOrderInput } from "./schema";

const handler: ActionHandler<UpdateListOrderInput, List[]> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId } = client;
    const { items, boardId } = data;
    let lists;

    try {
        const transaction = items.map(({ id, order }) =>
            db.list.update({
                where: { id, board: { clientId } },
                data: { order },
            })
        );
        lists = await db.$transaction(transaction);
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to reorder list." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
