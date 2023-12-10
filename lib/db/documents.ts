import { Document } from "@prisma/client";

import { db } from "./config";

export const fetchDocuments = async (clientId: string): Promise<Document[]> =>
    await db.document.findMany({ where: { clientId } });
