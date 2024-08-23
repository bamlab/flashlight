import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { IterationsReporterView } from "../ReporterView";
import { TestCaseResult } from "@perf-profiler/types";
import { getText } from "../utils/testUtils";

describe("<ReporterView />", () => {
  it("renders the comparison view", () => {
    const testCaseResults: TestCaseResult[] = [
      require("../../../commands/report/src/example-reports/results1.json"),
      require("../../../commands/report/src/example-reports/results2.json"),
    ];
    const deviceSpecs = {
      refreshRate: 60,
    };

    const { asFragment, baseElement } = render(
      <IterationsReporterView deviceSpecs={deviceSpecs} results={testCaseResults} />
    );
    expect(screen.getAllByLabelText("Score")[0].textContent).toEqual("69");

    fireEvent.click(screen.getByText("Other threads"));

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

  it("renders the comparison view with videos", () => {
    const testCaseResults: TestCaseResult[] = [
      require("../../../commands/report/src/example-reports/video/results_417dd25e-d901-4b1e-9d43-3b78305a48e2.json"),
      require("../../../commands/report/src/example-reports/video/results_c7d5d17d-42ed-4354-8b43-bb26e2d6feee.json"),
    ];
    const deviceSpecs = {
      refreshRate: 60,
    };

    const { asFragment, baseElement } = render(
      <IterationsReporterView deviceSpecs={deviceSpecs} results={testCaseResults} />
    );
    expect(screen.getAllByLabelText("Score")[0].textContent).toEqual("51");

    expect(getText(baseElement)).toMatchSnapshot();
    expect(asFragment()).toMatchSnapshot();
  });
});
