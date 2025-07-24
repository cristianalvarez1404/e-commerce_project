import { z } from "zod";

export const UpdateProductDTO = z.object({
  title: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number().min(1).optional(),
  reference: z.string().optional(),
  inventory_id: z.string().optional(),
});

export type UpdateProductInput = z.infer<typeof UpdateProductDTO>;
