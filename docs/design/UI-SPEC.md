# UI Specification --- Mental Health Assessment System MVP

**Version:** 0.3\
**Status:** MVP / Training Prototype\
**Primary pilot:** WHO-5 Well-Being Index

## 1. Purpose

This document defines the UI structure, states, fields, interactions,
validation, and visual behavior for the MVP.

The supplied reference screenshots are the visual baseline: -
desktop-oriented admin dashboard; - left sidebar; - breadcrumb; -
card-based forms; - step/tab-based assessment builder; - purple/indigo
primary actions; - status badges; - candidate page centered in a clean
card.

The MVP should adopt the same general design language without
reproducing features that are outside scope.

------------------------------------------------------------------------

# 2. Roles

## Admin / HR

Primary pages: - Login - Dashboard - Assessment List - Assessment
Builder - Assessment Session List - Create Session - Session Detail -
Candidate Attempt List - Candidate Result Detail - Company Branding
Settings

## Candidate

Primary pages: - Assessment Landing / Instructions - Candidate
Information - Assessment Questions - Completion - Expired / Invalid
Access

------------------------------------------------------------------------

# 3. Global Admin Layout

``` text
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb / Page Title                         User Menu   │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ Sidebar       │ Main Content                                │
│               │                                             │
│ Dashboard     │                                             │
│ Assessment    │                                             │
│  - Daftar     │                                             │
│  - Buat Baru  │                                             │
│ Sesi Asesmen  │                                             │
│  - Daftar     │                                             │
│ Settings      │                                             │
│  - Branding   │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

## Sidebar

Recommended:

``` text
Dashboard

Assessment
  Daftar
  Buat Baru

Sesi Asesmen
  Daftar
  Buat Sesi

Settings
  Branding
```

The sidebar may collapse on smaller screens.

------------------------------------------------------------------------

# 4. Admin: Assessment List

## Purpose

Show reusable assessment definitions.

## Table / Card Information

-   Assessment name
-   Instrument
-   Number of questions
-   Duration
-   Status
-   Last updated
-   Actions

Example:

``` text
WHO-5 Well-Being Index
5 Questions
10 Minutes
ACTIVE
```

## Actions

-   View/Edit
-   Duplicate (future, optional)
-   Archive
-   Create Session

Do not expose scoring formulas in the list.

------------------------------------------------------------------------

# 5. Admin: Assessment Builder

Use a stepper similar to the supplied reference:

``` text
Informasi Dasar
      ↓
Pengaturan
      ↓
Instrumen
      ↓
Soal
      ↓
Preview
```

## Step 1 --- Informasi Dasar

Fields:

### Assessment Title

Required.

Example:

``` text
WHO-5 Well-Being Assessment
```

### Description

Optional.

### Candidate Instructions

Required.

### Assessment Code

Optional/system-generated.

### Status

``` text
Draft
Active
Archived
```

### Validation

-   title required;
-   title length bounded;
-   instructions required before activation.

------------------------------------------------------------------------

# 6. Step 2 --- Pengaturan

Fields:

### Duration

``` text
Batas Waktu
[ 10 ] menit
```

Must be a positive number when time-limited.

The timer does not start on this page.

### Candidate Result Visibility

``` text
[ ] Tampilkan hasil ke kandidat
```

Default: off.

### Allow Retake

``` text
[ ] Izinkan retake
```

Default: off.

### Navigation

For WHO-5 MVP:

``` text
[ ] Izinkan kembali ke pertanyaan sebelumnya
```

The product may choose one fixed behavior. It must not change WHO-5
scoring.

### Explicitly excluded

Do not add: - pass/fail threshold; - competency weights; - proctoring; -
webcam; - randomized answers; - randomized questions.

------------------------------------------------------------------------

# 7. Step 3 --- Instrumen

Display:

``` text
Instrument
┌──────────────────────────────────────────────┐
│ WHO-5 Well-Being Index                       │
│ Version: 2024                                │
│ Items: 5                                     │
│ Response: 6 options (0–5)                   │
└──────────────────────────────────────────────┘
```

The instrument can be selected from available instruments.

For MVP there is one active instrument: WHO-5.

------------------------------------------------------------------------

# 8. Step 4 --- Soal

The builder displays five items.

Each item contains:

``` text
Item #1

Question:
I have felt cheerful and in good spirits

Response options:
5 — All of the time
4 — Most of the time
3 — More than half of the time
2 — Less than half of the time
1 — Some of the time
0 — At no time
```

## Important

The reference screenshot shows a five-option Likert UI, but WHO-5
requires six response options with values 0--5.

Therefore the WHO-5 implementation must use six options.

The score mapping must not be editable accidentally by normal content
editing.

------------------------------------------------------------------------

# 9. Step 5 --- Preview

Two-column desktop layout:

``` text
Builder information       Live Candidate Preview
──────────────────         ─────────────────────
Assessment data            Company branding
Settings                   Instructions
Instrument                 Candidate fields
Questions                  Example question
```

Preview must not create a real candidate attempt.

------------------------------------------------------------------------

# 10. Admin: Create Assessment Session

Fields:

``` text
Assessment
[ WHO-5 Well-Being Assessment ]

Session Name
[ Recruitment Batch - 27 August 2026 ]

Position
[ Junior Software Engineer ]

Session Description
[ ... ]

Start Date/Time (optional)
End Date/Time (optional)

[ Create Session ]
```

The session may define the exact vacancy/position label.

This position should be shown read-only to candidates.

After creation:

``` text
Session Status: ACTIVE

Secure Assessment Link:
https://.../test/<opaque-token>

[ Copy Link ]
```

------------------------------------------------------------------------

# 11. Admin: Session List

Columns:

-   Session name
-   Assessment
-   Position
-   Participant/attempt count
-   Created
-   Expiry
-   Status
-   Actions

Example:

``` text
Recruitment Batch — Junior Software Engineer
WHO-5
7 / 50 attempts
ACTIVE
```

------------------------------------------------------------------------

# 12. Admin: Session Detail

Sections:

## Session Information

-   Assessment
-   Session name
-   Position
-   Status
-   Created
-   Expires

## Access

``` text
Secure Assessment Link
[ https://... ]

[ Copy Link ]
```

## Candidate Attempts

Columns:

-   Name
-   WhatsApp
-   Position
-   Platform
-   Status
-   Score
-   Completed
-   Action

------------------------------------------------------------------------

# 13. Candidate: Landing Page

The candidate page should clearly look like a company-hosted assessment.

Recommended structure:

``` text
┌─────────────────────────────────────┐
│         Company Image/Logo          │
│                                     │
│         Company Name                │
│                                     │
│ WHO-5 Well-Being Assessment         │
│ Description                         │
│                                     │
│ Instructions                        │
│                                     │
│ Candidate Information               │
│                                     │
│ Nama Lengkap *                      │
│ [________________________]          │
│                                     │
│ Nomor WhatsApp *                    │
│ [________________________]          │
│                                     │
│ Posisi yang Dilamar *               │
│ [Junior Software Engineer]         │
│                                     │
│ Platform Lamaran *                  │
│ [Glints ▼]                          │
│                                     │
│ [     Mulai Assessment     ]        │
└─────────────────────────────────────┘
```

## Branding

At least one company logo must be visible.

If configured: - primary logo; - secondary logo; - company cover image.

Do not use WHO logo.

------------------------------------------------------------------------

# 14. Candidate Instructions

Recommended product wording:

> Bacalah setiap pernyataan dengan seksama. Pilih jawaban yang paling
> sesuai dengan kondisi Anda selama dua minggu terakhir. Tidak ada
> jawaban benar atau salah. Jawablah sesuai dengan kondisi yang Anda
> alami.

The official instrument wording and recall period remain governed by
`WHO5-SPEC.md`.

------------------------------------------------------------------------

# 15. Candidate Information

## Name

``` text
Nama Lengkap *
```

Validation: - required; - trim whitespace; - reasonable maximum length.

## WhatsApp

``` text
Nomor WhatsApp yang digunakan selama sesi rekrutmen *
```

Validation: - required; - normalize supported Indonesian formats where
practical; - do not use it as authentication.

## Position

``` text
Posisi yang Dilamar *
```

Preferred behavior: - session supplies the position; - candidate sees it
as read-only.

This preserves exact vacancy wording.

## Application Platform

``` text
Platform Lamaran *
```

Options:

``` text
Glints
Pintarnya
LinkedIn
JobStreet
Kalibrr
Indeed
Website Perusahaan
Referral
Lainnya
```

If `Lainnya`:

``` text
Platform lainnya *
```

------------------------------------------------------------------------

# 16. Candidate Validation States

Examples:

``` text
Nama Lengkap wajib diisi.

Nomor WhatsApp wajib diisi.

Pilih platform lamaran.

Platform lainnya wajib diisi.
```

Errors should appear close to the field.

Do not clear already-entered valid fields after validation failure.

------------------------------------------------------------------------

# 17. Already Completed State

If the candidate/session is not eligible for another attempt:

``` text
Assessment Tidak Dapat Diulang

Assessment ini sudah pernah diselesaikan
atau akses Anda sudah tidak tersedia.

Silakan hubungi tim HR jika Anda memerlukan bantuan.
```

Do not expose database identifiers or internal security information.

------------------------------------------------------------------------

# 18. Assessment Screen

Recommended layout:

``` text
Company Logo

WHO-5 Well-Being Assessment

Waktu tersisa
09:42

Pertanyaan 1 dari 5

I have felt cheerful and in good spirits

○ All of the time
○ Most of the time
○ More than half of the time
○ Less than half of the time
○ Some of the time
○ At no time

[Previous]                  [Next]
```

## Response UX

Use radio-button behavior.

One response per question.

Do not use a free-text field.

Do not randomize response order.

------------------------------------------------------------------------

# 19. Progress

Show:

``` text
Pertanyaan 1 dari 5
```

Optional progress indicator:

``` text
● ○ ○ ○ ○
```

Do not expose the numeric score during the assessment.

------------------------------------------------------------------------

# 20. Timer UI

Example:

``` text
Waktu tersisa: 09:42
```

The frontend countdown is informational.

The server's `expires_at` is authoritative.

When time expires, show:

``` text
Waktu assessment telah berakhir.
Jawaban yang telah berhasil disimpan akan diproses.
```

------------------------------------------------------------------------

# 21. Completion Page

Default:

``` text
Assessment selesai

Terima kasih. Jawaban Anda telah berhasil disimpan.

Tim HR akan memproses hasil assessment sesuai proses yang berlaku.
```

If candidate result visibility is enabled, show the configured
non-diagnostic result.

------------------------------------------------------------------------

# 22. HR Result Detail

Example:

``` text
Candidate
Budi Santoso

Position
Junior Software Engineer

Platform
Glints

Attempt
Completed

WHO-5 Score
15 / 25

Percentage
60 / 100

Interpretation
Not below suggested cut-off
```

Show an explanatory note:

> Hasil ini merupakan indikator kesejahteraan mental berdasarkan
> instrumen yang digunakan dan bukan diagnosis kondisi kesehatan mental.

------------------------------------------------------------------------

# 23. HR Result Statuses

Use neutral status badges:

``` text
IN PROGRESS
COMPLETED
EXPIRED
```

Interpretation:

``` text
BELOW SUGGESTED CUTOFF
NOT BELOW SUGGESTED CUTOFF
```

Avoid: - Healthy; - Unhealthy; - Depression; - Pass; - Fail; - Fit; -
Unfit.

------------------------------------------------------------------------

# 24. Branding Settings

Fields:

``` text
Company Name
Primary Logo
Secondary Logo
Cover Image
```

Actions:

``` text
[ Upload ]
[ Remove ]
[ Save Changes ]
```

Image validation: - accepted image MIME types; - size limit; - safe
filename/storage; - no executable uploads.

------------------------------------------------------------------------

# 25. Responsive Rules

Desktop is the primary target.

Candidate: - centered content card; - readable question width; - large
clickable response areas.

Mobile: - stack content; - keep timer visible; - prevent horizontal
overflow.

Admin: - sidebar may collapse; - tables may become horizontally
scrollable or card-based.

------------------------------------------------------------------------

# 26. Loading / Empty / Error States

Every data-driven admin page needs:

### Loading

Skeleton/spinner with stable layout.

### Empty

Example:

``` text
Belum ada assessment.
[ Buat Assessment ]
```

### Error

Example:

``` text
Data gagal dimuat.
[ Coba Lagi ]
```

### Success

Example:

``` text
Assessment berhasil disimpan.
```

------------------------------------------------------------------------

# 27. Accessibility Baseline

-   visible labels;
-   keyboard-accessible controls;
-   sufficient contrast;
-   radio options with labels;
-   clear focus state;
-   errors associated with inputs;
-   no information conveyed by color alone.
