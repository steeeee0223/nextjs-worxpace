"use server";

import { revalidatePath } from "next/cache";
import { List } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
    fetchLastList,
    fetchListById,
} from "@/lib";
import { CopyList, type CopyListInput } from "./schema";

const handler: ActionHandler<CopyListInput, List> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId, role } = client;
    const { id, boardId } = data;
    let list;
    try {
        const listToCopy = await fetchListById(clientId, boardId, id);
        if (!listToCopy) return { error: "List not found." };

        const lastList = await fetchLastList(boardId);
        const newOrder = 1 + (lastList?.order ?? 0);
        const newCards =
            listToCopy.cards.length > 0
                ? {
                      createMany: {
                          data: listToCopy.cards.map(
                              ({ title, description, order }) => ({
                                  title,
                                  description,
                                  order,
                              })
                          ),
                      },
                  }
                : undefined;

        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
                cards: newCards,
            },
            include: { cards: true },
        });

        await createAuditLog(
            { entityId: list.id, title: list.title, type: "LIST" },
            "CREATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to copy list." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
