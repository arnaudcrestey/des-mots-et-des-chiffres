import type { NumbersRoundResult } from "../game/types";
import { evaluateExpression } from "./expressionParser";
import { scoreNumbers } from "./scoreNumbers";
import { solveNumbers } from "./solveNumbers";

function countValues(values: number[]): Map<number, number> {
  return values.reduce((counts, value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
    return counts;
  }, new Map<number, number>());
}

function respectsAvailableNumbers(used: number[], available: number[]): boolean {
  const availableCounts = countValues(available);

  for (const value of used) {
    const remaining = availableCounts.get(value) ?? 0;

    if (remaining <= 0) {
      return false;
    }

    availableCounts.set(value, remaining - 1);
  }

  return true;
}

export function validateExpression(
  expression: string,
  numbers: number[],
  target: number
): NumbersRoundResult {
  const bestSolution = solveNumbers(numbers, target);
  const evaluation = evaluateExpression(expression);

  if (!evaluation.valid || evaluation.value === undefined) {
    return {
      valid: false,
      score: 0,
      reason: evaluation.reason,
      bestSolution
    };
  }

  if (!respectsAvailableNumbers(evaluation.usedNumbers, numbers)) {
    return {
      valid: false,
      score: 0,
      reason: "Le calcul utilise un nombre absent ou trop souvent.",
      bestSolution
    };
  }

  const distance = Math.abs(target - evaluation.value);

  return {
    valid: true,
    score: scoreNumbers(distance),
    value: evaluation.value,
    distance,
    bestSolution
  };
}
