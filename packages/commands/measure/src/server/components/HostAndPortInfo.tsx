import React from "react";
import { Box, Text } from "ink";
import { WEBAPP_URL } from "../constants";

export const HostAndPortInfo = () => (
  <Box padding={1} flexDirection="column">
    <Text>
      <Text bold>Flashlight web app running on: </Text>
      <Text color={"blue"}>{WEBAPP_URL}</Text>
    </Text>
  </Box>
);
