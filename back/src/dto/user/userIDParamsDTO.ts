import { z } from "zod";

export const UserIdParamsDTO = z.object({
  id: z.string(),
});

export type UserIdParamsInput = z.infer<typeof UserIdParamsDTO>;
