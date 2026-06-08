"use client";

import { useState } from "react";
import type { GameState } from "@/core/game/types";
import { PrimaryButton } from "../game/PrimaryButton";

type GameSummaryProps = {
  game: GameState;
  onRestart: () => void;
};

export function GameSummary({ game, onRestart }: GameSummaryProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const lettersScore = game.rounds
    .filter((round) => round.kind === "letters")
    .reduce((total, round) => total + (round.result?.score ?? 0), 0);

  const numbersScore = game.rounds
    .filter((round) => round.kind === "numbers")
    .reduce((total, round) => total + (round.result?.score ?? 0), 0);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-3 py-4 sm:px-4 sm:py-5">
      <section className="flex flex-1 flex-col justify-center gap-4">
        <header className="text-center">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-gold/80">
            Partie terminée
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ivory">
            Score final
          </h1>
        </header>

        <div className="rounded-2xl border border-gold/35 bg-gold/[0.08] px-4 py-6 text-center shadow-glow">
          <div className="text-6xl font-black leading-none text-gold">
            {game.totalScore}
          </div>

          <div className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-ivory/55">
            points
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line bg-panel/90 p-3 text-center">
            <div className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ivory/45">
              Lettres
            </div>
            <div className="mt-1 text-2xl font-black text-ivory">
              {lettersScore}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-panel/90 p-3 text-center">
            <div className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ivory/45">
              Chiffres
            </div>
            <div className="mt-1 text-2xl font-black text-ivory">
              {numbersScore}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel/88">
          <button
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            onClick={() => setDetailsOpen((current) => !current)}
            type="button"
          >
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-ivory/55">
                Détail des manches
              </div>
              <div className="mt-0.5 text-sm font-bold text-ivory">
                Voir les scores par round
              </div>
            </div>

            <span className="text-xl font-black text-gold">
              {detailsOpen ? "−" : "+"}
            </span>
          </button>

          {detailsOpen ? (
            <div className="border-t border-line px-3 pb-3">
              <div className="mt-3 space-y-2">
                {game.rounds.map((round) => (
                  <div
                    className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 rounded-xl border border-line bg-ivory/[0.045] px-3 py-2"
                    key={round.id}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ivory/[0.07] text-xs font-black text-ivory">
                      {round.id}
                    </span>

                    <div className="min-w-0">
                      <div className="text-xs font-black text-ivory">
                        {round.kind === "letters" ? "Lettres" : "Chiffres"}
                      </div>
                      <div className="truncate text-[0.68rem] font-semibold text-ivory/45">
                        {round.answer || "Sans réponse"}
                      </div>
                    </div>

                    <strong className="text-sm font-black text-gold">
                      +{round.result?.score ?? 0}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <PrimaryButton onClick={onRestart}>Nouvelle partie</PrimaryButton>
      </section>
    </main>
  );
}
