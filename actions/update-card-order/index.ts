"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";

import { ActionHandler, createSafeAction, db } from "@/lib";
import { UpdateCardOrder, type UpdateCardOrderInput } from "./schema";

const handler: ActionHandler<UpdateCardOrderInput, Card[]> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { items, boardId } = data;
    let cards;

    try {
        const transaction = items.map(({ id, order, listId }) =>
            db.card.update({
                where: { id, list: { board: { orgId } } },
                data: { order, listId },
            })
        );
        cards = await db.$transaction(transaction);
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to reorder cards." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: cards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
