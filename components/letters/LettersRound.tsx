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
    if (resolved || usedIndexes.includes(index)) return;
    if (answer.length >= round.letters.length) return;

    setAnswer((current) => `${current}${letter}`);
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
    onSubmit(answer);
  }

  return (
    <form
      className="space-y-3.5"
      onSubmit={(event) => {
        event.preventDefault();
        submitAnswer();
      }}
    >
      <div className="grid grid-cols-4 gap-2">
        {round.letters.map((letter, index) => {
          const used = usedIndexes.includes(index);

          return (
            <button
              aria-label={`Ajouter ${letter}`}
              className={[
                "flex h-14 items-center justify-center rounded-xl border text-2xl font-black transition active:scale-[0.97]",
                "focus:outline-none focus:ring-2 focus:ring-gold/60",
                used
                  ? "border-line bg-ivory/[0.035] text-ivory/22"
                  : "border-line bg-ivory/[0.08] text-ivory shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                "sm:h-16 sm:text-3xl",
              ].join(" ")}
              disabled={resolved || used}
              key={`${letter}-${index}`}
              onClick={() => addLetter(letter, index)}
              type="button"
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div>
        <div className="mb-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-ivory/48">
          Mot proposé
        </div>

        <div className="flex min-h-12 w-full items-center rounded-xl border border-line bg-ivory/[0.075] px-3 text-2xl font-black uppercase tracking-wide text-ivory sm:min-h-14">
          {answer || (
            <span className="text-sm font-bold normal-case tracking-normal text-ivory/32">
              Touchez les lettres
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="h-11 rounded-xl border border-line bg-ivory/[0.055] px-3 text-xs font-black uppercase tracking-[0.1em] text-ivory transition active:scale-[0.98] disabled:opacity-35"
          disabled={resolved || answer.length === 0}
          onClick={removeLastLetter}
          type="button"
        >
          Retour
        </button>

        <button
          className="h-11 rounded-xl border border-line bg-ivory/[0.055] px-3 text-xs font-black uppercase tracking-[0.1em] text-ivory transition active:scale-[0.98] disabled:opacity-35"
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
