import { z } from "zod";

export const RenameDocument = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title is required",
        })
        .min(0, "Title is required"),
    id: z.string(),
});

export type RenameDocumentInput = z.infer<typeof RenameDocument>;
