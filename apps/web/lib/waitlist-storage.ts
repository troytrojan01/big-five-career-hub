import { eq } from "drizzle-orm";

import { getDb, waitlistSignups } from "@bigfive/db";

import type { WaitlistPayload } from "@/lib/waitlist";

type WaitlistSaveResult = "created" | "existing";

function getSupabaseRestConfig() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    anonKey,
    endpoint: new URL("/rest/v1/waitlist_signups", url).toString(),
  };
}

async function saveWaitlistSignupWithSupabaseRest(payload: WaitlistPayload): Promise<WaitlistSaveResult> {
  const config = getSupabaseRestConfig();

  if (!config) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are not configured.");
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return "created";
  }

  const body = await response.json().catch(() => null);
  if (response.status === 409 && body?.code === "23505") {
    return "existing";
  }

  throw new Error(`Supabase REST waitlist insert failed with status ${response.status}.`);
}

async function saveWaitlistSignupWithPostgres(payload: WaitlistPayload): Promise<WaitlistSaveResult> {
  const db = getDb();
  const existing = await db
    .select({ email: waitlistSignups.email })
    .from(waitlistSignups)
    .where(eq(waitlistSignups.email, payload.email))
    .limit(1);

  if (existing.length) {
    return "existing";
  }

  await db.insert(waitlistSignups).values(payload);
  return "created";
}

export async function saveWaitlistSignup(payload: WaitlistPayload): Promise<WaitlistSaveResult> {
  if (getSupabaseRestConfig()) {
    return saveWaitlistSignupWithSupabaseRest(payload);
  }

  return saveWaitlistSignupWithPostgres(payload);
}
