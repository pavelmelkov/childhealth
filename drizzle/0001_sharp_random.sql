CREATE TYPE "public"."schedule_exception_type" AS ENUM('closed_day', 'closed_interval', 'open_interval');--> statement-breakpoint
CREATE TABLE "schedule_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" varchar(10) NOT NULL,
	"type" "schedule_exception_type" NOT NULL,
	"starts_at" varchar(5),
	"ends_at" varchar(5),
	"note" text,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"singleton_key" varchar(32) DEFAULT 'default' NOT NULL,
	"slot_duration_minutes" integer DEFAULT 60 NOT NULL,
	"booking_horizon_days" integer DEFAULT 30 NOT NULL,
	"min_notice_hours" integer DEFAULT 12 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_working_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekday" integer NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"starts_at" varchar(5) DEFAULT '09:00' NOT NULL,
	"ends_at" varchar(5) DEFAULT '19:00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedule_exceptions_date_idx" ON "schedule_exceptions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "schedule_exceptions_type_idx" ON "schedule_exceptions" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_settings_singleton_key_unique" ON "schedule_settings" USING btree ("singleton_key");--> statement-breakpoint
CREATE UNIQUE INDEX "weekly_working_hours_weekday_unique" ON "weekly_working_hours" USING btree ("weekday");