import { describe, expect, it } from "vitest";

import { waitlistPayloadSchema } from "../../../lib/waitlist";

describe("waitlist payload normalization", () => {
  it("lowercases and trims email addresses", () => {
    const payload = waitlistPayloadSchema.parse({
      email: "  TROY@EXAMPLE.COM ",
      source: "homepage",
    });

    expect(payload.email).toBe("troy@example.com");
  });

  it("limits source labels", () => {
    const result = waitlistPayloadSchema.safeParse({
      email: "troy@example.com",
      source: "x".repeat(81),
    });

    expect(result.success).toBe(false);
  });
});
