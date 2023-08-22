import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import PageWrapper from "../navbar/pageWrapper";
import GameHistory from "./GameHistory";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EmailModal from "./EmailModal"; 
import PwdModal from "./PasswordModal";
import AuthContext, { AuthProvider } from '../../context/AuthProvider';
import NickModal from "./NicknameModal";

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/profile/Profile.css';
import Checkbox from '@mui/material/Checkbox';


// =============================================================================
// INTERFACES ==================================================================
interface PwdData {
	pwd: string;
}

interface User {
	email: string;
	hash:string;
	nickname: string;
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
	// USE EFFECT ==================================================================
	// const [user, setUser] = useState<any>();

	const [user, setUser] = useState<User>({ email: '', hash: '', nickname: '' });
    useEffect(() => {
        // Make an API request to fetch user details
        axiosPrivate.get('/users/me')
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, []);
	

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
			const response = await axiosPrivate.post(
				'/users/email',
				JSON.stringify({ email: newEmail }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					validateStatus: status => status >= 200 && status < 300,
				}
			);
			
			if (response.status === 200) {
				// Update the user's email in the user state
				setUser((prevUser) => ({ ...prevUser, email: newEmail }));
				setAuth((prevAuth) => ({ ...prevAuth, email: newEmail }))
				console.log("Email update successful");
			} 
			else {
				console.error("Email update failed");
			}
		} catch (error) {
			console.error("Error updating email:", error);
		}
	
		handleCloseEmailModal();
	};


	// =============================================================================
	// NICKNAME MODAL ==============================================================

	// State for controlling the email modal
	const [isNickModalOpen, setNickModalOpen] = useState(false);

	// Handler for opening the email modal
	const handleOpenNickModal = () => {
		setNickModalOpen(true);
	};

	// Handler for closing the email modal
	const handleCloseNickModal = () => {
		setNickModalOpen(false);
	};

	const handleSaveNick = async (newNickname: string) => {
		console.log("handle nick");
		try {
		  // Call your backend API to update the nickname
			const response = await axiosPrivate.post('/users/updateNick', JSON.stringify({ nickname: newNickname }), {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			console.log(`response.status = ${response.status}`);
			if (response.status === 200) {
				setUser((prevUser) => ({ ...prevUser, nickname: newNickname }));
				console.log('Nickname update successful');
			} else {
				console.error('Nickname update failed');
			}
		} catch (error) {
		  	console.error('Error updating Nickname:', error);
		}
	  
		handleCloseNickModal();
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

	
	// =============================================================================
	// RETURN ======================================================================
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
							{user ? (
								<>
									<h1 className="name">{user.nickname}</h1>
									<span className="modifier" onClick={handleOpenNickModal}>modifier</span>
								</>
							) : (
								<p>Loading user data...</p>
							)}
					
							<p className="rank"> Rank 1 | Lvl 800 </p>
						</div>
					</div>
					
					<div className="element-profile">
						<h2>Email</h2>
						<div className="a-modifier">
						{user ? (
                    	<>
                      	  	<p>{user.email}</p>
                        	<span className="modifier" onClick={handleOpenEmailModal}>modifier</span>
                    	</>
                ) : (
                    <p>Loading user data...</p>
                )}
						</div>
					</div>

					<div className="element-profile">
						<h2>Password</h2>
						<div className="a-modifier">
							<p>{auth.pwd}</p>
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

			{/* Render the PwdModal component */}
				<NickModal
				open={isNickModalOpen}
				onClose={handleCloseNickModal}
				onSave={handleSaveNick}
			/>
		</PageWrapper>
 	);
}

export default Profile;
