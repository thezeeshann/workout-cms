import type { profiles } from "@/db/schema";

export type ProfileRow = typeof profiles.$inferSelect;
