import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const splitTypeSchema = z.enum([
  "push_pull_legs",
  "upper_lower",
  "full_body",
  "bro_split",
  "custom",
]);

export const subscriptionStatusSchema = z.enum([
  "active",
  "inactive",
  "trial",
]);
