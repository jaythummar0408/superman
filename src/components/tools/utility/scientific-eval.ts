/** Safe scientific expression evaluator (tokenizer → shunting-yard → RPN). */

type Tok =
  | { t: "num"; v: number }
  | { t: "const"; v: string }
  | { t: "func"; v: string }
  | { t: "op"; v: string }
  | { t: "lp" }
  | { t: "rp" }
  | { t: "fact" };

const FUNCS = new Set([
  "sin", "cos", "tan", "asin", "acos", "atan",
  "sinh", "cosh", "tanh", "log", "ln", "sqrt", "cbrt", "exp", "abs",
]);
const PREC: Record<string, number> = { "+": 2, "-": 2, "*": 3, "/": 3, "%": 3, "^": 4, "u-": 5 };
const RIGHT = new Set(["^", "u-"]);

function normalize(input: string): string {
  return input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/√/g, "sqrt")
    .replace(/π/g, "pi");
}

function tokenize(input: string): Tok[] {
  const s = normalize(input);
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " ") {
      i++;
      continue;
    }
    if ((c >= "0" && c <= "9") || c === ".") {
      let num = "";
      while (i < s.length && ((s[i] >= "0" && s[i] <= "9") || s[i] === ".")) num += s[i++];
      out.push({ t: "num", v: parseFloat(num) });
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let id = "";
      while (i < s.length && /[a-zA-Z]/.test(s[i])) id += s[i++];
      const low = id.toLowerCase();
      if (FUNCS.has(low)) out.push({ t: "func", v: low });
      else if (low === "pi" || low === "e") out.push({ t: "const", v: low });
      else throw new Error(`Unknown symbol: ${id}`);
      continue;
    }
    if ("+-*/%^".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (c === "(") {
      out.push({ t: "lp" });
      i++;
      continue;
    }
    if (c === ")") {
      out.push({ t: "rp" });
      i++;
      continue;
    }
    if (c === "!") {
      out.push({ t: "fact" });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${c}`);
  }

  // Insert implicit multiplication: value-ending followed by value-starting.
  const withMul: Tok[] = [];
  for (let k = 0; k < out.length; k++) {
    const prev = out[k - 1];
    const cur = out[k];
    if (prev) {
      const endsValue = prev.t === "num" || prev.t === "const" || prev.t === "rp" || prev.t === "fact";
      const startsValue = cur.t === "num" || cur.t === "const" || cur.t === "func" || cur.t === "lp";
      if (endsValue && startsValue) withMul.push({ t: "op", v: "*" });
    }
    withMul.push(cur);
  }
  return withMul;
}

function toRPN(tokens: Tok[]): Tok[] {
  const output: Tok[] = [];
  const stack: Tok[] = [];
  let prev: Tok | null = null;

  for (const tok of tokens) {
    if (tok.t === "num" || tok.t === "const") {
      output.push(tok);
    } else if (tok.t === "func") {
      stack.push(tok);
    } else if (tok.t === "fact") {
      output.push(tok);
    } else if (tok.t === "op") {
      let op = tok.v;
      // Detect unary minus/plus.
      const unary = !prev || prev.t === "op" || prev.t === "lp";
      if (unary && op === "-") op = "u-";
      if (unary && op === "+") {
        prev = tok;
        continue; // unary plus is a no-op
      }
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.t === "func" || (top.t === "op" && (PREC[top.v] > PREC[op] || (PREC[top.v] === PREC[op] && !RIGHT.has(op))))) {
          output.push(stack.pop()!);
        } else break;
      }
      stack.push({ t: "op", v: op });
    } else if (tok.t === "lp") {
      stack.push(tok);
    } else if (tok.t === "rp") {
      while (stack.length && stack[stack.length - 1].t !== "lp") output.push(stack.pop()!);
      if (!stack.length) throw new Error("Mismatched parentheses");
      stack.pop(); // remove lp
      if (stack.length && stack[stack.length - 1].t === "func") output.push(stack.pop()!);
    }
    prev = tok;
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.t === "lp") throw new Error("Mismatched parentheses");
    output.push(top);
  }
  return output;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

function applyFunc(name: string, x: number, deg: boolean): number {
  const toRad = (v: number) => (deg ? (v * Math.PI) / 180 : v);
  const fromRad = (v: number) => (deg ? (v * 180) / Math.PI : v);
  switch (name) {
    case "sin": return Math.sin(toRad(x));
    case "cos": return Math.cos(toRad(x));
    case "tan": return Math.tan(toRad(x));
    case "asin": return fromRad(Math.asin(x));
    case "acos": return fromRad(Math.acos(x));
    case "atan": return fromRad(Math.atan(x));
    case "sinh": return Math.sinh(x);
    case "cosh": return Math.cosh(x);
    case "tanh": return Math.tanh(x);
    case "log": return Math.log10(x);
    case "ln": return Math.log(x);
    case "sqrt": return Math.sqrt(x);
    case "cbrt": return Math.cbrt(x);
    case "exp": return Math.exp(x);
    case "abs": return Math.abs(x);
    default: throw new Error(`Unknown function: ${name}`);
  }
}

function evalRPN(rpn: Tok[], deg: boolean): number {
  const st: number[] = [];
  for (const tok of rpn) {
    if (tok.t === "num") st.push(tok.v);
    else if (tok.t === "const") st.push(tok.v === "pi" ? Math.PI : Math.E);
    else if (tok.t === "fact") {
      const a = st.pop();
      if (a === undefined) throw new Error("Invalid expression");
      st.push(factorial(a));
    } else if (tok.t === "func") {
      const a = st.pop();
      if (a === undefined) throw new Error("Invalid expression");
      st.push(applyFunc(tok.v, a, deg));
    } else if (tok.t === "op") {
      if (tok.v === "u-") {
        const a = st.pop();
        if (a === undefined) throw new Error("Invalid expression");
        st.push(-a);
        continue;
      }
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined) throw new Error("Invalid expression");
      switch (tok.v) {
        case "+": st.push(a + b); break;
        case "-": st.push(a - b); break;
        case "*": st.push(a * b); break;
        case "/": st.push(a / b); break;
        case "%": st.push(a % b); break;
        case "^": st.push(Math.pow(a, b)); break;
        default: throw new Error(`Unknown operator: ${tok.v}`);
      }
    }
  }
  if (st.length !== 1) throw new Error("Invalid expression");
  return st[0];
}

export function evaluate(input: string, deg = false): number {
  if (!input.trim()) return NaN;
  return evalRPN(toRPN(tokenize(input)), deg);
}
