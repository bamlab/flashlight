import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const SimpleTable = ({ rows }: { rows: (string | React.ReactNode)[][] }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{rows[0][0]}</TableCell>
            {rows[0].slice(1).map((cell, i) => (
              <TableCell align="right" key={i} sx={{ fontWeight: "bold", fontFamily: "open-sans" }}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(1).map((row, i) => (
            <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                {row[0]}
              </TableCell>
              {row.slice(1).map((cell, j) => (
                <TableCell align="right" key={j}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
