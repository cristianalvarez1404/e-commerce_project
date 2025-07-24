import { z } from "zod";

export const UpdateUserDTO = z.object({
  username: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserDTO>;
