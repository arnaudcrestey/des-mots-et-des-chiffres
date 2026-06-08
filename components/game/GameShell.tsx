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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-5">
      <div className="flex flex-1 flex-col gap-6">
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-gold">
                DES MOTS & DES CHIFFRES
              </p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-ivory">
                {currentRound.kind === "letters" ? "Manche Lettres" : "Manche Chiffres"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-ivory/62">{subtitle}</p>
            </div>
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

        <section className="rounded-2xl border border-line bg-panel/90 p-5 shadow-panel">
          {currentRound.kind === "letters" ? (
            <LettersRound onSubmit={submit} round={currentRound} />
          ) : (
            <NumbersRound onSubmit={submit} round={currentRound} />
          )}
        </section>

        <RoundResult isLastRound={isLastRound} onNext={next} round={currentRound} />
      </div>
    </main>
  );
}
