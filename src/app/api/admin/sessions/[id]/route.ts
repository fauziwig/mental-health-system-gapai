import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assessmentSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    try {
      // Set status to DELETED or delete row
      await db
        .update(assessmentSessions)
        .set({ status: "DELETED" })
        .where(eq(assessmentSessions.id, id));
    } catch (dbErr) {
      console.warn("DB delete session fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      message: "Sesi asesmen berhasil dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Gagal menghapus sesi.", error: error?.message },
      { status: 500 }
    );
  }
}
