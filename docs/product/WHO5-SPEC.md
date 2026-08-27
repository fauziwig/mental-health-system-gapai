# WHO-5 Instrument Specification

**Instrument:** The World Health Organization-Five Well-Being Index
(WHO-5)\
**Source document:** WHO, 2024, supplied in this project\
**Status:** Pilot instrument

------------------------------------------------------------------------

## 1. Scope

This document defines the instrument-specific behavior for WHO-5.

The application must keep this specification separate from the generic
assessment engine.

------------------------------------------------------------------------

## 2. Recall Period

The candidate is asked to indicate which response is closest to how they
have been feeling **over the last two weeks**.

Higher numbers mean better well-being.

------------------------------------------------------------------------

## 3. Items

The official supplied WHO document contains these five statements:

1.  `I have felt cheerful and in good spirits`
2.  `I have felt calm and relaxed`
3.  `I have felt active and vigorous`
4.  `I woke up feeling fresh and rested`
5.  `My daily life has been filled with things that interest me`

Do not silently replace, add, remove, or rewrite these items while
calling the assessment WHO-5.

------------------------------------------------------------------------

## 4. Response Options

Each item uses six response options:

    Score Response
  ------- ----------------------------
        5 All of the time
        4 Most of the time
        3 More than half of the time
        2 Less than half of the time
        1 Some of the time
        0 At no time

Important implementation rule:

`At no time` = `0`, not `1`.

------------------------------------------------------------------------

## 5. Example

The supplied WHO document gives the example that if a person has felt
cheerful and in good spirits more than half of the time during the last
two weeks, they select number 3.

------------------------------------------------------------------------

## 6. Raw Score

``` text
raw_score = Q1 + Q2 + Q3 + Q4 + Q5
```

Range:

``` text
0–25
```

The supplied WHO document describes 0 as worst possible mental
well-being and 25 as best possible mental well-being.

------------------------------------------------------------------------

## 7. Percentage Score

``` text
percentage_score = raw_score * 4
```

Range:

``` text
0–100
```

0 represents worst possible mental well-being and 100 represents best
possible mental well-being.

------------------------------------------------------------------------

## 8. Suggested Cut-off

The supplied WHO document states that:

``` text
percentage < 50
OR
raw score < 13
```

has been suggested as a cut-off for poor mental well-being and as an
indication for further assessment regarding the possible presence of a
mental health condition.

The application must not convert this into a diagnosis.

Recommended application status:

``` text
BELOW_SUGGESTED_CUTOFF
NOT_BELOW_SUGGESTED_CUTOFF
```

Avoid:

``` text
UNHEALTHY
DEPRESSED
FAILED
REJECT
```

------------------------------------------------------------------------

## 9. Calculation Examples

### Example A

``` text
Q1 = 4
Q2 = 3
Q3 = 4
Q4 = 1
Q5 = 3

Raw = 15
Percentage = 60
```

### Example B

``` text
Q1 = 2
Q2 = 2
Q3 = 1
Q4 = 3
Q5 = 2

Raw = 10
Percentage = 40
Status = BELOW_SUGGESTED_CUTOFF
```

------------------------------------------------------------------------

## 10. Translation Status

The supplied source is the official English WHO-5 publication.

A project-specific Indonesian translation must not be labeled as an
official WHO translation unless that has been independently verified.

If the team creates a translation, the supplied WHO document says the
translation should include the required disclaimer and the original
English edition remains the binding/authentic edition.

Therefore, for MVP implementation: - keep the source English item text
traceable; - treat Indonesian wording as a separate
translation/localization layer; - obtain HR/product approval for the
exact Indonesian wording before production use.

------------------------------------------------------------------------

## 11. Licensing / Attribution Notes

The supplied WHO publication states that the 2024 WHO-5 work is
available under CC BY-NC-SA 3.0 IGO.

The document also states: - use of the WHO logo is not permitted; - use
must not suggest WHO endorsement of a specific organization, product, or
service; - adaptations must be licensed under the same or equivalent
Creative Commons licence; - translations require the stated disclaimer.

Production/legal review should verify that the planned company use and
localization comply with the applicable license.

------------------------------------------------------------------------

## 12. No Clinical Diagnosis

WHO-5 scoring in this application is an assessment of well-being and a
screening-oriented signal.

The system must not claim to diagnose: - depression; - anxiety; -
another mental health disorder; - fitness/unfitness for employment.

Any follow-up assessment or employment decision is outside the WHO-5
scoring algorithm.
