CREATE TABLE "job_sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_company" "company_slug" NOT NULL,
	"status" varchar(20) NOT NULL,
	"fetched_count" integer DEFAULT 0 NOT NULL,
	"inserted_count" integer DEFAULT 0 NOT NULL,
	"updated_count" integer DEFAULT 0 NOT NULL,
	"inactivated_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "job_sync_runs_source_company_idx" ON "job_sync_runs" USING btree ("source_company");
--> statement-breakpoint
CREATE INDEX "job_sync_runs_started_at_idx" ON "job_sync_runs" USING btree ("started_at");
