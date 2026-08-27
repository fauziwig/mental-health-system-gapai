import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getScoringStrategy } from "@/lib/assessment-engine/registry";
import { db } from "@/lib/db";
import { attempts, attemptAnswers, assessmentResults, instrumentItems, instrumentOptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const answerItemSchema = z.object({
  itemId: z.string().min(1),
  orderIndex: z.number(),
  scoreValue: z.number().min(0).max(5),
});

const submitSchema = z.object({
  attemptToken: z.string().optional(),
  answers: z.array(answerItemSchema).min(5).max(5),
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = submitSchema.parse(body);

    const token =
      validated.attemptToken ||
      request.cookies.get("attempt_token")?.value ||
      "demo-attempt";

    // 1. Eksekusi Scoring Strategy WHO-5
    const strategy = getScoringStrategy("WHO5");
    const scoringResult = strategy.calculate(
      validated.answers.map((a) => ({
        itemId: a.itemId,
        orderIndex: a.orderIndex,
        scoreValue: a.scoreValue,
      }))
    );

    // 2. Cek & update ke Supabase jika terhubung
    try {
      const [attempt] = await db
        .select()
        .from(attempts)
        .where(eq(attempts.attemptTokenHash, token))
        .limit(1);

      if (attempt) {
        // Cek apakah sudah pernah submit (Anti double-submission)
        if (attempt.status === "COMPLETED") {
          return NextResponse.json(
            {
              status: "already_completed",
              message: "Asesmen ini sudah pernah diselesaikan dan dikirimkan.",
            },
            { status: 409 }
          );
        }

        // Cek timer server-side (dengan grace period 15 detik toleransi latensi jaringan)
        const expiresAt = new Date(attempt.expiresAt).getTime();
        const now = Date.now();
        const GRACE_PERIOD_MS = 15000;

        if (now > expiresAt + GRACE_PERIOD_MS) {
          await db
            .update(attempts)
            .set({ status: "EXPIRED" })
            .where(eq(attempts.id, attempt.id));

          return NextResponse.json(
            {
              status: "expired",
              message: "Waktu pengerjaan asesmen telah habis sebelum jawaban dikirimkan.",
            },
            { status: 403 }
          );
        }

        // Simpan hasil kalkulasi ke assessment_results
        await db.insert(assessmentResults).values({
          attemptId: attempt.id,
          rawScore: scoringResult.rawScore,
          percentageScore: scoringResult.percentageScore,
          scoreBand: scoringResult.scoreBand,
          interpretationSummary: scoringResult.interpretationSummary,
          hasItemScoreUnderTwo: scoringResult.hasItemScoreUnderTwo,
          isValid: scoringResult.isValid,
        });

        // Tandai attempt COMPLETED
        await db
          .update(attempts)
          .set({
            status: "COMPLETED",
            completedAt: new Date(),
          })
          .where(eq(attempts.id, attempt.id));
      }
    } catch (dbErr) {
      console.warn("DB submission save fallback:", dbErr);
    }

    const response = NextResponse.json({
      status: "success",
      message: "Jawaban asesmen berhasil dikirimkan.",
      data: {
        completed: true,
        submittedAt: new Date().toISOString(),
      },
    });

    // Bersihkan cookie attempt
    response.cookies.delete("attempt_token");

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "validation_error",
          errors: error.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Gagal memproses pengiriman jawaban.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
