import { z } from "zod";
import { splitTypeSchema } from "@/lib/schemas/common";

export const createWorkoutBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  splitType: splitTypeSchema,
  exercises: z
    .array(
      z.object({
        exerciseName: z.string().min(1),
        sets: z.number().int().positive().optional(),
        reps: z.string().optional(),
        sortOrder: z.number().int().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1),
});
