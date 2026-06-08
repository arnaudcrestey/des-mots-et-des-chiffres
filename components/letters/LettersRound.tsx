"use client";

import { useState } from "react";
import type { LettersRound as LettersRoundType } from "@/core/game/types";
import { PrimaryButton } from "../game/PrimaryButton";
import { Tile } from "../game/Tile";

type LettersRoundProps = {
  round: LettersRoundType;
  onSubmit: (answer: string) => void;
};

export function LettersRound({ round, onSubmit }: LettersRoundProps) {
  const [answer, setAnswer] = useState("");
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const resolved = round.status === "resolved";

  function addLetter(letter: string, index: number) {
    if (resolved || usedIndexes.includes(index) || answer.length >= round.letters.length) {
      return;
    }

    setAnswer((current) => `${current}${letter}`);
    setUsedIndexes((current) => [...current, index]);
  }

  function removeLastLetter() {
    if (resolved) {
      return;
    }

    setAnswer((current) => current.slice(0, -1));
    setUsedIndexes((current) => current.slice(0, -1));
  }

  function clearAnswer() {
    if (resolved) {
      return;
    }

    setAnswer("");
    setUsedIndexes([]);
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(answer);
      }}
    >
      <div className="grid grid-cols-4 gap-3">
        {round.letters.map((letter, index) => {
          const used = usedIndexes.includes(index);

          return (
            <button
              aria-label={`Ajouter ${letter}`}
              className="min-w-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/60"
              disabled={resolved || used}
              key={`${letter}-${index}`}
              onClick={() => addLetter(letter, index)}
              type="button"
            >
              <Tile disabled={used}>{letter}</Tile>
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-ivory/70">
          Mot proposé
        </span>
        <div className="flex min-h-16 w-full items-center rounded-xl border border-line bg-ivory/[0.08] px-4 text-3xl font-black uppercase tracking-wide text-ivory">
          {answer || <span className="text-lg font-bold normal-case text-ivory/32">Touchez les lettres</span>}
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="min-h-[3.25rem] rounded-xl border border-line bg-ivory/[0.07] px-4 text-sm font-black uppercase text-ivory transition active:scale-[0.99] disabled:opacity-40"
          disabled={resolved || answer.length === 0}
          onClick={removeLastLetter}
          type="button"
        >
          Retour
        </button>
        <button
          className="min-h-[3.25rem] rounded-xl border border-line bg-ivory/[0.07] px-4 text-sm font-black uppercase text-ivory transition active:scale-[0.99] disabled:opacity-40"
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
