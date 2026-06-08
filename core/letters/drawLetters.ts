import { GAME_CONFIG } from "../game/config";

const VOWELS = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "e", "a"];
const CONSONANTS = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "c",
  "l",
  "n",
  "r",
  "s",
  "t"
];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return items
    .map((value) => ({ value, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
}

export function drawLetters(): string[] {
  const letters = [
    ...Array.from({ length: GAME_CONFIG.vowelsPerLettersRound }, () => pick(VOWELS)),
    ...Array.from({ length: GAME_CONFIG.consonantsPerLettersRound }, () => pick(CONSONANTS))
  ];

  return shuffle(letters);
}
