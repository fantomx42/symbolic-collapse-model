
import React from 'react';
import { TrendDirection } from '../types';

interface TrendArrowProps {
  direction: TrendDirection;
}

export const TrendArrow: React.FC<TrendArrowProps> = ({ direction }) => {
  let arrowChar = '';
  let colorClass = 'text-gray-500'; // Default for stable or none

  switch (direction) {
    case TrendDirection.UP:
      arrowChar = '▲'; // Upwards arrow
      colorClass = 'text-green-400';
      break;
    case TrendDirection.DOWN:
      arrowChar = '▼'; // Downwards arrow
      colorClass = 'text-red-400';
      break;
    case TrendDirection.STABLE:
      arrowChar = '●'; // Small circle for stable
      colorClass = 'text-blue-400';
      break;
    case TrendDirection.NONE:
       // No arrow, or a very subtle indicator if preferred
      return null; // Or <span className="text-xs text-gray-600">-</span>
  }

  return (
    <span className={`inline-block w-4 h-4 text-xs mx-1 ${colorClass}`} title={`Trend: ${direction.toLowerCase()}`}>
      {arrowChar}
    </span>
  );
};