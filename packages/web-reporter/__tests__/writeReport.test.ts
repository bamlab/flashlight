import { Measure, TestCaseIterationResult, TestCaseResult } from "@perf-profiler/types";
import { getMeasuresForTimeInterval } from "../writeReport";

const mockMeasure = (name: string) => {
  // We're just mocking measure to make tests more readable here
  return name as unknown as Measure;
};

const mockResultIteration = (name: string[]): TestCaseIterationResult => ({
  measures: name.map(mockMeasure),
  time: 0,
  status: "SUCCESS",
});

describe("getMeasuresForTimeInterval", () => {
  it("throws if skip or duration are not multiple or time interval", () => {
    expect(() =>
      getMeasuresForTimeInterval({ duration: 600, results: [], skip: 0 })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Only multiples of the measure interval (500ms) are supported"`
    );

    expect(() =>
      getMeasuresForTimeInterval({ duration: null, results: [], skip: 600 })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Only multiples of the measure interval (500ms) are supported"`
    );
  });

  it("doesn't cut measures by default", () => {
    const RESULT: TestCaseResult = {
      iterations: [
        mockResultIteration(["ITERATION1_0_ms", "ITERATION1_500_ms", "ITERATION1_1000_ms"]),
        mockResultIteration(["ITERATION2_0_ms", "ITERATION2_500_ms"]),
      ],
      name: "Result",
      status: "SUCCESS",
    };

    expect(
      getMeasuresForTimeInterval({
        duration: null,
        skip: 0,
        results: [RESULT],
      })
    ).toEqual([RESULT]);
  });

  it("skips first measures", () => {
    const RESULT: TestCaseResult = {
      iterations: [
        mockResultIteration(["ITERATION1_0_ms", "ITERATION1_500_ms", "ITERATION1_1000_ms"]),
        mockResultIteration(["ITERATION2_0_ms", "ITERATION2_500_ms"]),
      ],
      name: "Result",
      status: "SUCCESS",
    };

    expect(
      getMeasuresForTimeInterval({
        duration: null,
        skip: 1000,
        results: [RESULT],
      })
    ).toEqual([
      {
        iterations: [mockResultIteration(["ITERATION1_1000_ms"]), mockResultIteration([])],
        name: "Result",
        status: "SUCCESS",
      },
    ]);
  });

  it("cuts measures between 500ms and 1.5s", () => {
    expect(
      getMeasuresForTimeInterval({
        duration: 1000,
        skip: 500,
        results: [
          {
            iterations: [
              mockResultIteration([
                "ITERATION1_0_ms",
                "ITERATION1_500_ms",
                "ITERATION1_1000_ms",
                "ITERATION1_1500_ms",
                "ITERATION1_2000_ms",
                "ITERATION1_2500_ms",
              ]),
              mockResultIteration(["ITERATION2_0_ms", "ITERATION2_500_ms"]),
            ],
            name: "Result 1",
            status: "SUCCESS",
          },
          {
            iterations: [
              mockResultIteration([
                "ITERATION3_0_ms",
                "ITERATION3_500_ms",
                "ITERATION3_1000_ms",
                "ITERATION3_1500_ms",
              ]),
            ],
            name: "Result 2",
            status: "SUCCESS",
          },
        ],
      })
    ).toEqual([
      {
        iterations: [
          mockResultIteration(["ITERATION1_500_ms", "ITERATION1_1000_ms", "ITERATION1_1500_ms"]),
          mockResultIteration(["ITERATION2_500_ms"]),
        ],
        name: "Result 1",
        status: "SUCCESS",
      },
      {
        iterations: [
          mockResultIteration(["ITERATION3_500_ms", "ITERATION3_1000_ms", "ITERATION3_1500_ms"]),
        ],
        name: "Result 2",
        status: "SUCCESS",
      },
    ]);
  });
});
