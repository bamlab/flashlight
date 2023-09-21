import React, { useEffect, useState } from "react";
import { DevicePluginClient, Dialog, createState } from "flipper-plugin";
import {
  Button,
  ReporterView,
  setThemeAtRandom,
  getThemeColorPalette,
} from "@perf-profiler/web-reporter-ui";
import { BundleIdSelector } from "./components/BundleIdSelector";
import { StartButton } from "./components/StartButton";
import { useMeasures } from "./useMeasures";
import { Delete } from "@mui/icons-material";
import fs from "fs";
import { AppBar } from "./components/AppBar";

setThemeAtRandom();

// We don't actually use the device plugin functionalities
export function devicePlugin(client: DevicePluginClient) {
  const data = createState<string[]>([]);

  return { data };
}

const CssStyle = React.memo(() => {
  const style = fs.readFileSync(`${__dirname}/index.css`, "utf8");

  return <style>{style}</style>;
});

export function Component() {
  const [bundleId, setBundleId] = useState<string | null>(null);

  useEffect(() => {
    Dialog.alert({
      title: "Deprecated",
      message: (
        <div>
          The Flashlight Flipper plugin is deprecated, please use the{" "}
          <code>flashlight measure</code> command instead.
          <br />
          <br /> See how to get started at{" "}
          <a href="https://docs.flashlight.dev" target="_blank" rel="noreferrer">
            https://docs.flashlight.dev
          </a>
        </div>
      ),
      type: "warning",
    });
  }, []);

  const { start, stop, measures, isMeasuring, reset } = useMeasures(bundleId);

  return (
    <div className="bg-light-charcoal h-full text-black">
      <CssStyle />
      <AppBar>
        <BundleIdSelector bundleId={bundleId} onChange={setBundleId} />
        {bundleId ? (
          <div className="flex flex-row gap-2">
            <StartButton start={start} stop={stop} isMeasuring={isMeasuring} />
            <div data-theme={getThemeColorPalette()[1]}>
              <Button onClick={reset} icon={<Delete />}>
                Reset
              </Button>
            </div>
          </div>
        ) : null}
      </AppBar>
      <ReporterView measures={measures} />
    </div>
  );
}
