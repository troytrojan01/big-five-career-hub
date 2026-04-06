ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'companies'
      AND policyname = 'bigfive_app_all_companies'
  ) THEN
    CREATE POLICY bigfive_app_all_companies
      ON public.companies
      TO bigfive_app
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_listings'
      AND policyname = 'bigfive_app_all_job_listings'
  ) THEN
    CREATE POLICY bigfive_app_all_job_listings
      ON public.job_listings
      TO bigfive_app
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'waitlist_signups'
      AND policyname = 'bigfive_app_all_waitlist_signups'
  ) THEN
    CREATE POLICY bigfive_app_all_waitlist_signups
      ON public.waitlist_signups
      TO bigfive_app
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
