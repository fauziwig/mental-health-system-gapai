# AGENTS.md

## Project Overview

This repository contains a company-owned web-based mental health assessment
system.

The current implementation is an MVP/training prototype.

The first pilot assessment is the WHO-5 Well-Being Index.

The system has two primary user roles:

- Admin / HR
- Candidate

The application is designed so that the assessment instrument and scoring
logic can be changed later without rewriting the core assessment workflow.

---

## 1. Documentation and Source of Truth

Before implementing or changing functionality, read the relevant documentation
in `docs/`.

Use the following documents according to the task:

- `docs/product/PRD.md`
  - Product requirements and MVP scope.

- `docs/product/USER-FLOWS.md`
  - User journeys and business flows.

- `docs/product/WHO5-SPEC.md`
  - WHO-5 instrument, response options, scoring, interpretation, and
    instrument-specific constraints.

- `docs/design/UI-SPEC.md`
  - UI structure, pages, components, states, and interactions.

- `docs/architecture/DOMAIN-MODEL.md`
  - Business/domain entities and relationships.

- `docs/architecture/ASSESSMENT-ENGINE.md`
  - Assessment and scoring architecture.

- `docs/architecture/SECURITY-AND-ATTEMPT.md`
  - Secure assessment links, session tokens, attempts, timer, and
    retake/security behavior.

- `docs/backend/API-SPEC.md`
  - API contracts and request/response behavior.

- `docs/database/DATABASE.md`
  - Database schema and persistence rules.

- `docs/testing`
  - For testing some service or feature or others.


### Documentation priority

When implementing a feature:

1. Explicit developer/user requirement
2. PRD
3. Instrument specification
4. Relevant technical specification
5. Existing project conventions

Do not invent requirements that are marked `TBD`.

If two documents conflict, do not silently choose one. Identify the conflict
and resolve it before implementing behavior that depends on it.

---

# 2. General Development Principles

Follow the existing project's technology, architecture, naming conventions,
and coding style.

Before changing code:

1. Inspect the existing implementation.
2. Identify the relevant module/service.
3. Read the applicable documentation.
4. Make the smallest coherent change.
5. Reuse existing project conventions.
6. Add or update tests.
7. Run relevant tests and validation.

Avoid unnecessary rewrites.

Do not introduce new dependencies when existing project functionality is
sufficient.

---

# 3. Architecture Principles

Keep these concerns separated:

- Candidate flow
- Admin / HR flow
- Assessment definition
- Instrument
- Assessment session
- Candidate
- Attempt
- Answers
- Scoring
- Interpretation
- Company branding

The generic assessment workflow must not depend directly on WHO-5.

Prefer:

```text
Assessment
    ↓
Instrument
    ↓
Items / Response Options
    ↓
Scoring Strategy
    ↓
Interpretation
    ↓
Assessment Result

```

---

# 4. Repository Workflow

All meaningful code changes should follow the repository development
workflow defined in:

`docs/development/DEVELOPMENT-WORKFLOW.md`

In general:

1. Understand the requirement.
2. Check existing issues.
3. Create or use an appropriate GitHub Issue for meaningful changes.
4. Create a dedicated branch.
5. Implement the change.
6. Add/update tests.
7. Run relevant checks.
8. Review the diff.
9. Commit the change.
10. Create a Pull Request when required.

Do not:

- modify `main` directly unless explicitly allowed;
- discard existing user changes;
- commit secrets;
- force-push shared branches;
- merge a Pull Request without authorization;
- claim tests passed when they were not executed.

If `gh` CLI is available and authenticated, prefer it for GitHub operations.

See:

`docs/development/DEVELOPMENT-WORKFLOW.md`