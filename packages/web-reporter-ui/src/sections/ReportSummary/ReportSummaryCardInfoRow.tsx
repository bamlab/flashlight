import React, { FunctionComponent } from "react";

type Props = {
  title: string;
  value: number;
  unit?: string;
};

export const ReportSummaryCardInfoRow: FunctionComponent<Props> = ({
  title,
  value,
  unit,
}) => (
  <div className="flex flex-row w-full px-6 py-4 border rounded-lg border-gray-800 cursor-pointer">
    <div className="text-neutral-300">{title}</div>

    <div className="grow" />

    <p className="text-neutral-300 whitespace-pre">{`${value} ${unit}`}</p>

    <div className="w-2" />

    <div className="text-neutral-300"> v </div>
  </div>
);
