import type { GameState } from "@/core/game/types";
import { PrimaryButton } from "../game/PrimaryButton";

type GameSummaryProps = {
  game: GameState;
  onRestart: () => void;
};

export function GameSummary({ game, onRestart }: GameSummaryProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-5">
      <section className="flex flex-1 flex-col justify-center gap-6">
        <div>
          <p className="text-sm font-bold uppercase text-gold">Partie terminée</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-ivory">
            Score final
          </h1>
          <div className="mt-5 rounded-lg border border-gold/35 bg-gold/12 p-5 text-center">
            <div className="text-6xl font-black text-gold">{game.totalScore}</div>
            <div className="mt-1 text-sm font-semibold uppercase text-ivory/58">
              points
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {game.rounds.map((round) => (
            <div
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-line bg-panel/86 p-3"
              key={round.id}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ivory/8 text-sm font-black text-ivory">
                {round.id}
              </span>
              <div>
                <div className="text-sm font-bold text-ivory">
                  {round.kind === "letters" ? "Lettres" : "Chiffres"}
                </div>
                <div className="truncate text-xs text-ivory/52">
                  {round.answer || "Sans réponse"}
                </div>
              </div>
              <strong className="text-gold">+{round.result?.score ?? 0}</strong>
            </div>
          ))}
        </div>

        <PrimaryButton onClick={onRestart}>Nouvelle partie</PrimaryButton>
      </section>
    </main>
  );
}
