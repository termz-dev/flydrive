/**
 * Draft service catalogue from PRD §5. Every package is offered driver-only or as car + driver
 * (ADR 0002). Names and shapes come from the Flydrive working draft.
 * Hours, rest/breaks, cut-offs and rates are OPEN (docs/OPEN_QUESTIONS.md) and are deliberately
 * absent: there is no price or hours field to fill in by accident. When Product/Finance approve
 * values, they arrive through versioned price rules (Phase 3/6), not by editing this file.
 */
export type PackageSlug = "half-day" | "full-day" | "weekly" | "monthly" | "weekend" | "custom";

export interface ServicePackage {
  slug: PackageSlug;
  name: string;
  summary: string;
  description: string[];
  suitedTo: string[];
  /** Plain-language list of details still being finalised; shown publicly. */
  beingFinalised: string[];
}

export const SERVICE_PACKAGES: readonly ServicePackage[] = [
  {
    slug: "half-day",
    name: "Half-day",
    summary: "A vetted driver for part of a day.",
    description: [
      "For a single block of errands, appointments or an event where you would rather not drive yourself.",
      "The driver comes to your agreed pickup point — in your car, or with a car we arrange — for the booked period.",
    ],
    suitedTo: ["Appointments and errands", "Short events", "A trial before a longer booking"],
    beingFinalised: ["Exact number of hours", "Start-time window", "Pricing"],
  },
  {
    slug: "full-day",
    name: "Full-day",
    summary: "A vetted driver for a full working day.",
    description: [
      "For a full day of movement — meetings, family commitments, shopping or an occasion.",
      "You tell us the duties and itinerary when you request, so the driver knows what the day involves before accepting.",
    ],
    suitedTo: ["Business days with several stops", "Weddings and occasions", "Visiting family"],
    beingFinalised: ["Exact hours and breaks", "Overtime handling", "Pricing"],
  },
  {
    slug: "weekly",
    name: "Weekly",
    summary: "The same driver for six working days.",
    description: [
      "For a week of regular driving — school runs, commuting or a busy work week.",
      "A weekly booking covers six working days with a rest day.",
    ],
    suitedTo: ["School and work routines", "Temporary cover while your usual driver is away"],
    beingFinalised: ["Daily hours", "Which day is the rest day", "Pricing"],
  },
  {
    slug: "monthly",
    name: "Monthly or longer",
    summary: "Longer-term driving, with daily resumption or a live-in arrangement.",
    description: [
      "For households or professionals who need a dependable driver for a month or more.",
      "The driver either resumes daily at your location or, where agreed, lives in.",
    ],
    suitedTo: ["Ongoing household driving", "Executives and frequent travellers"],
    beingFinalised: ["How a month is defined", "Live-in terms", "Rest days", "Pricing"],
  },
  {
    slug: "weekend",
    name: "Weekend",
    summary: "A driver from Friday through to Monday morning.",
    description: [
      "For weekends packed with events, travel or family visits.",
      "The booking runs from Friday until Monday morning.",
    ],
    suitedTo: ["Weekend events", "Short trips", "Hosting visitors"],
    beingFinalised: ["Friday start and Monday cut-off times", "Pricing"],
  },
  {
    slug: "custom",
    name: "Custom request",
    summary: "Something different? Our operations team will look at it and quote.",
    description: [
      "For needs that don't fit a standard package — unusual hours, several vehicles, or longer trips.",
      "Custom requests are reviewed and quoted by our operations team. Nothing is confirmed until you accept a quote and a driver accepts the assignment.",
    ],
    suitedTo: ["Multi-vehicle needs", "Interstate trips", "Irregular schedules"],
    beingFinalised: ["Quote turnaround time", "Quote validity period"],
  },
] as const;

export function getPackage(slug: string): ServicePackage | undefined {
  return SERVICE_PACKAGES.find((p) => p.slug === slug);
}
