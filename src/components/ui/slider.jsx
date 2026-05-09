import * as React from "react";

export const Slider = ({ value, onChange, min = 0, max = 100, step = 1 }) => {
  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="text-sm text-gray-500 mt-1 text-center">{value}</div>
    </div>
  );
};
