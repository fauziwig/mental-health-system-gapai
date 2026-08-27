# Domain Model --- Mental Health Assessment System MVP

**Version:** 0.3

## 1. Purpose

This document defines the business/domain objects and their
relationships.

It is intentionally different from `DATABASE.md`: - `DOMAIN-MODEL.md`
describes business concepts and rules. - `DATABASE.md` describes
persistence/tables.

------------------------------------------------------------------------

# 2. Core Domain

``` text
Company
  │
  ├── Users
  │
  ├── Assessments
  │       │
  │       └── Instrument
  │              │
  │              ├── Items
  │              │      │
  │              │      └── Response Options
  │              │
  │              ├── Scoring Strategy
  │              └── Interpretation Rules
  │
  └── Assessment Sessions
          │
          └── Attempts
                 │
                 ├── Candidate
                 │
                 ├── Answers
                 │
                 └── Assessment Result
```

------------------------------------------------------------------------

# 3. Company

Represents the organization using the platform.

Attributes:

``` text
id
name
branding
```

Branding:

``` text
primary logo
secondary logo
cover image
```

Rules: - company branding belongs to the company; - assessment pages use
company branding; - WHO branding is not substituted for company
branding.

------------------------------------------------------------------------

# 4. User

Represents an authenticated Admin/HR user.

Attributes:

``` text
id
company
name
email
role
```

Roles for MVP:

``` text
admin
hr
```

Rules: - user belongs to a company; - user can only manage authorized
company resources.

------------------------------------------------------------------------

# 5. Instrument

Represents a psychological/mental-health assessment instrument
definition.

Example:

``` text
WHO5
WHO-5 Well-Being Index
Version 2024
```

An instrument defines: - items; - response options; - scoring
strategy; - interpretation rules.

Important:

> Instrument is not the same thing as an Assessment Session.

------------------------------------------------------------------------

# 6. Assessment

Represents a configured reusable assessment that the company can use.

Example:

``` text
Assessment:
WHO-5 Well-Being Assessment
```

Contains: - title; - instructions; - duration; - instrument; - candidate
result visibility; - retake policy; - lifecycle status.

Relationship:

``` text
Company 1 ─── N Assessment
Assessment N ─── 1 Instrument
```

------------------------------------------------------------------------

# 7. Assessment Session

Represents a concrete execution/invitation context created by HR.

Example:

``` text
Recruitment Batch
Junior Software Engineer
August 2026
```

A session references one assessment.

It contains: - session name; - position label; - access token; -
start/end availability; - status.

Relationship:

``` text
Assessment 1 ─── N AssessmentSession
```

------------------------------------------------------------------------

# 8. Secure Public Access

The session has an opaque public access token.

Concept:

``` text
AssessmentSession
       │
       └── public_access_token
```

The token answers:

> Which session is this link for?

It does not itself represent a completed candidate attempt.

------------------------------------------------------------------------

# 9. Candidate

Represents the person taking the assessment.

MVP attributes:

``` text
full_name
whatsapp_number
applied_position
application_platform
application_platform_other
```

The candidate may exist independently of a specific attempt.

Relationship:

``` text
Candidate 1 ─── N Attempt
```

For a training MVP, candidate identity matching may remain simple.

------------------------------------------------------------------------

# 10. Attempt

Represents one actual execution of an assessment by a candidate.

Attributes:

``` text
candidate
assessment_session
status
started_at
expires_at
completed_at
```

Attempt status:

``` text
in_progress
completed
expired
```

Core rule:

> An attempt is the authoritative persistent record of a candidate's
> assessment run.

------------------------------------------------------------------------

# 11. Attempt Session Token

This is a temporary authentication context associated with an active
attempt.

Conceptually:

``` text
Public Session Link
       ↓
Start Attempt
       ↓
Attempt Session Token
       ↓
Candidate API access
```

Do not confuse:

``` text
Public Access Token
```

with:

``` text
Attempt Session Token
```

The first identifies the assessment session.

The second authenticates the active candidate interaction.

------------------------------------------------------------------------

# 12. Assessment Item

Represents one question/statement in an instrument.

Example:

``` text
I have felt cheerful and in good spirits
```

Attributes:

``` text
item_key
question_text
question_type
display_order
required
```

Relationship:

``` text
Instrument 1 ─── N Item
Item 1 ─── N ResponseOption
```

------------------------------------------------------------------------

# 13. Response Option

Represents an answer choice available for an item.

For WHO-5:

``` text
All of the time
Most of the time
More than half of the time
Less than half of the time
Some of the time
At no time
```

Each option has an instrument-defined score mapping.

The candidate selects an option.

The candidate should not be allowed to submit an arbitrary score.

------------------------------------------------------------------------

# 14. Answer

Represents a candidate's selected response to one assessment item during
one attempt.

Relationship:

``` text
Attempt 1 ─── N Answer
Item 1 ─── N Answer
```

Conceptually:

``` text
Answer
------
attempt
item
selected_response
score_snapshot
answered_at
```

The score snapshot is useful for preserving what scoring input was used
when the result was calculated.

------------------------------------------------------------------------

# 15. Scoring Strategy

Represents the algorithm used to convert answers into a result.

Conceptual interface:

``` text
ScoringStrategy
    calculate(attempt)
```

WHO-5:

``` text
WHO5_SUM_V1
```

Algorithm:

``` text
raw = sum(answer scores)
percentage = raw * 4
```

The core attempt workflow should not know the formula.

------------------------------------------------------------------------

# 16. Interpretation

Represents the meaning assigned to a calculated metric.

WHO-5 suggested interpretation:

``` text
raw < 13
OR
percentage < 50
```

Application label:

``` text
BELOW_SUGGESTED_CUTOFF
```

Otherwise:

``` text
NOT_BELOW_SUGGESTED_CUTOFF
```

This is not a diagnosis.

------------------------------------------------------------------------

# 17. Assessment Result

Represents the finalized calculated outcome of an attempt.

Attributes:

``` text
attempt
scoring_strategy
raw_score
percentage_score
interpretation_code
calculation_snapshot
calculated_at
```

Relationship:

``` text
Attempt 1 ─── 1 Result
```

The result should be immutable after finalization except through an
explicit correction/recalculation workflow.

------------------------------------------------------------------------

# 18. Aggregate Boundaries

Recommended conceptual aggregates:

## Assessment Aggregate

``` text
Assessment
 ├── Instrument reference
 ├── Configuration
 └── Version
```

## Assessment Session Aggregate

``` text
AssessmentSession
 └── access configuration
```

## Attempt Aggregate

``` text
Attempt
 ├── Answers
 └── Result
```

The Attempt aggregate owns the lifecycle of the candidate's execution.

------------------------------------------------------------------------

# 19. Important Domain Rules

## Rule 1 --- Server owns timing

``` text
started_at
expires_at
```

come from server-side state.

------------------------------------------------------------------------

## Rule 2 --- Candidate cannot change score

Candidate chooses:

``` text
response_option
```

Server resolves:

``` text
response_option → score
```

------------------------------------------------------------------------

## Rule 3 --- Completed attempt cannot reopen

``` text
COMPLETED
```

is terminal for the MVP.

------------------------------------------------------------------------

## Rule 4 --- Assessment edits cannot rewrite history

If HR changes questions or scoring, existing completed attempts must
remain reproducible.

Use: - assessment versioning; or - configuration snapshots.

------------------------------------------------------------------------

## Rule 5 --- Instrument and scoring are replaceable

This is a key architectural requirement.

The system should support:

``` text
Assessment
    ↓
Instrument A
    ↓
Scoring Strategy A
```

and later:

``` text
Assessment
    ↓
Instrument B
    ↓
Scoring Strategy B
```

without rewriting: - candidate flow; - session lifecycle; - attempt
lifecycle; - core API concepts.

------------------------------------------------------------------------

# 20. WHO-5 Domain Example

``` text
Company
└── Assessment
    └── Instrument: WHO5
        ├── Item 1
        │   └── 6 Response Options
        ├── Item 2
        ├── Item 3
        ├── Item 4
        └── Item 5
              │
              ▼
        WHO5_SUM_V1
              │
              ▼
        Assessment Result
```

------------------------------------------------------------------------

# 21. What Does NOT Belong in the Domain Model

Do not model these as core WHO-5 domain concepts:

``` text
Pass
Fail
Depressed
Healthy
Unhealthy
Fit for employment
Reject candidate
AI diagnosis
```

These are not part of the supplied WHO-5 scoring specification.

------------------------------------------------------------------------

# 22. Future Extensions

Possible future domains:

``` text
Invitation
OTP Verification
Assessment Version
Retake Policy
Audit Log
Consent Record
Notification
ATS Integration
```

They should be added when requirements become real rather than
implemented prematurely.
