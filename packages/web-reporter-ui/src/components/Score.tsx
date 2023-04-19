import React, { FunctionComponent } from "react";
import { getScore } from "@perf-profiler/reporter";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { roundToDecimal } from "../../utils/roundToDecimal";

type Props = {
  size?: number;
  result: AveragedTestCaseResult;
} & Omit<React.SVGProps<SVGSVGElement>, "result">;

export const Score: FunctionComponent<Props> = ({
  size = 200,
  result,
  ...svgProps
}) => {
  const displayPlaceholder = result.average.measures.length === 0;
  const score = displayPlaceholder ? 100 : result.score ?? getScore(result);

  // Path calculations inspired by https://stackoverflow.com/a/18473154/18205154
  const angleInRadians = ((score * 3.6 - 90) * Math.PI) / 180.0;
  const startX = 100 + 90 * Math.cos(angleInRadians);
  const startY = 100 + 90 * Math.sin(angleInRadians);

  const largeArcFlag = score * 3.6 <= 180 ? "0" : "1";

  const scoreSvgPath = `M ${startX} ${startY} A 90 90 0 ${largeArcFlag} 0 100 10`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      {...svgProps}
    >
      <g>
        <circle
          cx={100}
          cy={100}
          r={90}
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth={20}
        />
        <path
          d={scoreSvgPath}
          strokeWidth={20}
          className="stroke-theme-color"
        />
        <text
          x={100}
          y={100}
          dominantBaseline="middle"
          textAnchor="middle"
          aria-label="Score"
          className="text-center text-4xl font-semibold fill-white"
        >
          {roundToDecimal(score, 1)}
        </text>
      </g>

      <defs>
        <clipPath id="clip0_556_1188">
          <rect
            width="200"
            height="200"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
