export function normalizeWord(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae");
}

export function isPlainFrenchWord(value: string): boolean {
  return /^[a-z]+$/.test(normalizeWord(value));
}
