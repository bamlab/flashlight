import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";

type Props = PropsWithChildren<{
  header: React.ReactNode;
  className?: string;
  unmountOnExit?: boolean;
}>;

type COLLAPSE_STATE = "EXPANDING" | "COLLAPSING" | "COLLAPSED" | "EXPANDED";

const TRANSITION_DURATION = 300;

const useCollapsible = (unmountOnExit: boolean) => {
  const [collapseState, setCollapseState] =
    useState<COLLAPSE_STATE>("COLLAPSED");

  const toggleIsExpanded = useCallback(() => {
    if (collapseState === "COLLAPSED") {
      setCollapseState("EXPANDING");
    } else if (collapseState === "EXPANDED") {
      setCollapseState("COLLAPSING");
    }
  }, [collapseState]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (collapseState === "EXPANDING") {
      setCollapseState("EXPANDED");
    } else if (collapseState === "COLLAPSING") {
      timeout = setTimeout(
        () => setCollapseState("COLLAPSED"),
        TRANSITION_DURATION
      );
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [collapseState]);

  return {
    isExpanded: collapseState === "EXPANDED",
    showChildren: unmountOnExit
      ? ["EXPANDING", "EXPANDED", "COLLAPSING"].includes(collapseState)
      : true,
    toggleIsExpanded,
  };
};

export const Collapsible: FunctionComponent<Props> = ({
  header,
  className,
  children,
  unmountOnExit = false,
}) => {
  const childrenContainerRef = useRef<HTMLDivElement>(null);

  const { isExpanded, showChildren, toggleIsExpanded } =
    useCollapsible(unmountOnExit);

  const childrenContainerStyle = {
    height: isExpanded ? childrenContainerRef.current?.scrollHeight : 0,
  };

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
        {showChildren ? children : null}
      </div>
    </div>
  );
};
