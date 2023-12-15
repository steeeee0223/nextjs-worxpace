import { NextResponse, type NextRequest } from "next/server";

import {
    NotFound,
    UnauthorizedError,
    fetchClient,
    fetchDocumentById,
} from "@/lib";

type Params = { params: { documentId: string } };

export async function GET(
    req: NextRequest,
    { params: { documentId } }: Params
) {
    try {
        const document = await fetchDocumentById(documentId);
        if (!document) throw new NotFound();

        if (document.isPublished && !document.isArchived)
            return NextResponse.json(document);

        const { clientId } = fetchClient();
        if (document.clientId !== clientId) throw new UnauthorizedError();

        return NextResponse.json(document);
    } catch (error) {
        if (error instanceof NotFound)
            return new NextResponse("Not Found", { status: 404 });
        if (error instanceof UnauthorizedError)
            return new NextResponse("Unauthorized", { status: 401 });
        return new NextResponse("Internal Service Error", { status: 500 });
    }
}
