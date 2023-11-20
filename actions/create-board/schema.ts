import { z } from "zod";

export const CreateBoard = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title is required",
        })
        .min(3, "Title is too short."),
});

export type CreateBoardInput = z.infer<typeof CreateBoard>;
