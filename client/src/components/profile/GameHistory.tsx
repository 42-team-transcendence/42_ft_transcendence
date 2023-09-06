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

const WinTableCell = styled(TableCell)(({ theme }) => ({
	color: "green",
	textDecoration: "none",
  }));
  
  const LossTableCell = styled(TableCell)(({ theme }) => ({
	color: "red",
	textDecoration: "none",
  }));

function GameHistory() {

const axiosPrivate = useAxiosPrivate();
const [gameHistory, setGameHistory] = useState([]);
const [currentUser, setCurrentUser] = useState<any>();

const onlineUsers = useOnlineStatus();
console.log({onlineUsers});

useEffect(() => { //fetch game data
	console.log("coucou useEffect")
	const findAllMyGames = async () =>{
		try {
			const response = await axiosPrivate.get('/games/findAllMyGames', {
				headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
			})
			setGameHistory(response.data);
			console.log({findAllMyGames:response.data}); 
		} catch(error: any) {
			console.log(error.response);
		}
	}
	findAllMyGames();
  }, [])

  useEffect(() => { //Fetch current user data
	const getCurrentUser = async () => { //definition de la fonction
		try {
			const response = await axiosPrivate.get('/users/me', {
				headers: { 'Content-Type': 'application/json'},
				withCredentials: true
			})
			setCurrentUser(response.data);
		} catch (error:any) {
			console.log(error.response );
		}
	}
	getCurrentUser(); //appel de la fonction
}, [])


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
						<TableCell>Name</TableCell>
						<TableCell>Score</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Result</TableCell>
					</TableRow>
                </TableHead>
                {currentUser && <TableBody> {
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
					  console.log(`current user id = ${currentUser.id}`);
					if (game.player_1_id === currentUser.id)
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
					// Vérifier si l'adversaire est en ligne
    				const isAdversaireOnline = onlineUsers.includes(adversaire.id);
					return (
						<TableRow
							key={index}
							sx={{
								"& .MuiTableCell-root": { borderColor: "#FF79AF", borderWidth: 2 },
								"& .MuiTableRow-root": { borderColor: "#FF79AF", borderWidth: 2 },}} >
						<TableCell>
							{/* {adversaire.nickname} */}
							<div className={`status-indicator ${isAdversaireOnline ? 'online' : 'offline'}`} />
							<Miniature miniatureUser={{
							nickname: adversaire.nickname,
							id: adversaire.id,
							minAvatar: {url: tchoupi, name:'Tchoupi'}
						}}
						></Miniature>
							</TableCell>
						<TableCell>{my_score} - {adv_score}</TableCell>
						<TableCell>{formattedTimestamp}</TableCell>
						<TableCell>
									{game.winnerId === 0 ? (
										"DRAWN GAME"
									) : game.winnerId === currentUser.id ?(
										<WinTableCell>WIN</WinTableCell>
									) : (
										<LossTableCell>LOSE</LossTableCell>
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

export default GameHistory;

