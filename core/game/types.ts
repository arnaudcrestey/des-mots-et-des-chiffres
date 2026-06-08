export type RoundKind = "letters" | "numbers";

export type RoundStatus = "playing" | "resolved";

export type LettersRound = {
  id: number;
  kind: "letters";
  status: RoundStatus;
  letters: string[];
  answer?: string;
  result?: LettersRoundResult;
};

export type NumbersRound = {
  id: number;
  kind: "numbers";
  status: RoundStatus;
  numbers: number[];
  target: number;
  answer?: string;
  result?: NumbersRoundResult;
};

export type GameRound = LettersRound | NumbersRound;

export type LettersRoundResult = {
  valid: boolean;
  score: number;
  normalizedAnswer: string;
  reason?: string;
  bestWord: string;
};

export type NumbersRoundResult = {
  valid: boolean;
  score: number;
  value?: number;
  distance?: number;
  reason?: string;
  bestSolution: NumbersSolution;
};

export type NumbersSolution = {
  expression: string;
  value: number;
  distance: number;
  exact: boolean;
};

export type GameState = {
  rounds: GameRound[];
  currentRoundIndex: number;
  totalScore: number;
  startedAt: number;
  finished: boolean;
};
