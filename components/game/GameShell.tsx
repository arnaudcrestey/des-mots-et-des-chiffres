"use client";

import { useCallback, useMemo, useState } from "react";
import { createGame } from "@/core/game/createGame";
import { goToNextRound, submitRoundAnswer } from "@/core/game/roundFlow";
import { LettersRound } from "../letters/LettersRound";
import { NumbersRound } from "../numbers/NumbersRound";
import { GameSummary } from "../results/GameSummary";
import { RoundResult } from "../results/RoundResult";
import { RoundProgress } from "./RoundProgress";
import { ScorePanel } from "./ScorePanel";
import { Timer } from "./Timer";

export function GameShell() {
  const [game, setGame] = useState(() => createGame());
  const currentRound = game.rounds[game.currentRoundIndex];
  const isLastRound = game.currentRoundIndex === game.rounds.length - 1;

  const submit = useCallback((answer: string) => {
    setGame((current) => submitRoundAnswer(current, answer));
  }, []);

  const expire = useCallback(() => {
    setGame((current) => submitRoundAnswer(current, ""));
  }, []);

  const next = useCallback(() => {
    setGame((current) => goToNextRound(current));
  }, []);

  const restart = useCallback(() => {
    setGame(createGame());
  }, []);

  const title =
    currentRound.kind === "letters" ? "Manche Lettres" : "Manche Chiffres";

  const subtitle = useMemo(
    () =>
      currentRound.kind === "letters"
        ? "Composez le mot le plus long avec le tirage."
        : "Atteignez la cible avec un calcul vérifiable.",
    [currentRound.kind]
  );

  if (game.finished) {
    return <GameSummary game={game} onRestart={restart} />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-3 py-3 sm:px-4 sm:py-5">
      <div className="flex flex-1 flex-col gap-3.5 sm:gap-5">
        <header className="space-y-2.5 sm:space-y-3">
          <div>
            <p className="text-[0.64rem] font-black uppercase tracking-[0.14em] text-gold/80">
              DES MOTS & DES CHIFFRES
            </p>

            <h1 className="mt-1 text-[2rem] font-black leading-[0.98] tracking-[-0.055em] text-ivory sm:text-4xl">
              {title}
            </h1>

            <p className="mt-2 max-w-[22rem] text-[0.86rem] leading-5 text-ivory/62 sm:text-sm">
              {subtitle}
            </p>
          </div>

          <RoundProgress
            currentRoundIndex={game.currentRoundIndex}
            rounds={game.rounds}
          />
        </header>

        <ScorePanel roundNumber={currentRound.id} score={game.totalScore} />

        <Timer
          activeKey={currentRound.id}
          disabled={currentRound.status === "resolved"}
          onExpire={expire}
        />

        <section className="rounded-2xl border border-line bg-panel/90 p-3 shadow-panel sm:p-4">
          {currentRound.kind === "letters" ? (
            <LettersRound onSubmit={submit} round={currentRound} />
          ) : (
            <NumbersRound onSubmit={submit} round={currentRound} />
          )}
        </section>

        <RoundResult
          isLastRound={isLastRound}
          onNext={next}
          round={currentRound}
        />
      </div>
    </main>
  );
}
