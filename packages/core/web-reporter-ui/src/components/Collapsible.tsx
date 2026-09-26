import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";

type Props = PropsWithChildren<{
  header: React.ReactNode;
  className?: string;
  unmountOnExit?: boolean;
}>;

type COLLAPSE_STATE = "COLLAPSING" | "COLLAPSED" | "EXPANDED";

const TRANSITION_DURATION = 300;

const useCollapsible = (unmountOnExit: boolean) => {
  const [collapseState, setCollapseState] = useState<COLLAPSE_STATE>("COLLAPSED");

  const toggleIsExpanded = useCallback(() => {
    setCollapseState((state) => {
      if (state === "COLLAPSED") return "EXPANDED";
      if (state === "EXPANDED") return "COLLAPSING";
      return state;
    });
  }, []);

  useEffect(() => {
    if (collapseState !== "COLLAPSING") return;

    // Hold the children mounted until the closing transition has finished.
    const timeout = setTimeout(() => setCollapseState("COLLAPSED"), TRANSITION_DURATION);
    return () => clearTimeout(timeout);
  }, [collapseState]);

  return {
    isExpanded: collapseState === "EXPANDED",
    showChildren: unmountOnExit ? collapseState !== "COLLAPSED" : true,
    toggleIsExpanded,
  };
};

export const Collapsible: FunctionComponent<Props> = ({
  header,
  className,
  children,
  unmountOnExit = false,
}) => {
  const { isExpanded, showChildren, toggleIsExpanded } = useCollapsible(unmountOnExit);

  return (
    <div className={`${className} cursor-pointer`} onClick={toggleIsExpanded}>
      <div className="flex flex-row w-full items-center">
        <div className="flex-1">{header}</div>
        <ArrowDownIcon
          className={`${isExpanded ? "rotate-180" : "rotate-0"} transition-transform ease-linear`}
        />
      </div>

      {/* Animating grid-template-rows between 0fr and 1fr lets the row size itself from its
          content, so the open height never has to be measured. */}
      <div
        className={`cursor-default grid ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } transition-[grid-template-rows] duration-300`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="overflow-hidden">{showChildren ? children : null}</div>
      </div>
    </div>
  );
};
