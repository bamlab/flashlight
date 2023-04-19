import React, { FunctionComponent } from "react";

type Props = {
  size?: number;
} & React.SVGProps<SVGSVGElement>;

export const ArrowDownIcon: FunctionComponent<Props> = ({
  size = 24,
  ...svgProps
}) => {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      {...svgProps}
    >
      <path
        className="stroke-white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="m8.5 10 4 4 4-4"
      />
    </svg>
  );
};
