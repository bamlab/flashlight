import React, { FunctionComponent, ReactNode, useMemo } from "react";
import { Collapsible } from "../../components/Collapsible";

type Props = {
  title: string;
  value: ReactNode;
  difference?: ReactNode;
  explanation?: ReactNode;
  statistics?: ReactNode;
};

export const ReportSummaryCardInfoRow: FunctionComponent<Props> = ({
  title,
  value,
  difference,
  explanation,
  statistics,
}) => {
  const collapsibleHeader = useMemo(
    () => (
      <div className="flex flex-row">
        <div className="text-neutral-300">{title}</div>

        <div className="grow" />

        <div className="text-neutral-300 whitespace-pre">{value}</div>
        {difference}

        <div className="w-2" />
      </div>
    ),
    [title, value, difference]
  );
  return (
    <div className="w-full border rounded-lg border-gray-800">
      <Collapsible header={collapsibleHeader} className="px-6 py-4 ">
        <div className="text-neutral-400 text-sm">{explanation}</div>
        {!!statistics && (
          <>
            <div className="h-2" />
            <div className="text-neutral-400 text-sm">{statistics}</div>
          </>
        )}
      </Collapsible>
    </div>
  );
};
