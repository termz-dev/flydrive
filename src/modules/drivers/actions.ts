"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "@/modules/identity/session";
import { passwordProblem } from "@/modules/identity/password";
import { rateLimit } from "@/modules/identity/rate-limit";
import { actor } from "@/modules/shared/guards";
import { lagosDateTime, optionalText, shortText, uuid } from "@/modules/shared/parse";
import { formObject, toActionError, type ActionState } from "@/platform/action";
import { bookingsOpen } from "@/platform/config";
import { getDb } from "@/platform/db";
import { AppError, FeatureUnavailableError } from "@/platform/errors";
import { addUnavailability, applyAsDriver, removeUnavailability } from "./service";

const applySchema = z.object({
  fullName: shortText(120, "Enter your full name."),
  firstName: shortText(40, "Enter the first name customers will see."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .transform((v) => (v.startsWith("0") && v.length === 11 ? `+234${v.slice(1)}` : v))
    .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/, "Enter a phone number like 0803 123 4567.")),
  password: z.string(),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  gender: z.enum(["female", "male", "undisclosed"]),
  bio: optionalText(600),
  consent: z.literal("on", { message: "You need to agree before we can review your application." }),
});

export async function applyDriverAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    if (!bookingsOpen()) throw new FeatureUnavailableError("Driver applications");
    const v = applySchema.parse(formObject(fd));
    const transmissions = fd
      .getAll("transmissions")
      .filter((x): x is "manual" | "automatic" => x === "manual" || x === "automatic");
    const cities = fd
      .getAll("cities")
      .filter((x): x is "lagos" | "ibadan" => x === "lagos" || x === "ibadan");
    const fieldErrors = [];
    if (!transmissions.length)
      fieldErrors.push({ field: "transmissions", message: "Choose at least one." });
    if (!cities.length) fieldErrors.push({ field: "cities", message: "Choose at least one city." });
    const pw = passwordProblem(v.password);
    if (pw) fieldErrors.push({ field: "password", message: pw });
    if (fieldErrors.length)
      throw new AppError("INVALID_INPUT", "INVALID", "Please check the highlighted fields.", {
        fieldErrors,
      });
    await rateLimit("driver-apply", 200, 3600);
    const id = await applyAsDriver(getDb(), { ...v, transmissions, cities });
    await createSession(id, "driver");
  } catch (err) {
    return toActionError(err, "drivers");
  }
  redirect("/driver?applied=1");
}

export async function addUnavailabilityAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("driver");
    const v = z.object({ startsAt: lagosDateTime, endsAt: lagosDateTime }).parse(formObject(fd));
    await addUnavailability(getDb(), u.id, v.startsAt, v.endsAt);
    revalidatePath("/driver/availability");
    return { status: "ok", message: "Time blocked. You won't be offered jobs then." };
  } catch (err) {
    return toActionError(err, "drivers");
  }
}

export async function removeUnavailabilityAction(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const u = await actor("driver");
    const { blockId } = z.object({ blockId: uuid }).parse(formObject(fd));
    await removeUnavailability(getDb(), u.id, blockId);
    revalidatePath("/driver/availability");
    return { status: "ok", message: "Removed." };
  } catch (err) {
    return toActionError(err, "drivers");
  }
}
