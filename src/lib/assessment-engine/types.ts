export interface ScoringAnswerItem {
  itemId: string;
  itemCode?: string;
  orderIndex: number;
  scoreValue: number; // 0 to 5 for WHO-5
}

export interface ScoringResult {
  rawScore: number;
  percentageScore: number;
  scoreBand: "NOT_BELOW_SUGGESTED_CUTOFF" | "BELOW_SUGGESTED_CUTOFF";
  interpretationSummary: string;
  hasItemScoreUnderTwo: boolean;
  itemScores: {
    itemId: string;
    itemCode?: string;
    orderIndex: number;
    scoreValue: number;
  }[];
  isValid: boolean;
  calculatedAt: string;
}

export interface ScoringStrategy {
  strategyCode: string;
  calculate(answers: ScoringAnswerItem[]): ScoringResult;
  validateAnswers(answers: ScoringAnswerItem[]): { isValid: boolean; error?: string };
}
