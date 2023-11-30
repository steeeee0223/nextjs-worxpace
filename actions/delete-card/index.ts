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
import { DeleteCard, type DeleteCardInput } from "./schema";

const handler: ActionHandler<DeleteCardInput, Card> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId, role } = client;
    const { id, boardId } = data;
    let card;

    try {
        card = await db.card.delete({
            where: { id, list: { board: { clientId } } },
        });

        await createAuditLog(
            { entityId: id, title: card.title, type: "CARD" },
            "DELETE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to delete card." };
    }

    revalidatePath(`board/${boardId}`);
    return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
