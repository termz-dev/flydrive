import { z } from "zod";

/** datetime-local values are entered in Lagos time (UTC+1, no DST). */
export const lagosDateTime = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Choose a date and time.")
  .transform((v) => new Date(`${v}:00+01:00`));

export const toLagosInput = (d: Date) => new Date(d.getTime() + 3600e3).toISOString().slice(0, 16);

export const nairaToKobo = z
  .string()
  .trim()
  .transform((v) => v.replace(/[₦,\s]/g, ""))
  .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter an amount in naira, e.g. 45000."))
  .transform((v) => Math.round(Number(v) * 100))
  .pipe(
    z
      .number()
      .int()
      .positive("Enter an amount above zero.")
      .max(100_000_000_00, "That amount looks too large."),
  );

export const uuid = z.string().uuid("Missing or invalid id.");
export const shortText = (max: number, msg = "Required.") => z.string().trim().min(1, msg).max(max);
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));
