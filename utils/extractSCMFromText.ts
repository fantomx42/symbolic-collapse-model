import { SCMParameters } from '../types'; // Ensure using SCMParameters
import { DEFAULT_SCM_PARAMETERS } from '../constants';

export function extractSCMFromText(text: string, label: string): SCMParameters {
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length; // filter(Boolean) to handle multiple spaces
  const symbolCount = (text.match(/[^\w\s]/g) || []).length;
  const uniqueCharCount = new Set(text).size;

  // Heuristics for overload:
  // - Very long text.
  // - High number of symbols.
  // - High number of unique characters (can indicate randomness or wide vocabulary, but also noise).
  // - Presence of control characters (Cc) or specific symbol characters (Sc - e.g., currency).
  const overload =
    charCount > 500 ||
    symbolCount > 80 || 
    (uniqueCharCount > 80 && charCount > 100) || // More unique chars than typical for coherent text of this length
    (charCount > 0 && symbolCount / charCount > 0.3 && charCount > 30) || // High ratio of symbols
    (wordCount > 0 && charCount / wordCount < 2.5 && charCount > 50 && symbolCount > 10) || // Very short "words", likely noise
    /[\p{Cc}\p{Sc}]/u.test(text); // Detects control chars or currency symbols

  return {
    I: overload ? 10 : (label === "Conspiracy" ? 8 : 6), // Base I, higher for overload/conspiracy
    S: overload ? 9.5 : (label === "Conspiracy" ? 7 : 5), // Base S, higher for overload/conspiracy
    P: label === "Conspiracy" ? 9 : (overload ? 7 : 5), // Base P, higher for conspiracy/overload
    T: overload ? 1.2 : (label === "Conspiracy" ? 3 : 6.5), // Base T, lower for overload/conspiracy
    E: overload ? 1.3 : (label === "Conspiracy" ? 2.5 : 7), // Base E, lower for overload/conspiracy
    
    // Ensure these match SCMParameters type definition and DEFAULT_SCM_PARAMETERS keys
    lambda: DEFAULT_SCM_PARAMETERS.lambda,
    time: DEFAULT_SCM_PARAMETERS.time,
    R_memory: DEFAULT_SCM_PARAMETERS.R_memory,
    R_redundancy: DEFAULT_SCM_PARAMETERS.R_redundancy,
    R_anchoring: DEFAULT_SCM_PARAMETERS.R_anchoring,
  };
}
