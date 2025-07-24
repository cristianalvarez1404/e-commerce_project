import { z } from "zod";

export const UpdateCartDTO = z.object({
  idProduct: z.string(),
  unitsToBuy: z.number(),
  prevUnits: z.number(),
});

export const UpdateCartListDTO = z.array(UpdateCartDTO);

export type UpdateCartInput = z.infer<typeof UpdateCartDTO>;
