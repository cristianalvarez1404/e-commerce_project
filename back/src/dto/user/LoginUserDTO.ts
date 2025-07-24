import { z } from "zod";

export const LoginUserDTO = z.object({
  email: z.string().email("Check your email"),
  password: z.string().min(3, "Check your password"),
});

export type LoginUserInput = z.infer<typeof LoginUserDTO>;
