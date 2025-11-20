
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

const MAX_HISTORY_POINTS_NN = 15;

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
  const [editableScmParams, setEditableScmParams] = useState<SCMParameters | null>(null);
  const [currentScmResult, setCurrentScmResult] = useState<SCMCalculatedValues | null>(null);

  const prevScmParamsRef = useRef<SCMParameters | null>(null);
  const prevScmResultRef = useRef<SCMCalculatedValues | null>(null);

  const [scmParamsHistory, setScmParamsHistory] = useState<SCMParameterHistory>(() => {
    const initialHistory: SCMParameterHistory = {} as SCMParameterHistory;
    (Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>).forEach(key => {
        if (key !== 'baseline') {
            initialHistory[key] = [];
        }
    });
    return initialHistory;
  });

  const processAndSetResults = (paramsToProcess: SCMParameters, basePrediction: string | null) => {
    prevScmParamsRef.current = currentScmParams;
    setCurrentScmParams(paramsToProcess);
    setEditableScmParams(JSON.parse(JSON.stringify(paramsToProcess)));

    const result = computeSCM(paramsToProcess);
    prevScmResultRef.current = currentScmResult;
    setCurrentScmResult(result);

    if (result.zone === CollapseZone.Critical) {
      setFinalOutput(`⚠️ Output suppressed due to high symbolic collapse risk (Zone: ${COLLAPSE_ZONE_THRESHOLDS[result.zone].label}).`);
    } else {
      setFinalOutput(basePrediction);
    }
  };

  const handleProcessText = useCallback(() => {
    const prediction = miniPredict(inputText);
    setRawPrediction(prediction);

    const derivedParams = extractSCMFromText(inputText, prediction);
    processAndSetResults(derivedParams, prediction);
  }, [inputText, computeSCM]);

  const handleReEvaluate = useCallback(() => {
    if (editableScmParams) {
      processAndSetResults(editableScmParams, rawPrediction);
    }
  }, [editableScmParams, rawPrediction, computeSCM]);


  const handleEditableParamChange = (key: keyof SCMParameters, value: string) => {
    if (editableScmParams) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const detail = VARIABLE_DETAILS[key];
        let constrainedValue = numValue;
        if (detail.min !== undefined) constrainedValue = Math.max(detail.min, constrainedValue);
        if (detail.max !== undefined) constrainedValue = Math.min(detail.max, constrainedValue);

        setEditableScmParams({
          ...editableScmParams,
          [key]: constrainedValue,
        });
      }
    }
  };

  useEffect(() => {
    if (currentScmParams) {
      setScmParamsHistory(prevHistory => {
          const newHistory = { ...prevHistory } as SCMParameterHistory;
          (Object.keys(currentScmParams) as Array<keyof SCMParameters>).forEach(key => {
              if (key !== 'baseline') {
                  const currentValue = currentScmParams[key] as number;
                  const historyForKey = prevHistory[key] ? [...prevHistory[key]] : [];

                  historyForKey.push(currentValue);
                  if (historyForKey.length > MAX_HISTORY_POINTS_NN) {
                      historyForKey.shift();
                  }
                  newHistory[key] = historyForKey;
              }
          });
          return newHistory;
      });
    }
  }, [currentScmParams]);


  const renderParamDisplayOrInput = (key: keyof SCMParameters) => {
    if (!editableScmParams || key === 'baseline') return null;
    const detail = VARIABLE_DETAILS[key];
    const value = editableScmParams[key] as number;
    const prevValueForTrend = prevScmParamsRef.current?.[key] as number | undefined;
    const currentDisplayValue = currentScmParams?.[key] as number | undefined;

    return (
      <div key={key} className="p-2 bg-gray-700 rounded-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor={`edit-${key}`} className="text-xs text-purple-300 cursor-pointer">
                {detail.label.substring(0, detail.label.indexOf('(') > 0 ? detail.label.indexOf('(') -1 : detail.label.length )}
            </label>
            <div className="flex items-center">
                <TrendArrow direction={getTrend(currentDisplayValue, prevValueForTrend)} />
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
        </div>
        <input
            type="number"
            id={`edit-${key}`}
            value={value.toFixed(detail.step === 0.1 ? 1 : 0)}
            min={detail.min}
            max={detail.max}
            step={detail.step}
            onChange={(e) => handleEditableParamChange(key, e.target.value)}
            className="w-full p-1 text-lg font-bold text-indigo-300 bg-gray-600 border border-gray-500 rounded focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
            aria-label={`Edit ${detail.label}`}
        />
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
      <div className="flex space-x-3">
        <button
          onClick={handleProcessText}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          Process Text & Analyze SCM
        </button>
        {editableScmParams && (
            <button
            onClick={handleReEvaluate}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition-colors focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
            title="Re-calculate SCM results using any manually adjusted parameters below."
            >
            Re-evaluate SCM with Adjusted Params
            </button>
        )}
      </div>

      {rawPrediction && (
        <div className="mt-4 p-3 bg-gray-700 bg-opacity-50 rounded-md">
          <h4 className="text-md font-semibold text-purple-300 mb-1">Mock NN Raw Prediction:</h4>
          <p className="text-gray-200">{rawPrediction}</p>
        </div>
      )}

      {editableScmParams && currentScmResult && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-md font-semibold text-purple-300 mb-2">Derived & Editable SCM Parameters:</h4>
             <p className="text-xs text-gray-400 mb-2">These SCM parameters were derived from the text. You can edit them and click "Re-evaluate SCM" to see the impact.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {(Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>)
                .map(key => renderParamDisplayOrInput(key))}
            </div>
          </div>
           <div>
            <h4 className="text-md font-semibold text-purple-300 mb-2">SCM Calculated Values (based on above parameters):</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {renderCalculatedValue("Stability (Σ)", currentScmResult.stability_score, prevScmResultRef.current?.stability_score)}
                {renderCalculatedValue("Collapse Pressure (CP)", currentScmResult.collapse_pressure, prevScmResultRef.current?.collapse_pressure)}
                {renderCalculatedValue("Confidence (C)", currentScmResult.confidence, prevScmResultRef.current?.confidence)}
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
