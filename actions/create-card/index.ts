"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchLastCard,
    fetchListById,
} from "@/lib";
import { CreateCard, type CreateCardInput } from "./schema";

const handler: ActionHandler<CreateCardInput, Card> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { title, boardId, listId } = data;
    let card;

    try {
        const list = await fetchListById(orgId, boardId, listId);
        if (!list) return { error: "List not found" };

        const lastCard = await fetchLastCard(listId);
        const newOrder = 1 + (lastCard?.order ?? 0);
        card = await db.card.create({
            data: { title, listId, order: newOrder },
        });

        await createAuditLog(
            { entityId: card.id, title, type: "CARD" },
            "CREATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to create-card." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
