import { z } from "zod";

export const CopyCard = z.object({
    id: z.string(),
    boardId: z.string(),
});

export type CopyCardInput = z.infer<typeof CopyCard>;
