import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, waitlistSignups } from "@bigfive/db";

const payloadSchema = z.object({
  email: z.string().email(),
  source: z.string().default("website"),
});

export async function POST(request: Request) {
  try {
    const payload = payloadSchema.parse(await request.json());
    const db = getDb();
    const existing = await db
      .select({ email: waitlistSignups.email })
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, payload.email))
      .limit(1);

    if (existing.length) {
      return NextResponse.json({ message: "You're already on the list." });
    }

    await db.insert(waitlistSignups).values(payload);

    return NextResponse.json({ message: "Thanks. You're on the launch list." });
  } catch (error) {
    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return NextResponse.json(
        { message: "Waitlist storage is not configured yet. Add DATABASE_URL to enable signups." },
        { status: 503 },
      );
    }

    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }
}
