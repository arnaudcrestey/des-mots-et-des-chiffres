import { GAME_CONFIG } from "./config";
import type { GameRound, GameState } from "./types";
import { drawLetters } from "../letters/drawLetters";
import { drawNumbers, drawTarget } from "../numbers/drawNumbers";

export function createRound(index: number): GameRound {
  const id = index + 1;

  if (index % 2 === 0) {
    return {
      id,
      kind: "letters",
      status: "playing",
      letters: drawLetters()
    };
  }

  return {
    id,
    kind: "numbers",
    status: "playing",
    numbers: drawNumbers(),
    target: drawTarget()
  };
}

export function createGame(): GameState {
  return {
    rounds: Array.from({ length: GAME_CONFIG.totalRounds }, (_, index) =>
      createRound(index)
    ),
    currentRoundIndex: 0,
    totalScore: 0,
    startedAt: Date.now(),
    finished: false
  };
}
