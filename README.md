# Mental Health Assessment System MVP --- Documentation Pack

Version: 0.2 Status: Baseline MVP / Training Prototype

## Source of truth

This documentation pack is based on: 1. The project requirements
discussed with HR/management. 2. The UI reference screenshots supplied
for this project. 3. The WHO-5 official 2024 document supplied for the
project.

## Important product decision

WHO-5 is the **first pilot instrument**, not a permanent hard-coded
definition of the entire platform.

The application must separate: - assessment/application workflow, -
instrument/question configuration, - scoring, - interpretation, -
candidate attempts, - and company branding.

This allows future instruments or custom scoring to be introduced
without rewriting the candidate/session architecture.

## Files

-   `PRD.md` --- product requirements and scope.
-   `WHO5-SPEC.md` --- WHO-5 instrument and scoring rules.
-   `DATABASE.md` --- proposed relational database schema.
-   `ASSESSMENT-ENGINE.md` --- generic assessment/instrument/scoring
    architecture.
-   `SECURITY-AND-ATTEMPT.md` --- secure assessment link, session token,
    attempt, timer, and anti-retake behavior.
-   `UI-UX.md` --- admin and candidate UI/UX specification based on the
    supplied reference screenshots.
-   `AI-CODING-GUIDE.md` --- implementation rules and guidance for an AI
    coding assistant.

## MVP principle

Build the smallest useful system first. Do not implement advanced
features merely because the reference platform contains them.
