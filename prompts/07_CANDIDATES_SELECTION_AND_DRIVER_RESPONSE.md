# Phase 7 — Candidates, Selection and Driver Response

Apply master prompt. Implement eligible candidate list and explicit two-sided choice. Candidates meet approved skills/preferences, availability and no confirmed overlap. No promise without actual availability evidence.

Pre-payment API exposes only first name, blurred photo (or approved safe placeholder), years experience, accurate training status (`Pending` during pilot). Enforce in API/data mapper, not only UI. Customer selection creates expiring driver offer with immutable assignment detail version; no payment/confirmation. Driver sees full duties, dates, vehicle, passengers, pickup, schedule, accommodation/expense terms before accepting.

Accept/decline requires addressed authenticated driver. Recheck eligibility, expiry, terms version and overlap inside transaction. Concurrent accept has one winner. Decline/unavailable returns customer to alternatives without charge. Never silently substitute. No candidates -> honest ops/no-availability state.

Test direct access to hidden profile fields, replay, expiry, concurrent offers, changed request, driver suspension, decline. Exit with selection/acceptance/confirmation as distinct persisted states.
