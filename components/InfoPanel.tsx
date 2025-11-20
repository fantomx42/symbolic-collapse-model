
import React from 'react';
import { SCMCalculatedValues, CollapseZone } from '../types';
import { VARIABLE_DETAILS, COLLAPSE_ZONE_THRESHOLDS } from '../constants';

interface InfoPanelProps {
  calculatedValues: SCMCalculatedValues;
}

/**
 * A React component that displays detailed information about the SCM.
 *
 * This component displays the core SCM formula, variable definitions, the
 * extended mathematical framework, and the collapse thresholds and zones.
 *
 * @param {InfoPanelProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const InfoPanel: React.FC<InfoPanelProps> = ({ calculatedValues }) => {
  return (
    <div className="space-y-6 text-gray-300">
      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Core Stability Score (Σ)</h3>
        <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md font-mono text-indigo-300 text-center text-lg">
          Σ = (T + E + S + I) / 4 - P
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Variable Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(VARIABLE_DETAILS)
            .filter(([key]) => ['T', 'E', 'S', 'I', 'P'].includes(key))
            .map(([key, detail]) => (
            <div key={key} className="p-3 bg-gray-700 bg-opacity-40 rounded-md border border-gray-600">
              <strong className="text-purple-300">{detail.label}:</strong>
              <p className="text-sm text-gray-400">{detail.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Collapse Thresholds and Zones</h3>
        <div className="space-y-2">
          {(Object.keys(COLLAPSE_ZONE_THRESHOLDS) as CollapseZone[]).map(zoneKey => {
            const zoneDetails = COLLAPSE_ZONE_THRESHOLDS[zoneKey];
            return (
              <div
                key={zoneKey}
                className={`p-3 rounded-md flex justify-between items-center ${zoneDetails.color} text-white ${calculatedValues.zone === zoneKey ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
              >
                <span>{zoneDetails.label}</span>
                <span className="font-mono text-sm">
                  Σ: {zoneDetails.min.toFixed(2)} to {zoneDetails.max.toFixed(2)}
                </span>
              </div>
            );
          })}
           <p className="text-sm text-gray-400 mt-2">
            Current Zone (Σ: <strong className="text-indigo-200">{calculatedValues.stability_score.toFixed(2)}</strong>):
            <strong className={`ml-1 px-2 py-1 rounded-md ${COLLAPSE_ZONE_THRESHOLDS[calculatedValues.zone].color} text-white`}>
              {COLLAPSE_ZONE_THRESHOLDS[calculatedValues.zone].label}
            </strong>
           </p>
        </div>
      </div>
    </div>
  );
};
