CREATE TYPE "public"."split_type" AS ENUM('push_pull_legs', 'upper_lower', 'full_body', 'bro_split', 'custom');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'trial');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'coach', 'client');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"phone" text,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'inactive' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"day" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attendance_client_day" UNIQUE("client_user_id","day")
);
--> statement-breakpoint
CREATE TABLE "user_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"workout_id" uuid,
	"performed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"snapshot" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"workout_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"exercise_name" text NOT NULL,
	"sets" integer,
	"reps" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"split_type" "split_type" DEFAULT 'custom' NOT NULL,
	"is_template" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_user_id" uuid NOT NULL,
	"client_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coach_clients_pair" UNIQUE("coach_user_id","client_user_id")
);
--> statement-breakpoint
CREATE TABLE "diet_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"coach_user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_history" ADD CONSTRAINT "user_history_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_history" ADD CONSTRAINT "user_history_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_clients" ADD CONSTRAINT "coach_clients_coach_user_id_profiles_id_fk" FOREIGN KEY ("coach_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_clients" ADD CONSTRAINT "coach_clients_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_client_user_id_profiles_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_coach_user_id_profiles_id_fk" FOREIGN KEY ("coach_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;