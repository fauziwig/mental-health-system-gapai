# UI Specification — Mental Health Assessment System MVP

**Version:** 0.4  
**Status:** MVP / Training Prototype  
**Primary pilot:** WHO-5 Well-Being Index  
**Design baseline:** Supplied UI screenshots + provided GAPAI/Magang PKL Prakerin logo assets

---

## 1. Purpose

This document defines the UI structure, states, fields, interactions, validation, responsive behavior, accessibility baseline, and visual design system for the Mental Health Assessment System MVP.

The supplied reference screenshots establish the general product language:

- desktop-oriented HR/admin dashboard;
- left sidebar;
- breadcrumb and page title;
- card-based forms;
- step/tab-based assessment builder;
- status badges;
- centered candidate assessment card;
- simple, functional forms and tables.

The product should adopt the same general interaction model while applying the brand direction documented below.

The MVP must remain focused. Features outside the agreed MVP scope should not be added merely because the reference UI contains them.

---

# 2. Roles

## 2.1 Admin / HR

Primary pages:

- Login
- Dashboard
- Assessment List
- Assessment Builder
- Assessment Session List
- Create Session
- Session Detail
- Candidate Attempt List
- Candidate Result Detail
- Company Branding Settings

## 2.2 Candidate

Primary pages:

- Assessment Landing / Instructions
- Candidate Information
- Assessment Questions
- Completion
- Expired / Invalid Access

---

# 3. Brand & Visual Identity

## 3.1 Brand source

The current visual direction is based on the two provided logo assets:

1. GAPAI Mentorship
2. Magang PKL Prakerin

The dominant visual characteristics are:

- purple as the primary brand color;
- yellow as the secondary accent;
- rounded/friendly visual character;
- energetic but approachable identity.

The current assets do **not** constitute a formal corporate brand guideline. Therefore the colors and typography below are implementation recommendations derived from the supplied logo artwork.

If the company later provides an official brand guideline, the design tokens should be updated centrally rather than hard-coding new values throughout the application.

---

## 3.2 Brand colors

### Primary — GAPAI Purple

```text
HEX: #890DD3
RGB: 137, 13, 211
```

Use for:

- primary buttons;
- active navigation;
- selected controls;
- links;
- progress indicators;
- focus accents;
- important UI highlights.

### Secondary — GAPAI Yellow

```text
HEX: #F2D249
RGB: 242, 210, 73
```

Use sparingly for:

- decorative accents;
- visual highlights;
- illustrations;
- secondary badges;
- brand-related emphasis.

Do **not** use brand yellow as an error/destructive color.

---

## 3.3 Neutral colors

```text
Page Background: #F9F8F3
Surface / Card:  #FFFFFF

Primary Text:    #1F1F23
Secondary Text:  #6B7280
Muted Text:      #9CA3AF

Border:          #E5E7EB
```

Candidate pages should generally use the warm off-white page background with white content cards.

---

## 3.4 Semantic colors

Semantic colors are independent from brand colors.

```text
Success: #16A34A
Warning: #D97706
Error:   #DC2626
Info:    #2563EB
```

Use semantic colors only to communicate system state.

Examples:

- Success → assessment completed;
- Warning → assessment is close to expiry;
- Error → invalid input or failed operation;
- Info → informational message.

Do not use purple/yellow interchangeably with semantic statuses.

---

## 3.5 Typography

The supplied logo assets do not specify an official corporate font.

### Primary UI font

Use **Inter** for:

- body text;
- labels;
- forms;
- buttons;
- navigation;
- tables;
- timers;
- system messages.

### Optional heading font

**Nunito** may be used for selected large headings if stronger brand expression is desired.

For the MVP, using **Inter consistently across the application is preferred** because readability and implementation simplicity are more important than reproducing the exact rounded typography of the logo.

Typography hierarchy:

```text
Page Title       28–32px / semibold
Section Heading  20–24px / semibold
Card Heading     16–18px / semibold
Body             14–16px / regular
Label            13–14px / medium
Helper Text      12–13px / regular
```

---

## 3.6 Design principles

The UI should feel:

```text
GAPAI branding
      +
Professional HR system
      +
Calm assessment experience
```

The mental health assessment must feel trustworthy and focused rather than overly playful.

Avoid:

- excessive gradients;
- excessive animation;
- too many decorative illustrations;
- excessive emoji;
- large purple backgrounds;
- colorful controls competing with the assessment questions.

Use generous whitespace and clear information hierarchy.

---

# 4. Design Tokens

Brand values must be centralized.

Recommended token structure:

```css
:root {
  --brand-primary: #890DD3;
  --brand-secondary: #F2D249;

  --background: #F9F8F3;
  --surface: #FFFFFF;

  --text-primary: #1F1F23;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;

  --border: #E5E7EB;

  --success: #16A34A;
  --warning: #D97706;
  --error: #DC2626;
  --info: #2563EB;
}
```

Do not hard-code brand colors repeatedly inside individual components.

Future official branding changes should primarily require changes to the token layer.

---

# 5. Global Admin Layout

```text
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
│  - Buat Sesi  │                                             │
│ Settings      │                                             │
│  - Branding   │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

## 5.1 Sidebar

Recommended:

```text
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

Active navigation:

```text
Text: #890DD3
Background: rgba(137, 13, 211, 0.08)
```

---

# 6. Admin — Assessment List

## Purpose

Show reusable assessment definitions.

## Information

- Assessment name;
- Instrument;
- Number of questions;
- Duration;
- Status;
- Last updated;
- Actions.

Example:

```text
WHO-5 Well-Being Assessment
5 Questions
10 Minutes
ACTIVE
```

## Actions

- View/Edit;
- Archive;
- Create Session.

Duplicate may be added later.

Do not expose scoring formulas in the list.

---

# 7. Admin — Assessment Builder

Use a stepper similar to the supplied reference:

```text
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

---

## 7.1 Step 1 — Informasi Dasar

Fields:

### Assessment Title

Required.

Example:

```text
WHO-5 Well-Being Assessment
```

### Description

Optional.

### Candidate Instructions

Required before activation.

### Assessment Code

Optional/system-generated.

### Status

```text
Draft
Active
Archived
```

### Validation

- title required;
- title length bounded;
- instructions required before activation.

---

# 8. Step 2 — Pengaturan

## Duration

```text
Batas Waktu
[ 10 ] menit
```

Must be a positive number when time-limited.

The timer does not start on the builder page.

## Candidate Result Visibility

```text
[ ] Tampilkan hasil ke kandidat
```

Default: off.

## Allow Retake

```text
[ ] Izinkan retake
```

Default: off.

## Navigation

For WHO-5 MVP:

```text
[ ] Izinkan kembali ke pertanyaan sebelumnya
```

The selected navigation behavior must be consistent for the whole assessment.

Navigation behavior must not alter WHO-5 scoring.

## Explicitly excluded from MVP

Do not add unless separately approved:

- pass/fail threshold;
- competency weights;
- proctoring;
- webcam;
- randomized answers;
- randomized questions.

---

# 9. Step 3 — Instrumen

Display the selected instrument:

```text
Instrument

┌──────────────────────────────────────────────┐
│ WHO-5 Well-Being Index                       │
│ Items: 5                                     │
│ Response: 6 options (0–5)                   │
└──────────────────────────────────────────────┘
```

For MVP there is one active instrument: WHO-5.

The instrument definition and scoring configuration should be treated as a separate domain/service from the generic assessment UI.

---

# 10. Step 4 — Soal

The builder displays the five WHO-5 items.

Each item contains:

```text
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

The reference UI may show a five-option Likert component, but WHO-5 uses **six response values: 0–5**.

Therefore the WHO-5 implementation must display six options.

The scoring mapping must not be accidentally changed by normal question-content editing.

The official instrument wording and recall period are governed by `WHO5-SPEC.md`.

---

# 11. Step 5 — Preview

Two-column desktop layout:

```text
Builder information       Live Candidate Preview

──────────────────         ─────────────────────

Assessment data            Company branding

Settings                   Instructions

Instrument                 Candidate fields

Questions                  Example question
```

Preview must not create a real candidate attempt.

---

# 12. Admin — Create Assessment Session

Fields:

```text
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

The session defines the exact vacancy/position label.

The position should be shown read-only to candidates.

After creation:

```text
Session Status: ACTIVE

Secure Assessment Link:
https://.../test/<opaque-token>

[ Copy Link ]
```

The link must use an opaque token and must not expose internal database IDs.

---

# 13. Admin — Session List

Columns:

- Session name;
- Assessment;
- Position;
- Participant/attempt count;
- Created;
- Expiry;
- Status;
- Actions.

Example:

```text
Recruitment Batch — Junior Software Engineer
WHO-5
7 / 50 attempts
ACTIVE
```

---

# 14. Admin — Session Detail

## Session Information

- Assessment;
- Session name;
- Position;
- Status;
- Created;
- Expires.

## Access

```text
Secure Assessment Link

[ https://... ]

[ Copy Link ]
```

## Candidate Attempts

Columns:

- Name;
- WhatsApp;
- Position;
- Platform;
- Status;
- Score;
- Completed;
- Action.

Sensitive candidate information must only be visible to authorized HR/admin users.

---

# 15. Candidate — Landing Page

The candidate page must clearly look like a company-hosted assessment.

Recommended structure:

```text
┌─────────────────────────────────────┐
│                                     │
│       [Primary Logo] [Secondary]   │
│                                     │
│       Company / Program Name        │
│                                     │
│       WHO-5 Well-Being Assessment   │
│       Description                   │
│                                     │
│       Instructions                  │
│                                     │
│       Candidate Information         │
│                                     │
│       Nama Lengkap *                │
│       [________________________]    │
│                                     │
│       Nomor WhatsApp *              │
│       [________________________]    │
│                                     │
│       Posisi yang Dilamar *         │
│       [Junior Software Engineer]    │
│                                     │
│       Platform Lamaran *            │
│       [Glints ▼]                    │
│                                     │
│       [  Mulai Assessment  ]        │
│                                     │
└─────────────────────────────────────┘
```

## Branding

At least one configured company logo must be visible.

The current pilot may display:

- Magang PKL Prakerin logo;
- GAPAI Mentorship logo.

Recommended arrangement:

```text
[Logo 1]        [Logo 2]
```

Maintain sufficient whitespace.

Recommended logo display height:

```text
approximately 40–64px
```

depending on the asset aspect ratio.

Do not use the WHO logo as company branding.

The system should support configurable primary/secondary company logos in the future.

---

# 16. Candidate Instructions

Recommended product wording:

> Bacalah setiap pernyataan dengan seksama. Pilih jawaban yang paling sesuai dengan kondisi Anda selama dua minggu terakhir. Tidak ada jawaban benar atau salah. Jawablah sesuai dengan kondisi yang Anda alami.

The official instrument wording and recall period remain governed by `WHO5-SPEC.md`.

---

# 17. Candidate Information

Before starting the assessment, the candidate must provide:

- Nama Lengkap;
- Nomor WhatsApp yang digunakan selama sesi rekrutmen;
- Posisi yang Dilamar;
- Platform Lamaran Kerja.

## 17.1 Name

```text
Nama Lengkap *
```

Validation:

- required;
- trim whitespace;
- reasonable maximum length.

## 17.2 WhatsApp

```text
Nomor WhatsApp yang digunakan selama sesi rekrutmen *
```

Validation:

- required;
- normalize supported Indonesian formats where practical;
- do not use WhatsApp number as authentication.

## 17.3 Position

```text
Posisi yang Dilamar *
```

Preferred behavior:

- session supplies the position;
- candidate sees the value as read-only.

This preserves the exact vacancy wording supplied by HR.

## 17.4 Application Platform

```text
Platform Lamaran *
```

Options:

```text
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

If `Lainnya` is selected:

```text
Platform lainnya *
```

must appear.

---

# 18. Candidate Validation States

Examples:

```text
Nama Lengkap wajib diisi.

Nomor WhatsApp wajib diisi.

Pilih platform lamaran.

Platform lainnya wajib diisi.
```

Errors should appear close to the field.

Do not clear valid fields after validation failure.

---

# 19. Assessment Screen

Recommended layout:

```text
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

Do not use free-text input for WHO-5.

Do not randomize response order.

---

# 20. WHO-5 Likert / Response UI

WHO-5 has six response values:

```text
5 — All of the time
4 — Most of the time
3 — More than half of the time
2 — Less than half of the time
1 — Some of the time
0 — At no time
```

The UI must preserve this value mapping.

Selected state:

```text
Border: #890DD3
Background: rgba(137, 13, 211, 0.06)
```

Unselected state:

```text
Background: #FFFFFF
Border: #E5E7EB
```

The candidate should not see the numerical score associated with their total result while taking the assessment.

---

# 21. Progress

Show:

```text
Pertanyaan 1 dari 5
```

Optional visual progress:

```text
● ○ ○ ○ ○
```

Use GAPAI Purple for completed/current progress.

Do not expose the calculated assessment score during the assessment.

---

# 22. Timer

Example:

```text
Waktu tersisa: 09:42
```

Normal state:

- neutral/brand styling.

Near expiry:

- warning styling.

Expired:

- error styling.

The frontend countdown is informational only.

The server-side `expires_at` is authoritative.

When time expires:

```text
Waktu assessment telah berakhir.

Jawaban yang telah berhasil disimpan akan diproses.
```

---

# 23. Completion Page

Default:

```text
Assessment selesai

Terima kasih. Jawaban Anda telah berhasil disimpan.

Tim HR akan memproses hasil assessment sesuai proses yang berlaku.
```

If candidate result visibility is enabled, show the configured non-diagnostic result.

---

# 24. HR Result Detail

Example:

```text
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

> Hasil ini merupakan indikator kesejahteraan mental berdasarkan instrumen yang digunakan dan bukan diagnosis kondisi kesehatan mental.

The UI must clearly distinguish:

```text
Assessment Score
```

from:

```text
Clinical Diagnosis
```

The system must not present the result as a diagnosis.

---

# 25. WHO-5 Result Presentation

For the WHO-5 pilot:

```text
Raw Score: 0–25
Percentage: Raw Score × 4
```

The suggested interpretation documented for the MVP may include:

```text
Raw score < 13
or
Percentage < 50
```

This should be presented as a **suggested cut-off / indication for further assessment**, not as a diagnosis or employment fitness decision.

Preferred wording:

```text
Below suggested cut-off
```

rather than:

```text
Unhealthy
Depressed
Unfit
Failed
```

The exact scoring rules belong to the scoring domain/service and `WHO5-SPEC.md`, not to UI components.

---

# 26. HR Result Statuses

Use neutral status badges:

```text
IN PROGRESS
COMPLETED
EXPIRED
```

Interpretation labels:

```text
BELOW SUGGESTED CUTOFF
NOT BELOW SUGGESTED CUTOFF
```

Avoid:

- Healthy;
- Unhealthy;
- Depression;
- Pass;
- Fail;
- Fit;
- Unfit.

---

# 27. Branding Settings

Fields:

```text
Company Name

Primary Logo

Secondary Logo

Cover Image
```

Actions:

```text
[ Upload ]
[ Remove ]
[ Save Changes ]
```

Image validation:

- accepted image MIME types;
- size limit;
- safe filename/storage;
- no executable uploads.

Brand configuration should be centralized and reusable by candidate pages.

---

# 28. Buttons

## Primary

```text
Background: #890DD3
Text: #FFFFFF
```

Examples:

- Mulai Assessment;
- Berikutnya;
- Kirim Assessment;
- Buat Assessment.

Hover may use a darker purple such as:

```text
#720BB2
```

Focus should have a visible focus ring.

## Secondary

```text
Background: #FFFFFF
Border: #E5E7EB
Text: #1F1F23
```

## Destructive

Use semantic error:

```text
#DC2626
```

Do not use GAPAI purple or yellow for destructive actions.

---

# 29. Cards, Forms & Controls

## Cards

Recommended:

- white surface;
- subtle border;
- small/moderate shadow;
- rounded corners;
- generous internal padding.

Avoid heavy shadows and excessive decorative borders.

## Inputs

Inputs must have:

- visible label;
- clear focus state;
- error state;
- readable placeholder/helper text;
- adequate height for desktop and touch use.

## Radio / Likert options

Response options should be large enough to click comfortably.

The entire option row/card may be clickable, not only the small radio control.

---

# 30. Responsive Design

Desktop/laptop is the primary target because the recruitment environment is expected to use Chrome on office computers.

The system must still remain usable on smaller widths.

## Candidate

Desktop:

- centered content card;
- readable question width;
- large response areas.

Mobile/tablet:

- stack content;
- keep timer visible;
- prevent horizontal overflow;
- maintain comfortable tap targets.

## Admin

Desktop:

- persistent/collapsible sidebar;
- tables for candidate/session data.

Smaller screens:

- sidebar may collapse;
- tables may horizontally scroll;
- dense tables may become card/list views.

---

# 31. Accessibility Baseline

The UI should support:

- keyboard navigation;
- visible focus states;
- sufficient contrast;
- semantic form labels;
- accessible radio controls;
- clear validation messages;
- error association with inputs;
- status indicators that do not rely on color alone.

Do not communicate important information through color alone.

---

# 32. Loading / Empty / Error / Success States

Every data-driven admin page must have explicit states.

## Loading

Use a skeleton or spinner while preserving layout.

## Empty

Example:

```text
Belum ada assessment.

[ Buat Assessment ]
```

## Error

Example:

```text
Data gagal dimuat.

[ Coba Lagi ]
```

## Success

Example:

```text
Assessment berhasil disimpan.
```

---

# 33. Invalid / Expired / Completed Access

## Expired

```text
Assessment Tidak Tersedia

Masa berlaku akses assessment ini telah berakhir.

Silakan hubungi tim HR jika Anda memerlukan bantuan.
```

## Already completed

```text
Assessment Tidak Dapat Diulang

Assessment ini sudah pernah diselesaikan.

Silakan hubungi tim HR jika Anda memerlukan bantuan.
```

## Invalid link

```text
Link Assessment Tidak Valid

Link yang Anda gunakan tidak valid atau sudah tidak tersedia.
```

Do not expose:

- database IDs;
- session IDs;
- attempt IDs;
- token internals;
- stack traces;
- security implementation details.

---

# 34. Security-sensitive UI Rules

The UI must not assume that client-side restrictions are security controls.

Examples:

- disabling a button is not authorization;
- hiding an admin menu is not authorization;
- hiding the score in the candidate UI is not score protection;
- the client-side timer is not the source of truth.

Authorization and business rules must be enforced server-side.

The candidate should never be able to submit an arbitrary score.

---

# 35. Candidate Assessment Branding

Branding should be visible without distracting from the test.

Recommended hierarchy:

```text
[Company Logo(s)]

Assessment Title

Short instruction

Candidate information / questions
```

Do not:

- use the WHO logo as if WHO were the assessment provider;
- imply an official relationship with WHO;
- make the company logo larger than the assessment content;
- add unnecessary marketing copy to the assessment screen.

---

# 36. Future Branding Architecture

The UI should be designed so that branding can eventually be configured per company.

Potential future configuration:

```text
company_name
primary_logo
secondary_logo
cover_image
primary_color
secondary_color
favicon
```

Components should consume branding tokens/configuration rather than hard-coded values.

This allows a future company-specific theme without redesigning every page.

---

# 37. Out of Scope for Current MVP

Unless explicitly approved later, do not add:

- webcam proctoring;
- automatic facial analysis;
- AI diagnosis;
- clinical diagnosis;
- employment fitness prediction;
- complex psychometric profiling;
- random question banks;
- randomized answer options;
- advanced anti-cheating systems;
- automated hiring decisions;
- multi-instrument scoring combinations.

The MVP is a controlled assessment delivery and result-review system.

---

# 38. Source-of-Truth Separation

The UI specification is responsible for presentation and interaction.

The following must remain separate:

```text
UI
 ↓
Assessment configuration
 ↓
Assessment instrument
 ↓
Scoring service
 ↓
Result / interpretation
```

For the current pilot:

```text
Instrument: WHO-5
Scoring: WHO-5 scoring configuration
UI: generic assessment UI
```

Changing the scoring algorithm should not require rewriting the candidate UI.

Changing the visual brand should primarily require changing design tokens/configuration.

Changing the assessment instrument should not require rewriting session-management UI.

---

# 39. Implementation Notes for AI Coding Assistant

When implementing this specification:

1. Prefer reusable UI components.
2. Centralize design tokens.
3. Do not hard-code WHO-5 scoring logic into React/UI components.
4. Do not hard-code company branding into individual pages.
5. Treat server-side validation as authoritative.
6. Do not expose internal IDs or security tokens in UI.
7. Preserve the exact configured position label supplied by the assessment session.
8. Keep candidate and admin interfaces separated by authorization.
9. Keep accessibility requirements in every form/control implementation.
10. Do not introduce out-of-scope features without an approved change.

---

# 40. Reference Asset Note

The provided logo assets are the visual reference for the current MVP branding.

Official brand colors, font family, spacing rules, logo clear-space rules, and other corporate identity requirements should replace the provisional values in this document if an official brand guideline becomes available.
