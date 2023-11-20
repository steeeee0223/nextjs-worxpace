"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";

import { ActionHandler, createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { CreateBoard, type CreateBoardInput } from "./schema";

const handler: ActionHandler<CreateBoardInput, Board> = async (data) => {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    const { title } = data;
    let board;
    try {
        board = await db.board.create({ data: { title } });
    } catch (error) {
        return { error: "Failed to create board." };
    }

    revalidatePath(`board/${board.id}`);
    return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
