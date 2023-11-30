import { Card } from "@prisma/client";

import { db } from "./config";

export const fetchCardById = async (
    clientId: string,
    cardId: string
): Promise<Card | null> =>
    await db.card.findUnique({
        where: { id: cardId, list: { board: { clientId } } },
        include: { list: { select: { title: true } } },
    });

export const fetchLastCard = async (listId: string) =>
    await db.card.findFirst({
        where: { listId },
        orderBy: { order: "desc" },
        select: { order: true },
    });
