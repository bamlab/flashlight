import React from "react";
import {
  Button,
  setThemeAtRandom,
  IterationsReporterView,
  getThemeColorPalette,
} from "@perf-profiler/web-reporter-ui";

import { BundleIdSelector } from "./components/BundleIdSelector";
import { StartButton } from "./components/StartButton";
import { Delete } from "@mui/icons-material";
import { AppBar } from "./components/AppBar";
import { useMeasures } from "./useMeasures";
import { SocketState } from "./components/SocketState";

setThemeAtRandom();

export const MeasureWebApp = () => {
  const {
    autodetect,
    bundleId,
    start,
    stop,
    results,
    isMeasuring,
    reset,
    setBundleId,
    refreshRate,
  } = useMeasures();

  return (
    <div className="bg-light-charcoal h-full text-black">
      <SocketState />
      <AppBar>
        <BundleIdSelector autodetect={autodetect} bundleId={bundleId} onChange={setBundleId} />
        {bundleId ? (
          <div className="flex flex-row gap-2">
            <StartButton start={start} stop={stop} isMeasuring={isMeasuring} />
            {/* It's assumed that the color palette is fixed randomly by setThemeAtRandom
             and is an array of >= 4 colors */}
            <div data-theme={getThemeColorPalette()[1]}>
              <Button onClick={reset} icon={<Delete />}>
                Reset
              </Button>
            </div>
          </div>
        ) : null}
      </AppBar>
      <IterationsReporterView deviceSpecs={{ refreshRate }} results={results} />
    </div>
  );
};
