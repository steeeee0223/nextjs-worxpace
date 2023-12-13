import { Document } from "@prisma/client";
import { z } from "zod";

export const DeleteDocument = z.object({
    id: z.string(),
});

export type DeleteDocumentInput = z.infer<typeof DeleteDocument>;
export type DeleteDocumentOutput = {
    document: Document;
    deletedIds: string[];
};
