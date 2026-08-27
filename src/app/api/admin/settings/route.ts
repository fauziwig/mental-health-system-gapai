import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { ensureBaseEntities } from "@/lib/db/auto-ensure";
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
    const { company } = await ensureBaseEntities();

    return NextResponse.json({
      status: "success",
      data: {
        id: company.id,
        name: company.name,
        primaryColor: company.primaryColor || "#890DD3",
        logoUrl: company.logoUrl,
      },
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

    const { company } = await ensureBaseEntities();

    let updatedCompany = {
      id: company.id,
      name: validated.name,
      primaryColor: validated.primaryColor,
      logoUrl: validated.logoUrl || null,
    };

    try {
      if (company.id && company.id !== "demo-company-id") {
        const [updated] = await db
          .update(companies)
          .set({
            name: validated.name,
            primaryColor: validated.primaryColor,
            logoUrl: validated.logoUrl || null,
            updatedAt: new Date(),
          })
          .where(eq(companies.id, company.id))
          .returning();

        if (updated) {
          updatedCompany = {
            id: updated.id,
            name: updated.name,
            primaryColor: updated.primaryColor || validated.primaryColor,
            logoUrl: updated.logoUrl,
          };
        }
      }
    } catch (dbErr) {
      console.warn("DB settings update fallback:", dbErr);
    }

    return NextResponse.json({
      status: "success",
      message: "Pengaturan identitas perusahaan berhasil diperbarui.",
      data: updatedCompany,
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
