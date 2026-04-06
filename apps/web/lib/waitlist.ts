import { z } from "zod";

export const waitlistPayloadSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  source: z.string().trim().max(80).default("website"),
});
