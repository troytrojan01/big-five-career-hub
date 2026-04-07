GRANT USAGE ON SCHEMA public TO anon;
--> statement-breakpoint
GRANT INSERT ON public.waitlist_signups TO anon;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'waitlist_signups'
      AND policyname = 'anon_insert_waitlist_signups'
  ) THEN
    CREATE POLICY anon_insert_waitlist_signups
      ON public.waitlist_signups
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END
$$;
