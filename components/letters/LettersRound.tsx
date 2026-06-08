"use client";

import { useEffect, useState } from "react";
import type { LettersRound as LettersRoundType } from "@/core/game/types";
import { PrimaryButton } from "../game/PrimaryButton";

type LettersRoundProps = {
  round: LettersRoundType;
  onSubmit: (answer: string) => void;
};

export function LettersRound({ round, onSubmit }: LettersRoundProps) {
  const [answer, setAnswer] = useState("");
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);

  const resolved = round.status === "resolved";

  useEffect(() => {
    setAnswer("");
    setUsedIndexes([]);
  }, [round.id, round.letters]);

  function addLetter(letter: string, index: number) {
    if (resolved) return;
    if (usedIndexes.includes(index)) return;
    if (answer.length >= round.letters.length) return;

    setAnswer((current) => `${current}${letter.toUpperCase()}`);
    setUsedIndexes((current) => [...current, index]);
  }

  function removeLastLetter() {
    if (resolved || answer.length === 0) return;

    setAnswer((current) => current.slice(0, -1));
    setUsedIndexes((current) => current.slice(0, -1));
  }

  function clearAnswer() {
    if (resolved || answer.length === 0) return;

    setAnswer("");
    setUsedIndexes([]);
  }

  function submitAnswer() {
    if (resolved || answer.length === 0) return;

    onSubmit(answer.toUpperCase());
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        submitAnswer();
      }}
    >
      <div className="grid grid-cols-5 gap-1.5">
        {round.letters.map((letter, index) => {
          const used = usedIndexes.includes(index);
          const displayLetter = letter.toUpperCase();

          return (
            <button
              aria-label={`Ajouter ${displayLetter}`}
              className={[
                "flex h-11 items-center justify-center rounded-lg border text-2xl font-black tracking-tight transition active:scale-[0.97]",
                "focus:outline-none focus:ring-2 focus:ring-gold/70",
                used
                  ? "border-transparent bg-black/55 text-ivory/10 opacity-30"
                  : "border-gold/25 bg-[#1E252D] text-[#FFF8EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_rgba(0,0,0,0.32)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
              ].join(" ")}
              disabled={resolved || used}
              key={`${letter}-${index}`}
              onClick={() => addLetter(displayLetter, index)}
              type="button"
            >
              {displayLetter}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-line bg-panel/80 p-3">
        <div className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-ivory/45">
          Mot proposé
        </div>

        <div className="flex min-h-11 w-full items-center rounded-xl border border-ivory/10 bg-night/65 px-3 text-xl font-black uppercase tracking-[0.08em] text-ivory">
          {answer || (
            <span className="text-sm font-bold normal-case tracking-normal text-ivory/30">
              Touchez les lettres
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="h-10 rounded-xl border border-line bg-ivory/[0.055] text-[0.7rem] font-black uppercase tracking-[0.12em] text-ivory transition active:scale-[0.98] disabled:opacity-30"
          disabled={resolved || answer.length === 0}
          onClick={removeLastLetter}
          type="button"
        >
          Retour
        </button>

        <button
          className="h-10 rounded-xl border border-line bg-ivory/[0.055] text-[0.7rem] font-black uppercase tracking-[0.12em] text-ivory transition active:scale-[0.98] disabled:opacity-30"
          disabled={resolved || answer.length === 0}
          onClick={clearAnswer}
          type="button"
        >
          Effacer
        </button>
      </div>

      <PrimaryButton disabled={resolved || answer.length === 0} type="submit">
        Valider le mot
      </PrimaryButton>
    </form>
  );
}
