import { z } from "zod";

export const RestoreDocument = z.object({
    id: z.string(),
});

export type RestoreDocumentInput = z.infer<typeof RestoreDocument>;
