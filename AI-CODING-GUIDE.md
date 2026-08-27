# AI Coding Assistant Guide

This document is intended to be provided to an AI coding assistant
together with the other project documents.

------------------------------------------------------------------------

## 1. Priority Order

When requirements conflict, use this priority:

1.  Current project/technical constraints explicitly provided by the
    developer.
2.  `WHO5-SPEC.md` for WHO-5 instrument/scoring facts.
3.  `PRD.md` for product behavior.
4.  `SECURITY-AND-ATTEMPT.md` for security/attempt behavior.
5.  `DATABASE.md` for domain/data structure.
6.  `ASSESSMENT-ENGINE.md` for architecture.
7.  `UI-UX.md` or `UI-SPEC.md` for visual/interaction guidance.

Do not invent requirements when a point is marked TBD.

------------------------------------------------------------------------

## 2. Core Rule

Do not hard-code WHO-5 logic throughout the application.

Bad:

``` text
CandidateController.calculateWho5()
```

Bad:

``` text
if assessment.name == "WHO-5" ...
```

Preferred:

``` text
ScoringStrategy
    ↓
WHO5ScoringStrategy
```

The candidate/session workflow should remain instrument-agnostic.

------------------------------------------------------------------------

## 3. Architecture

Keep boundaries approximately like:

``` text
HTTP / Controller
      ↓
Application Service
      ↓
Domain / Assessment Engine
      ↓
Repository / ORM
```

Do not put scoring logic into controllers or templates.

------------------------------------------------------------------------

## 4. Candidate Start

Starting an assessment must be a server-side operation.

Pseudo:

``` text
validate public session token
validate session status
validate candidate fields
check retake rule
create/reuse candidate
create attempt
set started_at
set expires_at
create authenticated assessment session
return attempt context
```

Use a database transaction where multiple records must be created
consistently.

------------------------------------------------------------------------

## 5. Timer

Never trust a client-provided:

``` text
started_at
expires_at
remaining_seconds
```

The server determines the real deadline.

Frontend countdown is display-only.

------------------------------------------------------------------------

## 6. Answer Saving

Each answer request must: - authenticate the active attempt; - authorize
ownership; - validate that the question belongs to the attempt's
assessment; - validate the response option; - check the attempt is still
mutable; - check server time against expiry.

Do not accept arbitrary score values from the client.

The client sends a response selection; the server resolves the score
from the assessment definition.

------------------------------------------------------------------------

## 7. Finalization

Finalization must be safe against: - double click; - duplicate network
requests; - browser refresh; - concurrent requests.

Pseudo:

``` text
if attempt.completed:
    return existing result

if attempt.expired:
    return finalized result

lock/revalidate attempt
collect accepted answers
calculate score using strategy
store result snapshot
mark attempt completed
```

Use database locking/transaction mechanisms appropriate to the
framework.

------------------------------------------------------------------------

## 8. WHO-5 Tests

Write unit tests for:

``` text
0 => 0%
12 => 48%
13 => 52%
25 => 100%
```

And verify all six response values:

``` text
5, 4, 3, 2, 1, 0
```

Do not accidentally implement a 0--5 Likert scale.

------------------------------------------------------------------------

## 9. Important WHO-5 UI Rule

The reference screenshot says `Likert 5`, but the supplied WHO-5
document defines six response values, 0--5.

For this project:

``` text
WHO-5 = six response options / scores 0–5
```

Do not copy the reference platform's five-point setting.

------------------------------------------------------------------------

## 10. No Pass/Fail

Do not create generic code such as:

``` text
if score >= passing_score:
    passed
else:
    failed
```

for WHO-5.

Use:

``` text
interpretation_code
```

such as:

``` text
BELOW_SUGGESTED_CUTOFF
NOT_BELOW_SUGGESTED_CUTOFF
```

------------------------------------------------------------------------

## 11. No Diagnosis

Do not generate labels such as: - depression; - anxiety; - healthy; -
unhealthy; - mentally fit; - mentally unfit.

The system is not a diagnostic engine.

------------------------------------------------------------------------

## 12. No Email Dependency

The current candidate identity form does not require email.

Do not make email mandatory unless a later requirement explicitly adds
it.

------------------------------------------------------------------------

## 13. Position Field

Prefer session-provided position:

``` text
session.position_label
```

and render it read-only to the candidate.

This protects exact vacancy wording.

Do not make the candidate freely edit it unless the product requirement
changes.

------------------------------------------------------------------------

## 14. Branding

Do not hard-code company name or logos.

Use:

``` text
company.name
company.logo_primary
company.logo_secondary
company.cover_image
```

Do not use the WHO logo.

------------------------------------------------------------------------

## 15. File Uploads

For company branding uploads: - validate MIME type; - validate size; -
generate safe stored filenames; - do not trust original filename; -
store paths/references rather than arbitrary client paths; - prevent
executable file uploads.

------------------------------------------------------------------------

## 16. Public Endpoints

Public candidate endpoints should have: - rate limiting where
appropriate; - opaque tokens; - validation; - strict authorization to
the active attempt; - no exposure of other candidate data.

Do not expose database sequential IDs as the only security mechanism.

------------------------------------------------------------------------

## 17. Data Privacy

Collect only requested candidate fields in the MVP.

Do not add: - unnecessary demographic data; - webcam images; -
recordings; - location tracking; - unrelated profile data.

Retention/deletion requirements remain TBD and must not be invented.

------------------------------------------------------------------------

## 18. UI Implementation

Use `UI-UX.md` and `UI-SPEC.md`as the interaction reference.

Do not reproduce every feature visible in the reference platform.

For WHO-5 MVP: - no weighted competency categories; - no pass/fail
threshold; - no randomized answer options; - no mandatory proctoring; -
no email field.

------------------------------------------------------------------------

## 19. Code Quality

Prefer: - small services; - explicit domain names; - framework
conventions; - server-side validation; - unit tests around scoring; -
feature tests around candidate start/submit; - database transactions for
critical state changes.

Avoid: - duplicated business logic; - magic strings scattered across
controllers; - scoring formulas in frontend code; - trusting hidden form
fields; - using localStorage as security.

------------------------------------------------------------------------

## 20. Implementation Sequence

Recommended order:

### Phase 1

-   project setup;
-   authentication;
-   company profile/branding;
-   database migrations.

### Phase 2

-   instrument/assessment model;
-   seed WHO-5;
-   scoring service;
-   unit tests.

### Phase 3

-   assessment session;
-   secure public link;
-   candidate form;
-   attempt creation.

### Phase 4

-   candidate assessment UI;
-   timer;
-   answer saving;
-   finalization.

### Phase 5

-   HR result list/detail;
-   result interpretation;
-   branding preview.

### Phase 6

-   security hardening;
-   validation;
-   edge-case tests;
-   Chrome desktop testing.

------------------------------------------------------------------------

## 21. Do Not Expand Scope Automatically

If an AI coding assistant notices possible features such as: - OTP; -
WhatsApp API; - ATS; - webcam proctoring; - analytics; - AI
interpretation; - multiple assessment flows;

do not implement them unless explicitly requested.

Create a TODO or proposal instead.

------------------------------------------------------------------------

## 22. Expected MVP Deliverable

The final system should support this end-to-end path:

``` text
HR Login
  ↓
Create/Select WHO-5 Assessment
  ↓
Create Assessment Session
  ↓
Generate Secure Link
  ↓
Candidate Opens Link
  ↓
Company Branding
  ↓
Candidate Information
  ↓
Start Assessment
  ↓
Attempt + Server Timer
  ↓
5 WHO-5 Questions
  ↓
Submit/Timeout
  ↓
WHO5ScoringStrategy
  ↓
Result
  ↓
HR Dashboard
```
