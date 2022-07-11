import React from "react";
import { ReporterView } from "@performance-profiler/web-reporter-ui";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const measures = require("./measures.json");

export function App() {
  return (
    <>
      <ReporterView measures={measures[5].measures} />
    </>
  );
}
