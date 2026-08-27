import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Jalankan lightweight query untuk verifikasi koneksi Supabase Postgres
    const result = await db.execute(sql`SELECT NOW() as db_time, current_database() as db_name`);
    const latency = Date.now() - startTime;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      latencyMs: latency,
      data: result[0],
      serverTime: new Date().toISOString(),
    });
  } catch (error: any) {
    const latency = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "degraded",
        database: "disconnected_or_unconfigured",
        latencyMs: latency,
        error: error?.message || "Database connection error",
        hint: "Pastikan DATABASE_URL di .env.local atau Vercel Environment Variables sudah dikonfigurasi dengan Connection String Supabase.",
        serverTime: new Date().toISOString(),
      },
      { status: 200 } // Kembalikan 200 agar frontend bisa menampilkan status informatif
    );
  }
}
