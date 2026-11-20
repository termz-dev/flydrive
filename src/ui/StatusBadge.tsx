import { STATUS_LABEL, type BookingStatus } from "@/modules/booking/states";

const TONE: Partial<Record<BookingStatus, string>> = {
  candidates_ready: "badge-amber",
  payment_pending: "badge-amber",
  payment_review: "badge-blue",
  offer_pending: "badge-blue",
  confirmed: "badge-green",
  in_progress: "badge-green",
  completed: "badge-green",
  cancelled: "badge-red",
  no_candidate: "badge-red",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge ${TONE[status] ?? ""}`}>{STATUS_LABEL[status]}</span>;
}
