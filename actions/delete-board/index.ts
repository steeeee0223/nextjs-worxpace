"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";

import { ActionHandler, createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { DeleteBoard, DeleteBoardInput } from "./schema";

const handler: ActionHandler<DeleteBoardInput, Board> = async (data) => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const { id } = data;

    let board;
    try {
        board = await db.board.delete({ where: { id, orgId } });
    } catch (error) {
        console.log(error);
        return { error: "Failed to delete board." };
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
