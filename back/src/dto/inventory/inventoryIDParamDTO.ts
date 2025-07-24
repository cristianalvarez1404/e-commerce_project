import { z } from "zod";

export const InventoryIdParamsDTO = z.object({
  id: z.string(),
});

export type UserIdParamsInput = z.infer<typeof InventoryIdParamsDTO>;
