import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export const CircularProgressWithLabel = ({
  color,
  ...props
}: {
  color: string;
  size: number;
  value: number;
}) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} style={{ color }} />
      <Box
        top={(props.size / 80) * 6}
        left={(props.size / 80) * 3}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          style={{
            fontSize: 28,
            color,
            fontFamily: "josefin-sans, sans-serif",
          }}
        >{`${Math.round(props.value)}`}</Typography>
      </Box>
    </Box>
  );
};
