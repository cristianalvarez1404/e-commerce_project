import { z } from "zod";

export const CreateProductDTO = z.object({
  title: z.string(),
  short_description: z.string(),
  price: z.number().min(1),
  reference: z.string(),
  inventory_id: z.string().optional(),
  image_id: z.string().optional(),
  comments: z.array(z.string()).optional(),
});

export type CreateProdutInput = z.infer<typeof CreateProductDTO>;
