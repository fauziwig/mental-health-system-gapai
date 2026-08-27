import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assessmentSessions, companies, instruments } from "@/lib/db/schema";
import { ensureBaseEntities } from "@/lib/db/auto-ensure";
import { eq } from "drizzle-orm";
import { APPLICATION_PLATFORMS } from "@/lib/constants/who5-data";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  try {
    const { company: defaultComp } = await ensureBaseEntities();

    let sessionData = null;
    let companyData = defaultComp;

    try {
      const [session] = await db
        .select()
        .from(assessmentSessions)
        .where(eq(assessmentSessions.publicTokenHash, token))
        .limit(1);

      if (session) {
        sessionData = session;
        const [comp] = await db
          .select()
          .from(companies)
          .where(eq(companies.id, session.companyId))
          .limit(1);
        if (comp) companyData = comp;
      }
    } catch (dbErr) {
      console.warn("Database fallback for session fetch:", dbErr);
    }

    const responsePayload = {
      session: {
        id: sessionData?.id || "demo-session-id",
        name: "Recruitment Assessment Batch",
        publicToken: token,
        appliedPosition: sessionData?.appliedPosition || "Junior / Mid Software Engineer",
        durationMinutes: sessionData?.durationMinutes || 15,
        allowRetake: sessionData?.allowRetake || false,
        status: sessionData?.status || "ACTIVE",
        expiresAt: sessionData?.expiresAt || new Date(Date.now() + 86400000).toISOString(),
      },
      company: {
        id: companyData?.id || "demo-company-id",
        name: companyData?.name || "PT Teknologi Inovasi Indonesia",
        logoUrl: companyData?.logoUrl || null,
        primaryColor: companyData?.primaryColor || "#890DD3",
      },
      assessment: {
        title: "WHO-5 Well-Being Assessment",
        description:
          "Kuesioner resmi WHO-5 Well-Being Index (2024) untuk mengukur tingkat kesejahteraan psikologis selama 2 minggu terakhir.",
        recallPeriod: "2 Minggu Terakhir",
        instructions:
          "Harap jawab setiap pertanyaan dengan memilih opsi yang paling mendekati bagaimana perasaan Anda selama 2 minggu terakhir. Tidak ada jawaban benar atau salah.",
      },
      availablePlatforms: APPLICATION_PLATFORMS,
    };

    return NextResponse.json({
      status: "success",
      data: responsePayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal memuat sesi asesmen.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
