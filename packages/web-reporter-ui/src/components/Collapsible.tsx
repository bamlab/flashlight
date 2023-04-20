import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";

type Props = PropsWithChildren<{
  header: React.ReactNode;
  className?: string;
}>;

export const Collapsible: FunctionComponent<Props> = ({
  header,
  className,
  children,
}) => {
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleIsExpanded = useCallback(
    () => setIsExpanded((prevIsExpanded) => !prevIsExpanded),
    []
  );
  const childrenContainerStyle = useMemo(
    () => ({
      height: isExpanded ? childrenContainerRef.current?.scrollHeight : 0,
    }),
    [isExpanded]
  );

  return (
    <div className={className}>
      <div
        className="flex flex-row w-full items-center cursor-pointer"
        onClick={toggleIsExpanded}
      >
        <div className="flex-1">{header}</div>
        <ArrowDownIcon
          className={`${
            isExpanded ? "rotate-180" : "rotate-0"
          } transition-transform ease-linear`}
        />
      </div>

      <div
        ref={childrenContainerRef}
        className={`overflow-hidden transition-[height] duration-300`}
        style={childrenContainerStyle}
      >
        {children}
      </div>
    </div>
  );
};
