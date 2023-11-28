"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { List } from "@prisma/client";

import { ActionHandler, createSafeAction, db } from "@/lib";
import { UpdateListOrder, type UpdateListOrderInput } from "./schema";

const handler: ActionHandler<UpdateListOrderInput, List[]> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { items, boardId } = data;
    let lists;

    try {
        const transaction = items.map(({ id, order }) =>
            db.list.update({
                where: { id, board: { orgId } },
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
