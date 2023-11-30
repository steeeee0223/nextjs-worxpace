import { NextResponse } from "next/server";

import { UnauthorizedError, fetchCardById, fetchClient } from "@/lib";

type Params = { params: { cardId: string } };

export async function GET(req: Request, { params: { cardId } }: Params) {
    try {
        const { clientId } = fetchClient();
        const card = await fetchCardById(clientId, cardId);
        return NextResponse.json(card);
    } catch (error) {
        if (error instanceof UnauthorizedError)
            return new NextResponse("Unauthorized", { status: 401 });
        return new NextResponse("Internal Service Error", { status: 500 });
    }
}
