import { z } from "zod";

export const CreateUserDto = z.object({
  username: z.string().min(1, "please provide a username"),
  email: z.string().email("Email is wrong"),
  password: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
  typeUser: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserDto>;
