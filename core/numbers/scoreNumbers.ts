import { NUMBER_SCORE_BANDS } from "../game/config";

export function scoreNumbers(distance: number): number {
  return NUMBER_SCORE_BANDS.find((band) => distance <= band.maxDistance)?.points ?? 0;
}
