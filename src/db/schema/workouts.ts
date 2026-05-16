import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { splitTypeEnum } from "@/db/schema/enums";
import { profiles } from "@/db/schema/profiles";

export const workouts = pgTable("workouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  splitType: splitTypeEnum("split_type").notNull().default("custom"),
  isTemplate: boolean("is_template").notNull().default(true),
  createdBy: text("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseName: text("exercise_name").notNull(),
  sets: integer("sets"),
  reps: text("reps"),
  sortOrder: integer("sort_order").notNull().default(0),
  notes: text("notes"),
});

export const userWorkouts = pgTable("user_workouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientUserId: text("client_user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const userHistory = pgTable("user_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientUserId: text("client_user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  workoutId: uuid("workout_id").references(() => workouts.id, {
    onDelete: "set null",
  }),
  performedAt: timestamp("performed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  snapshot: jsonb("snapshot").$type<Record<string, unknown> | null>(),
});
