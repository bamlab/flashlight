import React from "react";
import { AppBar, Button } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { TextField } from "./TextField";
import { detectCurrentAppBundleId } from "android-performance-profiler";

export const BundleIdSelector = ({
  bundleId,
  pidId,
  onChange,
}: {
  bundleId: string | null;
  pidId: string | null;
  onChange: (bundleId: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const autodetect = () => {
    try {
      const detectedBundleId = detectCurrentAppBundleId();
      onChange(detectedBundleId);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error has occurred"
      );
    }
  };

  return (
    <AppBar position="relative">
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Button onClick={autodetect} color="secondary" variant="contained">
          Auto-Detect
        </Button>
        <div style={{ paddingRight: 5, paddingLeft: 5 }}>
          <TextField onChange={handleChange} value={bundleId || ""} />
        </div>
        {pidId ? (
          <>
            <CheckCircleOutline style={{ color: "#4BB543", marginRight: 10 }} />
            Pid ID: {pidId}
          </>
        ) : null}
      </div>
    </AppBar>
  );
};
