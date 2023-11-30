import { List } from "@prisma/client";

import { ListWithCards } from "@/lib/types";
import { db } from "./config";

export const fetchLists = async (
    clientId: string,
    boardId: string
): Promise<ListWithCards[]> =>
    await db.list.findMany({
        where: { boardId, board: { clientId } },
        include: { cards: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
    });

export const fetchListById = async (
    clientId: string,
    boardId: string,
    id: string
): Promise<ListWithCards | null> =>
    await db.list.findUnique({
        where: { id, boardId, board: { clientId } },
        include: { cards: true },
    });

export const fetchLastList = async (
    boardId: string
): Promise<Pick<List, "order"> | null> =>
    await db.list.findFirst({
        where: { boardId },
        orderBy: { order: "desc" },
        select: { order: true },
    });
