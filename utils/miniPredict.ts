/**
 * A mock neural network prediction function.
 *
 * This function takes a string as input and returns a prediction of the
 * topic of the string.
 *
 * @param {string} input - The input string.
 * @returns {string} The predicted topic of the string.
 */
export function miniPredict(input: string): string {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("alien") || lowerInput.includes("ufo") || lowerInput.includes("conspiracy")) return "Conspiracy";
  if (lowerInput.includes("tax") || lowerInput.includes("government") || lowerInput.includes("election")) return "Politics";
  if (lowerInput.includes("happy") || lowerInput.includes("sad") || lowerInput.includes("love")) return "General Sentiment";
  return "General Inquiry";
}
