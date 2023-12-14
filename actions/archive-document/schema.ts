import { z } from "zod";

export const ArchiveDocument = z.object({
    id: z.string(),
});

export type ArchiveDocumentInput = z.infer<typeof ArchiveDocument>;
