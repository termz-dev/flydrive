/**
 * Booking state machine — the single source of truth for which status changes are allowed,
 * by whom (PACK_REVIEW B2/B3). Every change goes through `transition()` in ./transition.ts,
 * which updates the row only if it is still in an allowed "from" status (so two people can't
 * act on the same booking at once) and appends a booking_events row.
 */
export type BookingStatus =
  | "submitted"
  | "candidates_ready"
  | "offer_pending"
  | "payment_pending"
  | "payment_review"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_candidate";

export type Actor = "customer" | "driver" | "staff" | "system";

export type Command =
  | "ops.publish_candidates"
  | "ops.no_candidate"
  | "customer.select_driver"
  | "driver.accept"
  | "driver.decline"
  | "system.offer_expired"
  | "system.payment_succeeded"
  | "system.payment_window_expired"
  | "ops.reject_payment"
  | "ops.confirm"
  | "handover.pickup_complete"
  | "handover.return_complete"
  | "customer.cancel"
  | "ops.cancel";

interface Rule {
  from: readonly BookingStatus[];
  to: BookingStatus;
  actors: readonly Actor[];
  note: string;
}

const PRE_PAYMENT = ["submitted", "candidates_ready", "offer_pending", "payment_pending"] as const;

export const TRANSITIONS: Record<Command, Rule> = {
  "ops.publish_candidates": {
    from: ["submitted", "candidates_ready", "no_candidate"],
    to: "candidates_ready",
    actors: ["staff"],
    note: "Ops set the quote and shortlisted at least one eligible driver.",
  },
  "ops.no_candidate": {
    from: ["submitted", "candidates_ready"],
    to: "no_candidate",
    actors: ["staff"],
    note: "No suitable driver; customer is told honestly.",
  },
  "customer.select_driver": {
    from: ["candidates_ready"],
    to: "offer_pending",
    actors: ["customer"],
    note: "Selection creates an offer. It is not an assignment.",
  },
  "driver.accept": {
    from: ["offer_pending"],
    to: "payment_pending",
    actors: ["driver"],
    note: "Driver accepted the full job; a time hold is placed until the payment deadline.",
  },
  "driver.decline": {
    from: ["offer_pending"],
    to: "candidates_ready",
    actors: ["driver"],
    note: "Driver is excluded from this booking; customer chooses again.",
  },
  "system.offer_expired": {
    from: ["offer_pending"],
    to: "candidates_ready",
    actors: ["system"],
    note: "Driver didn't respond in time; treated like a decline.",
  },
  "system.payment_succeeded": {
    from: ["payment_pending"],
    to: "payment_review",
    actors: ["system"],
    note: "Paystack verified the charge; ops must still review before confirmation.",
  },
  "system.payment_window_expired": {
    from: ["payment_pending"],
    to: "candidates_ready",
    actors: ["system"],
    note: "Not paid by the deadline; hold released, driver may be offered elsewhere.",
  },
  "ops.reject_payment": {
    from: ["payment_review"],
    to: "payment_pending",
    actors: ["staff"],
    note: "Payment record doesn't check out; customer is asked to pay again.",
  },
  "ops.confirm": {
    from: ["payment_review"],
    to: "confirmed",
    actors: ["staff"],
    note: "Payment verified by a person; hold becomes the assignment.",
  },
  "handover.pickup_complete": {
    from: ["confirmed"],
    to: "in_progress",
    actors: ["system"],
    note: "Both parties recorded the pickup condition.",
  },
  "handover.return_complete": {
    from: ["in_progress"],
    to: "completed",
    actors: ["system"],
    note: "Both parties recorded the return condition.",
  },
  "customer.cancel": {
    from: PRE_PAYMENT,
    to: "cancelled",
    actors: ["customer"],
    note: "Customer cancels before paying. Paid bookings go through ops.",
  },
  "ops.cancel": {
    from: [...PRE_PAYMENT, "payment_review", "confirmed", "no_candidate"],
    to: "cancelled",
    actors: ["staff"],
    note: "Refunds for paid bookings are handled manually until the refund policy exists.",
  },
};

export function canTransition(command: Command, from: BookingStatus, actor: Actor): boolean {
  const rule = TRANSITIONS[command];
  return rule.actors.includes(actor) && rule.from.includes(from);
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  submitted: "Request received",
  candidates_ready: "Choose your driver",
  offer_pending: "Waiting for the driver",
  payment_pending: "Payment due",
  payment_review: "Checking your payment",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_candidate: "No driver available",
};

export const TERMINAL: readonly BookingStatus[] = ["completed", "cancelled"];
