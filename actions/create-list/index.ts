"use server";

import { List } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchBoardById,
    fetchClient,
    fetchLastList,
} from "@/lib";
import { CreateList, type CreateListInput } from "./schema";

const handler: ActionHandler<CreateListInput, List> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId } = client;
    const { title, boardId } = data;
    let list;

    try {
        const board = await fetchBoardById(clientId, boardId);
        if (!board) return { error: "Board not found." };

        const lastList = await fetchLastList(boardId);
        const newOrder = 1 + (lastList?.order ?? 0);

        list = await db.list.create({
            data: { title, boardId, order: newOrder },
        });

        await createAuditLog(
            { entityId: list.id, title: list.title, type: "LIST" },
            "CREATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to create list." };
    }

    return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
