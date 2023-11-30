import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { ENTITY_TYPE } from "@prisma/client";

import { fetchLogsByType } from "@/lib";

type Params = { params: { cardId: string } };

export async function GET(_req: Request, { params: { cardId } }: Params) {
    try {
        const { userId, orgId } = auth();
        if (!userId && !orgId)
            return new NextResponse("Unauthorized", { status: 401 });

        const logs = await fetchLogsByType(
            userId,
            cardId,
            ENTITY_TYPE.CARD,
            orgId
        );
        return NextResponse.json(logs);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
