import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SERVICE_PACKAGES, getPackage } from "@/modules/catalog/packages";
import { FOOTER_NAV, PRIMARY_NAV, PUBLIC_ROUTES } from "@/ui/site";

const APP = path.resolve(import.meta.dirname, "../../src/app");
const pageFile = (route: string) =>
  path.join(APP, "(public)", route === "/" ? "" : route, "page.tsx");

describe("public routes", () => {
  it("covers every PRD §4 route plus car + driver (ADR 0002)", () => {
    expect([...PUBLIC_ROUTES].sort()).toEqual(
      [
        "/",
        "/about",
        "/contact",
        "/drivers",
        "/drivers/apply",
        "/faq",
        "/for-visitors",
        "/how-it-works",
        "/locations/ibadan",
        "/locations/lagos",
        "/privacy",
        "/services",
        "/services/car-and-driver",
        "/terms",
        "/trust-and-safety",
      ].sort(),
    );
  });

  it.each(PUBLIC_ROUTES)("%s has its own page file with metadata", (route) => {
    const file = pageFile(route);
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, "utf8")).toMatch(/export const metadata/);
  });

  it("every navigation link points at a real public route", () => {
    const hrefs = [...PRIMARY_NAV, ...FOOTER_NAV.flatMap((g) => g.items)].map((i) => i.href);
    for (const href of hrefs) expect(PUBLIC_ROUTES).toContain(href);
  });
});

describe("service catalogue", () => {
  it("has the six draft packages with unique slugs", () => {
    const slugs = SERVICE_PACKAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(6);
    expect(getPackage("weekend")?.name).toBe("Weekend");
    expect(getPackage("nope")).toBeUndefined();
  });

  it("contains no prices or invented hours (OPEN decisions)", () => {
    const allowedKeys = ["slug", "name", "summary", "description", "suitedTo", "beingFinalised"];
    for (const p of SERVICE_PACKAGES) {
      expect(Object.keys(p).sort()).toEqual([...allowedKeys].sort());
      const text = JSON.stringify(p);
      expect(text).not.toMatch(/₦|NGN|naira|\d+\s*(hours?|hrs?)\b/i);
    }
  });
});

describe("navigation state", () => {
  it("marks the right section as current", async () => {
    const { isCurrent, PRIMARY_NAV } = await import("@/ui/site");
    const current = (path: string) =>
      PRIMARY_NAV.filter((i) => isCurrent(path, i)).map((i) => i.label);
    expect(current("/services")).toEqual(["Services"]);
    expect(current("/services/weekly")).toEqual(["Services"]);
    expect(current("/services/car-and-driver")).toEqual(["Car + driver"]);
    expect(current("/locations/ibadan")).toEqual(["Locations"]);
    expect(current("/drivers/apply")).toEqual(["Drive with us"]);
    expect(current("/about")).toEqual([]);
  });
});
