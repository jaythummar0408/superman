/** Lightweight, dependency-free password analysis (entropy + heuristics). */

export interface PasswordAnalysis {
  score: 0 | 1 | 2 | 3 | 4;
  entropy: number;
  crackTime: string;
  suggestions: string[];
}

const COMMON = new Set([
  "password", "123456", "123456789", "12345678", "qwerty", "abc123", "password1",
  "111111", "1234567", "letmein", "admin", "welcome", "monkey", "iloveyou", "dragon",
]);

function charsetSize(pw: string): number {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 33;
  return size || 1;
}

/** Human-readable estimate assuming ~10 billion guesses/sec (offline fast attacker). */
function formatCrackTime(entropy: number): string {
  const guesses = Math.pow(2, entropy) / 2; // average guesses to crack
  const seconds = guesses / 1e10;
  if (seconds < 1) return "instantly";
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [365, "day"],
    [100, "year"],
  ];
  let value = seconds;
  let unit = "second";
  for (const [factor, name] of units) {
    if (value < factor) {
      unit = name;
      break;
    }
    value /= factor;
    unit = name;
  }
  if (unit === "year" && value >= 100) {
    if (value >= 1e6) return "centuries";
    return `${Math.round(value)} years`;
  }
  const rounded = value < 10 ? Math.round(value * 10) / 10 : Math.round(value);
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"}`;
}

export function analyzePassword(pw: string): PasswordAnalysis {
  if (!pw) return { score: 0, entropy: 0, crackTime: "instantly", suggestions: ["Enter a password to analyze."] };

  const size = charsetSize(pw);
  let entropy = pw.length * Math.log2(size);

  const suggestions: string[] = [];
  const lower = pw.toLowerCase();

  // Penalties for weak patterns.
  if (COMMON.has(lower)) {
    entropy = Math.min(entropy, 12);
    suggestions.push("This is a very common password — choose something unique.");
  }
  if (/^(.)\1+$/.test(pw)) {
    entropy = Math.min(entropy, 10);
    suggestions.push("Avoid repeating a single character.");
  }
  if (/^(0123|1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(pw)) {
    entropy = Math.min(entropy, 16);
    suggestions.push("Avoid sequential characters like 1234 or abcd.");
  }

  // Constructive tips.
  if (pw.length < 12) suggestions.push("Use at least 12 characters.");
  if (!/[A-Z]/.test(pw)) suggestions.push("Add uppercase letters.");
  if (!/[a-z]/.test(pw)) suggestions.push("Add lowercase letters.");
  if (!/[0-9]/.test(pw)) suggestions.push("Add numbers.");
  if (!/[^a-zA-Z0-9]/.test(pw)) suggestions.push("Add symbols (e.g. !@#$%).");

  let score: PasswordAnalysis["score"];
  if (entropy < 28) score = 0;
  else if (entropy < 40) score = 1;
  else if (entropy < 60) score = 2;
  else if (entropy < 100) score = 3;
  else score = 4;

  if (suggestions.length === 0) suggestions.push("Excellent — this is a strong password.");

  return {
    score,
    entropy: Math.round(entropy),
    crackTime: formatCrackTime(entropy),
    suggestions,
  };
}
