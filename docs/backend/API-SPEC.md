# API Specification --- Mental Health Assessment System MVP

**Version:** 0.3\
**Style:** REST/JSON conceptual specification

This is an implementation contract. Exact route prefixes can be adapted
to the framework, but request/response semantics should remain
consistent.

------------------------------------------------------------------------

# 1. Conventions

Base:

``` text
/api
```

JSON:

``` text
Content-Type: application/json
```

Authentication: - Admin/HR endpoints require authenticated user
session/token. - Candidate public access starts with an opaque
assessment-session token. - Active candidate operations require the
authenticated assessment session/attempt context.

IDs: - Do not expose sequential database IDs as the sole security
mechanism. - Public assessment links use opaque random tokens.

------------------------------------------------------------------------

# 2. Common HTTP Statuses

``` text
200 OK
201 Created
400 Bad Request
401 Unauthenticated
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error
```

------------------------------------------------------------------------

# 3. Authentication --- Admin

## POST `/api/auth/login`

Request:

``` json
{
  "email": "hr@company.com",
  "password": "********"
}
```

Response:

``` json
{
  "user": {
    "id": "usr_xxx",
    "name": "HR Admin",
    "role": "hr"
  }
}
```

Authentication should use the framework's secure session/cookie or
equivalent secure mechanism.

Do not return password hashes.

------------------------------------------------------------------------

## POST `/api/auth/logout`

Response:

``` json
{
  "success": true
}
```

------------------------------------------------------------------------

# 4. Company / Branding

## GET `/api/company`

Response:

``` json
{
  "id": "cmp_xxx",
  "name": "PT Example",
  "logo_primary_url": "...",
  "logo_secondary_url": "...",
  "cover_image_url": "..."
}
```

## PUT `/api/company`

Request:

``` json
{
  "name": "PT Example"
}
```

Logo uploads may use multipart/form-data in a dedicated upload endpoint.

------------------------------------------------------------------------

# 5. Assessment Management

## GET `/api/assessments`

Response:

``` json
{
  "data": [
    {
      "id": "asm_xxx",
      "name": "WHO-5 Well-Being Assessment",
      "instrument_code": "WHO5",
      "question_count": 5,
      "duration_minutes": 10,
      "status": "active"
    }
  ]
}
```

------------------------------------------------------------------------

## POST `/api/assessments`

Request:

``` json
{
  "name": "WHO-5 Well-Being Assessment",
  "description": "Assessment kesejahteraan mental",
  "instructions": "Bacalah setiap pernyataan...",
  "instrument_id": "ins_who5",
  "duration_minutes": 10,
  "show_result_to_candidate": false,
  "allow_retake": false
}
```

Response:

``` json
{
  "id": "asm_xxx",
  "status": "draft"
}
```

------------------------------------------------------------------------

## GET `/api/assessments/{assessmentId}`

Returns assessment configuration safe for HR.

Do not expose secrets.

------------------------------------------------------------------------

## PUT `/api/assessments/{assessmentId}`

Updates draft/configuration according to authorization and versioning
rules.

Completed attempts must not be silently changed.

------------------------------------------------------------------------

## POST `/api/assessments/{assessmentId}/activate`

Response:

``` json
{
  "id": "asm_xxx",
  "status": "active"
}
```

------------------------------------------------------------------------

## POST `/api/assessments/{assessmentId}/archive`

Response:

``` json
{
  "id": "asm_xxx",
  "status": "archived"
}
```

------------------------------------------------------------------------

# 6. Instruments

## GET `/api/instruments`

Response:

``` json
{
  "data": [
    {
      "id": "ins_who5",
      "code": "WHO5",
      "name": "WHO-5 Well-Being Index",
      "version": "2024",
      "item_count": 5
    }
  ]
}
```

------------------------------------------------------------------------

## GET `/api/instruments/{instrumentId}`

Returns: - instrument metadata; - items; - response options; - scoring
metadata appropriate for HR/admin.

------------------------------------------------------------------------

# 7. Assessment Sessions

## GET `/api/assessment-sessions`

Optional filters:

``` text
assessment_id
status
```

Response:

``` json
{
  "data": [
    {
      "id": "ses_xxx",
      "name": "Recruitment Batch - 27 August 2026",
      "assessment_id": "asm_xxx",
      "position_label": "Junior Software Engineer",
      "status": "active",
      "attempt_count": 7,
      "expires_at": "2026-08-29T17:00:00Z"
    }
  ]
}
```

------------------------------------------------------------------------

## POST `/api/assessment-sessions`

Request:

``` json
{
  "assessment_id": "asm_xxx",
  "name": "Recruitment Batch - 27 August 2026",
  "description": "Candidate recruitment batch",
  "position_label": "Junior Software Engineer",
  "starts_at": null,
  "expires_at": "2026-08-29T17:00:00Z"
}
```

Response:

``` json
{
  "id": "ses_xxx",
  "name": "Recruitment Batch - 27 August 2026",
  "status": "active",
  "public_link": "https://example.com/test/opaque-token"
}
```

The raw public token should be generated with high entropy.

If the database stores a hash, do not return the hash as the public
link.

------------------------------------------------------------------------

## GET `/api/assessment-sessions/{sessionId}`

Returns session details and authorized HR information.

------------------------------------------------------------------------

## POST `/api/assessment-sessions/{sessionId}/close`

Response:

``` json
{
  "id": "ses_xxx",
  "status": "closed"
}
```

------------------------------------------------------------------------

# 8. Candidate Public Access

## GET `/api/public/assessment-sessions/{publicToken}`

Purpose: - validate link; - return safe candidate-facing session data.

Response:

``` json
{
  "session": {
    "name": "Recruitment Batch",
    "position_label": "Junior Software Engineer",
    "assessment": {
      "name": "WHO-5 Well-Being Assessment",
      "description": "..."
    },
    "company": {
      "name": "PT Example",
      "logo_primary_url": "...",
      "logo_secondary_url": "...",
      "cover_image_url": "..."
    }
  }
}
```

Do not return: - scoring configuration; - answer scores; - other
candidates; - HR notes; - database secrets.

------------------------------------------------------------------------

# 9. Candidate Start / Attempt Creation

## POST `/api/public/assessment-sessions/{publicToken}/start`

Request:

``` json
{
  "full_name": "Budi Santoso",
  "whatsapp_number": "628123456789",
  "application_platform": "glints",
  "application_platform_other": null
}
```

The position is derived from the session when configured and should not
need to be trusted from the candidate.

Response:

``` json
{
  "attempt": {
    "id": "att_xxx",
    "status": "in_progress",
    "started_at": "2026-08-27T08:00:00Z",
    "expires_at": "2026-08-27T08:10:00Z"
  }
}
```

Server actions: 1. validate public token; 2. validate session status; 3.
validate candidate fields; 4. check retake policy; 5. create/find
candidate according to product rule; 6. create attempt; 7. set server
timestamps; 8. establish candidate session authentication.

------------------------------------------------------------------------

# 10. Candidate Attempt

## GET `/api/attempts/{attemptId}`

Candidate response:

``` json
{
  "attempt": {
    "id": "att_xxx",
    "status": "in_progress",
    "started_at": "...",
    "expires_at": "...",
    "server_time": "..."
  }
}
```

Do not expose internal result data while the test is in progress.

------------------------------------------------------------------------

# 11. Get Questions

## GET `/api/attempts/{attemptId}/questions`

Response:

``` json
{
  "assessment": {
    "name": "WHO-5 Well-Being Assessment"
  },
  "questions": [
    {
      "id": "item_1",
      "number": 1,
      "text": "I have felt cheerful and in good spirits",
      "type": "likert",
      "options": [
        {"id": "opt_5", "label": "All of the time"},
        {"id": "opt_4", "label": "Most of the time"},
        {"id": "opt_3", "label": "More than half of the time"},
        {"id": "opt_2", "label": "Less than half of the time"},
        {"id": "opt_1", "label": "Some of the time"},
        {"id": "opt_0", "label": "At no time"}
      ]
    }
  ]
}
```

The candidate API must not need to receive the numeric score mapping.

The backend knows that each option corresponds to a score.

------------------------------------------------------------------------

# 12. Save Answer

## PUT `/api/attempts/{attemptId}/answers/{itemId}`

Request:

``` json
{
  "response_option_id": "opt_4"
}
```

Response:

``` json
{
  "success": true,
  "answer": {
    "item_id": "item_1",
    "response_option_id": "opt_4"
  }
}
```

Server must validate: - active candidate session; - ownership; - item
belongs to attempt assessment; - option belongs to item; - attempt
status is mutable; - server time has not exceeded expiry.

Do not accept:

``` json
{
  "score": 4
}
```

as a trusted value.

------------------------------------------------------------------------

# 13. Get Saved Answers

## GET `/api/attempts/{attemptId}/answers`

Response:

``` json
{
  "data": [
    {
      "item_id": "item_1",
      "response_option_id": "opt_4"
    }
  ]
}
```

------------------------------------------------------------------------

# 14. Submit Attempt

## POST `/api/attempts/{attemptId}/submit`

Request:

``` json
{}
```

Server: 1. authenticate attempt; 2. check status; 3. check expiry; 4.
collect accepted answers; 5. validate required responses; 6. invoke
scoring strategy; 7. store result; 8. mark attempt completed.

Response:

``` json
{
  "attempt": {
    "id": "att_xxx",
    "status": "completed",
    "completed_at": "2026-08-27T08:06:12Z"
  },
  "result": {
    "visible_to_candidate": false
  }
}
```

If candidate result visibility is enabled:

``` json
{
  "result": {
    "raw_score": 15,
    "percentage_score": 60,
    "interpretation_code": "NOT_BELOW_SUGGESTED_CUTOFF"
  }
}
```

------------------------------------------------------------------------

# 15. Expired Attempt

When:

``` text
server_now > expires_at
```

answer mutation must fail.

Possible response:

``` json
{
  "error": {
    "code": "ATTEMPT_EXPIRED",
    "message": "Assessment time has expired."
  }
}
```

HTTP:

``` text
409 Conflict
```

The backend may finalize the attempt as `expired` according to the
configured policy.

------------------------------------------------------------------------

# 16. HR Attempt List

## GET `/api/assessment-sessions/{sessionId}/attempts`

Optional query:

``` text
status
search
page
per_page
```

Response:

``` json
{
  "data": [
    {
      "id": "att_xxx",
      "candidate": {
        "name": "Budi Santoso",
        "whatsapp": "628123456789"
      },
      "position": "Junior Software Engineer",
      "application_platform": "glints",
      "status": "completed",
      "raw_score": 15,
      "percentage_score": 60,
      "interpretation_code": "NOT_BELOW_SUGGESTED_CUTOFF",
      "completed_at": "..."
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

------------------------------------------------------------------------

# 17. HR Result Detail

## GET `/api/attempts/{attemptId}/result`

Requires HR/Admin authorization.

Response:

``` json
{
  "candidate": {
    "full_name": "Budi Santoso",
    "whatsapp_number": "628123456789",
    "applied_position": "Junior Software Engineer",
    "application_platform": "glints"
  },
  "attempt": {
    "status": "completed",
    "started_at": "...",
    "completed_at": "..."
  },
  "result": {
    "raw_score": 15,
    "percentage_score": 60,
    "interpretation_code": "NOT_BELOW_SUGGESTED_CUTOFF",
    "interpretation_label": "Not below suggested cut-off"
  }
}
```

------------------------------------------------------------------------

# 18. HR Answer Detail

## GET `/api/attempts/{attemptId}/answers`

HR authorization required.

Response may include:

``` json
{
  "data": [
    {
      "question_number": 1,
      "question_text": "I have felt cheerful and in good spirits",
      "selected_option": "Most of the time"
    }
  ]
}
```

Whether HR should see item-level responses can remain a product policy
decision.

------------------------------------------------------------------------

# 19. Error Format

Use consistent errors:

``` json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields are invalid.",
    "fields": {
      "whatsapp_number": [
        "Nomor WhatsApp wajib diisi."
      ]
    }
  }
}
```

------------------------------------------------------------------------

# 20. Authorization Matrix

  Endpoint                   Candidate                HR/Admin
  ------------------------ ----------- -----------------------
  Public session info              Yes                     Yes
  Start attempt                    Yes                      No
  Own attempt                      Yes      Yes, if authorized
  Save own answer                  Yes                      No
  Submit own attempt               Yes                      No
  Assessment CRUD                   No                     Yes
  Session CRUD                      No                     Yes
  Company branding                  No                     Yes
  Other candidate result            No   Yes, authorized scope

------------------------------------------------------------------------

# 21. Idempotency / Concurrency

Critical endpoints: - start attempt; - save answer; - submit attempt.

Requirements: - duplicate submit must not create duplicate result; -
refresh must not create another attempt; - concurrent finalization must
result in one finalized result; - answer updates should converge on the
latest valid response.

Use transactions/locking supported by the selected database/framework.

------------------------------------------------------------------------

# 22. API and Scoring Separation

API controllers must not calculate WHO-5.

Correct:

``` text
POST /submit
      ↓
AttemptService
      ↓
ScoringService
      ↓
WHO5ScoringStrategy
      ↓
AssessmentResult
```

Incorrect:

``` text
Controller:
  score = q1 + q2 + q3 + q4 + q5
```

------------------------------------------------------------------------

# 23. Security Requirements

-   HTTPS in deployed environments;
-   secure cookies/session;
-   CSRF protection where applicable;
-   rate limiting;
-   authorization checks;
-   opaque public tokens;
-   server-side timer;
-   server-side score resolution;
-   no sensitive data in public session-info endpoint;
-   no candidate-to-candidate access;
-   no trust in client-supplied score;
-   safe file upload handling.

------------------------------------------------------------------------

# 24. Future Compatibility

The API should not assume WHO-5 forever.

The candidate API should conceptually operate on:

``` text
assessment
questions
response options
attempt
result
```

rather than routes such as:

``` text
/api/who5/...
```

WHO-5-specific behavior belongs to the instrument/scoring layer.
