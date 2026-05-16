import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import {
  account,
  session,
  user,
  verification,
} from "@/db/schema/auth";

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

function authSecret() {
  const s = process.env.BETTER_AUTH_SECRET;
  if (s && s.length >= 32) return s;
  const isNextProdBuild =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-development-build";
  if (process.env.NODE_ENV !== "production" || isNextProdBuild) {
    return "local-dev-better-auth-secret-32chars!!";
  }
  throw new Error("Set BETTER_AUTH_SECRET (32+ random characters) in production.");
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  secret: authSecret(),
  baseURL,
  trustedOrigins: [
    baseURL,
    ...(process.env.VERCEL_URL
      ? [`https://${process.env.VERCEL_URL}`]
      : []),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
    transaction: true,
  }),
  plugins: [nextCookies()],
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
  emailAndPassword: { enabled: false },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});
