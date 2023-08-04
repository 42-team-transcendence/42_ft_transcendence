import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PageWrapper from "../navbar/pageWrapper";
import '../../styles/Profile.css';
import GameHistory from "./GameHistory";

import Checkbox from '@mui/material/Checkbox';

function Profile() {
  // Sample game history data
  const gameHistory = [
    { name: "User 1", score: 100, date: "2023-07-19", result: "Win" },
    { name: "User 2", score: 150, date: "2023-07-20", result: "Loss" },
    { name: "User 3", score: 120, date: "2023-07-21", result: "Win" },
  ];

  return (
    <PageWrapper>
		<div className="main-container">
			<div className="container-wrap">
				<div className="avatar">
					<img 
						className="img-profile"
						src="https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg"
						alt="image du profile"
					/>
					<div className="avater-info">
						<h1 className="name">Alf</h1>
						<span className="modifier"> modifier </span>	
						<p className="rank"> Rank 1 | Lvl 800</p>
					</div>
				</div>
			
				<div className="element-profile">
					<h2>Email</h2>
					<div className="a-modifier">
						<p> aaaaaaaaa@222222222.fr</p>
						<span className="modifier"> modifier </span>
					</div>
				</div>

				<div className="element-profile">
					<h2>Password</h2>
					<div className="a-modifier">
						<p> ########</p>
						<span className="modifier"> modifier </span>
					</div>
				</div>

				<div className="element-profile">
					<div className="a-modifier">
						<h2> Double factors </h2>
						<Checkbox />
					</div>
				</div>
		
			</div>
			<GameHistory/>
		</div>
    </PageWrapper>
  );
}

export default Profile;


