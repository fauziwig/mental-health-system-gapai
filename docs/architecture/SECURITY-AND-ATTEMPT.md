# Security, Secure Links, Session Tokens, Attempts, and Timer

## 1. Terminology

These concepts are different.

### Secure Assessment Link

A public URL containing an opaque/non-guessable token used to identify
and access a particular assessment session.

Purpose:

> Which assessment session may this person access?

### Session Token

A temporary authentication/session credential established after the
candidate enters the assessment flow.

Purpose:

> Which active browser session is making this request?

### Attempt Record

A persistent database record describing one candidate's assessment run.

Purpose:

> What happened during this candidate's assessment?

They are related but must not be treated as interchangeable.

------------------------------------------------------------------------

## 2. Recommended Flow

``` text
/test/<opaque-public-token>
          ↓
Validate session
          ↓
Show candidate landing page
          ↓
Candidate enters required information
          ↓
Candidate clicks Start Assessment
          ↓
Create Attempt
          ↓
Set started_at / expires_at
          ↓
Create authenticated assessment session
          ↓
Serve questions
          ↓
Save answers
          ↓
Finalize
          ↓
Calculate result
```

------------------------------------------------------------------------

## 3. Secure Public Link

The link should contain a high-entropy random token.

Do not use predictable IDs such as:

``` text
/test/1
/test/2
/test/3
```

Prefer:

``` text
/test/7fK2mQx9...
```

The database may store a hash of the public token.

The system must validate: - token exists; - session is active; - session
has not expired; - assessment is available.

------------------------------------------------------------------------

## 4. Session Token

After the candidate starts the assessment, use the application's normal
secure session/auth mechanism.

The token should: - be unpredictable; - have limited lifetime; - be tied
to the active attempt; - not contain sensitive candidate data; - be
invalidated after completion/expiry where appropriate.

Do not use the candidate's WhatsApp number as a token.

------------------------------------------------------------------------

## 5. Attempt Creation

Create the attempt atomically when the candidate starts.

Pseudo-flow:

``` text
BEGIN TRANSACTION

validate session
validate candidate data
check retake policy

create candidate
create attempt
set started_at = server_now
set expires_at = server_now + duration

COMMIT
```

Do not let the browser decide `started_at`.

------------------------------------------------------------------------

## 6. Retake Prevention

Retake prevention must be server-side.

Do not rely on:

``` text
localStorage
cookies alone
hidden fields
frontend JavaScript
```

The server checks whether the candidate/session already has a completed
attempt.

For the MVP, a practical rule is:

``` text
one completed attempt per candidate per assessment session
```

If an explicit retake feature is later added, it should be an
intentional HR configuration rather than an accidental loophole.

------------------------------------------------------------------------

## 7. Timer

Store:

``` text
started_at
expires_at
```

on the server.

The frontend countdown is only a display.

Every answer submission/finalization request should verify:

``` text
server_now <= expires_at
```

If expired: - reject new answer mutations; - finalize the attempt
according to the configured expiry behavior; - calculate the result from
accepted answers.

------------------------------------------------------------------------

## 8. Refresh / Reopen Behavior

Refreshing the page should not create a new attempt.

The browser should recover the existing active attempt through the
authenticated session.

If the candidate loses the session and the product does not support
recovery, the server must not silently create a second attempt.

------------------------------------------------------------------------

## 9. Duplicate Submission

The submit endpoint must be idempotent or safely reject repeated
finalization.

Example:

``` text
POST /attempt/{id}/submit

if status == completed:
    return existing result / completed response

if status == expired:
    return finalized response

if status == in_progress:
    finalize once
```

------------------------------------------------------------------------

## 10. Authorization

Candidate: - can access only their own active attempt; - cannot access
HR endpoints; - cannot alter assessment definitions; - cannot alter
scores; - cannot access other candidates.

HR/Admin: - can access only company/session data allowed by role.

Never trust IDs supplied by the client without authorization checks.

------------------------------------------------------------------------

## 11. Candidate Data

Candidate data includes: - name; - WhatsApp; - applied position; -
application platform.

The product must define a later retention/deletion policy before
production use.

For MVP, keep data collection limited to requested fields.

------------------------------------------------------------------------

## 12. Security Baseline

Use framework-standard: - password hashing; - CSRF protection where
applicable; - input validation; - authorization middleware/policies; -
rate limiting on public endpoints; - secure cookies; - HTTPS in deployed
environments; - output escaping; - file upload validation for company
logos/images.

Do not implement custom cryptography when framework/library primitives
are available.
