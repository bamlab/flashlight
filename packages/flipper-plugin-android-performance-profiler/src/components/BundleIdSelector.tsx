import React from "react";
import { TextField } from "./TextField";
import { detectCurrentAppBundleId } from "@perf-profiler/profiler";
import { Button } from "@perf-profiler/web-reporter-ui";

export const BundleIdSelector = ({
  bundleId,
  onChange,
}: {
  bundleId: string | null;
  onChange: (bundleId: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const autodetect = () => {
    try {
      const { bundleId: detectedBundleId } = detectCurrentAppBundleId();
      onChange(detectedBundleId);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error has occurred"
      );
    }
  };

  return (
    <>
      <Button onClick={autodetect}>Auto-Detect</Button>
      <div style={{ paddingRight: 5, paddingLeft: 5 }}>
        <TextField onChange={handleChange} value={bundleId || ""} />
      </div>
    </>
  );
};
