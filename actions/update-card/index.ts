"use server";

import { revalidatePath } from "next/cache";
import { Card } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
} from "@/lib";
import { UpdateCard, type UpdateCardInput } from "./schema";

const handler: ActionHandler<UpdateCardInput, Card> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId } = client;
    const { id, boardId, ...info } = data;
    let card;

    try {
        card = await db.card.update({
            where: { id, list: { board: { clientId } } },
            data: info,
        });

        await createAuditLog(
            { entityId: id, title: card.title, type: "CARD" },
            "UPDATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to update-card." };
    }

    revalidatePath(`board/${boardId}`);
    return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
