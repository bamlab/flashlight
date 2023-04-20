import React, { FunctionComponent, ReactNode, useMemo } from "react";
import { Collapsible } from "../../components/Collapsible";

type Props = {
  title: string;
  value: ReactNode;
  explanation?: ReactNode;
};

export const ReportSummaryCardInfoRow: FunctionComponent<Props> = ({
  title,
  value,
  explanation,
}) => {
  const collapsibleHeader = useMemo(
    () => (
      <div className="flex flex-row">
        <div className="text-neutral-300">{title}</div>

        <div className="grow" />

        <div className="text-neutral-300 whitespace-pre">{value}</div>

        <div className="w-2" />
      </div>
    ),
    [title, value]
  );
  return (
    <div className="w-full border rounded-lg border-gray-800">
      <Collapsible header={collapsibleHeader} className="px-6 py-4 ">
        <div className="h-2" />
        <div className="text-neutral-400 text-sm">{explanation}</div>
      </Collapsible>
    </div>
  );
};
