import { date, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { profiles } from "@/db/schema/profiles";

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientUserId: text("client_user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    day: date("day", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("attendance_client_day").on(t.clientUserId, t.day)]
);
