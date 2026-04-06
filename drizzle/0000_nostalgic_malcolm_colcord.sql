CREATE TYPE "public"."company_slug" AS ENUM('amazon', 'apple', 'google', 'meta', 'microsoft');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('remote', 'hybrid', 'onsite');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" "company_slug" NOT NULL,
	"name" varchar(80) NOT NULL,
	"careers_url" text NOT NULL,
	"principles_summary" text NOT NULL,
	"hiring_process_summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "job_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_company" "company_slug" NOT NULL,
	"external_job_id" varchar(120) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(180) NOT NULL,
	"role_family" varchar(120) NOT NULL,
	"level" varchar(50) NOT NULL,
	"location" varchar(120) NOT NULL,
	"work_mode" "work_mode" NOT NULL,
	"team" varchar(120) NOT NULL,
	"short_summary" text NOT NULL,
	"official_apply_url" text NOT NULL,
	"posted_at" timestamp with time zone NOT NULL,
	"last_verified_at" timestamp with time zone NOT NULL,
	"status" "job_status" DEFAULT 'active' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"source" varchar(80) DEFAULT 'website' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "job_listings_company_external_idx" ON "job_listings" USING btree ("source_company","external_job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "job_listings_slug_idx" ON "job_listings" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "job_listings_status_idx" ON "job_listings" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_signups_email_idx" ON "waitlist_signups" USING btree ("email");