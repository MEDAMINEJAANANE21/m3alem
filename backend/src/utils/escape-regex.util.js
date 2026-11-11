// User input must be escaped before being used in a RegExp, otherwise "(.*)+" style
// input could trigger catastrophic backtracking (ReDoS) or match unintended records.
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
