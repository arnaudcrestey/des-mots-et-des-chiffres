import type { NumbersSolution } from "../game/types";

type SolverItem = {
  value: number;
  expression: string;
  mask: number;
};

function keyFor(items: SolverItem[]): string {
  return items
    .map((item) => `${item.mask}:${item.value}`)
    .sort()
    .join("|");
}

function better(candidate: NumbersSolution, current: NumbersSolution): NumbersSolution {
  if (candidate.distance < current.distance) {
    return candidate;
  }

  if (
    candidate.distance === current.distance &&
    candidate.expression.length < current.expression.length
  ) {
    return candidate;
  }

  return current;
}

export function solveNumbers(numbers: number[], target: number): NumbersSolution {
  const initialItems = numbers.map((value, index) => ({
    value,
    expression: String(value),
    mask: 1 << index
  }));

  let best: NumbersSolution = {
    expression: String(initialItems[0]?.value ?? 0),
    value: initialItems[0]?.value ?? 0,
    distance: Math.abs(target - (initialItems[0]?.value ?? 0)),
    exact: false
  };

  const visited = new Set<string>();

  function consider(item: SolverItem) {
    best = better(
      {
        expression: item.expression,
        value: item.value,
        distance: Math.abs(target - item.value),
        exact: item.value === target
      },
      best
    );
  }

  function search(items: SolverItem[]) {
    const key = keyFor(items);

    if (visited.has(key) || best.exact) {
      return;
    }

    visited.add(key);
    items.forEach(consider);

    if (items.length < 2) {
      return;
    }

    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const left = items[i];
        const right = items[j];
        const rest = items.filter((_, index) => index !== i && index !== j);
        const candidates: SolverItem[] = [
          {
            value: left.value + right.value,
            expression: `(${left.expression}+${right.expression})`,
            mask: left.mask | right.mask
          },
          {
            value: left.value * right.value,
            expression: `(${left.expression}×${right.expression})`,
            mask: left.mask | right.mask
          }
        ];

        if (left.value > right.value) {
          candidates.push({
            value: left.value - right.value,
            expression: `(${left.expression}-${right.expression})`,
            mask: left.mask | right.mask
          });
        }

        if (right.value > left.value) {
          candidates.push({
            value: right.value - left.value,
            expression: `(${right.expression}-${left.expression})`,
            mask: left.mask | right.mask
          });
        }

        if (right.value !== 0 && left.value % right.value === 0) {
          candidates.push({
            value: left.value / right.value,
            expression: `(${left.expression}÷${right.expression})`,
            mask: left.mask | right.mask
          });
        }

        if (left.value !== 0 && right.value % left.value === 0) {
          candidates.push({
            value: right.value / left.value,
            expression: `(${right.expression}÷${left.expression})`,
            mask: left.mask | right.mask
          });
        }

        for (const candidate of candidates) {
          if (candidate.value >= 0) {
            search([...rest, candidate]);
          }
        }
      }
    }
  }

  search(initialItems);

  return {
    ...best,
    exact: best.value === target
  };
}
