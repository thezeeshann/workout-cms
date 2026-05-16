import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { subscriptionStatusEnum } from "@/db/schema/enums";
import { profiles } from "@/db/schema/profiles";

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientUserId: text("client_user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  status: subscriptionStatusEnum("status").notNull().default("inactive"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
