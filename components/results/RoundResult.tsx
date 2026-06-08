import type { GameRound } from "@/core/game/types";
import { PrimaryButton } from "../game/PrimaryButton";

type RoundResultProps = {
  round: GameRound;
  isLastRound: boolean;
  onNext: () => void;
};

export function RoundResult({ round, isLastRound, onNext }: RoundResultProps) {
  if (round.status !== "resolved" || !round.result) {
    return null;
  }

  const result = round.result;

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-panel/94 p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase text-ivory/55">Résultat</div>
          <h2 className="mt-1 text-2xl font-black text-ivory">
            {result.valid ? "Réponse validée" : "Réponse refusée"}
          </h2>
        </div>
        <div className="rounded-xl bg-gold px-4 py-3 text-2xl font-black text-night">
          +{result.score}
        </div>
      </div>

      {"reason" in result && result.reason ? (
        <p className="rounded-xl border border-line bg-ivory/[0.06] p-4 text-sm font-semibold text-ivory/78">
          {result.reason}
        </p>
      ) : null}

      {round.kind === "letters" ? (
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-ivory/58">Votre mot</span>
            <strong className="text-right uppercase text-ivory">
              {round.result.normalizedAnswer || "Aucun"}
            </strong>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-ivory/58">Meilleur mot</span>
            <strong className="text-right uppercase text-gold">
              {round.result.bestWord || "Introuvable"}
            </strong>
          </div>
        </div>
      ) : (
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-ivory/58">Votre calcul</span>
            <strong className="max-w-[12rem] break-words text-right text-ivory">
              {round.answer || "Aucun"}
            </strong>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-ivory/58">Valeur obtenue</span>
            <strong className="text-right text-ivory">
              {round.result.value ?? "Invalide"}
            </strong>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-ivory/58">Meilleure solution</span>
            <strong className="max-w-[12rem] break-words text-right text-gold">
              {round.result.bestSolution.expression} = {round.result.bestSolution.value}
            </strong>
          </div>
        </div>
      )}

      <PrimaryButton onClick={onNext}>
        {isLastRound ? "Voir le bilan" : "Manche suivante"}
      </PrimaryButton>
    </section>
  );
}
