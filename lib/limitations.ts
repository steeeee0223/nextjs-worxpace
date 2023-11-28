import { auth } from "@clerk/nextjs";

import { MAX_FREE_BOARDS } from "@/constants/subscription";
import { Client } from "./types";
import { fetchLimit, updateLimit } from "./db";

export const fetchClient = (): Client => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) throw new Error("Unauthorized");
    return orgId
        ? { role: "ORG", clientId: orgId }
        : { role: "USER", clientId: userId };
};

export const setAvailableCount = async (action: "INCREASE" | "DECREASE") => {
    const client = fetchClient();
    await updateLimit(client, action);
};

export const hasAvailableCount = async (): Promise<boolean> => {
    const client = fetchClient();
    const limit = await fetchLimit(client);
    return !limit || limit.count < MAX_FREE_BOARDS;
};

export const getAvailableCount = async (): Promise<number> => {
    const client = fetchClient();
    const limit = await fetchLimit(client);
    return limit?.count ?? 0;
};
