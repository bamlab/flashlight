import React from "react";
import { TextField } from "./TextField";
import { Button } from "@perf-profiler/web-reporter-ui";

export const BundleIdSelector = ({
  bundleId,
  onChange,
  autodetect,
}: {
  bundleId: string | null;
  onChange: (bundleId: string) => void;
  autodetect: () => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
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
