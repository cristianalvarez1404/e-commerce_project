import { z } from "zod";

export const UpdatePasswordUserDTO = z.object({
  newPassword: z.string().min(3),
  repetedPassword: z.string().min(3),
  oldPassword: z.string().min(3),
});

export type UpdatePasswordUserInput = z.infer<typeof UpdatePasswordUserDTO>;
