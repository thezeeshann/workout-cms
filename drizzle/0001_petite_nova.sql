CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_client_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_client_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_history" DROP CONSTRAINT "user_history_client_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_workouts" DROP CONSTRAINT "user_workouts_client_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "workouts" DROP CONSTRAINT "workouts_created_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_clients" DROP CONSTRAINT "coach_clients_coach_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_clients" DROP CONSTRAINT "coach_clients_client_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "diet_plans" DROP CONSTRAINT "diet_plans_client_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "diet_plans" DROP CONSTRAINT "diet_plans_coach_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "client_user_id" SET DATA TYPE text USING "client_user_id"::text;
--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "client_user_id" SET DATA TYPE text USING "client_user_id"::text;
--> statement-breakpoint
ALTER TABLE "user_history" ALTER COLUMN "client_user_id" SET DATA TYPE text USING "client_user_id"::text;
--> statement-breakpoint
ALTER TABLE "user_workouts" ALTER COLUMN "client_user_id" SET DATA TYPE text USING "client_user_id"::text;
--> statement-breakpoint
ALTER TABLE "workouts" ALTER COLUMN "created_by" SET DATA TYPE text USING "created_by"::text;
--> statement-breakpoint
ALTER TABLE "coach_clients" ALTER COLUMN "coach_user_id" SET DATA TYPE text USING "coach_user_id"::text;
--> statement-breakpoint
ALTER TABLE "coach_clients" ALTER COLUMN "client_user_id" SET DATA TYPE text USING "client_user_id"::text;
--> statement-breakpoint
ALTER TABLE "diet_plans" ALTER COLUMN "client_user_id" SET DATA TYPE text USING "client_user_id"::text;
--> statement-breakpoint
ALTER TABLE "diet_plans" ALTER COLUMN "coach_user_id" SET DATA TYPE text USING "coach_user_id"::text;
--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_history" ADD CONSTRAINT "user_history_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "coach_clients" ADD CONSTRAINT "coach_clients_coach_user_id_profiles_id_fk" FOREIGN KEY ("coach_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "coach_clients" ADD CONSTRAINT "coach_clients_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_coach_user_id_profiles_id_fk" FOREIGN KEY ("coach_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");
