import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { IterationsReporterView } from "../ReporterView";
import { TestCaseResult } from "@perf-profiler/types";
import { getText } from "../utils/getSnapshotText";

const testCaseResults: TestCaseResult[] = [
  require("../../web-reporter/src/results1.json"),
  require("../../web-reporter/src/results2.json"),
];

describe("<ReporterView />", () => {
  it("renders the comparison view", () => {
    const { asFragment, baseElement } = render(
      <IterationsReporterView results={testCaseResults} />
    );
    expect(screen.getAllByLabelText("Score")[0].textContent).toEqual("69");

    fireEvent.click(screen.getByText("Threads"));

    expect(getText(baseElement)).toMatchSnapshot();
    expect(asFragment()).toMatchSnapshot();

    /**
     * TESTING iteration selection
     */
    fireEvent.click(screen.getByLabelText("Show each iteration individually"));

    // iteration 10
    fireEvent.click(screen.getByLabelText("See previous iteration"));
    // iteration 9
    fireEvent.click(screen.getByLabelText("See previous iteration"));
    // back to iteration 10
    fireEvent.click(screen.getByLabelText("See next iteration"));

    expect(screen.getAllByLabelText("Score")[0].textContent).toEqual("65");

    expect(getText(baseElement)).toMatchSnapshot();
    expect(asFragment()).toMatchSnapshot();
    /**
     * =========================
     */
  });
});
