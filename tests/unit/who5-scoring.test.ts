import { describe, it, expect } from "vitest";
import { who5ScoringStrategy, WHO5ScoringStrategy } from "@/lib/assessment-engine/strategies/who5-strategy";
import { getScoringStrategy } from "@/lib/assessment-engine/registry";

describe("WHO-5 Domain Assessment Engine & Scoring Strategy", () => {
  it("harus menghitung skor sempurna (semua bernilai 5) dengan benar", () => {
    const answers = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 5 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 5 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 5 },
      { itemId: "item-4", orderIndex: 4, scoreValue: 5 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 5 },
    ];

    const result = who5ScoringStrategy.calculate(answers);

    expect(result.rawScore).toBe(25);
    expect(result.percentageScore).toBe(100);
    expect(result.scoreBand).toBe("NOT_BELOW_SUGGESTED_CUTOFF");
    expect(result.hasItemScoreUnderTwo).toBe(false);
    expect(result.isValid).toBe(true);
  });

  it("harus menghitung skor terendah (semua bernilai 0) dengan benar", () => {
    const answers = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 0 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 0 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 0 },
      { itemId: "item-4", orderIndex: 4, scoreValue: 0 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 0 },
    ];

    const result = who5ScoringStrategy.calculate(answers);

    expect(result.rawScore).toBe(0);
    expect(result.percentageScore).toBe(0);
    expect(result.scoreBand).toBe("BELOW_SUGGESTED_CUTOFF");
    expect(result.hasItemScoreUnderTwo).toBe(true);
  });

  it("harus menghitung Contoh A dari spesifikasi resmi WHO-5 (Raw: 15, Persentase: 60)", () => {
    // Q1=4, Q2=3, Q3=4, Q4=1, Q5=3
    const answers = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 4 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 3 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 4 },
      { itemId: "item-4", orderIndex: 4, scoreValue: 1 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 3 },
    ];

    const result = who5ScoringStrategy.calculate(answers);

    expect(result.rawScore).toBe(15);
    expect(result.percentageScore).toBe(60);
    expect(result.scoreBand).toBe("NOT_BELOW_SUGGESTED_CUTOFF");
    expect(result.hasItemScoreUnderTwo).toBe(true); // Karena Q4 bernilai 1
  });

  it("harus menghitung Contoh B dari spesifikasi resmi WHO-5 (Raw: 10, Persentase: 40, BELOW_CUTOFF)", () => {
    // Q1=2, Q2=2, Q3=1, Q4=3, Q5=2
    const answers = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 2 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 2 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 1 },
      { itemId: "item-4", orderIndex: 4, scoreValue: 3 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 2 },
    ];

    const result = who5ScoringStrategy.calculate(answers);

    expect(result.rawScore).toBe(10);
    expect(result.percentageScore).toBe(40);
    expect(result.scoreBand).toBe("BELOW_SUGGESTED_CUTOFF");
    expect(result.hasItemScoreUnderTwo).toBe(true);
  });

  it("harus menguji batas ambang batas (Cut-off boundary)", () => {
    // Raw 12 -> 48% (Below cutoff)
    const answers12 = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 3 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 3 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 2 },
      { itemId: "item-4", orderIndex: 4, scoreValue: 2 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 2 },
    ];
    const res12 = who5ScoringStrategy.calculate(answers12);
    expect(res12.rawScore).toBe(12);
    expect(res12.percentageScore).toBe(48);
    expect(res12.scoreBand).toBe("BELOW_SUGGESTED_CUTOFF");

    // Raw 13 -> 52% (Not below cutoff)
    const answers13 = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 3 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 3 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 3 },
      { itemId: "item-4", orderIndex: 4, scoreValue: 2 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 2 },
    ];
    const res13 = who5ScoringStrategy.calculate(answers13);
    expect(res13.rawScore).toBe(13);
    expect(res13.percentageScore).toBe(52);
    expect(res13.scoreBand).toBe("NOT_BELOW_SUGGESTED_CUTOFF");
  });

  it("harus menolak jika jumlah jawaban tidak sama dengan 5", () => {
    const invalidAnswers = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 3 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 3 },
    ];

    expect(() => who5ScoringStrategy.calculate(invalidAnswers)).toThrow(
      /WHO-5 memerlukan tepat 5 jawaban pertanyaan/
    );
  });

  it("harus menolak jika ada skor di luar rentang 0 sampai 5", () => {
    const invalidAnswers = [
      { itemId: "item-1", orderIndex: 1, scoreValue: 3 },
      { itemId: "item-2", orderIndex: 2, scoreValue: 3 },
      { itemId: "item-3", orderIndex: 3, scoreValue: 6 }, // Invalid > 5
      { itemId: "item-4", orderIndex: 4, scoreValue: 2 },
      { itemId: "item-5", orderIndex: 5, scoreValue: 2 },
    ];

    expect(() => who5ScoringStrategy.calculate(invalidAnswers)).toThrow(
      /Harus bernilai antara 0 sampai 5/
    );
  });

  it("harus berhasil me-resolve strategi melalui Registry Factory", () => {
    const strategy = getScoringStrategy("WHO5");
    expect(strategy).toBeDefined();
    expect(strategy.strategyCode).toBe("WHO5");

    const strategyDash = getScoringStrategy("who-5");
    expect(strategyDash).toBeDefined();
  });
});
