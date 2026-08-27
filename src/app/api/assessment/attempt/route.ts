import { NextRequest, NextResponse } from "next/server";
import { WHO5_ITEMS, WHO5_OPTIONS } from "@/lib/constants/who5-data";
import { db } from "@/lib/db";
import { attempts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const attemptToken =
      request.nextUrl.searchParams.get("token") ||
      request.cookies.get("attempt_token")?.value;

    let remainingSeconds = 15 * 60; // default 15 menit
    let status = "IN_PROGRESS";

    if (attemptToken) {
      try {
        const [attempt] = await db
          .select()
          .from(attempts)
          .where(eq(attempts.attemptTokenHash, attemptToken))
          .limit(1);

        if (attempt) {
          status = attempt.status;
          const expiresAt = new Date(attempt.expiresAt).getTime();
          remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        }
      } catch (dbErr) {
        console.warn("DB attempt check fallback:", dbErr);
      }
    }

    return NextResponse.json({
      status: "success",
      data: {
        attemptStatus: status,
        remainingSeconds,
        instrument: {
          code: "WHO5",
          title: "WHO-5 Well-Being Index (2024)",
          recallPeriod: "2 Minggu Terakhir",
          instructions:
            "Tunjukkan seberapa sering Anda merasakan hal-hal berikut selama 2 minggu terakhir:",
        },
        items: WHO5_ITEMS.map((item) => ({
          id: item.itemCode,
          orderIndex: item.orderIndex,
          itemCode: item.itemCode,
          textEn: item.questionText,
          textId: item.questionTextId,
        })),
        options: WHO5_OPTIONS.map((opt) => ({
          id: `opt-${opt.scoreValue}`,
          orderIndex: opt.orderIndex,
          labelEn: opt.label,
          labelId: opt.labelId,
          scoreValue: opt.scoreValue,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal memuat pertanyaan asesmen.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
