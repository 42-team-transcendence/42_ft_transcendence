
import Miniature from "../miniature/Miniature";
import tchoupi from '../../assets/tchoupi50x50.jpg'
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PageWrapper from "../navbar/pageWrapper";
import Logout from "../logout/Logout";
import { Box, Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";

function Leaderboard() {
  const axiosPrivate = useAxiosPrivate();
  const [leaderboardData, setLeaderboardData] = useState<
    { rank: string; name: string; score: number }[]
  >([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axiosPrivate.get("/games/findAllGames", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const gameHistory = response.data;

        const winCount: { [userId: number]: number } = {};
        gameHistory.forEach((game: any) => {
          if (game.winnerId) {
            if (winCount[game.winnerId]) {
              winCount[game.winnerId]++;
            } else {
              winCount[game.winnerId] = 1;
            }
          }
        });

        const usersResponse = await axiosPrivate.get("/users", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const users = usersResponse.data;
		console.log(users);

        const formattedLeaderboardData = users
          .map((user: any) => ({
            rank: "",
            name: user.nickname,
            score: winCount[user.id] ? winCount[user.id] * 100 : 0,
          }))
          .sort((a: any, b: any) => b.score - a.score);

        setLeaderboardData(formattedLeaderboardData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <PageWrapper>
      <Box>
        <h1>Leaderboard</h1>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Logout />
      </Box>
    </PageWrapper>
  );
}

export default Leaderboard;


{/* <Miniature miniatureUser={{
	nickname: nickname,
	id: userId,
	minAvatar: {url: tchoupi, name:'Tchoupi'}
}}
></Miniature> */}