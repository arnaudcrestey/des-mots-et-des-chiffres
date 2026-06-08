import rawDictionary from "@/data/dictionary.json";
import { normalizeWord } from "./normalizeWord";

type DictionaryIndex = {
  words: Set<string>;
  byLengthDesc: string[];
};

let cachedIndex: DictionaryIndex | null = null;

export function getDictionaryIndex(): DictionaryIndex {
  if (cachedIndex) {
    return cachedIndex;
  }

  const normalized = Array.from(
    new Set((rawDictionary as string[]).map((word) => normalizeWord(word)))
  ).filter(Boolean);

  cachedIndex = {
    words: new Set(normalized),
    byLengthDesc: normalized.sort((a, b) => b.length - a.length || a.localeCompare(b))
  };

  return cachedIndex;
}

export function hasWord(word: string): boolean {
  return getDictionaryIndex().words.has(normalizeWord(word));
}

export function listWordsByLengthDesc(): string[] {
  return getDictionaryIndex().byLengthDesc;
}
