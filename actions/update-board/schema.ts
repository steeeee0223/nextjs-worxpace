import { z } from "zod";

export const UpdateBoard = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title is required",
        })
        .min(3, "Title is too short."),
    id: z.string(),
});

export type UpdateBoardInput = z.infer<typeof UpdateBoard>;
