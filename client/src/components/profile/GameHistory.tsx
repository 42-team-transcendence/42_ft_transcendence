import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PageWrapper from "../navbar/pageWrapper";
import '../../styles/GameHistory.css';

function GameHistory() {
  // Sample game history data
  const gameHistory = [
    { name: "User 1", score: 100, date: "2023-07-19", result: "Win" },
    { name: "User 2", score: 150, date: "2023-07-20", result: "Loss" },
    { name: "User 3", score: 120, date: "2023-07-21", result: "Win" },
  ];

  return (
    <PageWrapper>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: 2,
            border: "2px solid black",
          }}
        >
          <Box sx={{ width: "100%" }}>
            {/* <Typography variant="h4">Game History</Typography> */}
			<h1 className="typo-game"> Game History</h1>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
					<TableRow
						sx={{
						"& .MuiTableCell-root": { borderColor: "#FF79AF", borderWidth: 2 },
						"& .MuiTableRow-root": { borderColor: "#FF79AF", borderWidth: 2 },
						}}>
						<TableCell>Name</TableCell>
						<TableCell>Score</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Result</TableCell>
					</TableRow>
                </TableHead>
                <TableBody>
                  {gameHistory.map((game, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "& .MuiTableCell-root": { borderColor: "#FF79AF", borderWidth: 2 },
                        "& .MuiTableRow-root": { borderColor: "#FF79AF", borderWidth: 2 },
                      }}
                    >
                      <TableCell>{game.name}</TableCell>
                      <TableCell>{game.score}</TableCell>
                      <TableCell>{game.date}</TableCell>
                      <TableCell>{game.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
}

export default GameHistory;

