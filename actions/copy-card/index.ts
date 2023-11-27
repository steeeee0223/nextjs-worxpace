"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchCardById,
    fetchLastCard,
} from "@/lib";
import { CopyCard, type CopyCardInput } from "./schema";

const handler: ActionHandler<CopyCardInput, Card> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { id, boardId } = data;
    let card;

    try {
        const cardToCopy = await fetchCardById(orgId, id);
        if (!cardToCopy) return { error: "Card not found." };

        const { title, description, listId } = cardToCopy;
        const lastCard = await fetchLastCard(listId);
        const newOrder = 1 + (lastCard?.order ?? 0);
        card = await db.card.create({
            data: {
                title: `${title} - Copy`,
                order: newOrder,
                description,
                listId,
            },
        });

        await createAuditLog(
            { entityId: card.id, title, type: "CARD" },
            "CREATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to copy card." };
    }

    revalidatePath(`board/${boardId}`);
    return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
