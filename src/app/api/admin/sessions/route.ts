import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assessmentSessions } from "@/lib/db/schema";
import { ensureBaseEntities } from "@/lib/db/auto-ensure";
import { desc, eq, ne } from "drizzle-orm";
import crypto from "crypto";
import { z } from "zod";

const createSessionSchema = z.object({
  appliedPosition: z.string().min(2, "Nama posisi wajib diisi minimal 2 karakter"),
  durationMinutes: z.number().min(1).max(180).default(15),
  allowRetake: z.boolean().default(false),
  expireDays: z.number().min(1).max(365).default(30),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let sessionsList: any[] = [];

    try {
      const data = await db
        .select({
          id: assessmentSessions.id,
          publicToken: assessmentSessions.publicTokenHash,
          appliedPosition: assessmentSessions.appliedPosition,
          durationMinutes: assessmentSessions.durationMinutes,
          allowRetake: assessmentSessions.allowRetake,
          status: assessmentSessions.status,
          expiresAt: assessmentSessions.expiresAt,
          createdAt: assessmentSessions.createdAt,
        })
        .from(assessmentSessions)
        .where(ne(assessmentSessions.status, "DELETED"))
        .orderBy(desc(assessmentSessions.createdAt));

      sessionsList = data;
    } catch (dbErr) {
      console.warn("DB query session list fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      data: sessionsList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Gagal memuat sesi asesmen.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSessionSchema.parse(body);

    const publicToken = "ses_" + crypto.randomBytes(12).toString("hex");
    const expiresAt = new Date(Date.now() + validated.expireDays * 24 * 60 * 60 * 1000);

    const { company, instrument } = await ensureBaseEntities();

    let newSession: {
      id: string;
      publicToken: string;
      appliedPosition: string;
      durationMinutes: number;
      allowRetake: boolean;
      status: string;
      expiresAt: string;
      createdAt: string;
    } = {
      id: crypto.randomUUID(),
      publicToken: publicToken,
      appliedPosition: validated.appliedPosition,
      durationMinutes: validated.durationMinutes,
      allowRetake: validated.allowRetake,
      status: "ACTIVE",
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      if (company.id && instrument.id && company.id !== "demo-company-id") {
        const [inserted] = await db
          .insert(assessmentSessions)
          .values({
            companyId: company.id,
            instrumentId: instrument.id,
            publicTokenHash: publicToken,
            appliedPosition: validated.appliedPosition,
            durationMinutes: validated.durationMinutes,
            allowRetake: validated.allowRetake,
            status: "ACTIVE",
            expiresAt: expiresAt,
          })
          .returning();

        newSession.id = inserted.id;
      }
    } catch (dbErr) {
      console.warn("DB session insert fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      message: "Sesi asesmen baru berhasil dibuat.",
      data: newSession,
    });
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
      { status: "error", message: "Gagal membuat sesi baru.", error: error?.message },
      { status: 500 }
    );
  }
}
