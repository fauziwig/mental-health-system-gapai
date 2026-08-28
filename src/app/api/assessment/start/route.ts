import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { candidates, attempts, assessmentSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const startSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi minimal 2 karakter"),
  whatsappNumber: z
    .string()
    .min(8, "Nomor WhatsApp wajib diisi minimal 8 digit")
    .regex(/^[0-9+() -]+$/, "Format nomor WhatsApp tidak valid"),
  appliedPosition: z.string().min(1, "Posisi yang dilamar wajib diisi"),
  platform: z.string().min(1, "Platform sumber lowongan wajib dipilih"),
  publicToken: z.string().min(1, "Token sesi wajib disediakan"),
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = startSchema.parse(body);

    const now = new Date();
    const durationMinutes = 15; // default 15 menit
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
    const attemptToken = crypto.randomBytes(24).toString("hex");

    // Simpan ke Supabase jika terhubung
    try {
      // 1. Cek sesi
      const [session] = await db
        .select()
        .from(assessmentSessions)
        .where(eq(assessmentSessions.publicTokenHash, validatedData.publicToken))
        .limit(1);

      const sessionId = session?.id;

      if (session && (session.status === "CLOSED" || session.status === "DELETED")) {
        return NextResponse.json(
          {
            status: "error",
            message: "Sesi asesmen ini telah ditutup oleh administrator dan tidak lagi menerima pengerjaan.",
          },
          { status: 403 }
        );
      }

      if (session && session.expiresAt && new Date(session.expiresAt) < new Date()) {
        return NextResponse.json(
          {
            status: "error",
            message: "Masa berlaku sesi asesmen ini telah berakhir.",
          },
          { status: 403 }
        );
      }

      if (sessionId) {
        // 2. Simpan atau update candidate
        const [cand] = await db
          .insert(candidates)
          .values({
            fullName: validatedData.fullName,
            whatsappNumber: validatedData.whatsappNumber,
            appliedPosition: validatedData.appliedPosition,
            platform: validatedData.platform,
          })
          .returning();

        // 3. Simpan attempt
        await db
          .insert(attempts)
          .values({
            sessionId: sessionId,
            candidateId: cand.id,
            attemptTokenHash: attemptToken,
            status: "IN_PROGRESS",
            startedAt: now,
            expiresAt: expiresAt,
            clientMeta: {
              userAgent: request.headers.get("user-agent"),
              ip: request.headers.get("x-forwarded-for") || "localhost",
            },
          })
          .returning();
      }
    } catch (dbErr) {
      console.warn("DB insert attempt skipped or offline:", dbErr);
    }

    const response = NextResponse.json({
      status: "success",
      message: "Sesi asesmen berhasil dimulai.",
      data: {
        attemptToken,
        candidate: {
          fullName: validatedData.fullName,
          appliedPosition: validatedData.appliedPosition,
        },
        durationMinutes,
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    });

    // Set secure cookie untuk attempt token
    response.cookies.set("attempt_token", attemptToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: durationMinutes * 60,
      path: "/",
    });

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
        message: "Gagal memulai sesi asesmen.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
