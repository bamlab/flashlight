import React from "react";

export const Video = ({ url }: { url: string }) => (
  <video autoPlay muted controls style={{ width: "100%" }}>
    <source src={url} />
  </video>
);
