import React, { FunctionComponent, PropsWithChildren, useState } from "react";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";

type Props = PropsWithChildren<{
  header: React.ReactNode;
  className?: string;
}>;

export const Collapsible: FunctionComponent<Props> = ({ header, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div
        className="flex flex-row cursor-pointer w-full"
        onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
      >
        <div className="flex-1">{header}</div>
        <ArrowDownIcon />
      </div>

      {isExpanded && <div>{children}</div>}
    </div>
  );
};
