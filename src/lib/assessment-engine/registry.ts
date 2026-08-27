import { ScoringStrategy } from "./types";
import { who5ScoringStrategy } from "./strategies/who5-strategy";

const strategyRegistry: Record<string, ScoringStrategy> = {
  WHO5: who5ScoringStrategy,
  WHO_5: who5ScoringStrategy,
};

export function getScoringStrategy(strategyCode: string): ScoringStrategy {
  const normalizedCode = strategyCode.toUpperCase().replace("-", "_");
  const strategy = strategyRegistry[normalizedCode] || strategyRegistry[strategyCode.toUpperCase()];

  if (!strategy) {
    throw new Error(
      `Strategi penilaian '${strategyCode}' tidak terdaftar di Assessment Engine Registry.`
    );
  }

  return strategy;
}

export function registerScoringStrategy(strategy: ScoringStrategy): void {
  strategyRegistry[strategy.strategyCode.toUpperCase()] = strategy;
}
