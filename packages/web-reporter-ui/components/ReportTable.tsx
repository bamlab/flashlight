import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const ReportTable = ({
  rows,
}: {
  rows: { name: string; stats: { name: string; value: string }[] }[];
}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {rows.map((row) => (
              <TableCell align="right">{row.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows[0].stats.map((stat, statIndex) => (
            <TableRow
              key={stat.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {stat.name}
              </TableCell>
              {rows.map((row) => (
                <TableCell align="right">
                  {row.stats[statIndex].value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
