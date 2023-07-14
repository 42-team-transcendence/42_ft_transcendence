import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from "../navbar/Navbar";
//import HomepageStyle from '../../styles/HomepageStyle.css';
import CustomButton from "../../styles/buttons/CustomButton";


function Homepage() {

    const navigate = useNavigate();
    const from_leaderboard = "/leaderboard";
	const from_how_to_play = "/rules";
	const from_play = "/play";
	const profile = "/profile";
	const friend_list = "/friendlist";

	const handlePlay = () => {
		navigate(from_play, {replace: false});
	}
	
    const handleLeaderboard = () => {
        navigate(from_leaderboard, { replace: false});
    }


	const [showLinks, setShowLinks] = useState(false)

	const handleShowLinks = () => {
		setShowLinks(!showLinks)
	}


	const handleRules = () => {
		navigate(from_how_to_play, {replace: false});
	}

	
	return (
		<div className="column">
			<Navbar showLinks={showLinks} handleShowLinks={handleShowLinks}/>
			<div className="welcomeHome">
				<h1 className="welcome"> Welcome </h1>
				<h1 className="welcome"> to </h1>
				<h1 className="titleHomePage"> PONG </h1>
				<></>
			</div>
				<div className="ButtonHomePage">
        <div className={`${showLinks ? "hide_button" : "show_button"}`}>
					<CustomButton onClick={handlePlay}> PLAY </CustomButton>
					<CustomButton onClick={handleRules}> How to Play </CustomButton>
					<CustomButton onClick={handleLeaderboard}> Leaderboard </CustomButton>
          </div>
			</div>
		</div>
	)
}

export default Homepage;