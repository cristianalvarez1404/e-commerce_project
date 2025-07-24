import { z } from "zod";

export const ProductIDParamsDTO = z.object({
  id: z.string(),
});

export type ProductIDParamsInput = z.infer<typeof ProductIDParamsDTO>;
