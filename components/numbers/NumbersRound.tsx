"use client";

import { useEffect, useMemo, useState } from "react";
import { GAME_CONFIG } from "@/core/game/config";
import type { NumbersRound as NumbersRoundType } from "@/core/game/types";
import { PrimaryButton } from "../game/PrimaryButton";

type NumbersRoundProps = {
  round: NumbersRoundType;
  onSubmit: (answer: string) => void;
};

type Operator = "+" | "-" | "×" | "÷";

type CalculationItem = {
  id: string;
  value: number;
  expression: string;
  label: string;
  available: boolean;
  source: "draw" | "result";
};

type Step = {
  left: string;
  operator: Operator;
  right: string;
  value: number;
  expression: string;
};

const OPERATORS: Operator[] = ["+", "-", "×", "÷"];

function createInitialItems(numbers: number[]): CalculationItem[] {
  return numbers.map((value, index) => ({
    id: `n-${index}`,
    value,
    expression: String(value),
    label: String(value),
    available: true,
    source: "draw"
  }));
}

function compute(left: number, operator: Operator, right: number): string | number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      if (right === 0) {
        return "Division par zero.";
      }

      if (left % right !== 0) {
        return "La division doit tomber juste.";
      }

      return left / right;
  }
}

export function NumbersRound({ round, onSubmit }: NumbersRoundProps) {
  const [items, setItems] = useState<CalculationItem[]>(() =>
    createInitialItems(round.numbers)
  );
  const [steps, setSteps] = useState<Step[]>([]);
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [message, setMessage] = useState("");
  const resolved = round.status === "resolved";

  useEffect(() => {
    setItems(createInitialItems(round.numbers));
    setSteps([]);
    setLeftId(null);
    setRightId(null);
    setCurrentItemId(null);
    setOperator(null);
    setMessage("");
  }, [round.id, round.numbers]);

  const availableItems = items.filter((item) => item.available);
  const leftItem = items.find((item) => item.id === leftId);
  const rightItem = items.find((item) => item.id === rightId);
  const currentItem = items.find((item) => item.id === currentItemId);
  const currentExpression = currentItem?.expression ?? "";
  const currentValue = currentItem?.value;

  const distance = useMemo(() => {
    if (currentValue === undefined) {
      return null;
    }

    return Math.abs(round.target - currentValue);
  }, [currentValue, round.target]);

  function selectItem(item: CalculationItem) {
    if (resolved || !item.available) {
      return;
    }

    setMessage("");

    if (!leftId || leftId === item.id || !operator) {
      setLeftId(item.id);
      setRightId(null);
      setCurrentItemId(item.id);
      return;
    }

    setRightId(item.id);
  }

  function runStep() {
    if (!leftItem || !rightItem || !operator) {
      setMessage("Choisissez deux valeurs et une operation.");
      return;
    }

    if (steps.length >= GAME_CONFIG.maxOperations) {
      setMessage("Vous avez deja utilise 5 operations.");
      return;
    }

    const value = compute(leftItem.value, operator, rightItem.value);

    if (typeof value === "string") {
      setMessage(value);
      return;
    }

    if (value < 0) {
      setMessage("Le resultat doit rester positif.");
      return;
    }

    const resultExpression = `(${leftItem.expression}${operator}${rightItem.expression})`;
    const result: CalculationItem = {
      id: `r-${steps.length + 1}`,
      value,
      expression: resultExpression,
      label: String(value),
      available: true,
      source: "result"
    };

    setItems((current) =>
      current
        .map((item) =>
          item.id === leftItem.id || item.id === rightItem.id
            ? { ...item, available: false }
            : item
        )
        .concat(result)
    );
    setSteps((current) => [
      ...current,
      {
        left: leftItem.label,
        operator,
        right: rightItem.label,
        value,
        expression: resultExpression
      }
    ]);
    setLeftId(result.id);
    setRightId(null);
    setCurrentItemId(result.id);
    setOperator(null);
    setMessage("");
  }

  function resetBoard() {
    if (resolved) {
      return;
    }

    setItems(createInitialItems(round.numbers));
    setSteps([]);
    setLeftId(null);
    setRightId(null);
    setCurrentItemId(null);
    setOperator(null);
    setMessage("");
  }

  function submit() {
    if (!currentExpression) {
      setMessage("Sélectionnez une valeur ou calculez au moins une étape.");
      return;
    }

    onSubmit(currentExpression);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gold/45 bg-gold/14 p-5 text-center shadow-glow">
        <div className="text-xs font-black uppercase text-gold/78">Cible</div>
        <div className="text-6xl font-black leading-none text-gold">{round.target}</div>
        <div className="mt-2 text-sm font-bold text-ivory/68">
          {currentValue === undefined
            ? "Sélectionnez une valeur gauche"
            : `Valeur courante : ${currentValue} · écart ${distance}`}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase text-ivory/72">Valeurs</h2>
          <span className="text-xs font-bold text-ivory/48">
            {steps.length}/{GAME_CONFIG.maxOperations} opérations
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line bg-panel/88 p-3">
            <div className="text-[0.65rem] font-black uppercase text-ivory/48">
              Nombres originaux
            </div>
            <div className="mt-1 text-xs font-bold text-ivory/72">
              Disponibles jusqu&apos;à utilisation
            </div>
          </div>
          <div className="rounded-xl border border-gold/35 bg-gold/10 p-3">
            <div className="text-[0.65rem] font-black uppercase text-gold/70">
              Résultats
            </div>
            <div className="mt-1 text-xs font-bold text-ivory/72">
              Réutilisables en étape suivante
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => {
            const selected = item.id === leftId || item.id === rightId;

            return (
              <button
                className={`min-h-16 rounded-xl border px-2 py-3 text-center transition active:scale-[0.98] disabled:cursor-not-allowed ${
                  selected
                    ? "border-gold bg-gold text-night shadow-glow"
                    : item.source === "result"
                      ? "border-gold/55 bg-gold/16 text-gold"
                      : "border-line bg-ivory/[0.08] text-ivory"
                } ${!item.available ? "opacity-25 grayscale" : ""}`}
                disabled={resolved || !item.available}
                key={item.id}
                onClick={() => selectItem(item)}
                type="button"
              >
                <span className="block text-2xl font-black leading-none">
                  {item.label}
                </span>
                <span className="mt-1 block text-[0.65rem] font-bold uppercase opacity-70">
                  {item.source === "result" ? "Résultat" : "Nombre"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-ivory/[0.055] p-3">
        <div className="rounded-xl border border-line bg-panel/90 p-3">
          <div className="text-[0.65rem] font-black uppercase text-ivory/48">
            Étape en cours
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm font-black">
            <div className="rounded-lg bg-ivory/[0.07] px-2 py-3 text-ivory">
              {leftItem?.label ?? "Gauche"}
            </div>
            <div className="rounded-lg bg-ivory/[0.07] px-2 py-3 text-gold">
              {operator ?? "Op."}
            </div>
            <div className="rounded-lg bg-ivory/[0.07] px-2 py-3 text-ivory">
              {rightItem?.label ?? "Droite"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {OPERATORS.map((candidate) => (
            <button
              className={`min-h-[3.25rem] rounded-xl border text-2xl font-black transition active:scale-[0.98] disabled:opacity-40 ${
                operator === candidate
                  ? "border-gold bg-gold text-night"
                  : "border-line bg-panel text-ivory"
              }`}
              disabled={resolved}
              key={candidate}
              onClick={() => {
                setOperator(candidate);
                setRightId(null);
                setMessage("");
              }}
              type="button"
            >
              {candidate}
            </button>
          ))}
        </div>

        {message ? (
          <p className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-sm font-semibold text-gold">
            {message}
          </p>
        ) : null}

        <PrimaryButton
          disabled={
            resolved ||
            !leftItem ||
            !rightItem ||
            !operator ||
            steps.length >= GAME_CONFIG.maxOperations
          }
          onClick={runStep}
          variant="secondary"
        >
          Calculer l&apos;étape
        </PrimaryButton>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase text-ivory/72">Calcul</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                className="rounded-lg border border-line bg-panel/88 px-3 py-2 text-sm font-bold text-ivory"
                key={`${step.left}-${step.operator}-${step.right}-${index}`}
              >
                <div>
                  {step.left} {step.operator} {step.right} ={" "}
                  <span className="text-gold">{step.value}</span>
                </div>
                <div className="mt-1 truncate text-xs text-ivory/42">
                  {step.expression}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <PrimaryButton disabled={resolved || !currentExpression} onClick={submit}>
          Valider
        </PrimaryButton>
        <button
          className="min-h-14 rounded-xl border border-line bg-ivory/[0.07] px-4 text-sm font-black uppercase text-ivory transition active:scale-[0.99] disabled:opacity-40"
          disabled={resolved || availableItems.length === round.numbers.length}
          onClick={resetBoard}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
