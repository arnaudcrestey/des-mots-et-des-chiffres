import type { LettersRoundResult } from "../game/types";
import { findBestWord } from "./findBestWord";
import { hasWord } from "./dictionary";
import { canBuildWord } from "./letterCounts";
import { isPlainFrenchWord, normalizeWord } from "./normalizeWord";

export function validateWord(answer: string, letters: string[]): LettersRoundResult {
  const normalizedAnswer = normalizeWord(answer);
  const bestWord = findBestWord(letters);

  if (!normalizedAnswer) {
    return {
      valid: false,
      score: 0,
      normalizedAnswer,
      reason: "Aucun mot saisi.",
      bestWord
    };
  }

  if (!isPlainFrenchWord(normalizedAnswer)) {
    return {
      valid: false,
      score: 0,
      normalizedAnswer,
      reason: "Le mot contient des caractères non autorisés.",
      bestWord
    };
  }

  if (!canBuildWord(normalizedAnswer, letters)) {
    return {
      valid: false,
      score: 0,
      normalizedAnswer,
      reason: "Le mot utilise des lettres indisponibles.",
      bestWord
    };
  }

  if (!hasWord(normalizedAnswer)) {
    return {
      valid: false,
      score: 0,
      normalizedAnswer,
      reason: "Le mot n'est pas dans le dictionnaire local.",
      bestWord
    };
  }

  return {
    valid: true,
    score: normalizedAnswer.length,
    normalizedAnswer,
    bestWord
  };
}
