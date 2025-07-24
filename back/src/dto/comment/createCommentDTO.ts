import { z } from "zod";

export const CreateCommentDTO = z.object({
  product_id: z.string(),
  comment: z.string().min(3),
  liked: z.boolean().optional(),
  star: z.number().int().min(0).max(5).optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentDTO>;
