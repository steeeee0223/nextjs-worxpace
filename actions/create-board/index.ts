"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";

import { ActionHandler, createAuditLog, createSafeAction, db } from "@/lib";
import { CreateBoard, type CreateBoardInput } from "./schema";

const handler: ActionHandler<CreateBoardInput, Board> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { title, image: imageString } = data;

    let board;
    let image;
    try {
        if (imageString) {
            const [imageId, thumbUrl, fullUrl, username, linkHTML] =
                imageString.split("|");
            image = { imageId, thumbUrl, fullUrl, username, linkHTML };
        }
        board = await db.board.create({ data: { orgId, title, image } });

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
