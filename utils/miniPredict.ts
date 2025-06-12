// Mock neural network prediction function
export function miniPredict(input: string): string {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("alien") || lowerInput.includes("ufo") || lowerInput.includes("conspiracy")) return "Conspiracy";
  if (lowerInput.includes("tax") || lowerInput.includes("government") || lowerInput.includes("election")) return "Politics";
  if (lowerInput.includes("happy") || lowerInput.includes("sad") || lowerInput.includes("love")) return "General Sentiment";
  return "General Inquiry";
}
