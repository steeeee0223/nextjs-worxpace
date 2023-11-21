import { z } from "zod";

export const DeleteBoard = z.object({ id: z.string() });

export type DeleteBoardInput = z.infer<typeof DeleteBoard>;
