/** Human labels for stored enum values. Never show raw slugs to people. */
export const PACKAGE_LABEL: Record<string, string> = {
  "half-day": "Half-day",
  "full-day": "Full-day",
  weekly: "Weekly",
  monthly: "Monthly",
  weekend: "Weekend",
  custom: "Custom",
};
export const CITY_LABEL: Record<string, string> = { lagos: "Lagos", ibadan: "Ibadan" };
export const CLASS_LABEL: Record<string, string> = {
  saloon: "Saloon",
  suv: "SUV",
  minivan: "Minivan",
};
export const TRANSMISSION_LABEL: Record<string, string> = {
  automatic: "Automatic",
  manual: "Manual",
};
export const DRIVER_STATUS_LABEL: Record<string, string> = {
  applicant: "Applicant",
  under_review: "Under review",
  eligible: "Eligible",
  suspended: "Suspended",
  rejected: "Rejected",
};
export const label = (map: Record<string, string>, v: string | null | undefined) =>
  v ? (map[v] ?? v) : "—";
