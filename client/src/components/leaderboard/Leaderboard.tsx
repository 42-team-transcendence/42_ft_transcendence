
import Miniature from "../miniature/Miniature";
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PageWrapper from "../navbar/pageWrapper";
import Logout from "../logout/Logout";
import { Box, Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";
// import { useOnlineStatus } from "../../context/OnlineStatus";
import '../../styles/Leaderboard.css';

function Leaderboard() {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState<
    { id: number; nickname: string; rank: number; score: number; }[]
  >([]);
  // const onlineUsers = useOnlineStatus();
  // console.log('online users' , onlineUsers);

  useEffect(() => {
    const fetchUsersdData = async () => {
      try {

        const usersResponse = await axiosPrivate.get("/users", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

	  	  console.log("RESPONSE USERS == ", usersResponse.data);
        const sortedUser = usersResponse.data;
        sortedUser.sort((a: any, b: any) => b.score - a.score);
        setUsers(sortedUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsersdData();
  }, []);

return (
  <PageWrapper>
   
    <Box sx={{
				display: "flex",
        flexDirection: "column",
				backgroundColor: "white",
				borderRadius: "20px",
				padding: "5vh",
				border: "2px solid black",
		}}>
      <div className="leader-flex">
      <h1 className="typo-game">Leaderboard</h1>
      <div>
        <Paper component={Table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'center' }}>Rank</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Miniature
                    miniatureUser={{
                      nickname: user.nickname,
                      id: user.id,
                      minAvatar: {
                        url: `http://localhost:3333/public/picture/${user.nickname}`,
                        name: user.nickname
                      }
                    }}
                  ></Miniature>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{user.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Paper>
      </div>
      </div>
    </Box>
   
  </PageWrapper>
);
}

export default Leaderboard;



//   return (
//     <PageWrapper>
//       <Box>
//         <h1>Leaderboard</h1>
// 		<div>
//         <Table component={Paper}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Rank</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Score</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user, index) => (
//               <TableRow key={index}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>
// 					<Miniature miniatureUser={{
// 					nickname: user.nickname,
// 					id: user.id,
// 					minAvatar: {url: `http://localhost:3333/public/picture/${user.nickname}`, name: user.nickname}
// 				}}
// 				></Miniature>
// 					</TableCell>
//                 <TableCell>{user.score}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
// 		</div>
//         <Logout />
//       </Box>
//     </PageWrapper>
//   );
// }
