import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "big-five-career-hub",
    timestamp: new Date().toISOString(),
  });
}
