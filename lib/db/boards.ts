import { Board } from "@prisma/client";

import { db } from "./config";

export const fetchBoards = async (clientId: string): Promise<Board[]> =>
    await db.board.findMany({
        where: { clientId },
        orderBy: { createdAt: "desc" },
    });

export const fetchBoardById = async (
    clientId: string,
    boardId: string
): Promise<Board | null> =>
    await db.board.findUnique({
        where: { id: boardId, clientId },
    });
