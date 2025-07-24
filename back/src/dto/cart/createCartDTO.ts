import { z } from "zod";

export const CreateCartDTO = z.object({
  idProduct: z.string(),
  unitsToBuy: z.number(),
});

export const CreateCartListDTO = z.array(CreateCartDTO);

export type CreateCartInput = z.infer<typeof CreateCartDTO>;
