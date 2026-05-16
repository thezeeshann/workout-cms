import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { profiles } from "@/db/schema/profiles";

export const coachClients = pgTable(
  "coach_clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coachUserId: text("coach_user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    clientUserId: text("client_user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("coach_clients_pair").on(t.coachUserId, t.clientUserId)]
);

export const dietPlans = pgTable("diet_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientUserId: text("client_user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  coachUserId: text("coach_user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
