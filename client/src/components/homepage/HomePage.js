import { useNavigate } from 'react-router-dom';
// import Leaderboard from "../leaderboard/Leaderboard";

function Homepage() {

    const navigate = useNavigate();
    const from_leaderboard = "/leaderboard"; 

    const handleLeaderboard = () => {
        navigate(from_leaderboard, { replace: false});
    }

	return (
		<div>
		<h1> WELCOME TO PONG </h1>

		<button onClick={handleLeaderboard}>Leaderboard</button>
		</div>
	)
}

export default Homepage;