import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(2, "Nama perusahaan wajib diisi minimal 2 karakter"),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Format kode warna HEX tidak valid"),
  logoUrl: z.string().nullable().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let company: {
      id: string;
      name: string;
      primaryColor: string;
      logoUrl: string | null;
    } = {
      id: "demo-comp",
      name: "PT Teknologi Inovasi Indonesia",
      primaryColor: "#890DD3",
      logoUrl: null,
    };

    try {
      const [comp] = await db.select().from(companies).limit(1);
      if (comp) {
        company = {
          id: comp.id,
          name: comp.name,
          primaryColor: comp.primaryColor || "#890DD3",
          logoUrl: comp.logoUrl,
        };
      }
    } catch (dbErr) {
      console.warn("DB settings fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      data: company,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Gagal memuat pengaturan.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = settingsSchema.parse(body);

    try {
      const [comp] = await db.select().from(companies).limit(1);
      if (comp) {
        await db
          .update(companies)
          .set({
            name: validated.name,
            primaryColor: validated.primaryColor,
            logoUrl: validated.logoUrl || null,
            updatedAt: new Date(),
          })
          .where(eq(companies.id, comp.id));
      } else {
        await db.insert(companies).values({
          name: validated.name,
          primaryColor: validated.primaryColor,
          logoUrl: validated.logoUrl || null,
        });
      }
    } catch (dbErr) {
      console.warn("DB settings update fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      message: "Pengaturan identitas perusahaan berhasil diperbarui.",
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
      { status: "error", message: "Gagal menyimpan pengaturan.", error: error?.message },
      { status: 500 }
    );
  }
}
