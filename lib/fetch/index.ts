import { Board } from "@prisma/client";
import { db } from "@/lib/db";

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
