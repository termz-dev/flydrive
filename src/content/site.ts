/**
 * Values the design shows as [PLACEHOLDER] (design/DESIGN_HANDOFF.md §6). Every one is OPEN until the
 * owner approves it (docs/OPEN_QUESTIONS.md, ADR 0002). `null` means "not approved": pages show
 * honest "to be confirmed" copy instead of inventing a value. Set a value here once it is decided.
 */

/** Public support hours, e.g. "Mon–Sat, 08:00–20:00". */
export const SUPPORT_HOURS: string | null = null;

/** Payment methods customers can use (Paystack channels approved by Finance). */
export const PAYMENT_METHODS: string | null = null;

/** When drivers are paid after an assignment. */
export const DRIVER_PAYOUT_TIMING: string | null = null;

/** Car + driver commercial terms (ADR 0002, still OPEN). */
export const CAR_AND_DRIVER_TERMS: { fuel: string | null; deposit: string | null } = {
  fuel: null,
  deposit: null,
};

/** Vehicle classes for car + driver. Capacity stays null until the fleet is confirmed. */
export const VEHICLE_CLASSES: readonly {
  key: "saloon" | "suv" | "minivan";
  name: string;
  use: string;
  passengers: number | null;
}[] = [
  { key: "saloon", name: "Saloon", use: "City meetings and errands.", passengers: null },
  { key: "suv", name: "SUV", use: "Comfort, luggage and longer trips.", passengers: null },
  { key: "minivan", name: "Minivan", use: "Families, groups and events.", passengers: null },
];

/**
 * Example pickup areas. The final service area is set by operations; pages label these as
 * examples and every request is checked by hand.
 */
export const EXAMPLE_AREAS: Record<"lagos" | "ibadan", readonly string[]> = {
  lagos: ["Victoria Island", "Ikoyi", "Lekki", "Ajah", "Ikeja", "Surulere", "Yaba", "Magodo"],
  ibadan: [
    "Bodija",
    "Jericho",
    "Ring Road",
    "Challenge",
    "Agodi",
    "Oluyole",
    "Akobo",
    "UI / Agbowo",
  ],
};

/** Team members shown on /about. Empty until real people and photos are approved. */
export const TEAM: readonly { name: string; role: string; photo: string }[] = [];

export function tbc(value: string | null, fallback = "to be confirmed"): string {
  return value ?? fallback;
}
