
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

/**
 * A React component that displays a slider for a variable.
 *
 * This component displays a slider that allows the user to adjust the value
 * of a variable. It also displays the current value of the variable.
 *
 * @param {VariableSliderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
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
    