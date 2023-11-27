"use server";

import { auth } from "@clerk/nextjs";
import { List } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchBoardById,
    fetchLastList,
} from "@/lib";
import { CreateList, type CreateListInput } from "./schema";

const handler: ActionHandler<CreateListInput, List> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { title, boardId } = data;
    let list;

    try {
        const board = await fetchBoardById(orgId, boardId);
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
