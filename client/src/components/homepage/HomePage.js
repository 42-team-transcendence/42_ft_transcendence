import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from "../navbar/Navbar";
import HomepageStyle from '../../styles/HomepageStyle.css';
import CustomButton from "../../styles/buttons/CustomButton";


function Homepage() {

    const navigate = useNavigate();
    const from_leaderboard = "/leaderboard"; 

    const handleLeaderboard = () => {
        navigate(from_leaderboard, { replace: false});
    }


	return (
		<div className="column">
			<Navbar/>
			<div className="backgroundTop">
				<div className="welcomeHome">
					<h1 className="welcome"> Welcome </h1>
					<h1 className="welcome"> to </h1>
					<h1 className="titleHomePage"> PONG </h1>
				</div>
			</div>
		
			<div className="backgroundBottom">
			<div className="ButtonHomePage ">
					<CustomButton > PLAY </CustomButton>
					<CustomButton > How to Play </CustomButton>
					<CustomButton onClick={handleLeaderboard}> Leaderboard </CustomButton>
				</div>
			</div>
		</div>
	)
}

export default Homepage;