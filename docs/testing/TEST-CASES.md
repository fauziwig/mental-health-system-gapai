# 2. `TEST-CASES.md`

Ini yang menurut saya paling penting untuk AI coding assistant, karena isinya sudah berupa **checklist konkret**.

```md
# Test Cases

**Version:** 0.3  
**Status:** MVP / Training Prototype
```

---

# 1. Test Case Format

Each test case contains:

- ID
- Priority
- Area
- Scenario
- Preconditions
- Steps
- Expected Result

Priority:

- P0 — Critical
- P1 — Important
- P2 — Nice to Have

---

# 2. WHO-5 Scoring

## TC-WHO5-001

**Priority:** P0  
**Area:** Scoring

### Scenario

All five answers have score 0.

### Input

```text
0, 0, 0, 0, 0
Expected
Raw Score = 0
Percentage = 0
Interpretation = BELOW_SUGGESTED_CUTOFF
TC-WHO5-002

Priority: P0
Area: Scoring
```

Scenario

Raw score is exactly 12.

Input

Any valid combination totaling:

12
Expected
Raw Score = 12
Percentage = 48
Interpretation = BELOW_SUGGESTED_CUTOFF
TC-WHO5-003

Priority: P0
Area: Scoring

Scenario

Raw score is exactly 13.

Input

Any valid combination totaling:

13
Expected
Raw Score = 13
Percentage = 52
Interpretation = NOT_BELOW_SUGGESTED_CUTOFF
TC-WHO5-004

Priority: P0
Area: Scoring

Scenario

All five answers have score 5.

Input
5, 5, 5, 5, 5
Expected
Raw Score = 25
Percentage = 100
Interpretation = NOT_BELOW_SUGGESTED_CUTOFF
TC-WHO5-005

Priority: P0
Area: Response Mapping

Scenario

Verify every response score.

Expected
All of the time       → 5
Most of the time      → 4
More than half        → 3
Less than half        → 2
Some of the time      → 1
At no time            → 0
TC-WHO5-006

Priority: P0
Area: Validation

Scenario

Invalid score outside 0–5 is supplied internally.

Expected

The scoring engine rejects invalid data or prevents it from entering the
calculation.

TC-WHO5-007

Priority: P0
Area: Scoring

Scenario

Only four answers are available for a completed required assessment.

Expected

The system must not silently calculate a normal final result.

The attempt should be rejected from normal completion or handled according
to the configured incomplete-attempt policy.

3. Candidate Information
TC-CAND-001

Priority: P0

Scenario

Candidate submits all required fields.

Expected

Candidate data is accepted.

TC-CAND-002

Priority: P1

Scenario

Full name is empty.

Expected

Validation error.

TC-CAND-003

Priority: P1

Scenario

WhatsApp number is empty.

Expected

Validation error.

TC-CAND-004

Priority: P1

Scenario

Application platform is empty.

Expected

Validation error.

TC-CAND-005

Priority: P1

Scenario

Application platform is Lainnya and custom value is empty.

Expected

Validation error.

TC-CAND-006

Priority: P1

Scenario

Session defines position as:

Junior Software Engineer
Expected

Candidate sees:

Junior Software Engineer

and cannot replace it with another position.

TC-CAND-007

Priority: P0

Scenario

Client attempts to change the session-defined position through a modified
request.

Expected

Server ignores/rejects the unauthorized replacement.

The stored position remains the session-defined value.

4. Assessment Session
TC-SESSION-001

Priority: P0

Scenario

HR creates a valid assessment session.

Expected

Session is created successfully.

TC-SESSION-002

Priority: P0

Scenario

Public session token is valid.

Expected

Candidate-facing session information is returned.

TC-SESSION-003

Priority: P0

Scenario

Public token is invalid.

Expected

Access is denied.

No internal database information is exposed.

TC-SESSION-004

Priority: P0

Scenario

Session has expired.

Expected

Candidate cannot start a new attempt.

TC-SESSION-005

Priority: P0

Scenario

Session is closed.

Expected

Candidate cannot start a new attempt.

5. Attempt Creation
TC-ATTEMPT-001

Priority: P0

Scenario

Eligible candidate starts an assessment.

Expected

Exactly one attempt is created.

Status:

IN_PROGRESS
TC-ATTEMPT-002

Priority: P0

Scenario

Candidate starts assessment.

Expected

Server sets:

started_at
expires_at

using server-side time.

TC-ATTEMPT-003

Priority: P0

Scenario

Candidate repeatedly clicks Start.

Expected

Only one valid active attempt exists.

TC-ATTEMPT-004

Priority: P0

Scenario

Candidate refreshes immediately after starting.

Expected

Existing attempt is recovered.

No second attempt is created.

6. Answer Saving
TC-ANSWER-001

Priority: P0

Scenario

Candidate submits a valid response option.

Expected

Answer is stored.

TC-ANSWER-002

Priority: P0

Scenario

Candidate submits an option belonging to another question.

Expected

Request rejected.

TC-ANSWER-003

Priority: P0

Scenario

Candidate submits an arbitrary score instead of a response option.

Request
{
  "score": 100
}
Expected

Server does not trust the supplied score.

TC-ANSWER-004

Priority: P0

Scenario

Candidate submits an answer after expiry.

Expected

Answer is rejected.

TC-ANSWER-005

Priority: P1

Scenario

Candidate changes an existing answer while the attempt is still active.

Expected

Latest valid answer is stored.

7. Timer
TC-TIMER-001

Priority: P0

Scenario

Current server time is before expiry.

Expected

Answer can be submitted.

TC-TIMER-002

Priority: P0

Scenario

Current server time is equal to or after expiry.

Expected

New answer mutation is rejected.

TC-TIMER-003

Priority: P0

Scenario

Candidate modifies frontend countdown using browser developer tools.

Expected

Server expiry remains unchanged.

TC-TIMER-004

Priority: P0

Scenario

Candidate changes system clock.

Expected

Server-side assessment deadline remains authoritative.

8. Submission
TC-SUBMIT-001

Priority: P0

Scenario

Candidate submits valid completed assessment.

Expected

Attempt becomes:

COMPLETED

A result is created.

TC-SUBMIT-002

Priority: P0

Scenario

Candidate clicks Submit multiple times.

Expected

Only one final result exists.

TC-SUBMIT-003

Priority: P0

Scenario

Candidate submits an already completed attempt.

Expected

No duplicate result is created.

TC-SUBMIT-004

Priority: P0

Scenario

Candidate submits after expiry.

Expected

Attempt is finalized according to expiry behavior.

No late answers are accepted.

9. Attempt State
TC-STATE-001

Priority: P0

IN_PROGRESS → COMPLETED

Expected: allowed.

TC-STATE-002

Priority: P0

IN_PROGRESS → EXPIRED

Expected: allowed on timeout.

TC-STATE-003

Priority: P0

COMPLETED → IN_PROGRESS

Expected: rejected.

TC-STATE-004

Priority: P0

EXPIRED → IN_PROGRESS

Expected: rejected.

TC-STATE-005

Priority: P0

COMPLETED → COMPLETED

Expected: idempotent / no duplicate result.

10. Retake
TC-RETAKE-001

Priority: P0

Scenario

Retake disabled.

Candidate completes an attempt and tries again.

Expected

Second attempt is rejected.

TC-RETAKE-002

Priority: P0

Scenario

Candidate clears localStorage and tries again.

Expected

Still rejected.

TC-RETAKE-003

Priority: P0

Scenario

Candidate opens the link in another browser.

Expected

Retake policy is still enforced server-side.

11. Authorization
TC-AUTH-001

Priority: P0

Candidate accesses own attempt.

Expected

Allowed.

TC-AUTH-002

Priority: P0

Candidate attempts to access another candidate's attempt.

Expected

Forbidden.

TC-AUTH-003

Priority: P0

Candidate calls HR result endpoint.

Expected

Forbidden.

TC-AUTH-004

Priority: P0

Candidate attempts to modify assessment configuration.

Expected

Forbidden.

TC-AUTH-005

Priority: P0

HR accesses authorized company data.

Expected

Allowed.

TC-AUTH-006

Priority: P0

User from Company A attempts to access Company B's data.

Expected

Forbidden.

12. HR Result
TC-RESULT-001

Priority: P0

Scenario

HR opens completed attempt.

Expected

HR sees:

candidate information;
attempt status;
raw score;
percentage;
interpretation.
TC-RESULT-002

Priority: P1

Scenario

Attempt is still in progress.

Expected

Final result is not shown as if it were complete.

TC-RESULT-003

Priority: P1

Scenario

Attempt expired.

Expected

HR sees:

EXPIRED

and the result behavior follows the configured expiry policy.

13. Candidate Result Visibility
TC-VISIBILITY-001

Priority: P1

Scenario

Candidate result visibility is disabled.

Expected

Candidate sees completion confirmation but no score.

TC-VISIBILITY-002

Priority: P1

Scenario

Candidate result visibility is enabled.

Expected

Candidate sees only the configured non-diagnostic result.

14. Branding
TC-BRAND-001

Priority: P1

Scenario

Company has primary logo.

Expected

Candidate page displays the company logo.

TC-BRAND-002

Priority: P1

Scenario

Company has two logos.

Expected

Both configured logos are displayed according to UI specification.

TC-BRAND-003

Priority: P1

Scenario

Company uploads unsupported file type.

Expected

Upload rejected.

TC-BRAND-004

Priority: P1

Scenario

Company uploads an oversized image.

Expected

Upload rejected according to configured limit.

15. UI States
TC-UI-001

Priority: P1

Candidate opens valid assessment.

Expected:

branding visible;
assessment title visible;
instructions visible;
candidate fields visible.
TC-UI-002

Priority: P1

Candidate submits invalid form.

Expected:

validation errors visible;
valid input retained.
TC-UI-003

Priority: P1

Assessment is active.

Expected:

question visible;
six WHO-5 response options visible;
timer visible.
TC-UI-004

Priority: P1

Timer expires.

Expected:

candidate is informed;
new responses cannot be accepted;
attempt is finalized according to backend state.
TC-UI-005

Priority: P1

Candidate completes assessment.

Expected:

completion confirmation visible.
16. API Error Handling
TC-API-001

Invalid request.

Expected:

422 Validation Error

with field-level errors where applicable.

TC-API-002

Unauthenticated protected request.

Expected:

401
TC-API-003

Authenticated but unauthorized request.

Expected:

403
TC-API-004

Invalid resource.

Expected:

404
TC-API-005

Expired attempt mutation.

Expected:

409

or the project's documented equivalent.

17. Regression
TC-REG-001

After changing WHO-5 scoring:

Run:

WHO-5 unit tests
Result tests
Submit tests
TC-REG-002

After changing Attempt logic:

Run:

Attempt lifecycle
Timer
Answer
Submit
Retake
TC-REG-003

After changing authorization:

Run:

Candidate authorization
HR authorization
Cross-candidate isolation
Cross-company isolation
