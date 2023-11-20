import { z } from "zod";

export type FieldErrors<T> = Record<keyof T, string[]>;

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
};

export type ActionHandler<TInput, TOutput> = (
    data: TInput
) => Promise<ActionState<TInput, TOutput>>;

export const createSafeAction =
    <TInput, TOutput>(
        schema: z.Schema<TInput>,
        handler: ActionHandler<TInput, TOutput>
    ): ActionHandler<TInput, TOutput> =>
    async (data) => {
        const result = schema.safeParse(data);
        return result.success
            ? handler(result.data)
            : {
                  fieldErrors: result.error.flatten()
                      .fieldErrors as FieldErrors<TInput>,
              };
    };
