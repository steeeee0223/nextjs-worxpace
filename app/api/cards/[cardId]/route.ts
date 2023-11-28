import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { fetchCardById } from "@/lib";

type Params = { params: { cardId: string } };

export async function GET(req: Request, { params: { cardId } }: Params) {
    try {
        const { userId, orgId } = auth();
        if (!userId || !orgId)
            return new NextResponse("Unauthorized", { status: 401 });

        const card = await fetchCardById(orgId, cardId);
        return NextResponse.json(card);
    } catch (error) {
        return new NextResponse("Internal Service Error", { status: 500 });
    }
}
