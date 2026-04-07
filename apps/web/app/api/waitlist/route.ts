import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { waitlistPayloadSchema } from "@/lib/waitlist";
import { saveWaitlistSignup } from "@/lib/waitlist-storage";

export async function POST(request: Request) {
  try {
    const payload = waitlistPayloadSchema.parse(await request.json());
    const result = await saveWaitlistSignup(payload);

    if (result === "existing") {
      return NextResponse.json({ message: "You're already on the list." });
    }

    return NextResponse.json({ message: "Thanks. You're on the launch list." });
  } catch (error) {
    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return NextResponse.json(
        { message: "Waitlist storage is not configured yet. Add DATABASE_URL to enable signups." },
        { status: 503 },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    console.error("Waitlist signup failed.", error);

    return NextResponse.json(
      { message: "Waitlist storage is temporarily unavailable. Please try again soon." },
      { status: 503 },
    );
  }
}
