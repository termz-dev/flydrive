# Security and Privacy Requirements

**Status:** Engineering baseline, not a compliance certificate or legal advice. Obtain Nigerian privacy/legal review before production screening or sensitive-data processing.

## Data classes

Public: approved service copy/locations. Personal: name, contact, account and booking. Restricted: identity/licence evidence, guarantor details, background-screening outcomes, vehicle authorization proof, handover photos/notes, support/safety reports. Financial: amount/currency/provider references. Secret: auth/provider/webhook/storage keys. Never store payment PAN/CVV.

## Required controls

- Managed identity; MFA for staff; least privilege; session revocation. Authorization server-side on every object and sensitive field. IDs are not permissions.
- Separate sensitive verification records from public profile. Prefer provider reference/status over raw files. Encrypt transport/storage, restrict reviewers, audit sensitive reads/exports.
- Record purpose, notice version, source/reference, status, check/expiry time, reviewer and reason. Pending/unavailable/rejected/expired are distinct; no silent recheck/adverse result.
- Screening sources, lawful basis, criteria, appeal/fallback, retention/deletion/expiry and guarantor instrument remain OPEN. No face template, NIN reuse or raw document retention without documented necessity and legal approval.
- Uploads: allowlisted formats/sizes, content sniffing, malware scan where available, randomized object keys, short-lived scoped access, checksum, private bucket and safe rendering.
- Webhooks: signature, time window, unique event ID, replay protection and key rotation.
- No PII or secrets in logs, errors, URLs, analytics, test snapshots or coding-agent prompts. Do not copy production data to dev; use synthetic fixtures.
- No GPS collection in pilot. Future tracking requires separate purpose, consent, access and retention review plus ADR.
- Privacy incidents, staff misuse, lost credentials and account takeover have named runbooks.

## Threat checklist

Account takeover (step-up, rate limit, revoke); cross-user leak (scope queries and negative tests); insider export (least privilege, reason, audit/alert); fake payment callback (signature/inbox/reconcile); duplicate charge/refund (provider idempotency); malicious upload (validation/private storage); screening misuse (purpose-bound review/appeal); false booking state (transactional guard/evidence-based UI).

## Data inventory and retention

Before collection, identify each field's purpose, legal basis, owner, classification, access, vendor, location, retention/deletion and audit. Do not invent retention periods. Legal owner approves before enabling. Deletion jobs are resumable and report counts/errors without underlying values. Legal hold needs scope, owner and expiry.
