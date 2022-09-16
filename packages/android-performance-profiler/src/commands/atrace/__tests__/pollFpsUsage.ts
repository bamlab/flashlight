import { FrameTimeParser, parseLine } from "../pollFpsUsage";

describe("parseLine", () => {
  it("parses atrace line", () => {
    expect(
      parseLine(
        "<...>-14862 (-----) [001] ...1  5199.769518: tracing_mark_write: B|14862|Choreographer#doFrame"
      )
    ).toEqual({
      ending: false,
      methodName: "|14862|Choreographer#doFrame",
      timestamp: 5199769.518,
    });

    expect(
      parseLine(
        "<...>-14862 (-----) [001] ...1  5199.779518: tracing_mark_write: E|14862"
      )
    ).toEqual({ ending: true, methodName: "|14862", timestamp: 5199779.518 });
  });
});

const SAMPLE_ATRACES = [
  `com.example-4808  (-----) [006] .... 176340.044726: tracing_mark_write: B|4808|Choreographer#doFrame 4573947
com.example-4808  (-----) [006] .... 176340.044756: tracing_mark_write: B|4808|animation
com.example-4808  (-----) [006] .... 176340.064412: tracing_mark_write: B|4808|Choreographer#scheduleVsyncLocked
com.example-4808  (-----) [006] .... 176340.064484: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.064853: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.064866: tracing_mark_write: B|4808|traversal
com.example-4808  (-----) [006] .... 176340.064914: tracing_mark_write: B|4808|draw
com.example-4808  (-----) [006] .... 176340.064942: tracing_mark_write: B|4808|Record View#draw()
com.example-4808  (-----) [006] .... 176340.065726: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.067496: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.067503: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.067509: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.147257: tracing_mark_write: B|4808|Choreographer#onVsync 4573951
com.example-4808  (-----) [006] .... 176340.147294: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.147355: tracing_mark_write: B|4808|Choreographer#doFrame 4573951
com.example-4808  (-----) [006] .... 176340.147372: tracing_mark_write: B|4808|animation
com.example-4808  (-----) [006] .... 176340.159522: tracing_mark_write: B|4808|Choreographer#scheduleVsyncLocked
com.example-4808  (-----) [006] .... 176340.159609: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.160177: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.160186: tracing_mark_write: B|4808|traversal
com.example-4808  (-----) [006] .... 176340.160244: tracing_mark_write: B|4808|draw
com.example-4808  (-----) [006] .... 176340.160279: tracing_mark_write: B|4808|Record View#draw()`,
  `com.example-4808  (-----) [006] .... 176340.160674: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.162005: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.162012: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.162018: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.241206: tracing_mark_write: B|4808|Choreographer#onVsync 4573954
com.example-4808  (-----) [006] .... 176340.241224: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.241240: tracing_mark_write: B|4808|Choreographer#doFrame 4573954
com.example-4808  (-----) [006] .... 176340.241253: tracing_mark_write: B|4808|animation
com.example-4808  (-----) [006] .... 176340.251574: tracing_mark_write: B|4808|Choreographer#scheduleVsyncLocked
com.example-4808  (-----) [006] .... 176340.251669: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.252254: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.252268: tracing_mark_write: B|4808|traversal
com.example-4808  (-----) [006] .... 176340.252353: tracing_mark_write: B|4808|draw
com.example-4808  (-----) [006] .... 176340.252410: tracing_mark_write: B|4808|Record View#draw()
com.example-4808  (-----) [006] .... 176340.253061: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.254615: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.254634: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.254655: tracing_mark_write: E|4808
com.example-4808  (-----) [006] .... 176340.341376: tracing_mark_write: B|4808|Choreographer#onVsync 4573957`,
];

describe("getFrameTimes", () => {
  it("retrieves frame times", () => {
    const frameParser = new FrameTimeParser();
    expect(frameParser.getFrameTimes(SAMPLE_ATRACES[0], "4808")).toEqual({
      frameTimes: [22.782999992370605],
      interval: 115.55300003290176,
    });
    expect(frameParser.getFrameTimes(SAMPLE_ATRACES[1], "4808")).toEqual({
      frameTimes: [14.663000017404556, 13.41499999165535],
      interval: 180.70199996232986,
    });
  });
});
