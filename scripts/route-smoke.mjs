// Starts the production server, requests every route, and checks status codes, one <h1>,
// a unique <title>, a meta description on public pages, and that every internal link resolves.
// Usage: pnpm build && pnpm test:routes
import { spawn } from "node:child_process";

const PORT = process.env.SMOKE_PORT ?? "3123";
const BASE = `http://127.0.0.1:${PORT}`;

const PUBLIC = [
  "/",
  "/services",
  "/how-it-works",
  "/trust-and-safety",
  "/locations/lagos",
  "/locations/ibadan",
  "/for-visitors",
  "/drivers",
  "/drivers/apply",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/services/half-day",
  "/services/full-day",
  "/services/weekly",
  "/services/monthly",
  "/services/weekend",
  "/services/custom",
  "/services/car-and-driver",
];
const PORTAL = [
  "/account",
  "/bookings/new",
  "/bookings/abc",
  "/bookings/abc/payment",
  "/bookings/abc/handover",
  "/support",
  "/driver",
  "/driver/onboarding",
  "/driver/availability",
  "/driver/offers/abc",
  "/driver/assignments/abc",
  "/ops",
  "/ops/bookings",
  "/ops/bookings/abc",
  "/ops/drivers",
  "/ops/drivers/abc",
  "/ops/payments",
  "/ops/incidents",
  "/ops/audit",
];
const NOT_FOUND = ["/does-not-exist", "/services/helicopter"];

const server = spawn("pnpm", ["exec", "next", "start", "-p", PORT], { stdio: "ignore" });
const failures = [];
const fail = (m) => failures.push(m);

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${BASE}/api/health`)).ok) return;
    } catch {
      // server not listening yet; retry below
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

const count = (html, re) => (html.match(re) ?? []).length;
const titleOf = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";

try {
  await waitUp();
  const titles = new Map();
  const links = new Set();

  for (const route of [...PUBLIC, ...PORTAL]) {
    const res = await fetch(BASE + route);
    const html = await res.text();
    if (res.status !== 200) fail(`${route}: status ${res.status}`);
    if (count(html, /<h1[\s>]/g) !== 1) fail(`${route}: expected exactly one <h1>`);
    if (!res.headers.get("x-correlation-id")) fail(`${route}: missing correlation header`);
    if (!html.includes('<html lang="en-NG"')) fail(`${route}: missing lang`);
    const title = titleOf(html);
    if (!title) fail(`${route}: missing <title>`);
    if (PUBLIC.includes(route)) {
      if (titles.has(title))
        fail(`${route}: duplicate title "${title}" (also ${titles.get(title)})`);
      titles.set(title, route);
      if (!/<meta name="description" content="[^"]{30,}/.test(html))
        fail(`${route}: weak/missing description`);
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        if (!m[1].startsWith("/_next")) links.add(m[1]);
      }
    } else if (!/<meta name="robots" content="noindex, nofollow"/.test(html)) {
      fail(`${route}: portal page should be noindex`);
    }
  }

  for (const route of NOT_FOUND) {
    const res = await fetch(BASE + route);
    if (res.status !== 404) fail(`${route}: expected 404, got ${res.status}`);
  }

  for (const link of links) {
    const res = await fetch(BASE + link, { redirect: "manual" });
    if (res.status !== 200) fail(`internal link ${link}: status ${res.status}`);
  }

  const health = await (await fetch(`${BASE}/api/health`)).json();
  if (health.status !== "ok") fail("health not ok");
  const ready = await fetch(`${BASE}/api/ready`);
  if (ready.status !== 200) fail(`ready: status ${ready.status}`);

  console.log(
    `checked ${PUBLIC.length} public, ${PORTAL.length} portal, ${NOT_FOUND.length} not-found routes, ${links.size} internal links`,
  );
} catch (err) {
  fail(String(err));
} finally {
  server.kill();
}

if (failures.length) {
  console.error("FAILURES:\n" + failures.map((f) => " - " + f).join("\n"));
  process.exit(1);
}
console.log("route smoke: all checks passed");
