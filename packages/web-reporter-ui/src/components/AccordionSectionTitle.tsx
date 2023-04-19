import React, { ComponentProps } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SectionTitle = (props: ComponentProps<typeof Typography>) => (
  <Typography
    variant="h4"
    {...props}
    style={{ color: "#666666", margin: 10 }}
  ></Typography>
);

export const AccordionSectionTitle = ({ title }: { title: string }) => {
  return (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <SectionTitle>{title}</SectionTitle>
    </AccordionSummary>
  );
};
