import Users from '../users/Users'
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PageWrapper from '../navbar/pageWrapper'
import Logout from '../logout/Logout'
import { Box, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

function Leaderboard() {
//   // Exemple de données pour le leaderboard (à remplacer par vos propres données)
//   const leaderboardData = [
//     { rank: '1/', name: 'User 1', score: 500 },
//     { rank: '2/', name: 'User 2', score: 450 },
//     { rank: '3/', name: 'User 3', score: 200 },
    
//   ];
interface User {
	id: number;
	nickname: string;
  }
  
  interface Game {
	winnerId?: number;
	player_1: User;
  }

const axiosPrivate = useAxiosPrivate();
//const [leaderboardData, setLeaderboardData] = useState([]);
const [leaderboardData, setLeaderboardData] = useState<
  { rank: string; name: string; score: number }[]
>([]);
useEffect(() => {
	const fetchLeaderboardData = async () => {
	  try {
		const response = await axiosPrivate.get("/games/findAllMyGames", {
			headers: { 'Content-Type': 'application/json'},
			withCredentials: true
		});
		const gameHistory: Game[] = response.data; // Assuming the API response is an array of Game objects
  
		const winCount: { [userId: number]: number } = {};
		gameHistory.forEach((game) => {
		  if (game.winnerId) {
			if (winCount[game.winnerId]) {
			  winCount[game.winnerId]++;
			} else {
			  winCount[game.winnerId] = 1;
			}
		  }
		});
  
		const sortedUsers = Object.keys(winCount).sort(
		  (a, b) => winCount[Number(b)] - winCount[Number(a)]
		);
  
		const formattedLeaderboardData = sortedUsers
		  .slice(0, 100)
		  .map((userId, index) => ({
			rank: `${index + 1}/`,
			name: gameHistory.find((game) => game.player_1.id === Number(userId))?.player_1.nickname || "",
			score: winCount[Number(userId)] * 100,
		  }));
  
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
                <TableCell>{user.rank}</TableCell>
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

// function Leaderboard() {


//   return (
// 	<PageWrapper>
// 		<Box >
// 			<h1>Leaderboard</h1>
// 			<Users />
// 			<Logout />
// 		</Box>
// 	</PageWrapper>
//   )
// }

// export default Leaderboard