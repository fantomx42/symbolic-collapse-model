
import React from 'react';
import { SCMCalculatedValues, CollapseZone } from '../types';
import { VARIABLE_DETAILS, COLLAPSE_ZONE_THRESHOLDS } from '../constants';

interface InfoPanelProps {
  calculatedValues: SCMCalculatedValues;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ calculatedValues }) => {
  // Determine the zone based on cRaw for this panel's display
  let cRawDisplayZone = CollapseZone.Low;
  if (calculatedValues.cRaw >= COLLAPSE_ZONE_THRESHOLDS[CollapseZone.Critical].min) {
    cRawDisplayZone = CollapseZone.Critical;
  } else if (calculatedValues.cRaw >= COLLAPSE_ZONE_THRESHOLDS[CollapseZone.High].min) {
    cRawDisplayZone = CollapseZone.High;
  } else if (calculatedValues.cRaw >= COLLAPSE_ZONE_THRESHOLDS[CollapseZone.Moderate].min) {
    cRawDisplayZone = CollapseZone.Moderate;
  }


  return (
    <div className="space-y-6 text-gray-300">
      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Core Formula (Raw Collapse)</h3>
        <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md font-mono text-indigo-300 text-center text-lg">
          cRaw = (I ⋅ S ⋅ P) / (T ⋅ E)
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">This is the fundamental calculation before considering time or resilience.</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Variable Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(VARIABLE_DETAILS)
            .filter(([key]) => ['I', 'S', 'P', 'T', 'E'].includes(key)) // Only core SCM variables
            .map(([key, detail]) => (
            <div key={key} className="p-3 bg-gray-700 bg-opacity-40 rounded-md border border-gray-600">
              <strong className="text-purple-300">{detail.label}:</strong>
              <p className="text-sm text-gray-400">{detail.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Extended Mathematical Framework</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md">
            <h4 className="font-semibold text-purple-300">Time-Dependent Collapse Pressure C(t)</h4>
            <p className="font-mono text-indigo-300 text-sm my-1">C(t) = cRaw ⋅ (1 + (λ/100) ⋅ t)</p>
            <p className="text-xs text-gray-400">Current C(t): <span className="font-bold text-indigo-200">{calculatedValues.C_t.toFixed(3)}</span> (λ and t are adjustable in simulator)</p>
          </div>
          <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md">
            <h4 className="font-semibold text-purple-300">Symbolic Inertia (Resilience R) & Effective Collapse (cEff)</h4>
            <p className="font-mono text-indigo-300 text-sm my-1">R = 1 + (R<sub>mem</sub> + R<sub>red</sub> + R<sub>anc</sub>) / 20</p>
            <p className="font-mono text-indigo-300 text-sm my-1">cEffective = C(t) / R</p>
            <p className="text-xs text-gray-400">R is derived from Memory Depth, Institutional Redundancy, and Semantic Anchoring.</p>
            <p className="text-xs text-gray-400">Current R: <span className="font-bold text-indigo-200">{calculatedValues.R.toFixed(3)}</span></p>
            <p className="text-xs text-gray-400">Current cEffective (cEff): <span className="font-bold text-indigo-200">{calculatedValues.cEffective.toFixed(3)}</span></p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-2">Collapse Thresholds and Zones</h3>
        <p className="text-xs text-gray-400 mb-2">These thresholds apply to the value being evaluated (e.g., cRaw or cEffective).</p>
        <div className="space-y-2">
          {(Object.keys(COLLAPSE_ZONE_THRESHOLDS) as CollapseZone[]).map(zoneKey => {
            const zoneDetails = COLLAPSE_ZONE_THRESHOLDS[zoneKey];
            return (
              <div 
                key={zoneKey} 
                className={`p-3 rounded-md flex justify-between items-center ${zoneDetails.color} text-white ${calculatedValues.zoneRaw === zoneKey ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
              >
                <span>{zoneDetails.label}</span>
                <span className="font-mono text-sm">
                  Value: {zoneDetails.min.toFixed(1)} - {zoneDetails.max === Infinity ? " crítico" : zoneDetails.max.toFixed(1)}
                </span>
              </div>
            );
          })}
           <p className="text-sm text-gray-400 mt-2">
            Current Raw Zone (cRaw: <strong className="text-indigo-200">{calculatedValues.cRaw.toFixed(2)}</strong>): 
            <strong className={`ml-1 px-2 py-1 rounded-md ${COLLAPSE_ZONE_THRESHOLDS[calculatedValues.zoneRaw].color} text-white`}>
              {COLLAPSE_ZONE_THRESHOLDS[calculatedValues.zoneRaw].label}
            </strong>
           </p>
           <p className="text-sm text-gray-400 mt-1">
            Current Effective Zone (cEff: <strong className="text-indigo-200">{calculatedValues.cEffective.toFixed(2)}</strong>): 
            <strong className={`ml-1 px-2 py-1 rounded-md ${COLLAPSE_ZONE_THRESHOLDS[calculatedValues.zone].color} text-white`}>
              {COLLAPSE_ZONE_THRESHOLDS[calculatedValues.zone].label}
            </strong>
           </p>
        </div>
      </div>
    </div>
  );
};