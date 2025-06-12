
import React from 'react';

interface VariableSliderProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const VariableSlider: React.FC<VariableSliderProps> = ({
  id,
  label,
  description,
  value,
  min = 0,
  max = 10,
  step = 0.1,
  unit = "",
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-purple-300 mb-1">
        {label}: <span className="text-indigo-300 font-bold">{value.toFixed(1)} {unit}</span>
      </label>
      {description && <p className="text-xs text-gray-400 mb-1">{description}</p>}
      <input
        type="range"
        id={id}
        name={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-colors"
      />
    </div>
  );
};
    