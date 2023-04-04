import React from "react";

export const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-sm font-medium px-4 py-2 rounded bg-theme-color shadow-theme-color ${
        disabled ? "opacity-30" : "shadow-glow text-black"
      }`}
    >
      {children}
    </button>
  );
};
