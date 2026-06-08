import { GAME_CONFIG } from "../game/config";

function shuffle<T>(items: readonly T[]): T[] {
  return [...items]
    .map((value) => ({ value, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
}

export function drawNumbers(): number[] {
  if (GAME_CONFIG.numbersPerRound > GAME_CONFIG.numbersPool.length) {
    throw new Error("Le tirage demande plus de nombres que le pool disponible.");
  }

  return shuffle(GAME_CONFIG.numbersPool).slice(0, GAME_CONFIG.numbersPerRound);
}

export function drawTarget(): number {
  const span = GAME_CONFIG.targetMax - GAME_CONFIG.targetMin + 1;
  return GAME_CONFIG.targetMin + Math.floor(Math.random() * span);
}
