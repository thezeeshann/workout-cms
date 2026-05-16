import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "coach", "client"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "trial",
]);
export const splitTypeEnum = pgEnum("split_type", [
  "push_pull_legs",
  "upper_lower",
  "full_body",
  "bro_split",
  "custom",
]);
