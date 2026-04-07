REVOKE ALL ON public.waitlist_signups FROM anon;
--> statement-breakpoint
GRANT INSERT (email, source) ON public.waitlist_signups TO anon;
--> statement-breakpoint
DROP POLICY IF EXISTS anon_insert_waitlist_signups ON public.waitlist_signups;
--> statement-breakpoint
CREATE POLICY anon_insert_waitlist_signups
  ON public.waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL
    AND source IS NOT NULL
    AND length(email) <= 320
    AND length(source) <= 80
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );
