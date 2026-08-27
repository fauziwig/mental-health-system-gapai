import { ScoringStrategy, ScoringAnswerItem, ScoringResult } from "../types";

export class WHO5ScoringStrategy implements ScoringStrategy {
  public readonly strategyCode = "WHO5";
  public static readonly TOTAL_ITEMS = 5;
  public static readonly MIN_ITEM_SCORE = 0;
  public static readonly MAX_ITEM_SCORE = 5;
  public static readonly CUTOFF_RAW_SCORE = 13;
  public static readonly CUTOFF_PERCENTAGE_SCORE = 50;

  /**
   * Validasi kelengkapan dan rentang jawaban untuk instrumen WHO-5.
   */
  public validateAnswers(answers: ScoringAnswerItem[]): { isValid: boolean; error?: string } {
    if (!answers || answers.length !== WHO5ScoringStrategy.TOTAL_ITEMS) {
      return {
        isValid: false,
        error: `WHO-5 memerlukan tepat ${WHO5ScoringStrategy.TOTAL_ITEMS} jawaban pertanyaan. Diterima: ${answers?.length || 0}.`,
      };
    }

    for (const answer of answers) {
      if (
        typeof answer.scoreValue !== "number" ||
        answer.scoreValue < WHO5ScoringStrategy.MIN_ITEM_SCORE ||
        answer.scoreValue > WHO5ScoringStrategy.MAX_ITEM_SCORE
      ) {
        return {
          isValid: false,
          error: `Nilai jawaban untuk butir ${answer.orderIndex || answer.itemId} tidak valid (${answer.scoreValue}). Harus bernilai antara 0 sampai 5.`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Menghitung Raw Score, Percentage Score, dan Status Interpretasi WHO-5 resmi (WHO 2024).
   */
  public calculate(answers: ScoringAnswerItem[]): ScoringResult {
    const validation = this.validateAnswers(answers);
    if (!validation.isValid) {
      throw new Error(`Gagal menghitung skor WHO-5: ${validation.error}`);
    }

    // 1. Raw Score: Penjumlahan total skor 5 butir (0 - 25)
    const rawScore = answers.reduce((sum, item) => sum + item.scoreValue, 0);

    // 2. Percentage Score: Raw score dikalikan 4 (0 - 100)
    const percentageScore = rawScore * 4;

    // 3. Cut-off status: < 50% atau raw score < 13
    const isBelowCutoff =
      percentageScore < WHO5ScoringStrategy.CUTOFF_PERCENTAGE_SCORE ||
      rawScore < WHO5ScoringStrategy.CUTOFF_RAW_SCORE;

    const scoreBand: ScoringResult["scoreBand"] = isBelowCutoff
      ? "BELOW_SUGGESTED_CUTOFF"
      : "NOT_BELOW_SUGGESTED_CUTOFF";

    // 4. Periksa apakah ada butir individual bernilai 0 atau 1
    const hasItemScoreUnderTwo = answers.some((item) => item.scoreValue <= 1);

    // 5. Ringkasan Interpretasi (Non-Clinical Disclaimer)
    let interpretationSummary = "";
    if (isBelowCutoff) {
      interpretationSummary =
        "Skor berada di bawah batas saran cut-off (< 50% / raw score < 13), yang mengindikasikan tingkat kesejahteraan psikologis (well-being) yang rendah dan merupakan sinyal untuk evaluasi atau skrining lebih lanjut. Catatan: Hasil ini adalah indikator skrining kesejahteraan dan bukan diagnosis klinis depresi atau gangguan mental.";
    } else {
      interpretationSummary =
        "Skor berada pada atau di atas batas cut-off (≥ 50% / raw score ≥ 13), mengindikasikan tingkat kesejahteraan psikologis yang memadai selama dua minggu terakhir. Catatan: Hasil ini adalah indikator skrining kesejahteraan dan bukan diagnosis klinis.";
    }

    if (hasItemScoreUnderTwo) {
      interpretationSummary +=
        " Terdapat setidaknya satu butir pernyataan dengan nilai sangat rendah (skor 0 atau 1) yang disarankan untuk ditinjau lebih lanjut.";
    }

    return {
      rawScore,
      percentageScore,
      scoreBand,
      interpretationSummary,
      hasItemScoreUnderTwo,
      itemScores: answers.map((a) => ({
        itemId: a.itemId,
        itemCode: a.itemCode,
        orderIndex: a.orderIndex,
        scoreValue: a.scoreValue,
      })),
      isValid: true,
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const who5ScoringStrategy = new WHO5ScoringStrategy();
