import React from "react";
import { useNavigate } from 'react-router-dom';


function Homepage() {

    const navigate = useNavigate();
    const from_leaderboard = "/leaderboard"; 

    const handleLeaderboard = () => {
        navigate(from_leaderboard, { replace: false});
    }

	return (
		<div>
		<h1> WELCOME TO PONG </h1>

		<label><u>Leaderboard </u> </label>
		<button onClick={handleLeaderboard}>Leaderboard</button>
		</div>
	)
}

export default Homepage;