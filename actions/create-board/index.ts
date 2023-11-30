"use server";

import { revalidatePath } from "next/cache";
import { Board } from "@prisma/client";

import {
    ActionHandler,
    checkSubscription,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
    hasAvailableCount,
    setAvailableCount,
} from "@/lib";
import { CreateBoard, type CreateBoardInput } from "./schema";

const handler: ActionHandler<CreateBoardInput, Board> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const hasReachedLimit = await hasAvailableCount();
    const isPro = await checkSubscription();
    if (!hasReachedLimit && !isPro)
        return {
            error: "You have reached your limit of free boards. Please upgrade to create more.",
        };

    const { clientId } = client;
    const { title, image: imageString } = data;

    let board;
    let image;
    try {
        if (imageString) {
            const [imageId, thumbUrl, fullUrl, username, linkHTML] =
                imageString.split("|");
            image = { imageId, thumbUrl, fullUrl, username, linkHTML };
        }
        board = await db.board.create({ data: { clientId, title, image } });
        /** Limitations */
        if (!isPro) await setAvailableCount("INCREASE");
        /** Activity Log */
        await createAuditLog(
            { title, entityId: board.id, type: "BOARD" },
            "CREATE"
        );
    } catch (error) {
        console.log(`ERROR`, error);
        return { error: "Failed to create board." };
    }

    revalidatePath(`board/${board.id}`);
    return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
