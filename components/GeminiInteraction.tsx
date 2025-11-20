
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { SCMParameters } from '../types';

interface GeminiInteractionProps {
  scmParams: SCMParameters;
  geminiModel: string;
}

export const GeminiInteraction: React.FC<GeminiInteractionProps> = ({ scmParams, geminiModel }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.API_KEY;

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    if (!apiKey) {
      setError("API key is not configured. Please set the API_KEY environment variable.");
      console.error("API_KEY environment variable not set.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const ai = new GoogleGenAI({apiKey});

      const systemInstruction = `You are an AI assistant. Respond to the user's prompt.
Be mindful of the current Symbolic Collapse Model (SCM) v3.1 context:
- Timelessness (T): ${scmParams.T.toFixed(2)} (how well the symbol withstands time)
- Emotional Energy (E): ${scmParams.E.toFixed(2)} (the emotional charge of the symbol)
- Structural Coherence (S): ${scmParams.S.toFixed(2)} (how well-formed and internally consistent the symbol is)
- Interpretive Flexibility (I): ${scmParams.I.toFixed(2)} (how easily the symbol can be interpreted in different ways)
- Parasitic Load (P): ${scmParams.P.toFixed(2)} (the degree to which the symbol is weighed down by negative connotations)
Generate a response that would ideally score well on these SCM metrics, balancing clarity and informativeness.
If SCM parameters suggest high risk (e.g. low T, low E, low S, high P), be particularly careful to produce a clear, grounded, and coherent response.`;

      const result: GenerateContentResponse = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      
      setResponse(result.text);

    } catch (e: any) {
      console.error("Gemini API error:", e);
      setError(`Failed to get response from AI: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, scmParams, geminiModel, apiKey]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="gemini-prompt" className="block text-sm font-medium text-purple-300 mb-1">
          Enter your prompt for Gemini AI:
        </label>
        <textarea
          id="gemini-prompt"
          rows={4}
          className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Explain the SCM v3.1 concept in simple terms."
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading || !apiKey}
        className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-150 ease-in-out
          ${isLoading || !apiKey
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 shadow-lg hover:shadow-indigo-500/50'
          }`}
      >
        {isLoading ? 'Processing...' : 'Generate Response'}
      </button>

      {!apiKey && (
        <div className="p-3 bg-yellow-700 bg-opacity-50 border border-yellow-500 rounded-md text-yellow-200 text-sm">
          <strong>Warning:</strong> API_KEY environment variable is not set. Gemini AI functionality is disabled.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-700 bg-opacity-50 border border-red-500 rounded-md text-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Gemini AI Response:</h4>
          <div className="p-4 bg-gray-700 bg-opacity-40 border border-gray-600 rounded-lg whitespace-pre-wrap text-gray-200 leading-relaxed shadow-inner">
            {response}
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-700 bg-opacity-30 border border-gray-600 rounded-lg">
        <h4 className="text-md font-semibold text-purple-300 mb-2">SCM Contextual Note:</h4>
        <p className="text-sm text-gray-400">
          The AI was instructed to consider the following SCM parameters you've set:
          T: <span className="font-bold text-indigo-300">{scmParams.T.toFixed(2)}</span>,
          E: <span className="font-bold text-indigo-300">{scmParams.E.toFixed(2)}</span>,
          S: <span className="font-bold text-indigo-300">{scmParams.S.toFixed(2)}</span>,
          I: <span className="font-bold text-indigo-300">{scmParams.I.toFixed(2)}</span>,
          P: <span className="font-bold text-indigo-300">{scmParams.P.toFixed(2)}</span>.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          This helps simulate how an AI might adapt its communication style based on perceived symbolic environment conditions.
        </p>
      </div>
    </div>
  );
};
