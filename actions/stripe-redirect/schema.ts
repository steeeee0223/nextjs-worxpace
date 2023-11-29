import { z } from "zod";

export const StripeRedirect = z.object({});

export type StripeRedirectInput = z.infer<typeof StripeRedirect>;
