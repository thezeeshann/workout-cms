import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum } from "@/db/schema/enums";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("client"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
