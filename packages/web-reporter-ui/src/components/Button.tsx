import React from "react";

export const Button = ({
  children,
  onClick,
  disabled,
  className,
  icon,
}: {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}) => {
  const classNames = [
    `text-sm font-medium px-4 py-2 rounded bg-theme-color shadow-theme-color`,
    disabled ? "opacity-30" : "shadow-glow text-black",
    className || "",
    icon ? "flex items-center" : "",
  ];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${classNames.join(" ")}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};
