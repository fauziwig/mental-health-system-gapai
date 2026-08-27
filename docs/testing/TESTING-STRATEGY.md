# Testing Strategy

**Version:** 0.3  
**Status:** MVP / Training Prototype

---

## 1. Purpose

This document defines the testing strategy for the Mental Health Assessment
System MVP.

The purpose of testing is to verify that:

- the product requirements are implemented correctly;
- WHO-5 scoring is calculated correctly;
- candidate assessment attempts behave correctly;
- assessment timing is enforced server-side;
- retake prevention works;
- candidate and HR access are properly isolated;
- APIs behave according to the API specification;
- important UI flows work as expected;
- changes do not introduce regressions.

Testing is part of the Definition of Done.

A feature should not be considered complete merely because it appears to
work in the browser.

---

## 2. Testing Principles

## 2.1 Test Behavior

Tests should primarily verify observable behavior and business rules.

Prefer:

```text
Candidate cannot submit an answer after the attempt expires.
```

over testing an internal implementation detail such as:

AttemptService.checkExpiry() was called.

unless the internal behavior itself is the subject of the unit test.

## 2.2 Test Critical Business Rules Independently

Critical business rules should have tests that do not depend on the browser UI.

Examples:

WHO-5 scoring;
WHO-5 interpretation;
attempt state transitions;
timer validation;
retake policy.
## 2.3 Server Is the Source of Truth

The browser must never be treated as authoritative for:

score;
attempt status;
start time;
expiry time;
retake eligibility;
candidate authorization.

Tests must verify server-side behavior.

## 2.4 Security Is Part of Functional Testing

Authorization and isolation are not optional additional tests.

The following are functional requirements:

Candidate A cannot access Candidate B's attempt.
Candidate cannot access HR endpoints.
HR cannot access another company's data.
Client cannot submit an arbitrary score.

## 3. Testing Pyramid

Use a testing pyramid appropriate for the project's technology stack.

             ┌───────────────┐
             │   E2E Tests   │
             │ Critical Flow │
             └───────┬───────┘
                     │
             ┌───────┴───────┐
             │ Integration / │
             │ Feature Tests │
             └───────┬───────┘
                     │
             ┌───────┴───────┐
             │   Unit Tests   │
             │ Business Rules │
             └───────────────┘

The majority of tests should be unit and integration/feature tests.

E2E tests should focus on critical end-to-end workflows rather than testing
every possible UI interaction.

## 4. Test Levels
## 4.1 Unit Tests

Use unit tests for isolated business logic.

Priority:

P0
WHO-5 scoring;
WHO-5 interpretation;
score boundaries;
response score mapping.
P1
attempt state transition rules;
timer calculation;
validation helpers;
retake eligibility.
4.2 Integration / Feature Tests

Use integration or feature tests for:

database interaction;
authentication;
authorization;
assessment creation;
session creation;
candidate start;
answer saving;
attempt submission;
result persistence.

These tests verify that multiple application components work together.

## 4.3 End-to-End Tests

Use E2E/browser tests for critical user journeys.

Minimum E2E flow:

HR creates assessment/session
        ↓
Candidate opens secure link
        ↓
Candidate sees company branding
        ↓
Candidate fills required information
        ↓
Candidate starts assessment
        ↓
Candidate answers WHO-5
        ↓
Candidate submits
        ↓
HR views result

If E2E infrastructure is not yet available, the flow should at least be covered
by integration/feature tests.

Do not introduce a new E2E framework unless the project requires it.

## 5. Priority Levels

Tests are categorized as:

P0 — Critical

Failure blocks MVP release.

Examples:

incorrect WHO-5 score;
timer can be bypassed;
completed attempt can be restarted;
candidate can access another candidate's result;
arbitrary score can be submitted;
duplicate submission creates multiple results.
P1 — Important

Should pass before normal MVP release.

Examples:

candidate validation;
session lifecycle;
HR result page;
branding;
API validation.
P2 — Nice to Have

Can be added after core MVP functionality.

Examples:

advanced responsive testing;
detailed accessibility automation;
performance/load testing;
extensive browser matrix.

## 6. WHO-5 Testing Requirements

WHO-5 scoring must be tested independently from UI.

The scoring engine must verify:

raw_score = sum of five response scores
percentage_score = raw_score × 4

Valid raw score:

0–25

Valid percentage:

0–100

Boundary tests:

0  → 0%
12 → 48%
13 → 52%
25 → 100%

Interpretation:

raw < 13
OR
percentage < 50
→ BELOW_SUGGESTED_CUTOFF

Otherwise:

NOT_BELOW_SUGGESTED_CUTOFF

The test must not interpret this as:

PASS
FAIL
DEPRESSED
NOT DEPRESSED
HEALTHY
UNHEALTHY

## 7. Attempt Testing

The attempt lifecycle must be tested as a state machine.

IN_PROGRESS
     │
     ├── submit ──→ COMPLETED
     │
     └── timeout ─→ EXPIRED

Test invalid transitions.

Examples:

COMPLETED → IN_PROGRESS
COMPLETED → COMPLETED again
EXPIRED → IN_PROGRESS
EXPIRED → accept new answer

## 8. Timer Testing

Timer tests must use server-side time.

Test:

server_now < expires_at
→ answer accepted

and:

server_now >= expires_at
→ answer rejected

Also test that modifying the client-side countdown does not change
expires_at.

The frontend timer itself is not sufficient evidence that timing works.

## 9. Retake Testing

When retakes are disabled:

Candidate
   ↓
Start
   ↓
Complete
   ↓
Attempt again
   ↓
Rejected

Test bypass attempts through:

browser refresh;
another tab;
another browser;
localStorage removal;
client-side parameter changes;
direct API requests.

## 10. Security Testing

Minimum security test areas:

authentication;
authorization;
candidate isolation;
company isolation;
public token validation;
expired/closed session access;
attempt ownership;
score tampering;
input validation;
file upload validation.

## 11. API Testing

Each API endpoint in docs/backend/API-SPEC.md should have:

happy-path test;
validation test;
authorization test where applicable;
invalid-state test where applicable.

Critical endpoints:

POST start
PUT answer
POST submit
GET questions
GET result

## 12. UI Testing

Test important UI states:

Candidate
landing;
validation error;
start;
in progress;
answered;
unanswered;
timeout;
completion;
invalid link;
already completed.
HR
empty list;
assessment creation;
session creation;
candidate list;
result detail;
loading;
error;
unauthorized access.

## 13. Regression Testing

When changing a component, run tests related to its dependencies.

Example:

Changing:

WHO5ScoringStrategy

requires:

WHO-5 unit tests
Result tests
Submit/finalization tests
Relevant API tests

Changing:

AttemptService

requires:

Attempt lifecycle tests
Timer tests
Retake tests
Answer tests
Submit tests

Changing:

Authorization

requires:

Candidate access tests
HR access tests
Cross-candidate access tests
Cross-company access tests

## 14. Test Data Rules

Never use real candidate information.

Do not put real:

names;
WhatsApp numbers;
emails;
passwords;
personal information

into automated tests.

Use synthetic data defined in:

docs/testing/TEST-DATA.md

## 15. Test Environment

Tests should run against a dedicated test environment/database.

Do not run destructive automated tests against production data.

Test configuration should use:

APP_ENV=test

or the equivalent environment provided by the framework.

## 16. External Services

The MVP should avoid depending on external services for automated tests.

If an external service is later introduced:

mock it for unit/integration tests;
use controlled test credentials for E2E where necessary;
never expose production credentials.

##17. Definition of Done

A feature is test-complete when:

relevant unit tests exist;
relevant integration/feature tests exist;
critical E2E flow is covered where applicable;
tests pass;
edge cases are covered;
authorization/security behavior is covered;
documentation remains consistent.

If tests could not be run, the implementation must explicitly state that
limitation.

Never claim tests passed if they were not actually executed.
