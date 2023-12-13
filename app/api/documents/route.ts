import { NextResponse } from "next/server";

import { UnauthorizedError, fetchClient, fetchAllDocuments } from "@/lib";

export async function GET(req: Request) {
    try {
        const { clientId } = fetchClient();
        const documents = await fetchAllDocuments(clientId);
        return NextResponse.json(documents);
    } catch (error) {
        if (error instanceof UnauthorizedError)
            return new NextResponse("Unauthorized", { status: 401 });
        return new NextResponse("Internal Service Error", { status: 500 });
    }
}
