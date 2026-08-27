File ini bukan sekadar contoh input. Tujuannya supaya AI punya **dataset standar** sehingga setiap kali testing tidak membuat data random yang berbeda-beda.

```md
# Test Data

**Version:** 0.3  
**Status:** MVP / Training Prototype
```

---

# 1. Purpose

This document defines synthetic test data for automated and manual testing.

All data in this document is fictional.

Never replace these values with real candidate information.

---

# 2. Company Data

## Company A

```json
{
  "id": "company_test_a",
  "name": "PT Example Teknologi",
  "logo_primary": "/test-assets/company-a-primary.png",
  "logo_secondary": "/test-assets/company-a-secondary.png"
}
```

## Company B
{
  "id": "company_test_b",
  "name": "PT Another Teknologi",
  "logo_primary": "/test-assets/company-b-primary.png",
  "logo_secondary": "/test-assets/company-b-secondary.png"
}

Company B exists primarily for authorization/isolation testing.

# 3. Admin / HR Users
HR Company A
{
  "id": "user_hr_a",
  "name": "HR Test A",
  "email": "hr-a@example.test",
  "password": "TestPassword123!"
}
Admin Company A
{
  "id": "user_admin_a",
  "name": "Admin Test A",
  "email": "admin-a@example.test",
  "password": "TestPassword123!"
}
HR Company B
{
  "id": "user_hr_b",
  "name": "HR Test B",
  "email": "hr-b@example.test",
  "password": "TestPassword123!"
}

These credentials are for test environments only.

Never use them in production.

# 4. Candidate Data
Candidate A
{
  "full_name": "Budi Test Candidate",
  "whatsapp_number": "6281100000001",
  "applied_position": "Junior Software Engineer",
  "application_platform": "glints"
}
Candidate B
{
  "full_name": "Siti Test Candidate",
  "whatsapp_number": "6281100000002",
  "applied_position": "Junior Software Engineer",
  "application_platform": "pintarnya"
}
Candidate C
{
  "full_name": "Andi Test Candidate",
  "whatsapp_number": "6281100000003",
  "applied_position": "Frontend Developer",
  "application_platform": "linkedin"
}
# 5. Application Platforms

Use the following standard values:

glints
pintarnya
linkedin
jobstreet
kalibrr
indeed
company_website
referral
other

When:

application_platform = other

test:

{
  "application_platform": "other",
  "application_platform_other": "Test Platform"
}
# 6. Assessment Data
WHO-5 Assessment
{
  "code": "WHO5_TEST",
  "name": "WHO-5 Well-Being Assessment",
  "instrument_code": "WHO5",
  "version": "2024",
  "duration_minutes": 10,
  "show_result_to_candidate": false,
  "allow_retake": false,
  "status": "active"
}
# 7. Assessment Session Data
Active Session
{
  "name": "Test Session Active",
  "position_label": "Junior Software Engineer",
  "status": "active"
}
Expired Session
{
  "name": "Test Session Expired",
  "position_label": "Junior Software Engineer",
  "status": "expired"
}
Closed Session
{
  "name": "Test Session Closed",
  "position_label": "Junior Software Engineer",
  "status": "closed"
}
# 8. WHO-5 Questions

Use the five instrument items defined in:

docs/product/WHO5-SPEC.md

For tests, use their configured IDs rather than assuming numeric database IDs.

Conceptual item keys:

WHO5_01
WHO5_02
WHO5_03
WHO5_04
WHO5_05
# 9. WHO-5 Response Options

Use these exact score mappings:

OPTION_5 → 5
OPTION_4 → 4
OPTION_3 → 3
OPTION_2 → 2
OPTION_1 → 1

Labels:

OPTION_5 = All of the time
OPTION_4 = Most of the time
OPTION_3 = More than half of the time
OPTION_2 = Some of the time
OPTION_1 = At no time

# 10. WHO-5 Scoring Fixtures
Fixture A — Minimum
{
  "answers": [1, 1, 1, 1, 1],
  "expected_raw_score": 5,
  "expected_percentage_score": 20,
  "expected_interpretation": "BELOW_SUGGESTED_CUTOFF"
}
Fixture B — Boundary Below
{
  "answers": [2, 2, 2, 3, 3],
  "expected_raw_score": 12,
  "expected_percentage_score": 48,
  "expected_interpretation": "BELOW_SUGGESTED_CUTOFF"
}
Fixture C — Boundary Above
{
  "answers": [2, 2, 3, 3, 3],
  "expected_raw_score": 13,
  "expected_percentage_score": 52,
  "expected_interpretation": "NOT_BELOW_SUGGESTED_CUTOFF"
}
Fixture D — Maximum
{
  "answers": [5, 5, 5, 5, 5],
  "expected_raw_score": 25,
  "expected_percentage_score": 100,
  "expected_interpretation": "NOT_BELOW_SUGGESTED_CUTOFF"
}
Fixture E — Typical
{
  "answers": [4, 3, 4, 1, 3],
  "expected_raw_score": 15,
  "expected_percentage_score": 60,
  "expected_interpretation": "NOT_BELOW_SUGGESTED_CUTOFF"
}
Fixture F — Low
{
  "answers": [2, 2, 1, 3, 2],
  "expected_raw_score": 10,
  "expected_percentage_score": 40,
  "expected_interpretation": "BELOW_SUGGESTED_CUTOFF"
}
# 11. Attempt Fixtures
In Progress
{
  "status": "in_progress",
  "started_at": "2026-08-27T08:00:00Z",
  "expires_at": "2026-08-27T08:10:00Z"
}
Completed
{
  "status": "completed",
  "started_at": "2026-08-27T08:00:00Z",
  "completed_at": "2026-08-27T08:05:00Z"
}
Expired
{
  "status": "expired",
  "started_at": "2026-08-27T08:00:00Z",
  "expires_at": "2026-08-27T08:10:00Z"
}
# 12. Timer Fixtures

Use a controllable/fake server clock in automated tests where supported.

Before Expiry
started_at = 08:00
expires_at = 08:10
server_now = 08:05

Expected:

attempt active
answer accepted
Exactly At Expiry
started_at = 08:00
expires_at = 08:10
server_now = 08:10

Expected:

attempt expired / no new answer mutation
After Expiry
started_at = 08:00
expires_at = 08:10
server_now = 08:15

Expected:

attempt expired / no new answer mutation
# 13. Retake Fixtures
Retake Disabled
{
  "allow_retake": false
}

Expected:

completed attempt
→ second start rejected
Retake Enabled
{
  "allow_retake": true
}

Expected behavior should follow the explicit retake implementation.

Do not assume unlimited retakes unless the product requirement explicitly
defines that behavior.

# 14. Security Fixtures
Candidate A
candidate_id = candidate_test_a
attempt_id = attempt_test_a
Candidate B
candidate_id = candidate_test_b
attempt_id = attempt_test_b

Security test:

Candidate A
→ request Candidate B's attempt
→ must be rejected

# 15. Company Isolation Fixtures
Company A
    └── HR A
    └── Candidate A
    └── Assessment A

Company B
    └── HR B
    └── Candidate B
    └── Assessment B

Test:

HR A → Company B result

Expected:
FORBIDDEN

# 16. Validation Fixtures
Empty Name
{
  "full_name": ""
}

Expected:

validation error
Empty WhatsApp
{
  "whatsapp_number": ""
}

Expected:

validation error
Empty Platform
{
  "application_platform": ""
}

Expected:

validation error
Other Without Value
{
  "application_platform": "other",
  "application_platform_other": ""
}

Expected:

validation error
# 17. Invalid Score Fixtures

These values must never be accepted as valid WHO-5 response scores:

-1
6
7
100
null
"invalid"

The API should not allow clients to directly submit these as scores.

# 18. Duplicate Submission Fixture

Same attempt:

attempt_test_a

Submit:

request #1
request #2
request #3

Expected:

one completed attempt
one assessment result

# 19. Test Asset Rules

Test branding files should be stored under the test asset directory.

Recommended:

test-assets/
├── company-a-primary.png
├── company-a-secondary.png
├── company-b-primary.png
└── invalid-file.txt

Use small synthetic images.
