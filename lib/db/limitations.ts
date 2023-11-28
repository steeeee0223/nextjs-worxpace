import { Limitation } from "@prisma/client";

import { db } from "./config";
import { Client } from "../types";

export const fetchLimit = async (client: Client): Promise<Limitation | null> =>
    await db.limitation.findUnique({
        where: { ...client },
    });

export const updateLimit = async (
    client: Client,
    action: "INCREASE" | "DECREASE"
): Promise<Limitation | null> => {
    let count = 1;
    const limit = await fetchLimit(client);
    if (limit) {
        count =
            action === "INCREASE"
                ? limit.count + 1
                : limit.count > 0
                ? limit.count - 1
                : 0;
    }
    return await db.limitation.upsert({
        where: { ...client },
        create: { ...client, count },
        update: { count },
    });
};
