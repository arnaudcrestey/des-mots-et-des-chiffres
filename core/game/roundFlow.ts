import type { GameRound, GameState } from "./types";
import { validateWord } from "../letters/validateWord";
import { validateExpression } from "../numbers/validateExpression";

function resolveRound(round: GameRound, answer: string): GameRound {
  if (round.status === "resolved") {
    return round;
  }

  if (round.kind === "letters") {
    return {
      ...round,
      status: "resolved",
      answer,
      result: validateWord(answer, round.letters)
    };
  }

  return {
    ...round,
    status: "resolved",
    answer,
    result: validateExpression(answer, round.numbers, round.target)
  };
}

export function submitRoundAnswer(game: GameState, answer: string): GameState {
  const round = game.rounds[game.currentRoundIndex];

  if (!round || round.status === "resolved") {
    return game;
  }

  const resolvedRound = resolveRound(round, answer);
  const rounds = game.rounds.map((item, index) =>
    index === game.currentRoundIndex ? resolvedRound : item
  );
  const score = resolvedRound.result?.score ?? 0;

  return {
    ...game,
    rounds,
    totalScore: game.totalScore + score
  };
}

export function goToNextRound(game: GameState): GameState {
  const nextIndex = game.currentRoundIndex + 1;

  if (nextIndex >= game.rounds.length) {
    return {
      ...game,
      finished: true
    };
  }

  return {
    ...game,
    currentRoundIndex: nextIndex
  };
}

export function restartGame(create: () => GameState): GameState {
  return create();
}
