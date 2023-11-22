import { z } from "zod";

export const UpdateList = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title is required",
        })
        .min(1, {
            message: "Title is required",
        }),
    id: z.string(),
    boardId: z.string(),
});

export type UpdateListInput = z.infer<typeof UpdateList>;
