# PRD --- Mental Health Assessment System MVP

**Version:** 0.2\
**Status:** Baseline MVP / Training Prototype\
**Primary pilot instrument:** WHO-5 Well-Being Index

------------------------------------------------------------------------

## 1. Product Overview

A web-based assessment system for company use. HR/Admin can configure an
assessment session, provide candidates with a secure access link,
collect required candidate information, run an assessment with a time
limit, and review the resulting score.

WHO-5 is the first pilot instrument.

The product architecture must remain generic enough to support another
assessment or scoring strategy later.

------------------------------------------------------------------------

## 2. Background

Management requested a trial system in collaboration with HR. The
initial brief did not definitively establish whether the assessment will
be used for recruitment candidates, existing employees, or both.
Therefore the MVP must support the recruitment-oriented candidate
information requested by HR, while keeping the product wording and
domain model generic enough for later clarification.

------------------------------------------------------------------------

## 3. Goals

### MVP goals

-   Provide an online assessment experience in Chrome on office/desktop
    computers.
-   Give candidates a branded company experience.
-   Collect required candidate/recruitment information.
-   Run the first pilot using WHO-5.
-   Enforce a reasonable configurable time limit.
-   Prevent unrestricted retakes.
-   Store answers and results for HR.
-   Give HR/Admin a result-review interface.
-   Keep assessment instruments and scoring logic separate from the core
    workflow.

### Non-goals

-   Clinical diagnosis.
-   Automatic diagnosis of depression or another mental health
    condition.
-   Automatic candidate rejection.
-   A generic psychological testing platform with every possible
    question type.
-   Webcam proctoring or screen recording in the MVP.
-   ATS/WhatsApp integration in the MVP.
-   AI-based interpretation in the MVP.

------------------------------------------------------------------------

## 4. Users

### Admin / HR

Can: - authenticate; - manage company branding; - create/manage
assessments; - create/manage assessment sessions; - select/configure an
instrument; - set duration; - generate/access candidate assessment
links; - view candidate attempts; - view scores and interpretation; -
inspect answer-level details when permitted by the product policy.

### Candidate

Can: - open the assessment link; - see company identity; - read
assessment instructions; - submit required information; - start the
assessment; - answer questions; - submit before timeout; - receive a
completion confirmation.

------------------------------------------------------------------------

## 5. Candidate Information

Required:

1.  Full name.
2.  WhatsApp number used during the recruitment session.
3.  Applied position.
4.  Application platform.

### Position rule

The applied position should preferably be provided by HR/session
configuration and displayed as read-only to the candidate. This
preserves the requirement that it matches the vacancy wording exactly.

### Application platform

Initial options: - Glints - Pintarnya - LinkedIn - JobStreet - Kalibrr -
Indeed - Company Website - Referral - Other

If `Other` is selected, show an additional text field.

Email is **not an MVP field** because it was not part of the requested
candidate information.

------------------------------------------------------------------------

## 6. Candidate Flow

``` text
Secure Assessment Link
        ↓
Company Branding + Assessment Information
        ↓
Instructions
        ↓
Candidate Information
        ↓
Consent / acknowledgement (if enabled by HR)
        ↓
Start Assessment
        ↓
Attempt Created + Timer Starts
        ↓
WHO-5 Questions
        ↓
Submit / Timeout
        ↓
Scoring Engine
        ↓
Result Stored
        ↓
Completion Page
```

The timer starts only when the candidate starts the assessment, not
while they are reading the landing page or filling candidate
information.

------------------------------------------------------------------------

## 7. WHO-5 MVP

The first instrument is the World Health Organization-Five Well-Being
Index (WHO-5).

The supplied official WHO document defines five statements, a two-week
recall period, six response options scored 0--5, a raw score of 0--25,
and a percentage score obtained by multiplying the raw score by four.

See `WHO5-SPEC.md` for the instrument-specific rules.

------------------------------------------------------------------------

## 8. Assessment Configuration

### Required MVP configuration

-   Assessment name.
-   Description/instructions.
-   Instrument.
-   Duration.
-   Active/inactive/draft status.
-   Candidate result visibility.
-   Candidate retake policy.

### Not required for WHO-5 MVP

-   Pass/fail score.
-   Weighted competency categories.
-   Randomized answer options.
-   Randomized question order.
-   Proctoring.
-   Webcam snapshots.
-   Tab-switch enforcement.

These may become generic future features, but should not be forced into
the WHO-5 implementation.

------------------------------------------------------------------------

## 9. Assessment Session

An Assessment is the reusable test definition.

An Assessment Session is a concrete HR-created run of an assessment for
a group or recruitment process.

Example:

``` text
Assessment:
WHO-5 Well-Being Assessment

Session:
Recruitment Batch — 27 August 2026
```

A session may have multiple candidate attempts.

------------------------------------------------------------------------

## 10. Secure Access

Each session has a secure, non-guessable public access token/link.

Example concept:

``` text
/test/<opaque-session-token>
```

The public link identifies the session. It is not itself the candidate's
long-lived authentication credential.

After the candidate is admitted and starts the test, the server creates
an attempt and establishes a session/authentication token for the
candidate's active browser session.

See `SECURITY-AND-ATTEMPT.md`.

------------------------------------------------------------------------

## 11. Attempt

An attempt is the persistent database record of one candidate's actual
assessment run.

Minimum states:

``` text
not_started
in_progress
completed
expired
```

An attempt stores: - candidate; - session; - start time; - expiry
time; - completion time; - status; - answers; - result.

The database record, not localStorage and not a browser timer, is the
source of truth for completion and retake prevention.

------------------------------------------------------------------------

## 12. Timer

The duration is configurable at the assessment/session level.

The server stores:

``` text
started_at
expires_at
```

The frontend displays a countdown.

When the deadline is reached: - the UI may auto-submit; - the server
must reject late modifications; - the attempt is finalized as `expired`
or another explicitly defined final status; - scoring uses the answers
accepted by the server.

For the MVP, a reasonable default may be configured by the
implementation team for testing, but the duration must remain
configurable and must not be presented as a WHO-5 standard.

------------------------------------------------------------------------

## 13. Branding

Company branding must be configurable by Admin.

MVP: - company name; - primary logo; - secondary logo; - optional
company cover/image.

The candidate landing page should visibly communicate that the
assessment is provided by the company.

Do not use the WHO logo as company branding.

------------------------------------------------------------------------

## 14. HR Result View

HR should be able to see:

-   candidate name;
-   WhatsApp number;
-   applied position;
-   application platform;
-   assessment/session;
-   attempt status;
-   started/completed/expired timestamps;
-   WHO-5 raw score;
-   WHO-5 percentage score;
-   suggested cut-off status;
-   answer details if permitted.

Use neutral interpretation language.

Do not display: - `Healthy / Unhealthy`; -
`Depressed / Not Depressed`; - `Pass / Fail`; - automatic hiring
recommendation.

------------------------------------------------------------------------

## 15. Candidate Result Visibility

Default MVP recommendation:

``` text
Candidate result visibility = OFF
```

HR can choose whether a candidate sees a completion message or a score.

If a score is shown, the UI must avoid diagnostic language.

------------------------------------------------------------------------

## 16. Success Criteria

MVP is successful when: - HR can create/select the WHO-5 assessment; -
HR can create a session; - candidate can open the secure link; -
candidate sees company branding; - candidate can provide all required
candidate information; - candidate can start the assessment; - timer
starts at start; - five WHO-5 items can be answered; - server stores the
attempt and answers; - duplicate completed attempts are prevented
according to the configured policy; - WHO-5 scoring is correct; - HR can
view the result; - the application works in current Chrome desktop
environments; - scoring/instrument code is isolated from generic
workflow code.

------------------------------------------------------------------------

## 17. Open Decisions / TBD

These are deliberately not fixed in the MVP:

-   final target: recruitment candidates, employees, or both;
-   exact assessment duration;
-   final Indonesian wording/translation;
-   whether the result is used in hiring decisions;
-   whether candidate consent/informed consent wording is mandatory;
-   whether OTP or individual candidate invitation links are needed;
-   retention/deletion policy for candidate data;
-   production privacy/legal review.

Do not silently turn these TBD items into hard requirements.
