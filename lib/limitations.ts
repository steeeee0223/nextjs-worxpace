import { MAX_FREE_BOARDS } from "@/constants/subscription";
import { fetchLimit, updateLimit } from "@/lib/db";
import { fetchClient } from "@/lib/utils";

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
