# User Flows --- Mental Health Assessment System MVP

**Version:** 0.3

## 1. High-Level System Flow

``` text
                         ┌──────────────┐
                         │   HR / Admin  │
                         └──────┬───────┘
                                │
                         Create Assessment
                                │
                                ▼
                         Create Session
                                │
                                ▼
                       Generate Secure Link
                                │
                                ▼
                         ┌──────────────┐
                         │   Candidate  │
                         └──────┬───────┘
                                │
                         Open Secure Link
                                │
                                ▼
                       Validate Session Access
                                │
                                ▼
                       Candidate Information
                                │
                                ▼
                         Start Assessment
                                │
                                ▼
                         Create Attempt
                                │
                                ▼
                        Start Server Timer
                                │
                                ▼
                         Answer WHO-5
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  Submit                  Timeout
                    │                       │
                    └───────────┬───────────┘
                                ▼
                         Finalize Attempt
                                │
                                ▼
                         Scoring Strategy
                                │
                                ▼
                         Store Assessment
                              Result
                                │
                                ▼
                         HR Reviews Result
```

------------------------------------------------------------------------

# 2. HR Login Flow

``` text
Open Admin
   ↓
Login
   ↓
Credentials valid?
   ├── No → Show error
   └── Yes
         ↓
      Dashboard
```

Rules: - failed login does not expose whether a specific account
exists; - use framework authentication; - authenticated HR can access
only authorized company data.

------------------------------------------------------------------------

# 3. Create Assessment Flow

``` text
Assessment List
      ↓
Buat Assessment
      ↓
Informasi Dasar
      ↓
Pengaturan
      ↓
Select Instrument
      ↓
Questions
      ↓
Preview
      ↓
Validation
      ├── Failed → show errors
      └── Passed
             ↓
          Save Draft / Activate
```

For WHO-5, questions and scoring are provided by the instrument
definition.

------------------------------------------------------------------------

# 4. Create Session Flow

``` text
Assessment Detail
      ↓
Buat Sesi
      ↓
Select Assessment
      ↓
Enter Session Name
      ↓
Enter Position
      ↓
Optional Start/End
      ↓
Create
      ↓
Generate Opaque Public Token
      ↓
Session Detail
      ↓
Copy Secure Link
```

------------------------------------------------------------------------

# 5. Candidate Access Flow

``` text
Candidate receives link
          ↓
Open /test/<token>
          ↓
Server validates token
          │
     ┌────┴────┐
     │         │
   Invalid    Valid
     │         │
     ▼         ▼
 Error      Landing Page
               ↓
          Company Branding
               ↓
          Instructions
               ↓
        Candidate Information
```

------------------------------------------------------------------------

# 6. Candidate Information Flow

``` text
Landing
  ↓
Name
  ↓
WhatsApp
  ↓
Position
  ↓
Application Platform
  ↓
Optional "Other" text
  ↓
Validation
```

Position should preferably be session-defined and read-only.

------------------------------------------------------------------------

# 7. Start Assessment Flow

``` text
Candidate clicks Start
          ↓
POST /sessions/{token}/start
          ↓
Server validates:
- session
- candidate data
- retake policy
          ↓
Can start?
    ┌─────┴─────┐
   No          Yes
    │            │
    ▼            ▼
 Error       Create Attempt
                 ↓
           started_at = server time
                 ↓
           expires_at = start + duration
                 ↓
           Create active session
                 ↓
           Return assessment
```

The timer begins here.

------------------------------------------------------------------------

# 8. Answer Flow

``` text
Question displayed
      ↓
Candidate selects one option
      ↓
Save response
      ↓
Server validates:
- active attempt
- question belongs to assessment
- option belongs to question
- attempt not expired
      ↓
Save answer
      ↓
Next question
```

The client never submits a trusted score value.

------------------------------------------------------------------------

# 9. Previous Question Flow

If navigation is enabled:

``` text
Question 3
   ↓
Previous
   ↓
Question 2
   ↓
Existing answer displayed
   ↓
Candidate may change answer
```

If navigation is disabled:

``` text
Previous button is not shown
```

------------------------------------------------------------------------

# 10. Submit Flow

``` text
Candidate clicks Submit
       ↓
Confirmation
       ↓
POST /attempt/{id}/submit
       ↓
Server checks status/time
       ↓
Collect accepted answers
       ↓
Scoring Strategy
       ↓
Interpretation
       ↓
Store Result
       ↓
Mark Attempt Completed
       ↓
Completion Page
```

Double submission must not create duplicate results.

------------------------------------------------------------------------

# 11. Timeout Flow

``` text
Timer reaches zero
       ↓
Frontend requests finalization
       ↓
Server checks expires_at
       ↓
Attempt is expired/finalized
       ↓
Accepted answers are scored
       ↓
Result stored
       ↓
Candidate sees completion/expired state
```

The server remains authoritative even if the frontend timer is
manipulated.

------------------------------------------------------------------------

# 12. Refresh Flow

``` text
Candidate refreshes page
       ↓
Existing active session detected
       ↓
Load existing attempt
       ↓
Calculate remaining time from:
expires_at - server/current time
       ↓
Continue
```

Do not create another attempt.

------------------------------------------------------------------------

# 13. Reopen Link Flow

``` text
Candidate opens original public link again
       ↓
Validate session
       ↓
Check candidate/attempt eligibility
       ↓
Existing completed attempt?
     ┌──────┴──────┐
    Yes           No
     │             │
     ▼             ▼
 Block         Continue/start
```

The exact identification mechanism for a returning candidate may evolve
if OTP or individualized links are later introduced.

------------------------------------------------------------------------

# 14. HR Review Flow

``` text
Session List
    ↓
Open Session
    ↓
Candidate Attempts
    ↓
Select Candidate
    ↓
Result Detail
    ├── Candidate Data
    ├── Attempt Status
    ├── Timeline
    ├── Score
    ├── Interpretation
    └── Answers
```

------------------------------------------------------------------------

# 15. Assessment State Flow

``` text
DRAFT
  │
  │ activate
  ▼
ACTIVE
  │
  │ archive
  ▼
ARCHIVED
```

An assessment should not be edited in a way that silently changes the
meaning of completed attempts.

Prefer versioning or snapshotting.

------------------------------------------------------------------------

# 16. Session State Flow

``` text
DRAFT
  │
  │ publish/activate
  ▼
ACTIVE
  │
  ├── manually close
  ▼
CLOSED

ACTIVE
  │
  │ expiry time reached
  ▼
EXPIRED
```

------------------------------------------------------------------------

# 17. Attempt State Flow

``` text
             Start
               │
               ▼
         IN_PROGRESS
          │         │
       Submit     Timeout
          │         │
          ▼         ▼
      COMPLETED   EXPIRED
```

No transition back from `COMPLETED` to `IN_PROGRESS`.

------------------------------------------------------------------------

# 18. Error Flows

## Invalid Link

``` text
Open Link
   ↓
Invalid/expired
   ↓
Access unavailable
```

## Unauthorized Attempt

``` text
Attempt endpoint
   ↓
Attempt does not belong to session
   ↓
Reject
```

## Expired Attempt

``` text
Answer request
   ↓
server_now > expires_at
   ↓
Reject mutation
   ↓
Finalize/return expired state
```

## Network Failure

The UI may retry safe operations.

For answer saving: - avoid creating duplicate answers; - use idempotent
update semantics where practical.

------------------------------------------------------------------------

# 19. Future Flow Hooks

The following are intentionally not part of MVP but the flow should not
prevent them:

``` text
HR
 ↓
Create individualized invitation
 ↓
OTP/email/ATS
 ↓
Candidate
```

and:

``` text
Assessment
 ↓
Instrument A / Instrument B / Custom
 ↓
Different scoring strategy
```

These should be added later without redesigning the basic Attempt
lifecycle.
