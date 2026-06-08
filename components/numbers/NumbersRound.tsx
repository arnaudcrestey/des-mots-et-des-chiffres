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
  const [historyOpen, setHistoryOpen] = useState(false);

  const resolved = round.status === "resolved";

  useEffect(() => {
    setItems(createInitialItems(round.numbers));
    setSteps([]);
    setLeftId(null);
    setRightId(null);
    setOperator(null);
    setCurrentItemId(null);
    setMessage("");
    setHistoryOpen(false);
  }, [round.id, round.numbers]);

  const leftItem = items.find((item) => item.id === leftId);
  const rightItem = items.find((item) => item.id === rightId);
  const currentItem = items.find((item) => item.id === currentItemId);

  const distance = useMemo(() => {
    if (!currentItem) return null;
    return Math.abs(round.target - currentItem.value);
  }, [currentItem, round.target]);

  const hasAction =
    steps.length > 0 ||
    Boolean(leftId) ||
    Boolean(rightId) ||
    Boolean(operator) ||
    Boolean(currentItemId);

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
    if (resolved) return;

    if (!leftItem) {
      setMessage("Choisissez d’abord une valeur.");
      return;
    }

    setOperator(nextOperator);
    setRightId(null);
    setMessage("");
  }

  function runStep() {
    if (resolved) return;

    if (!leftItem || !operator || !rightItem) {
      setMessage("Choisissez deux valeurs et une opération.");
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
    setHistoryOpen(false);
  }

  function submit() {
    if (resolved) return;

    const itemToSubmit = currentItem ?? leftItem;

    if (!itemToSubmit) {
      setMessage("Choisissez une valeur ou construisez un calcul.");
      return;
    }

    onSubmit(normalizeExpression(itemToSubmit.expression));
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-gold/25 bg-gold/[0.07] px-3 py-2.5">
        <div>
          <div className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-gold/70">
            Cible
          </div>
          <div className="text-[2rem] font-black leading-none text-gold">
            {round.target}
          </div>
        </div>

        <div className="max-w-[9rem] text-right text-[0.7rem] font-bold leading-snug text-ivory/58">
          {currentItem
            ? `Actuel ${currentItem.value} · écart ${distance}`
            : "Construisez votre calcul"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item) => {
          const selected = item.id === leftId || item.id === rightId;

          return (
            <button
              className={[
                "flex h-11 flex-col items-center justify-center rounded-lg border px-1.5 text-center transition active:scale-[0.98]",
                "disabled:cursor-not-allowed",
                selected
                  ? "border-gold bg-gold text-night"
                  : item.source === "result"
                    ? "border-gold/40 bg-gold/[0.12] text-gold"
                    : "border-ivory/10 bg-ivory/[0.065] text-ivory",
                !item.available ? "opacity-20 grayscale" : "",
              ].join(" ")}
              disabled={resolved || !item.available}
              key={item.id}
              onClick={() => selectItem(item)}
              type="button"
            >
              <span className="text-base font-black leading-none">{item.value}</span>
              <span className="mt-0.5 text-[0.48rem] font-black uppercase tracking-[0.1em] opacity-50">
                {item.source === "result" ? "Rés." : "Nb"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-line bg-ivory/[0.035] p-2">
        <div className="grid grid-cols-3 gap-1.5 text-center text-[0.72rem] font-black">
          <div className="rounded-lg bg-ivory/[0.07] px-1.5 py-2 text-ivory">
            {leftItem?.value ?? "Gauche"}
          </div>

          <div className="rounded-lg bg-ivory/[0.07] px-1.5 py-2 text-gold">
            {operator ?? "Op."}
          </div>

          <div className="rounded-lg bg-ivory/[0.07] px-1.5 py-2 text-ivory">
            {rightItem?.value ?? "Droite"}
          </div>
        </div>

        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
          {OPERATORS.map((candidate) => (
            <button
              className={[
                "h-9 rounded-lg border text-base font-black transition active:scale-[0.98]",
                operator === candidate
                  ? "border-gold bg-gold text-night"
                  : "border-line bg-panel text-ivory",
              ].join(" ")}
              disabled={resolved}
              key={candidate}
              onClick={() => selectOperator(candidate)}
              type="button"
            >
              {candidate}
            </button>
          ))}
        </div>

        <button
          className="mt-1.5 h-9 w-full rounded-lg border border-line bg-ivory/[0.065] text-[0.65rem] font-black uppercase tracking-[0.12em] text-ivory transition active:scale-[0.99] disabled:opacity-35"
          disabled={
            resolved ||
            !leftItem ||
            !rightItem ||
            !operator ||
            steps.length >= GAME_CONFIG.maxOperations
          }
          onClick={runStep}
          type="button"
        >
          Calculer
        </button>

        {message ? (
          <div className="mt-1.5 rounded-lg border border-gold/25 bg-gold/[0.08] px-2 py-1.5 text-[0.68rem] font-bold leading-snug text-gold">
            {message}
          </div>
        ) : null}
      </div>

      {steps.length > 0 ? (
        <div className="rounded-xl border border-line bg-panel/75">
          <button
            className="flex w-full items-center justify-between px-3 py-2 text-left"
            onClick={() => setHistoryOpen((current) => !current)}
            type="button"
          >
            <span className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-ivory/55">
              Calcul · {steps.length}/{GAME_CONFIG.maxOperations}
            </span>
            <span className="text-base font-black text-gold">
              {historyOpen ? "−" : "+"}
            </span>
          </button>

          {historyOpen ? (
            <div className="space-y-1 border-t border-line px-2 pb-2 pt-1.5">
              {steps.map((step, index) => (
                <div
                  className="rounded-lg bg-ivory/[0.045] px-2 py-1.5 text-[0.72rem] font-bold text-ivory"
                  key={`${step.expression}-${index}`}
                >
                  {step.left} {step.operator} {step.right} ={" "}
                  <span className="text-gold">{step.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_4rem] gap-2">
        <PrimaryButton disabled={resolved || !currentItem} onClick={submit}>
          Valider
        </PrimaryButton>

        <button
          className="min-h-11 rounded-xl border border-line bg-ivory/[0.055] text-[0.65rem] font-black uppercase text-ivory transition active:scale-[0.98] disabled:opacity-35"
          disabled={resolved || !hasAction}
          onClick={resetBoard}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
