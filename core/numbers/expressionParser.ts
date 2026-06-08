import { GAME_CONFIG } from "../game/config";

type Token =
  | { type: "number"; value: number }
  | { type: "operator"; value: "+" | "-" | "*" | "/" }
  | { type: "paren"; value: "(" | ")" };

type NumberNode = {
  type: "number";
  value: number;
};

type BinaryNode = {
  type: "binary";
  operator: "+" | "-" | "*" | "/";
  left: ExpressionNode;
  right: ExpressionNode;
};

type ExpressionNode = NumberNode | BinaryNode;

export type EvaluationResult = {
  valid: boolean;
  value?: number;
  usedNumbers: number[];
  operations: number;
  reason?: string;
};

function normalizeExpression(expression: string): string {
  return expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".");
}

function tokenize(expression: string): Token[] {
  const normalized = normalizeExpression(expression);
  const tokens: Token[] = [];
  let index = 0;

  while (index < normalized.length) {
    const char = normalized[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = char;
      index += 1;

      while (index < normalized.length && /[0-9]/.test(normalized[index])) {
        value += normalized[index];
        index += 1;
      }

      tokens.push({ type: "number", value: Number(value) });
      continue;
    }

    if (char === "+" || char === "-" || char === "*" || char === "/") {
      tokens.push({ type: "operator", value: char });
      index += 1;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      index += 1;
      continue;
    }

    throw new Error("Caractere non autorise.");
  }

  return tokens;
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): ExpressionNode {
    const expression = this.parseExpression();

    if (this.peek()) {
      throw new Error("Expression incomplete.");
    }

    return expression;
  }

  private parseExpression(): ExpressionNode {
    let node = this.parseTerm();

    while (this.matchOperator("+") || this.matchOperator("-")) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      node = { type: "binary", operator, left: node, right };
    }

    return node;
  }

  private parseTerm(): ExpressionNode {
    let node = this.parseFactor();

    while (this.matchOperator("*") || this.matchOperator("/")) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      node = { type: "binary", operator, left: node, right };
    }

    return node;
  }

  private parseFactor(): ExpressionNode {
    const token = this.advance();

    if (!token) {
      throw new Error("Expression incomplete.");
    }

    if (token.type === "number") {
      return { type: "number", value: token.value };
    }

    if (token.type === "paren" && token.value === "(") {
      const expression = this.parseExpression();
      const next = this.advance();

      if (!next || next.type !== "paren" || next.value !== ")") {
        throw new Error("Parenthese fermante manquante.");
      }

      return expression;
    }

    throw new Error("Nombre attendu.");
  }

  private matchOperator(operator: "+" | "-" | "*" | "/"): boolean {
    const token = this.peek();

    if (token?.type !== "operator" || token.value !== operator) {
      return false;
    }

    this.index += 1;
    return true;
  }

  private advance(): Token | undefined {
    const token = this.peek();
    this.index += 1;
    return token;
  }

  private previous(): Extract<Token, { type: "operator" }> {
    return this.tokens[this.index - 1] as Extract<Token, { type: "operator" }>;
  }

  private peek(): Token | undefined {
    return this.tokens[this.index];
  }
}

function evaluateNode(node: ExpressionNode): EvaluationResult {
  if (node.type === "number") {
    return {
      valid: true,
      value: node.value,
      usedNumbers: [node.value],
      operations: 0
    };
  }

  const left = evaluateNode(node.left);
  const right = evaluateNode(node.right);

  if (!left.valid || left.value === undefined) {
    return left;
  }

  if (!right.valid || right.value === undefined) {
    return right;
  }

  let value: number;

  switch (node.operator) {
    case "+":
      value = left.value + right.value;
      break;
    case "-":
      value = left.value - right.value;
      break;
    case "*":
      value = left.value * right.value;
      break;
    case "/":
      if (right.value === 0) {
        return {
          valid: false,
          usedNumbers: [...left.usedNumbers, ...right.usedNumbers],
          operations: left.operations + right.operations + 1,
          reason: "Division par zero."
        };
      }

      if (left.value % right.value !== 0) {
        return {
          valid: false,
          usedNumbers: [...left.usedNumbers, ...right.usedNumbers],
          operations: left.operations + right.operations + 1,
          reason: "Les divisions doivent tomber juste."
        };
      }

      value = left.value / right.value;
      break;
  }

  return {
    valid: true,
    value,
    usedNumbers: [...left.usedNumbers, ...right.usedNumbers],
    operations: left.operations + right.operations + 1
  };
}

export function evaluateExpression(expression: string): EvaluationResult {
  try {
    if (!expression.trim()) {
      return {
        valid: false,
        usedNumbers: [],
        operations: 0,
        reason: "Aucun calcul saisi."
      };
    }

    const tokens = tokenize(expression);
    const ast = new Parser(tokens).parse();
    const result = evaluateNode(ast);

    if (result.operations > GAME_CONFIG.maxOperations) {
      return {
        ...result,
        valid: false,
        reason: "Le calcul depasse 5 operations."
      };
    }

    return result;
  } catch (error) {
    return {
      valid: false,
      usedNumbers: [],
      operations: 0,
      reason: error instanceof Error ? error.message : "Calcul invalide."
    };
  }
}
