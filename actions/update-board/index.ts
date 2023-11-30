"use server";

import { revalidatePath } from "next/cache";
import { Board } from "@prisma/client";

import {
    ActionHandler,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
} from "@/lib";
import { UpdateBoard, UpdateBoardInput } from "./schema";

const handler: ActionHandler<UpdateBoardInput, Board> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const { clientId } = client;
    const { title, id } = data;

    let board;
    try {
        board = await db.board.update({
            where: { id, clientId },
            data: { title },
        });

        await createAuditLog({ entityId: id, title, type: "BOARD" }, "UPDATE");
    } catch (error) {
        console.log(error);
        return { error: "Failed to update board." };
    }

    revalidatePath(`/board/${id}`);
    return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
