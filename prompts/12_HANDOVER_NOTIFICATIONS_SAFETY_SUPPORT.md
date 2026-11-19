# Phase 12 — Handover, Notifications, Safety and Support

Apply master prompt and approved SOPs.

Handover: one pickup/return session per assigned vehicle; customer and driver submit their own confirmation, notes and optional private image. Disagreement routes to handler. Vehicle change invalidates relevant prior approval. Multi-day cadence stays open until chosen. Upload validates type/size/content/checksum/private storage; don't mark complete before durable evidence.

Notifications use transactional outbox after state commit, real configured channel adapter, template version, attempt/delivery state, bounded retry/dead letter. In-app state stays authoritative. No provider means no fake “sent.”

Support: named handler on confirmed booking. Safety route is separate/high priority; don't market emergency/24-hour response until staffed. Restrict incident evidence. Routine replacement isn't safety triage. Good-faith report or refusal of unsafe work is not strike.

Test one-sided/false-actor confirmations, duplicate upload, interruption/storage outage, disagreement, safety permissions, notification outage/dead-letter recovery. Exit after operations rehearses manual fallback.
