import { db } from "./index";
import {
  companies,
  assessments,
  instruments,
  instrumentItems,
  instrumentOptions,
  assessmentSessions,
  systemHealth,
} from "./schema";
import { WHO5_ITEMS, WHO5_OPTIONS } from "../constants/who5-data";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function seed() {
  console.log("🌱 Memulai proses seeding database...");

  try {
    // 1. Healthcheck record
    await db.insert(systemHealth).values({
      status: "OK",
      note: "Initial seed verified",
    });

    // 2. Company
    const [company] = await db
      .insert(companies)
      .values({
        name: "PT Teknologi Inovasi Indonesia",
        primaryColor: "#2563eb",
      })
      .returning();
    console.log("✓ Perusahaan dibuat:", company.name);

    // 3. Assessment
    const [assessment] = await db
      .insert(assessments)
      .values({
        code: "WHO5_BASELINE",
        title: "WHO-5 Well-Being Assessment",
        description:
          "Instrumen resmi World Health Organization untuk mengevaluasi tingkat kesejahteraan psikologis (well-being) selama 2 minggu terakhir.",
        isActive: true,
      })
      .returning();
    console.log("✓ Asesmen dibuat:", assessment.title);

    // 4. Instrument
    const [instrument] = await db
      .insert(instruments)
      .values({
        assessmentId: assessment.id,
        name: "WHO-5 Well-Being Index",
        code: "WHO5",
        version: "2024",
        scoringStrategy: "WHO5",
      })
      .returning();
    console.log("✓ Instrumen dibuat:", instrument.name);

    // 5. Items
    for (const item of WHO5_ITEMS) {
      await db.insert(instrumentItems).values({
        instrumentId: instrument.id,
        orderIndex: item.orderIndex,
        itemCode: item.itemCode,
        questionText: `${item.questionText} (${item.questionTextId})`,
        isRequired: true,
      });
    }
    console.log(`✓ ${WHO5_ITEMS.length} butir pertanyaan WHO-5 dimasukkan.`);

    // 6. Options
    for (const opt of WHO5_OPTIONS) {
      await db.insert(instrumentOptions).values({
        instrumentId: instrument.id,
        label: `${opt.label} / ${opt.labelId}`,
        scoreValue: opt.scoreValue,
        orderIndex: opt.orderIndex,
      });
    }
    console.log(`✓ ${WHO5_OPTIONS.length} opsi skala jawaban (0-5) dimasukkan.`);

    // 7. Sesi Demo Aktif
    const [session] = await db
      .insert(assessmentSessions)
      .values({
        companyId: company.id,
        instrumentId: instrument.id,
        publicTokenHash: "demo-who5-session",
        appliedPosition: "Frontend Software Engineer",
        durationMinutes: 15,
        allowRetake: false,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari ke depan
      })
      .returning();

    console.log("✓ Sesi Demo dibuat!");
    console.log(`👉 Link Akses Demo: /assessment/${session.publicTokenHash}`);
    console.log("🎉 Seeding database selesai dengan sukses!");
  } catch (error) {
    console.error("❌ Error saat seeding:", error);
    process.exit(1);
  }
}

seed();
