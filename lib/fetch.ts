import { AuditLog, Board, Card, ENTITY_TYPE, List } from "@prisma/client";

import { db } from "@/lib/db";
import { ListWithCards } from "@/lib/types";

export const fetchUrl = (url: string) => fetch(url).then((res) => res.json());

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

export const fetchCardById = async (
    orgId: string,
    cardId: string
): Promise<Card | null> =>
    await db.card.findUnique({
        where: { id: cardId, list: { board: { orgId } } },
        include: { list: { select: { title: true } } },
    });

export const fetchLastCard = async (listId: string) =>
    await db.card.findFirst({
        where: { listId },
        orderBy: { order: "desc" },
        select: { order: true },
    });

export const fetchLogs = async (
    userId: string,
    orgId: string
): Promise<AuditLog[]> =>
    await db.auditLog.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
    });

export const fetchLogsByType = async (
    userId: string,
    orgId: string,
    entityId: string,
    type: ENTITY_TYPE
): Promise<AuditLog[]> =>
    await db.auditLog.findMany({
        where: { orgId, entity: { is: { entityId, type } } },
        orderBy: { createdAt: "desc" },
        take: 3,
    });
