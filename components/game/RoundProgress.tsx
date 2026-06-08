import type { GameRound } from "@/core/game/types";

type RoundProgressProps = {
  rounds: GameRound[];
  currentRoundIndex: number;
};

export function RoundProgress({ rounds, currentRoundIndex }: RoundProgressProps) {
  return (
    <div className="grid grid-cols-12 gap-1.5">
      {rounds.map((round, index) => (
        <div
          className={`h-2 rounded-full ${
            index === currentRoundIndex
              ? "bg-gold"
              : round.status === "resolved"
                ? "bg-ivory/45"
                : "bg-ivory/12"
          }`}
          key={round.id}
        />
      ))}
    </div>
  );
}
