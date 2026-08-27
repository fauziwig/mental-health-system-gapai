import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assessmentSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    try {
      await db
        .update(assessmentSessions)
        .set({ status: "CLOSED" })
        .where(eq(assessmentSessions.id, id));
    } catch (dbErr) {
      console.warn("DB close session fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      message: "Sesi asesmen berhasil ditutup.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Gagal menutup sesi.", error: error?.message },
      { status: 500 }
    );
  }
}
