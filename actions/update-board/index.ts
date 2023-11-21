"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";

import { ActionHandler, createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { UpdateBoard, UpdateBoardInput } from "./schema";

const handler: ActionHandler<UpdateBoardInput, Board> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { title, id } = data;

    let board;
    try {
        board = await db.board.update({
            where: { id, orgId },
            data: { title },
        });
    } catch (error) {
        console.log(error);
        return { error: "Failed to update board." };
    }

    revalidatePath(`/board/${id}`);
    return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
export type { UpdateBoard, UpdateBoardInput };
