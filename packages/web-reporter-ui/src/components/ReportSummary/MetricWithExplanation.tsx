import React, { ReactNode } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  AccordionSummaryProps,
  styled,
} from "@mui/material";

const ExpandButtonContainer = styled("div")(({ theme }) => ({
  color: "white",
  background: "white",
  width: 12,
  height: 12,
  border: 0,
  fontSize: "1.5em",
  position: "relative",

  "& span": {
    position: "absolute",
    transition: "300ms",
    background: theme.palette.grey[500],
    borderRadius: 2,
  },

  "& span:first-of-type": {
    top: "25%",
    bottom: "25%",
    width: "10%",
    left: "45%",
  },

  "& span:last-child": {
    left: "25%",
    right: "25%",
    height: "10%",
    top: "45%",
  },
}));

const ExpandButton = () => {
  return (
    <ExpandButtonContainer>
      <span />
      <span />
    </ExpandButtonContainer>
  );
};

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ExpandButton />} {...props} />
))(({ theme }) => ({
  padding: 0,
  minHeight: 0,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded span": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded span:last-child": {
    left: "50%",
    right: "50%",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
    marginLeft: theme.spacing(1),
  },
  "& .MuiButtonBase-root": {
    minHeight: 0,
  },
}));

export const MetricWithExplanation = ({
  title,
  explanation,
}: {
  title: ReactNode;
  explanation: ReactNode;
}) => {
  return (
    <Accordion disableGutters elevation={0}>
      <AccordionSummary>{title}</AccordionSummary>
      <AccordionDetails style={{ padding: 2 }}>
        <div style={{ fontWeight: "normal", color: "#333", fontSize: 12 }}>
          {explanation}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
