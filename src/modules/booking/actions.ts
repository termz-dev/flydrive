"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supportCases } from "@/db/schema";
import { getGateway } from "@/modules/payments/gateway";
import { startPayment } from "@/modules/payments/service";
import { actor } from "@/modules/shared/guards";
import { lagosDateTime, optionalText, shortText, uuid } from "@/modules/shared/parse";
import { notify, staffWith } from "@/modules/shared/records";
import { formObject, toActionError, type ActionState } from "@/platform/action";
import { bookingsOpen, getConfig } from "@/platform/config";
import { getDb } from "@/platform/db";
import { FeatureUnavailableError } from "@/platform/errors";
import {
  cancelBooking,
  createRequest,
  recordHandover,
  respondToOffer,
  selectDriver,
  setMeetingDetails,
} from "./service";

const requestSchema = z
  .object({
    pkg: z.enum(["half-day", "full-day", "weekly", "monthly", "weekend", "custom"]),
    vehicleSource: z.enum(["customer", "flydrive"]),
    make: optionalText(60),
    model: optionalText(60),
    colour: optionalText(40),
    transmission: z.enum(["manual", "automatic"]).optional(),
    vehicleClass: z.enum(["saloon", "suv", "minivan"]).optional(),
    city: z.enum(["lagos", "ibadan"]),
    pickupArea: shortText(160, "Tell us the pickup area."),
    startsAt: lagosDateTime,
    endsAt: lagosDateTime,
    duties: shortText(2000, "Tell us what the driver will be doing."),
    passengers: z.coerce.number().int().min(1, "At least 1.").max(20, "At most 20."),
    overnightOutOfState: z
      .string()
      .optional()
      .transform((v) => v === "on"),
    accommodationNote: optionalText(500),
    prefersFemaleDriver: z
      .string()
      .optional()
      .transform((v) => v === "on"),
    notes: optionalText(1000),
  })
  .superRefine((v, ctx) => {
    if (v.vehicleSource === "customer") {
      if (!v.make) ctx.addIssue({ code: "custom", path: ["make"], message: "Tell us the make." });
      if (!v.model)
        ctx.addIssue({ code: "custom", path: ["model"], message: "Tell us the model." });
      if (!v.transmission)
        ctx.addIssue({
          code: "custom",
          path: ["transmission"],
          message: "Choose the transmission.",
        });
    }
  });

export async function requestBookingAction(_: ActionState, fd: FormData): Promise<ActionState> {
  let id: string;
  try {
    if (!bookingsOpen()) throw new FeatureUnavailableError("Booking requests");
    const u = await actor("customer");
    const v = requestSchema.parse(formObject(fd));
    const b = await createRequest(getDb(), u.id, {
      pkg: v.pkg,
      vehicleSource: v.vehicleSource,
      vehicle:
        v.vehicleSource === "customer"
          ? { make: v.make!, model: v.model!, colour: v.colour, transmission: v.transmission! }
          : undefined,
      vehicleClass: v.vehicleClass,
      city: v.city,
      pickupArea: v.pickupArea,
      startsAt: v.startsAt,
      endsAt: v.endsAt,
      duties: v.duties,
      passengers: v.passengers,
      overnightOutOfState: v.overnightOutOfState,
      accommodationNote: v.accommodationNote,
      prefersFemaleDriver: v.prefersFemaleDriver,
      notes: v.notes,
    });
    id = b.id;
  } catch (err) {
    return toActionError(err, "booking");
  }
  redirect(`/bookings/${id}?submitted=1` as Route);
}

const bookingDriver = z.object({ bookingId: uuid, driverId: uuid });

export async function selectDriverAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("customer");
    const v = bookingDriver.parse(formObject(fd));
    await selectDriver(getDb(), u.id, v.bookingId, v.driverId);
    revalidatePath(`/bookings/${v.bookingId}`);
    return { status: "ok", message: "Offer sent. We'll tell you as soon as the driver responds." };
  } catch (err) {
    return toActionError(err, "booking");
  }
}

export async function payAction(_: ActionState, fd: FormData): Promise<ActionState> {
  let url: string;
  try {
    const u = await actor("customer");
    const { bookingId } = z.object({ bookingId: uuid }).parse(formObject(fd));
    url = await startPayment(
      getDb(),
      getGateway(),
      u.id,
      bookingId,
      getConfig().NEXT_PUBLIC_SITE_URL,
    );
  } catch (err) {
    return toActionError(err, "payments");
  }
  redirect(url as Route);
}

export async function customerCancelAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("customer");
    const v = z.object({ bookingId: uuid, reason: optionalText(300) }).parse(formObject(fd));
    await cancelBooking(
      getDb(),
      { id: u.id, role: "customer" },
      v.bookingId,
      v.reason ?? "Cancelled by customer",
    );
    revalidatePath(`/bookings/${v.bookingId}`);
    return { status: "ok", message: "Booking cancelled." };
  } catch (err) {
    return toActionError(err, "booking");
  }
}

export async function meetingDetailsAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("customer");
    const v = z
      .object({
        bookingId: uuid,
        meetingPoint: shortText(300, "Tell the driver where to meet."),
        contactPhone: z
          .string()
          .trim()
          .regex(/^\+?[0-9\s-]{8,20}$/, "Enter a phone number."),
      })
      .parse(formObject(fd));
    await setMeetingDetails(getDb(), u.id, v.bookingId, v.meetingPoint, v.contactPhone);
    revalidatePath(`/bookings/${v.bookingId}`);
    return { status: "ok", message: "Saved. Your driver can see these now." };
  } catch (err) {
    return toActionError(err, "booking");
  }
}

const handoverSchema = z.object({
  bookingId: uuid,
  stage: z.enum(["pickup", "return"]),
  conditionNote: shortText(2000, "Describe the car's condition."),
  fuelLevel: optionalText(40),
  disputed: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

async function handover(role: "customer" | "driver", fd: FormData): Promise<ActionState> {
  try {
    const u = await actor(role);
    const v = handoverSchema.parse(formObject(fd));
    await recordHandover(getDb(), { id: u.id, role }, v.bookingId, v);
    revalidatePath(
      role === "customer" ? `/bookings/${v.bookingId}` : `/driver/assignments/${v.bookingId}`,
    );
    return { status: "ok", message: "Handover recorded." };
  } catch (err) {
    return toActionError(err, "handover");
  }
}
export async function customerHandoverAction(_: ActionState, fd: FormData) {
  return handover("customer", fd);
}
export async function driverHandoverAction(_: ActionState, fd: FormData) {
  return handover("driver", fd);
}

export async function respondOfferAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const u = await actor("driver");
    const v = z
      .object({ offerId: uuid, decision: z.enum(["accept", "decline"]), reason: optionalText(300) })
      .parse(formObject(fd));
    await respondToOffer(getDb(), u.id, v.offerId, v.decision === "accept", v.reason);
    revalidatePath("/driver");
    return {
      status: "ok",
      message:
        v.decision === "accept"
          ? "Accepted. The booking is confirmed once the customer pays and our team checks it."
          : "Declined. This never counts against you.",
    };
  } catch (err) {
    return toActionError(err, "offers");
  }
}

export async function openCaseAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const role = fd.get("role") === "driver" ? "driver" : "customer";
    const u = await actor(role);
    const v = z
      .object({
        bookingId: z
          .string()
          .uuid()
          .optional()
          .or(z.literal("").transform(() => undefined)),
        kind: z.enum(["support", "safety"]),
        message: shortText(3000, "Tell us what's happening."),
      })
      .parse(formObject(fd));
    const db = getDb();
    await db
      .insert(supportCases)
      .values({ bookingId: v.bookingId ?? null, openedBy: u.id, kind: v.kind, message: v.message });
    await notify(db, await staffWith(db, "incidents.manage"), {
      title: v.kind === "safety" ? "Safety concern reported" : "New support request",
      body: v.message.slice(0, 140),
      href: "/ops/incidents",
    });
    return {
      status: "ok",
      message:
        v.kind === "safety"
          ? "Reported. Safety concerns are handled first. If anyone is in danger, call 112 now."
          : "Sent. Your Flydrive handler will reply.",
    };
  } catch (err) {
    return toActionError(err, "support");
  }
}
