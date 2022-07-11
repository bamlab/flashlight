import React from "react";
import { ReporterView } from "@performance-profiler/web-reporter-ui";

const measures = require("./measures.json");

export function App() {
  return (
    <>
      <ReporterView measures={measures[5].measures} />
    </>
  );
}
