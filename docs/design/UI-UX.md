# UI/UX Specification --- MVP

This specification uses the supplied reference screenshots as the
visual/interaction baseline. It is a structural reference, not a
requirement to reproduce every feature shown in the reference platform.

------------------------------------------------------------------------

## 1. Visual Direction

The reference UI has: - left admin sidebar; - breadcrumb navigation; -
card-based content; - step/tab-based assessment builder; - clear status
badges; - purple/indigo primary action styling; - spacious desktop
layout.

Use the same general interaction pattern for familiarity, while keeping
the MVP simpler.

------------------------------------------------------------------------

## 2. Admin Navigation

Recommended:

``` text
Dashboard

Assessment
  - Daftar
  - Buat Baru

Sesi Asesmen
  - Daftar
  - Buat Sesi

Settings
  - Company Branding
  - Profile
```

Flow Test can be prepared as a future domain concept but does not need
the full reference-platform feature set in the first MVP.

------------------------------------------------------------------------

## 3. Assessment Builder

Recommended steps:

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

Do not use the reference platform's competency category step for WHO-5
unless a real product requirement needs it.

------------------------------------------------------------------------

## 4. Informasi Dasar

Fields:

``` text
Judul Assessment
Deskripsi
Instruksi Kandidat
Kode Assessment (optional/system generated)
Status
```

Candidate-facing instructions should be editable separately from
internal/admin description.

------------------------------------------------------------------------

## 5. Pengaturan

MVP:

``` text
Batas Waktu
[ 10 ] menit

Tampilkan hasil ke kandidat
[ ]

Izinkan kembali ke pertanyaan sebelumnya
[ ]

Izinkan retake
[ ]
```

Do not include `Nilai Kelulusan` for WHO-5.

WHO-5's suggested cut-off is not an exam pass/fail threshold.

------------------------------------------------------------------------

## 6. Instrumen

For MVP:

``` text
Selected Instrument
[ WHO-5 Well-Being Index ]

Version
2024

Items
5

Response
6-point scale

Scoring
WHO-5 scoring
```

The five official items should be loaded from the instrument definition.

------------------------------------------------------------------------

## 7. Soal

Candidate-facing response should look like a Likert/rating scale:

``` text
1 / 5

I have felt cheerful and in good spirits

○ All of the time
○ Most of the time
○ More than half of the time
○ Less than half of the time
○ Some of the time
○ At no time
```

The numeric score may be shown or hidden depending on UX, but the stored
score mapping must remain exact.

Do not randomize WHO-5 response options.

------------------------------------------------------------------------

## 8. Preview

Maintain the useful reference-platform pattern:

``` text
Builder form       Live Candidate Preview
```

The preview should show: - company branding; - assessment title; -
instructions; - candidate information form; - representative question; -
response options.

------------------------------------------------------------------------

## 9. Candidate Landing Page

The candidate page should visibly establish company identity above the
assessment.

Recommended order:

``` text
[Company Cover/Image — optional]

[Primary Logo]       [Secondary Logo]

Company Name

WHO-5 Well-Being Assessment
Description

Instructions

Candidate Information
```

------------------------------------------------------------------------

## 10. Candidate Information Form

Required:

``` text
Nama Lengkap *
Nomor WhatsApp yang digunakan selama sesi rekrutmen *
Posisi yang Dilamar *
Platform Lamaran *
```

Position should preferably be read-only if supplied by the session.

Platform:

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

When `Lainnya` is selected:

``` text
Platform lainnya *
```

Email is excluded from MVP.

------------------------------------------------------------------------

## 11. Candidate Instructions

Recommended wording pattern:

> Bacalah setiap pernyataan dengan seksama. Pilih jawaban yang paling
> sesuai dengan kondisi Anda selama dua minggu terakhir. Tidak ada
> jawaban benar atau salah. Jawablah sesuai dengan kondisi yang Anda
> alami.

This wording is a product/UI recommendation. The instrument's official
recall period and item content remain governed by `WHO5-SPEC.md`.

------------------------------------------------------------------------

## 12. Start Button

The primary CTA:

``` text
Mulai Assessment
```

Important:

-   candidate information is completed before starting;
-   timer does not start on landing;
-   timer starts only after Start Assessment succeeds server-side.

------------------------------------------------------------------------

## 13. Assessment Screen

Recommended:

``` text
Company branding
Assessment title

Waktu tersisa: 09:42

Pertanyaan 1 dari 5

[Question]

[Likert options]

[Previous]              [Next]
```

If previous navigation is disabled, hide the Previous button.

------------------------------------------------------------------------

## 14. Completion Screen

Example:

``` text
Assessment selesai

Terima kasih. Jawaban Anda telah berhasil disimpan.

Tim HR akan memproses hasil assessment sesuai proses rekrutmen.
```

Do not show a diagnosis.

Default: do not show the numerical score to the candidate unless
explicitly enabled.

------------------------------------------------------------------------

## 15. HR Result List

Columns:

``` text
Candidate
WhatsApp
Position
Platform
Session
Status
Raw Score
Percentage
Interpretation
Completed At
Action
```

Avoid unnecessarily exposing sensitive data in summary tables if HR does
not need it.

------------------------------------------------------------------------

## 16. HR Result Detail

``` text
Candidate Information
Assessment Information
Attempt Timeline
WHO-5 Score
Interpretation
Answer Details
```

Example:

``` text
Raw Score
15 / 25

Percentage
60 / 100

Interpretation
Not below suggested cut-off
```

Add a clear non-diagnostic note.

------------------------------------------------------------------------

## 17. Branding Settings

Admin page:

``` text
Company Name
[________________]

Primary Logo
[Upload]

Secondary Logo
[Upload]

Cover Image (optional)
[Upload]

[Preview]

[Save Changes]
```

Validate: - MIME type; - file size; - image dimensions/aspect ratio
where appropriate.

------------------------------------------------------------------------

## 18. Responsive Behavior

The primary target is: - Chrome desktop; - office computers/laptops.

Still use responsive layouts so the candidate page remains usable on
smaller screens.

The assessment experience should not depend on hover interactions.
