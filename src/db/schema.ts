/**
 * Flydrive database schema (Phase 3). See docs/DOMAIN_MODEL_AND_SCHEMA.md and ADR 0006.
 * Money is integer kobo. Times are timestamptz (UTC); display in Africa/Lagos.
 * Overlap rules for drivers and fleet vehicles are enforced by exclusion constraints added in a
 * hand-written migration (drizzle/0001_constraints.sql).
 */
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const ts = (name: string) => timestamp(name, { withTimezone: true });

/* ---------------------------------------------------------------- identity */

export const roleEnum = pgEnum("role", ["customer", "driver", "staff"]);

export const users = pgTable(
  "users",
  {
    id: id(),
    role: roleEnum("role").notNull(),
    /** Stored lower-cased. Required for now; phone sign-in for drivers is planned (ADR 0006). */
    email: text("email").notNull(),
    /** E.164. Unique when present so it can become a sign-in identifier. */
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    fullName: text("full_name").notNull(),
    disabledAt: ts("disabled_at"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("users_email_key").on(t.email),
    uniqueIndex("users_phone_key")
      .on(t.phone)
      .where(sql`${t.phone} is not null`),
    check("users_email_lower", sql`${t.email} = lower(${t.email})`),
  ],
);

export const staffPermissionEnum = pgEnum("staff_permission", [
  "bookings.manage",
  "drivers.review",
  "payments.verify",
  "bookings.confirm",
  "incidents.manage",
  "audit.read",
  "staff.admin",
]);

export const staffPermissions = pgTable(
  "staff_permissions",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    permission: staffPermissionEnum("permission").notNull(),
    grantedAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.permission] })],
);

export const staffMfa = pgTable("staff_mfa", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  /** AES-256-GCM encrypted TOTP secret (APP_ENCRYPTION_KEY). */
  secretEnc: text("secret_enc").notNull(),
  enabledAt: ts("enabled_at"),
  lastUsedStep: bigint("last_used_step", { mode: "number" }),
});

export const sessions = pgTable(
  "sessions",
  {
    /** SHA-256 of the cookie token; the token itself is never stored. */
    tokenHash: text("token_hash").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mfaVerifiedAt: ts("mfa_verified_at"),
    expiresAt: ts("expires_at").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").notNull(),
    at: createdAt(),
  },
  (t) => [index("rate_limits_key_at_idx").on(t.key, t.at)],
);

/* ---------------------------------------------------------------- drivers */

export const driverStatusEnum = pgEnum("driver_status", [
  "applicant",
  "under_review",
  "eligible",
  "suspended",
  "rejected",
]);
export const transmissionEnum = pgEnum("transmission", ["manual", "automatic"]);
export const cityEnum = pgEnum("city", ["lagos", "ibadan"]);
export const genderEnum = pgEnum("gender", ["female", "male", "undisclosed"]);

export const driverProfiles = pgTable("driver_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  yearsExperience: smallint("years_experience").notNull(),
  transmissions: transmissionEnum("transmissions").array().notNull(),
  cities: cityEnum("cities").array().notNull(),
  gender: genderEnum("gender").notNull().default("undisclosed"),
  status: driverStatusEnum("status").notNull().default("applicant"),
  /** Flydrive assessment has not started; every driver is "pending" in the pilot. */
  trainingStatus: text("training_status").notNull().default("pending"),
  bio: text("bio"),
  createdAt: createdAt(),
});

export const checkKindEnum = pgEnum("check_kind", [
  "identity",
  "licence",
  "guarantor",
  "background",
]);
export const checkStatusEnum = pgEnum("check_status", ["pending", "passed", "failed", "expired"]);

/** Required checks for eligibility. Background stays optional until its process exists. */
export const REQUIRED_CHECKS = ["identity", "licence", "guarantor"] as const;

export const driverChecks = pgTable(
  "driver_checks",
  {
    id: id(),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => driverProfiles.userId, { onDelete: "cascade" }),
    kind: checkKindEnum("kind").notNull(),
    status: checkStatusEnum("status").notNull().default("pending"),
    /** Reviewer's note. Never store ID numbers or document images here. */
    reviewNote: text("review_note"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: ts("reviewed_at"),
    expiresAt: ts("expires_at"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("driver_checks_driver_kind_key").on(t.driverId, t.kind)],
);

export const blockKindEnum = pgEnum("block_kind", ["unavailable", "hold", "assignment"]);

/**
 * Driver time blocks. Active blocks (released_at is null) may not overlap per driver — enforced
 * by `driver_blocks_no_overlap` (EXCLUDE USING gist). A hold is created when a driver accepts an
 * offer and lasts until payment is confirmed (becomes an assignment) or expires/fails (released).
 */
export const driverBlocks = pgTable(
  "driver_blocks",
  {
    id: id(),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => driverProfiles.userId, { onDelete: "cascade" }),
    kind: blockKindEnum("kind").notNull(),
    startsAt: ts("starts_at").notNull(),
    endsAt: ts("ends_at").notNull(),
    bookingId: uuid("booking_id"),
    holdExpiresAt: ts("hold_expires_at"),
    releasedAt: ts("released_at"),
    createdAt: createdAt(),
  },
  (t) => [
    check("driver_blocks_range", sql`${t.endsAt} > ${t.startsAt}`),
    check(
      "driver_blocks_hold_expiry",
      sql`(${t.kind} <> 'hold') or (${t.holdExpiresAt} is not null)`,
    ),
    index("driver_blocks_driver_idx").on(t.driverId),
  ],
);

/* ---------------------------------------------------------------- vehicles */

export const vehicleClassEnum = pgEnum("vehicle_class", ["saloon", "suv", "minivan"]);

/** Customer-owned vehicles (driver-only bookings). */
export const customerVehicles = pgTable("customer_vehicles", {
  id: id(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  make: text("make").notNull(),
  model: text("model").notNull(),
  colour: text("colour"),
  transmission: transmissionEnum("transmission").notNull(),
  createdAt: createdAt(),
});

/** Vehicles Flydrive can arrange for car + driver (ADR 0002). Supplier terms are still OPEN. */
export const fleetVehicles = pgTable("fleet_vehicles", {
  id: id(),
  label: text("label").notNull(),
  vehicleClass: vehicleClassEnum("vehicle_class").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  seats: smallint("seats"),
  city: cityEnum("city").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

export const fleetBlocks = pgTable(
  "fleet_blocks",
  {
    id: id(),
    vehicleId: uuid("vehicle_id")
      .notNull()
      .references(() => fleetVehicles.id, { onDelete: "cascade" }),
    kind: blockKindEnum("kind").notNull(),
    startsAt: ts("starts_at").notNull(),
    endsAt: ts("ends_at").notNull(),
    bookingId: uuid("booking_id"),
    holdExpiresAt: ts("hold_expires_at"),
    releasedAt: ts("released_at"),
    createdAt: createdAt(),
  },
  (t) => [check("fleet_blocks_range", sql`${t.endsAt} > ${t.startsAt}`)],
);

/* ---------------------------------------------------------------- bookings */

export const packageEnum = pgEnum("package", [
  "half-day",
  "full-day",
  "weekly",
  "monthly",
  "weekend",
  "custom",
]);
export const vehicleSourceEnum = pgEnum("vehicle_source", ["customer", "flydrive"]);

/** Keep in sync with src/modules/booking/states.ts (the transition table). */
export const bookingStatusEnum = pgEnum("booking_status", [
  "submitted",
  "candidates_ready",
  "offer_pending",
  "payment_pending",
  "payment_review",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_candidate",
]);

export const bookings = pgTable(
  "bookings",
  {
    id: id(),
    /** Human reference, e.g. FD-7K3Q9P. */
    ref: text("ref").notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id),
    pkg: packageEnum("package").notNull(),
    vehicleSource: vehicleSourceEnum("vehicle_source").notNull(),
    customerVehicleId: uuid("customer_vehicle_id").references(() => customerVehicles.id),
    vehicleClass: vehicleClassEnum("vehicle_class"),
    fleetVehicleId: uuid("fleet_vehicle_id").references(() => fleetVehicles.id),
    city: cityEnum("city").notNull(),
    pickupArea: text("pickup_area").notNull(),
    startsAt: ts("starts_at").notNull(),
    endsAt: ts("ends_at").notNull(),
    duties: text("duties").notNull(),
    passengers: smallint("passengers").notNull().default(1),
    overnightOutOfState: boolean("overnight_out_of_state").notNull().default(false),
    accommodationNote: text("accommodation_note"),
    prefersFemaleDriver: boolean("prefers_female_driver").notNull().default(false),
    notes: text("notes"),
    /** Short notice (< 3 days at submission): ops must review; never auto-confirmed. */
    shortNotice: boolean("short_notice").notNull(),
    status: bookingStatusEnum("status").notNull().default("submitted"),
    /** Prices are OPEN, so ops sets the amount per booking before candidates are shown. */
    quoteKobo: bigint("quote_kobo", { mode: "number" }),
    paymentDueAt: ts("payment_due_at"),
    selectedDriverId: uuid("selected_driver_id").references(() => driverProfiles.userId),
    handlerId: uuid("handler_id").references(() => users.id),
    /** Shared after confirmation only. */
    meetingPoint: text("meeting_point"),
    contactPhone: text("contact_phone"),
    version: integer("version").notNull().default(1),
    createdAt: createdAt(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("bookings_ref_key").on(t.ref),
    index("bookings_customer_idx").on(t.customerId),
    index("bookings_status_idx").on(t.status),
    check("bookings_range", sql`${t.endsAt} > ${t.startsAt}`),
    check(
      "bookings_vehicle_source",
      sql`(${t.vehicleSource} = 'customer' and ${t.customerVehicleId} is not null) or (${t.vehicleSource} = 'flydrive' and ${t.vehicleClass} is not null)`,
    ),
    check("bookings_quote_positive", sql`${t.quoteKobo} is null or ${t.quoteKobo} > 0`),
    check("bookings_passengers", sql`${t.passengers} between 1 and 20`),
  ],
);

export const candidates = pgTable(
  "candidates",
  {
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => driverProfiles.userId),
    addedBy: uuid("added_by").references(() => users.id),
    /** Set when the driver declined or let an offer lapse for this booking. */
    excludedReason: text("excluded_reason"),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.bookingId, t.driverId] })],
);

export const offerStatusEnum = pgEnum("offer_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
  "withdrawn",
]);

export const offers = pgTable(
  "offers",
  {
    id: id(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => driverProfiles.userId),
    status: offerStatusEnum("status").notNull().default("pending"),
    expiresAt: ts("expires_at").notNull(),
    respondedAt: ts("responded_at"),
    declineReason: text("decline_reason"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("offers_one_pending_per_booking")
      .on(t.bookingId)
      .where(sql`${t.status} = 'pending'`),
    index("offers_driver_idx").on(t.driverId),
  ],
);

/* ---------------------------------------------------------------- payments */

export const paymentStatusEnum = pgEnum("payment_status", [
  "initialized",
  "succeeded",
  "failed",
  "abandoned",
]);

export const payments = pgTable(
  "payments",
  {
    id: id(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id),
    provider: text("provider").notNull().default("paystack"),
    reference: text("reference").notNull(),
    amountKobo: bigint("amount_kobo", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("NGN"),
    status: paymentStatusEnum("status").notNull().default("initialized"),
    /** Provider fields we keep (no card data): channel, paid_at, gateway_response. */
    providerSummary: jsonb("provider_summary"),
    verifiedBy: uuid("verified_by").references(() => users.id),
    verifiedAt: ts("verified_at"),
    createdAt: createdAt(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("payments_reference_key").on(t.reference),
    index("payments_booking_idx").on(t.bookingId),
    check("payments_amount_positive", sql`${t.amountKobo} > 0`),
  ],
);

/** Webhook inbox: each provider event is stored once, then processed idempotently. */
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: id(),
    provider: text("provider").notNull(),
    eventKey: text("event_key").notNull(),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").notNull(),
    receivedAt: createdAt(),
    processedAt: ts("processed_at"),
    error: text("error"),
  },
  (t) => [uniqueIndex("webhook_events_key").on(t.provider, t.eventKey)],
);

/* ---------------------------------------------------------------- handover, support */

export const handoverStageEnum = pgEnum("handover_stage", ["pickup", "return"]);
export const partyEnum = pgEnum("party", ["customer", "driver"]);

export const handovers = pgTable(
  "handovers",
  {
    id: id(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    stage: handoverStageEnum("stage").notNull(),
    party: partyEnum("party").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    conditionNote: text("condition_note").notNull(),
    fuelLevel: text("fuel_level"),
    disputed: boolean("disputed").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("handovers_once").on(t.bookingId, t.stage, t.party)],
);

export const caseKindEnum = pgEnum("case_kind", ["support", "safety"]);
export const caseStatusEnum = pgEnum("case_status", ["open", "resolved"]);

export const supportCases = pgTable("support_cases", {
  id: id(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  openedBy: uuid("opened_by")
    .notNull()
    .references(() => users.id),
  kind: caseKindEnum("kind").notNull(),
  status: caseStatusEnum("status").notNull().default("open"),
  message: text("message").notNull(),
  resolution: text("resolution"),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolvedAt: ts("resolved_at"),
  createdAt: createdAt(),
});

/* ---------------------------------------------------------------- events, audit, notifications */

export const bookingEvents = pgTable(
  "booking_events",
  {
    id: id(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id").references(() => users.id),
    actorRole: text("actor_role").notNull(),
    type: text("type").notNull(),
    fromStatus: bookingStatusEnum("from_status"),
    toStatus: bookingStatusEnum("to_status"),
    data: jsonb("data"),
    createdAt: createdAt(),
  },
  (t) => [index("booking_events_booking_idx").on(t.bookingId, t.createdAt)],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    actorId: uuid("actor_id").references(() => users.id),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    data: jsonb("data"),
    createdAt: createdAt(),
  },
  (t) => [index("audit_log_created_idx").on(t.createdAt)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    href: text("href"),
    readAt: ts("read_at"),
    createdAt: createdAt(),
  },
  (t) => [index("notifications_user_idx").on(t.userId, t.createdAt)],
);

/** Outbound messages (email/SMS) written in the same transaction as the change they report. */
export const outbox = pgTable(
  "outbox",
  {
    id: id(),
    channel: text("channel").notNull(),
    recipient: text("recipient").notNull(),
    template: text("template").notNull(),
    payload: jsonb("payload").notNull(),
    status: text("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: ts("next_attempt_at").notNull().defaultNow(),
    lastError: text("last_error"),
    sentAt: ts("sent_at"),
    createdAt: createdAt(),
  },
  (t) => [index("outbox_due_idx").on(t.status, t.nextAttemptAt)],
);
