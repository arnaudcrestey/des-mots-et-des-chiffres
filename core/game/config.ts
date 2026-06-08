export const GAME_CONFIG = {
  totalRounds: 12,
  roundSeconds: 60,
  lettersRounds: 6,
  numbersRounds: 6,
  lettersPerRound: 8,
  vowelsPerLettersRound: 4,
  consonantsPerLettersRound: 4,
  numbersPerRound: 6,
  numbersPool: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 75, 100],
  targetMin: 100,
  targetMax: 999,
  maxOperations: 5
} as const;

export const NUMBER_SCORE_BANDS = [
  { maxDistance: 0, points: 10 },
  { maxDistance: 5, points: 7 },
  { maxDistance: 10, points: 5 },
  { maxDistance: 25, points: 3 },
  { maxDistance: Number.POSITIVE_INFINITY, points: 1 }
] as const;
