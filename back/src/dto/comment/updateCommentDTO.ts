import { z } from "zod";

export const UpdateCommentDTO = z.object({
  product_id: z.string().optional(),
  comment: z.string().min(3).optional(),
  liked: z.boolean().optional(),
  star: z.number().int().min(0).max(5).optional(),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentDTO>;
