import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import Navbar from "../navbar/Navbar";

// =============================================================================
// IMPORT STYLES ===============================================================
import  "../../styles/HomepageStyle.css";
import CustomButton from "../../styles/buttons/CustomButton";

// =============================================================================
// FUNCTION ====================================================================

const Homepage: React.FC = () => {
	const navigate = useNavigate();
	const from_leaderboard = "/leaderboard"; 
	const from_how_to_play = "/rules";
	const from_play = "/play";

    const handlePlay = () => {
        navigate(from_play, { replace: false });
    }

    const handleLeaderboard = () => {
        navigate(from_leaderboard, { replace: false });
    }

    const handleRules = () => {
        navigate(from_how_to_play, { replace: false });
    }

    const [showLinks, setShowLinks] = useState(false)
    const handleShowLinks = () => {
        setShowLinks(!showLinks)
    }

    return (
        <div className="homepage-column">
            <Navbar showLinks={showLinks} handleShowLinks={handleShowLinks} />
            <div className="backgroundTop">
                <div className="welcomeHome">
                    <h1 className="welcome"> Welcome </h1>
                    <h1 className="welcome"> to </h1>
                    <h1 className="titleHomePage"> PONG </h1>
                </div>
            </div>

            {!showLinks && (
                <div className="show_button">
                    <CustomButton onClick={handlePlay}> PLAY </CustomButton>
                    <CustomButton onClick={handleRules}> How to Play </CustomButton>
                    <CustomButton onClick={handleLeaderboard}> Leaderboard </CustomButton>
                </div>
            )}
        </div>
    )
}

export default Homepage;
