import React from "react";
import { Box, Text } from "ink";

export const HostAndPortInfo = ({ url }: { url: string }) => (
  <Box padding={1} flexDirection="column">
    <Text>
      <Text bold>Flashlight web app running on: </Text>
      <Text color={"blue"}>{url}</Text>
    </Text>
  </Box>
);
