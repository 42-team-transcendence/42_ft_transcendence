import React, { useState, useContext, useEffect, ChangeEvent } from "react";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import PageWrapper from "../navbar/pageWrapper";
import GameHistory from "./GameHistory";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EmailModal from "./EmailModal"; 
import PwdModal from "./PasswordModal";
import AuthContext, { AuthProvider } from '../../context/AuthProvider';
import NickModal from "./NicknameModal";
import DoubleAuth from "../auth2fa/Doubleauth";
import { useOnlineStatus } from "../../context/OnlineStatus";

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/profile/Profile.css';
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

// =============================================================================
// INTERFACES ==================================================================
interface User {
	email: string;
	nickname: string;
	auth2fa: boolean;
	avatar: string;
	score: number;
	rank: number;
}

// =============================================================================
// FUNCTION ====================================================================

function Profile() {

	const axiosPrivate = useAxiosPrivate();
	const { auth, setAuth } = useContext(AuthContext);
	const onlineUsers = useOnlineStatus();
	const [currentUserId, setCurrentUserId] = useState("");

	// =============================================================================
	// USE EFFECT ==================================================================
	// const [user, setUser] = useState<any>();

	const [user, setUser] = useState<User>({ email: '', nickname: '', auth2fa: false, avatar: '', score: 0, rank: 0, });
    const [isDoubleAuthEnabled, setIsDoubleAuthEnabled] = useState(user.auth2fa || false);
	console.log({auth});
	const handleUserId = async() =>{
		const email = auth.email;
		try{
			const response = await axiosPrivate.get(`/auth/userByMail/${email}`, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
			  });
			  setCurrentUserId(response.data.id);
			  
			}catch (error){
				console.error(error)
			}	
	}
	handleUserId();
	console.log('user id', currentUserId);
	console.log('online users' , onlineUsers);
	// const isUserOnline = onlineUsers.includes(currentUserId);
	let isUserOnline = false;
	for (const online of onlineUsers.values()) {
		if (online.userId === currentUserId) {
			if(online.isOnline) {
				isUserOnline = true;
			}
			break;
		}
	}
	console.log({isUserOnline});

    useEffect(() => {
		
        // Make an API request to fetch user details
        axiosPrivate.get('/users/me')
            .then(response => {
                setUser(response.data);
				console.log("AUTH = " + response.data.auth2fa);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
			
    }, []);
	
	const updateUser = async () => {

		axiosPrivate.get('/')
		.then(response => {
			setUser(response.data);
		})
		.catch(error => {
			console.error('Error fetching user details:', error);
		});
	}

	const disabled2fa = async () => {
        const response = await axiosPrivate.post(
			'/users/update2fa',
			JSON.stringify({ auth2fa: false }),
			{
			  headers: { "Content-Type": "application/json" },
			  withCredentials: true,
			}
		)
	  };

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
			console.log("ici")
			const response = await axiosPrivate.post(
				'/users/email',
				JSON.stringify({ 'email': newEmail}),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					validateStatus: status => status >= 200 && status < 300,
				}
			);
			console.log("LA")
			console.log({response})
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
	// AVATAR ======================================================================
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			console.log("file = ", file);
		  	setSelectedFile(file);
			const formData = new FormData();
			formData.append('avatar', file);
			try {
				const response = await axiosPrivate.post('/users/uploadAvatar', formData, {
					headers: {'Content-Type': 'multipart/form-data'},
					withCredentials: true,
				});
			  	console.log("reponse avatar, ", {response});
				if (response.status === 200) {
					window.location.reload();
					setUser((prevUser) => ({ ...prevUser, avatar: response.data.avatarUrl }));
					console.log('Avatar update successful');
					console.log('Constructed image URL:', `${process.env.REACT_APP_BACKEND_URL}/public/picture/${user.nickname}`);

			  	} else {
					console.error('Avatar update failed');
			  	}
			} catch (error) {
				console.error('Error updating avatar:', error);
			}
	
		};
	}
	const StyledBadge = styled(Badge)(() => ({
		'& .MuiBadge-badge': {
		  backgroundColor: isUserOnline ? 'green' : 'grey',
		  color: isUserOnline ? 'green' : 'grey',
		  boxShadow: "0 0 0 2px white",
		  width: "20px",
		  height: "20px",
		  borderRadius: 10
		},
	}));
	

	// =============================================================================
	// RETURN ======================================================================

  	return (
		<PageWrapper>
			<div className="main-container">
				<div className="container-wrap">
					{/* Render AVATAR */}
					<div className="avatar">
						<StyledBadge
							overlap="circular"
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							variant="dot"
							invisible={!isUserOnline}>
							<label htmlFor="avatarInput">
								{/* <img
									width= "150px"
									className="img-profile"
									src={`http://localhost:3333/public/picture/${user.nickname}`}
								/> */}
								<Avatar sx={{ width: 180, height: 180, border: "2px solid black"  }}  variant="square" alt={user.nickname} src={`http://localhost:3333/public/picture/${user.nickname}`} />
							</label>
							<input
								type="file"
								id="avatarInput"
								style={{ display: 'none' }}
								accept="image/*"
								onChange={handleFileChange}
							/>
						</StyledBadge>
							<div className="avater-info">
								{user ? (
									<>
										<h1 className="name">{user.nickname}</h1>
										<span className="modifier" onClick={handleOpenNickModal}>modifier</span>
									</>
								) : (
									<p>Loading user data...</p>
								)}
							<p className="rank">Rank {user.rank} | Lvl {user.score}</p>
							</div>	
					</div>
					{/* Render EMAIL */}
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
					{/* Render PASSWORD */}
					{auth.pwd !== '' ? (
						<div className="element-profile">
							<h2>Password</h2>
							<div className="a-modifier">
							<p>{auth.pwd}</p>
							<span className="modifier" onClick={handleOpenPwdModal}>modifier</span>
							</div>
						</div>
					) : <div/>}
					{/* Render 2FA */}
					<div className="element-profile">
						<div className="a-modifier">
							<h2> Double factors </h2>
							{!user.auth2fa ? (
								<Checkbox checked={user.auth2fa} onChange={() =>
									setIsDoubleAuthEnabled(!isDoubleAuthEnabled) } 
								/>
							) : (
								<div>
									<button onClick={() => {disabled2fa() 
													setIsDoubleAuthEnabled(false)
													updateUser() }}
													>Disable 2FA</button>
								</div>
							)}
							{isDoubleAuthEnabled && <DoubleAuth/> }
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

