# Assessment Engine Architecture

## 1. Purpose

The assessment engine is responsible for running different assessment
instruments without coupling the application workflow to a specific
test.

WHO-5 is the first implementation.

------------------------------------------------------------------------

## 2. Separation of Concerns

``` text
Application Layer
│
├── Candidate Flow
├── Admin/HR
├── Sessions
├── Attempts
├── Timer
└── Branding
        │
        ▼
Assessment Domain
│
├── Instrument
├── Items
├── Response Options
├── Scoring Strategy
└── Interpretation Rules
```

------------------------------------------------------------------------

## 3. Generic Assessment Flow

``` text
Assessment Session
      ↓
Attempt
      ↓
Load assessment definition
      ↓
Collect responses
      ↓
Finalize attempt
      ↓
Scoring Strategy
      ↓
Interpretation
      ↓
Assessment Result
```

------------------------------------------------------------------------

## 4. Instrument Abstraction

Conceptual interface:

``` text
Instrument
- getItems()
- getResponseOptions(item)
- getScoringStrategy()
- getInterpretationStrategy()
```

The exact class/interface syntax depends on the framework.

------------------------------------------------------------------------

## 5. Scoring Abstraction

Conceptual interface:

``` text
ScoringStrategy
- calculate(attemptAnswers)
```

Expected result:

``` json
{
  "rawScore": 15,
  "percentageScore": 60,
  "interpretationCode": "NOT_BELOW_SUGGESTED_CUTOFF"
}
```

Do not put WHO-5 scoring formulas directly inside: - controllers; -
routes; - Blade/React/Vue templates; - candidate pages; - database
models that are otherwise generic.

------------------------------------------------------------------------

## 6. WHO-5 Strategy

Example:

``` text
WHO5ScoringStrategy
```

Algorithm:

``` text
raw = sum(scores of 5 answers)
percentage = raw * 4
```

Interpretation:

``` text
if raw < 13:
    BELOW_SUGGESTED_CUTOFF
else:
    NOT_BELOW_SUGGESTED_CUTOFF
```

The algorithm must be unit-tested with boundary values.

------------------------------------------------------------------------

## 7. Boundary Tests

Minimum tests:

``` text
all 0
=> raw 0
=> percentage 0
=> below cut-off

12 total
=> raw 12
=> percentage 48
=> below cut-off

13 total
=> raw 13
=> percentage 52
=> not below cut-off

25 total
=> raw 25
=> percentage 100
=> not below cut-off
```

------------------------------------------------------------------------

## 8. Future Instruments

The architecture should allow:

``` text
WHO5ScoringStrategy
OtherInstrumentScoringStrategy
CustomScoringStrategy
```

without changing:

``` text
CandidateController
AttemptService
SessionService
Candidate UI
Admin session UI
```

------------------------------------------------------------------------

## 9. Assessment Versioning

An assessment should be treated as a versioned definition.

If HR changes: - questions; - response options; - scoring
configuration; - interpretation rules;

a new version should be considered for production usage.

Completed attempts must remain reproducible using the configuration that
was active when the attempt was finalized.

------------------------------------------------------------------------

## 10. Do Not Over-Generalize the MVP

Do not build a large plugin system just to support hypothetical future
requirements.

The minimum useful abstraction is:

``` text
Assessment
Instrument
Items
Response Options
Scoring Strategy
Interpretation
```

Implement only what the current MVP needs, while keeping those
boundaries clean.
