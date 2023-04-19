import React, { FunctionComponent, PropsWithChildren, useState } from "react";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";

type Props = PropsWithChildren<{
  header: React.ReactNode;
  className?: string;
}>;

export const Collapsible: FunctionComponent<Props> = ({ header, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
    >
      <div className="flex flex-row w-full">
        <div className="flex-1">{header}</div>
        <ArrowDownIcon
          className={`${
            isExpanded ? "rotate-180" : "rotate-0"
          } transition-transform ease-linear`}
        />
      </div>

      <div
        className={`${
          isExpanded ? "max-h-72" : "max-h-0"
        } overflow-hidden transition-[max-height] duration-500 ease-linear`}
      >
        {children}
      </div>
    </div>
  );
};
