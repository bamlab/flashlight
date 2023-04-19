import React, { FunctionComponent, ReactNode, useMemo } from "react";
import { Collapsible } from "../../components/Collapsible";

type Props = {
  title: string;
  value: number;
  unit?: string;
  explanation?: ReactNode;
};

export const ReportSummaryCardInfoRow: FunctionComponent<Props> = ({
  title,
  value,
  unit,
  explanation,
}) => {
  const collapsibleHeader = useMemo(
    () => (
      <div className="flex flex-row">
        <div className="text-neutral-300">{title}</div>

        <div className="grow" />

        <p className="text-neutral-300 whitespace-pre">{`${value} ${unit}`}</p>

        <div className="w-2" />
      </div>
    ),
    [title, value, unit]
  );
  return (
    <div className="w-full px-6 py-4 border rounded-lg border-gray-800 cursor-pointer">
      <Collapsible header={collapsibleHeader}>
        <div className="h-2" />
        <div className="text-neutral-400 text-sm">{explanation}</div>
      </Collapsible>
    </div>
  );
};
