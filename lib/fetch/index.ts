import { Board } from "@prisma/client";
import { db } from "@/lib/db";

export const fetchBoards = async (orgId: string): Promise<Board[]> =>
    await db.board.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
    });
