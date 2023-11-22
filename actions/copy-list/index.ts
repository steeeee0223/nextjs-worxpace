"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { List } from "@prisma/client";

import { ActionHandler, createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { fetchLastList, fetchListById } from "@/lib/fetch";
import { CopyList, type CopyListInput } from "./schema";

const handler: ActionHandler<CopyListInput, List> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { id, boardId } = data;
    let list;
    try {
        const listToCopy = await fetchListById(orgId, boardId, id);
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
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to copy list." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
