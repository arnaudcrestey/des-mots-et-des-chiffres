import { canBuildWord } from "./letterCounts";
import { listWordsByLengthDesc } from "./dictionary";

export function findBestWord(letters: string[]): string {
  return listWordsByLengthDesc().find((word) => canBuildWord(word, letters)) ?? "";
}
