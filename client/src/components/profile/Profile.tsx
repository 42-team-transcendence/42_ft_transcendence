import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PageWrapper from "../navbar/pageWrapper";
import '../../styles/Profile.css';

function Profile() {
  // Sample game history data
  const gameHistory = [
    { name: "User 1", score: 100, date: "2023-07-19", result: "Win" },
    { name: "User 2", score: 150, date: "2023-07-20", result: "Loss" },
    { name: "User 3", score: 120, date: "2023-07-21", result: "Win" },
  ];

  return (
    <PageWrapper>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Profile Container 1 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 2,
            border: "2px solid black",
            
          }}
        >
          <Box sx={{ marginRight: 2, border: "2px solid black", borderRadius: 10 }}>
            <img
              src="https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg"
              alt="Profile"
              style={{ width: 180, height: 230, borderRadius: 10 }}
            />
          </Box>
          <Box sx={{ color: "black", textAlign: "left" }}>    
			<Box>
				<Typography variant="h5">Alf</Typography>
				<span style={{ fontSize:"0.9rem", color: "blue", cursor: "pointer", textDecoration: "underline" }}>
				modifier
				</span>		
				<Typography variant="h6">Rank 1 | Lvl 800</Typography>
			</Box>
           
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: "white",
				padding: 2
			}}>
				<Typography variant="h6">Email</Typography>
				<span style={{ fontSize:"0.9rem", color: "blue", cursor: "pointer", textDecoration: "underline" }}>
				modifier
				</span>
				<br/>
				<Typography variant="h6">Password</Typography>
				<span style={{ fontSize:"0.9rem", color: "blue", cursor: "pointer", textDecoration: "underline" }}>
				modifier
				</span>
				
				<Typography variant="h6">Double factors</Typography>
			</Box>
          </Box>
        </Box>

        {/* Profile Container 2 */}
        <Box
          sx={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 2,
            border: "2px solid black",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="h4">Game History</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& .MuiTableCell-root": { borderColor: "#FF79AF", borderWidth: 2 },
                      "& .MuiTableRow-root": { borderColor: "#FF79AF", borderWidth: 2 },
                    }}
                  >
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

export default Profile;




// import React from "react";
// import "../../styles/Profile.css";
// import PageWrapper from "../navbar/pageWrapper";

// function Profile() {
// 	// Sample game history data
// 	const gameHistory = [
// 		{ name: "User 1", score: 100, date: "2023-07-19", result: "Win" },
// 		{ name: "User 2", score: 150, date: "2023-07-20", result: "Loss" },
// 		{ name: "User 3", score: 120, date: "2023-07-21", result: "Win" },
// 	  ];
//   return (
//     <PageWrapper>
// 		<div className="cont">
//     	<div className="profile-container_1">
//         	<div className="profile-picture-container">
//             <img
//               src="https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg"
//               alt="Profile"
//               className="profile-picture"
//             />
// 			</div>
// 			<div className="profile-info">
// 				<h2>Profile</h2>
// 				<br />
// 				<h3>Alf</h3>
// 				<h5 className="blue-underline">modifier</h5>
// 				<br />
// 				<h4>Rank 1 | Lvl 800</h4>
// 				<br />
// 				<h4>Email</h4>
// 				<h5 className="blue-underline">modifier</h5>
// 				<br />
// 				<h4>Password</h4>
// 				<h5 className="blue-underline">modifier</h5>
// 				<br />
// 				<h4>Double factors</h4>
//           </div>
//     	</div>
// 		<div className="profile-container_2">
//           <h2>Game History</h2>
//           <table className="game-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Score</th>
//                 <th>Date</th>
//                 <th>Result</th>
//               </tr>
//             </thead>
//             <tbody>
//               {gameHistory.map((game, index) => (
//                 <tr key={index}>
//                   <td>{game.name}</td>
//                   <td>{game.score}</td>
//                   <td>{game.date}</td>
//                   <td>{game.result}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
// 		</div>
// 		</div>
//     </PageWrapper>
//   );
// }

// export default Profile;