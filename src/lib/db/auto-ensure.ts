import { db } from "./index";
import {
  companies,
  assessments,
  instruments,
  instrumentItems,
  instrumentOptions,
} from "./schema";
import { WHO5_ITEMS, WHO5_OPTIONS } from "../constants/who5-data";
import { eq } from "drizzle-orm";

export async function ensureBaseEntities() {
  try {
    // 1. Cek atau Buat Default Company
    let [company] = await db.select().from(companies).limit(1);
    if (!company) {
      const [newCompany] = await db
        .insert(companies)
        .values({
          name: "PT Gapai Cita Raharjo",
          primaryColor: "#890DD3",
          logoUrl: null,
        })
        .returning();
      company = newCompany;
    }

    // 2. Cek atau Buat Assessment WHO-5
    let [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.code, "WHO5_BASELINE"))
      .limit(1);

    if (!assessment) {
      const [newAssessment] = await db
        .insert(assessments)
        .values({
          code: "WHO5_BASELINE",
          title: "WHO-5 Well-Being Assessment",
          description:
            "Instrumen resmi World Health Organization untuk mengevaluasi tingkat kesejahteraan psikologis selama 2 minggu terakhir.",
          isActive: true,
        })
        .returning();
      assessment = newAssessment;
    }

    // 3. Cek atau Buat Instrument WHO-5
    let [instrument] = await db
      .select()
      .from(instruments)
      .where(eq(instruments.code, "WHO5"))
      .limit(1);

    if (!instrument) {
      const [newInstrument] = await db
        .insert(instruments)
        .values({
          assessmentId: assessment.id,
          name: "WHO-5 Well-Being Index",
          code: "WHO5",
          version: "2024",
          scoringStrategy: "WHO5",
        })
        .returning();
      instrument = newInstrument;

      // Masukkan 5 Butir Pertanyaan Resmi
      for (const item of WHO5_ITEMS) {
        await db.insert(instrumentItems).values({
          instrumentId: instrument.id,
          orderIndex: item.orderIndex,
          itemCode: item.itemCode,
          questionText: `${item.questionText} (${item.questionTextId})`,
          isRequired: true,
        });
      }

      // Masukkan 6 Skala Opsi Pilihan (0 s/d 5)
      for (const opt of WHO5_OPTIONS) {
        await db.insert(instrumentOptions).values({
          instrumentId: instrument.id,
          label: `${opt.label} / ${opt.labelId}`,
          scoreValue: opt.scoreValue,
          orderIndex: opt.orderIndex,
        });
      }
    }

    return { company, instrument };
  } catch (err) {
    console.warn("Auto-ensure DB fallback:", err);
    return {
      company: {
        id: "demo-company-id",
        name: "PT Gapai Cita Raharjo",
        primaryColor: "#890DD3",
        logoUrl: null,
      },
      instrument: {
        id: "demo-instrument-id",
        name: "WHO-5 Well-Being Index",
        code: "WHO5",
      },
    };
  }
}
