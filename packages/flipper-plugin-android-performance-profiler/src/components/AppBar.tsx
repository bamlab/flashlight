import React from "react";
import MaterialAppBar from "@mui/material/AppBar";

export const AppBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <MaterialAppBar position="relative" className="bg-dark-charcoal">
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          padding: 10,
        }}
      >
        {children}
      </div>
    </MaterialAppBar>
  );
};
