import React from "react";

export const Switch = ({
  value,
  onChange,
  accessibilityLabel,
}: {
  accessibilityLabel: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="inline-flex relative items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={value}
      onChange={() => onChange(!value)}
      aria-label={accessibilityLabel}
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-theme-color"></div>
  </label>
);
