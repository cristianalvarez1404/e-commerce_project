import { z } from "zod";

export const CommentIDParamDTO = z.object({
  id: z.string(),
});

export type CommentIdParamsInput = z.infer<typeof CommentIDParamDTO>;
