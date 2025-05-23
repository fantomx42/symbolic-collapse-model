import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SCMParameters, SCMCalculatedValues, CollapseZone, TrendDirection, SCMParameterHistory } from '../types';
import { DEFAULT_SCM_PARAMETERS, VARIABLE_DETAILS, COLLAPSE_ZONE_THRESHOLDS } from '../constants';
import { miniPredict } from '../utils/miniPredict';
import { extractSCMFromText } from '../utils/extractSCMFromText';
import { CollapseMeter } from './CollapseMeter';
import { TrendArrow } from './TrendArrow';
import { Sparkline } from './Sparkline';

interface SCMNNPlaygroundProps {
  computeSCM: (params: SCMParameters) => SCMCalculatedValues;
}

const MAX_HISTORY_POINTS_NN = 15; // Shorter history for this playground

const getTrend = (current?: number, previous?: number | null, epsilon = 0.001): TrendDirection => {
  if (current === undefined || previous === undefined || previous === null) return TrendDirection.NONE;
  if (Math.abs(current - previous) < epsilon) return TrendDirection.STABLE;
  if (current > previous) return TrendDirection.UP;
  return TrendDirection.DOWN;
};

export const SCMNNPlayground: React.FC<SCMNNPlaygroundProps> = ({ computeSCM }) => {
  const [inputText, setInputText] = useState<string>('');
  const [rawPrediction, setRawPrediction] = useState<string | null>(null);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  
  const [currentScmParams, setCurrentScmParams] = useState<SCMParameters | null>(null);
  const [currentScmResult, setCurrentScmResult] = useState<SCMCalculatedValues | null>(null);

  const prevScmParamsRef = useRef<SCMParameters | null>(null);
  const prevScmResultRef = useRef<SCMCalculatedValues | null>(null);
  
  const [scmParamsHistory, setScmParamsHistory] = useState<SCMParameterHistory>(() => {
    const initialHistory: SCMParameterHistory = {} as SCMParameterHistory;
    (Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>).forEach(key => {
        initialHistory[key] = []; 
    });
    return initialHistory;
  });

  const handleProcessText = useCallback(() => {
    const prediction = miniPredict(inputText);
    setRawPrediction(prediction);

    const params = extractSCMFromText(inputText, prediction);
    prevScmParamsRef.current = currentScmParams; // Capture before update
    setCurrentScmParams(params);

    const result = computeSCM(params);
    prevScmResultRef.current = currentScmResult; // Capture before update
    setCurrentScmResult(result);

    if (result.zone === CollapseZone.Critical) { // CollapseZone.Critical is "Collapse (Extreme Risk)"
      setFinalOutput(`⚠️ Output suppressed due to high symbolic collapse risk (Effective Zone: ${COLLAPSE_ZONE_THRESHOLDS[result.zone].label}).`);
    } else {
      setFinalOutput(prediction);
    }
  }, [inputText, computeSCM, currentScmParams, currentScmResult]);

  useEffect(() => {
    if (currentScmParams) {
      setScmParamsHistory(prevHistory => {
          const newHistory = { ...prevHistory } as SCMParameterHistory;
          (Object.keys(currentScmParams) as Array<keyof SCMParameters>).forEach(key => {
              const currentValue = currentScmParams[key];
              const historyForKey = prevHistory[key] ? [...prevHistory[key]] : [];
              
              historyForKey.push(currentValue);
              if (historyForKey.length > MAX_HISTORY_POINTS_NN) {
                  historyForKey.shift(); 
              }
              newHistory[key] = historyForKey;
          });
          return newHistory;
      });
    }
  }, [currentScmParams]);


  const renderParamDisplay = (key: keyof SCMParameters) => {
    if (!currentScmParams) return null;
    const detail = VARIABLE_DETAILS[key];
    const value = currentScmParams[key];
    const prevValue = prevScmParamsRef.current?.[key];

    return (
      <div key={key} className="p-2 bg-gray-700 rounded-md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-purple-300">{detail.label.substring(0, detail.label.indexOf('(') > 0 ? detail.label.indexOf('(') -1 : detail.label.length )}</span>
          <div className="flex items-center">
             <TrendArrow direction={getTrend(value, prevValue)} />
             <Sparkline 
                data={scmParamsHistory[key] || []} 
                width={40} 
                height={14} 
                color="#a5b4fc"
                minDomain={detail.min}
                maxDomain={detail.max}
             />
          </div>
        </div>
        <span className="text-lg font-bold text-indigo-300">{value.toFixed(1)} {detail.unit || ''}</span>
      </div>
    );
  };
  
  const renderCalculatedValue = (label: string, currentValue?: number, previousValue?: number | null) => (
    <div className="bg-gray-700 p-2 rounded-md">
      <span className="block text-xs text-gray-400">{label}</span>
      <div className="flex items-center">
        <span className="text-lg font-bold text-indigo-300">{currentValue !== undefined ? currentValue.toFixed(2) : '-'}</span>
        <TrendArrow direction={getTrend(currentValue, previousValue === null ? undefined : previousValue)} />
      </div>
    </div>
  );


  return (
    <div className="space-y-6 p-2 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-700">
      <div>
        <label htmlFor="nn-input" className="block text-sm font-medium text-purple-300 mb-1">
          Enter text for mock analysis:
        </label>
        <textarea
          id="nn-input"
          rows={3}
          className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., BREAKING: Alien intelligence confirms control of Earth governments..."
        />
      </div>
      <button
        onClick={handleProcessText}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
      >
        Process Text & Analyze SCM
      </button>

      {rawPrediction && (
        <div className="mt-4 p-3 bg-gray-700 bg-opacity-50 rounded-md">
          <h4 className="text-md font-semibold text-purple-300 mb-1">Mock NN Raw Prediction:</h4>
          <p className="text-gray-200">{rawPrediction}</p>
        </div>
      )}

      {currentScmParams && currentScmResult && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-md font-semibold text-purple-300 mb-2">Derived SCM Parameters:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {(Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>)
                .filter(k => ['I','S','P','T','E'].includes(k)) // Only core for brevity
                .map(key => renderParamDisplay(key))}
            </div>
             <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-purple-400 hover:text-purple-300">Show all derived SCM parameters...</summary>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {(Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>)
                        .filter(k => !['I','S','P','T','E'].includes(k))
                        .map(key => renderParamDisplay(key))}
                </div>
            </details>
          </div>
           <div>
            <h4 className="text-md font-semibold text-purple-300 mb-2">Derived SCM Calculated Values:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {renderCalculatedValue("Raw (cRaw)", currentScmResult.cRaw, prevScmResultRef.current?.cRaw)}
                {renderCalculatedValue("Time C(t)", currentScmResult.C_t, prevScmResultRef.current?.C_t)}
                {renderCalculatedValue("Resilience (R)", currentScmResult.R, prevScmResultRef.current?.R)}
                {renderCalculatedValue("Effective (cEff)", currentScmResult.cEffective, prevScmResultRef.current?.cEffective)}
            </div>
          </div>

          <CollapseMeter calculatedValues={currentScmResult} />
        </div>
      )}

      {finalOutput && (
        <div className="mt-4 p-4 bg-gray-700 bg-opacity-70 rounded-lg border border-purple-500">
          <h4 className="text-lg font-semibold text-purple-200 mb-2">Final Output (SCM Adjusted):</h4>
          <p className={`text-gray-100 ${currentScmResult?.zone === CollapseZone.Critical ? 'text-red-300 font-bold' : ''}`}>
            {finalOutput}
          </p>
        </div>
      )}
      {!currentScmResult && !rawPrediction && (
         <p className="text-sm text-gray-500 italic mt-4">Enter text and click "Process" to see SCM analysis.</p>
      )}
    </div>
  );
};