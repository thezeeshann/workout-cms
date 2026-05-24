import { z } from "zod";

export const updateProfileBodySchema = z.object({
  displayName: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(255).optional(),
});

export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
