import React, { useState, useContext } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PageWrapper from "../navbar/pageWrapper";
import '../../styles/Profile.css';
import GameHistory from "./GameHistory";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Checkbox from '@mui/material/Checkbox';
import EmailModal from "./EmailModal"; // Import the EmailModal component
import PwdModal from "./PasswordModal";
import AuthContext, { AuthProvider } from '../../context/AuthProvider';



// =============================================================================
// INTERFACES ==================================================================
interface EmailData {
	email: string;
}

interface PwdData {
	pwd: string;
}


// =============================================================================
// FUNCTION ====================================================================

function Profile() {
	// Sample game history data
	const gameHistory = [
		{ name: "User 1", score: 100, date: "2023-07-19", result: "Win" },
		{ name: "User 2", score: 150, date: "2023-07-20", result: "Loss" },
		{ name: "User 3", score: 120, date: "2023-07-21", result: "Win" },
	];

	const axiosPrivate = useAxiosPrivate();
	const { auth, setAuth } = useContext(AuthContext);

	// =============================================================================
	// EMAIL MODAL =================================================================

	// State for controlling the email modal
	const [isEmailModalOpen, setEmailModalOpen] = useState(false);

	// Handler for opening the email modal
	const handleOpenEmailModal = () => {
		setEmailModalOpen(true);
	};

	// Handler for closing the email modal
	const handleCloseEmailModal = () => {
		setEmailModalOpen(false);
	};

	const handleSaveEmail = async (newEmail: string) => {
		try {
			// Call your backend API to update the email
			const response = await axiosPrivate.post('/users/email',  JSON.stringify({ email: newEmail }),
			{
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
			});
		
			if (response.status === 200) {
				// Update the email in the auth state on successful API call
				setAuth((prevAuth) => ({ ...prevAuth, email: newEmail }));
				console.log("Email update successful");
			} else {
				console.error("Email update failed");
			}
		} catch (error) {
			console.error("Error updating email:", error);
		}
	
		handleCloseEmailModal();
	};

	// =============================================================================
	// PWD MODAL ===================================================================

	// State for controlling the email modal
	const [isPwdModalOpen, setPwdModalOpen] = useState(false);

	// Handler for opening the email modal
	const handleOpenPwdModal = () => {
		setPwdModalOpen(true);
	};
	
	// Handler for closing the email modal
	const handleClosePwdModal = () => {
		setPwdModalOpen(false);
	};

	const handleSavePwd = async (newPwd: string) => {
		try {
			const response = await axiosPrivate.post('/users/pwd',  JSON.stringify({ pwd: newPwd }),
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			if (response.status === 200) {
				setAuth((prevAuth) => ({ ...prevAuth, pwd: newPwd }));
				console.log('Pwd update successful');
			} else {
				console.error('Pwd update failed');
			}
		} catch (error) {
			console.error('Error updating Pwd:', error);
		}
	  
		handleClosePwdModal();
	  };

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
							<h1 className="name"> ALF </h1>
							<span className="modifier" onClick={handleOpenEmailModal}>modifier</span>	
							<p className="rank"> Rank 1 | Lvl 800</p>
						</div>
					</div>
					
					<div className="element-profile">
						<h2>Email</h2>
						<div className="a-modifier">
							<p> {auth.email}</p>
							<span className="modifier" onClick={handleOpenEmailModal}>modifier</span>
						</div>
					</div>

					<div className="element-profile">
						<h2>Password</h2>
						<div className="a-modifier">
							<p> {auth.pwd}</p>
							<span className="modifier"onClick={handleOpenPwdModal}>modifier</span>
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

			{/* Render the EmailModal component */}
			<EmailModal
				open={isEmailModalOpen}
				onClose={handleCloseEmailModal}
				onSave={handleSaveEmail}
			/>

			{/* Render the PwdModal component */}
			<PwdModal
				open={isPwdModalOpen}
				onClose={handleClosePwdModal}
				onSave={handleSavePwd}
			/>
		</PageWrapper>
 	);
}

export default Profile;
