
import { SCMParameters } from '../types';
import { DEFAULT_SCM_PARAMETERS } from '../constants';

/**
 * Extracts SCM parameters from a given text and label.
 *
 * This function uses a set of heuristics to derive SCM parameters from a
 * given text and a label. The heuristics are based on the length of the
 * text, the number of words, the number of symbols, and the number of
 * unique characters.
 *
 * @param {string} text - The text to extract the SCM parameters from.
 * @param {string} label - The label of the text.
 * @returns {SCMParameters} The extracted SCM parameters.
 */
export function extractSCMFromText(text: string, label: string): SCMParameters {
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const symbolCount = (text.match(/[^\w\s]/g) || []).length;
  const uniqueCharCount = new Set(text).size;

  const overload =
    charCount > 500 ||
    symbolCount > 80 ||
    (uniqueCharCount > 80 && charCount > 100) ||
    (charCount > 0 && symbolCount / charCount > 0.3 && charCount > 30) ||
    (wordCount > 0 && charCount / wordCount < 2.5 && charCount > 50 && symbolCount > 10) ||
    /[\p{Cc}\p{Sc}]/u.test(text);

  return {
    ...DEFAULT_SCM_PARAMETERS,
    T: overload ? 0.1 : (label === "Conspiracy" ? 0.3 : 0.7),
    E: overload ? 0.1 : (label === "Conspiracy" ? 0.2 : 0.7),
    S: overload ? 0.1 : (label === "Conspiracy" ? 0.2 : 0.7),
    I: overload ? 0.9 : (label === "Conspiracy" ? 0.8 : 0.6),
    P: label === "Conspiracy" ? 0.9 : (overload ? 0.7 : 0.3),
  };
}
