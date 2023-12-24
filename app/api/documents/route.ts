import { NextResponse, type NextRequest } from "next/server";

import {
    UnauthorizedError,
    fetchClient,
    fetchAllDocuments,
    parseBool,
} from "@/lib";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    try {
        const { clientId } = fetchClient();
        const archived = parseBool(params.get("archived"));
        const documents = await fetchAllDocuments(clientId, archived);
        return NextResponse.json(documents);
    } catch (error) {
        if (error instanceof UnauthorizedError)
            return new NextResponse("Unauthorized", { status: 401 });
        return new NextResponse("Internal Service Error", { status: 500 });
    }
}
