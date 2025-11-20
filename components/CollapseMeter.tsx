
import React from 'react';
import { SCMCalculatedValues } from '../types';
import { COLLAPSE_ZONE_THRESHOLDS } from '../constants';

interface CollapseMeterProps {
  calculatedValues: SCMCalculatedValues;
}

/**
 * A React component that displays the collapse pressure of the SCM.
 *
 * This component displays a meter that shows the collapse pressure (CP) of the SCM.
 * The meter is color-coded based on the collapse zone.
 *
 * @param {CollapseMeterProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const CollapseMeter: React.FC<CollapseMeterProps> = ({ calculatedValues }) => {
  const { stability_score, collapse_pressure, zone } = calculatedValues;
  const zoneConfig = COLLAPSE_ZONE_THRESHOLDS[zone];
  const METER_MAX_VALUE = 2;
  const percentage = Math.min(100, Math.max(0, (collapse_pressure / METER_MAX_VALUE) * 100));

  return (
    <div className="p-4 rounded-lg bg-gray-700 bg-opacity-50 shadow-md border border-gray-600">
      <h3 className="text-lg font-semibold text-purple-300 mb-2">Collapse Pressure Meter</h3>
      <div className="w-full bg-gray-600 rounded-full h-6 overflow-hidden border-2 border-gray-500">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${zoneConfig.color}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={collapse_pressure}
          aria-valuemin={0}
          aria-valuemax={METER_MAX_VALUE}
          aria-label={`Collapse pressure: ${zoneConfig.label}`}
        ></div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className={`text-sm font-medium px-2 py-1 rounded-md ${zoneConfig.color} text-white`}>
          {zoneConfig.label}
        </span>
        <span className="text-2xl font-bold text-indigo-300">{collapse_pressure.toFixed(2)}</span>
      </div>
       <p className="text-xs text-gray-400 mt-2">
        Stability Score (Σ): {stability_score.toFixed(2)}
      </p>
    </div>
  );
};
