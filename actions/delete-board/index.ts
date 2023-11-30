"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Board } from "@prisma/client";

import { PATH } from "@/constants/site";
import {
    ActionHandler,
    checkSubscription,
    createAuditLog,
    createSafeAction,
    db,
    fetchClient,
    setAvailableCount,
} from "@/lib";
import { DeleteBoard, DeleteBoardInput } from "./schema";

const handler: ActionHandler<DeleteBoardInput, Board> = async (data) => {
    let client;
    try {
        client = fetchClient();
    } catch (error) {
        return { error: "Unauthorized" };
    }

    const isPro = await checkSubscription();
    const { clientId, role } = client;
    const { id } = data;

    let board;
    try {
        board = await db.board.delete({ where: { id, clientId } });
        /** Limitations */
        if (!isPro) await setAvailableCount("DECREASE");
        /** Activity Log */
        await createAuditLog(
            { title: board.title, entityId: id, type: "BOARD" },
            "DELETE"
        );
    } catch (error) {
        console.log(error);
        return { error: "Failed to delete board." };
    }

    revalidatePath(`/${PATH[role]}/${clientId}`);
    redirect(`/${PATH[role]}/${clientId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
