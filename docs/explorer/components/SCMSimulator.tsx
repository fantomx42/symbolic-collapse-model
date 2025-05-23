import React from 'react';
import { SCMParameters, SCMCalculatedValues, TrendDirection, SCMParameterHistory } from '../types';
import { VariableSlider } from './VariableSlider';
import { VARIABLE_DETAILS } from '../constants';
import { TrendArrow } from './TrendArrow';
import { Sparkline } from './Sparkline'; // Import Sparkline

interface SCMSimulatorProps {
  params: SCMParameters;
  previousParams: SCMParameters | null;
  dispatchParams: React.Dispatch<{ type: 'SET_PARAM'; key: keyof SCMParameters; value: number }>;
  calculatedValues: SCMCalculatedValues;
  previousCalculatedValues: SCMCalculatedValues | null;
  scmParamsHistory: SCMParameterHistory; // Add history prop
}

const getTrend = (current?: number, previous?: number, epsilon = 0.001): TrendDirection => {
  if (current === undefined || previous === undefined || previous === null) return TrendDirection.NONE;
  if (Math.abs(current - previous) < epsilon) return TrendDirection.STABLE;
  if (current > previous) return TrendDirection.UP;
  return TrendDirection.DOWN;
};


export const SCMSimulator: React.FC<SCMSimulatorProps> = ({ 
  params, 
  previousParams, 
  dispatchParams, 
  calculatedValues,
  previousCalculatedValues,
  scmParamsHistory 
}) => {
  
  const handleChange = (key: keyof SCMParameters, value: number) => {
    dispatchParams({ type: 'SET_PARAM', key, value });
  };

  const coreParamKeys: Array<keyof SCMParameters> = ['I', 'S', 'P', 'T', 'E'];
  const advancedParamKeys: Array<keyof SCMParameters> = ['lambda', 'time', 'R_memory', 'R_redundancy', 'R_anchoring'];

  const renderCalculatedValue = (label: string, currentValue: number, previousValue?: number | null) => (
    <div className="bg-gray-700 p-3 rounded-lg">
      <span className="block text-xs text-gray-400">{label}</span>
      <div className="flex items-center">
        <span className="text-xl font-bold text-indigo-300">{currentValue.toFixed(3)}</span>
        <TrendArrow direction={getTrend(currentValue, previousValue === null ? undefined : previousValue)} />
      </div>
    </div>
  );
  
  const renderParamSliderWithExtras = (key: keyof SCMParameters) => {
    const detail = VARIABLE_DETAILS[key];
    return (
      <div key={key} className="py-1"> {/* Outer container for each param row */}
        <div className="flex items-center justify-between mb-1">
            <label htmlFor={key} className="block text-sm font-medium text-purple-300">
                {detail.label}: <span className="text-indigo-300 font-bold">{params[key].toFixed(detail.step && detail.step < 1 ? 1 : 0)} {detail.unit}</span>
            </label>
            <div className="flex items-center">
                <TrendArrow direction={getTrend(params[key], previousParams?.[key])} />
                <Sparkline 
                    data={scmParamsHistory[key] || []} 
                    width={50} 
                    height={16} 
                    color="#a5b4fc" // Tailwind's indigo-300
                    minDomain={detail.min} // Use min/max from VARIABLE_DETAILS for y-axis scaling
                    maxDomain={detail.max}
                />
            </div>
        </div>
        {detail.description && <p className="text-xs text-gray-400 mb-1">{detail.description}</p>}
        <input
            type="range"
            id={key}
            name={key}
            min={detail.min}
            max={detail.max}
            step={detail.step}
            value={params[key]}
            onChange={(e) => handleChange(key, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-colors"
        />
      </div>
    );
  };


  return (
    <div>
      <h3 className="text-xl font-semibold text-purple-300 mb-4">Adjust SCM Parameters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1"> {/* Reduced gap-y */}
        {coreParamKeys.map(renderParamSliderWithExtras)}
      </div>

      <details className="mt-4 group" role="group" aria-label="Advanced SCM dynamics parameters">
        <summary className="text-lg font-semibold text-purple-300 hover:text-purple-200 cursor-pointer list-none flex items-center py-2">
          Advanced Dynamics
          <span className="ml-2 transform transition-transform duration-200 group-open:rotate-90">&#9656;</span>
        </summary>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 p-4 bg-gray-700 bg-opacity-30 rounded-md"> {/* Reduced gap-y */}
          {advancedParamKeys.map(renderParamSliderWithExtras)}
        </div>
      </details>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Calculated SCM Values</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {renderCalculatedValue("Raw Collapse (cRaw)", calculatedValues.cRaw, previousCalculatedValues?.cRaw)}
          {renderCalculatedValue("Time-Dependent C(t)", calculatedValues.C_t, previousCalculatedValues?.C_t)}
          {renderCalculatedValue("Resilience Factor (R)", calculatedValues.R, previousCalculatedValues?.R)}
          {renderCalculatedValue("Effective C (cEff)", calculatedValues.cEffective, previousCalculatedValues?.cEffective)}
        </div>
      </div>
    </div>
  );
};