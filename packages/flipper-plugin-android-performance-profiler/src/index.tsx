import React, { useState } from "react";
import { DevicePluginClient, createState } from "flipper-plugin";
import { Button, ReporterView, setThemeAtRandom } from "@perf-profiler/web-reporter-ui";
import { BundleIdSelector } from "./components/BundleIdSelector";
import { StartButton } from "./components/StartButton";
import { useMeasures } from "./useMeasures";
import { Delete } from "@mui/icons-material";
import fs from "fs";
import { getThemeColorPalette } from "@perf-profiler/web-reporter-ui/dist/src/theme/colors";
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
