"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fleetVehicles, supportCases } from "@/db/schema";
import {
  cancelBooking,
  confirmBooking,
  markNoCandidate,
  publishCandidates,
  rejectPayment,
} from "@/modules/booking/service";
import { reviewCheck, setDriverStatus } from "@/modules/drivers/service";
import { actor } from "@/modules/shared/guards";
import { nairaToKobo, shortText, uuid } from "@/modules/shared/parse";
import { audit } from "@/modules/shared/records";
import { formObject, toActionError, type ActionState } from "@/platform/action";
import { getDb } from "@/platform/db";
import { AppError } from "@/platform/errors";

const ok = (message: string): ActionState => ({ status: "ok", message });

export async function publishAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "bookings.manage");
    const v = z
      .object({
        bookingId: uuid,
        quote: nairaToKobo,
        fleetVehicleId: z
          .string()
          .uuid()
          .optional()
          .or(z.literal("").transform(() => undefined)),
      })
      .parse(formObject(fd));
    const driverIds = fd
      .getAll("driverIds")
      .map(String)
      .filter((x) => z.string().uuid().safeParse(x).success);
    await publishCandidates(getDb(), u.id, v.bookingId, {
      quoteKobo: v.quote,
      driverIds,
      fleetVehicleId: v.fleetVehicleId ?? null,
    });
    revalidatePath(`/ops/bookings/${v.bookingId}`);
    return ok("Shortlist sent to the customer.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function noCandidateAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "bookings.manage");
    const v = z
      .object({ bookingId: uuid, reason: shortText(300, "Give a short reason.") })
      .parse(formObject(fd));
    await markNoCandidate(getDb(), u.id, v.bookingId, v.reason);
    revalidatePath(`/ops/bookings/${v.bookingId}`);
    return ok("Customer told no driver is available.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function confirmAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "bookings.confirm");
    if (!u.permissions.includes("payments.verify"))
      throw new AppError(
        "FORBIDDEN",
        "MISSING_PERMISSION",
        "You need payment-verification permission to confirm.",
      );
    const { bookingId } = z.object({ bookingId: uuid }).parse(formObject(fd));
    await confirmBooking(getDb(), u.id, bookingId);
    revalidatePath(`/ops/bookings/${bookingId}`);
    return ok("Payment verified and booking confirmed.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function rejectPaymentAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "payments.verify");
    const v = z
      .object({ bookingId: uuid, reason: shortText(300, "Give a reason.") })
      .parse(formObject(fd));
    await rejectPayment(getDb(), u.id, v.bookingId, v.reason);
    revalidatePath(`/ops/bookings/${v.bookingId}`);
    return ok("Payment marked as not verified.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function opsCancelAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "bookings.manage");
    const v = z
      .object({ bookingId: uuid, reason: shortText(300, "Give a reason.") })
      .parse(formObject(fd));
    await cancelBooking(getDb(), { id: u.id, role: "staff" }, v.bookingId, v.reason);
    revalidatePath(`/ops/bookings/${v.bookingId}`);
    return ok("Booking cancelled.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function reviewCheckAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "drivers.review");
    const v = z
      .object({
        checkId: uuid,
        status: z.enum(["passed", "failed", "pending"]),
        note: shortText(500, "Note what you checked (no ID numbers)."),
        expiresOn: z
          .string()
          .optional()
          .transform((s) => (s ? new Date(`${s}T23:59:59+01:00`) : null)),
      })
      .parse(formObject(fd));
    const driverId = await reviewCheck(getDb(), u.id, {
      checkId: v.checkId,
      status: v.status,
      note: v.note,
      expiresAt: v.expiresOn,
    });
    revalidatePath(`/ops/drivers/${driverId}`);
    return ok("Check updated.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function driverStatusAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "drivers.review");
    const v = z
      .object({
        driverId: uuid,
        status: z.enum(["suspended", "rejected", "under_review"]),
        reason: shortText(300, "Give a reason."),
      })
      .parse(formObject(fd));
    await setDriverStatus(getDb(), u.id, v.driverId, v.status, v.reason);
    revalidatePath(`/ops/drivers/${v.driverId}`);
    return ok("Driver status updated.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function addFleetVehicleAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "bookings.manage");
    const v = z
      .object({
        label: shortText(80, "Name the vehicle, e.g. Toyota Camry (white)."),
        vehicleClass: z.enum(["saloon", "suv", "minivan"]),
        transmission: z.enum(["manual", "automatic"]),
        city: z.enum(["lagos", "ibadan"]),
        seats: z.coerce.number().int().min(1).max(20).optional(),
      })
      .parse(formObject(fd));
    const db = getDb();
    const [row] = await db
      .insert(fleetVehicles)
      .values({ ...v, seats: v.seats ?? null })
      .returning({ id: fleetVehicles.id });
    await audit(db, u.id, "fleet.vehicle_added", { type: "fleet_vehicle", id: row!.id });
    revalidatePath("/ops/fleet");
    return ok("Vehicle added.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}

export async function resolveCaseAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("staff", "incidents.manage");
    const v = z
      .object({ caseId: uuid, resolution: shortText(1000, "Describe how it was resolved.") })
      .parse(formObject(fd));
    const db = getDb();
    await db
      .update(supportCases)
      .set({
        status: "resolved",
        resolution: v.resolution,
        resolvedBy: u.id,
        resolvedAt: new Date(),
      })
      .where(eq(supportCases.id, v.caseId));
    await audit(db, u.id, "case.resolved", { type: "support_case", id: v.caseId });
    revalidatePath("/ops/incidents");
    return ok("Case resolved.");
  } catch (err) {
    return toActionError(err, "ops");
  }
}
