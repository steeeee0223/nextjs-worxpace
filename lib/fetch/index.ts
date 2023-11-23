import { Board, List } from "@prisma/client";

import { db } from "@/lib/db";
import { ListWithCards } from "@/lib/types";

export const fetchBoards = async (orgId: string): Promise<Board[]> =>
    await db.board.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
    });

export const fetchBoardById = async (
    orgId: string,
    boardId: string
): Promise<Board | null> =>
    await db.board.findUnique({
        where: { id: boardId, orgId },
    });

export const fetchLists = async (
    orgId: string,
    boardId: string
): Promise<ListWithCards[]> =>
    await db.list.findMany({
        where: { boardId: boardId, board: { orgId } },
        include: { cards: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
    });

export const fetchListById = async (
    orgId: string,
    boardId: string,
    id: string
): Promise<ListWithCards | null> =>
    await db.list.findUnique({
        where: { id, boardId, board: { orgId } },
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

export const fetchLastCard = async (listId: string) =>
    await db.card.findFirst({
        where: { listId },
        orderBy: { order: "desc" },
        select: { order: true },
    });
