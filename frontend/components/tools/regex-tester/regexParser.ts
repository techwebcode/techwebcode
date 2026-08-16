export interface RegexToken {
  token: string;
  type: string;
  description: string;
  detail?: string;
}

export interface DiagnosticResult {
  hasMatch: boolean;
  reason?: string;
  suggestion?: string;
}

/**
 * Tokenizes a regex pattern string into human-friendly explanations.
 */
export function parseRegexTokens(pattern: string): RegexToken[] {
  if (!pattern) return [];

  const tokens: RegexToken[] = [];
  let i = 0;
  const len = pattern.length;

  while (i < len) {
    const char = pattern[i];

    // Anchors
    if (char === "^") {
      tokens.push({
        token: "^",
        type: "Anchor",
        description: "Start of string / line",
        detail: "Asserts position at the beginning of the string (or line in multiline mode).",
      });
      i++;
      continue;
    }

    if (char === "$") {
      tokens.push({
        token: "$",
        type: "Anchor",
        description: "End of string / line",
        detail: "Asserts position at the end of the string (or line in multiline mode).",
      });
      i++;
      continue;
    }

    // Escaped sequences
    if (char === "\\") {
      if (i + 1 < len) {
        const next = pattern[i + 1];
        const seq = "\\" + next;

        switch (next) {
          case "d":
            tokens.push({
              token: "\\d",
              type: "Character Class",
              description: "Digit (0-9)",
              detail: "Matches any ASCII digit between 0 and 9.",
            });
            break;
          case "D":
            tokens.push({
              token: "\\D",
              type: "Character Class",
              description: "Non-digit",
              detail: "Matches any character that is NOT an ASCII digit.",
            });
            break;
          case "w":
            tokens.push({
              token: "\\w",
              type: "Character Class",
              description: "Word character",
              detail: "Matches any letter, digit, or underscore [a-zA-Z0-9_].",
            });
            break;
          case "W":
            tokens.push({
              token: "\\W",
              type: "Character Class",
              description: "Non-word character",
              detail: "Matches any character that is NOT a letter, digit, or underscore.",
            });
            break;
          case "s":
            tokens.push({
              token: "\\s",
              type: "Character Class",
              description: "Whitespace",
              detail: "Matches space, tab, newline, or carriage return.",
            });
            break;
          case "S":
            tokens.push({
              token: "\\S",
              type: "Character Class",
              description: "Non-whitespace",
              detail: "Matches any character that is NOT whitespace.",
            });
            break;
          case "b":
            tokens.push({
              token: "\\b",
              type: "Anchor",
              description: "Word boundary",
              detail: "Asserts position at the start or end of a word.",
            });
            break;
          case "B":
            tokens.push({
              token: "\\B",
              type: "Anchor",
              description: "Non-word boundary",
              detail: "Asserts position NOT at a word boundary.",
            });
            break;
          default:
            tokens.push({
              token: seq,
              type: "Escaped Character",
              description: `Literal character '${next}'`,
              detail: `Matches the literal character '${next}'`,
            });
            break;
        }
        i += 2;
        continue;
      }
    }

    // Lookarounds & Groups
    if (char === "(") {
      // Check for special group prefixes
      if (pattern.slice(i, i + 3) === "(?:") {
        tokens.push({
          token: "(?:...)",
          type: "Group",
          description: "Non-capturing group",
          detail: "Groups sub-expressions without saving match memory for extraction.",
        });
        i += 3;
        continue;
      }

      if (pattern.slice(i, i + 3) === "(?=") {
        tokens.push({
          token: "(?=...)",
          type: "Lookaround",
          description: "Positive lookahead",
          detail: "Asserts that the following sub-pattern matches ahead without consuming characters.",
        });
        i += 3;
        continue;
      }

      if (pattern.slice(i, i + 3) === "(?!") {
        tokens.push({
          token: "(?!...)",
          type: "Lookaround",
          description: "Negative lookahead",
          detail: "Asserts that the following sub-pattern does NOT match ahead.",
        });
        i += 3;
        continue;
      }

      if (pattern.slice(i, i + 4) === "(?<=") {
        tokens.push({
          token: "(?<=...)",
          type: "Lookaround",
          description: "Positive lookbehind",
          detail: "Asserts that the preceding sub-pattern matches behind.",
        });
        i += 4;
        continue;
      }

      if (pattern.slice(i, i + 4) === "(?<!") {
        tokens.push({
          token: "(?<!...)",
          type: "Lookaround",
          description: "Negative lookbehind",
          detail: "Asserts that the preceding sub-pattern does NOT match behind.",
        });
        i += 4;
        continue;
      }

      // Check for named capture group (?<name>...)
      const namedMatch = pattern.slice(i).match(/^\(\?<([a-zA-Z0-9_]+)>/);
      if (namedMatch) {
        tokens.push({
          token: `(?<${namedMatch[1]}>...)`,
          type: "Named Group",
          description: `Named capture group '${namedMatch[1]}'`,
          detail: `Captures matched substring under the group name '${namedMatch[1]}'.`,
        });
        i += namedMatch[0].length;
        continue;
      }

      tokens.push({
        token: "(...)",
        type: "Group",
        description: "Capturing group",
        detail: "Groups sub-expressions and captures matched text for extraction.",
      });
      i++;
      continue;
    }

    if (char === ")") {
      i++;
      continue;
    }

    // Custom Character Class [...]
    if (char === "[") {
      let closeIdx = pattern.indexOf("]", i);
      if (closeIdx !== -1) {
        const content = pattern.slice(i, closeIdx + 1);
        const isNegated = content.startsWith("[^");
        tokens.push({
          token: content,
          type: "Character Class",
          description: isNegated ? "Negated character set" : "Character set",
          detail: isNegated
            ? `Matches any single character EXCEPT those in '${content}'`
            : `Matches any single character listed in '${content}'`,
        });
        i = closeIdx + 1;
        continue;
      }
    }

    // Quantifiers
    if (char === "+") {
      tokens.push({
        token: "+",
        type: "Quantifier",
        description: "One or more times",
        detail: "Matches 1 or more occurrences of the preceding token (greedy).",
      });
      i++;
      continue;
    }

    if (char === "*") {
      tokens.push({
        token: "*",
        type: "Quantifier",
        description: "Zero or more times",
        detail: "Matches 0 or more occurrences of the preceding token (greedy).",
      });
      i++;
      continue;
    }

    if (char === "?") {
      tokens.push({
        token: "?",
        type: "Quantifier",
        description: "Optional (0 or 1 time)",
        detail: "Makes the preceding token optional.",
      });
      i++;
      continue;
    }

    // Range Quantifier {n,m}
    if (char === "{") {
      const matchRange = pattern.slice(i).match(/^\{(\d+)(,(\d+)?)?\}/);
      if (matchRange) {
        const fullRange = matchRange[0];
        const min = matchRange[1];
        const hasComma = matchRange[2] !== undefined;
        const max = matchRange[3];

        let desc = `Exactly ${min} times`;
        if (hasComma) {
          if (max !== undefined) {
            desc = `Between ${min} and ${max} times`;
          } else {
            desc = `At least ${min} times`;
          }
        }

        tokens.push({
          token: fullRange,
          type: "Quantifier",
          description: desc,
          detail: `Repeats the preceding token ${desc.toLowerCase()}.`,
        });
        i += fullRange.length;
        continue;
      }
    }

    // Any Character wildcard .
    if (char === ".") {
      tokens.push({
        token: ".",
        type: "Wildcard",
        description: "Any character",
        detail: "Matches any single character except newline.",
      });
      i++;
      continue;
    }

    // Alternation |
    if (char === "|") {
      tokens.push({
        token: "|",
        type: "Alternation",
        description: "OR operator",
        detail: "Acts as a logical OR between expression branches.",
      });
      i++;
      continue;
    }

    // Literal Characters
    tokens.push({
      token: char,
      type: "Literal",
      description: `Literal '${char}'`,
      detail: `Matches character '${char}' exactly.`,
    });
    i++;
  }

  return tokens;
}

/**
 * Generates a concise human-readable summary sentence of what the regex does.
 */
export function generatePlainEnglish(pattern: string): string {
  if (!pattern || pattern.trim() === "") return "Empty pattern matching all text.";

  const tokens = parseRegexTokens(pattern);
  if (tokens.length === 0) return "Valid regular expression pattern.";

  const parts: string[] = [];

  if (tokens.some((t) => t.token === "^")) {
    parts.push("starts with");
  }

  const lookaheads = tokens.filter((t) => t.type === "Lookaround" || t.type === "Named Group");
  if (lookaheads.length > 0) {
    parts.push("requires specific pattern conditions");
  }

  const classes = tokens.filter((t) => t.type === "Character Class" || t.type === "Literal");
  if (classes.length > 0) {
    parts.push("matches characters and terms");
  }

  if (tokens.some((t) => t.token === "$")) {
    parts.push("ends at the string boundary");
  }

  if (parts.length === 0) {
    return "Matches text strings matching the specified regular expression structure.";
  }

  return `Matches text string that ${parts.join(" and ")}.`;
}

/**
 * Provides helpful diagnostic feedback when a pattern fails to match text.
 */
export function diagnoseNoMatch(
  pattern: string,
  flags: string,
  testText: string
): DiagnosticResult {
  if (!pattern || !testText) {
    return { hasMatch: false };
  }

  try {
    const regex = new RegExp(pattern, flags);
    if (regex.test(testText)) {
      return { hasMatch: true };
    }
  } catch {
    return {
      hasMatch: false,
      reason: "Invalid Regular Expression Syntax",
      suggestion: "Check for unclosed brackets [], parentheses (), or invalid quantifiers.",
    };
  }

  // 1. Check case sensitivity mismatch
  try {
    const ignoreCaseRegex = new RegExp(pattern, flags.includes("i") ? flags : flags + "i");
    if (ignoreCaseRegex.test(testText)) {
      return {
        hasMatch: false,
        reason: "Case Sensitivity Mismatch",
        suggestion: "Your pattern is case-sensitive. Enable the Case-Insensitive (i) flag or adjust letter casing.",
      };
    }
  } catch {
    // Ignore
  }

  // 2. Check anchor restrictions (^ or $)
  if (pattern.startsWith("^") || pattern.endsWith("$")) {
    try {
      const strippedPattern = pattern.replace(/^\^/, "").replace(/\$$/, "");
      const strippedRegex = new RegExp(strippedPattern, flags);
      if (strippedRegex.test(testText)) {
        return {
          hasMatch: false,
          reason: "String Anchor Restriction Mismatch (^ or $)",
          suggestion:
            "The pattern matches a substring in your input, but '^' or '$' anchors require matching from the absolute start or end of the string.",
        };
      }
    } catch {
      // Ignore
    }
  }

  // 3. Check digit count or length issues (e.g. ^\d{5}$ vs "1234")
  const digitRangeMatch = pattern.match(/\\d\{(\d+)\}/);
  if (digitRangeMatch) {
    const expectedCount = parseInt(digitRangeMatch[1], 10);
    const actualDigits = (testText.match(/\d/g) || []).length;
    if (actualDigits > 0 && actualDigits !== expectedCount) {
      return {
        hasMatch: false,
        reason: `Digit Count Mismatch`,
        suggestion: `Pattern requires exactly ${expectedCount} digits, but your test input contains ${actualDigits} digits.`,
      };
    }
  }

  // 4. Check uppercase requirement (?=.*[A-Z])
  if (pattern.includes("[A-Z]") || pattern.includes("(?=.*[A-Z])")) {
    const hasUpper = /[A-Z]/.test(testText);
    if (!hasUpper) {
      return {
        hasMatch: false,
        reason: "Missing Required Uppercase Letter [A-Z]",
        suggestion: "The pattern requires at least one uppercase letter [A-Z], but none was found in test text.",
      };
    }
  }

  // 5. Default diagnostic
  return {
    hasMatch: false,
    reason: "No Match Found",
    suggestion:
      "The test input string does not satisfy all character sequences, anchors, or lookahead constraints in the regular expression.",
  };
}
