# Database Schema --- Mental Health Assessment System MVP

The schema below is a relational design proposal. Names can be adapted
to the selected framework/ORM, but the domain separation should remain.

------------------------------------------------------------------------

## 1. Core Entities

``` text
companies
users
assessments
instruments
assessment_items
response_options
scoring_strategies
interpretation_rules
assessment_sessions
candidates
attempts
answers
assessment_results
```

------------------------------------------------------------------------

## 2. companies

``` text
companies
---------
id                  PK
name                varchar
logo_primary_path    nullable varchar
logo_secondary_path  nullable varchar
cover_image_path     nullable varchar
brand_primary_color  nullable varchar
brand_secondary_color nullable varchar
created_at
updated_at
```

Purpose: company identity and branding.

------------------------------------------------------------------------

## 3. users

``` text
users
-----
id                  PK
company_id          FK -> companies.id
name
email
password_hash
role
created_at
updated_at
```

Suggested roles for MVP:

``` text
admin
hr
```

------------------------------------------------------------------------

## 4. instruments

``` text
instruments
-----------
id                  PK
code                unique
name
version
description
instrument_type
is_active
created_at
updated_at
```

Example:

``` text
code = WHO5
name = WHO-5 Well-Being Index
version = 2024
```

------------------------------------------------------------------------

## 5. assessments

``` text
assessments
-----------
id                  PK
company_id          FK -> companies.id
instrument_id       FK -> instruments.id
name
code                nullable/unique per company
description
instructions
duration_minutes    nullable
status
show_result_to_candidate
allow_retake
created_by          FK -> users.id
created_at
updated_at
```

Status:

``` text
draft
active
archived
```

------------------------------------------------------------------------

## 6. assessment_items

``` text
assessment_items
----------------
id                  PK
assessment_id       FK -> assessments.id
item_key
question_text
question_type
display_order
is_required
metadata_json       nullable
created_at
updated_at
```

For WHO-5, question type can be represented as a generic Likert/rating
type.

The actual score mapping belongs to the response options/instrument
configuration, not the controller.

------------------------------------------------------------------------

## 7. response_options

``` text
response_options
----------------
id                  PK
assessment_item_id  FK -> assessment_items.id
label
value
score
display_order
metadata_json       nullable
```

WHO-5 example:

``` text
label = "All of the time"
value = "5"
score = 5
display_order = 1
```

and:

``` text
label = "At no time"
value = "0"
score = 0
display_order = 6
```

------------------------------------------------------------------------

## 8. scoring_strategies

``` text
scoring_strategies
------------------
id                  PK
instrument_id       FK -> instruments.id
code                unique
name
strategy_type
configuration_json
version
is_active
created_at
updated_at
```

WHO-5 example:

``` text
code = WHO5_SUM_V1
strategy_type = sum_then_multiply
configuration_json = {
  "raw_min": 0,
  "raw_max": 25,
  "percentage_multiplier": 4
}
```

------------------------------------------------------------------------

## 9. interpretation_rules

``` text
interpretation_rules
--------------------
id                  PK
instrument_id       FK -> instruments.id
scoring_strategy_id FK -> scoring_strategies.id
metric
operator
threshold
result_code
label
description
display_order
```

WHO-5 example:

``` text
metric = raw_score
operator = <
threshold = 13
result_code = BELOW_SUGGESTED_CUTOFF
```

A percentage rule may also be represented:

``` text
metric = percentage_score
operator = <
threshold = 50
result_code = BELOW_SUGGESTED_CUTOFF
```

Do not create contradictory rules. The service should define one
canonical interpretation path.

------------------------------------------------------------------------

## 10. assessment_sessions

``` text
assessment_sessions
-------------------
id                  PK
assessment_id       FK -> assessments.id
name
description
public_token_hash
starts_at            nullable
expires_at           nullable
status
created_by           FK -> users.id
created_at
updated_at
```

Public access token should preferably be stored as a secure hash, while
the plaintext token is shown only when generating the link.

Status:

``` text
draft
active
expired
closed
```

------------------------------------------------------------------------

## 11. candidates

``` text
candidates
----------
id                  PK
company_id          FK -> companies.id
full_name
whatsapp_number
applied_position
application_platform
application_platform_other nullable
created_at
updated_at
```

Do not use WhatsApp as a password/authentication credential.

------------------------------------------------------------------------

## 12. attempts

``` text
attempts
--------
id                  PK
assessment_session_id FK -> assessment_sessions.id
candidate_id          FK -> candidates.id
status
started_at
expires_at
completed_at nullable
last_activity_at nullable
session_token_hash nullable
created_at
updated_at
```

Recommended final statuses:

``` text
in_progress
completed
expired
```

A separate `not_started` record is optional. The MVP may create the
attempt only when the candidate actually starts.

------------------------------------------------------------------------

## 13. answers

``` text
answers
-------
id                  PK
attempt_id          FK -> attempts.id
assessment_item_id  FK -> assessment_items.id
response_option_id  nullable FK -> response_options.id
response_value_json nullable
score_snapshot      nullable
answered_at
created_at
updated_at
```

`score_snapshot` is useful to preserve the scoring input used for the
finalized result.

------------------------------------------------------------------------

## 14. assessment_results

``` text
assessment_results
------------------
id                  PK
attempt_id          unique FK -> attempts.id
scoring_strategy_id FK -> scoring_strategies.id
raw_score           nullable decimal
percentage_score    nullable decimal
interpretation_code nullable
interpretation_label nullable
calculation_snapshot_json
calculated_at
created_at
updated_at
```

For WHO-5:

``` text
raw_score: 0–25
percentage_score: 0–100
```

------------------------------------------------------------------------

## 15. Important Constraints

Recommended:

``` text
assessment_sessions.public_token_hash UNIQUE

assessment_results.attempt_id UNIQUE
```

For retake prevention, enforce the business rule at the service/database
layer.

Example logical rule:

``` text
same assessment_session + same candidate
cannot create another completed attempt
```

The exact uniqueness strategy may depend on whether the product later
supports explicit retakes.

------------------------------------------------------------------------

## 16. Snapshot Principle

When an attempt starts, preserve the assessment version/configuration
needed to reproduce its result.

Do not allow an HR edit to silently change the meaning of an
already-running or completed attempt.

Options: - version the assessment/instrument; or - store a snapshot of
relevant configuration on the attempt/result.

For the MVP, a JSON calculation/configuration snapshot is acceptable,
but the domain model should leave room for formal versioning later.
