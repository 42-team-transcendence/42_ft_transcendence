import Users from '../users/Users'
import PageWrapper from '../navbar/pageWrapper'
import Logout from '../logout/Logout'
import { Box, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

function Leaderboard() {
  // Exemple de données pour le leaderboard (à remplacer par vos propres données)
  const leaderboardData = [
    { name: 'User 1', gamesPlayed: 10, score: 500 },
    { name: 'User 2', gamesPlayed: 8, score: 450 },
    { name: 'User 3', gamesPlayed: 12, score: 600 },
    
  ];

  return (
    <PageWrapper>
      <Box>
        <h1>Leaderboard</h1>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Games Played</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.gamesPlayed}</TableCell>
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