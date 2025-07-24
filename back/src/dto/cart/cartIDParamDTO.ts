import { z } from "zod";

export const CartIDParamDTO = z.object({
  id: z.string(),
});

export type CartIDParamInput = z.infer<typeof CartIDParamDTO>;
