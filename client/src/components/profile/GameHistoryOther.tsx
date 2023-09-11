import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PageWrapper from "../navbar/pageWrapper";
//import '../../styles/GameHistory.css';
import { styled } from "@mui/system";
import { useOnlineStatus } from "../../context/OnlineStatus";
import tchoupi from '../../assets/tchoupi50x50.jpg'
import Miniature from "../miniature/Miniature";

interface User {
	email: string;
	hash:string;
	nickname: string;
}
interface UserIdProps {
   userId: number;
  }

const WinTableCell = styled(TableCell)(({ theme }) => ({
	color: "green",
	textDecoration: "none",
}));

const LossTableCell = styled(TableCell)(({ theme }) => ({
	color: "red",
	textDecoration: "none",
}));

const GameHistoryOther:React.FC<UserIdProps> = ({
	userId,}) =>{

	const axiosPrivate = useAxiosPrivate();
	const [gameHistory, setGameHistory] = useState([]);
	const [currentUser, setCurrentUser] = useState<any>();

	const onlineUsers = useOnlineStatus();
	console.log({onlineUsers});
	// console.log("userid props", userId);

	useEffect(() => { //fetch game data
		const findGamesByUserId = async () =>{
			try {
				const response = await axiosPrivate.get(`/games/findGamesByUserId/${userId}`, {
					headers: { 'Content-Type': 'application/json'},
						withCredentials: true
				})
				setGameHistory(response.data);
				console.log("all user's games", response.data); 
			} catch(error: any) {
				console.log(error.response);
			}
		}
		findGamesByUserId();
	}, [userId])

	// useEffect(() => { //Fetch current user data
	// 	const getCurrentUser = async () => { //definition de la fonction
	// 		try {
	// 			const response = await axiosPrivate.get('/users/me', {
	// 				headers: { 'Content-Type': 'application/json'},
	// 				withCredentials: true
	// 			})
	// 			setCurrentUser(response.data);
	// 		} catch (error:any) {
	// 			console.log(error.response );
	// 		}
	// 	}
	// 	getCurrentUser(); //appel de la fonction
	// }, [])


	return (
	 	<PageWrapper>
			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
			sx={{
				display: "flex",
				backgroundColor: "white",
				borderRadius: "20px",
				padding: "5vh",
				border: "2px solid black",
			}}
        >
          <Box sx={{ width: "100%" }}>
			<h1 className="typo-game"> Game History</h1>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
					<TableRow
						sx={{
							"& .MuiTableCell-root": { borderColor: "#FF79AF", borderWidth: 2 },
							"& .MuiTableRow-root": { borderColor: "#FF79AF", borderWidth: 2 },}}>
						<TableCell style={{ textAlign: 'center' }}>Name</TableCell>
						<TableCell style={{ textAlign: 'center' }}>Score</TableCell>
						<TableCell style={{ textAlign: 'center' }}>Date</TableCell>
						<TableCell style={{ textAlign: 'center' }}>Result</TableCell>
					</TableRow>
                </TableHead>
                {<TableBody> {
					gameHistory
					.slice(Math.max(gameHistory.length - 5, 0))
					.map((game:any, index) => {
					let adversaire;
					let my_score;
					let adv_score;
					const formattedTimestamp = game.createdAt
					? new Intl.DateTimeFormat("en-GB", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					  }).format(new Date(game.createdAt))
					: "";
					if (game.player_1_id === userId)
						adversaire = game.player_2;
					else
						adversaire = game.player_1;
					if(adversaire === game.player_2)
					{
						my_score = game.player_1_score;
						adv_score = game.player_2_score;
					}
					else
					{
						my_score = game.player_2_score;
						adv_score = game.player_1_score;
					}
					return (
						<TableRow
							key={index}
							sx={{
								"& .MuiTableCell-root": { borderColor: "#FF79AF", borderWidth: 2 },
								"& .MuiTableRow-root": { borderColor: "#FF79AF", borderWidth: 2 },}} >
						<TableCell style={{ textAlign: 'center' }}>
						<Miniature miniatureUser={{
							nickname: adversaire.nickname,
							id: adversaire.id,
							minAvatar: {
								url: `http://localhost:3333/public/picture/${adversaire.nickname}`,
								name: adversaire.nickname
							  }
						}}
						></Miniature>
							</TableCell>
						<TableCell style={{ textAlign: 'center' }}>{my_score} - {adv_score}</TableCell>
						<TableCell style={{ textAlign: 'center' }}>{formattedTimestamp}</TableCell>
						<TableCell style={{ textAlign: 'center'}}>
									{game.winnerId === 0 ? (
										"DRAWN GAME"
									) : game.winnerId === userId ?(
										<WinTableCell style={{ borderBottom: 'none', textAlign: 'center' }}>WIN</WinTableCell>
									) : (
										<LossTableCell style={{ borderBottom: 'none', textAlign: 'center' }}>LOSE</LossTableCell>
									)}
								
						</TableCell>
						</TableRow>
					)
				  })}
                </TableBody>}
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
	 	</PageWrapper>
	);
}

export default GameHistoryOther;