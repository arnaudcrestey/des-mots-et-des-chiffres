export function countLetters(values: string[]): Map<string, number> {
  return values.reduce((counts, letter) => {
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
}

export function canBuildWord(word: string, letters: string[]): boolean {
  const available = countLetters(letters);

  for (const letter of word) {
    const remaining = available.get(letter) ?? 0;

    if (remaining <= 0) {
      return false;
    }

    available.set(letter, remaining - 1);
  }

  return true;
}
