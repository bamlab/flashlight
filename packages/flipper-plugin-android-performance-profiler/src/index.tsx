import React, { useState } from "react";
import { DevicePluginClient, createState } from "flipper-plugin";
import { BundleIdSelector } from "./components/BundleIdSelector";
import { StartButton } from "./components/StartButton";
import { useMeasures } from "./useMeasures";
import { ReporterView } from "@perf-profiler/web-reporter-ui";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { ScrollContainer } from "./components/ScrollContainer";

// We don't actually use the device plugin functionalities
export function devicePlugin(client: DevicePluginClient) {
  const data = createState<string[]>([]);

  return { data };
}

export function Component() {
  const [bundleId, setBundleId] = useState<string | null>(null);

  const { start, stop, measures, isMeasuring, reset } = useMeasures(bundleId);

  return (
    <>
      <BundleIdSelector bundleId={bundleId} onChange={setBundleId} />
      <div style={{ margin: 10 }}>
        {bundleId ? (
          <>
            <StartButton start={start} stop={stop} isMeasuring={isMeasuring} />
            <Button
              variant="contained"
              color="warning"
              onClick={reset}
              startIcon={<Delete />}
            >
              Reset
            </Button>
          </>
        ) : null}
      </div>
      <ScrollContainer>
        <ReporterView measures={measures} />
      </ScrollContainer>
    </>
  );
}
