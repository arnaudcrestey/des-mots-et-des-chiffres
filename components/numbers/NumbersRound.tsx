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
  available: boolean;
  source: "draw" | "result";
};

type Step = {
  left: number;
  operator: Operator;
  right: number;
  value: number;
  expression: string;
};

const OPERATORS: Operator[] = ["+", "-", "×", "÷"];

function createInitialItems(numbers: number[]): CalculationItem[] {
  return numbers.map((value, index) => ({
    id: `n-${index}`,
    value,
    expression: String(value),
    available: true,
    source: "draw",
  }));
}

function compute(left: number, operator: Operator, right: number): number | string {
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "×") return left * right;

  if (right === 0) return "Division impossible.";
  if (left % right !== 0) return "La division doit tomber juste.";
  return left / right;
}

function normalizeExpression(expression: string) {
  return expression.replaceAll("×", "*").replaceAll("÷", "/");
}

export function NumbersRound({ round, onSubmit }: NumbersRoundProps) {
  const [items, setItems] = useState<CalculationItem[]>(() =>
    createInitialItems(round.numbers)
  );
  const [steps, setSteps] = useState<Step[]>([]);
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const resolved = round.status === "resolved";

  useEffect(() => {
    setItems(createInitialItems(round.numbers));
    setSteps([]);
    setLeftId(null);
    setRightId(null);
    setOperator(null);
    setCurrentItemId(null);
    setMessage("");
  }, [round.id, round.numbers]);

  const leftItem = items.find((item) => item.id === leftId);
  const rightItem = items.find((item) => item.id === rightId);
  const currentItem = items.find((item) => item.id === currentItemId);

  const distance = useMemo(() => {
    if (!currentItem) return null;
    return Math.abs(round.target - currentItem.value);
  }, [currentItem, round.target]);

  const hasAction =
    steps.length > 0 || Boolean(leftId) || Boolean(rightId) || Boolean(operator);

  function selectItem(item: CalculationItem) {
    if (resolved || !item.available) return;

    setMessage("");

    if (!leftId || !operator) {
      setLeftId(item.id);
      setRightId(null);
      setCurrentItemId(item.id);
      return;
    }

    if (item.id === leftId) return;

    setRightId(item.id);
  }

  function selectOperator(nextOperator: Operator) {
    if (resolved || !leftItem) {
      setMessage("Sélectionnez d’abord une valeur.");
      return;
    }

    setOperator(nextOperator);
    setRightId(null);
    setMessage("");
  }

  function runStep() {
    if (resolved) return;

    if (!leftItem || !operator || !rightItem) {
      setMessage("Sélectionnez une valeur, une opération puis une seconde valeur.");
      return;
    }

    if (steps.length >= GAME_CONFIG.maxOperations) {
      setMessage("Vous avez déjà utilisé les 5 opérations.");
      return;
    }

    const result = compute(leftItem.value, operator, rightItem.value);

    if (typeof result === "string") {
      setMessage(result);
      return;
    }

    if (result < 0) {
      setMessage("Le résultat doit rester positif.");
      return;
    }

    const expression = `(${leftItem.expression}${operator}${rightItem.expression})`;

    const resultItem: CalculationItem = {
      id: `r-${steps.length + 1}`,
      value: result,
      expression,
      available: true,
      source: "result",
    };

    setItems((previous) =>
      previous
        .map((item) =>
          item.id === leftItem.id || item.id === rightItem.id
            ? { ...item, available: false }
            : item
        )
        .concat(resultItem)
    );

    setSteps((previous) => [
      ...previous,
      {
        left: leftItem.value,
        operator,
        right: rightItem.value,
        value: result,
        expression,
      },
    ]);

    setLeftId(resultItem.id);
    setRightId(null);
    setOperator(null);
    setCurrentItemId(resultItem.id);
    setMessage("");
  }

  function resetBoard() {
    if (resolved) return;

    setItems(createInitialItems(round.numbers));
    setSteps([]);
    setLeftId(null);
    setRightId(null);
    setOperator(null);
    setCurrentItemId(null);
    setMessage("");
  }

  function submit() {
    if (resolved) return;

    const itemToSubmit = currentItem ?? leftItem;

    if (!itemToSubmit) {
      setMessage("Sélectionnez une valeur ou construisez un calcul.");
      return;
    }

    onSubmit(normalizeExpression(itemToSubmit.expression));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gold/35 bg-gold/[0.08] p-4 text-center">
        <div className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-gold/75">
          Cible
        </div>
        <div className="mt-1 text-5xl font-black leading-none text-gold">
          {round.target}
        </div>
        <div className="mt-2 text-xs font-bold text-ivory/65">
          {currentItem
            ? `Valeur actuelle : ${currentItem.value} · écart ${distance}`
            : "Construisez votre calcul"}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-ivory/70">
          Valeurs
        </h2>
        <span className="text-xs font-bold text-ivory/45">
          {steps.length}/{GAME_CONFIG.maxOperations} opérations
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const selected = item.id === leftId || item.id === rightId;

          return (
            <button
              key={item.id}
              type="button"
              disabled={resolved || !item.available}
              onClick={() => selectItem(item)}
              className={[
                "min-h-[4.15rem] rounded-xl border px-2 py-2 text-center transition active:scale-[0.98]",
                "disabled:cursor-not-allowed",
                selected
                  ? "border-gold bg-gold text-night"
                  : item.source === "result"
                    ? "border-gold/45 bg-gold/[0.14] text-gold"
                    : "border-line bg-ivory/[0.075] text-ivory",
                !item.available ? "opacity-25 grayscale" : "",
              ].join(" ")}
            >
              <span className="block text-2xl font-black leading-none">
                {item.value}
              </span>
              <span className="mt-1 block text-[0.58rem] font-black uppercase tracking-[0.12em] opacity-65">
                {item.source === "result" ? "Résultat" : "Nombre"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-line bg-ivory/[0.045] p-3">
        <div className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-ivory/45">
          Étape
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm font-black">
          <div className="rounded-xl bg-ivory/[0.07] px-2 py-3 text-ivory">
            {leftItem?.value ?? "Gauche"}
          </div>
          <div className="rounded-xl bg-ivory/[0.07] px-2 py-3 text-gold">
            {operator ?? "Op."}
          </div>
          <div className="rounded-xl bg-ivory/[0.07] px-2 py-3 text-ivory">
            {rightItem?.value ?? "Droite"}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {OPERATORS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              disabled={resolved}
              onClick={() => selectOperator(candidate)}
              className={[
                "h-12 rounded-xl border text-xl font-black transition active:scale-[0.98]",
                operator === candidate
                  ? "border-gold bg-gold text-night"
                  : "border-line bg-panel text-ivory",
              ].join(" ")}
            >
              {candidate}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-3 rounded-xl border border-gold/25 bg-gold/[0.08] px-3 py-2 text-xs font-bold text-gold">
            {message}
          </div>
        ) : null}

        <button
          type="button"
          disabled={
            resolved ||
            !leftItem ||
            !rightItem ||
            !operator ||
            steps.length >= GAME_CONFIG.maxOperations
          }
          onClick={runStep}
          className="mt-3 h-12 w-full rounded-xl border border-line bg-ivory/[0.075] text-xs font-black uppercase tracking-[0.12em] text-ivory transition active:scale-[0.99] disabled:opacity-35"
        >
          Calculer l’étape
        </button>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-ivory/70">
            Calcul
          </h2>

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={`${step.expression}-${index}`}
                className="rounded-xl border border-line bg-panel/85 px-3 py-2 text-sm font-bold text-ivory"
              >
                {step.left} {step.operator} {step.right} ={" "}
                <span className="text-gold">{step.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_5rem] gap-3">
        <PrimaryButton disabled={resolved || !currentItem} onClick={submit}>
          Valider
        </PrimaryButton>

        <button
          type="button"
          disabled={resolved || !hasAction}
          onClick={resetBoard}
          className="min-h-12 rounded-xl border border-line bg-ivory/[0.06] text-xs font-black uppercase text-ivory transition active:scale-[0.98] disabled:opacity-35"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
